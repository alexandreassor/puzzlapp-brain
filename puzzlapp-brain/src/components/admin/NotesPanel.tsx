/**
 * Panel de gestion des notes/réflexions
 *
 * Interface pour capturer des idées, les trier et les intégrer
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
  Check,
  X,
  MoreVertical,
  FileInput,
  AlertCircle,
  Star,
  Trash2,
  RotateCcw,
  Link as LinkIcon,
  Pencil,
  Save,
} from 'lucide-react';
import { notesService } from '@/services';
import type { Note, NoteStatus, Chapter, Section } from '@/types';

const STATUS_CONFIG: Record<NoteStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Brouillon', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  kept: { label: 'Gardé', color: 'text-green-600', bgColor: 'bg-green-100' },
  discarded: { label: 'Écarté', color: 'text-red-600', bgColor: 'bg-red-100' },
  integrated: { label: 'Intégré', color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

const PRIORITY_CONFIG: Record<number, { label: string; icon: typeof Star; color: string }> = {
  0: { label: 'Normal', icon: Star, color: 'text-gray-400' },
  1: { label: 'Important', icon: Star, color: 'text-yellow-500' },
  2: { label: 'Urgent', icon: AlertCircle, color: 'text-red-500' },
};

interface NotesPanelProps {
  chapters?: Chapter[];
  sections?: Map<string, Section[]>;
  currentChapterId?: string;
  currentSectionId?: string;
  onCopyToEditor?: (content: string) => void;
}

export function NotesPanel({
  chapters = [],
  sections = new Map(),
  currentChapterId,
  currentSectionId,
  onCopyToEditor,
}: NotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NoteStatus | 'all'>('draft');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [stats, setStats] = useState({ draft: 0, kept: 0, discarded: 0, integrated: 0, total: 0 });

  // État d'édition
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Charger les notes
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const filter = activeTab !== 'all' ? { status: activeTab as NoteStatus } : undefined;
      const data = await notesService.getAll(filter);
      setNotes(data);

      // Charger les stats
      const statsData = await notesService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('[NotesPanel] Load error:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Créer une note
  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      await notesService.create({
        content: newNoteContent.trim(),
        linked_chapter_id: currentChapterId,
        linked_section_id: currentSectionId,
      });
      setNewNoteContent('');
      loadNotes();
    } catch (error) {
      console.error('[NotesPanel] Create error:', error);
      alert('Erreur lors de la création');
    }
  };

  // Actions sur une note
  const handleDelete = async (note: Note) => {
    if (!confirm('Supprimer cette note définitivement ?')) return;
    await notesService.delete(note.id);
    loadNotes();
  };

  const handleSetPriority = async (note: Note, priority: 0 | 1 | 2) => {
    await notesService.setPriority(note.id, priority);
    loadNotes();
  };

  const handleCopyToEditor = async (note: Note) => {
    if (onCopyToEditor) {
      onCopyToEditor(note.content);
      await notesService.markIntegrated(note.id);
      loadNotes();
    }
  };

  // Édition d'une note
  const handleStartEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const handleSaveEdit = async () => {
    if (!editingNoteId || !editingContent.trim()) return;

    try {
      await notesService.update(editingNoteId, { content: editingContent.trim() });
      setEditingNoteId(null);
      setEditingContent('');
      loadNotes();
    } catch (error) {
      console.error('[NotesPanel] Save error:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Changement de statut direct
  const handleChangeStatus = async (note: Note, newStatus: NoteStatus) => {
    try {
      await notesService.update(note.id, { status: newStatus });
      loadNotes();
    } catch (error) {
      console.error('[NotesPanel] Status change error:', error);
    }
  };

  // Trouver le nom du chapitre/section liée
  const getLinkedName = (note: Note): string | null => {
    if (note.linked_section_id) {
      for (const chapterSections of sections.values()) {
        const section = chapterSections.find((s) => s.id === note.linked_section_id);
        if (section) return section.title;
      }
    }
    if (note.linked_chapter_id) {
      const chapter = chapters.find((c) => c.id === note.linked_chapter_id);
      if (chapter) return chapter.title;
    }
    return null;
  };

  const renderNoteCard = (note: Note) => {
    const statusConfig = STATUS_CONFIG[note.status];
    const priorityConfig = PRIORITY_CONFIG[note.priority];
    const PriorityIcon = priorityConfig.icon;
    const linkedName = getLinkedName(note);
    const isEditing = editingNoteId === note.id;

    return (
      <Card key={note.id} className="mb-3">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            {/* Priorité */}
            <button
              onClick={() => handleSetPriority(note, ((note.priority + 1) % 3) as 0 | 1 | 2)}
              className="mt-1"
              title={`Priorité: ${priorityConfig.label}`}
            >
              <PriorityIcon className={`h-4 w-4 ${priorityConfig.color}`} />
            </button>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit} disabled={!editingContent.trim()}>
                      <Save className="h-3 w-3 mr-1" />
                      Enregistrer
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              )}

              {/* Tags et liens */}
              {!isEditing && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
                    {statusConfig.label}
                  </Badge>

                  {linkedName && (
                    <Badge variant="outline" className="text-xs">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      {linkedName}
                    </Badge>
                  )}

                  {note.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {!isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* Modifier */}
                  <DropdownMenuItem onClick={() => handleStartEdit(note)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Changement de statut */}
                  {note.status !== 'draft' && (
                    <DropdownMenuItem onClick={() => handleChangeStatus(note, 'draft')}>
                      <RotateCcw className="h-4 w-4 mr-2 text-gray-600" />
                      → Brouillon
                    </DropdownMenuItem>
                  )}
                  {note.status !== 'kept' && (
                    <DropdownMenuItem onClick={() => handleChangeStatus(note, 'kept')}>
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      → Gardé
                    </DropdownMenuItem>
                  )}
                  {note.status !== 'discarded' && (
                    <DropdownMenuItem onClick={() => handleChangeStatus(note, 'discarded')}>
                      <X className="h-4 w-4 mr-2 text-red-600" />
                      → Écarté
                    </DropdownMenuItem>
                  )}
                  {note.status !== 'integrated' && (
                    <DropdownMenuItem onClick={() => handleChangeStatus(note, 'integrated')}>
                      <FileInput className="h-4 w-4 mr-2 text-blue-600" />
                      → Intégré
                    </DropdownMenuItem>
                  )}

                  {note.status === 'kept' && onCopyToEditor && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleCopyToEditor(note)}>
                        <FileInput className="h-4 w-4 mr-2 text-blue-600" />
                        Copier dans l'éditeur
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleDelete(note)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Réflexions</h2>
        <p className="text-muted-foreground">
          Capturez vos idées, triez-les ensuite
        </p>
      </div>

      {/* Zone de création rapide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Nouvelle note</CardTitle>
          <CardDescription>
            {currentSectionId ? 'Sera liée à la section courante' : currentChapterId ? 'Sera liée au chapitre courant' : 'Note libre'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Une idée, une réflexion, une question..."
            rows={3}
          />
          <Button onClick={handleCreateNote} disabled={!newNoteContent.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-2">
        {(['draft', 'kept', 'discarded', 'integrated'] as NoteStatus[]).map((status) => {
          const config = STATUS_CONFIG[status];
          return (
            <Card key={status} className={`cursor-pointer ${activeTab === status ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveTab(status)}>
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

      {/* Liste des notes par onglet */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NoteStatus | 'all')}>
        <TabsList>
          <TabsTrigger value="draft">Brouillons ({stats.draft})</TabsTrigger>
          <TabsTrigger value="kept">Gardés ({stats.kept})</TabsTrigger>
          <TabsTrigger value="discarded">Écartés ({stats.discarded})</TabsTrigger>
          <TabsTrigger value="integrated">Intégrés ({stats.integrated})</TabsTrigger>
          <TabsTrigger value="all">Tout ({stats.total})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement...
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune note {activeTab !== 'all' ? `avec le statut "${STATUS_CONFIG[activeTab as NoteStatus].label}"` : ''}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              {notes.map(renderNoteCard)}
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
