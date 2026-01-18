/**
 * Modal d'upload de figure
 *
 * Drag & drop, preview, configuration de la légende et taille
 */

import { useState, useCallback, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImagePlus, Upload, X, Loader2 } from 'lucide-react';
import { figuresService } from '@/services';
import type { Figure, FigureType, FigureWidth, Chapter } from '@/types';

interface FigureUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (figure: Figure) => void;
  chapters?: Chapter[];
  currentChapterId?: string;
}

export function FigureUploader({
  isOpen,
  onClose,
  onInsert,
  chapters = [],
  currentChapterId,
}: FigureUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [figureType, setFigureType] = useState<FigureType>('image');
  const [width, setWidth] = useState<FigureWidth>('full');
  const [chapterId, setChapterId] = useState<string | undefined>(currentChapterId);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setFigureType('image');
    setWidth('full');
    setChapterId(currentChapterId);
    setError(null);
    onClose();
  }, [currentChapterId, onClose]);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Seules les images sont acceptées');
      return;
    }

    // Validate file size (10MB max)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Fichier trop volumineux (max 10MB)');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);

    // Auto-fill title from filename
    if (!title) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^.]+$/, '');
      setTitle(nameWithoutExt.replace(/[-_]/g, ' '));
    }
  }, [title]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  }, [handleFileSelect]);

  // Handle upload and insert
  const handleUpload = useCallback(async () => {
    if (!file || !title.trim()) return;

    setIsUploading(true);
    setError(null);

    try {
      const figure = await figuresService.upload(file, {
        title: title.trim(),
        description: description.trim() || undefined,
        chapter_id: chapterId,
        figure_type: figureType,
        width,
      });

      onInsert(figure);
      handleClose();
    } catch (err) {
      console.error('Erreur upload figure:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  }, [file, title, description, chapterId, figureType, width, onInsert, handleClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Insérer une figure
          </DialogTitle>
          <DialogDescription>
            Uploadez une image avec légende numérotée automatiquement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone / Preview */}
          {!preview ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Glissez une image ici ou{' '}
                <span className="text-primary font-medium">cliquez pour sélectionner</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG, GIF, WebP, SVG (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Form fields */}
          <div className="grid gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="figure-title">Légende *</Label>
              <Input
                id="figure-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Description de la figure..."
              />
            </div>

            {/* Description (alt text) */}
            <div className="space-y-2">
              <Label htmlFor="figure-description">Description (alt text)</Label>
              <Textarea
                id="figure-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée pour l'accessibilité..."
                rows={2}
              />
            </div>

            {/* Row: Chapter, Type, Width */}
            <div className="grid grid-cols-3 gap-4">
              {/* Chapter */}
              <div className="space-y-2">
                <Label>Chapitre</Label>
                <Select
                  value={chapterId || 'none'}
                  onValueChange={(value: string) => setChapterId(value === 'none' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.order}. {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={figureType}
                  onValueChange={(value: string) => setFigureType(value as FigureType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="screenshot">Screenshot</SelectItem>
                    <SelectItem value="infographie">Infographie</SelectItem>
                    <SelectItem value="schema">Schéma</SelectItem>
                    <SelectItem value="tableau">Tableau</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Width */}
              <div className="space-y-2">
                <Label>Taille</Label>
                <Select
                  value={width}
                  onValueChange={(value: string) => setWidth(value as FigureWidth)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite (33%)</SelectItem>
                    <SelectItem value="medium">Moyenne (50%)</SelectItem>
                    <SelectItem value="full">Pleine largeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !title.trim() || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Upload...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4 mr-2" />
                Insérer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FigureUploader;
