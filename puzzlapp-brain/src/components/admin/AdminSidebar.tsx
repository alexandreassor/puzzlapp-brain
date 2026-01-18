import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, LayoutDashboard, Settings2 } from 'lucide-react';
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
  isDocumentationActive?: boolean;
  isPromptsActive?: boolean;
}

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  review: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  published: 'bg-green-500/10 text-green-600 border-green-500/20',
};

const statusLabels: Record<string, string> = {
  draft: 'Brouillon',
  review: 'En revue',
  published: 'Publié',
};

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
  isDocumentationActive = false,
  isPromptsActive = false,
}: AdminSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(selectedChapterId ? [selectedChapterId] : [])
  );

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/30">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="font-semibold">Chapitres</h2>
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

                return (
                  <div key={chapter.id} className="mb-1">
                    {/* Chapter Header */}
                    <button
                      className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent ${
                        isSelected ? 'bg-accent' : ''
                      }`}
                      onClick={() => {
                        onSelectChapter(chapter.id);
                        toggleChapter(chapter.id);
                      }}
                    >
                      {/* Expand Icon */}
                      <span
                        className={`text-muted-foreground transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      >
                        ▶
                      </span>

                      {/* Chapter Number */}
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
                        {chapter.order}
                      </span>

                      {/* Title */}
                      <span className="flex-1 truncate font-medium">
                        {chapter.title}
                      </span>

                      {/* Status Badge */}
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${statusColors[chapter.status]}`}
                      >
                        {statusLabels[chapter.status]}
                      </Badge>
                    </button>

                    {/* Sections */}
                    {isExpanded && chapterSections.length > 0 && (
                      <div className="ml-4 mt-1 border-l pl-2">
                        {chapterSections
                          .sort((a, b) => a.order - b.order)
                          .map((section) => (
                            <button
                              key={section.id}
                              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent ${
                                selectedSectionId === section.id
                                  ? 'bg-accent text-accent-foreground'
                                  : 'text-muted-foreground'
                              }`}
                              onClick={() => onSelectSection(section.id)}
                            >
                              <span className="text-xs text-muted-foreground">
                                {chapter.order}.{section.order}
                              </span>
                              <span className="flex-1 truncate">
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
