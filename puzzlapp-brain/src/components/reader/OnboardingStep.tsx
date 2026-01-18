/**
 * Composant d'étape individuelle de l'onboarding
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface OnboardingStepProps {
  step: number;
  currentStep: number;
  icon: ReactNode;
  title: string;
  description: ReactNode;
  children?: ReactNode;
}

export function OnboardingStep({
  step,
  currentStep,
  icon,
  title,
  description,
  children,
}: OnboardingStepProps) {
  const isActive = step === currentStep;

  if (!isActive) return null;

  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto animate-in fade-in duration-300">
      {/* Icône */}
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">{icon}</span>
      </div>

      {/* Titre */}
      <h2 className="text-2xl font-bold mb-3">{title}</h2>

      {/* Description */}
      <div className="text-muted-foreground mb-6">{description}</div>

      {/* Contenu additionnel (ex: choix) */}
      {children && <div className="w-full">{children}</div>}
    </div>
  );
}

// Indicateur de progression
interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'w-2 h-2 rounded-full transition-all duration-300',
            index === currentStep
              ? 'w-8 bg-primary'
              : index < currentStep
              ? 'bg-primary'
              : 'bg-muted'
          )}
        />
      ))}
    </div>
  );
}

export default OnboardingStep;
