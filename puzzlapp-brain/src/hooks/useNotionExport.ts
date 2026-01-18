/**
 * Hook useNotionExport
 *
 * Gère l'intégration Notion : connexion OAuth et export des livrables
 * Ce hook combine les services notionAuth et notionExport en une interface React simple
 */

import { useState, useEffect, useCallback } from 'react';
import type {
  NotionConnectionPublic,
  NotionExportStatus,
  NotionExportResult,
  NotionExportOptions,
} from '@/types/notion';
import type { Deliverable } from '@/types';
import {
  startNotionOAuth,
  handleNotionCallback,
  getNotionConnection,
  disconnectNotion,
} from '@/services/notion/notionAuthService';
import { exportToNotion, getExportHistory, isDeliverableExported } from '@/services/notion/notionExportService';

// =============================================================================
// TYPES
// =============================================================================

interface UseNotionExportState {
  // Connexion
  connection: NotionConnectionPublic | null;
  isConnected: boolean;
  isLoadingConnection: boolean;
  connectionError: string | null;

  // Export
  exportStatus: NotionExportStatus;
  exportProgress: number;
  exportResult: NotionExportResult | null;
  exportError: string | null;
}

interface UseNotionExportActions {
  // Connexion
  connect: () => void;
  disconnect: () => Promise<void>;
  handleOAuthCallback: (code: string) => Promise<void>;
  refreshConnection: () => Promise<void>;

  // Export
  exportDeliverables: (
    deliverables: Deliverable[],
    options?: NotionExportOptions,
    parcoursName?: string
  ) => Promise<NotionExportResult>;
  resetExport: () => void;

  // Historique
  checkIfExported: (deliverableId: string) => Promise<boolean>;
  fetchExportHistory: () => Promise<unknown[]>;
}

export type UseNotionExportReturn = UseNotionExportState & UseNotionExportActions;

// =============================================================================
// HOOK
// =============================================================================

export function useNotionExport(): UseNotionExportReturn {
  // État connexion
  const [connection, setConnection] = useState<NotionConnectionPublic | null>(null);
  const [isLoadingConnection, setIsLoadingConnection] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // État export
  const [exportStatus, setExportStatus] = useState<NotionExportStatus>('idle');
  const [exportProgress, setExportProgress] = useState(0);
  const [exportResult, setExportResult] = useState<NotionExportResult | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Charger la connexion au montage
  useEffect(() => {
    refreshConnection();
  }, []);

  // Écouter les messages OAuth depuis la popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Vérifier l'origine
      if (event.origin !== window.location.origin) return;

      // Traiter le callback OAuth
      if (event.data?.type === 'NOTION_OAUTH_CALLBACK') {
        const { code, error } = event.data;

        if (error) {
          setConnectionError(error);
          return;
        }

        if (code) {
          await handleOAuthCallback(code);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ---------------------------------------------------------------------------
  // ACTIONS CONNEXION
  // ---------------------------------------------------------------------------

  const refreshConnection = useCallback(async () => {
    setIsLoadingConnection(true);
    setConnectionError(null);

    try {
      const conn = await getNotionConnection();
      setConnection(conn);
    } catch (error) {
      console.error('Error refreshing Notion connection:', error);
      setConnectionError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoadingConnection(false);
    }
  }, []);

  const connect = useCallback(() => {
    setConnectionError(null);
    try {
      startNotionOAuth();
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Impossible de démarrer OAuth');
    }
  }, []);

  const handleOAuthCallback = useCallback(async (code: string) => {
    setIsLoadingConnection(true);
    setConnectionError(null);

    try {
      const newConnection = await handleNotionCallback(code);
      setConnection(newConnection);
      await refreshConnection(); // Refresh pour avoir l'ID complet
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      setConnectionError(error instanceof Error ? error.message : 'Erreur OAuth');
    } finally {
      setIsLoadingConnection(false);
    }
  }, [refreshConnection]);

  const disconnect = useCallback(async () => {
    setIsLoadingConnection(true);
    setConnectionError(null);

    try {
      await disconnectNotion();
      setConnection(null);
    } catch (error) {
      console.error('Error disconnecting Notion:', error);
      setConnectionError(error instanceof Error ? error.message : 'Erreur de déconnexion');
    } finally {
      setIsLoadingConnection(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // ACTIONS EXPORT
  // ---------------------------------------------------------------------------

  const exportDeliverables = useCallback(async (
    deliverables: Deliverable[],
    options?: NotionExportOptions,
    parcoursName?: string
  ): Promise<NotionExportResult> => {
    // Vérifier la connexion
    if (!connection) {
      const error = 'Veuillez d\'abord connecter votre compte Notion';
      setExportError(error);
      return { success: false, error };
    }

    // Réinitialiser l'état
    setExportStatus('exporting');
    setExportProgress(0);
    setExportError(null);
    setExportResult(null);

    try {
      const result = await exportToNotion(
        deliverables,
        options || {},
        parcoursName,
        (current, total) => {
          setExportProgress(Math.round((current / total) * 100));
        }
      );

      if (result.success) {
        setExportStatus('done');
      } else {
        setExportStatus('error');
        setExportError(result.error || 'Erreur d\'export');
      }

      setExportResult(result);
      return result;
    } catch (error) {
      console.error('Error exporting to Notion:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'export';
      setExportStatus('error');
      setExportError(errorMessage);
      const result: NotionExportResult = { success: false, error: errorMessage };
      setExportResult(result);
      return result;
    }
  }, [connection]);

  const resetExport = useCallback(() => {
    setExportStatus('idle');
    setExportProgress(0);
    setExportError(null);
    setExportResult(null);
  }, []);

  // ---------------------------------------------------------------------------
  // ACTIONS HISTORIQUE
  // ---------------------------------------------------------------------------

  const checkIfExported = useCallback(async (deliverableId: string): Promise<boolean> => {
    return isDeliverableExported(deliverableId);
  }, []);

  const fetchExportHistory = useCallback(async (): Promise<unknown[]> => {
    return getExportHistory();
  }, []);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // État connexion
    connection,
    isConnected: connection !== null,
    isLoadingConnection,
    connectionError,

    // État export
    exportStatus,
    exportProgress,
    exportResult,
    exportError,

    // Actions connexion
    connect,
    disconnect,
    handleOAuthCallback,
    refreshConnection,

    // Actions export
    exportDeliverables,
    resetExport,

    // Actions historique
    checkIfExported,
    fetchExportHistory,
  };
}

export default useNotionExport;
