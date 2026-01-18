/**
 * Service d'export vers Notion
 *
 * Gère la création de bases de données et l'export des livrables vers Notion
 */

import { supabase } from '@/lib/supabase';
import type {
  NotionExportResult,
  NotionExportOptions,
  NotionDatabase,
} from '@/types/notion';
import type { Deliverable } from '@/types';
import { KM_DELIVERABLES_SCHEMA, DELIVERABLE_TYPE_MAPPING, deliverableToBlocks } from './notionSchemas';

// =============================================================================
// FONCTIONS UTILITAIRES API NOTION
// =============================================================================

interface NotionApiResponse {
  id?: string;
  url?: string;
  results?: Array<{
    id: string;
    url?: string;
    title?: Array<{ plain_text: string }>;
  }>;
  [key: string]: unknown;
}

/**
 * Fait une requête à l'API Notion avec le token de l'utilisateur
 */
async function notionFetch(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' = 'GET',
  body?: Record<string, unknown>
): Promise<NotionApiResponse> {
  // Récupérer le token via Edge Function (plus sécurisé)
  const { data, error } = await supabase.functions.invoke('notion-api', {
    body: {
      endpoint,
      method,
      body,
    },
  });

  if (error) {
    throw new Error(`Notion API error: ${error.message}`);
  }

  return data as NotionApiResponse;
}

/**
 * Recherche une base de données existante par nom
 */
async function findExistingDatabase(name: string): Promise<NotionDatabase | null> {
  try {
    const response = await notionFetch('/search', 'POST', {
      query: name,
      filter: { value: 'database', property: 'object' },
    });

    const results = response.results || [];
    const match = results.find(
      (db: { title?: Array<{ plain_text: string }> }) =>
        db.title?.[0]?.plain_text === name
    );

    if (match) {
      return {
        id: match.id,
        url: match.url || '',
        title: name,
      };
    }

    return null;
  } catch (error) {
    console.error('Error searching for database:', error);
    return null;
  }
}

/**
 * Crée une nouvelle base de données Notion
 */
async function createDatabase(
  parentPageId: string | undefined,
  schema: typeof KM_DELIVERABLES_SCHEMA
): Promise<NotionDatabase> {
  const parent = parentPageId
    ? { type: 'page_id', page_id: parentPageId }
    : { type: 'workspace', workspace: true };

  const response = await notionFetch('/databases', 'POST', {
    parent,
    title: [{ type: 'text', text: { content: schema.title } }],
    properties: schema.properties,
  });

  if (!response.id) {
    throw new Error('Failed to create database: no ID returned');
  }

  return {
    id: response.id,
    url: response.url as string,
    title: schema.title,
  };
}

/**
 * Ajoute une page (livrable) à une base de données
 */
async function addPageToDatabase(
  databaseId: string,
  deliverable: Deliverable,
  parcoursName?: string
): Promise<string> {
  const typeMapping = DELIVERABLE_TYPE_MAPPING[deliverable.type];
  const blocks = deliverableToBlocks(deliverable);

  const properties: Record<string, unknown> = {
    'Titre': {
      title: [{ text: { content: deliverable.title } }],
    },
    'Type': {
      select: { name: typeMapping?.label || deliverable.type },
    },
    'Date création': {
      date: { start: deliverable.created_at.split('T')[0] },
    },
    'Statut': {
      status: { name: 'Complété' },
    },
  };

  // Ajouter le parcours si fourni
  if (parcoursName) {
    properties['Parcours'] = {
      select: { name: parcoursName },
    };
  }

  // Ajouter le score si présent dans le contenu
  const score = deliverable.content.global_score || deliverable.content.score;
  if (typeof score === 'number') {
    properties['Score'] = { number: score };
  }

  // Ajouter le lien vers PuzzlApp
  const puzzlappUrl = `${window.location.origin}/reader/deliverables/${deliverable.id}`;
  properties['Lien PuzzlApp'] = { url: puzzlappUrl };

  const response = await notionFetch('/pages', 'POST', {
    parent: { database_id: databaseId },
    properties,
    children: blocks,
  });

  if (!response.id) {
    throw new Error('Failed to create page: no ID returned');
  }

  return response.id;
}

// =============================================================================
// FONCTION PRINCIPALE D'EXPORT
// =============================================================================

/**
 * Exporte une liste de livrables vers Notion
 *
 * @param deliverables - Liste des livrables à exporter
 * @param options - Options d'export (page parent, nom de la base, etc.)
 * @param parcoursName - Nom du parcours (pour tagging)
 * @param onProgress - Callback de progression
 */
export async function exportToNotion(
  deliverables: Deliverable[],
  options: NotionExportOptions = {},
  parcoursName?: string,
  onProgress?: (current: number, total: number) => void
): Promise<NotionExportResult> {
  try {
    if (deliverables.length === 0) {
      return { success: true, pageIds: [] };
    }

    // 1. Trouver ou créer la base de données
    let database: NotionDatabase;
    const dbName = options.databaseName || KM_DELIVERABLES_SCHEMA.title;

    if (!options.createNewDatabase) {
      // Chercher une base existante
      const existing = await findExistingDatabase(dbName);
      if (existing) {
        database = existing;
      } else {
        database = await createDatabase(options.parentPageId, KM_DELIVERABLES_SCHEMA);
      }
    } else {
      database = await createDatabase(options.parentPageId, KM_DELIVERABLES_SCHEMA);
    }

    // 2. Exporter chaque livrable
    const pageIds: string[] = [];
    const { data: { user } } = await supabase.auth.getUser();

    for (let i = 0; i < deliverables.length; i++) {
      const deliverable = deliverables[i];

      // Créer la page dans Notion
      const pageId = await addPageToDatabase(database.id, deliverable, parcoursName);
      pageIds.push(pageId);

      // Enregistrer l'export dans Supabase
      if (user) {
        await supabase.from('notion_exports').insert({
          user_id: user.id,
          deliverable_id: deliverable.id,
          notion_page_id: pageId,
          notion_database_id: database.id,
          export_type: 'page',
        });
      }

      // Callback de progression
      onProgress?.(i + 1, deliverables.length);
    }

    return {
      success: true,
      databaseId: database.id,
      databaseUrl: database.url,
      pageIds,
    };
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Récupère l'historique des exports Notion de l'utilisateur
 */
export async function getExportHistory() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('notion_exports')
    .select(`
      id,
      deliverable_id,
      notion_page_id,
      notion_database_id,
      export_type,
      exported_at,
      deliverables (
        id,
        title,
        type
      )
    `)
    .eq('user_id', user.id)
    .order('exported_at', { ascending: false });

  if (error) {
    console.error('Error fetching export history:', error);
    return [];
  }

  return data || [];
}

/**
 * Vérifie si un livrable a déjà été exporté
 */
export async function isDeliverableExported(deliverableId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { count, error } = await supabase
    .from('notion_exports')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('deliverable_id', deliverableId);

  if (error) {
    console.error('Error checking export status:', error);
    return false;
  }

  return (count || 0) > 0;
}

export const notionExportService = {
  exportToNotion,
  getExportHistory,
  isDeliverableExported,
  findExistingDatabase,
};

export default notionExportService;
