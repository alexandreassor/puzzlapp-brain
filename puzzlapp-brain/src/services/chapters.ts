import { supabase } from '@/lib/supabase';
import type { Chapter, ChapterWithSections } from '@/types';

export interface CreateChapterInput {
  title: string;
  order?: number;
  status?: 'draft' | 'review' | 'published';
}

export interface UpdateChapterInput {
  title?: string;
  order?: number;
  status?: 'draft' | 'review' | 'published';
}

export const chaptersService = {
  /**
   * Get all chapters ordered by their order field
   */
  async getAll(): Promise<Chapter[]> {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('[Chapters] Error fetching chapters:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single chapter by ID
   */
  async getById(id: string): Promise<Chapter | null> {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('[Chapters] Error fetching chapter:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get a chapter with all its sections
   */
  async getWithSections(id: string): Promise<ChapterWithSections | null> {
    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single();

    if (chapterError) {
      if (chapterError.code === 'PGRST116') return null;
      throw chapterError;
    }

    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .eq('chapter_id', id)
      .order('order', { ascending: true });

    if (sectionsError) {
      throw sectionsError;
    }

    return {
      ...chapter,
      sections: sections || [],
    };
  },

  /**
   * Create a new chapter
   */
  async create(input: CreateChapterInput): Promise<Chapter> {
    // Get the next order number if not provided
    let order = input.order;
    if (order === undefined) {
      const { data: chapters } = await supabase
        .from('chapters')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

      order = chapters && chapters.length > 0 ? chapters[0].order + 1 : 1;
    }

    const { data, error } = await supabase
      .from('chapters')
      .insert({
        title: input.title,
        order,
        status: input.status || 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('[Chapters] Error creating chapter:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a chapter
   */
  async update(id: string, input: UpdateChapterInput): Promise<Chapter> {
    const { data, error } = await supabase
      .from('chapters')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Chapters] Error updating chapter:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a chapter and all its sections
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Chapters] Error deleting chapter:', error);
      throw error;
    }
  },

  /**
   * Reorder chapters by providing an array of IDs in the new order
   */
  async reorder(chapterIds: string[]): Promise<void> {
    const updates = chapterIds.map((id, index) => ({
      id,
      order: index + 1,
    }));

    // Update each chapter's order
    for (const update of updates) {
      const { error } = await supabase
        .from('chapters')
        .update({ order: update.order })
        .eq('id', update.id);

      if (error) {
        console.error('[Chapters] Error reordering chapter:', error);
        throw error;
      }
    }
  },

  /**
   * Change chapter status
   */
  async updateStatus(id: string, status: 'draft' | 'review' | 'published'): Promise<Chapter> {
    return this.update(id, { status });
  },
};
