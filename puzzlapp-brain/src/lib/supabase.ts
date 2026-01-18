import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Clé de stockage unique
      storageKey: 'puzzlapp-brain-auth',
      // Note: Les erreurs AbortError en console (React StrictMode) sont cosmétiques
      // et n'affectent pas le fonctionnement de l'application
    },
  }
)

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
