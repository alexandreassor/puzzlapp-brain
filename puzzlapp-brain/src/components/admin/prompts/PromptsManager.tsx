/**
 * PromptsManager - Gestionnaire des prompts des agents IA
 *
 * Permet de visualiser et modifier les prompts stockés dans Supabase.
 */

import { useState, useEffect, useCallback } from 'react';
import { Bot, RefreshCw, Edit2, Copy, Trash2, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { promptsService, type AgentPrompt } from '@/services/prompts';
import { PromptEditor } from './PromptEditor';
import { cn } from '@/lib/utils';

// Couleurs par skill (comme dans VictorSkillButtons)
const SKILL_COLORS: Record<string, string> = {
  redaction: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  recherche: 'bg-green-500/10 text-green-600 border-green-500/20',
  acquisition: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  plan: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  bibliographie: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  critique: 'bg-red-500/10 text-red-600 border-red-500/20',
  // Autres agents
  guide: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  recommandation: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  coaching: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  diagnostic: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
};

export function PromptsManager() {
  const [prompts, setPrompts] = useState<AgentPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('victor');
  const [editingPrompt, setEditingPrompt] = useState<AgentPrompt | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Charger les prompts
  const loadPrompts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await promptsService.getPromptsByAgent(selectedAgent);
      setPrompts(data);
    } catch (error) {
      console.error('[PromptsManager] Error loading prompts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  // Rafraîchir et vider le cache
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await promptsService.clearAllCache();
    await loadPrompts();
    setIsRefreshing(false);
  };

  // Éditer un prompt
  const handleEdit = (prompt: AgentPrompt) => {
    setEditingPrompt(prompt);
  };

  // Sauvegarder les modifications
  const handleSave = async (id: string, systemPrompt: string) => {
    try {
      await promptsService.updatePromptContent(id, systemPrompt);
      await loadPrompts();
      setEditingPrompt(null);
    } catch (error) {
      console.error('[PromptsManager] Error saving prompt:', error);
    }
  };

  // Dupliquer un prompt
  const handleDuplicate = async (prompt: AgentPrompt) => {
    try {
      await promptsService.duplicatePrompt(prompt.id, `${prompt.name} (copie)`);
      await loadPrompts();
    } catch (error) {
      console.error('[PromptsManager] Error duplicating prompt:', error);
    }
  };

  // Désactiver un prompt
  const handleDeactivate = async (id: string) => {
    if (!confirm('Voulez-vous vraiment désactiver ce prompt ?')) return;
    try {
      await promptsService.deactivatePrompt(id);
      await loadPrompts();
    } catch (error) {
      console.error('[PromptsManager] Error deactivating prompt:', error);
    }
  };

  const agentTypes = promptsService.getAgentTypes();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Bot className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Gestion des Prompts</h2>
            <p className="text-sm text-muted-foreground">
              Modifiez les prompts système des agents IA
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          Rafraîchir le cache
        </Button>
      </div>

      {/* Tabs par agent */}
      <Tabs value={selectedAgent} onValueChange={setSelectedAgent}>
        <TabsList>
          {agentTypes.map((agent) => (
            <TabsTrigger
              key={agent.value}
              value={agent.value}
              disabled={agent.status === 'coming_soon'}
              className="relative"
            >
              {agent.label}
              {agent.status === 'coming_soon' && (
                <Badge variant="secondary" className="ml-2 text-[10px] px-1">
                  Soon
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedAgent} className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : prompts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Aucun prompt trouvé pour cet agent.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={() => handleEdit(prompt)}
                  onDuplicate={() => handleDuplicate(prompt)}
                  onDeactivate={() => handleDeactivate(prompt.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal d'édition */}
      {editingPrompt && (
        <PromptEditor
          prompt={editingPrompt}
          onSave={handleSave}
          onClose={() => setEditingPrompt(null)}
        />
      )}
    </div>
  );
}

// =============================================================================
// PROMPT CARD
// =============================================================================

interface PromptCardProps {
  prompt: AgentPrompt;
  onEdit: () => void;
  onDuplicate: () => void;
  onDeactivate: () => void;
}

function PromptCard({ prompt, onEdit, onDuplicate, onDeactivate }: PromptCardProps) {
  const skillColor = SKILL_COLORS[prompt.skill] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';

  return (
    <Card className={cn(!prompt.is_active && 'opacity-50')}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={skillColor}>
              {prompt.skill}
            </Badge>
            <CardTitle className="text-base">{prompt.name}</CardTitle>
            {prompt.is_active ? (
              <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                <Check className="h-3 w-3 mr-1" />
                Actif
              </Badge>
            ) : (
              <Badge variant="secondary">
                <X className="h-3 w-3 mr-1" />
                Inactif
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDuplicate}>
              <Copy className="h-4 w-4" />
            </Button>
            {prompt.is_active && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={onDeactivate}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {prompt.description && (
          <CardDescription>{prompt.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Outils autorisés */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Outils:</span>
            <div className="flex flex-wrap gap-1">
              {prompt.allowed_tools.map((tool) => (
                <Badge key={tool} variant="secondary" className="text-xs">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>

          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Version {prompt.version}</span>
            <span>Max {prompt.max_turns} tours</span>
            <span>
              Modifié le {new Date(prompt.updated_at).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {/* Aperçu du prompt */}
          <div className="mt-2 p-3 bg-muted/50 rounded-md">
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap line-clamp-4 font-mono">
              {prompt.system_prompt.substring(0, 300)}
              {prompt.system_prompt.length > 300 && '...'}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
