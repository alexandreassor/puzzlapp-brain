/**
 * Types communs pour les agents PuzzlApp Brain
 */

// Types de compétences (skills)
export type VictorSkill =
  | 'redaction'
  | 'recherche'
  | 'acquisition'
  | 'plan'
  | 'bibliographie'
  | 'critique';

export type LeoSkill =
  | 'guide'
  | 'recommandation'
  | 'coaching'
  | 'diagnostic';

export type SophieSkill =
  | 'decouverte'
  | 'proposition'
  | 'negociation'
  | 'closing';

export type AgentType = 'victor' | 'leo' | 'sophie' | 'marc';

// Message dans une conversation
export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  skill?: string;
  toolCalls?: ToolCall[];
  metadata?: Record<string, unknown>;
}

// Appel d'outil
export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
  status: 'pending' | 'success' | 'error';
}

// Contexte d'une requête agent
export interface AgentContext {
  userId: string;
  sessionId?: string;
  // Contexte Victor (admin)
  sectionId?: string;
  sectionTitle?: string;
  chapterId?: string;
  chapterTitle?: string;
  // Contexte Léo (lecteur)
  parcoursId?: string;
  parcoursName?: string;
  instanceId?: string;
  // Contexte Sophie (avant-vente)
  prospectId?: string;
  // Données additionnelles
  additionalContext?: Record<string, unknown>;
}

// Requête vers un agent
export interface AgentRequest {
  agentType: AgentType;
  skill?: string;
  message: string;
  context: AgentContext;
  conversationHistory?: AgentMessage[];
  stream?: boolean;
}

// Réponse d'un agent
export interface AgentResponse {
  success: boolean;
  message: string;
  agentType: AgentType;
  skill?: string;
  toolCalls?: ToolCall[];
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  error?: string;
}

// Configuration d'un agent
export interface AgentConfig {
  name: string;
  type: AgentType;
  description: string;
  systemPrompt: string;
  skills: string[];
  allowedTools: string[];
  mcpServers?: string[];
}

// Événement de streaming
export interface StreamEvent {
  type: 'text' | 'tool_use' | 'tool_result' | 'done' | 'error';
  content?: string;
  toolCall?: ToolCall;
  error?: string;
}
