/**
 * Services Notion - Point d'entrée
 *
 * Exporte tous les services liés à l'intégration Notion (BYON)
 */

export { notionAuthService, default as authService } from './notionAuthService';
export {
  startNotionOAuth,
  handleNotionCallback,
  getNotionConnection,
  disconnectNotion,
  isNotionConnected,
} from './notionAuthService';

export { notionExportService, default as exportService } from './notionExportService';
export {
  exportToNotion,
  getExportHistory,
  isDeliverableExported,
} from './notionExportService';

export {
  KM_DELIVERABLES_SCHEMA,
  DELIVERABLE_TYPE_MAPPING,
  deliverableToBlocks,
} from './notionSchemas';

// MCP Service - Orchestration agent → Notion
export { notionMCPService, default as mcpService } from './notionMCPService';
export {
  WORKSPACE_TEMPLATES,
  AVANT_VENTE_TEMPLATE,
  ONBOARDING_TEMPLATE,
  KM_LIVRABLES_TEMPLATE,
} from './notionMCPService';
export type {
  WorkspaceTemplate,
  DatabaseTemplate,
  PageTemplate,
  MCPActionResult,
  WorkspaceCreationResult,
} from './notionMCPService';
