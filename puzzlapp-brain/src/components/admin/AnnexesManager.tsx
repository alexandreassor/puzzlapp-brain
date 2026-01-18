/**
 * Gestionnaire des annexes
 *
 * Interface CRUD pour gérer les documents annexes référençables via @
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, FileText, Table, Image, HelpCircle, Code } from 'lucide-react';
import { annexesService } from '@/services';
import type { Annexe, AnnexeType } from '@/types';

const ANNEXE_TYPE_CONFIG: Record<AnnexeType, { label: string; icon: typeof FileText; color: string }> = {
  document: { label: 'Document', icon: FileText, color: 'bg-blue-500/10 text-blue-600' },
  tableau: { label: 'Tableau', icon: Table, color: 'bg-green-500/10 text-green-600' },
  figure: { label: 'Figure', icon: Image, color: 'bg-purple-500/10 text-purple-600' },
  questionnaire: { label: 'Questionnaire', icon: HelpCircle, color: 'bg-orange-500/10 text-orange-600' },
  exemple: { label: 'Exemple', icon: Code, color: 'bg-pink-500/10 text-pink-600' },
};

export function AnnexesManager() {
  const [annexes, setAnnexes] = useState<Annexe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnexe, setSelectedAnnexe] = useState<Annexe | null>(null);

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnexe, setEditingAnnexe] = useState<Annexe | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    content_md: '',
    annexe_type: 'document' as AnnexeType,
  });

  // Chargement des annexes
  const loadAnnexes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await annexesService.getAll();
      setAnnexes(data);
    } catch (error) {
      console.error('[AnnexesManager] Load error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnexes();
  }, [loadAnnexes]);

  // Ouvrir dialog pour nouvelle annexe
  const handleNewAnnexe = () => {
    setEditingAnnexe(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      content_md: '',
      annexe_type: 'document',
    });
    setIsDialogOpen(true);
  };

  // Ouvrir dialog pour éditer
  const handleEditAnnexe = (annexe: Annexe) => {
    setEditingAnnexe(annexe);
    setFormData({
      code: annexe.code,
      title: annexe.title,
      description: annexe.description || '',
      content_md: annexe.content_md || '',
      annexe_type: annexe.annexe_type,
    });
    setIsDialogOpen(true);
  };

  // Sauvegarder
  const handleSave = async () => {
    try {
      if (editingAnnexe) {
        await annexesService.update(editingAnnexe.id, formData);
      } else {
        await annexesService.create(formData);
      }
      setIsDialogOpen(false);
      loadAnnexes();
    } catch (error) {
      console.error('[AnnexesManager] Save error:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Supprimer
  const handleDelete = async (annexe: Annexe) => {
    if (!confirm(`Supprimer l'annexe "${annexe.title}" ?`)) return;

    try {
      await annexesService.delete(annexe.id);
      if (selectedAnnexe?.id === annexe.id) {
        setSelectedAnnexe(null);
      }
      loadAnnexes();
    } catch (error) {
      console.error('[AnnexesManager] Delete error:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement des annexes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Annexes</h2>
          <p className="text-muted-foreground">
            Documents complémentaires référençables via <code className="bg-muted px-1 rounded">@CODE</code>
          </p>
        </div>
        <Button onClick={handleNewAnnexe}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle annexe
        </Button>
      </div>

      {/* Liste des annexes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Liste */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Liste des annexes</CardTitle>
            <CardDescription>{annexes.length} annexe{annexes.length !== 1 ? 's' : ''}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {annexes.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  Aucune annexe. Créez votre première annexe.
                </div>
              ) : (
                <div className="divide-y">
                  {annexes.map((annexe) => {
                    const config = ANNEXE_TYPE_CONFIG[annexe.annexe_type];
                    const Icon = config.icon;
                    const isSelected = selectedAnnexe?.id === annexe.id;

                    return (
                      <div
                        key={annexe.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors ${
                          isSelected ? 'bg-accent' : ''
                        }`}
                        onClick={() => setSelectedAnnexe(annexe)}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-1 rounded">@{annexe.code}</code>
                            <Badge variant="outline" className="text-xs">
                              {config.label}
                            </Badge>
                          </div>
                          <div className="font-medium truncate">{annexe.title}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAnnexe(annexe);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(annexe);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Prévisualisation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aperçu</CardTitle>
            <CardDescription>
              {selectedAnnexe ? `@${selectedAnnexe.code}` : 'Sélectionnez une annexe'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedAnnexe ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Titre</div>
                  <div className="font-medium">{selectedAnnexe.title}</div>
                </div>
                {selectedAnnexe.description && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-sm">{selectedAnnexe.description}</div>
                  </div>
                )}
                {selectedAnnexe.content_md && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Contenu</div>
                    <ScrollArea className="h-[300px] border rounded p-3">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {selectedAnnexe.content_md}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sélectionnez une annexe pour voir son contenu
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAnnexe ? 'Modifier l\'annexe' : 'Nouvelle annexe'}
            </DialogTitle>
            <DialogDescription>
              Le code sera utilisé pour référencer l'annexe via @CODE dans l'éditeur.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code (unique)</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="QUESTIONNAIRE_KM"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Sera converti en MAJUSCULES_SNAKE_CASE
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={formData.annexe_type}
                  onValueChange={(value: string) => setFormData({ ...formData, annexe_type: value as AnnexeType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ANNEXE_TYPE_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Titre</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Questionnaire de maturité KM"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optionnelle)</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brève description de l'annexe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Contenu (Markdown)</label>
              <Textarea
                value={formData.content_md}
                onChange={(e) => setFormData({ ...formData, content_md: e.target.value })}
                placeholder="Contenu de l'annexe en Markdown..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!formData.code.trim() || !formData.title.trim()}>
              {editingAnnexe ? 'Enregistrer' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
