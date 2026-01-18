/**
 * Service d'export du mémoire consolidé
 *
 * Génère un fichier Markdown unique avec tous les chapitres et sections
 */

import { supabase } from '@/lib/supabase';
import type { Chapter, Section } from '@/types';

interface ExportOptions {
  includeEmptySections?: boolean;
  includeTableOfContents?: boolean;
  includeMetadata?: boolean;
}

/**
 * Récupère tous les chapitres et sections ordonnés
 */
async function fetchAllContent(): Promise<{ chapters: Chapter[]; sections: Map<string, Section[]> }> {
  // Récupérer tous les chapitres
  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('*')
    .order('order', { ascending: true });

  if (chaptersError) throw chaptersError;

  // Récupérer toutes les sections
  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .order('order', { ascending: true });

  if (sectionsError) throw sectionsError;

  // Grouper les sections par chapitre
  const sectionsByChapter = new Map<string, Section[]>();
  for (const section of sections || []) {
    const existing = sectionsByChapter.get(section.chapter_id) || [];
    sectionsByChapter.set(section.chapter_id, [...existing, section]);
  }

  return {
    chapters: chapters || [],
    sections: sectionsByChapter,
  };
}

/**
 * Génère la table des matières
 */
function generateTableOfContents(chapters: Chapter[], sections: Map<string, Section[]>): string {
  let toc = '# Table des matières\n\n';

  for (const chapter of chapters) {
    const chapterSections = sections.get(chapter.id) || [];

    // Titre du chapitre
    if (chapter.order === 0) {
      toc += `- **Introduction générale**\n`;
    } else if (chapter.order === chapters.length - 1) {
      toc += `- **Conclusion**\n`;
    } else {
      toc += `- **${chapter.title}**\n`;
    }

    // Sections du chapitre
    for (const section of chapterSections) {
      toc += `  - ${section.title}\n`;
    }
  }

  return toc + '\n---\n\n';
}

/**
 * Génère le contenu consolidé en Markdown
 */
export async function generateConsolidatedMarkdown(options: ExportOptions = {}): Promise<string> {
  const {
    includeEmptySections = false,
    includeTableOfContents = true,
    includeMetadata = true,
  } = options;

  const { chapters, sections } = await fetchAllContent();

  let markdown = '';

  // Métadonnées
  if (includeMetadata) {
    markdown += `---
title: "Mémoire DEC - Knowledge Management"
author: "Alexandre ASSOR"
date: "${new Date().toLocaleDateString('fr-FR')}"
---

`;
  }

  // Table des matières
  if (includeTableOfContents) {
    markdown += generateTableOfContents(chapters, sections);
  }

  // Contenu de chaque chapitre
  for (const chapter of chapters) {
    const chapterSections = sections.get(chapter.id) || [];

    // Titre du chapitre
    if (chapter.order === 0) {
      markdown += `# Introduction générale\n\n`;
    } else if (chapter.order === chapters.length - 1) {
      markdown += `# Conclusion\n\n`;
    } else {
      // Déterminer la partie
      let partie = '';
      if (chapter.order >= 1 && chapter.order <= 3) partie = 'PARTIE I — ';
      else if (chapter.order >= 4 && chapter.order <= 6) partie = 'PARTIE II — ';
      else if (chapter.order >= 7 && chapter.order <= 9) partie = 'PARTIE III — ';

      markdown += `# ${partie}${chapter.title}\n\n`;
    }

    // Sections du chapitre
    for (const section of chapterSections) {
      // Sauter les sections vides si demandé
      if (!includeEmptySections && !section.content_md?.trim()) {
        markdown += `## ${section.title}\n\n*[Contenu à rédiger]*\n\n`;
        continue;
      }

      markdown += `## ${section.title}\n\n`;
      markdown += section.content_md || '';
      markdown += '\n\n';
    }

    // Séparateur entre chapitres
    markdown += '---\n\n';
  }

  return markdown;
}

/**
 * Télécharge le mémoire consolidé comme fichier .md
 */
export async function downloadConsolidatedMemoire(options: ExportOptions = {}): Promise<void> {
  const markdown = await generateConsolidatedMarkdown(options);

  // Créer le blob et le lien de téléchargement
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `memoire_km_${new Date().toISOString().split('T')[0]}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Compte les mots dans un texte (markdown)
 */
function countWords(text: string): number {
  if (!text?.trim()) return 0;
  // Retirer le markdown basique et compter les mots
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // Blocs de code
    .replace(/`[^`]+`/g, '') // Code inline
    .replace(/!\[.*?\]\(.*?\)/g, '') // Images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Liens (garder le texte)
    .replace(/[#*_~>|-]/g, '') // Caractères markdown
    .replace(/\s+/g, ' ') // Espaces multiples
    .trim();

  if (!cleanText) return 0;
  return cleanText.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Configuration DEC pour l'estimation des pages
 * - 2500 mots par page (marges 2.5cm)
 * - Maximum recommandé : 100 pages hors annexes
 */
const DEC_CONFIG = {
  wordsPerPage: 2500,
  maxPages: 100,
  maxWords: 250000, // 100 * 2500
};

export interface MemoireStats {
  totalChapters: number;
  totalSections: number;
  sectionsWithContent: number;
  totalCharacters: number;
  totalWords: number;
  estimatedPages: number;
  progress: {
    percentage: number;
    status: 'under' | 'optimal' | 'over';
    message: string;
  };
  byChapter: Array<{
    chapterId: string;
    chapterTitle: string;
    chapterOrder: number;
    words: number;
    sections: number;
  }>;
}

/**
 * Génère des statistiques détaillées sur le mémoire
 */
export async function getMemoireStats(): Promise<MemoireStats> {
  const { chapters, sections } = await fetchAllContent();

  let totalCharacters = 0;
  let totalWords = 0;
  let sectionsWithContent = 0;
  let totalSections = 0;

  const byChapter: MemoireStats['byChapter'] = [];

  for (const chapter of chapters) {
    const chapterSections = sections.get(chapter.id) || [];
    let chapterWords = 0;

    for (const section of chapterSections) {
      totalSections++;
      if (section.content_md?.trim()) {
        sectionsWithContent++;
        totalCharacters += section.content_md.length;
        const words = countWords(section.content_md);
        totalWords += words;
        chapterWords += words;
      }
    }

    byChapter.push({
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      chapterOrder: chapter.order,
      words: chapterWords,
      sections: chapterSections.length,
    });
  }

  // Estimation pages (250 mots/page standard académique)
  const estimatedPages = Math.ceil(totalWords / DEC_CONFIG.wordsPerPage);

  // Calcul de la progression
  const percentage = Math.min(100, Math.round((totalWords / DEC_CONFIG.maxWords) * 100));

  let status: MemoireStats['progress']['status'];
  let message: string;

  if (totalWords < DEC_CONFIG.maxWords * 0.7) {
    status = 'under';
    const remaining = DEC_CONFIG.maxWords * 0.8 - totalWords;
    message = `~${Math.round(remaining).toLocaleString()} mots avant la zone optimale (80-100 pages)`;
  } else if (totalWords <= DEC_CONFIG.maxWords) {
    status = 'optimal';
    const remaining = DEC_CONFIG.maxWords - totalWords;
    message = `Zone optimale ! ~${Math.round(remaining).toLocaleString()} mots de marge`;
  } else {
    status = 'over';
    const excess = totalWords - DEC_CONFIG.maxWords;
    message = `Dépassement de ~${Math.round(excess).toLocaleString()} mots (${Math.round(excess / DEC_CONFIG.wordsPerPage)} pages)`;
  }

  return {
    totalChapters: chapters.length,
    totalSections,
    sectionsWithContent,
    totalCharacters,
    totalWords,
    estimatedPages,
    progress: {
      percentage,
      status,
      message,
    },
    byChapter,
  };
}
