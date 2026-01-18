import { useState, useEffect, useCallback } from 'react';
import { AdminLayout, RichTextEditor, DocumentationPanel, PromptsManager } from '@/components/admin';
import { chaptersService, sectionsService } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BookOpen, Settings2 } from 'lucide-react';
import type { Chapter, Section } from '@/types';

type ViewMode = 'dashboard' | 'chapter' | 'section' | 'documentation' | 'prompts';

export function AdminPage() {
  // State
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [sections, setSections] = useState<Map<string, Section[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>();
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  // Dialog state
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [sectionTitle, setSectionTitle] = useState('');

  // Current section content for editor
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [chaptersData, sectionsData] = await Promise.all([
        chaptersService.getAll(),
        sectionsService.getAllGroupedByChapter(),
      ]);

      setChapters(chaptersData);
      setSections(sectionsData);
    } catch (err) {
      console.error('[Admin] Error loading data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Chapter handlers
  const handleNewChapter = () => {
    setEditingChapter(null);
    setChapterTitle('');
    setIsChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterTitle(chapter.title);
    setIsChapterDialogOpen(true);
  };

  const handleSaveChapter = async () => {
    if (!chapterTitle.trim()) return;

    try {
      if (editingChapter) {
        await chaptersService.update(editingChapter.id, { title: chapterTitle });
      } else {
        await chaptersService.create({ title: chapterTitle });
      }

      setIsChapterDialogOpen(false);
      setChapterTitle('');
      setEditingChapter(null);
      await loadData();
    } catch (err) {
      console.error('[Admin] Error saving chapter:', err);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Supprimer ce chapitre et toutes ses sections ?')) return;

    try {
      await chaptersService.delete(chapterId);
      await loadData();

      if (selectedChapterId === chapterId) {
        setSelectedChapterId(undefined);
        setViewMode('dashboard');
      }
    } catch (err) {
      console.error('[Admin] Error deleting chapter:', err);
    }
  };

  // Section handlers
  const handleNewSection = () => {
    if (!selectedChapterId) return;
    setEditingSection(null);
    setSectionTitle('');
    setIsSectionDialogOpen(true);
  };

  const handleSaveSection = async () => {
    if (!sectionTitle.trim() || !selectedChapterId) return;

    try {
      if (editingSection) {
        await sectionsService.update(editingSection.id, { title: sectionTitle });
      } else {
        await sectionsService.create({
          chapter_id: selectedChapterId,
          title: sectionTitle,
        });
      }

      setIsSectionDialogOpen(false);
      setSectionTitle('');
      setEditingSection(null);
      await loadData();
    } catch (err) {
      console.error('[Admin] Error saving section:', err);
    }
  };

  const handleSelectSection = async (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setViewMode('section');

    // Load section content
    const section = await sectionsService.getById(sectionId);
    if (section) {
      setEditorContent(section.content_md || '');
    }
  };

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedSectionId(undefined);
    setViewMode('chapter');
  };

  // Save editor content with debounce
  const handleEditorChange = useCallback(async (content: string) => {
    setEditorContent(content);

    if (!selectedSectionId) return;

    // Auto-save after 1 second of inactivity
    setIsSaving(true);
    try {
      await sectionsService.updateContent(selectedSectionId, content);
    } catch (err) {
      console.error('[Admin] Error saving content:', err);
    } finally {
      setIsSaving(false);
    }
  }, [selectedSectionId]);

  // Get current chapter and section
  const currentChapter = chapters.find(c => c.id === selectedChapterId);
  const currentSection = selectedSectionId
    ? sections.get(selectedChapterId || '')?.find(s => s.id === selectedSectionId)
    : undefined;

  // Build breadcrumb
  const breadcrumb = [];
  if (currentChapter) {
    breadcrumb.push({ label: currentChapter.title, href: '#' });
  }
  if (currentSection) {
    breadcrumb.push({ label: currentSection.title });
  }

  // Render content based on view mode
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
          <Button onClick={loadData} variant="outline" className="mt-4">
            Réessayer
          </Button>
        </div>
      );
    }

    // Documentation View
    if (viewMode === 'documentation') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Documentation technique
              </h2>
              <p className="text-sm text-muted-foreground">
                Documentation de l'architecture et des intégrations PuzzlApp Brain
              </p>
            </div>
            <Button variant="outline" onClick={() => setViewMode('dashboard')}>
              Retour au dashboard
            </Button>
          </div>

          <DocumentationPanel />
        </div>
      );
    }

    // Prompts Management View
    if (viewMode === 'prompts') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Settings2 className="h-6 w-6" />
                Gestion des Prompts IA
              </h2>
              <p className="text-sm text-muted-foreground">
                Configurez les prompts système des agents IA directement depuis l'interface
              </p>
            </div>
            <Button variant="outline" onClick={() => setViewMode('dashboard')}>
              Retour au dashboard
            </Button>
          </div>

          <PromptsManager />
        </div>
      );
    }

    // Section Editor View
    if (viewMode === 'section' && currentSection) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{currentSection.title}</h2>
              <p className="text-sm text-muted-foreground">
                Section {currentChapter?.order}.{currentSection.order}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isSaving && (
                <span className="text-sm text-muted-foreground">
                  Enregistrement...
                </span>
              )}
              <Button variant="outline" onClick={() => setViewMode('chapter')}>
                Retour au chapitre
              </Button>
            </div>
          </div>

          <RichTextEditor
            content={editorContent}
            onChange={handleEditorChange}
            placeholder="Commencez à rédiger le contenu de cette section..."
            className="min-h-[500px]"
          />
        </div>
      );
    }

    // Chapter View
    if (viewMode === 'chapter' && currentChapter) {
      const chapterSections = sections.get(currentChapter.id) || [];

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Chapitre {currentChapter.order}: {currentChapter.title}
              </h2>
              <Badge variant="outline" className="mt-2">
                {currentChapter.status === 'draft' && 'Brouillon'}
                {currentChapter.status === 'review' && 'En revue'}
                {currentChapter.status === 'published' && 'Publié'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteChapter(currentChapter.id)}
              >
                Supprimer
              </Button>
              <Button variant="outline" onClick={() => handleEditChapter(currentChapter)}>
                Modifier
              </Button>
              <Button onClick={handleNewSection}>
                + Nouvelle section
              </Button>
            </div>
          </div>

          {chapterSections.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Ce chapitre n'a pas encore de sections.
                </p>
                <Button onClick={handleNewSection}>
                  Créer la première section
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {chapterSections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <Card
                    key={section.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSelectSection(section.id)}
                  >
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {currentChapter.order}.{section.order} {section.title}
                          </CardTitle>
                          <CardDescription>
                            {section.content_md
                              ? `${section.content_md.length} caractères`
                              : 'Aucun contenu'}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSection(section.id);
                          }}
                        >
                          Éditer
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          )}
        </div>
      );
    }

    // Dashboard View (default)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard Admin</h2>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Chapitres</CardDescription>
              <CardTitle className="text-3xl">{chapters.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Sections</CardDescription>
              <CardTitle className="text-3xl">
                {Array.from(sections.values()).flat().length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Publiés</CardDescription>
              <CardTitle className="text-3xl">
                {chapters.filter(c => c.status === 'published').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Brouillons</CardDescription>
              <CardTitle className="text-3xl">
                {chapters.filter(c => c.status === 'draft').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Documentation Card */}
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setViewMode('documentation')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Documentation technique</CardTitle>
                  <CardDescription>
                    Architecture, intégrations et guides de développement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Prompts IA Card */}
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => setViewMode('prompts')}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                  <Settings2 className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Gestion des Prompts IA</CardTitle>
                  <CardDescription>
                    Configurez les prompts système des agents
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Victor Card */}
          <Card className="border-dashed">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <CardTitle className="text-base">Victor — Assistant IA</CardTitle>
                  <CardDescription>
                    Raccourci : Ctrl+Shift+V pour ouvrir
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent chapters */}
        <Card>
          <CardHeader>
            <CardTitle>Chapitres récents</CardTitle>
            <CardDescription>
              Sélectionnez un chapitre dans la barre latérale pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chapters.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun chapitre. Cliquez sur "Nouveau" pour créer votre premier chapitre.
              </p>
            ) : (
              <div className="space-y-2">
                {chapters.slice(0, 5).map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => handleSelectChapter(chapter.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-sm font-medium text-primary">
                        {chapter.order}
                      </span>
                      <span className="font-medium">{chapter.title}</span>
                    </div>
                    <Badge variant="outline">
                      {sections.get(chapter.id)?.length || 0} sections
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <AdminLayout
        title={viewMode === 'dashboard' ? 'Dashboard' : viewMode === 'documentation' ? 'Documentation' : undefined}
        breadcrumb={breadcrumb.length > 0 ? breadcrumb : undefined}
        chapters={chapters}
        sections={sections}
        selectedChapterId={selectedChapterId}
        selectedSectionId={selectedSectionId}
        onSelectChapter={handleSelectChapter}
        onSelectSection={handleSelectSection}
        onNewChapter={handleNewChapter}
        currentSection={currentSection}
        currentChapter={currentChapter}
        onNavigateDashboard={() => {
          setViewMode('dashboard');
          setSelectedChapterId(undefined);
          setSelectedSectionId(undefined);
        }}
        onNavigateDocumentation={() => {
          setViewMode('documentation');
          setSelectedChapterId(undefined);
          setSelectedSectionId(undefined);
        }}
        isDocumentationActive={viewMode === 'documentation'}
      >
        {renderContent()}
      </AdminLayout>

      {/* Chapter Dialog */}
      <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingChapter ? 'Modifier le chapitre' : 'Nouveau chapitre'}
            </DialogTitle>
            <DialogDescription>
              {editingChapter
                ? 'Modifiez les informations du chapitre'
                : 'Créez un nouveau chapitre pour votre mémoire'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Titre du chapitre"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveChapter()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChapterDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveChapter} disabled={!chapterTitle.trim()}>
              {editingChapter ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section Dialog */}
      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSection ? 'Modifier la section' : 'Nouvelle section'}
            </DialogTitle>
            <DialogDescription>
              {editingSection
                ? 'Modifiez les informations de la section'
                : `Ajoutez une section au chapitre "${currentChapter?.title}"`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Titre de la section"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveSection()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveSection} disabled={!sectionTitle.trim()}>
              {editingSection ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
