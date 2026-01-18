import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mapAuthError } from '@/utils/authErrorMapper';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'reader';
  cabinet_id?: string;
}

interface Cabinet {
  id: string;
  name: string;
  siren?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  cabinet: Cabinet | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper pour détecter les erreurs d'annulation (React StrictMode)
function isAbortError(err: unknown): boolean {
  if (err instanceof Error) {
    return err.name === 'AbortError' || err.message.includes('aborted');
  }
  if (typeof err === 'object' && err !== null) {
    const e = err as { message?: string; code?: string };
    return e.message?.includes('aborted') || e.code === 'ABORT_ERR';
  }
  return false;
}

// Cache global pour survivre au HMR
declare global {
  interface Window {
    __PUZZLAPP_AUTH_CACHE__?: {
      user: User | null;
      session: Session | null;
      profile: Profile | null;
      cabinet: Cabinet | null;
      initialized: boolean;
    };
  }
}

// Initialiser le cache si nécessaire
if (!window.__PUZZLAPP_AUTH_CACHE__) {
  window.__PUZZLAPP_AUTH_CACHE__ = {
    user: null,
    session: null,
    profile: null,
    cabinet: null,
    initialized: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const cache = window.__PUZZLAPP_AUTH_CACHE__!;

  const [user, setUser] = useState<User | null>(cache.user);
  const [session, setSession] = useState<Session | null>(cache.session);
  const [profile, setProfile] = useState<Profile | null>(cache.profile);
  const [cabinet, setCabinet] = useState<Cabinet | null>(cache.cabinet);
  const [isLoading, setIsLoading] = useState(!cache.initialized);

  // Fonctions de mise à jour qui synchronisent aussi le cache
  const updateUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    cache.user = newUser;
  }, [cache]);

  const updateSession = useCallback((newSession: Session | null) => {
    setSession(newSession);
    cache.session = newSession;
  }, [cache]);

  const updateProfile = useCallback((newProfile: Profile | null) => {
    setProfile(newProfile);
    cache.profile = newProfile;
  }, [cache]);

  const updateCabinet = useCallback((newCabinet: Cabinet | null) => {
    setCabinet(newCabinet);
    cache.cabinet = newCabinet;
  }, [cache]);

  const loadProfile = useCallback(async (userId: string, signal?: { cancelled: boolean }) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Vérifier si annulé avant de continuer
      if (signal?.cancelled) return;

      if (profileError) {
        // Ignorer les erreurs d'abort
        if (isAbortError(profileError)) return;
        console.error('[Auth] Erreur chargement profil:', profileError);
        return;
      }

      updateProfile(profileData);

      // Charger le cabinet si l'utilisateur en a un
      if (profileData?.cabinet_id) {
        const { data: cabinetData } = await supabase
          .from('cabinets')
          .select('*')
          .eq('id', profileData.cabinet_id)
          .single();

        if (signal?.cancelled) return;

        if (cabinetData) {
          updateCabinet(cabinetData);
        }
      }
    } catch (err) {
      // Ignorer les erreurs d'abort (React StrictMode)
      if (isAbortError(err)) return;
      console.error('[Auth] Erreur:', err);
    }
  }, [updateProfile, updateCabinet]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      cache.initialized = true;
      return;
    }

    // Si déjà initialisé (HMR), ne pas recharger
    if (cache.initialized && cache.session) {
      setIsLoading(false);
      return;
    }

    const signal = { cancelled: false };

    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (signal.cancelled) return;

        if (currentSession?.user) {
          updateSession(currentSession);
          updateUser(currentSession.user);
          await loadProfile(currentSession.user.id, signal);
        }
      } catch (err) {
        // Ignorer les erreurs d'abort (React StrictMode)
        if (isAbortError(err)) return;
        console.error('[Auth] Erreur init:', err);
      } finally {
        if (!signal.cancelled) {
          setIsLoading(false);
          cache.initialized = true;
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (signal.cancelled) return;

      if (event === 'INITIAL_SESSION') return;

      updateSession(newSession);
      updateUser(newSession?.user ?? null);

      if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        await loadProfile(newSession.user.id, signal);
      } else if (!newSession) {
        updateProfile(null);
        updateCabinet(null);
      }
    });

    return () => {
      signal.cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile, cache, updateSession, updateUser, updateProfile, updateCabinet]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const mapped = mapAuthError(error.message);
        return { error: mapped.message };
      }
      return { error: null };
    } catch (err) {
      const mapped = mapAuthError(err instanceof Error ? err.message : 'NetworkError');
      return { error: mapped.message };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            role: 'reader' // Par défaut, les nouveaux utilisateurs sont des lecteurs
          }
        }
      });

      if (error) {
        const mapped = mapAuthError(error.message);
        return { error: mapped.message };
      }
      if (!data.user) {
        return { error: 'Une erreur est survenue lors de la création du compte.' };
      }

      return { error: null };
    } catch (err) {
      const mapped = mapAuthError(err instanceof Error ? err.message : 'NetworkError');
      return { error: mapped.message };
    }
  }, []);

  const signOut = useCallback(async () => {
    // Réinitialiser le cache
    cache.user = null;
    cache.session = null;
    cache.profile = null;
    cache.cabinet = null;
    cache.initialized = false;

    setProfile(null);
    setCabinet(null);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  }, [cache]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id, { cancelled: false });
    }
  }, [user, loadProfile]);

  const value: AuthContextType = {
    user,
    session,
    profile,
    cabinet,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
