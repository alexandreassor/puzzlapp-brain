/**
 * Card affichant le résumé d'un cabinet
 */

import type { CabinetInstance, CabinetInstanceFull } from '@/types/cabinet-instance';
import { cn } from '@/lib/utils';

interface CabinetCardProps {
  cabinet: CabinetInstance | CabinetInstanceFull;
  variant?: 'default' | 'compact';
  className?: string;
}

export function CabinetCard({ cabinet, variant = 'default', className }: CabinetCardProps) {
  const isModel = cabinet.instance_type === 'model';

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
            isModel ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'
          )}
        >
          🏢
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{cabinet.name}</p>
          <p className="text-xs text-muted-foreground">
            {cabinet.employees_count} collaborateurs
            {isModel && ' • Cabinet test'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('p-4 bg-card border rounded-lg', className)}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
            isModel ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'
          )}
        >
          🏢
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{cabinet.name}</h3>
            {isModel && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                Test
              </span>
            )}
          </div>
          {cabinet.slogan && (
            <p className="text-sm text-muted-foreground mt-0.5">{cabinet.slogan}</p>
          )}

          <div className="mt-3 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{cabinet.employees_count}</p>
              <p className="text-xs text-muted-foreground">Collaborateurs</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{cabinet.kmmm_score.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Score KMMM</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{cabinet.crash_test_score}%</p>
              <p className="text-xs text-muted-foreground">Crash Test</p>
            </div>
          </div>

          {/* Barre de progression KMMM */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Maturité KM</span>
              <span>{cabinet.kmmm_score}/5 → Objectif {cabinet.kmmm_target}/5</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(cabinet.kmmm_score / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CabinetCard;
