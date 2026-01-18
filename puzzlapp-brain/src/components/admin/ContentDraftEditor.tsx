/**
 * Éditeur de brouillon de contenu
 *
 * Modal avec TipTap pour éditer le contenu Markdown
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, X, Check, RotateCcw } from 'lucide-react';
import { RichTextEditor } from './editor';
import { contentDraftsService } from '@/services';
import type { ContentDraft, ContentDraftStatus, Chapter } from '@/types';

const STATUS_CONFIG: Record<ContentDraftStatus, { label: string; color: string }> = {
  draft: { label: 'Brouillon', color: 'bg-gray-100 text-gray-700' },
  validated: { label: 'Validé', color: 'bg-green-100 text-green-700' },
  integrated: { label: 'Intégré', color: 'bg-blue-100 text-blue-700' },
};

interface ContentDraftEditorProps {
  draft: ContentDraft | null;
  chapters?: Chapter[];
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function ContentDraftEditor({
  draft,
  chapters = [],
  isOpen,
  onClose,
  onSaved,
}: ContentDraftEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetChapterId, setTargetChapterId] = useState<string>('');
  const [status, setStatus] = useState<ContentDraftStatus>('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Charger le brouillon
  useEffect(() => {
    if (draft) {
      setTitle(draft.title);
      setContent(draft.content_md || '');
      setTargetChapterId(draft.target_chapter_id || '');
      setStatus(draft.status);
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setTargetChapterId('');
      setStatus('draft');
      setHasChanges(false);
    }
  }, [draft]);

  // Marquer comme modifié
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setHasChanges(true);
  };

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    setHasChanges(true);
  }, []);

  const handleChapterChange = (value: string) => {
    setTargetChapterId(value);
    setHasChanges(true);
  };

  // Sauvegarder
  const handleSave = async () => {
    if (!draft || !title.trim()) return;

    try {
      setIsSaving(true);
      await contentDraftsService.update(draft.id, {
        title: title.trim(),
        content_md: content,
        target_chapter_id: targetChapterId || undefined,
      });
      setHasChanges(false);
      onSaved?.();
    } catch (error) {
      console.error('[ContentDraftEditor] Save error:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  // Valider le brouillon
  const handleValidate = async () => {
    if (!draft) return;

    try {
      // Sauvegarder d'abord si modifications
      if (hasChanges) {
        await handleSave();
      }
      await contentDraftsService.validate(draft.id);
      setStatus('validated');
      onSaved?.();
    } catch (error) {
      console.error('[ContentDraftEditor] Validate error:', error);
      alert('Erreur lors de la validation');
    }
  };

  // Remettre en brouillon
  const handleRevertToDraft = async () => {
    if (!draft) return;

    try {
      await contentDraftsService.revertToDraft(draft.id);
      setStatus('draft');
      onSaved?.();
    } catch (error) {
      console.error('[ContentDraftEditor] Revert error:', error);
      alert('Erreur lors du retour en brouillon');
    }
  };

  // Fermeture avec confirmation si modifications
  const handleClose = () => {
    if (hasChanges) {
      if (!confirm('Vous avez des modifications non sauvegardées. Fermer quand même ?')) {
        return;
      }
    }
    onClose();
  };

  const statusConfig = STATUS_CONFIG[status];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <span>Éditer le brouillon</span>
              <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
            </DialogTitle>
            <div className="flex items-center gap-2">
              {status === 'draft' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleValidate}
                  disabled={!content.trim()}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Valider
                </Button>
              )}
              {status === 'validated' && (
                <Button variant="outline" size="sm" onClick={handleRevertToDraft}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Remettre en brouillon
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-shrink-0 space-y-3 pt-4">
          {/* Titre */}
          <div className="flex gap-3">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Titre du brouillon"
              className="flex-1 font-medium"
            />

            {/* Chapitre cible */}
            {chapters.length > 0 && (
              <Select value={targetChapterId} onValueChange={handleChapterChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Chapitre cible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      Ch. {chapter.order}: {chapter.title.substring(0, 25)}
                      {chapter.title.length > 25 ? '...' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Éditeur */}
        <div className="flex-1 overflow-hidden py-4">
          <RichTextEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Rédigez le contenu de votre brouillon..."
            className="h-full"
            chapters={chapters}
          />
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            {hasChanges ? (
              <span className="text-amber-600">Modifications non sauvegardées</span>
            ) : (
              <span>Aucune modification</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-1" />
              Fermer
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving || !title.trim()}>
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
