/**
 * Service d'import de fichiers Markdown
 *
 * Permet d'importer des fichiers .md dans l'éditeur TipTap
 */

import { marked } from 'marked';

// Configuration de marked pour un rendu compatible TipTap
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convertir les sauts de ligne en <br>
});

/**
 * Parse un fichier Markdown et retourne du HTML compatible TipTap
 */
export async function parseMarkdownFile(file: File): Promise<string> {
  // Validation du format
  if (!file.name.match(/\.(md|markdown)$/i)) {
    throw new Error('Format invalide. Seuls les fichiers .md ou .markdown sont acceptés.');
  }

  // Validation de la taille (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error('Fichier trop volumineux. Taille maximum : 5 Mo.');
  }

  // Lecture du fichier
  const text = await file.text();

  // Conversion en HTML
  const html = await marked.parse(text);

  return html;
}

/**
 * Parse une chaîne Markdown et retourne du HTML
 */
export async function parseMarkdownString(markdown: string): Promise<string> {
  return marked.parse(markdown);
}

/**
 * Valide si un fichier est un fichier Markdown valide
 */
export function isValidMarkdownFile(file: File): boolean {
  return /\.(md|markdown)$/i.test(file.name);
}
