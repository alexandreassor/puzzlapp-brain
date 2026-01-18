/**
 * Types pour Victor - Agent IA Rédaction
 *
 * Victor assiste Alexandre dans la rédaction du mémoire DEC
 * avec 6 compétences spécialisées.
 */

import type { Chapter, Section } from './index';

// =============================================================================
// COMPÉTENCES VICTOR
// =============================================================================

export type VictorSkill =
  | 'redaction'
  | 'recherche'
  | 'acquisition'
  | 'plan'
  | 'bibliographie'
  | 'critique';

export interface VictorSkillConfig {
  id: VictorSkill;
  label: string;
  color: string;
  bgColor: string;
  description: string;
  icon: string; // Lucide icon name
}

export const VICTOR_SKILLS: VictorSkillConfig[] = [
  {
    id: 'redaction',
    label: 'Rédaction',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Génère contenu, reformule, complète',
    icon: 'Pen',
  },
  {
    id: 'recherche',
    label: 'Recherche',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Web search, trouve infos, enrichit',
    icon: 'Search',
  },
  {
    id: 'acquisition',
    label: 'Acquisition',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Capture connaissances, extrait de docs',
    icon: 'Download',
  },
  {
    id: 'plan',
    label: 'Plan',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Structure, outline, réorganise',
    icon: 'LayoutList',
  },
  {
    id: 'bibliographie',
    label: 'Bibliographie',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    description: 'Gère sources, citations, références',
    icon: 'BookOpen',
  },
  {
    id: 'critique',
    label: 'Critique',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    description: 'Review, cohérence, suggestions',
    icon: 'MessageSquareWarning',
  },
];

// =============================================================================
// MESSAGES & CONVERSATIONS
// =============================================================================

export interface VictorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  skill?: VictorSkill;
  metadata?: {
    sectionId?: string;
    chapterId?: string;
    sourceIds?: string[];
  };
}

export interface VictorConversation {
  id: string;
  user_id: string;
  agent_type: 'victor';
  messages: VictorMessage[];
  created_at: string;
  updated_at: string;
}

// =============================================================================
// CONTEXTE VICTOR
// =============================================================================

export interface VictorContext {
  currentSkill: VictorSkill;
  currentSection?: Section;
  currentChapter?: Chapter;
  isOpen: boolean;
  isLoading: boolean;
}

// =============================================================================
// BIBLIOGRAPHIE - Sources
// =============================================================================

export type SourceType = 'book' | 'article' | 'thesis_dec' | 'report' | 'web' | 'video';
export type SourceStatus = 'to_read' | 'reading' | 'read' | 'key_source';

export interface MemoirSource {
  id: string;
  citation_key: string;
  title: string;
  authors: string[];
  year?: number;
  type: SourceType;
  publisher?: string;
  doi?: string;
  isbn?: string;
  url?: string;
  status: SourceStatus;
  verified: boolean;
  abstract?: string;
  keywords?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// BIBLIOGRAPHIE - Mappings sources → sections
// =============================================================================

export type SourceRelevance = 1 | 2 | 3; // 1=essentiel, 2=important, 3=optionnel

export interface MemoirSourceMapping {
  id: string;
  source_id: string;
  section_code: string;
  section_title?: string;
  relevance: SourceRelevance;
  concepts?: string[];
  usage_suggestion?: string;
  created_at: string;
}

// =============================================================================
// BIBLIOGRAPHIE - Citations extraites
// =============================================================================

export interface MemoirCitation {
  id: string;
  source_id: string;
  quote: string;
  page?: string;
  is_paraphrase: boolean;
  target_section?: string;
  used_in_section?: string;
  used_at?: string;
  context?: string;
  comment?: string;
  created_at: string;
}

// =============================================================================
// PROMPTS SYSTÈME
// =============================================================================

export const VICTOR_PROMPTS: Record<VictorSkill, string> = {
  redaction: `Tu es Victor, un rédacteur académique expert en Knowledge Management pour cabinets d'expertise comptable.
Tu aides Alexandre à rédiger son mémoire DEC.
Tu écris dans un style académique mais accessible.
Tu utilises le vouvoiement et un ton professionnel.
Tu structures tes réponses avec des titres et sous-titres.
Contexte actuel : Section "{sectionTitle}" du chapitre "{chapterTitle}".`,

  recherche: `Tu es Victor, un chercheur spécialisé en Knowledge Management.
Tu recherches des informations pertinentes pour enrichir le mémoire.
Tu cites toujours tes sources et vérifies leur fiabilité.
Tu proposes des pistes de recherche complémentaires.
Tu connais les auteurs clés : Nonaka, Davenport, Sveiby, Ermine.`,

  acquisition: `Tu es Victor, expert en capture et structuration des connaissances.
Tu aides à extraire les informations clés des documents.
Tu crées des fiches de synthèse structurées.
Tu identifies les concepts importants et leurs relations.
Tu proposes des tags et mots-clés pertinents.`,

  plan: `Tu es Victor, architecte de contenu académique.
Tu aides à structurer le mémoire de façon logique et cohérente.
Tu proposes des plans détaillés avec transitions.
Tu vérifies que la progression est fluide.
Tu suggères des réorganisations si nécessaire.`,

  bibliographie: `Tu es Victor, gestionnaire bibliographique expert.
Tu gères les sources au format APA 7e édition.
Tu vérifies la validité et la pertinence des sources.
Tu suggères des sources complémentaires.
Tu aides à formuler des citations correctes.
Base de données disponible : memoir_sources, memoir_citations.`,

  critique: `Tu es Victor, critique constructif et exigeant.
Tu analyses le contenu avec un regard critique mais bienveillant.
Tu identifies les faiblesses et incohérences.
Tu vérifies la rigueur académique.
Tu proposes des améliorations concrètes.
Tu notes sur une échelle de 1 à 5 : clarté, rigueur, originalité.`,
};

// =============================================================================
// HELPERS
// =============================================================================

export function getSkillConfig(skill: VictorSkill): VictorSkillConfig {
  return VICTOR_SKILLS.find(s => s.id === skill) || VICTOR_SKILLS[0];
}

export function getSkillPrompt(skill: VictorSkill, context?: { sectionTitle?: string; chapterTitle?: string }): string {
  let prompt = VICTOR_PROMPTS[skill];

  if (context?.sectionTitle) {
    prompt = prompt.replace('{sectionTitle}', context.sectionTitle);
  }
  if (context?.chapterTitle) {
    prompt = prompt.replace('{chapterTitle}', context.chapterTitle);
  }

  return prompt;
}
