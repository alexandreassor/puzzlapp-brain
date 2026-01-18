/**
 * Service de gestion des figures (images, screenshots, infographies)
 *
 * Upload vers Supabase Storage + métadonnées en base
 */

import { supabase } from '@/lib/supabase';
import type { Figure, FigureType, FigureWidth } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateFigureInput {
  title: string;
  description?: string;
  chapter_id?: string;
  figure_type?: FigureType;
  width?: FigureWidth;
}

export interface UpdateFigureInput {
  title?: string;
  description?: string;
  chapter_id?: string;
  figure_type?: FigureType;
  width?: FigureWidth;
  order_num?: number;
}

const BUCKET_NAME = 'memoire-figures';

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Génère un code unique pour la figure (fig-{chapterOrder}-{figureNum})
 */
async function generateFigureCode(chapterId?: string): Promise<string> {
  if (!chapterId) {
    // Figure sans chapitre : fig-0-{timestamp}
    return `fig-0-${Date.now().toString(36)}`;
  }

  // Récupérer l'ordre du chapitre
  const { data: chapter } = await supabase
    .from('chapters')
    .select('order')
    .eq('id', chapterId)
    .single();

  const chapterOrder = chapter?.order || 0;

  // Compter les figures existantes dans ce chapitre
  const { count } = await supabase
    .from('figures')
    .select('*', { count: 'exact', head: true })
    .eq('chapter_id', chapterId);

  const figureNum = (count || 0) + 1;

  return `fig-${chapterOrder}-${figureNum}`;
}

/**
 * Génère l'URL publique d'un fichier dans Storage
 */
function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

// =============================================================================
// SERVICE
// =============================================================================

export const figuresService = {
  /**
   * Upload une image et crée la figure
   */
  async upload(
    file: File,
    input: CreateFigureInput
  ): Promise<Figure> {
    // Générer le code
    const code = await generateFigureCode(input.chapter_id);

    // Extension du fichier
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const storagePath = input.chapter_id
      ? `${input.chapter_id}/${code}.${ext}`
      : `misc/${code}.${ext}`;

    // Upload vers Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // URL publique
    const publicUrl = getPublicUrl(storagePath);

    // Calculer order_num
    const { count } = await supabase
      .from('figures')
      .select('*', { count: 'exact', head: true })
      .eq('chapter_id', input.chapter_id || null);

    const orderNum = (count || 0) + 1;

    // Créer l'entrée en base
    const { data, error } = await supabase
      .from('figures')
      .insert({
        code,
        title: input.title,
        description: input.description,
        storage_path: storagePath,
        public_url: publicUrl,
        chapter_id: input.chapter_id,
        figure_type: input.figure_type || 'image',
        width: input.width || 'full',
        order_num: orderNum,
      })
      .select()
      .single();

    if (error) {
      // Nettoyer le fichier uploadé en cas d'erreur
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
      throw error;
    }

    return data;
  },

  /**
   * Liste toutes les figures
   */
  async getAll(): Promise<Figure[]> {
    const { data, error } = await supabase
      .from('figures')
      .select('*')
      .order('chapter_id', { ascending: true })
      .order('order_num', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Liste les figures d'un chapitre
   */
  async getByChapter(chapterId: string): Promise<Figure[]> {
    const { data, error } = await supabase
      .from('figures')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order_num', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Récupère une figure par ID
   */
  async getById(id: string): Promise<Figure | null> {
    const { data, error } = await supabase
      .from('figures')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Récupère une figure par code
   */
  async getByCode(code: string): Promise<Figure | null> {
    const { data, error } = await supabase
      .from('figures')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Recherche de figures (pour autocomplete #fig:)
   */
  async search(query: string): Promise<Figure[]> {
    const searchTerm = `%${query}%`;

    const { data, error } = await supabase
      .from('figures')
      .select('*')
      .or(`code.ilike.${searchTerm},title.ilike.${searchTerm}`)
      .order('chapter_id', { ascending: true })
      .order('order_num', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  /**
   * Génère le prochain code pour un chapitre
   */
  async getNextCode(chapterId?: string): Promise<string> {
    return generateFigureCode(chapterId);
  },

  /**
   * Met à jour une figure
   */
  async update(id: string, input: UpdateFigureInput): Promise<Figure> {
    const updates: Record<string, unknown> = {};

    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.chapter_id !== undefined) updates.chapter_id = input.chapter_id;
    if (input.figure_type !== undefined) updates.figure_type = input.figure_type;
    if (input.width !== undefined) updates.width = input.width;
    if (input.order_num !== undefined) updates.order_num = input.order_num;

    const { data, error } = await supabase
      .from('figures')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Supprime une figure (fichier + métadonnées)
   */
  async delete(id: string): Promise<void> {
    // Récupérer la figure pour avoir le path
    const figure = await this.getById(id);
    if (!figure) return;

    // Supprimer le fichier du storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([figure.storage_path]);

    if (storageError) {
      console.warn('Erreur suppression fichier:', storageError);
    }

    // Supprimer l'entrée en base
    const { error } = await supabase
      .from('figures')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Remplace l'image d'une figure existante
   */
  async replaceImage(id: string, file: File): Promise<Figure> {
    const figure = await this.getById(id);
    if (!figure) throw new Error('Figure non trouvée');

    // Supprimer l'ancien fichier
    await supabase.storage.from(BUCKET_NAME).remove([figure.storage_path]);

    // Extension du nouveau fichier
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const newPath = figure.storage_path.replace(/\.[^.]+$/, `.${ext}`);

    // Upload le nouveau fichier
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newPath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Mettre à jour l'URL
    const publicUrl = getPublicUrl(newPath);

    const { data, error } = await supabase
      .from('figures')
      .update({
        storage_path: newPath,
        public_url: publicUrl,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
