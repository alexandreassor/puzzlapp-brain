/**
 * Service de gestion des annexes
 *
 * CRUD + recherche pour les documents annexes référençables via @
 */

import { supabase } from '@/lib/supabase';
import type { Annexe, AnnexeType, SectionAnnexe } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface CreateAnnexeInput {
  code: string;
  title: string;
  description?: string;
  content_md?: string;
  annexe_type?: AnnexeType;
  order_num?: number;
}

export interface UpdateAnnexeInput {
  code?: string;
  title?: string;
  description?: string;
  content_md?: string;
  annexe_type?: AnnexeType;
  order_num?: number;
}

// =============================================================================
// SERVICE
// =============================================================================

export const annexesService = {
  /**
   * Liste toutes les annexes
   */
  async getAll(): Promise<Annexe[]> {
    const { data, error } = await supabase
      .from('annexes')
      .select('*')
      .order('order_num', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Récupère une annexe par ID
   */
  async getById(id: string): Promise<Annexe | null> {
    const { data, error } = await supabase
      .from('annexes')
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
   * Récupère une annexe par code
   */
  async getByCode(code: string): Promise<Annexe | null> {
    const { data, error } = await supabase
      .from('annexes')
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
   * Recherche d'annexes par texte (pour autocomplete @)
   */
  async search(query: string): Promise<Annexe[]> {
    const searchTerm = `%${query}%`;

    const { data, error } = await supabase
      .from('annexes')
      .select('*')
      .or(`code.ilike.${searchTerm},title.ilike.${searchTerm}`)
      .order('order_num', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  /**
   * Crée une nouvelle annexe
   */
  async create(input: CreateAnnexeInput): Promise<Annexe> {
    // Normaliser le code en UPPER_SNAKE_CASE
    const normalizedCode = input.code
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

    const { data, error } = await supabase
      .from('annexes')
      .insert({
        code: normalizedCode,
        title: input.title,
        description: input.description,
        content_md: input.content_md,
        annexe_type: input.annexe_type || 'document',
        order_num: input.order_num || 1,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Met à jour une annexe
   */
  async update(id: string, input: UpdateAnnexeInput): Promise<Annexe> {
    const updates: Record<string, unknown> = {};

    if (input.code !== undefined) {
      updates.code = input.code
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
    }
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.content_md !== undefined) updates.content_md = input.content_md;
    if (input.annexe_type !== undefined) updates.annexe_type = input.annexe_type;
    if (input.order_num !== undefined) updates.order_num = input.order_num;

    const { data, error } = await supabase
      .from('annexes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Supprime une annexe
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('annexes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ===========================================================================
  // LIAISONS SECTION-ANNEXE
  // ===========================================================================

  /**
   * Lie une annexe à une section
   */
  async linkToSection(sectionId: string, annexeId: string): Promise<SectionAnnexe> {
    const { data, error } = await supabase
      .from('section_annexes')
      .insert({
        section_id: sectionId,
        annexe_id: annexeId,
      })
      .select()
      .single();

    if (error) {
      // Ignore les doublons
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('section_annexes')
          .select('*')
          .eq('section_id', sectionId)
          .eq('annexe_id', annexeId)
          .single();
        return existing as SectionAnnexe;
      }
      throw error;
    }
    return data;
  },

  /**
   * Supprime la liaison section-annexe
   */
  async unlinkFromSection(sectionId: string, annexeId: string): Promise<void> {
    const { error } = await supabase
      .from('section_annexes')
      .delete()
      .eq('section_id', sectionId)
      .eq('annexe_id', annexeId);

    if (error) throw error;
  },

  /**
   * Liste les annexes liées à une section
   */
  async getBySection(sectionId: string): Promise<Annexe[]> {
    const { data, error } = await supabase
      .from('section_annexes')
      .select('annexe_id, annexes(*)')
      .eq('section_id', sectionId);

    if (error) throw error;

    return (data || [])
      .map((item) => (item as unknown as { annexes: Annexe }).annexes)
      .filter(Boolean);
  },

  /**
   * Liste les sections utilisant une annexe
   */
  async getSectionsUsingAnnexe(annexeId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('section_annexes')
      .select('section_id')
      .eq('annexe_id', annexeId);

    if (error) throw error;
    return (data || []).map((item) => item.section_id);
  },
};
