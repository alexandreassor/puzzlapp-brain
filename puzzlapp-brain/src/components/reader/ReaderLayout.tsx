import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ReaderSidebar } from './ReaderSidebar';
import { ProgressBar } from './ProgressBar';
import { CabinetSelector } from './CabinetSelector';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { ParcoursWithProgress } from '@/types';

interface ReaderLayoutProps {
  children: ReactNode;
  parcours?: ParcoursWithProgress[];
  currentParcoursId?: string;
  currentSectionId?: string;
  onSelectParcours?: (parcoursId: string) => void;
  onSelectSection?: (sectionId: string) => void;
}

export function ReaderLayout({
  children,
  parcours = [],
  currentParcoursId,
  currentSectionId,
  onSelectParcours,
  onSelectSection,
}: ReaderLayoutProps) {
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Calcul de la progression globale (moyenne de tous les parcours)
  const globalProgress = parcours.length > 0
    ? Math.round(parcours.reduce((acc, p) => acc + p.progress, 0) / parcours.length)
    : 0;

  // Parcours actif
  const activeParcours = parcours.find(p => p.id === currentParcoursId);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header fixe */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center px-4 gap-4">
          {/* Menu mobile */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <ReaderSidebar
                parcours={parcours}
                currentParcoursId={currentParcoursId}
                currentSectionId={currentSectionId}
                onSelectParcours={(id) => {
                  onSelectParcours?.(id);
                  setSidebarOpen(false);
                }}
                onSelectSection={(id) => {
                  onSelectSection?.(id);
                  setSidebarOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/reader" className="flex items-center gap-2">
            <span className="text-xl font-bold">PuzzlApp Brain</span>
          </Link>

          {/* Sélecteur de cabinet */}
          <CabinetSelector className="hidden md:flex" />

          {/* Progression globale (desktop) */}
          {parcours.length > 0 && (
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
              <ProgressBar
                value={activeParcours?.progress ?? globalProgress}
                label={activeParcours?.name ?? 'Progression globale'}
                showPercentage
              />
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            )}
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {profile?.full_name || profile?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Progression mobile */}
        {parcours.length > 0 && (
          <div className="md:hidden px-4 pb-2">
            <ProgressBar
              value={activeParcours?.progress ?? globalProgress}
              label={activeParcours?.name ?? 'Progression'}
              size="sm"
              showPercentage
            />
          </div>
        )}
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-80 border-r bg-muted/30 overflow-y-auto">
          <ReaderSidebar
            parcours={parcours}
            currentParcoursId={currentParcoursId}
            currentSectionId={currentSectionId}
            onSelectParcours={onSelectParcours}
            onSelectSection={onSelectSection}
          />
        </aside>

        {/* Zone de lecture */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// Icône Menu
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
