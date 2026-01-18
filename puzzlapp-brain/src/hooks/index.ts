/**
 * Hooks - Point d'entrée
 *
 * Exporte tous les hooks personnalisés de l'application
 */

export { useNotionExport } from './useNotionExport';
export type { UseNotionExportReturn } from './useNotionExport';

// Agent → Notion integration
export {
  useAgentNotionIntegration,
  AGENT_NOTION_CONFIG,
  generateParcoursCompletionMessage,
} from './useAgentNotionIntegration';
export type {
  AgentNotionProposal,
  UseAgentNotionIntegrationReturn,
} from './useAgentNotionIntegration';
