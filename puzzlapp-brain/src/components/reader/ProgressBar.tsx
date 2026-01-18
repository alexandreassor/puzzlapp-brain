import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'success' | 'warning';
}

export function ProgressBar({
  value,
  label,
  showPercentage = false,
  size = 'md',
  className,
  variant = 'default',
}: ProgressBarProps) {
  // Assurer que la valeur est entre 0 et 100
  const normalizedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: '',
    success: '[&>div]:bg-green-500',
    warning: '[&>div]:bg-amber-500',
  };

  // Déterminer le variant automatiquement selon la progression
  const autoVariant = normalizedValue === 100 ? 'success' : variant;

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1">
          {label && (
            <span className="text-xs font-medium text-muted-foreground truncate">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn(
              'text-xs font-semibold tabular-nums',
              normalizedValue === 100 ? 'text-green-600' : 'text-muted-foreground'
            )}>
              {normalizedValue}%
            </span>
          )}
        </div>
      )}
      <Progress
        value={normalizedValue}
        className={cn(
          sizeClasses[size],
          variantClasses[autoVariant],
          'transition-all duration-300'
        )}
      />
    </div>
  );
}

// Version compacte pour les listes
interface MiniProgressProps {
  value: number;
  className?: string;
}

export function MiniProgress({ value, className }: MiniProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Progress value={normalizedValue} className="h-1.5 flex-1" />
      <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">
        {normalizedValue}%
      </span>
    </div>
  );
}

// Badge de progression (pour afficher dans les cards)
interface ProgressBadgeProps {
  value: number;
  total?: number;
  className?: string;
}

export function ProgressBadge({ value, total, className }: ProgressBadgeProps) {
  const percentage = total ? Math.round((value / total) * 100) : value;
  const isComplete = percentage === 100;

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
      isComplete
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-muted text-muted-foreground',
      className
    )}>
      {isComplete ? (
        <>
          <CheckIcon className="w-3 h-3" />
          Terminé
        </>
      ) : (
        <>
          {total ? `${value}/${total}` : `${percentage}%`}
        </>
      )}
    </span>
  );
}

// Icône Check
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
