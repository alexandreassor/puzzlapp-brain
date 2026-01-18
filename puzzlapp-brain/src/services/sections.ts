import { supabase } from '@/lib/supabase';
import type { Section } from '@/types';

export interface CreateSectionInput {
  chapter_id: string;
  title: string;
  order?: number;
  content_md?: string;
}

export interface UpdateSectionInput {
  title?: string;
  order?: number;
  content_md?: string;
}

export const sectionsService = {
  /**
   * Get all sections for a chapter
   */
  async getByChapter(chapterId: string): Promise<Section[]> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order', { ascending: true });

    if (error) {
      console.error('[Sections] Error fetching sections:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get all sections grouped by chapter ID
   */
  async getAllGroupedByChapter(): Promise<Map<string, Section[]>> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('[Sections] Error fetching all sections:', error);
      throw error;
    }

    const grouped = new Map<string, Section[]>();
    for (const section of data || []) {
      const existing = grouped.get(section.chapter_id) || [];
      grouped.set(section.chapter_id, [...existing, section]);
    }

    return grouped;
  },

  /**
   * Get a single section by ID
   */
  async getById(id: string): Promise<Section | null> {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('[Sections] Error fetching section:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new section
   */
  async create(input: CreateSectionInput): Promise<Section> {
    // Get the next order number if not provided
    let order = input.order;
    if (order === undefined) {
      const { data: sections } = await supabase
        .from('sections')
        .select('order')
        .eq('chapter_id', input.chapter_id)
        .order('order', { ascending: false })
        .limit(1);

      order = sections && sections.length > 0 ? sections[0].order + 1 : 1;
    }

    const { data, error } = await supabase
      .from('sections')
      .insert({
        chapter_id: input.chapter_id,
        title: input.title,
        order,
        content_md: input.content_md || '',
      })
      .select()
      .single();

    if (error) {
      console.error('[Sections] Error creating section:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a section
   */
  async update(id: string, input: UpdateSectionInput): Promise<Section> {
    const { data, error } = await supabase
      .from('sections')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Sections] Error updating section:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update only the content of a section
   */
  async updateContent(id: string, content_md: string): Promise<Section> {
    return this.update(id, { content_md });
  },

  /**
   * Delete a section
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Sections] Error deleting section:', error);
      throw error;
    }
  },

  /**
   * Reorder sections within a chapter
   */
  async reorder(chapterId: string, sectionIds: string[]): Promise<void> {
    const updates = sectionIds.map((id, index) => ({
      id,
      order: index + 1,
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from('sections')
        .update({ order: update.order })
        .eq('id', update.id)
        .eq('chapter_id', chapterId);

      if (error) {
        console.error('[Sections] Error reordering section:', error);
        throw error;
      }
    }
  },

  /**
   * Move a section to a different chapter
   */
  async moveToChapter(sectionId: string, newChapterId: string): Promise<Section> {
    // Get the next order in the new chapter
    const { data: sections } = await supabase
      .from('sections')
      .select('order')
      .eq('chapter_id', newChapterId)
      .order('order', { ascending: false })
      .limit(1);

    const newOrder = sections && sections.length > 0 ? sections[0].order + 1 : 1;

    const { data, error } = await supabase
      .from('sections')
      .update({
        chapter_id: newChapterId,
        order: newOrder,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sectionId)
      .select()
      .single();

    if (error) {
      console.error('[Sections] Error moving section:', error);
      throw error;
    }

    return data;
  },
};
