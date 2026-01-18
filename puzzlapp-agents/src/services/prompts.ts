/**
 * Service de gestion des prompts depuis Supabase
 *
 * Permet de charger et mettre en cache les prompts des agents
 * avec fallback vers les prompts locaux si Supabase est indisponible.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types
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
}

// Cache des prompts (TTL: 5 minutes)
interface CacheEntry {
  prompt: AgentPrompt;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const promptsCache = new Map<string, CacheEntry>();

// Client Supabase
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.warn('[Prompts] Supabase non configuré - utilisation des prompts locaux');
    return null;
  }

  supabase = createClient(url, key);
  return supabase;
}

/**
 * Récupère un prompt depuis Supabase (avec cache)
 */
export async function getPrompt(
  agentType: string,
  skill: string
): Promise<AgentPrompt | null> {
  const cacheKey = `${agentType}:${skill}`;

  // Vérifier le cache
  const cached = promptsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.prompt;
  }

  // Récupérer depuis Supabase
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client
      .from('agent_prompts')
      .select('*')
      .eq('agent_type', agentType)
      .eq('skill', skill)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('[Prompts] Erreur Supabase:', error.message);
      return null;
    }

    if (data) {
      // Mettre en cache
      promptsCache.set(cacheKey, {
        prompt: data as AgentPrompt,
        timestamp: Date.now(),
      });
      return data as AgentPrompt;
    }

    return null;
  } catch (err) {
    console.error('[Prompts] Erreur réseau:', err);
    return null;
  }
}

/**
 * Récupère tous les prompts d'un agent
 */
export async function getAgentPrompts(agentType: string): Promise<AgentPrompt[]> {
  const client = getSupabaseClient();
  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('agent_prompts')
      .select('*')
      .eq('agent_type', agentType)
      .eq('is_active', true)
      .order('skill');

    if (error) {
      console.error('[Prompts] Erreur Supabase:', error.message);
      return [];
    }

    return (data || []) as AgentPrompt[];
  } catch (err) {
    console.error('[Prompts] Erreur réseau:', err);
    return [];
  }
}

/**
 * Vide le cache des prompts
 */
export function clearPromptsCache(): void {
  promptsCache.clear();
  console.log('[Prompts] Cache vidé');
}

/**
 * Invalide un prompt spécifique du cache
 */
export function invalidatePrompt(agentType: string, skill: string): void {
  const cacheKey = `${agentType}:${skill}`;
  promptsCache.delete(cacheKey);
}
