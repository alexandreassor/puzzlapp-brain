import { useState, useEffect, useCallback } from 'react';
import { X, Bot, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { VictorSkillButtons } from './VictorSkillButtons';
import { VictorChat } from './VictorChat';
import { VictorSettings, DEFAULT_VICTOR_OPTIONS, type VictorOptions } from './VictorSettings';
import { agentsService } from '@/services/agents';
import type {
  VictorSkill,
  VictorMessage,
  VictorConversation,
} from '@/types/victor';
import type { Chapter, Section } from '@/types';

// Configuration de l'API Victor
// Utiliser VITE_AGENTS_SERVER_URL pour le serveur d'agents (recommandé)
// Fallback vers l'Edge Function Supabase si non défini
const AGENTS_SERVER_URL = import.meta.env.VITE_AGENTS_SERVER_URL || 'http://localhost:3001';
const USE_AGENTS_SERVER = import.meta.env.VITE_USE_AGENTS_SERVER !== 'false'; // true par défaut

// URLs des deux backends possibles
const VICTOR_EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/victor`;
const VICTOR_AGENTS_API_URL = `${AGENTS_SERVER_URL}/api/agents/query`;

interface VictorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentSection?: Section;
  currentChapter?: Chapter;
  onInsertToEditor?: (content: string) => void;
}

export function VictorPanel({
  isOpen,
  onClose,
  userId,
  currentSection,
  currentChapter,
  onInsertToEditor,
}: VictorPanelProps) {
  const [activeSkill, setActiveSkill] = useState<VictorSkill>('redaction');
  const [conversation, setConversation] = useState<VictorConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [options, setOptions] = useState<VictorOptions>(DEFAULT_VICTOR_OPTIONS);

  // Load or create conversation on mount
  useEffect(() => {
    if (!isOpen || !userId) return;

    const initConversation = async () => {
      try {
        setIsInitializing(true);
        const conv = await agentsService.getOrCreateConversation(userId);
        setConversation(conv);
      } catch (error) {
        console.error('[Victor] Error initializing conversation:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initConversation();
  }, [isOpen, userId]);

  // Handle sending a message
  const handleSendMessage = useCallback(async (content: string) => {
    if (!conversation || isLoading) return;

    setIsLoading(true);

    try {
      // Add user message
      const userMessage: Omit<VictorMessage, 'id' | 'timestamp'> = {
        role: 'user',
        content,
        skill: activeSkill,
        metadata: {
          sectionId: currentSection?.id,
          chapterId: currentChapter?.id,
        },
      };

      const updatedConv = await agentsService.addMessage(conversation.id, userMessage);
      setConversation(updatedConv);

      // Call Victor Edge Function
      const aiResponse = await callVictorAPI(
        activeSkill,
        content,
        conversation.messages,
        currentSection?.title,
        currentChapter?.title,
        options
      );

      // Add assistant response to conversation
      await agentsService.addMessage(conversation.id, {
        role: 'assistant',
        content: aiResponse,
        skill: activeSkill,
      });

      // Refresh conversation to get the AI response
      const finalConv = await agentsService.getConversationById(conversation.id);
      if (finalConv) {
        setConversation(finalConv);
      }
    } catch (error) {
      console.error('[Victor] Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [conversation, isLoading, activeSkill, currentSection, currentChapter, options]);

  // Clear conversation
  const handleClearConversation = useCallback(async () => {
    if (!conversation) return;

    try {
      const cleared = await agentsService.clearMessages(conversation.id);
      setConversation(cleared);
    } catch (error) {
      console.error('[Victor] Error clearing conversation:', error);
    }
  }, [conversation]);

  // Build section context for chat
  const sectionContext = currentSection
    ? {
        title: currentSection.title,
        chapterTitle: currentChapter?.title,
      }
    : undefined;

  return (
    <div
      className={cn(
        'fixed top-0 right-0 h-full w-[350px] bg-background border-l shadow-lg z-50',
        'transform transition-transform duration-300 ease-in-out flex flex-col',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
            <Bot className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Victor</h3>
            <p className="text-xs text-muted-foreground">Agent IA Rédaction</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClearConversation}
            title="Nouvelle conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Skill buttons */}
      <VictorSkillButtons
        activeSkill={activeSkill}
        onSkillChange={setActiveSkill}
        disabled={isLoading}
      />

      {/* Settings */}
      <VictorSettings
        options={options}
        onChange={setOptions}
        disabled={isLoading}
      />

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        {isInitializing ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span className="text-sm">Chargement...</span>
          </div>
        ) : (
          <VictorChat
            messages={conversation?.messages || []}
            activeSkill={activeSkill}
            isLoading={isLoading}
            sectionContext={sectionContext}
            onSendMessage={handleSendMessage}
            onInsertToEditor={onInsertToEditor}
          />
        )}
      </div>
    </div>
  );
}

// Appelle le serveur d'agents ou l'Edge Function Victor
async function callVictorAPI(
  skill: VictorSkill,
  message: string,
  conversationHistory: VictorMessage[],
  sectionTitle?: string,
  chapterTitle?: string,
  options?: VictorOptions
): Promise<string> {
  try {
    // Préparer l'historique de conversation (derniers 10 messages max)
    const history = conversationHistory
      .slice(-10)
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    if (USE_AGENTS_SERVER) {
      // === SERVEUR D'AGENTS (Claude Agent SDK) ===
      console.log('[Victor] Using Agents Server:', VICTOR_AGENTS_API_URL);

      const response = await fetch(VICTOR_AGENTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentType: 'victor',
          skill,
          message,
          context: {
            sectionTitle,
            chapterTitle,
          },
          conversationHistory: history,
          options: options ? {
            webSearch: options.webSearch,
            extendedThinking: options.extendedThinking,
            thinkingBudget: options.thinkingBudget,
            skills: options.skills,
            codeExecution: options.codeExecution,
          } : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur serveur agents: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      return data.message;
    } else {
      // === EDGE FUNCTION SUPABASE (fallback) ===
      console.log('[Victor] Using Edge Function:', VICTOR_EDGE_FUNCTION_URL);

      // Récupérer le token d'authentification
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('Non authentifié - veuillez vous reconnecter');
      }

      const response = await fetch(VICTOR_EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          skill,
          message,
          conversationHistory: history,
          context: {
            sectionTitle,
            chapterTitle,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur serveur: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Erreur inconnue');
      }

      return data.message;
    }
  } catch (error) {
    console.error('[Victor] API Error:', error);

    // Message d'erreur user-friendly
    if (error instanceof Error) {
      if (error.message.includes('ANTHROPIC_API_KEY')) {
        return `**Erreur de configuration**\n\nLa clé API Anthropic n'est pas configurée. Vérifiez la configuration du serveur d'agents.`;
      }
      if (error.message.includes('Non authentifié')) {
        return `**Session expirée**\n\nVeuillez vous reconnecter pour continuer à utiliser Victor.`;
      }
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        return `**Erreur de connexion**\n\nImpossible de joindre le serveur Victor. Vérifiez que le serveur d'agents est démarré sur ${AGENTS_SERVER_URL}.`;
      }
      return `**Erreur**\n\n${error.message}`;
    }

    return `**Erreur inattendue**\n\nUne erreur s'est produite lors de la communication avec Victor. Veuillez réessayer.`;
  }
}
