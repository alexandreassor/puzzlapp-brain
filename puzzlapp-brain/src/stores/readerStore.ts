/**
 * Store Zustand pour l'interface Reader
 * Gère l'état de l'instance active et de l'onboarding
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CabinetInstance, CabinetInstanceFull } from '@/types/cabinet-instance';
import {
  getInstances,
  getInstance,
  getModelInstance,
  createInstance,
  duplicateInstance,
  MODEL_INSTANCE_ID,
} from '@/services/cabinet-instances';
import { supabase } from '@/lib/supabase';

// =============================================================================
// TYPES
// =============================================================================

interface ReaderState {
  // Instance active
  activeInstance: CabinetInstanceFull | null;
  activeInstanceId: string | null;

  // Liste des instances disponibles
  instances: CabinetInstance[];
  isLoadingInstances: boolean;

  // Onboarding
  onboardingCompleted: boolean;
  onboardingStep: number;

  // Navigation
  currentChapterId: string | null;
  currentSectionId: string | null;
  sidebarOpen: boolean;
}

interface ReaderActions {
  // Instance
  setActiveInstance: (instance: CabinetInstanceFull) => void;
  setActiveInstanceById: (id: string) => Promise<void>;
  loadInstances: () => Promise<void>;
  createNewInstance: (name: string) => Promise<CabinetInstance>;
  duplicateFromModel: (name: string) => Promise<CabinetInstance>;
  useModelInstance: () => void;

  // Onboarding
  setOnboardingCompleted: (completed: boolean) => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => Promise<void>;

  // Navigation
  setCurrentChapter: (id: string | null) => void;
  setCurrentSection: (id: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Reset
  reset: () => void;
}

type ReaderStore = ReaderState & ReaderActions;

// =============================================================================
// ÉTAT INITIAL
// =============================================================================

const initialState: ReaderState = {
  activeInstance: null,
  activeInstanceId: null,
  instances: [],
  isLoadingInstances: false,
  onboardingCompleted: false,
  onboardingStep: 0,
  currentChapterId: null,
  currentSectionId: null,
  sidebarOpen: true,
};

// =============================================================================
// STORE
// =============================================================================

export const useReaderStore = create<ReaderStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // =========================================================================
      // INSTANCE ACTIONS
      // =========================================================================

      setActiveInstance: (instance) => {
        set({ activeInstance: instance, activeInstanceId: instance.id });

        // Sauvegarder dans le profil si connecté
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            supabase
              .from('profiles')
              .update({ active_instance_id: instance.id })
              .eq('id', user.id)
              .then(() => {});
          }
        });
      },

      setActiveInstanceById: async (id) => {
        const instance = await getInstance(id);
        if (instance) {
          set({ activeInstance: instance, activeInstanceId: id });
        }
      },

      loadInstances: async () => {
        set({ isLoadingInstances: true });
        try {
          const instances = await getInstances();
          set({ instances, isLoadingInstances: false });
        } catch (error) {
          console.error('Failed to load instances:', error);
          set({ isLoadingInstances: false });
        }
      },

      createNewInstance: async (name) => {
        const newInstance = await createInstance({ name });
        await get().loadInstances();
        const fullInstance = await getInstance(newInstance.id);
        if (fullInstance) {
          get().setActiveInstance(fullInstance);
        }
        return newInstance;
      },

      duplicateFromModel: async (name) => {
        const newInstance = await duplicateInstance(MODEL_INSTANCE_ID, name);
        await get().loadInstances();
        const fullInstance = await getInstance(newInstance.id);
        if (fullInstance) {
          get().setActiveInstance(fullInstance);
        }
        return newInstance;
      },

      useModelInstance: () => {
        const modelInstance = getModelInstance();
        set({ activeInstance: modelInstance, activeInstanceId: MODEL_INSTANCE_ID });
      },

      // =========================================================================
      // ONBOARDING ACTIONS
      // =========================================================================

      setOnboardingCompleted: (completed) => {
        set({ onboardingCompleted: completed });
      },

      setOnboardingStep: (step) => {
        set({ onboardingStep: step });
      },

      completeOnboarding: async () => {
        set({ onboardingCompleted: true, onboardingStep: 3 });

        // Sauvegarder dans Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({ onboarding_completed: true })
            .eq('id', user.id);
        }
      },

      // =========================================================================
      // NAVIGATION ACTIONS
      // =========================================================================

      setCurrentChapter: (id) => {
        set({ currentChapterId: id });
      },

      setCurrentSection: (id) => {
        set({ currentSectionId: id });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      // =========================================================================
      // RESET
      // =========================================================================

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'puzzlapp-reader-store',
      // Ne persister que certains champs
      partialize: (state) => ({
        activeInstanceId: state.activeInstanceId,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// =============================================================================
// HOOKS DÉRIVÉS
// =============================================================================

/**
 * Hook pour initialiser le store avec les données du profil
 */
export async function initializeReaderStore() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Charger le profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, active_instance_id')
    .eq('id', user.id)
    .single();

  if (profile) {
    const store = useReaderStore.getState();

    // Mettre à jour l'onboarding
    store.setOnboardingCompleted(profile.onboarding_completed || false);

    // Charger l'instance active
    if (profile.active_instance_id) {
      await store.setActiveInstanceById(profile.active_instance_id);
    } else {
      // Par défaut, utiliser l'instance modèle
      store.useModelInstance();
    }

    // Charger toutes les instances
    await store.loadInstances();
  }
}

// Export par défaut
export default useReaderStore;
