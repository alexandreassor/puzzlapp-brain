/**
 * Service de gestion des notes/réflexions
 *
 * Mode brouillon pour capturer des idées, à trier ensuite
 */

import { supabase } from '@/lib/supabase';
import type { Note, NoteStatus, NoteWithLinks } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateNoteInput {
  content: string;
  linked_chapter_id?: string;
  linked_section_id?: string;
  tags?: string[];
  priority?: 0 | 1 | 2;
}

export interface UpdateNoteInput {
  content?: string;
  status?: NoteStatus;
  linked_chapter_id?: string | null;
  linked_section_id?: string | null;
  tags?: string[];
  priority?: 0 | 1 | 2;
}

export interface NotesFilter {
  status?: NoteStatus | NoteStatus[];
  chapterId?: string;
  sectionId?: string;
  tags?: string[];
  priority?: 0 | 1 | 2;
}

// =============================================================================
// SERVICE
// =============================================================================

export const notesService = {
  /**
   * Liste toutes les notes de l'utilisateur courant
   */
  async getAll(filter?: NotesFilter): Promise<Note[]> {
    let query = supabase
      .from('notes')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (filter?.status) {
      if (Array.isArray(filter.status)) {
        query = query.in('status', filter.status);
      } else {
        query = query.eq('status', filter.status);
      }
    }

    if (filter?.chapterId) {
      query = query.eq('linked_chapter_id', filter.chapterId);
    }

    if (filter?.sectionId) {
      query = query.eq('linked_section_id', filter.sectionId);
    }

    if (filter?.priority !== undefined) {
      query = query.eq('priority', filter.priority);
    }

    if (filter?.tags && filter.tags.length > 0) {
      query = query.overlaps('tags', filter.tags);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /**
   * Récupère une note par ID
   */
  async getById(id: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
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
   * Récupère une note avec ses liens (chapitre/section)
   */
  async getWithLinks(id: string): Promise<NoteWithLinks | null> {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        chapter:chapters(*),
        section:sections(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data as NoteWithLinks;
  },

  /**
   * Crée une nouvelle note
   */
  async create(input: CreateNoteInput): Promise<Note> {
    // Récupérer l'utilisateur courant
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    const { data, error } = await supabase
      .from('notes')
      .insert({
        content: input.content,
        linked_chapter_id: input.linked_chapter_id || null,
        linked_section_id: input.linked_section_id || null,
        tags: input.tags || [],
        priority: input.priority ?? 0,
        status: 'draft',
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Met à jour une note
   */
  async update(id: string, input: UpdateNoteInput): Promise<Note> {
    const updates: Record<string, unknown> = {};

    if (input.content !== undefined) updates.content = input.content;
    if (input.status !== undefined) updates.status = input.status;
    if (input.linked_chapter_id !== undefined) updates.linked_chapter_id = input.linked_chapter_id;
    if (input.linked_section_id !== undefined) updates.linked_section_id = input.linked_section_id;
    if (input.tags !== undefined) updates.tags = input.tags;
    if (input.priority !== undefined) updates.priority = input.priority;

    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Supprime une note
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ===========================================================================
  // ACTIONS RAPIDES
  // ===========================================================================

  /**
   * Marque une note comme "gardée"
   */
  async keep(id: string): Promise<Note> {
    return this.update(id, { status: 'kept' });
  },

  /**
   * Marque une note comme "écartée"
   */
  async discard(id: string): Promise<Note> {
    return this.update(id, { status: 'discarded' });
  },

  /**
   * Marque une note comme "intégrée" (après copie dans une section)
   */
  async markIntegrated(id: string): Promise<Note> {
    return this.update(id, { status: 'integrated' });
  },

  /**
   * Remet une note en brouillon
   */
  async revertToDraft(id: string): Promise<Note> {
    return this.update(id, { status: 'draft' });
  },

  /**
   * Change la priorité d'une note
   */
  async setPriority(id: string, priority: 0 | 1 | 2): Promise<Note> {
    return this.update(id, { priority });
  },

  /**
   * Lie une note à un chapitre
   */
  async linkToChapter(id: string, chapterId: string): Promise<Note> {
    return this.update(id, { linked_chapter_id: chapterId, linked_section_id: null });
  },

  /**
   * Lie une note à une section
   */
  async linkToSection(id: string, sectionId: string, chapterId?: string): Promise<Note> {
    return this.update(id, {
      linked_section_id: sectionId,
      linked_chapter_id: chapterId || null,
    });
  },

  /**
   * Supprime le lien avec chapitre/section
   */
  async unlink(id: string): Promise<Note> {
    return this.update(id, { linked_chapter_id: null, linked_section_id: null });
  },

  // ===========================================================================
  // STATISTIQUES
  // ===========================================================================

  /**
   * Compte les notes par statut
   */
  async getStats(): Promise<{
    draft: number;
    kept: number;
    discarded: number;
    integrated: number;
    total: number;
  }> {
    const notes = await this.getAll();

    const stats = {
      draft: 0,
      kept: 0,
      discarded: 0,
      integrated: 0,
      total: notes.length,
    };

    for (const note of notes) {
      stats[note.status]++;
    }

    return stats;
  },

  /**
   * Liste tous les tags utilisés
   */
  async getAllTags(): Promise<string[]> {
    const notes = await this.getAll();
    const tags = new Set<string>();

    for (const note of notes) {
      for (const tag of note.tags || []) {
        tags.add(tag);
      }
    }

    return Array.from(tags).sort();
  },
};
