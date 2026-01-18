import { supabase } from '@/lib/supabase';
import type {
  MemoirSource,
  MemoirSourceMapping,
  MemoirCitation,
  SourceType,
  SourceStatus,
  SourceRelevance,
} from '@/types/victor';

// =============================================================================
// SOURCES
// =============================================================================

export interface CreateSourceInput {
  citation_key: string;
  title: string;
  authors: string[];
  year?: number;
  type: SourceType;
  publisher?: string;
  doi?: string;
  isbn?: string;
  url?: string;
  status?: SourceStatus;
  abstract?: string;
  keywords?: string[];
  notes?: string;
}

export interface UpdateSourceInput {
  citation_key?: string;
  title?: string;
  authors?: string[];
  year?: number;
  type?: SourceType;
  publisher?: string;
  doi?: string;
  isbn?: string;
  url?: string;
  status?: SourceStatus;
  verified?: boolean;
  abstract?: string;
  keywords?: string[];
  notes?: string;
}

export const bibliographyService = {
  // ===========================================================================
  // SOURCES
  // ===========================================================================

  /**
   * Get all sources
   */
  async getAllSources(): Promise<MemoirSource[]> {
    const { data, error } = await supabase
      .from('memoir_sources')
      .select('*')
      .order('citation_key', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error fetching sources:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get sources by status
   */
  async getSourcesByStatus(status: SourceStatus): Promise<MemoirSource[]> {
    const { data, error } = await supabase
      .from('memoir_sources')
      .select('*')
      .eq('status', status)
      .order('citation_key', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error fetching sources by status:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a source by ID
   */
  async getSourceById(id: string): Promise<MemoirSource | null> {
    const { data, error } = await supabase
      .from('memoir_sources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[Bibliography] Error fetching source:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get a source by citation key
   */
  async getSourceByCitationKey(citationKey: string): Promise<MemoirSource | null> {
    const { data, error } = await supabase
      .from('memoir_sources')
      .select('*')
      .eq('citation_key', citationKey)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('[Bibliography] Error fetching source:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new source
   */
  async createSource(input: CreateSourceInput): Promise<MemoirSource> {
    const { data, error } = await supabase
      .from('memoir_sources')
      .insert({
        ...input,
        status: input.status || 'to_read',
        verified: false,
      })
      .select()
      .single();

    if (error) {
      console.error('[Bibliography] Error creating source:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a source
   */
  async updateSource(id: string, input: UpdateSourceInput): Promise<MemoirSource> {
    const { data, error } = await supabase
      .from('memoir_sources')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Bibliography] Error updating source:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a source
   */
  async deleteSource(id: string): Promise<void> {
    const { error } = await supabase
      .from('memoir_sources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Bibliography] Error deleting source:', error);
      throw error;
    }
  },

  /**
   * Search sources by title or authors
   */
  async searchSources(query: string): Promise<MemoirSource[]> {
    const { data, error } = await supabase
      .from('memoir_sources')
      .select('*')
      .or(`title.ilike.%${query}%,citation_key.ilike.%${query}%`)
      .order('citation_key', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error searching sources:', error);
      throw error;
    }

    return data || [];
  },

  // ===========================================================================
  // SOURCE MAPPINGS (Sources → Sections)
  // ===========================================================================

  /**
   * Get all mappings for a source
   */
  async getMappingsForSource(sourceId: string): Promise<MemoirSourceMapping[]> {
    const { data, error } = await supabase
      .from('memoir_source_mappings')
      .select('*')
      .eq('source_id', sourceId)
      .order('section_code', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error fetching mappings:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get all mappings for a section code
   */
  async getMappingsForSection(sectionCode: string): Promise<MemoirSourceMapping[]> {
    const { data, error } = await supabase
      .from('memoir_source_mappings')
      .select('*')
      .eq('section_code', sectionCode)
      .order('relevance', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error fetching mappings:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Create a mapping
   */
  async createMapping(input: {
    source_id: string;
    section_code: string;
    section_title?: string;
    relevance: SourceRelevance;
    concepts?: string[];
    usage_suggestion?: string;
  }): Promise<MemoirSourceMapping> {
    const { data, error } = await supabase
      .from('memoir_source_mappings')
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error('[Bibliography] Error creating mapping:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a mapping
   */
  async deleteMapping(id: string): Promise<void> {
    const { error } = await supabase
      .from('memoir_source_mappings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Bibliography] Error deleting mapping:', error);
      throw error;
    }
  },

  // ===========================================================================
  // CITATIONS
  // ===========================================================================

  /**
   * Get all citations for a source
   */
  async getCitationsForSource(sourceId: string): Promise<MemoirCitation[]> {
    const { data, error } = await supabase
      .from('memoir_citations')
      .select('*')
      .eq('source_id', sourceId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error fetching citations:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get citations used in a section
   */
  async getCitationsInSection(sectionCode: string): Promise<MemoirCitation[]> {
    const { data, error } = await supabase
      .from('memoir_citations')
      .select('*')
      .eq('used_in_section', sectionCode)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error fetching citations:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get unused citations (target_section set but not used_in_section)
   */
  async getUnusedCitations(): Promise<MemoirCitation[]> {
    const { data, error } = await supabase
      .from('memoir_citations')
      .select('*')
      .not('target_section', 'is', null)
      .is('used_in_section', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[Bibliography] Error fetching unused citations:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Create a citation
   */
  async createCitation(input: {
    source_id: string;
    quote: string;
    page?: string;
    is_paraphrase?: boolean;
    target_section?: string;
    context?: string;
    comment?: string;
  }): Promise<MemoirCitation> {
    const { data, error } = await supabase
      .from('memoir_citations')
      .insert({
        ...input,
        is_paraphrase: input.is_paraphrase || false,
      })
      .select()
      .single();

    if (error) {
      console.error('[Bibliography] Error creating citation:', error);
      throw error;
    }

    return data;
  },

  /**
   * Mark a citation as used in a section
   */
  async markCitationUsed(id: string, sectionCode: string): Promise<MemoirCitation> {
    const { data, error } = await supabase
      .from('memoir_citations')
      .update({
        used_in_section: sectionCode,
        used_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Bibliography] Error marking citation used:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a citation
   */
  async updateCitation(
    id: string,
    input: Partial<Omit<MemoirCitation, 'id' | 'created_at'>>
  ): Promise<MemoirCitation> {
    const { data, error } = await supabase
      .from('memoir_citations')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Bibliography] Error updating citation:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a citation
   */
  async deleteCitation(id: string): Promise<void> {
    const { error } = await supabase
      .from('memoir_citations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Bibliography] Error deleting citation:', error);
      throw error;
    }
  },

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  /**
   * Format a source as APA 7th edition citation
   */
  formatAPA(source: MemoirSource): string {
    const authors = source.authors.length > 0
      ? source.authors.length === 1
        ? source.authors[0]
        : source.authors.length === 2
          ? source.authors.join(' & ')
          : `${source.authors[0]} et al.`
      : 'Unknown';

    const year = source.year ? `(${source.year})` : '(n.d.)';

    switch (source.type) {
      case 'book':
        return `${authors} ${year}. *${source.title}*. ${source.publisher || ''}`.trim();

      case 'article':
        return `${authors} ${year}. ${source.title}. ${source.publisher || ''}${source.doi ? ` https://doi.org/${source.doi}` : ''}`.trim();

      case 'thesis_dec':
        return `${authors} ${year}. *${source.title}* [Mémoire DEC]. ${source.publisher || ''}`.trim();

      case 'web':
        return `${authors} ${year}. ${source.title}. ${source.url || ''}`.trim();

      case 'video':
        return `${authors} ${year}. *${source.title}* [Video]. ${source.url || ''}`.trim();

      default:
        return `${authors} ${year}. ${source.title}. ${source.publisher || ''}`.trim();
    }
  },

  /**
   * Get source statistics
   */
  async getStats(): Promise<{
    total: number;
    byStatus: Record<SourceStatus, number>;
    byType: Record<SourceType, number>;
    verified: number;
  }> {
    const sources = await this.getAllSources();

    const byStatus: Record<SourceStatus, number> = {
      to_read: 0,
      reading: 0,
      read: 0,
      key_source: 0,
    };

    const byType: Record<SourceType, number> = {
      book: 0,
      article: 0,
      thesis_dec: 0,
      report: 0,
      web: 0,
      video: 0,
    };

    let verified = 0;

    for (const source of sources) {
      byStatus[source.status]++;
      byType[source.type]++;
      if (source.verified) verified++;
    }

    return {
      total: sources.length,
      byStatus,
      byType,
      verified,
    };
  },
};
