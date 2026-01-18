/**
 * Types pour l'intégration Notion (BYON - Bring Your Own Notion)
 *
 * Permet aux lecteurs d'exporter leurs livrables vers leur propre workspace Notion
 *
 * Ajouté par Instance Lecteur - Phase 6
 */

// =============================================================================
// CONNEXION NOTION
// =============================================================================

export interface NotionConnection {
  id: string;
  user_id: string;
  access_token: string; // Note: chiffré côté serveur
  workspace_id: string;
  workspace_name: string | null;
  workspace_icon: string | null;
  bot_id: string | null;
  connected_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotionConnectionPublic {
  id: string;
  workspace_id: string;
  workspace_name: string | null;
  workspace_icon: string | null;
  connected_at: string;
}

// =============================================================================
// EXPORT NOTION
// =============================================================================

export type NotionExportType = 'database' | 'page';

export interface NotionExport {
  id: string;
  user_id: string;
  deliverable_id: string | null;
  notion_page_id: string;
  notion_database_id: string | null;
  export_type: NotionExportType;
  exported_at: string;
  created_at: string;
}

// =============================================================================
// NOTION API TYPES
// =============================================================================

export interface NotionPage {
  id: string;
  url: string;
  title: string;
}

export interface NotionDatabase {
  id: string;
  url: string;
  title: string;
}

export interface NotionOAuthResponse {
  access_token: string;
  token_type: 'bearer';
  bot_id: string;
  workspace_id: string;
  workspace_name: string | null;
  workspace_icon: string | null;
  owner: {
    type: 'user' | 'workspace';
    user?: {
      id: string;
      name: string;
      avatar_url: string | null;
    };
  };
  duplicated_template_id: string | null;
}

// =============================================================================
// NOTION DATABASE SCHEMA
// =============================================================================

export interface NotionPropertySchema {
  title?: Record<string, never>;
  rich_text?: Record<string, never>;
  number?: { format?: 'number' | 'number_with_commas' | 'percent' };
  select?: { options: NotionSelectOption[] };
  multi_select?: { options: NotionSelectOption[] };
  date?: Record<string, never>;
  checkbox?: Record<string, never>;
  url?: Record<string, never>;
  email?: Record<string, never>;
  status?: { options: NotionStatusOption[] };
}

export interface NotionSelectOption {
  name: string;
  color: NotionColor;
}

export interface NotionStatusOption {
  name: string;
  color: NotionColor;
}

export type NotionColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red';

export interface NotionDatabaseSchema {
  title: string;
  properties: Record<string, NotionPropertySchema>;
}

// =============================================================================
// EXPORT SERVICE TYPES
// =============================================================================

export type NotionExportStatus = 'idle' | 'connecting' | 'exporting' | 'done' | 'error';

export interface NotionExportProgress {
  status: NotionExportStatus;
  currentItem: number;
  totalItems: number;
  percentage: number;
  error?: string;
  resultUrl?: string;
}

export interface NotionExportOptions {
  parentPageId?: string;
  createNewDatabase?: boolean;
  databaseName?: string;
}

export interface NotionExportResult {
  success: boolean;
  databaseId?: string;
  databaseUrl?: string;
  pageIds?: string[];
  error?: string;
}

// =============================================================================
// UI STATE TYPES
// =============================================================================

export type NotionModalStep = 'connect' | 'select' | 'export' | 'done' | 'error';

export interface NotionModalState {
  isOpen: boolean;
  step: NotionModalStep;
  deliverables: string[]; // IDs des livrables à exporter
  parcoursName?: string;
}

// =============================================================================
// DELIVERABLE TO NOTION MAPPING
// =============================================================================

export interface DeliverableNotionMapping {
  type: string;
  notionType: 'Diagnostic' | 'Persona' | 'Empathy Map' | 'SWOT' | 'Roadmap' | 'Plan d\'action';
  color: NotionColor;
  contentToBlocks: (content: Record<string, unknown>) => NotionBlock[];
}

export interface NotionBlock {
  type: string;
  [key: string]: unknown;
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const NOTION_OAUTH_URL = 'https://api.notion.com/v1/oauth/authorize';
export const NOTION_TOKEN_URL = 'https://api.notion.com/v1/oauth/token';
export const NOTION_API_VERSION = '2022-06-28';

export const DELIVERABLE_TYPE_TO_NOTION: Record<string, { label: string; color: NotionColor }> = {
  'diagnostic-report': { label: 'Diagnostic', color: 'red' },
  'persona-card': { label: 'Persona', color: 'blue' },
  'empathy-map': { label: 'Empathy Map', color: 'purple' },
  'swot-matrix': { label: 'SWOT', color: 'orange' },
  'roadmap': { label: 'Roadmap', color: 'green' },
  'action-plan': { label: 'Plan d\'action', color: 'yellow' },
};

export const PARCOURS_TO_NOTION: Record<string, { label: string; color: NotionColor }> = {
  'avant-vente': { label: 'Avant-Vente', color: 'blue' },
  'onboarding-client': { label: 'Onboarding Client', color: 'green' },
  'production': { label: 'Production', color: 'orange' },
};
