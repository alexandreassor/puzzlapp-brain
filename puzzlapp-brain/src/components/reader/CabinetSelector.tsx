/**
 * Dropdown pour sélectionner/changer l'instance de cabinet active
 */

import { useState, useEffect, useRef } from 'react';
import { useReaderStore } from '@/stores/readerStore';
import { MODEL_INSTANCE_ID } from '@/services/cabinet-instances';
import { cn } from '@/lib/utils';

interface CabinetSelectorProps {
  className?: string;
}

export function CabinetSelector({ className }: CabinetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCabinetName, setNewCabinetName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    activeInstance,
    instances,
    isLoadingInstances,
    loadInstances,
    setActiveInstanceById,
    useModelInstance,
    createNewInstance,
    duplicateFromModel,
  } = useReaderStore();

  // Charger les instances au montage
  useEffect(() => {
    loadInstances();
  }, [loadInstances]);

  // Fermer le dropdown si clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCreateForm(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectInstance = async (id: string) => {
    if (id === MODEL_INSTANCE_ID) {
      useModelInstance();
    } else {
      await setActiveInstanceById(id);
    }
    setIsOpen(false);
  };

  const handleCreateInstance = async (duplicate: boolean) => {
    if (!newCabinetName.trim()) return;

    setIsCreating(true);
    try {
      if (duplicate) {
        await duplicateFromModel(newCabinetName.trim());
      } else {
        await createNewInstance(newCabinetName.trim());
      }
      setNewCabinetName('');
      setShowCreateForm(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating instance:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isModel = activeInstance?.instance_type === 'model';

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Bouton trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors',
          isOpen ? 'bg-accent border-primary' : 'hover:bg-accent'
        )}
      >
        <div
          className={cn(
            'w-8 h-8 rounded flex items-center justify-center text-sm',
            isModel ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'
          )}
        >
          🏢
        </div>
        <div className="text-left">
          <p className="text-sm font-medium truncate max-w-[150px]">
            {activeInstance?.name || 'Sélectionner'}
          </p>
          {isModel && (
            <p className="text-xs text-muted-foreground">Cabinet test</p>
          )}
        </div>
        <svg
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-card border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Instance modèle */}
          <div className="p-2 border-b">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
              Cabinet d'entraînement
            </p>
            <button
              onClick={() => handleSelectInstance(MODEL_INSTANCE_ID)}
              className={cn(
                'w-full p-2 rounded-lg text-left transition-colors',
                activeInstance?.id === MODEL_INSTANCE_ID
                  ? 'bg-primary/10'
                  : 'hover:bg-accent'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  🎯
                </div>
                <div>
                  <p className="font-medium">TRAJECTOIRE CONSEIL</p>
                  <p className="text-xs text-muted-foreground">
                    60 collaborateurs • Idéal pour apprendre
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Mes instances */}
          <div className="p-2 max-h-60 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
              Mes cabinets
            </p>
            {isLoadingInstances ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Chargement...
              </div>
            ) : instances.filter((i) => i.instance_type !== 'model').length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucun cabinet créé
              </div>
            ) : (
              instances
                .filter((i) => i.instance_type !== 'model')
                .map((instance) => (
                  <button
                    key={instance.id}
                    onClick={() => handleSelectInstance(instance.id)}
                    className={cn(
                      'w-full p-2 rounded-lg text-left transition-colors',
                      activeInstance?.id === instance.id
                        ? 'bg-primary/10'
                        : 'hover:bg-accent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        🏢
                      </div>
                      <div>
                        <p className="font-medium">{instance.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {instance.employees_count} collaborateurs
                        </p>
                      </div>
                    </div>
                  </button>
                ))
            )}
          </div>

          {/* Créer nouveau */}
          <div className="p-2 border-t">
            {showCreateForm ? (
              <div className="p-2 space-y-3">
                <input
                  type="text"
                  value={newCabinetName}
                  onChange={(e) => setNewCabinetName(e.target.value)}
                  placeholder="Nom du cabinet"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCreateInstance(false)}
                    disabled={!newCabinetName.trim() || isCreating}
                    className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    Créer vide
                  </button>
                  <button
                    onClick={() => handleCreateInstance(true)}
                    disabled={!newCabinetName.trim() || isCreating}
                    className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-accent disabled:opacity-50"
                  >
                    Dupliquer modèle
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewCabinetName('');
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full p-2 rounded-lg text-left hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    +
                  </div>
                  <div>
                    <p className="font-medium">Créer un nouveau cabinet</p>
                    <p className="text-xs text-muted-foreground">
                      Vide ou basé sur le modèle
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CabinetSelector;
