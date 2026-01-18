import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { VictorPanel } from './victor';
import { useAuth } from '@/context/AuthContext';
import type { Chapter, Section } from '@/types';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  breadcrumb?: { label: string; href?: string }[];
  chapters?: Chapter[];
  sections?: Map<string, Section[]>;
  selectedChapterId?: string;
  selectedSectionId?: string;
  onSelectChapter?: (id: string) => void;
  onSelectSection?: (id: string) => void;
  onNewChapter?: () => void;
  hideSidebar?: boolean;
  currentSection?: Section;
  currentChapter?: Chapter;
  onInsertToEditor?: (content: string) => void;
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

export function AdminLayout({
  children,
  title,
  breadcrumb,
  chapters = [],
  sections = new Map(),
  selectedChapterId,
  selectedSectionId,
  onSelectChapter = () => {},
  onSelectSection = () => {},
  onNewChapter = () => {},
  hideSidebar = false,
  currentSection,
  currentChapter,
  onInsertToEditor,
  onNavigateDashboard,
  onNavigateDocumentation,
  onNavigatePrompts,
  onNavigateAnnexes,
  onNavigateNotes,
  isDocumentationActive = false,
  isPromptsActive = false,
  isAnnexesActive = false,
  isNotesActive = false,
}: AdminLayoutProps) {
  const { user } = useAuth();
  const [isVictorOpen, setIsVictorOpen] = useState(false);

  // Toggle Victor panel
  const toggleVictor = useCallback(() => {
    setIsVictorOpen(prev => !prev);
  }, []);

  // Keyboard shortcut: Ctrl+Shift+V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        toggleVictor();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleVictor]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      {!hideSidebar && (
        <AdminSidebar
          chapters={chapters}
          sections={sections}
          selectedChapterId={selectedChapterId}
          selectedSectionId={selectedSectionId}
          onSelectChapter={onSelectChapter}
          onSelectSection={onSelectSection}
          onNewChapter={onNewChapter}
          onNavigateDashboard={onNavigateDashboard}
          onNavigateDocumentation={onNavigateDocumentation}
          onNavigatePrompts={onNavigatePrompts}
          onNavigateAnnexes={onNavigateAnnexes}
          onNavigateNotes={onNavigateNotes}
          isDocumentationActive={isDocumentationActive}
          isPromptsActive={isPromptsActive}
          isAnnexesActive={isAnnexesActive}
          isNotesActive={isNotesActive}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          title={title}
          breadcrumb={breadcrumb}
          isVictorOpen={isVictorOpen}
          onToggleVictor={toggleVictor}
        />

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Victor Panel */}
      {user && (
        <VictorPanel
          isOpen={isVictorOpen}
          onClose={() => setIsVictorOpen(false)}
          userId={user.id}
          currentSection={currentSection}
          currentChapter={currentChapter}
          onInsertToEditor={onInsertToEditor}
        />
      )}
    </div>
  );
}
