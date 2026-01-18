import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { BookOpen, LayoutDashboard, Settings2, PanelLeftClose, PanelLeft, Eye, EyeOff, Paperclip, Lightbulb } from 'lucide-react';
import type { Chapter, Section } from '@/types';

interface AdminSidebarProps {
  chapters: Chapter[];
  sections: Map<string, Section[]>;
  selectedChapterId?: string;
  selectedSectionId?: string;
  onSelectChapter: (id: string) => void;
  onSelectSection: (id: string) => void;
  onNewChapter: () => void;
  onNavigateDashboard?: () => void;
  onNavigateDocumentation?: () => void;
  onNavigatePrompts?: () => void;
  onNavigateAnnexes?: () => void;
  onNavigateNotes?: () => void;
  isDocumentationActive?: boolean;
  isPromptsActive?: boolean;
  isAnnexesActive?: boolean;
  isNotesActive?: boolean;
}

export function AdminSidebar({
  chapters,
  sections,
  selectedChapterId,
  selectedSectionId,
  onSelectChapter,
  onSelectSection,
  onNewChapter,
  onNavigateDashboard,
  onNavigateDocumentation,
  onNavigatePrompts,
  onNavigateAnnexes,
  onNavigateNotes,
  isDocumentationActive = false,
  isPromptsActive = false,
  isAnnexesActive = false,
  isNotesActive = false,
}: AdminSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(selectedChapterId ? [selectedChapterId] : [])
  );
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showParties, setShowParties] = useState(true);

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // Version réduite de la sidebar
  if (isCollapsed) {
    return (
      <div className="flex h-full w-12 flex-col border-r bg-muted/30 items-center py-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsCollapsed(false)}
          className="mb-2"
          title="Ouvrir la sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Separator className="my-2 w-8" />
        {chapters.slice(0, 10).map((chapter) => (
          <button
            key={chapter.id}
            className={`flex h-8 w-8 items-center justify-center rounded text-xs font-medium mb-1 transition-colors ${
              selectedChapterId === chapter.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-accent'
            }`}
            onClick={() => onSelectChapter(chapter.id)}
            title={chapter.title}
          >
            {chapter.order}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full w-80 flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-3 gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsCollapsed(true)}
          className="h-8 w-8 shrink-0"
          title="Réduire la sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold flex-1">Chapitres</h2>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowParties(!showParties)}
          className="h-8 w-8 shrink-0"
          title={showParties ? "Masquer les parties" : "Afficher les parties"}
        >
          {showParties ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button size="sm" onClick={onNewChapter}>
          + Nouveau
        </Button>
      </div>

      {/* Chapters List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chapters.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-muted-foreground">
              Aucun chapitre.
              <br />
              Créez votre premier chapitre.
            </div>
          ) : (
            chapters
              .sort((a, b) => a.order - b.order)
              .map((chapter) => {
                const chapterSections = sections.get(chapter.id) || [];
                const isExpanded = expandedChapters.has(chapter.id);
                const isSelected = selectedChapterId === chapter.id;

                // Déterminer si on doit afficher un header de PARTIE
                let partieHeader = null;
                if (showParties) {
                  if (chapter.order === 1) {
                    partieHeader = (
                      <div className="mt-2 mb-1 px-2 py-1 text-xs font-bold text-primary bg-primary/5 rounded">
                        PARTIE I — Diagnostic
                      </div>
                    );
                  } else if (chapter.order === 4) {
                    partieHeader = (
                      <div className="mt-3 mb-1 px-2 py-1 text-xs font-bold text-primary bg-primary/5 rounded">
                        PARTIE II — Double Diamant
                      </div>
                    );
                  } else if (chapter.order === 7) {
                    partieHeader = (
                      <div className="mt-3 mb-1 px-2 py-1 text-xs font-bold text-primary bg-primary/5 rounded">
                        PARTIE III — Amélioration continue
                      </div>
                    );
                  }
                }

                return (
                  <div key={chapter.id} className="mb-1">
                    {/* Partie Header */}
                    {partieHeader}

                    {/* Chapter Header */}
                    <button
                      className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent ${
                        isSelected ? 'bg-accent' : ''
                      }`}
                      onClick={() => {
                        onSelectChapter(chapter.id);
                        toggleChapter(chapter.id);
                      }}
                      title={chapter.title}
                    >
                      {/* Expand Icon */}
                      <span
                        className={`text-muted-foreground transition-transform mt-0.5 shrink-0 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      >
                        ▶
                      </span>

                      {/* Chapter Number */}
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                        {chapter.order}
                      </span>

                      {/* Title - permet le retour à la ligne */}
                      <span className="flex-1 font-medium leading-tight">
                        {chapter.title}
                      </span>
                    </button>

                    {/* Sections */}
                    {isExpanded && chapterSections.length > 0 && (
                      <div className="ml-4 mt-1 border-l pl-2">
                        {chapterSections
                          .sort((a, b) => a.order - b.order)
                          .map((section) => (
                            <button
                              key={section.id}
                              className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
                                selectedSectionId === section.id
                                  ? 'bg-accent text-accent-foreground'
                                  : 'text-muted-foreground'
                              }`}
                              onClick={() => onSelectSection(section.id)}
                              title={section.title}
                            >
                              <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
                                {chapter.order}.{section.order}
                              </span>
                              <span className="flex-1 leading-tight">
                                {section.title}
                              </span>
                            </button>
                          ))}
                      </div>
                    )}

                    {/* Empty sections message */}
                    {isExpanded && chapterSections.length === 0 && (
                      <div className="ml-6 py-2 text-xs text-muted-foreground">
                        Aucune section
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </div>
      </ScrollArea>

      {/* Navigation Links */}
      <Separator />
      <div className="p-2 space-y-1">
        {onNavigateDashboard && (
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={onNavigateDashboard}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
        )}
        {onNavigateDocumentation && (
          <button
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isDocumentationActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={onNavigateDocumentation}
          >
            <BookOpen className="h-4 w-4" />
            Documentation
          </button>
        )}
        {onNavigatePrompts && (
          <button
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isPromptsActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={onNavigatePrompts}
          >
            <Settings2 className="h-4 w-4" />
            Prompts IA
          </button>
        )}
        {onNavigateAnnexes && (
          <button
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isAnnexesActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={onNavigateAnnexes}
          >
            <Paperclip className="h-4 w-4" />
            Annexes
          </button>
        )}
        {onNavigateNotes && (
          <button
            className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
              isNotesActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
            onClick={onNavigateNotes}
          >
            <Lightbulb className="h-4 w-4" />
            Réflexions
          </button>
        )}
      </div>

      {/* Footer */}
      <Separator />
      <div className="p-4">
        <div className="text-xs text-muted-foreground">
          {chapters.length} chapitre{chapters.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
