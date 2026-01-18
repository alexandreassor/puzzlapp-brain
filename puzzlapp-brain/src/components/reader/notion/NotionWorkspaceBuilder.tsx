/**
 * NotionWorkspaceBuilder - Interface conversationnelle de création d'espace Notion
 *
 * Ce composant est utilisé par les agents IA (Sophie, Marc, Léo) pour guider
 * l'utilisateur dans la création de son espace Notion personnalisé.
 *
 * Flow "Tu parles, Notion se construit" :
 * 1. L'agent propose de créer l'espace (après fin de parcours)
 * 2. L'utilisateur voit ce qui sera créé
 * 3. Il peut personnaliser ou accepter
 * 4. La création se fait automatiquement
 * 5. Il reçoit les liens vers son nouveau workspace
 *
 * @author PuzzlApp Brain - Phase 6 BYON
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  ExternalLink,
  Database,
  FileText,
  Sparkles,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { NotionConnectButton } from './NotionConnectButton';
import {
  notionMCPService,
  WORKSPACE_TEMPLATES,
  type WorkspaceTemplate,
  type WorkspaceCreationResult,
} from '@/services/notion';
import { isNotionConnected } from '@/services/notion';
import type { Deliverable } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

type BuilderStep = 'connect' | 'preview' | 'customize' | 'creating' | 'done' | 'error';

interface NotionWorkspaceBuilderProps {
  /** Est-ce que le modal est ouvert */
  isOpen: boolean;
  /** Callback pour fermer le modal */
  onClose: () => void;
  /** ID du template à utiliser */
  templateId: string;
  /** Nom de l'agent qui propose (pour personnaliser le message) */
  agentName?: string;
  /** Emoji de l'agent */
  agentEmoji?: string;
  /** Livrables à inclure dans l'espace */
  deliverables?: Deliverable[];
  /** Nom du parcours terminé */
  parcoursName?: string;
  /** Callback quand la création est terminée */
  onCreationComplete?: (result: WorkspaceCreationResult) => void;
}

// =============================================================================
// SOUS-COMPOSANTS
// =============================================================================

function TemplatePreview({ template }: { template: WorkspaceTemplate }) {
  return (
    <div className="space-y-4">
      {/* En-tête du template */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{template.emoji}</span>
        <div>
          <h3 className="font-semibold text-lg">{template.name}</h3>
          <p className="text-sm text-muted-foreground">{template.description}</p>
        </div>
      </div>

      <Separator />

      {/* Bases de données */}
      {template.databases.length > 0 && (
        <div>
          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-primary" />
            Bases de données ({template.databases.length})
          </h4>
          <div className="space-y-2">
            {template.databases.map((db, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <span className="text-xl">{db.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{db.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {db.description}
                  </p>
                  {db.views && db.views.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {db.views.map((view, vIndex) => (
                        <Badge key={vIndex} variant="outline" className="text-xs">
                          {view.type === 'board' ? 'Kanban' :
                           view.type === 'calendar' ? 'Calendrier' :
                           view.type === 'gallery' ? 'Galerie' :
                           view.type === 'list' ? 'Liste' : 'Table'}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pages templates */}
      {template.pages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            Templates & Guides ({template.pages.length})
          </h4>
          <div className="space-y-2">
            {template.pages.map((page, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <span className="text-xl">{page.emoji}</span>
                <p className="font-medium text-sm">{page.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreationProgress({
  progress,
  currentAction,
}: {
  progress: number;
  currentAction: string;
}) {
  return (
    <div className="space-y-4 py-8">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Sparkles className="h-12 w-12 text-primary animate-pulse" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Création en cours...</h3>
        <p className="text-sm text-muted-foreground">{currentAction}</p>
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

function CreationSuccess({
  result,
  onOpenNotion,
  onClose,
}: {
  result: WorkspaceCreationResult;
  onOpenNotion: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-6 py-4">
      {/* Icône succès */}
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Espace Notion créé !</h3>
        <p className="text-sm text-muted-foreground">
          Ton workspace est prêt. Tu peux maintenant l'utiliser pour suivre
          tes activités et capitaliser tes connaissances.
        </p>
      </div>

      {/* Résumé de ce qui a été créé */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        {result.databases.length > 0 && (
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              {result.databases.length} base{result.databases.length > 1 ? 's' : ''} de données
            </p>
            <ul className="mt-1 space-y-1">
              {result.databases.map((db, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  {db.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.pages.length > 0 && (
          <div>
            <p className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {result.pages.length} page{result.pages.length > 1 ? 's' : ''} template
            </p>
            <ul className="mt-1 space-y-1">
              {result.pages.map((page, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  {page.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Fermer
        </Button>
        <Button onClick={onOpenNotion} className="flex-1">
          Ouvrir dans Notion
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CreationError({
  error,
  onRetry,
  onClose,
}: {
  error: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Erreur de création</h3>
        <p className="text-sm text-muted-foreground">
          {error || "Une erreur est survenue lors de la création. Vérifie ta connexion Notion."}
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Fermer
        </Button>
        <Button onClick={onRetry} className="flex-1">
          Réessayer
        </Button>
      </div>
    </div>
  );
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export function NotionWorkspaceBuilder({
  isOpen,
  onClose,
  templateId,
  agentName = 'Léo',
  agentEmoji = '🤖',
  deliverables = [],
  parcoursName,
  onCreationComplete,
}: NotionWorkspaceBuilderProps) {
  // État
  const [step, setStep] = useState<BuilderStep>('connect');
  const [_isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('');
  const [result, setResult] = useState<WorkspaceCreationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Template
  const template = WORKSPACE_TEMPLATES[templateId];

  // Vérifier la connexion au chargement
  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  async function checkConnection() {
    const connected = await isNotionConnected();
    setIsConnected(connected);
    setStep(connected ? 'preview' : 'connect');
  }

  function handleConnected() {
    setIsConnected(true);
    setStep('preview');
  }

  async function handleCreate() {
    if (!template) return;

    setStep('creating');
    setProgress(0);
    setError(null);

    try {
      // Simuler la progression (en attendant l'API réelle)
      const actions = [
        'Connexion à Notion...',
        'Création des bases de données...',
        'Configuration des propriétés...',
        'Création des pages templates...',
        'Ajout des livrables...',
        'Finalisation...',
      ];

      // Animation de progression
      for (let i = 0; i < actions.length; i++) {
        setCurrentAction(actions[i]);
        setProgress((i / actions.length) * 90);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Appel réel au service MCP
      const { data: { user } } = await import('@/lib/supabase').then(m => m.supabase.auth.getUser());

      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const creationResult = await notionMCPService.createWorkspaceFromTemplate(
        user.id,
        templateId,
        deliverables
      );

      setProgress(100);

      if (creationResult.success) {
        setResult(creationResult);
        setStep('done');
        onCreationComplete?.(creationResult);
      } else {
        setError(creationResult.error || 'Erreur inconnue');
        setStep('error');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de création');
      setStep('error');
    }
  }

  function handleOpenNotion() {
    if (result?.workspaceUrl) {
      window.open(result.workspaceUrl, '_blank');
    }
  }

  function handleRetry() {
    setStep('preview');
    setError(null);
    setProgress(0);
  }

  function handleClose() {
    // Reset state
    setStep('connect');
    setProgress(0);
    setResult(null);
    setError(null);
    onClose();
  }

  // Pas de template trouvé
  if (!template) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{agentEmoji}</span>
            <span>Créer ton espace Notion</span>
          </DialogTitle>
          <DialogDescription>
            {parcoursName
              ? `${agentName} te propose de créer un espace pour le parcours "${parcoursName}"`
              : `${agentName} te propose de créer un espace Notion personnalisé`}
          </DialogDescription>
        </DialogHeader>

        {/* Contenu selon l'étape */}
        <div className="py-4">
          {step === 'connect' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Pour créer ton espace, connecte d'abord ton compte Notion.
                  Tes données resteront dans TON workspace.
                </p>
                <NotionConnectButton
                  onConnected={handleConnected}
                  variant="default"
                  size="lg"
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Tu gardes le contrôle total de tes données.
                PuzzlApp ne peut pas accéder à ton Notion sans ton autorisation.
              </p>
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Aperçu du template */}
              <TemplatePreview template={template} />

              {/* Info livrables */}
              {deliverables.length > 0 && (
                <div className="bg-primary/10 rounded-lg p-3">
                  <p className="text-sm">
                    <span className="font-medium">{deliverables.length} livrable{deliverables.length > 1 ? 's' : ''}</span>
                    {' '}seront automatiquement ajoutés à ta base.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 'creating' && (
            <CreationProgress progress={progress} currentAction={currentAction} />
          )}

          {step === 'done' && result && (
            <CreationSuccess
              result={result}
              onOpenNotion={handleOpenNotion}
              onClose={handleClose}
            />
          )}

          {step === 'error' && (
            <CreationError
              error={error || 'Erreur inconnue'}
              onRetry={handleRetry}
              onClose={handleClose}
            />
          )}
        </div>

        {/* Footer avec actions (seulement pour preview) */}
        {step === 'preview' && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose}>
              Plus tard
            </Button>
            <Button onClick={handleCreate}>
              <Sparkles className="mr-2 h-4 w-4" />
              Créer mon espace
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default NotionWorkspaceBuilder;
