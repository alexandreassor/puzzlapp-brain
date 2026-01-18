/**
 * Extension TipTap pour les mentions d'annexes (@CODE)
 *
 * Permet de référencer des annexes dans l'éditeur avec autocomplete
 */

import { useCallback, useEffect, useState } from 'react';
import Mention from '@tiptap/extension-mention';
import { ReactRenderer } from '@tiptap/react';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { annexesService } from '@/services';
import type { Annexe } from '@/types';

// =============================================================================
// SUGGESTION LIST COMPONENT
// =============================================================================

interface SuggestionListProps {
  items: Annexe[];
  command: (item: Annexe) => void;
}

function SuggestionList({ items, command }: SuggestionListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback((index: number) => {
    const item = items[index];
    if (item) {
      command(item);
    }
  }, [items, command]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        selectItem(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length, selectedIndex, selectItem]);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-popover p-2 shadow-lg">
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          Aucune annexe trouvée
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-popover shadow-lg overflow-hidden max-h-[200px] overflow-y-auto">
      {items.map((item, index) => (
        <button
          key={item.id}
          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
            index === selectedIndex
              ? 'bg-accent text-accent-foreground'
              : 'hover:bg-accent/50'
          }`}
          onClick={() => selectItem(index)}
        >
          <code className="text-xs bg-muted px-1 rounded">@{item.code}</code>
          <span className="truncate">{item.title}</span>
        </button>
      ))}
    </div>
  );
}

// =============================================================================
// MENTION EXTENSION
// =============================================================================

export function createAnnexeMention() {
  return Mention.configure({
    HTMLAttributes: {
      class: 'mention-annexe bg-primary/10 text-primary px-1 rounded font-medium cursor-pointer hover:bg-primary/20',
    },
    suggestion: {
      char: '@',
      items: async ({ query }: { query: string }): Promise<Annexe[]> => {
        if (!query) {
          // Return all annexes when no query
          try {
            return await annexesService.getAll();
          } catch {
            return [];
          }
        }
        // Search annexes
        try {
          return await annexesService.search(query);
        } catch {
          return [];
        }
      },
      render: () => {
        let component: ReactRenderer<SuggestionListProps> | null = null;
        let popup: { destroy: () => void } | null = null;

        return {
          onStart: (props: SuggestionProps<Annexe>) => {
            component = new ReactRenderer(SuggestionList, {
              props: {
                items: props.items,
                command: (item: Annexe) => {
                  props.command({ id: item.code, label: item.code });
                },
              },
              editor: props.editor,
            });

            // Create popup container
            const popupContainer = document.createElement('div');
            popupContainer.className = 'annexe-mention-popup';
            document.body.appendChild(popupContainer);

            popup = {
              destroy: () => {
                component?.destroy();
                popupContainer.remove();
              },
            };

            // Render popup
            const rect = props.clientRect;
            if (rect) {
              const domRect = rect();
              if (domRect) {
                popupContainer.style.position = 'fixed';
                popupContainer.style.zIndex = '50';
                popupContainer.style.top = `${domRect.bottom + 4}px`;
                popupContainer.style.left = `${domRect.left}px`;
              }
            }

            popupContainer.appendChild(component.element);
          },

          onUpdate: (props: SuggestionProps<Annexe>) => {
            if (component) {
              component.updateProps({
                items: props.items,
                command: (item: Annexe) => {
                  props.command({ id: item.code, label: item.code });
                },
              });
            }

            // Update popup position
            const popupContainer = document.querySelector('.annexe-mention-popup') as HTMLElement;
            if (popupContainer && props.clientRect) {
              const domRect = props.clientRect();
              if (domRect) {
                popupContainer.style.top = `${domRect.bottom + 4}px`;
                popupContainer.style.left = `${domRect.left}px`;
              }
            }
          },

          onKeyDown: (props: { event: KeyboardEvent }) => {
            if (props.event.key === 'Escape') {
              popup?.destroy();
              return true;
            }
            return false;
          },

          onExit: () => {
            popup?.destroy();
          },
        };
      },
    } as Partial<SuggestionOptions<Annexe>>,
  });
}

// CSS styles for mention
export const annexeMentionStyles = `
  .mention-annexe {
    background-color: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-weight: 500;
    cursor: pointer;
  }

  .mention-annexe:hover {
    background-color: hsl(var(--primary) / 0.2);
  }
`;
