/**
 * Modal d'export vers Notion
 *
 * Affiche un workflow en étapes pour exporter les livrables vers Notion
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { NotionConnectButton } from './NotionConnectButton';
import { isNotionConnected, exportToNotion } from '@/services/notion';
import type { Deliverable } from '@/types';
import type { NotionModalStep, NotionExportResult } from '@/types/notion';

interface NotionExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverables: Deliverable[];
  parcoursName?: string;
  onExportComplete?: (result: NotionExportResult) => void;
}

export function NotionExportModal({
  isOpen,
  onClose,
  deliverables,
  parcoursName,
  onExportComplete,
}: NotionExportModalProps) {
  const [step, setStep] = useState<NotionModalStep>('connect');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<NotionExportResult | null>(null);

  // Vérifier la connexion au chargement
  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  async function checkConnection() {
    const connected = await isNotionConnected();
    setStep(connected ? 'export' : 'connect');
  }

  function handleConnected() {
    setStep('export');
  }

  async function handleExport() {
    setIsExporting(true);
    setProgress(0);

    const exportResult = await exportToNotion(
      deliverables,
      {},
      parcoursName,
      (current, total) => {
        setProgress((current / total) * 100);
      }
    );

    setResult(exportResult);
    setIsExporting(false);
    setStep(exportResult.success ? 'done' : 'error');
    onExportComplete?.(exportResult);
  }

  function handleClose() {
    // Reset state
    setStep('connect');
    setProgress(0);
    setResult(null);
    onClose();
  }

  function renderStepContent() {
    switch (step) {
      case 'connect':
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Connectez votre Notion
              </h3>
              <p className="text-muted-foreground text-sm">
                Pour exporter vos livrables, vous devez d'abord connecter
                votre workspace Notion.
              </p>
            </div>

            <NotionConnectButton
              onConnected={handleConnected}
              variant="default"
              size="lg"
            />

            <p className="text-xs text-muted-foreground text-center max-w-sm">
              Vos livrables seront créés dans une base de données Notion
              dans votre workspace. Vous gardez le contrôle total de vos données.
            </p>
          </div>
        );

      case 'export':
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Prêt à exporter
              </h3>
              <p className="text-muted-foreground text-sm">
                {deliverables.length} livrable{deliverables.length > 1 ? 's' : ''} sera{deliverables.length > 1 ? 'ont' : ''} exporté{deliverables.length > 1 ? 's' : ''} vers Notion.
              </p>
            </div>

            {/* Liste des livrables */}
            <div className="w-full max-h-48 overflow-y-auto border rounded-md p-3">
              <ul className="space-y-2">
                {deliverables.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="truncate">{d.title}</span>
                    <span className="text-muted-foreground text-xs">
                      ({d.type})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {isExporting ? (
              <div className="w-full space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-muted-foreground">
                  Export en cours... {Math.round(progress)}%
                </p>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
                <Button onClick={handleExport}>
                  Exporter vers Notion
                </Button>
              </div>
            )}
          </div>
        );

      case 'done':
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Export réussi !
              </h3>
              <p className="text-muted-foreground text-sm">
                {deliverables.length} livrable{deliverables.length > 1 ? 's ont' : ' a'} été exporté{deliverables.length > 1 ? 's' : ''} vers votre Notion.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Fermer
              </Button>
              {result?.databaseUrl && (
                <Button asChild>
                  <a
                    href={result.databaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ouvrir dans Notion
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Erreur lors de l'export
              </h3>
              <p className="text-muted-foreground text-sm">
                {result?.error || 'Une erreur est survenue. Veuillez réessayer.'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Fermer
              </Button>
              <Button onClick={() => setStep('export')}>
                Réessayer
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" />
            </svg>
            Exporter vers Notion
          </DialogTitle>
          <DialogDescription>
            {parcoursName
              ? `Exportez vos livrables du parcours "${parcoursName}"`
              : 'Exportez vos livrables vers votre workspace Notion'}
          </DialogDescription>
        </DialogHeader>

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}

export default NotionExportModal;
