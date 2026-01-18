/**
 * PromptEditor - Éditeur de prompt en modal/panel
 *
 * Permet de modifier le contenu d'un prompt avec un éditeur de texte.
 */

import { useState } from 'react';
import { X, Save, RotateCcw, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { AgentPrompt } from '@/services/prompts';
import { promptsService } from '@/services/prompts';
import ReactMarkdown from 'react-markdown';

interface PromptEditorProps {
  prompt: AgentPrompt;
  onSave: (id: string, systemPrompt: string) => Promise<void>;
  onClose: () => void;
}

export function PromptEditor({ prompt, onSave, onClose }: PromptEditorProps) {
  const [content, setContent] = useState(prompt.system_prompt);
  const [name, setName] = useState(prompt.name);
  const [description, setDescription] = useState(prompt.description || '');
  const [allowedTools, setAllowedTools] = useState<string[]>(prompt.allowed_tools);
  const [maxTurns, setMaxTurns] = useState(prompt.max_turns);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const availableTools = promptsService.getAvailableTools();
  const hasChanges = content !== prompt.system_prompt;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(prompt.id, content);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Voulez-vous annuler toutes les modifications ?')) {
      setContent(prompt.system_prompt);
      setName(prompt.name);
      setDescription(prompt.description || '');
    }
  };

  const toggleTool = (tool: string) => {
    setAllowedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-10 bg-background border rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              {prompt.agent_type} / {prompt.skill}
            </Badge>
            <h2 className="text-lg font-semibold">{prompt.name}</h2>
            {hasChanges && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                Non sauvegardé
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Paramètres */}
          <div className="w-64 border-r p-4 space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du prompt"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du prompt"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Outils autorisés</Label>
              <div className="space-y-2">
                {availableTools.map((tool) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tool-${tool}`}
                      checked={allowedTools.includes(tool)}
                      onCheckedChange={() => toggleTool(tool)}
                    />
                    <label
                      htmlFor={`tool-${tool}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {tool}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxTurns">Max tours</Label>
              <Input
                id="maxTurns"
                type="number"
                min={1}
                max={50}
                value={maxTurns}
                onChange={(e) => setMaxTurns(parseInt(e.target.value) || 10)}
              />
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
              <p>Version: {prompt.version}</p>
              <p>Créé le: {new Date(prompt.created_at).toLocaleDateString('fr-FR')}</p>
              <p>Modifié le: {new Date(prompt.updated_at).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Main - Éditeur */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}
              className="flex-1 flex flex-col"
            >
              <div className="px-4 pt-4 border-b">
                <TabsList>
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Éditer
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Aperçu
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="flex-1 p-4 overflow-hidden">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-full resize-none font-mono text-sm"
                  placeholder="Écrivez le prompt système ici..."
                />
              </TabsContent>

              <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer - Statistiques */}
        <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{content.length} caractères</span>
            <span>{content.split(/\s+/).length} mots</span>
            <span>{content.split('\n').length} lignes</span>
          </div>
          <div>
            Estimation tokens: ~{Math.ceil(content.length / 4)} tokens
          </div>
        </div>
      </div>
    </div>
  );
}
