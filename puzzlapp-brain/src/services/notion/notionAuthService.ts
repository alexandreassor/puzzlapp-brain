/**
 * Service d'authentification Notion OAuth
 *
 * Gère le flow OAuth pour connecter le workspace Notion de l'utilisateur
 */

import { supabase } from '@/lib/supabase';
import type { NotionConnectionPublic } from '@/types/notion';

// Configuration OAuth Notion
const NOTION_CLIENT_ID = import.meta.env.VITE_NOTION_CLIENT_ID;
const NOTION_REDIRECT_URI = import.meta.env.VITE_NOTION_REDIRECT_URI || `${window.location.origin}/auth/notion/callback`;
const NOTION_OAUTH_URL = 'https://api.notion.com/v1/oauth/authorize';

/**
 * Démarre le flow OAuth Notion
 * Ouvre une popup pour l'autorisation
 */
export function startNotionOAuth(): void {
  if (!NOTION_CLIENT_ID) {
    console.error('VITE_NOTION_CLIENT_ID is not configured');
    throw new Error('Notion OAuth is not configured');
  }

  const params = new URLSearchParams({
    client_id: NOTION_CLIENT_ID,
    redirect_uri: NOTION_REDIRECT_URI,
    response_type: 'code',
    owner: 'user',
  });

  const authUrl = `${NOTION_OAUTH_URL}?${params.toString()}`;

  // Ouvrir dans une popup centrée
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    authUrl,
    'notion-oauth',
    `width=${width},height=${height},left=${left},top=${top},popup=1`
  );

  if (!popup) {
    // Si la popup est bloquée, rediriger
    window.location.href = authUrl;
  }
}

/**
 * Traite le callback OAuth et échange le code pour un token
 */
export async function handleNotionCallback(code: string): Promise<NotionConnectionPublic> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('User must be logged in to connect Notion');
  }

  // Appeler l'Edge Function pour échanger le code
  const response = await supabase.functions.invoke('notion-oauth', {
    body: {
      code,
      redirect_uri: NOTION_REDIRECT_URI,
    },
  });

  if (response.error) {
    console.error('Notion OAuth error:', response.error);
    throw new Error(response.error.message || 'Failed to connect Notion');
  }

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to connect Notion');
  }

  return {
    id: '', // Will be filled by getNotionConnection
    workspace_id: response.data.workspace_id,
    workspace_name: response.data.workspace_name,
    workspace_icon: response.data.workspace_icon,
    connected_at: new Date().toISOString(),
  };
}

/**
 * Récupère la connexion Notion de l'utilisateur courant
 */
export async function getNotionConnection(): Promise<NotionConnectionPublic | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('notion_connections')
    .select('id, workspace_id, workspace_name, workspace_icon, connected_at')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No connection found
      return null;
    }
    console.error('Error fetching Notion connection:', error);
    throw error;
  }

  return data;
}

/**
 * Déconnecte Notion pour l'utilisateur courant
 */
export async function disconnectNotion(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User must be logged in');
  }

  const { error } = await supabase
    .from('notion_connections')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error disconnecting Notion:', error);
    throw error;
  }
}

/**
 * Vérifie si l'utilisateur a une connexion Notion active
 */
export async function isNotionConnected(): Promise<boolean> {
  const connection = await getNotionConnection();
  return connection !== null;
}

/**
 * Récupère le token d'accès Notion (usage interne seulement)
 * Note: Le token est stocké côté serveur, cette fonction ne doit être utilisée
 * que par les Edge Functions ou le backend
 */
export async function getNotionAccessToken(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Note: Cette requête ne fonctionnera que si l'utilisateur a les droits RLS appropriés
  // En pratique, le token devrait être récupéré côté serveur
  const { data, error } = await supabase
    .from('notion_connections')
    .select('access_token')
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data.access_token;
}

export const notionAuthService = {
  startOAuth: startNotionOAuth,
  handleCallback: handleNotionCallback,
  getConnection: getNotionConnection,
  disconnect: disconnectNotion,
  isConnected: isNotionConnected,
  getAccessToken: getNotionAccessToken,
};

export default notionAuthService;
