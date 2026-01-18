/**
 * Flow d'onboarding pour les nouveaux utilisateurs
 * 3 étapes : Bienvenue → Concept → Choix du cabinet
 */

import { useState } from 'react';
import { OnboardingStep, StepIndicator } from './OnboardingStep';
import { useReaderStore } from '@/stores/readerStore';
import { cn } from '@/lib/utils';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type CabinetChoice = 'model' | 'create' | null;

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [cabinetChoice, setCabinetChoice] = useState<CabinetChoice>(null);
  const [cabinetName, setCabinetName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { useModelInstance, createNewInstance, completeOnboarding } = useReaderStore();

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setIsCreating(true);

    try {
      if (cabinetChoice === 'model') {
        useModelInstance();
      } else if (cabinetChoice === 'create' && cabinetName.trim()) {
        await createNewInstance(cabinetName.trim());
      }

      await completeOnboarding();
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const canComplete = cabinetChoice === 'model' || (cabinetChoice === 'create' && cabinetName.trim());

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header avec logo */}
      <header className="p-6">
        <h1 className="text-xl font-bold text-center">PuzzlApp Brain</h1>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <StepIndicator totalSteps={3} currentStep={step} />

        {/* Étape 1 : Bienvenue */}
        <OnboardingStep
          step={0}
          currentStep={step}
          icon="🎯"
          title="Bienvenue sur PuzzlApp Brain"
          description={
            <p>
              Transformez la gestion des connaissances de votre cabinet
              d'expertise comptable grâce à une approche innovante basée sur le
              Design Thinking.
            </p>
          }
        />

        {/* Étape 2 : Le concept */}
        <OnboardingStep
          step={1}
          currentStep={step}
          icon="📖"
          title="Apprendre en pratiquant"
          description={
            <div className="space-y-4">
              <p>Votre parcours d'apprentissage :</p>
              <ul className="text-left space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Lire le mémoire sur le Knowledge Management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Pratiquer sur un cabinet fictif pour comprendre</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Appliquer les concepts à votre vrai cabinet</span>
                </li>
              </ul>
            </div>
          }
        />

        {/* Étape 3 : Choix du cabinet */}
        <OnboardingStep
          step={2}
          currentStep={step}
          icon="🏢"
          title="Votre cabinet de travail"
          description={
            <p>Choisissez comment vous souhaitez commencer :</p>
          }
        >
          <div className="space-y-3 mt-4">
            {/* Option 1 : Cabinet modèle */}
            <button
              onClick={() => setCabinetChoice('model')}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                cabinetChoice === 'model'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                    cabinetChoice === 'model'
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}
                >
                  {cabinetChoice === 'model' && (
                    <span className="text-primary-foreground text-xs">✓</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">S'entraîner sur TRAJECTOIRE CONSEIL</p>
                  <p className="text-sm text-muted-foreground">
                    Cabinet fictif avec 60 collaborateurs, idéal pour apprendre
                  </p>
                </div>
              </div>
            </button>

            {/* Option 2 : Créer son cabinet */}
            <button
              onClick={() => setCabinetChoice('create')}
              className={cn(
                'w-full p-4 rounded-lg border-2 text-left transition-all',
                cabinetChoice === 'create'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                    cabinetChoice === 'create'
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}
                >
                  {cabinetChoice === 'create' && (
                    <span className="text-primary-foreground text-xs">✓</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Créer mon propre cabinet</p>
                  <p className="text-sm text-muted-foreground">
                    Appliquer directement à ma vraie structure
                  </p>
                </div>
              </div>
            </button>

            {/* Champ nom si création */}
            {cabinetChoice === 'create' && (
              <div className="mt-4 animate-in slide-in-from-top duration-200">
                <label className="block text-sm font-medium mb-2">
                  Nom de votre cabinet
                </label>
                <input
                  type="text"
                  value={cabinetName}
                  onChange={(e) => setCabinetName(e.target.value)}
                  placeholder="Ex: Cabinet Martin & Associés"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>
        </OnboardingStep>
      </main>

      {/* Footer avec boutons */}
      <footer className="p-6 border-t">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm border rounded-md hover:bg-accent"
            >
              ← Retour
            </button>
          ) : (
            <div />
          )}

          {step < 2 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Commencer →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!canComplete || isCreating}
              className={cn(
                'px-6 py-2 bg-primary text-primary-foreground rounded-md',
                canComplete && !isCreating
                  ? 'hover:bg-primary/90'
                  : 'opacity-50 cursor-not-allowed'
              )}
            >
              {isCreating ? 'Création...' : 'Terminer ✓'}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default OnboardingFlow;
