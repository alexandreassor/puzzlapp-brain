/**
 * Service de documentation
 *
 * Gère la récupération et la gestion des articles de documentation
 * stockés dans Supabase pour l'espace Admin.
 *
 * @author PuzzlApp Brain
 */

import { supabase } from '@/lib/supabase';

// =============================================================================
// TYPES
// =============================================================================

export type DocumentationCategory =
  | 'architecture'
  | 'integration'
  | 'agents'
  | 'notion'
  | 'parcours'
  | 'jeux'
  | 'api'
  | 'guides';

export type DocumentationStatus = 'draft' | 'published' | 'archived';

export interface Documentation {
  id: string;
  slug: string;
  title: string;
  category: DocumentationCategory;
  summary: string | null;
  content_md: string;
  version: string;
  author: string | null;
  tags: string[];
  status: DocumentationStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentationListItem {
  id: string;
  slug: string;
  title: string;
  category: DocumentationCategory;
  summary: string | null;
  tags: string[];
  updated_at: string;
}

export interface DocumentationCreateInput {
  slug: string;
  title: string;
  category: DocumentationCategory;
  summary?: string;
  content_md: string;
  version?: string;
  author?: string;
  tags?: string[];
  status?: DocumentationStatus;
  display_order?: number;
}

export interface DocumentationUpdateInput {
  title?: string;
  category?: DocumentationCategory;
  summary?: string;
  content_md?: string;
  version?: string;
  author?: string;
  tags?: string[];
  status?: DocumentationStatus;
  display_order?: number;
}

// =============================================================================
// CATÉGORIES
// =============================================================================

export const DOCUMENTATION_CATEGORIES: Record<DocumentationCategory, {
  label: string;
  description: string;
  icon: string;
  color: string;
}> = {
  architecture: {
    label: 'Architecture',
    description: 'Structure technique et organisation du code',
    icon: '🏗️',
    color: 'bg-blue-500/10 text-blue-700',
  },
  integration: {
    label: 'Intégrations',
    description: 'Connexions avec services externes',
    icon: '🔌',
    color: 'bg-purple-500/10 text-purple-700',
  },
  agents: {
    label: 'Agents IA',
    description: 'Sophie, Marc, Léo et leurs fonctionnalités',
    icon: '🤖',
    color: 'bg-green-500/10 text-green-700',
  },
  notion: {
    label: 'Notion',
    description: 'Intégration et export vers Notion',
    icon: '📝',
    color: 'bg-gray-500/10 text-gray-700',
  },
  parcours: {
    label: 'Parcours',
    description: 'Gestion des parcours de formation',
    icon: '🎯',
    color: 'bg-orange-500/10 text-orange-700',
  },
  jeux: {
    label: 'Jeux',
    description: 'Jeux Design Thinking interactifs',
    icon: '🎮',
    color: 'bg-pink-500/10 text-pink-700',
  },
  api: {
    label: 'API',
    description: 'Documentation des endpoints et services',
    icon: '⚡',
    color: 'bg-yellow-500/10 text-yellow-700',
  },
  guides: {
    label: 'Guides',
    description: 'Tutoriels et guides d\'utilisation',
    icon: '📚',
    color: 'bg-teal-500/10 text-teal-700',
  },
};

// =============================================================================
// FONCTIONS DE LECTURE
// =============================================================================

/**
 * Récupère la liste de tous les articles de documentation
 */
export async function getDocumentationList(): Promise<DocumentationListItem[]> {
  const { data, error } = await supabase
    .from('documentation')
    .select('id, slug, title, category, summary, tags, updated_at')
    .eq('status', 'published')
    .order('category')
    .order('display_order');

  if (error) {
    console.error('Error fetching documentation list:', error);
    return [];
  }

  return data || [];
}

/**
 * Récupère les articles par catégorie
 */
export async function getDocumentationByCategory(
  category: DocumentationCategory
): Promise<DocumentationListItem[]> {
  const { data, error } = await supabase
    .from('documentation')
    .select('id, slug, title, category, summary, tags, updated_at')
    .eq('status', 'published')
    .eq('category', category)
    .order('display_order');

  if (error) {
    console.error('Error fetching documentation by category:', error);
    return [];
  }

  return data || [];
}

/**
 * Récupère un article par son slug
 */
export async function getDocumentationBySlug(
  slug: string
): Promise<Documentation | null> {
  const { data, error } = await supabase
    .from('documentation')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching documentation by slug:', error);
    return null;
  }

  return data;
}

/**
 * Récupère un article par son ID
 */
export async function getDocumentationById(
  id: string
): Promise<Documentation | null> {
  const { data, error } = await supabase
    .from('documentation')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching documentation by id:', error);
    return null;
  }

  return data;
}

/**
 * Recherche dans la documentation
 */
export async function searchDocumentation(
  query: string
): Promise<DocumentationListItem[]> {
  const { data, error } = await supabase
    .from('documentation')
    .select('id, slug, title, category, summary, tags, updated_at')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content_md.ilike.%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error searching documentation:', error);
    return [];
  }

  return data || [];
}

/**
 * Recherche par tag
 */
export async function getDocumentationByTag(
  tag: string
): Promise<DocumentationListItem[]> {
  const { data, error } = await supabase
    .from('documentation')
    .select('id, slug, title, category, summary, tags, updated_at')
    .eq('status', 'published')
    .contains('tags', [tag])
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching documentation by tag:', error);
    return [];
  }

  return data || [];
}

// =============================================================================
// FONCTIONS D'ÉCRITURE (ADMIN)
// =============================================================================

/**
 * Crée un nouvel article de documentation
 */
export async function createDocumentation(
  input: DocumentationCreateInput
): Promise<Documentation | null> {
  const { data, error } = await supabase
    .from('documentation')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('Error creating documentation:', error);
    return null;
  }

  return data;
}

/**
 * Met à jour un article de documentation
 */
export async function updateDocumentation(
  id: string,
  input: DocumentationUpdateInput
): Promise<Documentation | null> {
  const { data, error } = await supabase
    .from('documentation')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating documentation:', error);
    return null;
  }

  return data;
}

/**
 * Supprime un article de documentation
 */
export async function deleteDocumentation(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('documentation')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting documentation:', error);
    return false;
  }

  return true;
}

/**
 * Archive un article (soft delete)
 */
export async function archiveDocumentation(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('documentation')
    .update({ status: 'archived' })
    .eq('id', id);

  if (error) {
    console.error('Error archiving documentation:', error);
    return false;
  }

  return true;
}

// =============================================================================
// EXPORT
// =============================================================================

export const documentationService = {
  // Lecture
  getList: getDocumentationList,
  getByCategory: getDocumentationByCategory,
  getBySlug: getDocumentationBySlug,
  getById: getDocumentationById,
  search: searchDocumentation,
  getByTag: getDocumentationByTag,
  // Écriture
  create: createDocumentation,
  update: updateDocumentation,
  delete: deleteDocumentation,
  archive: archiveDocumentation,
  // Constantes
  categories: DOCUMENTATION_CATEGORIES,
};

export default documentationService;
