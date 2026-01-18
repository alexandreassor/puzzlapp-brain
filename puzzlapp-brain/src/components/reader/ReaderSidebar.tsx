import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MiniProgress, ProgressBadge } from './ProgressBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { ParcoursWithProgress, Section } from '@/types';

interface ReaderSidebarProps {
  parcours: ParcoursWithProgress[];
  currentParcoursId?: string;
  currentSectionId?: string;
  onSelectParcours?: (parcoursId: string) => void;
  onSelectSection?: (sectionId: string) => void;
  sections?: Section[];
}

export function ReaderSidebar({
  parcours,
  currentParcoursId,
  currentSectionId,
  onSelectParcours,
  onSelectSection,
  sections = [],
}: ReaderSidebarProps) {
  const [expandedParcoursId, setExpandedParcoursId] = useState<string | null>(
    currentParcoursId ?? null
  );

  // Agent icons par type
  const agentIcons: Record<string, { emoji: string; color: string }> = {
    leo: { emoji: '🤖', color: 'bg-blue-500/10 text-blue-600' },
    sophie: { emoji: '👩‍💼', color: 'bg-purple-500/10 text-purple-600' },
    marc: { emoji: '👨‍💼', color: 'bg-amber-500/10 text-amber-600' },
  };

  const toggleParcours = (parcoursId: string) => {
    if (expandedParcoursId === parcoursId) {
      setExpandedParcoursId(null);
    } else {
      setExpandedParcoursId(parcoursId);
      onSelectParcours?.(parcoursId);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header sidebar */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Mes Parcours
        </h2>
      </div>

      {/* Liste des parcours */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {parcours.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucun parcours disponible
            </div>
          ) : (
            <div className="space-y-1">
              {parcours.map((p) => {
                const isExpanded = expandedParcoursId === p.id;
                const isActive = currentParcoursId === p.id;
                const agent = p.agent_type ? agentIcons[p.agent_type] : null;

                return (
                  <div key={p.id}>
                    {/* Parcours header */}
                    <button
                      onClick={() => toggleParcours(p.id)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                        isActive
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted'
                      )}
                    >
                      {/* Icône agent */}
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                        agent?.color ?? 'bg-muted'
                      )}>
                        <span className="text-lg">{agent?.emoji ?? '📚'}</span>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn(
                            'font-medium text-sm truncate',
                            isActive && 'text-primary'
                          )}>
                            {p.name}
                          </span>
                          <ChevronIcon
                            className={cn(
                              'w-4 h-4 text-muted-foreground transition-transform flex-shrink-0',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </div>

                        {p.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {p.description}
                          </p>
                        )}

                        {/* Progression */}
                        <div className="mt-2">
                          <MiniProgress value={p.progress} />
                        </div>
                      </div>
                    </button>

                    {/* Sections (si expanded) */}
                    {isExpanded && (
                      <div className="ml-4 pl-4 border-l border-muted mt-1 mb-2 space-y-0.5">
                        {p.sections.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2 px-2">
                            Aucune section
                          </p>
                        ) : (
                          // TODO: Récupérer les vraies sections depuis le service
                          // Pour l'instant, on affiche les IDs
                          p.sections.map((sectionId, index) => {
                            const isCurrentSection = currentSectionId === sectionId;
                            const sectionData = sections.find(s => s.id === sectionId);

                            return (
                              <button
                                key={sectionId}
                                onClick={() => onSelectSection?.(sectionId)}
                                className={cn(
                                  'w-full flex items-center gap-2 py-2 px-2 rounded text-left text-sm transition-colors',
                                  isCurrentSection
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                )}
                              >
                                <span className={cn(
                                  'w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                                  isCurrentSection
                                    ? 'bg-primary-foreground/20'
                                    : 'bg-muted'
                                )}>
                                  {index + 1}
                                </span>
                                <span className="truncate">
                                  {sectionData?.title ?? `Section ${index + 1}`}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator className="my-2" />

        {/* Section Agent */}
        <div className="p-2">
          <div className="p-3 rounded-lg bg-accent/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span>🤖</span>
              </div>
              <div>
                <p className="text-sm font-medium">Léo</p>
                <p className="text-xs text-muted-foreground">Orchestrateur KM</p>
              </div>
            </div>
            <button className="mt-2 w-full px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">
              Poser une question
            </button>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Votre progression
          </h3>
          <div className="space-y-2">
            <StatItem
              label="Parcours complétés"
              value={parcours.filter(p => p.progress === 100).length}
              total={parcours.length}
            />
            <StatItem
              label="Sections lues"
              value={parcours.reduce((acc, p) => acc + p.sectionsCompleted, 0)}
              total={parcours.reduce((acc, p) => acc + p.totalSections, 0)}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Composant StatItem
function StatItem({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}/{total}</span>
        <ProgressBadge value={percentage} className="hidden sm:inline-flex" />
      </div>
    </div>
  );
}

// Icône Chevron
function ChevronIcon({ className }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
