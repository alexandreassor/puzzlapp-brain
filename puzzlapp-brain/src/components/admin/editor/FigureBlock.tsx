/**
 * Extension TipTap pour les blocs figure avec légende
 *
 * Permet d'insérer des images avec légende numérotée
 */

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

// =============================================================================
// NODE VIEW COMPONENT
// =============================================================================

function FigureNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, caption, code, width, figureId } = node.attrs;

  const widthClasses = {
    small: 'max-w-[33%]',
    medium: 'max-w-[50%]',
    full: 'max-w-full',
  };

  return (
    <NodeViewWrapper>
      <figure
        className={`my-4 mx-auto ${widthClasses[width as keyof typeof widthClasses] || 'max-w-full'} ${
          selected ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        data-figure-id={figureId}
      >
        <img
          src={src}
          alt={caption || 'Figure'}
          className="w-full h-auto rounded-lg shadow-md"
          draggable={false}
        />
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {code && (
            <span className="font-semibold text-primary">
              {formatFigureCode(code)}
            </span>
          )}
          {code && caption && ' – '}
          <input
            type="text"
            value={caption || ''}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Légende de la figure..."
            className="bg-transparent border-none outline-none text-center w-full"
          />
        </figcaption>
      </figure>
    </NodeViewWrapper>
  );
}

/**
 * Formate le code de figure pour l'affichage
 * fig-1-2 → Figure 1.2
 */
function formatFigureCode(code: string): string {
  const match = code.match(/fig-(\d+)-(\d+)/);
  if (match) {
    return `Figure ${match[1]}.${match[2]}`;
  }
  return code;
}

// =============================================================================
// EXTENSION
// =============================================================================

export interface FigureOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figure: {
      /**
       * Insère une figure
       */
      setFigure: (options: {
        src: string;
        caption?: string;
        code?: string;
        width?: 'small' | 'medium' | 'full';
        figureId?: string;
      }) => ReturnType;
      /**
       * Met à jour les attributs d'une figure
       */
      updateFigure: (attributes: {
        caption?: string;
        width?: 'small' | 'medium' | 'full';
      }) => ReturnType;
    };
  }
}

export const FigureBlock = Node.create<FigureOptions>({
  name: 'figure',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: '',
      },
      caption: {
        default: '',
      },
      code: {
        default: '',
      },
      width: {
        default: 'full',
      },
      figureId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-figure-id]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-figure-id': HTMLAttributes.figureId,
      }),
      [
        'img',
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.caption,
        },
      ],
      ['figcaption', {}, HTMLAttributes.caption || ''],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureNodeView);
  },

  addCommands() {
    return {
      setFigure:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      updateFigure:
        (attributes) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attributes);
        },
    };
  },
});

// =============================================================================
// STYLES
// =============================================================================

export const figureBlockStyles = `
  figure[data-figure-id] {
    display: block;
    margin: 1.5rem auto;
    text-align: center;
  }

  figure[data-figure-id] img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  figure[data-figure-id] figcaption {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  figure[data-figure-id] figcaption span {
    font-weight: 600;
    color: hsl(var(--primary));
  }

  /* Width variants */
  figure[data-width="small"] {
    max-width: 33%;
  }

  figure[data-width="medium"] {
    max-width: 50%;
  }

  figure[data-width="full"] {
    max-width: 100%;
  }

  /* Selected state */
  figure.ProseMirror-selectednode {
    outline: 2px solid hsl(var(--primary));
    outline-offset: 2px;
    border-radius: 0.5rem;
  }
`;

export default FigureBlock;
