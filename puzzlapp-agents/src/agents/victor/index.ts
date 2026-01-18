/**
 * Victor - Agent IA de rédaction académique
 *
 * Utilise le Claude Agent SDK pour assister Alexandre
 * dans la rédaction de son mémoire DEC.
 *
 * Les prompts sont chargés depuis Supabase avec fallback local.
 */

import { query } from '@anthropic-ai/claude-agent-sdk';
import type {
  VictorSkill,
  AgentContext,
  AgentResponse,
  StreamEvent,
} from '../types.js';
import { buildVictorPrompt, SKILL_TOOLS as LOCAL_SKILL_TOOLS } from './prompts.js';
import { getPrompt, type AgentPrompt } from '../../services/prompts.js';

// Type pour les options de l'agent (basé sur la doc SDK)
interface AgentOptions {
  systemPrompt?: string;
  allowedTools?: string[];
  permissionMode?: 'default' | 'acceptEdits' | 'bypassPermissions';
  maxTurns?: number;
}

// Configuration des outils par défaut (fallback)
const DEFAULT_SKILL_TOOLS: Record<VictorSkill, string[]> = LOCAL_SKILL_TOOLS;

/**
 * Récupère le prompt et les outils depuis Supabase ou fallback local
 */
async function getPromptConfig(
  skill: VictorSkill,
  context: AgentContext
): Promise<{ systemPrompt: string; allowedTools: string[]; maxTurns: number }> {
  // Essayer de récupérer depuis Supabase
  const dbPrompt = await getPrompt('victor', skill);

  if (dbPrompt) {
    console.log(`[Victor] Prompt chargé depuis Supabase: ${dbPrompt.name}`);

    // Ajouter le contexte actuel au prompt
    let systemPrompt = dbPrompt.system_prompt;
    if (context.sectionTitle || context.chapterTitle) {
      systemPrompt += `\n\n## Contexte actuel`;
      if (context.chapterTitle) {
        systemPrompt += `\n- **Chapitre** : ${context.chapterTitle}`;
      }
      if (context.sectionTitle) {
        systemPrompt += `\n- **Section** : ${context.sectionTitle}`;
      }
    }

    return {
      systemPrompt,
      allowedTools: dbPrompt.allowed_tools || DEFAULT_SKILL_TOOLS[skill],
      maxTurns: dbPrompt.max_turns || 10,
    };
  }

  // Fallback vers les prompts locaux
  console.log(`[Victor] Fallback prompt local pour skill: ${skill}`);
  return {
    systemPrompt: buildVictorPrompt(skill, {
      sectionTitle: context.sectionTitle,
      chapterTitle: context.chapterTitle,
    }),
    allowedTools: DEFAULT_SKILL_TOOLS[skill],
    maxTurns: 10,
  };
}

/**
 * Exécute une requête Victor avec le SDK Agent
 */
export async function runVictor(
  skill: VictorSkill,
  message: string,
  context: AgentContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<AgentResponse> {
  try {
    // Récupérer la configuration du prompt (Supabase ou local)
    const { systemPrompt, allowedTools, maxTurns } = await getPromptConfig(skill, context);

    // Construire le message complet avec historique
    let fullMessage = message;
    if (conversationHistory.length > 0) {
      const historyText = conversationHistory
        .slice(-6) // Garder les 6 derniers messages
        .map((m) => `${m.role === 'user' ? 'Alexandre' : 'Victor'}: ${m.content}`)
        .join('\n\n');
      fullMessage = `## Historique récent\n${historyText}\n\n## Nouvelle demande\n${message}`;
    }

    // Options de l'agent
    const options: AgentOptions = {
      systemPrompt,
      allowedTools,
      permissionMode: 'acceptEdits', // Auto-approve pour les opérations de lecture
      maxTurns,
    };

    // Collecter la réponse
    let responseText = '';
    let inputTokens = 0;
    let outputTokens = 0;

    // Exécuter l'agent
    for await (const event of query({
      prompt: fullMessage,
      options,
    })) {
      if (event.type === 'assistant' && event.message?.content) {
        for (const block of event.message.content) {
          if ('text' in block) {
            responseText += block.text;
          }
        }
        // Récupérer l'usage si disponible
        if (event.message.usage) {
          inputTokens = event.message.usage.input_tokens || 0;
          outputTokens = event.message.usage.output_tokens || 0;
        }
      }
    }

    return {
      success: true,
      message: responseText || 'Aucune réponse générée.',
      agentType: 'victor',
      skill,
      usage: {
        inputTokens,
        outputTokens,
      },
    };
  } catch (error) {
    console.error('[Victor] Error:', error);
    return {
      success: false,
      message: '',
      agentType: 'victor',
      skill,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Exécute Victor en mode streaming (pour réponses en temps réel)
 */
export async function* runVictorStream(
  skill: VictorSkill,
  message: string,
  context: AgentContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): AsyncGenerator<StreamEvent> {
  try {
    // Récupérer la configuration du prompt (Supabase ou local)
    const { systemPrompt, allowedTools, maxTurns } = await getPromptConfig(skill, context);

    let fullMessage = message;
    if (conversationHistory.length > 0) {
      const historyText = conversationHistory
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'Alexandre' : 'Victor'}: ${m.content}`)
        .join('\n\n');
      fullMessage = `## Historique récent\n${historyText}\n\n## Nouvelle demande\n${message}`;
    }

    const options: AgentOptions = {
      systemPrompt,
      allowedTools,
      permissionMode: 'acceptEdits',
      maxTurns,
    };

    for await (const event of query({
      prompt: fullMessage,
      options,
    })) {
      if (event.type === 'assistant' && event.message?.content) {
        for (const block of event.message.content) {
          if ('text' in block) {
            yield { type: 'text', content: block.text };
          } else if ('name' in block) {
            yield {
              type: 'tool_use',
              toolCall: {
                id: block.id || '',
                name: block.name,
                input: block.input as Record<string, unknown>,
                status: 'pending',
              },
            };
          }
        }
      } else if (event.type === 'result') {
        yield { type: 'done' };
      }
    }
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

/**
 * Configuration de l'agent Victor
 */
export const VICTOR_CONFIG = {
  name: 'Victor',
  type: 'victor' as const,
  description: 'Agent IA de rédaction académique pour le mémoire DEC',
  skills: ['redaction', 'recherche', 'acquisition', 'plan', 'bibliographie', 'critique'],
  defaultSkill: 'redaction',
};
