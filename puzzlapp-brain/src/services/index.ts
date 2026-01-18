export { chaptersService } from './chapters';
export { sectionsService } from './sections';
export { agentsService } from './agents';
export { bibliographyService } from './bibliography';
export { annexesService } from './annexes';
export { notesService } from './notes';
export { figuresService } from './figures';
export { contentDraftsService } from './contentDrafts';
export { parseMarkdownFile, parseMarkdownString, isValidMarkdownFile } from './markdownImport';
export {
  generateConsolidatedMarkdown,
  downloadConsolidatedMemoire,
  getMemoireStats,
} from './memoireExport';
export type { MemoireStats } from './memoireExport';

export type { CreateChapterInput, UpdateChapterInput } from './chapters';
export type { CreateSectionInput, UpdateSectionInput } from './sections';
export type { CreateSourceInput, UpdateSourceInput } from './bibliography';
export type { CreateAnnexeInput, UpdateAnnexeInput } from './annexes';
export type { CreateNoteInput, UpdateNoteInput, NotesFilter } from './notes';
export type { CreateFigureInput, UpdateFigureInput } from './figures';
export type { CreateDraftInput, UpdateDraftInput, DraftsFilter } from './contentDrafts';
