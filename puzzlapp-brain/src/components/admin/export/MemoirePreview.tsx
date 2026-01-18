/**
 * Composant de prévisualisation du mémoire pour l'impression
 *
 * Génère un document HTML formaté pour l'impression/PDF
 */

import { forwardRef, useMemo } from 'react';
import { marked } from 'marked';
import type { Chapter, Section, Annexe, Figure } from '@/types';

// =============================================================================
// TYPES
// =============================================================================

export interface ExportOptions {
  includeTableOfContents: boolean;
  includeListOfFigures: boolean;
  includeAnnexes: boolean;
  pageNumbers: boolean;
  coverPage: {
    title: string;
    subtitle?: string;
    author?: string;
    date?: string;
    institution?: string;
  };
}

interface MemoirePreviewProps {
  chapters: Chapter[];
  sections: Map<string, Section[]>;
  annexes?: Annexe[];
  figures?: Figure[];
  options: ExportOptions;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Convertit le markdown en HTML
 */
function mdToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

/**
 * Génère le numéro de figure formaté
 */
function formatFigureNumber(code: string): string {
  const match = code.match(/fig-(\d+)-(\d+)/);
  if (match) {
    return `Figure ${match[1]}.${match[2]}`;
  }
  return code;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const MemoirePreview = forwardRef<HTMLDivElement, MemoirePreviewProps>(
  function MemoirePreview({ chapters, sections, annexes = [], figures = [], options }, ref) {
    // Sort chapters by order
    const sortedChapters = useMemo(() => {
      return [...chapters].sort((a, b) => a.order - b.order);
    }, [chapters]);

    // Group figures by chapter
    const figuresByChapter = useMemo(() => {
      const grouped = new Map<string, Figure[]>();
      figures.forEach((fig) => {
        if (fig.chapter_id) {
          const list = grouped.get(fig.chapter_id) || [];
          list.push(fig);
          grouped.set(fig.chapter_id, list);
        }
      });
      return grouped;
    }, [figures]);

    return (
      <div ref={ref} className="memoire-preview">
        {/* Cover Page */}
        <div className="cover-page">
          <div className="cover-content">
            {options.coverPage.institution && (
              <p className="institution">{options.coverPage.institution}</p>
            )}
            <h1 className="title">{options.coverPage.title}</h1>
            {options.coverPage.subtitle && (
              <p className="subtitle">{options.coverPage.subtitle}</p>
            )}
            {options.coverPage.author && (
              <p className="author">{options.coverPage.author}</p>
            )}
            {options.coverPage.date && (
              <p className="date">{options.coverPage.date}</p>
            )}
          </div>
        </div>

        {/* Table of Contents */}
        {options.includeTableOfContents && (
          <div className="toc page-break-before">
            <h1>Table des matières</h1>
            <nav>
              {sortedChapters.map((chapter) => {
                const chapterSections = sections.get(chapter.id) || [];
                const sortedSections = [...chapterSections].sort(
                  (a, b) => a.order - b.order
                );

                return (
                  <div key={chapter.id} className="toc-chapter">
                    <a href={`#chapter-${chapter.id}`} className="toc-link">
                      <span className="toc-number">{chapter.order}.</span>
                      <span className="toc-title">{chapter.title}</span>
                    </a>
                    {sortedSections.length > 0 && (
                      <div className="toc-sections">
                        {sortedSections.map((section, idx) => (
                          <a
                            key={section.id}
                            href={`#section-${section.id}`}
                            className="toc-link toc-section"
                          >
                            <span className="toc-number">
                              {chapter.order}.{idx + 1}
                            </span>
                            <span className="toc-title">{section.title}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {options.includeAnnexes && annexes.length > 0 && (
                <div className="toc-chapter">
                  <a href="#annexes" className="toc-link">
                    <span className="toc-title">Annexes</span>
                  </a>
                </div>
              )}
            </nav>
          </div>
        )}

        {/* List of Figures */}
        {options.includeListOfFigures && figures.length > 0 && (
          <div className="list-of-figures page-break-before">
            <h1>Liste des figures</h1>
            <nav>
              {figures.map((figure) => (
                <a
                  key={figure.id}
                  href={`#figure-${figure.id}`}
                  className="toc-link"
                >
                  <span className="toc-number">
                    {formatFigureNumber(figure.code)}
                  </span>
                  <span className="toc-title">{figure.title}</span>
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Chapters */}
        {sortedChapters.map((chapter) => {
          const chapterSections = sections.get(chapter.id) || [];
          const sortedSections = [...chapterSections].sort(
            (a, b) => a.order - b.order
          );
          const chapterFigures = figuresByChapter.get(chapter.id) || [];

          return (
            <div
              key={chapter.id}
              id={`chapter-${chapter.id}`}
              className="chapter page-break-before"
            >
              <h1 className="chapter-title">
                <span className="chapter-number">{chapter.order}.</span>
                {chapter.title}
              </h1>

              {sortedSections.map((section, idx) => (
                <div
                  key={section.id}
                  id={`section-${section.id}`}
                  className="section"
                >
                  <h2 className="section-title">
                    <span className="section-number">
                      {chapter.order}.{idx + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div
                    className="section-content"
                    dangerouslySetInnerHTML={{
                      __html: mdToHtml(section.content_md || ''),
                    }}
                  />
                </div>
              ))}

              {/* Chapter figures */}
              {chapterFigures.length > 0 && (
                <div className="chapter-figures">
                  {chapterFigures.map((figure) => (
                    <figure
                      key={figure.id}
                      id={`figure-${figure.id}`}
                      className={`figure figure-${figure.width}`}
                    >
                      <img src={figure.public_url} alt={figure.description || figure.title} />
                      <figcaption>
                        <strong>{formatFigureNumber(figure.code)}</strong> – {figure.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Annexes */}
        {options.includeAnnexes && annexes.length > 0 && (
          <div id="annexes" className="annexes page-break-before">
            <h1>Annexes</h1>
            {annexes.map((annexe, idx) => (
              <div key={annexe.id} className="annexe">
                <h2>
                  Annexe {idx + 1} : {annexe.title}
                </h2>
                {annexe.description && (
                  <p className="annexe-description">{annexe.description}</p>
                )}
                {annexe.content_md && (
                  <div
                    className="annexe-content"
                    dangerouslySetInnerHTML={{
                      __html: mdToHtml(annexe.content_md),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Print Styles */}
        <style>{printStyles}</style>
      </div>
    );
  }
);

// =============================================================================
// PRINT STYLES
// =============================================================================

const printStyles = `
  .memoire-preview {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #000;
    background: #fff;
    max-width: 210mm;
    margin: 0 auto;
    padding: 20mm;
  }

  /* Cover Page */
  .cover-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .cover-content {
    max-width: 80%;
  }

  .cover-page .institution {
    font-size: 14pt;
    margin-bottom: 4em;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .cover-page .title {
    font-size: 24pt;
    font-weight: bold;
    margin-bottom: 1em;
    line-height: 1.3;
  }

  .cover-page .subtitle {
    font-size: 16pt;
    font-style: italic;
    margin-bottom: 3em;
  }

  .cover-page .author {
    font-size: 14pt;
    margin-bottom: 1em;
  }

  .cover-page .date {
    font-size: 14pt;
    margin-top: 3em;
  }

  /* Table of Contents */
  .toc h1,
  .list-of-figures h1 {
    font-size: 18pt;
    margin-bottom: 1.5em;
    text-align: center;
  }

  .toc-chapter {
    margin-bottom: 0.5em;
  }

  .toc-link {
    display: flex;
    gap: 0.5em;
    text-decoration: none;
    color: inherit;
  }

  .toc-link:hover {
    text-decoration: underline;
  }

  .toc-number {
    flex-shrink: 0;
  }

  .toc-title {
    flex-grow: 1;
  }

  .toc-sections {
    padding-left: 2em;
    margin-top: 0.25em;
  }

  .toc-section {
    font-size: 11pt;
  }

  /* Chapters */
  .chapter-title {
    font-size: 20pt;
    font-weight: bold;
    margin-bottom: 1em;
  }

  .chapter-number {
    margin-right: 0.5em;
  }

  .section-title {
    font-size: 16pt;
    font-weight: bold;
    margin-top: 1.5em;
    margin-bottom: 0.75em;
  }

  .section-number {
    margin-right: 0.5em;
  }

  .section-content {
    text-align: justify;
  }

  .section-content h3 {
    font-size: 14pt;
    font-weight: bold;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  .section-content p {
    margin-bottom: 0.75em;
  }

  .section-content ul,
  .section-content ol {
    margin-left: 2em;
    margin-bottom: 0.75em;
  }

  .section-content blockquote {
    margin-left: 2em;
    font-style: italic;
    border-left: 3px solid #666;
    padding-left: 1em;
  }

  /* Figures */
  .figure {
    margin: 2em auto;
    text-align: center;
    page-break-inside: avoid;
  }

  .figure img {
    max-width: 100%;
    height: auto;
  }

  .figure-small img {
    max-width: 33%;
  }

  .figure-medium img {
    max-width: 50%;
  }

  .figure figcaption {
    margin-top: 0.5em;
    font-size: 10pt;
    font-style: italic;
  }

  /* Annexes */
  .annexes h1 {
    font-size: 20pt;
    text-align: center;
    margin-bottom: 1.5em;
  }

  .annexe {
    margin-bottom: 2em;
    page-break-inside: avoid;
  }

  .annexe h2 {
    font-size: 14pt;
    font-weight: bold;
    margin-bottom: 0.75em;
  }

  .annexe-description {
    font-style: italic;
    margin-bottom: 1em;
  }

  /* Print-specific */
  .page-break-before {
    page-break-before: always;
  }

  @media print {
    .memoire-preview {
      padding: 0;
      max-width: none;
    }

    @page {
      size: A4;
      margin: 25mm;
    }

    @page :first {
      margin-top: 0;
    }

    .cover-page {
      page-break-after: always;
    }

    h1 {
      page-break-after: avoid;
    }

    h2, h3 {
      page-break-after: avoid;
    }

    figure, table, pre {
      page-break-inside: avoid;
    }
  }

  /* Screen preview adjustments */
  @media screen {
    .memoire-preview {
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      margin: 20px auto;
    }

    .page-break-before {
      margin-top: 40px;
      padding-top: 40px;
      border-top: 1px dashed #ccc;
    }
  }
`;

export default MemoirePreview;
