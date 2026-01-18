/**
 * Hook d'intégration Agent → Notion
 *
 * Permet aux agents IA (Sophie, Marc, Léo) de proposer et créer
 * des espaces Notion personnalisés pour les utilisateurs.
 *
 * Flow d'utilisation :
 * 1. Agent termine un parcours avec l'utilisateur
 * 2. Agent appelle `proposeWorkspace(templateId, deliverables)`
 * 3. Hook retourne le message formaté et les actions disponibles
 * 4. Utilisateur accepte → Hook déclenche la création
 * 5. Agent reçoit le résultat pour informer l'utilisateur
 *
 * @example
 * // Dans un agent (Sophie, fin du parcours Avant-Vente)
 * const { proposeWorkspace, isBuilding, result } = useAgentNotionIntegration();
 *
 * // Quand l'utilisateur termine
 * const proposal = proposeWorkspace('avant-vente', deliverables, 'Sophie', '👩‍💼');
 *
 * // Afficher le modal avec proposal.openModal()
 * // ou utiliser proposal.message pour un affichage custom
 *
 * @author PuzzlApp Brain - Phase 6 BYON
 */

import { useState, useCallback } from 'react';
import { useNotionExport } from './useNotionExport';
import {
  notionMCPService,
  WORKSPACE_TEMPLATES,
  type WorkspaceCreationResult,
} from '@/services/notion';
import type { Deliverable } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface AgentNotionProposal {
  /** Message formaté pour l'agent à afficher */
  message: string;
  /** ID du template proposé */
  templateId: string;
  /** Nom du template */
  templateName: string;
  /** Description courte */
  description: string;
  /** Est-ce que l'utilisateur est connecté à Notion */
  isNotionConnected: boolean;
  /** Livrables à inclure */
  deliverables: Deliverable[];
  /** Fonction pour ouvrir le modal de création */
  openModal: () => void;
  /** Fonction pour créer directement (si déjà connecté) */
  createNow: () => Promise<WorkspaceCreationResult>;
}

export interface UseAgentNotionIntegrationReturn {
  /** Proposer un workspace à l'utilisateur */
  proposeWorkspace: (
    templateId: string,
    deliverables?: Deliverable[],
    agentName?: string,
    agentEmoji?: string
  ) => AgentNotionProposal | null;

  /** Est-ce que la création est en cours */
  isBuilding: boolean;

  /** Progression de la création (0-100) */
  buildProgress: number;

  /** Résultat de la dernière création */
  lastResult: WorkspaceCreationResult | null;

  /** Erreur éventuelle */
  error: string | null;

  /** Est-ce que le modal de création doit s'ouvrir */
  showBuilderModal: boolean;

  /** Paramètres du modal (template, agent, etc.) */
  builderModalParams: {
    templateId: string;
    agentName: string;
    agentEmoji: string;
    deliverables: Deliverable[];
    parcoursName?: string;
  } | null;

  /** Fermer le modal */
  closeBuilderModal: () => void;

  /** Réinitialiser l'état */
  reset: () => void;
}

// =============================================================================
// HOOK PRINCIPAL
// =============================================================================

export function useAgentNotionIntegration(): UseAgentNotionIntegrationReturn {
  // État Notion existant
  const { isConnected, connection: _connection } = useNotionExport();

  // État de création
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [lastResult, setLastResult] = useState<WorkspaceCreationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // État du modal
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [builderModalParams, setBuilderModalParams] = useState<{
    templateId: string;
    agentName: string;
    agentEmoji: string;
    deliverables: Deliverable[];
    parcoursName?: string;
  } | null>(null);

  /**
   * Proposer un workspace à l'utilisateur
   */
  const proposeWorkspace = useCallback((
    templateId: string,
    deliverables: Deliverable[] = [],
    agentName: string = 'Léo',
    agentEmoji: string = '🤖'
  ): AgentNotionProposal | null => {
    const template = WORKSPACE_TEMPLATES[templateId];
    if (!template) return null;

    // Générer le message de proposition
    const message = notionMCPService.generateAgentProposal(
      agentName,
      templateId,
      deliverables.length
    );

    // Fonction pour ouvrir le modal
    const openModal = () => {
      setBuilderModalParams({
        templateId,
        agentName,
        agentEmoji,
        deliverables,
        parcoursName: template.name,
      });
      setShowBuilderModal(true);
    };

    // Fonction pour créer directement
    const createNow = async (): Promise<WorkspaceCreationResult> => {
      if (!isConnected) {
        return {
          success: false,
          databases: [],
          pages: [],
          error: 'Non connecté à Notion. Veuillez d\'abord vous connecter.',
        };
      }

      setIsBuilding(true);
      setBuildProgress(0);
      setError(null);

      try {
        // Récupérer l'utilisateur courant
        const { supabase } = await import('@/lib/supabase');
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('Utilisateur non authentifié');
        }

        // Créer le workspace
        const result = await notionMCPService.createWorkspaceFromTemplate(
          user.id,
          templateId,
          deliverables
        );

        setLastResult(result);
        setBuildProgress(100);

        if (!result.success) {
          setError(result.error || 'Erreur inconnue');
        }

        return result;

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur de création';
        setError(errorMessage);
        return {
          success: false,
          databases: [],
          pages: [],
          error: errorMessage,
        };
      } finally {
        setIsBuilding(false);
      }
    };

    return {
      message,
      templateId,
      templateName: template.name,
      description: template.description,
      isNotionConnected: isConnected,
      deliverables,
      openModal,
      createNow,
    };
  }, [isConnected]);

  /**
   * Fermer le modal
   */
  const closeBuilderModal = useCallback(() => {
    setShowBuilderModal(false);
    setBuilderModalParams(null);
  }, []);

  /**
   * Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setIsBuilding(false);
    setBuildProgress(0);
    setLastResult(null);
    setError(null);
    setShowBuilderModal(false);
    setBuilderModalParams(null);
  }, []);

  return {
    proposeWorkspace,
    isBuilding,
    buildProgress,
    lastResult,
    error,
    showBuilderModal,
    builderModalParams,
    closeBuilderModal,
    reset,
  };
}

// =============================================================================
// HELPERS POUR LES AGENTS
// =============================================================================

/**
 * Configuration des agents avec leurs templates Notion associés
 */
export const AGENT_NOTION_CONFIG = {
  sophie: {
    name: 'Sophie',
    emoji: '👩‍💼',
    description: 'Experte Change Management & Design Thinking',
    defaultTemplate: 'avant-vente',
    parcours: ['avant-vente'],
  },
  marc: {
    name: 'Marc',
    emoji: '👨‍💻',
    description: 'Expert Onboarding & Intégration Client',
    defaultTemplate: 'onboarding-client',
    parcours: ['onboarding-client'],
  },
  leo: {
    name: 'Léo',
    emoji: '🤖',
    description: 'Orchestrateur KM & Stratégie',
    defaultTemplate: 'km-livrables',
    parcours: ['avant-vente', 'onboarding-client', 'production'],
  },
} as const;

/**
 * Génère un message de fin de parcours pour un agent
 */
export function generateParcoursCompletionMessage(
  agentType: 'sophie' | 'marc' | 'leo',
  parcoursName: string,
  deliverableCount: number
): string {
  const agent = AGENT_NOTION_CONFIG[agentType];
  const template = WORKSPACE_TEMPLATES[agent.defaultTemplate];

  if (!template) {
    return `🎉 Bravo ! Tu as terminé le parcours "${parcoursName}" avec ${deliverableCount} livrable${deliverableCount > 1 ? 's' : ''} !`;
  }

  const dbNames = template.databases.map(db => db.name).join(', ');

  return `🎉 **Félicitations !** Tu as terminé le parcours "${parcoursName}" !

Tu as généré **${deliverableCount} livrable${deliverableCount > 1 ? 's' : ''}** pendant ton parcours.

💡 Je peux maintenant créer ton espace Notion avec :
- ${dbNames}
${template.pages.length > 0 ? `- ${template.pages.length} template${template.pages.length > 1 ? 's' : ''} prêt${template.pages.length > 1 ? 's' : ''} à l'emploi` : ''}

Tout sera dans TON Notion, tu gardes le contrôle !`;
}

export default useAgentNotionIntegration;
