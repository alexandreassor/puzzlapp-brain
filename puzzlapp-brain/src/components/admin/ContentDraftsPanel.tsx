/**
 * Panel de gestion des brouillons de contenu
 *
 * Interface pour créer, valider et intégrer du contenu Markdown
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Check,
  MoreVertical,
  FileEdit,
  Trash2,
  RotateCcw,
  FileInput,
  Pencil,
  FolderInput,
} from 'lucide-react';
import { contentDraftsService } from '@/services';
import { ContentDraftEditor } from './ContentDraftEditor';
import type { ContentDraft, ContentDraftStatus, Chapter } from '@/types';

const STATUS_CONFIG: Record<ContentDraftStatus, { label: string; color: string; icon: string }> = {
  draft: { label: 'Brouillon', color: 'text-gray-600', icon: '📝' },
  validated: { label: 'Validé', color: 'text-green-600', icon: '✓' },
  integrated: { label: 'Intégré', color: 'text-blue-600', icon: '📥' },
};

interface ContentDraftsPanelProps {
  chapters?: Chapter[];
  onEditDraft?: (draft: ContentDraft) => void;
  onIntegrateDraft?: (draft: ContentDraft) => void;
}

export function ContentDraftsPanel({
  chapters = [],
  onEditDraft,
  onIntegrateDraft,
}: ContentDraftsPanelProps) {
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentDraftStatus | 'all'>('draft');
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [newDraftChapterId, setNewDraftChapterId] = useState<string>('');
  const [stats, setStats] = useState({ draft: 0, validated: 0, integrated: 0, total: 0 });

  // État de l'éditeur
  const [editingDraft, setEditingDraft] = useState<ContentDraft | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Charger les brouillons
  const loadDrafts = useCallback(async () => {
    try {
      setLoading(true);
      const filter = activeTab !== 'all' ? { status: activeTab as ContentDraftStatus } : undefined;
      const data = await contentDraftsService.getAll(filter);
      setDrafts(data);

      const statsData = await contentDraftsService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('[ContentDraftsPanel] Load error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  // Créer un brouillon
  const handleCreateDraft = async () => {
    if (!newDraftTitle.trim()) return;

    try {
      const draft = await contentDraftsService.create({
        title: newDraftTitle.trim(),
        target_chapter_id: newDraftChapterId || undefined,
      });
      setNewDraftTitle('');
      setNewDraftChapterId('');
      loadDrafts();

      // Ouvrir l'éditeur si disponible
      if (onEditDraft) {
        onEditDraft(draft);
      }
    } catch (error) {
      console.error('[ContentDraftsPanel] Create error:', error);
      alert('Erreur lors de la création');
    }
  };

  // Actions sur un brouillon
  const handleValidate = async (draft: ContentDraft) => {
    await contentDraftsService.validate(draft.id);
    loadDrafts();
  };

  const handleRevertToDraft = async (draft: ContentDraft) => {
    await contentDraftsService.revertToDraft(draft.id);
    loadDrafts();
  };

  const handleDelete = async (draft: ContentDraft) => {
    if (!confirm('Supprimer ce brouillon définitivement ?')) return;
    await contentDraftsService.delete(draft.id);
    loadDrafts();
  };

  // Ouvrir l'éditeur
  const handleOpenEditor = (draft: ContentDraft) => {
    setEditingDraft(draft);
    setIsEditorOpen(true);
    onEditDraft?.(draft);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingDraft(null);
  };

  const handleEditorSaved = () => {
    loadDrafts();
  };

  // Trouver le nom du chapitre cible
  const getTargetChapterName = (draft: ContentDraft): string | null => {
    if (draft.target_chapter_id) {
      const chapter = chapters.find((c) => c.id === draft.target_chapter_id);
      if (chapter) return `Ch. ${chapter.order}`;
    }
    return null;
  };

  // Extrait un aperçu du contenu
  const getPreview = (content: string, maxLength = 100): string => {
    if (!content) return 'Aucun contenu';
    const clean = content.replace(/[#*_~`>\[\]]/g, '').trim();
    return clean.length > maxLength ? clean.substring(0, maxLength) + '...' : clean;
  };

  const renderDraftCard = (draft: ContentDraft) => {
    const statusConfig = STATUS_CONFIG[draft.status];
    const targetChapter = getTargetChapterName(draft);

    return (
      <Card key={draft.id} className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icône statut */}
            <span className="text-xl mt-0.5">{statusConfig.icon}</span>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{draft.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {getPreview(draft.content_md)}
              </p>

              {/* Tags et infos */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                  {statusConfig.label}
                </Badge>

                {targetChapter && (
                  <Badge variant="outline" className="text-xs">
                    <FolderInput className="h-3 w-3 mr-1" />
                    {targetChapter}
                  </Badge>
                )}

                {draft.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Modifier */}
                {onEditDraft && (
                  <DropdownMenuItem onClick={() => onEditDraft(draft)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                {/* Actions de statut */}
                {draft.status === 'draft' && (
                  <DropdownMenuItem onClick={() => handleValidate(draft)}>
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Valider
                  </DropdownMenuItem>
                )}

                {draft.status === 'validated' && (
                  <>
                    <DropdownMenuItem onClick={() => handleRevertToDraft(draft)}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Remettre en brouillon
                    </DropdownMenuItem>
                    {onIntegrateDraft && (
                      <DropdownMenuItem onClick={() => onIntegrateDraft(draft)}>
                        <FileInput className="h-4 w-4 mr-2 text-blue-600" />
                        Intégrer dans...
                      </DropdownMenuItem>
                    )}
                  </>
                )}

                {draft.status === 'integrated' && (
                  <DropdownMenuItem onClick={() => handleRevertToDraft(draft)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Remettre en brouillon
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleDelete(draft)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileEdit className="h-6 w-6" />
          Brouillons de contenu
        </h2>
        <p className="text-muted-foreground">
          Rédigez, validez, puis intégrez dans le mémoire
        </p>
      </div>

      {/* Zone de création rapide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Nouveau brouillon</CardTitle>
          <CardDescription>
            Créez un bloc de contenu à positionner plus tard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newDraftTitle}
              onChange={(e) => setNewDraftTitle(e.target.value)}
              placeholder="Titre du brouillon..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateDraft()}
            />
            {chapters.length > 0 && (
              <Select value={newDraftChapterId} onValueChange={setNewDraftChapterId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chapitre cible" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      Ch. {chapter.order}: {chapter.title.substring(0, 20)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <Button onClick={handleCreateDraft} disabled={!newDraftTitle.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Créer
          </Button>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-2">
        {(['draft', 'validated', 'integrated'] as ContentDraftStatus[]).map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <Card
              key={status}
              className={`cursor-pointer ${activeTab === status ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveTab(status)}
            >
              <CardContent className="p-3 text-center">
                <div className={`text-2xl font-bold ${config.color}`}>
                  {stats[status]}
                </div>
                <div className="text-xs text-muted-foreground">{config.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Liste par onglet */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentDraftStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="draft">Brouillons ({stats.draft})</TabsTrigger>
          <TabsTrigger value="validated">Validés ({stats.validated})</TabsTrigger>
          <TabsTrigger value="integrated">Intégrés ({stats.integrated})</TabsTrigger>
          <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun brouillon {activeTab !== 'all' ? `avec le statut "${STATUS_CONFIG[activeTab as ContentDraftStatus].label}"` : ''}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              {drafts.map(renderDraftCard)}
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
