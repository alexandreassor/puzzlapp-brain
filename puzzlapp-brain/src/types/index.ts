/**
 * Types partagés entre les instances Admin et Lecteur
 *
 * ⚠️  FICHIER CRITIQUE - Coordination requise entre instances
 *     Ne pas supprimer de types, seulement ajouter
 */

// =============================================================================
// CONTENU (utilisé par Admin et Lecteur)
// =============================================================================

export interface Chapter {
  id: string;
  order: number;
  title: string;
  status: 'draft' | 'review' | 'published';
  created_at: string;
  updated_at?: string;
}

export interface Section {
  id: string;
  chapter_id: string;
  order: number;
  title: string;
  content_md: string;
  created_at: string;
  updated_at?: string;
}

export interface ChapterWithSections extends Chapter {
  sections: Section[];
}

// =============================================================================
// PARCOURS (utilisé par Lecteur, créé par Admin)
// =============================================================================

export type AgentType = 'leo' | 'sophie' | 'marc';

export interface Parcours {
  id: string;
  name: string;
  description?: string;
  agent_type: AgentType | null;
  sections: string[]; // IDs des sections
  created_at: string;
}

// =============================================================================
// PROGRESSION (utilisé par Lecteur)
// =============================================================================

export interface UserParcours {
  id: string;
  user_id: string;
  parcours_id: string;
  started_at: string;
  completed_at?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  section_id: string;
  completed_at: string;
}

export interface ParcoursWithProgress extends Parcours {
  progress: number; // 0-100
  sectionsCompleted: number;
  totalSections: number;
}

// =============================================================================
// JEUX (utilisé par Lecteur, configuré par Admin)
// =============================================================================

export type GameType =
  | 'diagnostic'
  | 'persona'
  | 'empathy-map'
  | 'swot'
  | 'roadmap'
  | 'quiz';

export interface GameConfig {
  questions?: GameQuestion[];
  fields?: GameField[];
  options?: Record<string, unknown>;
}

export interface GameQuestion {
  id: string;
  text: string;
  type: 'scale' | 'choice' | 'text';
  options?: string[];
  min?: number;
  max?: number;
}

export interface GameField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
}

export interface Game {
  id: string;
  section_id: string;
  type: GameType;
  title: string;
  description?: string;
  config: GameConfig;
  created_at: string;
}

export interface GameResult {
  id: string;
  user_id: string;
  game_id: string;
  data: Record<string, unknown>;
  score?: number;
  completed_at: string;
}

// =============================================================================
// LIVRABLES (utilisé par Lecteur)
// =============================================================================

export type DeliverableType =
  | 'diagnostic-report'
  | 'persona-card'
  | 'empathy-map'
  | 'swot-matrix'
  | 'roadmap'
  | 'action-plan';

export interface Deliverable {
  id: string;
  user_id: string;
  type: DeliverableType;
  title: string;
  content: Record<string, unknown>;
  created_at: string;
}

// =============================================================================
// AGENTS (Phase 4 - futur)
// =============================================================================

export interface AgentConversation {
  id: string;
  user_id: string;
  agent_type: AgentType;
  messages: AgentMessage[];
  created_at: string;
  updated_at?: string;
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// =============================================================================
// CABINETS (utilisé par Auth)
// =============================================================================

export interface Cabinet {
  id: string;
  name: string;
  siren?: string;
  data_json?: Record<string, unknown>;
  created_at: string;
}

// =============================================================================
// PROFILES (utilisé par Auth)
// =============================================================================

export type UserRole = 'admin' | 'reader';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  cabinet_id?: string;
  created_at: string;
}

export interface ProfileWithCabinet extends Profile {
  cabinet?: Cabinet;
}

// =============================================================================
// NOTION INTEGRATION (Phase 6 - BYON)
// =============================================================================

export * from './notion';
