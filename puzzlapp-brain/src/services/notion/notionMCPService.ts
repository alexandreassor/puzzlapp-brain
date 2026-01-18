/**
 * Service d'orchestration Notion MCP pour PuzzlApp Brain
 *
 * Ce service permet aux agents IA (Léo, Sophie, Marc) de créer
 * automatiquement des espaces Notion personnalisés pour les utilisateurs.
 *
 * Concept "Tu parles, Notion se construit" :
 * - L'utilisateur discute avec un agent
 * - L'agent génère les instructions de création
 * - Ce service traduit les instructions en actions Notion via MCP
 *
 * @author PuzzlApp Brain - Phase 6 BYON
 */

import { supabase } from '@/lib/supabase';
import type { Deliverable } from '@/types';
import type { NotionBlock, NotionColor } from '@/types/notion';

// =============================================================================
// TYPES SPÉCIFIQUES AU MCP
// =============================================================================

export interface MCPNotionConfig {
  /** URL du serveur MCP Notion officiel */
  mcpServerUrl: string;
  /** Version de l'API Notion */
  apiVersion: string;
}

export interface WorkspaceTemplate {
  /** Identifiant unique du template */
  id: string;
  /** Nom affiché */
  name: string;
  /** Description pour l'utilisateur */
  description: string;
  /** Emoji représentatif */
  emoji: string;
  /** Parcours associé */
  parcours: 'avant-vente' | 'onboarding-client' | 'production' | 'audit' | 'social';
  /** Bases de données à créer */
  databases: DatabaseTemplate[];
  /** Pages standalone à créer */
  pages: PageTemplate[];
}

export interface DatabaseTemplate {
  /** Nom de la base */
  name: string;
  /** Emoji de la base */
  emoji: string;
  /** Description */
  description: string;
  /** Propriétés (colonnes) */
  properties: Record<string, NotionPropertyDef>;
  /** Vues par défaut */
  views?: DatabaseViewTemplate[];
  /** Exemples de données à créer */
  sampleData?: Record<string, unknown>[];
}

export interface PageTemplate {
  /** Titre de la page */
  title: string;
  /** Emoji */
  emoji: string;
  /** Contenu en blocs Notion */
  blocks: NotionBlock[];
}

export interface DatabaseViewTemplate {
  /** Nom de la vue */
  name: string;
  /** Type de vue */
  type: 'table' | 'board' | 'calendar' | 'list' | 'gallery';
  /** Configuration des filtres */
  filter?: Record<string, unknown>;
}

export interface NotionPropertyDef {
  type: 'title' | 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'checkbox' | 'url' | 'status' | 'person' | 'relation';
  options?: Array<{ name: string; color: NotionColor }>;
  statusOptions?: Array<{ name: string; color: NotionColor }>;
}

// =============================================================================
// RÉSULTATS DES ACTIONS MCP
// =============================================================================

export interface MCPActionResult {
  success: boolean;
  actionType: 'create_database' | 'create_page' | 'add_row' | 'create_workspace';
  notionId?: string;
  notionUrl?: string;
  error?: string;
}

export interface WorkspaceCreationResult {
  success: boolean;
  workspaceUrl?: string;
  databases: Array<{
    name: string;
    id: string;
    url: string;
  }>;
  pages: Array<{
    title: string;
    id: string;
    url: string;
  }>;
  error?: string;
}

// =============================================================================
// CONFIGURATION MCP
// =============================================================================

const MCP_CONFIG: MCPNotionConfig = {
  mcpServerUrl: 'https://mcp.notion.com/mcp',
  apiVersion: '2022-06-28',
};

// =============================================================================
// TEMPLATES PAR PARCOURS
// =============================================================================

/**
 * Template pour le parcours Avant-Vente (Sophie)
 * Crée un espace commercial complet dans Notion
 */
export const AVANT_VENTE_TEMPLATE: WorkspaceTemplate = {
  id: 'avant-vente-commercial',
  name: 'Espace Commercial',
  description: 'Pipeline de prospects, templates de proposition, fiches découverte',
  emoji: '💼',
  parcours: 'avant-vente',
  databases: [
    {
      name: 'Pipeline Prospects',
      emoji: '🎯',
      description: 'Suivi de vos prospects et opportunités commerciales',
      properties: {
        'Nom': { type: 'title' },
        'Entreprise': { type: 'text' },
        'Statut': {
          type: 'status',
          statusOptions: [
            { name: 'Premier contact', color: 'gray' },
            { name: 'Découverte', color: 'blue' },
            { name: 'Proposition envoyée', color: 'yellow' },
            { name: 'Négociation', color: 'orange' },
            { name: 'Gagné ✅', color: 'green' },
            { name: 'Perdu ❌', color: 'red' },
          ],
        },
        'Valeur estimée': { type: 'number' },
        'Date relance': { type: 'date' },
        'Source': {
          type: 'select',
          options: [
            { name: 'Recommandation', color: 'green' },
            { name: 'Site web', color: 'blue' },
            { name: 'Réseau', color: 'purple' },
            { name: 'Ancien client', color: 'orange' },
          ],
        },
        'Notes': { type: 'text' },
      },
      views: [
        { name: 'Par statut', type: 'board' },
        { name: 'Calendrier relances', type: 'calendar' },
        { name: 'Tous les prospects', type: 'table' },
      ],
    },
    {
      name: 'Offres & Tarifs',
      emoji: '💰',
      description: 'Catalogue de vos offres et grilles tarifaires',
      properties: {
        'Offre': { type: 'title' },
        'Description': { type: 'text' },
        'Prix HT': { type: 'number' },
        'Récurrence': {
          type: 'select',
          options: [
            { name: 'Ponctuel', color: 'gray' },
            { name: 'Mensuel', color: 'blue' },
            { name: 'Annuel', color: 'green' },
          ],
        },
        'Cible': {
          type: 'multi_select',
          options: [
            { name: 'TPE', color: 'blue' },
            { name: 'PME', color: 'green' },
            { name: 'ETI', color: 'purple' },
            { name: 'Startup', color: 'pink' },
          ],
        },
        'Actif': { type: 'checkbox' },
      },
    },
  ],
  pages: [
    {
      title: 'Template Proposition Commerciale',
      emoji: '📝',
      blocks: [
        {
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: '💡 Dupliquez cette page pour chaque nouvelle proposition' } }],
            icon: { type: 'emoji', emoji: '💡' },
          },
        },
        {
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: 'Proposition Commerciale' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '1. Contexte & Enjeux' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: '[Décrire la situation actuelle du client et ses enjeux]' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '2. Notre Solution' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: '[Présenter votre offre et ses bénéfices]' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '3. Investissement' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: '[Détailler la tarification]' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: '4. Prochaines Étapes' } }],
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Signature de la lettre de mission' } }],
            checked: false,
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Réunion de lancement' } }],
            checked: false,
          },
        },
      ],
    },
    {
      title: 'Fiche Découverte Client',
      emoji: '🔍',
      blocks: [
        {
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: '🔍 Guide pour structurer votre premier RDV découverte' } }],
            icon: { type: 'emoji', emoji: '🔍' },
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Informations Générales' } }],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Entreprise :' } }],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Interlocuteur :' } }],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'Effectif :' } }],
          },
        },
        {
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: 'CA :' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Situation Actuelle' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Comment gérez-vous actuellement... ?' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Besoins & Attentes' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Quels sont vos principaux défis ?' } }],
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Budget & Timing' } }],
          },
        },
        {
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: 'Quel est votre calendrier idéal ?' } }],
          },
        },
      ],
    },
  ],
};

/**
 * Template pour le parcours Onboarding Client (Marc)
 * Crée un espace de suivi des nouveaux clients
 */
export const ONBOARDING_TEMPLATE: WorkspaceTemplate = {
  id: 'onboarding-client',
  name: 'Espace Onboarding',
  description: 'Suivi des nouveaux clients, checklist d\'intégration, documentation',
  emoji: '👋',
  parcours: 'onboarding-client',
  databases: [
    {
      name: 'Clients en Onboarding',
      emoji: '👥',
      description: 'Suivi des clients en cours d\'intégration',
      properties: {
        'Client': { type: 'title' },
        'Date début': { type: 'date' },
        'Responsable': { type: 'person' },
        'Phase': {
          type: 'status',
          statusOptions: [
            { name: 'Kick-off', color: 'gray' },
            { name: 'Collecte docs', color: 'blue' },
            { name: 'Paramétrage', color: 'yellow' },
            { name: 'Formation', color: 'orange' },
            { name: 'Go Live', color: 'green' },
            { name: 'Clôturé', color: 'green' },
          ],
        },
        'Satisfaction': {
          type: 'select',
          options: [
            { name: '😊 Très satisfait', color: 'green' },
            { name: '🙂 Satisfait', color: 'blue' },
            { name: '😐 Neutre', color: 'yellow' },
            { name: '😕 Insatisfait', color: 'red' },
          ],
        },
        'Notes': { type: 'text' },
      },
      views: [
        { name: 'Par phase', type: 'board' },
        { name: 'Timeline', type: 'calendar' },
      ],
    },
    {
      name: 'Checklist Onboarding',
      emoji: '✅',
      description: 'Tâches standards pour chaque nouveau client',
      properties: {
        'Tâche': { type: 'title' },
        'Client': { type: 'relation' },
        'Fait': { type: 'checkbox' },
        'Catégorie': {
          type: 'select',
          options: [
            { name: 'Administratif', color: 'gray' },
            { name: 'Technique', color: 'blue' },
            { name: 'Formation', color: 'green' },
            { name: 'Suivi', color: 'purple' },
          ],
        },
        'Deadline': { type: 'date' },
        'Responsable': { type: 'person' },
      },
    },
  ],
  pages: [
    {
      title: 'Process Onboarding Standard',
      emoji: '📋',
      blocks: [
        {
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: '📋 Process standard d\'intégration d\'un nouveau client' } }],
            icon: { type: 'emoji', emoji: '📋' },
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Phase 1 : Kick-off (J+0)' } }],
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Réunion de lancement' } }],
            checked: false,
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Présentation de l\'équipe' } }],
            checked: false,
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Définition du planning' } }],
            checked: false,
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Phase 2 : Collecte (J+1 à J+7)' } }],
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Documents juridiques' } }],
            checked: false,
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Accès outils (banque, logiciels)' } }],
            checked: false,
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Historique comptable' } }],
            checked: false,
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Phase 3 : Paramétrage (J+7 à J+14)' } }],
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Configuration dossier' } }],
            checked: false,
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Import données' } }],
            checked: false,
          },
        },
        {
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Phase 4 : Formation (J+14 à J+21)' } }],
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Formation outils' } }],
            checked: false,
          },
        },
        {
          type: 'to_do',
          to_do: {
            rich_text: [{ type: 'text', text: { content: 'Documentation client' } }],
            checked: false,
          },
        },
      ],
    },
  ],
};

/**
 * Template pour les livrables KM génériques (Léo)
 * Base centralisée de tous les livrables
 */
export const KM_LIVRABLES_TEMPLATE: WorkspaceTemplate = {
  id: 'km-livrables',
  name: 'Base Livrables KM',
  description: 'Centralisation de tous vos livrables de transformation KM',
  emoji: '📚',
  parcours: 'production', // Default
  databases: [
    {
      name: 'Mes Livrables KM - PuzzlApp',
      emoji: '📊',
      description: 'Tous vos livrables de parcours KM',
      properties: {
        'Titre': { type: 'title' },
        'Type': {
          type: 'select',
          options: [
            { name: 'Diagnostic', color: 'red' },
            { name: 'Persona', color: 'blue' },
            { name: 'Empathy Map', color: 'purple' },
            { name: 'SWOT', color: 'orange' },
            { name: 'Roadmap', color: 'green' },
            { name: 'Plan d\'action', color: 'yellow' },
          ],
        },
        'Parcours': {
          type: 'select',
          options: [
            { name: 'Avant-Vente', color: 'blue' },
            { name: 'Onboarding Client', color: 'green' },
            { name: 'Production', color: 'orange' },
          ],
        },
        'Score': { type: 'number' },
        'Statut': {
          type: 'status',
          statusOptions: [
            { name: 'Brouillon', color: 'gray' },
            { name: 'Complété', color: 'green' },
            { name: 'À revoir', color: 'yellow' },
          ],
        },
        'Date création': { type: 'date' },
        'Lien PuzzlApp': { type: 'url' },
      },
      views: [
        { name: 'Par parcours', type: 'board' },
        { name: 'Par type', type: 'gallery' },
        { name: 'Timeline', type: 'calendar' },
      ],
    },
  ],
  pages: [],
};

// =============================================================================
// REGISTRE DES TEMPLATES
// =============================================================================

export const WORKSPACE_TEMPLATES: Record<string, WorkspaceTemplate> = {
  'avant-vente': AVANT_VENTE_TEMPLATE,
  'onboarding-client': ONBOARDING_TEMPLATE,
  'km-livrables': KM_LIVRABLES_TEMPLATE,
};

// =============================================================================
// SERVICE PRINCIPAL MCP
// =============================================================================

/**
 * Service d'orchestration des actions Notion via MCP
 *
 * Ce service est appelé par les agents IA pour créer des espaces Notion
 * sans que l'utilisateur ait à faire quoi que ce soit manuellement.
 */
class NotionMCPService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_config: MCPNotionConfig = MCP_CONFIG) {
    // Config stockée pour usage futur avec le MCP Notion
  }

  // ===========================================================================
  // MÉTHODES PUBLIQUES POUR LES AGENTS
  // ===========================================================================

  /**
   * Crée un espace de travail complet basé sur un template
   *
   * Appelé par les agents après qu'un utilisateur termine un parcours.
   *
   * @example
   * // Appelé par Sophie après le parcours Avant-Vente
   * const result = await notionMCP.createWorkspaceFromTemplate(
   *   userId,
   *   'avant-vente',
   *   deliverables
   * );
   */
  async createWorkspaceFromTemplate(
    userId: string,
    templateId: string,
    deliverables?: Deliverable[],
    parentPageId?: string
  ): Promise<WorkspaceCreationResult> {
    try {
      const template = WORKSPACE_TEMPLATES[templateId];
      if (!template) {
        return {
          success: false,
          databases: [],
          pages: [],
          error: `Template "${templateId}" non trouvé`,
        };
      }

      // Vérifier que l'utilisateur est connecté à Notion
      const connection = await this.getUserConnection(userId);
      if (!connection) {
        return {
          success: false,
          databases: [],
          pages: [],
          error: 'Utilisateur non connecté à Notion',
        };
      }

      const createdDatabases: Array<{ name: string; id: string; url: string }> = [];
      const createdPages: Array<{ title: string; id: string; url: string }> = [];

      // 1. Créer les bases de données
      for (const dbTemplate of template.databases) {
        const result = await this.createDatabaseFromTemplate(
          dbTemplate,
          parentPageId
        );
        if (result.success && result.notionId && result.notionUrl) {
          createdDatabases.push({
            name: dbTemplate.name,
            id: result.notionId,
            url: result.notionUrl,
          });
        }
      }

      // 2. Créer les pages templates
      for (const pageTemplate of template.pages) {
        const result = await this.createPageFromTemplate(
          pageTemplate,
          parentPageId
        );
        if (result.success && result.notionId && result.notionUrl) {
          createdPages.push({
            title: pageTemplate.title,
            id: result.notionId,
            url: result.notionUrl,
          });
        }
      }

      // 3. Si des livrables sont fournis, les ajouter à la base KM
      if (deliverables && deliverables.length > 0) {
        const kmDb = createdDatabases.find(
          db => db.name.includes('Livrables KM') || db.name.includes('PuzzlApp')
        );
        if (kmDb) {
          await this.addDeliverablesToDatabase(kmDb.id, deliverables);
        }
      }

      // 4. Enregistrer la création dans Supabase
      await this.recordWorkspaceCreation(userId, templateId, createdDatabases, createdPages);

      return {
        success: true,
        workspaceUrl: createdPages[0]?.url || createdDatabases[0]?.url,
        databases: createdDatabases,
        pages: createdPages,
      };

    } catch (error) {
      console.error('Error creating workspace from template:', error);
      return {
        success: false,
        databases: [],
        pages: [],
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Génère les instructions pour un agent IA
   *
   * L'agent peut utiliser ces instructions pour décrire ce qu'il va créer
   * à l'utilisateur avant de lancer la création.
   */
  getTemplateDescription(templateId: string): string | null {
    const template = WORKSPACE_TEMPLATES[templateId];
    if (!template) return null;

    const dbList = template.databases
      .map(db => `  📊 ${db.emoji} ${db.name} - ${db.description}`)
      .join('\n');

    const pageList = template.pages
      .map(p => `  📝 ${p.emoji} ${p.title}`)
      .join('\n');

    return `
${template.emoji} **${template.name}**
${template.description}

**Bases de données :**
${dbList}

**Pages templates :**
${pageList || '  (Aucune)'}
    `.trim();
  }

  /**
   * Retourne la liste des templates disponibles pour un parcours
   */
  getTemplatesForParcours(parcours: string): WorkspaceTemplate[] {
    return Object.values(WORKSPACE_TEMPLATES).filter(
      t => t.parcours === parcours || t.id === 'km-livrables'
    );
  }

  /**
   * Génère un message d'agent pour proposer la création Notion
   *
   * Utilisé par les agents pour proposer la création à l'utilisateur
   * de manière conversationnelle.
   */
  generateAgentProposal(
    _agentName: string,
    templateId: string,
    deliverableCount: number
  ): string {
    const template = WORKSPACE_TEMPLATES[templateId];
    if (!template) return '';

    const dbNames = template.databases.map(db => `**${db.emoji} ${db.name}**`).join(', ');
    const pageNames = template.pages.map(p => `**${p.emoji} ${p.title}**`).join(', ');

    let message = `🎉 Félicitations pour avoir terminé le parcours !

Je peux maintenant créer ton espace Notion personnalisé avec :

📊 **Bases de données** : ${dbNames}
`;

    if (template.pages.length > 0) {
      message += `📝 **Templates** : ${pageNames}\n`;
    }

    if (deliverableCount > 0) {
      message += `\n📋 **${deliverableCount} livrable${deliverableCount > 1 ? 's' : ''}** seront automatiquement ajoutés.\n`;
    }

    message += `
Tout sera créé dans TON workspace Notion. Tu gardes le contrôle total de tes données.

**[Créer mon espace]** • **[Personnaliser]** • **[Plus tard]**`;

    return message;
  }

  // ===========================================================================
  // MÉTHODES PRIVÉES - COMMUNICATION MCP/API
  // ===========================================================================

  /**
   * Récupère la connexion Notion de l'utilisateur
   */
  private async getUserConnection(userId: string) {
    const { data, error } = await supabase
      .from('notion_connections')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return null;
    return data;
  }

  /**
   * Crée une base de données Notion depuis un template
   */
  private async createDatabaseFromTemplate(
    template: DatabaseTemplate,
    parentPageId?: string
  ): Promise<MCPActionResult> {
    try {
      // Convertir le template en format API Notion
      const properties: Record<string, unknown> = {};

      for (const [name, def] of Object.entries(template.properties)) {
        properties[name] = this.convertPropertyDef(def);
      }

      const requestBody: Record<string, unknown> = {
        parent: parentPageId
          ? { type: 'page_id', page_id: parentPageId }
          : { type: 'workspace', workspace: true },
        title: [{ type: 'text', text: { content: template.name } }],
        icon: { type: 'emoji', emoji: template.emoji },
        properties,
      };

      // Appeler l'API via Edge Function
      const { data, error } = await supabase.functions.invoke('notion-api', {
        body: {
          endpoint: '/databases',
          method: 'POST',
          body: requestBody,
        },
      });

      if (error) {
        return {
          success: false,
          actionType: 'create_database',
          error: error.message,
        };
      }

      return {
        success: true,
        actionType: 'create_database',
        notionId: data.id,
        notionUrl: data.url,
      };

    } catch (error) {
      return {
        success: false,
        actionType: 'create_database',
        error: error instanceof Error ? error.message : 'Erreur création base',
      };
    }
  }

  /**
   * Crée une page Notion depuis un template
   */
  private async createPageFromTemplate(
    template: PageTemplate,
    parentPageId?: string
  ): Promise<MCPActionResult> {
    try {
      const requestBody: Record<string, unknown> = {
        parent: parentPageId
          ? { type: 'page_id', page_id: parentPageId }
          : { type: 'workspace', workspace: true },
        properties: {
          title: [{ text: { content: template.title } }],
        },
        icon: { type: 'emoji', emoji: template.emoji },
        children: template.blocks,
      };

      const { data, error } = await supabase.functions.invoke('notion-api', {
        body: {
          endpoint: '/pages',
          method: 'POST',
          body: requestBody,
        },
      });

      if (error) {
        return {
          success: false,
          actionType: 'create_page',
          error: error.message,
        };
      }

      return {
        success: true,
        actionType: 'create_page',
        notionId: data.id,
        notionUrl: data.url,
      };

    } catch (error) {
      return {
        success: false,
        actionType: 'create_page',
        error: error instanceof Error ? error.message : 'Erreur création page',
      };
    }
  }

  /**
   * Ajoute des livrables à une base de données Notion
   * TODO: Implémenter avec l'API Notion MCP
   */
  private async addDeliverablesToDatabase(
    _databaseId: string,
    _deliverables: Deliverable[]
  ): Promise<void> {
    // TODO: Implémenter l'ajout de livrables via MCP Notion
    // Pour l'instant, cette méthode est un placeholder
    console.log('addDeliverablesToDatabase: To be implemented');
  }

  /**
   * Enregistre la création d'un workspace dans Supabase
   */
  private async recordWorkspaceCreation(
    userId: string,
    templateId: string,
    databases: Array<{ name: string; id: string; url: string }>,
    pages: Array<{ title: string; id: string; url: string }>
  ): Promise<void> {
    try {
      await supabase.from('notion_workspace_creations').insert({
        user_id: userId,
        template_id: templateId,
        databases_created: databases,
        pages_created: pages,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      // Log mais ne pas bloquer
      console.error('Error recording workspace creation:', error);
    }
  }

  /**
   * Convertit une définition de propriété en format API Notion
   */
  private convertPropertyDef(def: NotionPropertyDef): Record<string, unknown> {
    switch (def.type) {
      case 'title':
        return { title: {} };
      case 'text':
        return { rich_text: {} };
      case 'number':
        return { number: { format: 'number' } };
      case 'select':
        return { select: { options: def.options || [] } };
      case 'multi_select':
        return { multi_select: { options: def.options || [] } };
      case 'date':
        return { date: {} };
      case 'checkbox':
        return { checkbox: {} };
      case 'url':
        return { url: {} };
      case 'status':
        return { status: { options: def.statusOptions || [] } };
      case 'person':
        return { people: {} };
      case 'relation':
        return { relation: {} }; // Nécessite configuration supplémentaire
      default:
        return { rich_text: {} };
    }
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const notionMCPService = new NotionMCPService();

export default notionMCPService;
