/**
 * Service de gestion des brouillons de contenu
 *
 * Permet de créer, valider et intégrer du contenu Markdown
 * avant de le positionner dans la structure du mémoire
 */

import { supabase } from '@/lib/supabase';
import type { ContentDraft, ContentDraftStatus, Section } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateDraftInput {
  title: string;
  content_md?: string;
  target_chapter_id?: string;
  tags?: string[];
}

export interface UpdateDraftInput {
  title?: string;
  content_md?: string;
  status?: ContentDraftStatus;
  target_chapter_id?: string | null;
  target_section_id?: string | null;
  tags?: string[];
}

export interface DraftsFilter {
  status?: ContentDraftStatus;
  chapterId?: string;
}

// =============================================================================
// SERVICE
// =============================================================================

export const contentDraftsService = {
  /**
   * Liste tous les brouillons de l'utilisateur
   */
  async getAll(filter?: DraftsFilter): Promise<ContentDraft[]> {
    let query = supabase
      .from('content_drafts')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    if (filter?.chapterId) {
      query = query.eq('target_chapter_id', filter.chapterId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * Récupère un brouillon par ID
   */
  async getById(id: string): Promise<ContentDraft | null> {
    const { data, error } = await supabase
      .from('content_drafts')
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
   * Crée un nouveau brouillon
   */
  async create(input: CreateDraftInput): Promise<ContentDraft> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('content_drafts')
      .insert({
        title: input.title,
        content_md: input.content_md || '',
        target_chapter_id: input.target_chapter_id || null,
        tags: input.tags || [],
        status: 'draft',
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Met à jour un brouillon
   */
  async update(id: string, input: UpdateDraftInput): Promise<ContentDraft> {
    const updates: Record<string, unknown> = {};

    if (input.title !== undefined) updates.title = input.title;
    if (input.content_md !== undefined) updates.content_md = input.content_md;
    if (input.status !== undefined) updates.status = input.status;
    if (input.target_chapter_id !== undefined) updates.target_chapter_id = input.target_chapter_id;
    if (input.target_section_id !== undefined) updates.target_section_id = input.target_section_id;
    if (input.tags !== undefined) updates.tags = input.tags;

    const { data, error } = await supabase
      .from('content_drafts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Supprime un brouillon
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('content_drafts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ===========================================================================
  // ACTIONS RAPIDES
  // ===========================================================================

  /**
   * Valide un brouillon (draft → validated)
   */
  async validate(id: string): Promise<ContentDraft> {
    return this.update(id, { status: 'validated' });
  },

  /**
   * Remet un brouillon en draft (validated → draft)
   */
  async revertToDraft(id: string): Promise<ContentDraft> {
    return this.update(id, { status: 'draft' });
  },

  // ===========================================================================
  // INTÉGRATION
  // ===========================================================================

  /**
   * Intègre le contenu d'un brouillon dans une section existante
   */
  async integrateToSection(
    draftId: string,
    sectionId: string,
    mode: 'append' | 'prepend' | 'replace' = 'append'
  ): Promise<void> {
    // Récupérer le brouillon
    const draft = await this.getById(draftId);
    if (!draft) throw new Error('Brouillon non trouvé');

    // Récupérer la section
    const { data: section, error: sectionError } = await supabase
      .from('sections')
      .select('*')
      .eq('id', sectionId)
      .single();

    if (sectionError) throw sectionError;
    if (!section) throw new Error('Section non trouvée');

    // Calculer le nouveau contenu
    let newContent: string;
    const currentContent = section.content_md || '';
    const draftContent = draft.content_md || '';

    switch (mode) {
      case 'prepend':
        newContent = draftContent + (currentContent ? '\n\n' + currentContent : '');
        break;
      case 'replace':
        newContent = draftContent;
        break;
      case 'append':
      default:
        newContent = (currentContent ? currentContent + '\n\n' : '') + draftContent;
        break;
    }

    // Mettre à jour la section
    const { error: updateError } = await supabase
      .from('sections')
      .update({ content_md: newContent })
      .eq('id', sectionId);

    if (updateError) throw updateError;

    // Marquer le brouillon comme intégré
    await this.update(draftId, {
      status: 'integrated',
      target_section_id: sectionId,
    });
  },

  /**
   * Crée une nouvelle section à partir d'un brouillon
   */
  async createSectionFromDraft(
    draftId: string,
    chapterId: string,
    title?: string
  ): Promise<Section> {
    // Récupérer le brouillon
    const draft = await this.getById(draftId);
    if (!draft) throw new Error('Brouillon non trouvé');

    // Récupérer l'ordre max des sections du chapitre
    const { data: sections } = await supabase
      .from('sections')
      .select('order')
      .eq('chapter_id', chapterId)
      .order('order', { ascending: false })
      .limit(1);

    const nextOrder = sections && sections.length > 0 ? sections[0].order + 1 : 1;

    // Créer la nouvelle section
    const { data: newSection, error } = await supabase
      .from('sections')
      .insert({
        chapter_id: chapterId,
        title: title || draft.title,
        content_md: draft.content_md,
        order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    // Marquer le brouillon comme intégré
    await this.update(draftId, {
      status: 'integrated',
      target_chapter_id: chapterId,
      target_section_id: newSection.id,
    });

    return newSection;
  },

  // ===========================================================================
  // STATISTIQUES
  // ===========================================================================

  /**
   * Compte les brouillons par statut
   */
  async getStats(): Promise<{
    draft: number;
    validated: number;
    integrated: number;
    total: number;
  }> {
    const drafts = await this.getAll();

    const stats = {
      draft: 0,
      validated: 0,
      integrated: 0,
      total: drafts.length,
    };

    for (const draft of drafts) {
      stats[draft.status]++;
    }

    return stats;
  },
};
