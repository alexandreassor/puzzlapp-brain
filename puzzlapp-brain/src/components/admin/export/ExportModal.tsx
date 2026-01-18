/**
 * Modal d'export du mémoire
 *
 * Options de format et de contenu pour l'export PDF/Word/Markdown
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Printer,
  Download,
  Eye,
  Loader2,
  FileDown,
} from 'lucide-react';
import { MemoirePreview, type ExportOptions } from './MemoirePreview';
import { downloadConsolidatedMemoire } from '@/services';
import { annexesService, figuresService } from '@/services';
import type { Chapter, Section, Annexe, Figure } from '@/types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  sections: Map<string, Section[]>;
}

const DEFAULT_OPTIONS: ExportOptions = {
  includeTableOfContents: true,
  includeListOfFigures: true,
  includeAnnexes: true,
  pageNumbers: true,
  coverPage: {
    title: 'Management des Connaissances Innovant pour la Performance des Cabinets',
    subtitle: 'Proposition d\'un guide pratique',
    author: 'Alexandre ASSOR',
    date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
    }),
    institution: 'Diplôme d\'Expertise Comptable',
  },
};

export function ExportModal({
  isOpen,
  onClose,
  chapters,
  sections,
}: ExportModalProps) {
  const [options, setOptions] = useState<ExportOptions>(DEFAULT_OPTIONS);
  const [activeTab, setActiveTab] = useState<'options' | 'preview'>('options');
  const [isExporting, setIsExporting] = useState(false);
  const [annexes, setAnnexes] = useState<Annexe[]>([]);
  const [figures, setFigures] = useState<Figure[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load annexes and figures
  useEffect(() => {
    if (isOpen) {
      Promise.all([annexesService.getAll(), figuresService.getAll()])
        .then(([annexesData, figuresData]) => {
          setAnnexes(annexesData);
          setFigures(figuresData);
        })
        .catch(console.error);
    }
  }, [isOpen]);

  // Update option helper
  const updateOption = useCallback(
    <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
      setOptions((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Update cover page helper
  const updateCoverPage = useCallback(
    <K extends keyof ExportOptions['coverPage']>(
      key: K,
      value: ExportOptions['coverPage'][K]
    ) => {
      setOptions((prev) => ({
        ...prev,
        coverPage: { ...prev.coverPage, [key]: value },
      }));
    },
    []
  );

  // Export to Markdown
  const handleExportMarkdown = useCallback(async () => {
    setIsExporting(true);
    try {
      await downloadConsolidatedMemoire();
    } catch (error) {
      console.error('Erreur export Markdown:', error);
      alert('Erreur lors de l\'export Markdown');
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Export to PDF (print)
  const handleExportPdf = useCallback(() => {
    setActiveTab('preview');
    // Give time for the preview to render
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  // Stats
  const totalSections = Array.from(sections.values()).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            Exporter le mémoire
          </DialogTitle>
          <DialogDescription>
            {chapters.length} chapitres, {totalSections} sections,{' '}
            {figures.length} figures, {annexes.length} annexes
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'options' | 'preview')}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="options" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Options
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Aperçu
            </TabsTrigger>
          </TabsList>

          {/* Options Tab */}
          <TabsContent value="options" className="flex-1 overflow-auto p-4">
            <div className="space-y-6">
              {/* Cover Page */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Page de garde</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cover-title">Titre principal</Label>
                    <Input
                      id="cover-title"
                      value={options.coverPage.title}
                      onChange={(e) => updateCoverPage('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cover-subtitle">Sous-titre</Label>
                    <Input
                      id="cover-subtitle"
                      value={options.coverPage.subtitle || ''}
                      onChange={(e) =>
                        updateCoverPage('subtitle', e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cover-author">Auteur</Label>
                      <Input
                        id="cover-author"
                        value={options.coverPage.author || ''}
                        onChange={(e) =>
                          updateCoverPage('author', e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cover-institution">Institution</Label>
                      <Input
                        id="cover-institution"
                        value={options.coverPage.institution || ''}
                        onChange={(e) =>
                          updateCoverPage('institution', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Contenu</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Table des matières</Label>
                      <p className="text-xs text-muted-foreground">
                        Sommaire automatique avec liens
                      </p>
                    </div>
                    <Switch
                      checked={options.includeTableOfContents}
                      onCheckedChange={(checked: boolean) =>
                        updateOption('includeTableOfContents', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Liste des figures</Label>
                      <p className="text-xs text-muted-foreground">
                        {figures.length} figure{figures.length !== 1 ? 's' : ''}{' '}
                        référencée{figures.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Switch
                      checked={options.includeListOfFigures}
                      onCheckedChange={(checked: boolean) =>
                        updateOption('includeListOfFigures', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Annexes</Label>
                      <p className="text-xs text-muted-foreground">
                        {annexes.length} annexe{annexes.length !== 1 ? 's' : ''}{' '}
                        disponible{annexes.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Switch
                      checked={options.includeAnnexes}
                      onCheckedChange={(checked: boolean) =>
                        updateOption('includeAnnexes', checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Format Info */}
              <div className="rounded-md bg-muted p-4 text-sm space-y-2">
                <p className="font-medium">Formats disponibles :</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    <strong>PDF</strong> : via impression navigateur (Ctrl+P →
                    Enregistrer en PDF)
                  </li>
                  <li>
                    <strong>Markdown</strong> : fichier .md consolidé pour
                    traitement ultérieur
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent
            value="preview"
            className="flex-1 overflow-auto bg-gray-100 print:bg-white"
          >
            <MemoirePreview
              ref={previewRef}
              chapters={chapters}
              sections={sections}
              annexes={annexes}
              figures={figures}
              options={options}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t pt-4 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button
            variant="outline"
            onClick={handleExportMarkdown}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Markdown
          </Button>
          <Button onClick={handleExportPdf}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer / PDF
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Print-only styles to hide dialog chrome */}
      <style>{`
        @media print {
          body > *:not(.memoire-preview) {
            display: none !important;
          }

          [role="dialog"] {
            position: static !important;
            display: block !important;
            max-width: none !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }

          [role="dialog"] > *:not(.memoire-preview):not(:has(.memoire-preview)) {
            display: none !important;
          }
        }
      `}</style>
    </Dialog>
  );
}

export default ExportModal;
