/**
 * Service de gestion des prompts des agents IA
 *
 * Permet de lire et modifier les prompts stockés dans Supabase
 * via l'interface admin.
 */

import { supabase } from '@/lib/supabase';

// =============================================================================
// TYPES
// =============================================================================

export interface AgentPrompt {
  id: string;
  agent_type: string;
  skill: string;
  name: string;
  description: string | null;
  system_prompt: string;
  allowed_tools: string[];
  max_turns: number;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface UpdatePromptInput {
  name?: string;
  description?: string;
  system_prompt?: string;
  allowed_tools?: string[];
  max_turns?: number;
}

export interface CreatePromptInput {
  agent_type: string;
  skill: string;
  name: string;
  description?: string;
  system_prompt: string;
  allowed_tools?: string[];
  max_turns?: number;
}

// URL du serveur d'agents (pour invalider le cache)
const AGENTS_SERVER_URL = import.meta.env.VITE_AGENTS_SERVER_URL || 'http://localhost:3001';

// =============================================================================
// SERVICE
// =============================================================================

export const promptsService = {
  /**
   * Liste tous les prompts d'un agent
   */
  async getPromptsByAgent(agentType: string): Promise<AgentPrompt[]> {
    const { data, error } = await supabase
      .from('agent_prompts')
      .select('*')
      .eq('agent_type', agentType)
      .order('skill');

    if (error) {
      console.error('[Prompts] Error fetching prompts:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Liste tous les prompts actifs
   */
  async getAllActivePrompts(): Promise<AgentPrompt[]> {
    const { data, error } = await supabase
      .from('agent_prompts')
      .select('*')
      .eq('is_active', true)
      .order('agent_type, skill');

    if (error) {
      console.error('[Prompts] Error fetching active prompts:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Récupère un prompt par son ID
   */
  async getPromptById(id: string): Promise<AgentPrompt | null> {
    const { data, error } = await supabase
      .from('agent_prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('[Prompts] Error fetching prompt:', error);
      throw error;
    }

    return data;
  },

  /**
   * Met à jour un prompt
   */
  async updatePrompt(id: string, updates: UpdatePromptInput): Promise<AgentPrompt> {
    const { data, error } = await supabase
      .from('agent_prompts')
      .update({
        ...updates,
        version: supabase.rpc('increment_version'), // Incrémenter la version
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Prompts] Error updating prompt:', error);
      throw error;
    }

    // Invalider le cache du serveur d'agents
    await this.invalidateCache(data.agent_type, data.skill);

    return data;
  },

  /**
   * Met à jour uniquement le contenu du prompt (méthode simplifiée)
   */
  async updatePromptContent(id: string, systemPrompt: string): Promise<AgentPrompt> {
    // Récupérer d'abord le prompt pour avoir la version actuelle
    const existing = await this.getPromptById(id);
    if (!existing) {
      throw new Error('Prompt not found');
    }

    const { data, error } = await supabase
      .from('agent_prompts')
      .update({
        system_prompt: systemPrompt,
        version: existing.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Prompts] Error updating prompt content:', error);
      throw error;
    }

    // Invalider le cache du serveur d'agents
    await this.invalidateCache(data.agent_type, data.skill);

    return data;
  },

  /**
   * Crée un nouveau prompt
   */
  async createPrompt(input: CreatePromptInput): Promise<AgentPrompt> {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('agent_prompts')
      .insert({
        ...input,
        allowed_tools: input.allowed_tools || [],
        max_turns: input.max_turns || 10,
        is_active: true,
        created_by: user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('[Prompts] Error creating prompt:', error);
      throw error;
    }

    return data;
  },

  /**
   * Désactive un prompt (soft delete)
   */
  async deactivatePrompt(id: string): Promise<void> {
    const { error } = await supabase
      .from('agent_prompts')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('[Prompts] Error deactivating prompt:', error);
      throw error;
    }
  },

  /**
   * Duplique un prompt (pour créer une nouvelle version)
   */
  async duplicatePrompt(id: string, newName: string): Promise<AgentPrompt> {
    const original = await this.getPromptById(id);
    if (!original) {
      throw new Error('Prompt not found');
    }

    return this.createPrompt({
      agent_type: original.agent_type,
      skill: original.skill,
      name: newName,
      description: original.description || undefined,
      system_prompt: original.system_prompt,
      allowed_tools: original.allowed_tools,
      max_turns: original.max_turns,
    });
  },

  /**
   * Invalide le cache du serveur d'agents
   */
  async invalidateCache(agentType: string, skill: string): Promise<void> {
    try {
      await fetch(`${AGENTS_SERVER_URL}/api/prompts/cache/invalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType, skill }),
      });
      console.log(`[Prompts] Cache invalidé pour ${agentType}/${skill}`);
    } catch (err) {
      // Ne pas bloquer si le serveur n'est pas accessible
      console.warn('[Prompts] Impossible d\'invalider le cache:', err);
    }
  },

  /**
   * Vide tout le cache du serveur d'agents
   */
  async clearAllCache(): Promise<void> {
    try {
      await fetch(`${AGENTS_SERVER_URL}/api/prompts/cache/clear`, {
        method: 'POST',
      });
      console.log('[Prompts] Cache entièrement vidé');
    } catch (err) {
      console.warn('[Prompts] Impossible de vider le cache:', err);
    }
  },

  /**
   * Liste les outils disponibles pour les agents
   */
  getAvailableTools(): string[] {
    return ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'Bash', 'WebSearch'];
  },

  /**
   * Liste les types d'agents disponibles
   */
  getAgentTypes(): Array<{ value: string; label: string; status: 'active' | 'coming_soon' }> {
    return [
      { value: 'victor', label: 'Victor (Rédaction)', status: 'active' },
      { value: 'leo', label: 'Léo (Guide)', status: 'coming_soon' },
      { value: 'sophie', label: 'Sophie (Avant-vente)', status: 'coming_soon' },
      { value: 'marc', label: 'Marc (Onboarding)', status: 'coming_soon' },
    ];
  },

  /**
   * Liste les skills par agent
   */
  getSkillsByAgent(agentType: string): string[] {
    const skillsMap: Record<string, string[]> = {
      victor: ['redaction', 'recherche', 'acquisition', 'plan', 'bibliographie', 'critique'],
      leo: ['guide', 'recommandation', 'coaching', 'diagnostic'],
      sophie: ['decouverte', 'proposition', 'negociation', 'closing'],
      marc: ['accueil', 'formation', 'suivi', 'validation'],
    };
    return skillsMap[agentType] || [];
  },
};
