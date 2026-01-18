/**
 * Victor - Agent IA de rédaction académique
 *
 * Utilise le SDK Anthropic pour assister Alexandre
 * dans la rédaction de son mémoire DEC.
 *
 * Les prompts sont chargés depuis Supabase avec fallback local.
 */

import Anthropic from '@anthropic-ai/sdk';
import type {
  VictorSkill,
  AgentContext,
  AgentResponse,
  StreamEvent,
  AgentOptions,
} from '../types.js';
import { buildVictorPrompt, SKILL_TOOLS as LOCAL_SKILL_TOOLS } from './prompts.js';
import { getPrompt } from '../../services/prompts.js';

// Client Anthropic (utilise ANTHROPIC_API_KEY de l'environnement)
const anthropic = new Anthropic();

// Configuration des outils par défaut (fallback)
const DEFAULT_SKILL_TOOLS: Record<VictorSkill, string[]> = LOCAL_SKILL_TOOLS;

// Modèle à utiliser (Opus 4.5 pour la meilleure qualité)
const MODEL = 'claude-opus-4-5-20251101';

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
 * Exécute une requête Victor avec le SDK Anthropic
 */
export async function runVictor(
  skill: VictorSkill,
  message: string,
  context: AgentContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  options?: AgentOptions
): Promise<AgentResponse> {
  try {
    // Récupérer la configuration du prompt (Supabase ou local)
    const { systemPrompt } = await getPromptConfig(skill, context);

    // Construire les messages
    const messages: Anthropic.MessageParam[] = [];

    // Ajouter l'historique de conversation
    for (const msg of conversationHistory.slice(-6)) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Ajouter le nouveau message
    messages.push({
      role: 'user',
      content: message,
    });

    // Construire les options de la requête
    const requestOptions: Anthropic.MessageCreateParamsNonStreaming = {
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    };

    // Ajouter web_search natif si activé (pattern officiel Anthropic)
    // Ref: https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-search-tool
    if (options?.webSearch) {
      console.log('[Victor] Web Search activé (tool natif Anthropic)');
      (requestOptions as any).tools = [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 5, // Limite les recherches par requête
        }
      ];
    }

    // Ajouter extended thinking si activé (pattern officiel Anthropic)
    // Ref: https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
    if (options?.extendedThinking) {
      const budgetTokens = Math.max(1024, options.thinkingBudget || 10000); // Min 1024
      console.log(`[Victor] Extended Thinking activé (budget: ${budgetTokens})`);
      (requestOptions as any).thinking = {
        type: 'enabled',
        budget_tokens: budgetTokens,
      };
      // Extended thinking nécessite plus de tokens en sortie
      requestOptions.max_tokens = Math.max(16000, budgetTokens + 4096);
    }

    // Ajouter Skills API si activé (beta)
    // Ref: https://docs.anthropic.com/en/docs/agents-and-tools/skills
    const hasSkills = options?.skills && options.skills.length > 0;
    const needsCodeExecution = hasSkills || options?.codeExecution;

    if (needsCodeExecution) {
      console.log('[Victor] Code Execution activé');
      // Ajouter le tool code_execution
      const existingTools = (requestOptions as any).tools || [];
      (requestOptions as any).tools = [
        ...existingTools,
        {
          type: 'code_execution_20250522',
          name: 'code_execution',
        }
      ];
    }

    if (hasSkills) {
      console.log(`[Victor] Skills activées: ${options!.skills!.map(s => s.skill_id).join(', ')}`);
      // Formater les skills pour l'API
      const formattedSkills = options!.skills!.map(skill => ({
        type: skill.type,
        skill_id: skill.skill_id,
        version: skill.version || 'latest',
      }));

      // Ajouter le container avec les skills
      (requestOptions as any).container = {
        skills: formattedSkills,
      };
    }

    // Déterminer si on utilise l'API beta ou standard
    const useBetaAPI = hasSkills || needsCodeExecution;

    // Appeler l'API Claude
    // Note: Avec web_search natif, Anthropic exécute les recherches automatiquement
    // et renvoie la réponse finale avec les citations
    let response: Anthropic.Message;

    if (useBetaAPI) {
      // Utiliser l'API beta pour les skills et code_execution
      // Ref: https://docs.anthropic.com/en/docs/agents-and-tools/skills
      console.log('[Victor] Utilisation API beta (skills/code_execution)');
      response = await anthropic.beta.messages.create({
        ...requestOptions,
        betas: ['code-execution-2025-05-22', 'skills-2025-01-24'],
      } as any);
    } else {
      response = await anthropic.messages.create(requestOptions);
    }
    let responseText = '';
    const totalInputTokens = response.usage.input_tokens;
    const totalOutputTokens = response.usage.output_tokens;

    // Log si extended thinking a été utilisé
    if (options?.extendedThinking) {
      const thinkingBlocks = response.content.filter(
        (block: any) => block.type === 'thinking'
      );
      if (thinkingBlocks.length > 0) {
        console.log(`[Victor] Thinking blocks: ${thinkingBlocks.length}`);
      }
    }

    // Extraire le texte de la réponse (ignore les thinking blocks)
    for (const block of response.content) {
      if (block.type === 'text') {
        responseText += block.text;
      }
    }

    // Log des citations web si présentes
    const citations = (response as any).citations;
    if (citations && citations.length > 0) {
      console.log(`[Victor] Citations web: ${citations.length} sources`);
    }

    return {
      success: true,
      message: responseText || 'Aucune réponse générée.',
      agentType: 'victor',
      skill,
      usage: {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
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
    const { systemPrompt } = await getPromptConfig(skill, context);

    // Construire les messages
    const messages: Anthropic.MessageParam[] = [];

    // Ajouter l'historique de conversation
    for (const msg of conversationHistory.slice(-6)) {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    // Ajouter le nouveau message
    messages.push({
      role: 'user',
      content: message,
    });

    // Appeler l'API Claude en streaming
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        const delta = event.delta;
        if ('text' in delta) {
          yield { type: 'text', content: delta.text };
        }
      }
    }

    yield { type: 'done' };
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
