import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { EditorToolbar } from './EditorToolbar';
import { createAnnexeMention, annexeMentionStyles } from './AnnexeMention';
import { FigureBlock, figureBlockStyles } from './FigureBlock';
import { FigureUploader } from './FigureUploader';
import type { Chapter, Figure } from '@/types';

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  autofocus?: boolean;
  chapters?: Chapter[];
  currentChapterId?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Commencez à écrire...',
  editable = true,
  className = '',
  autofocus = false,
  chapters = [],
  currentChapterId,
}: RichTextEditorProps) {
  const [isFigureUploaderOpen, setIsFigureUploaderOpen] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // We use CodeBlockLowlight instead
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-muted rounded-lg p-4 font-mono text-sm',
        },
      }),
      // Mention extension for @annexes
      createAnnexeMention(),
      // Figure block extension
      FigureBlock,
    ],
    content,
    editable,
    autofocus,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when prop changes (external update)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editable, editor]);

  // Handle figure insertion
  const handleFigureInsert = (figure: Figure) => {
    if (!editor) return;
    editor.chain().focus().setFigure({
      src: figure.public_url,
      caption: figure.title,
      code: figure.code,
      width: figure.width,
      figureId: figure.id,
    }).run();
  };

  return (
    <div className={`overflow-hidden rounded-lg border bg-background ${className}`}>
      {editable && (
        <EditorToolbar
          editor={editor}
          onOpenFigureUploader={() => setIsFigureUploaderOpen(true)}
        />
      )}
      <EditorContent editor={editor} />

      {/* Custom styles for the editor */}
      <style>{`
        .ProseMirror {
          min-height: 200px;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: hsl(var(--muted-foreground));
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror:focus {
          outline: none;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror blockquote {
          border-left: 3px solid hsl(var(--primary));
          padding-left: 1em;
          margin: 1em 0;
          color: hsl(var(--muted-foreground));
          font-style: italic;
        }

        .ProseMirror code {
          background: hsl(var(--muted));
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-size: 0.9em;
          font-family: monospace;
        }

        .ProseMirror pre {
          background: hsl(var(--muted));
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          background: none;
          padding: 0;
        }

        .ProseMirror hr {
          border: none;
          border-top: 1px solid hsl(var(--border));
          margin: 2em 0;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
        }

        .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }

        ${annexeMentionStyles}

        ${figureBlockStyles}
      `}</style>

      {/* Figure Uploader Modal */}
      <FigureUploader
        isOpen={isFigureUploaderOpen}
        onClose={() => setIsFigureUploaderOpen(false)}
        onInsert={handleFigureInsert}
        chapters={chapters}
        currentChapterId={currentChapterId}
      />
    </div>
  );
}

// Re-export utility functions for Markdown conversion
export { htmlToMarkdown, markdownToHtml } from './utils';
