import { useState } from 'react';
import { Settings2, Search, Brain, Zap, Globe, ChevronDown, ChevronUp, Sparkles, Plus, X, FileSpreadsheet, FileText, Presentation, Code, HelpCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// Types pour les Skills Anthropic
export interface AnthropicSkill {
  type: 'anthropic' | 'custom';
  skill_id: string;
  version: string;
  name?: string; // Display name
  description?: string;
}

// Skills pré-construites Anthropic disponibles
export const ANTHROPIC_BUILTIN_SKILLS: AnthropicSkill[] = [
  { type: 'anthropic', skill_id: 'xlsx', version: 'latest', name: 'Excel/XLSX', description: 'Analyse et création de fichiers Excel' },
  { type: 'anthropic', skill_id: 'pdf', version: 'latest', name: 'PDF', description: 'Lecture et extraction de PDF' },
  { type: 'anthropic', skill_id: 'docx', version: 'latest', name: 'Word/DOCX', description: 'Documents Word' },
  { type: 'anthropic', skill_id: 'pptx', version: 'latest', name: 'PowerPoint', description: 'Présentations PowerPoint' },
];

export interface VictorOptions {
  // Tools natifs Anthropic
  webSearch: boolean;
  extendedThinking: boolean;
  thinkingBudget: number; // 1024 - 50000 tokens
  // Skills (Anthropic Console)
  skills: AnthropicSkill[];
  codeExecution: boolean; // Requis pour les skills
  // MCP Connections (futur)
  mcpNotion: boolean;
  mcpSupabase: boolean;
}

// Valeurs par défaut conformes à la doc Anthropic
// Ref: https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking
export const DEFAULT_VICTOR_OPTIONS: VictorOptions = {
  webSearch: false,
  extendedThinking: false,
  thinkingBudget: 10000, // Min officiel: 1024
  skills: [],
  codeExecution: false,
  mcpNotion: false,
  mcpSupabase: false,
};

interface VictorSettingsProps {
  options: VictorOptions;
  onChange: (options: VictorOptions) => void;
  disabled?: boolean;
}

export function VictorSettings({ options, onChange, disabled = false }: VictorSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customSkillId, setCustomSkillId] = useState('');

  const updateOption = <K extends keyof VictorOptions>(key: K, value: VictorOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  // Toggle une skill built-in
  const toggleBuiltinSkill = (skill: AnthropicSkill) => {
    const exists = options.skills.some(s => s.skill_id === skill.skill_id);
    if (exists) {
      updateOption('skills', options.skills.filter(s => s.skill_id !== skill.skill_id));
    } else {
      updateOption('skills', [...options.skills, skill]);
      // Active automatiquement code_execution si des skills sont ajoutées
      if (!options.codeExecution) {
        updateOption('codeExecution', true);
      }
    }
  };

  // Ajouter une skill custom
  const addCustomSkill = () => {
    if (!customSkillId.trim()) return;
    const newSkill: AnthropicSkill = {
      type: 'custom',
      skill_id: customSkillId.trim(),
      version: 'latest',
      name: customSkillId.trim(),
    };
    if (!options.skills.some(s => s.skill_id === newSkill.skill_id)) {
      updateOption('skills', [...options.skills, newSkill]);
      if (!options.codeExecution) {
        updateOption('codeExecution', true);
      }
    }
    setCustomSkillId('');
  };

  // Supprimer une skill
  const removeSkill = (skillId: string) => {
    updateOption('skills', options.skills.filter(s => s.skill_id !== skillId));
  };

  // Compte le nombre d'options actives
  const activeCount = [
    options.webSearch,
    options.extendedThinking,
    options.codeExecution,
    options.skills.length > 0,
    options.mcpNotion,
    options.mcpSupabase,
  ].filter(Boolean).length;

  return (
    <div className="border-b bg-muted/20">
      {/* Toggle header */}
      <div className="flex items-center justify-between px-3 py-2 text-sm">
        <button
          className="flex flex-1 items-center gap-2 hover:bg-muted/30 transition-colors rounded -ml-1 px-1 py-0.5"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={disabled}
        >
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Capacités</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
              {activeCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
          )}
        </button>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://docs.anthropic.com/en/docs/agents-and-tools/skills"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 p-1 rounded hover:bg-muted transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Documentation Anthropic Skills</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Settings panel */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Web Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-green-500" />
              <div>
                <Label htmlFor="web-search" className="text-sm font-medium cursor-pointer">
                  Web Search
                </Label>
                <p className="text-xs text-muted-foreground">
                  Recherche web en temps réel
                </p>
              </div>
            </div>
            <Switch
              id="web-search"
              checked={options.webSearch}
              onCheckedChange={(checked: boolean) => updateOption('webSearch', checked)}
              disabled={disabled}
            />
          </div>

          {/* Extended Thinking */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <div>
                  <Label htmlFor="extended-thinking" className="text-sm font-medium cursor-pointer">
                    Réflexion approfondie
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Raisonnement étendu (critique, analyse)
                  </p>
                </div>
              </div>
              <Switch
                id="extended-thinking"
                checked={options.extendedThinking}
                onCheckedChange={(checked: boolean) => updateOption('extendedThinking', checked)}
                disabled={disabled}
              />
            </div>

            {/* Thinking budget slider - only show when extended thinking is enabled */}
            {options.extendedThinking && (
              <div className="pl-6 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Budget tokens</span>
                  <span className="font-mono text-primary">{options.thinkingBudget.toLocaleString()}</span>
                </div>
                <Slider
                  value={[options.thinkingBudget]}
                  onValueChange={([value]: number[]) => updateOption('thinkingBudget', value)}
                  min={1024}
                  max={50000}
                  step={1024}
                  disabled={disabled}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>1k (min)</span>
                  <span>50k (profond)</span>
                </div>
              </div>
            )}
          </div>

          {/* Divider - Skills */}
          <div className="border-t pt-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Skills Anthropic (beta)
            </p>
          </div>

          {/* Code Execution - requis pour les skills */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-blue-500" />
              <div>
                <Label htmlFor="code-execution" className="text-sm font-medium cursor-pointer">
                  Code Execution
                </Label>
                <p className="text-xs text-muted-foreground">
                  Requis pour les skills
                </p>
              </div>
            </div>
            <Switch
              id="code-execution"
              checked={options.codeExecution}
              onCheckedChange={(checked: boolean) => updateOption('codeExecution', checked)}
              disabled={disabled || options.skills.length > 0}
            />
          </div>

          {/* Built-in Skills */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Skills pré-construites</p>
            <div className="grid grid-cols-2 gap-2">
              {ANTHROPIC_BUILTIN_SKILLS.map((skill) => {
                const isActive = options.skills.some(s => s.skill_id === skill.skill_id);
                const Icon = skill.skill_id === 'xlsx' ? FileSpreadsheet
                  : skill.skill_id === 'pdf' ? FileText
                  : skill.skill_id === 'pptx' ? Presentation
                  : FileText;
                return (
                  <button
                    key={skill.skill_id}
                    onClick={() => toggleBuiltinSkill(skill)}
                    disabled={disabled}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-transparent'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Skills */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Skills custom (Console)</p>
            <div className="flex gap-2">
              <Input
                placeholder="skill_id"
                value={customSkillId}
                onChange={(e) => setCustomSkillId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                disabled={disabled}
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={addCustomSkill}
                disabled={disabled || !customSkillId.trim()}
                className="h-8 px-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Liste des skills custom ajoutées */}
            {options.skills.filter(s => s.type === 'custom').length > 0 && (
              <div className="flex flex-wrap gap-1">
                {options.skills.filter(s => s.type === 'custom').map((skill) => (
                  <span
                    key={skill.skill_id}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-500/10 text-violet-600 text-xs"
                  >
                    {skill.name || skill.skill_id}
                    <button
                      onClick={() => removeSkill(skill.skill_id)}
                      disabled={disabled}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Divider - MCP */}
          <div className="border-t pt-2">
            <p className="text-xs text-muted-foreground mb-2">Connexions MCP (bientôt)</p>
          </div>

          {/* MCP Notion */}
          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-500" />
              <div>
                <Label className="text-sm font-medium">
                  Notion
                </Label>
                <p className="text-xs text-muted-foreground">
                  Accès à vos pages Notion
                </p>
              </div>
            </div>
            <Switch
              checked={options.mcpNotion}
              onCheckedChange={(checked: boolean) => updateOption('mcpNotion', checked)}
              disabled={true} // Pas encore disponible
            />
          </div>

          {/* MCP Supabase */}
          <div className="flex items-center justify-between opacity-50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              <div>
                <Label className="text-sm font-medium">
                  Bibliographie
                </Label>
                <p className="text-xs text-muted-foreground">
                  Accès direct aux sources
                </p>
              </div>
            </div>
            <Switch
              checked={options.mcpSupabase}
              onCheckedChange={(checked: boolean) => updateOption('mcpSupabase', checked)}
              disabled={true} // Pas encore disponible
            />
          </div>

          {/* Info sur les coûts */}
          {(options.webSearch || options.extendedThinking || options.skills.length > 0) && (
            <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-2 text-xs text-amber-600">
              <strong>Note :</strong> Ces options augmentent la consommation de tokens
              {options.extendedThinking && ` (+${options.thinkingBudget.toLocaleString()} max)`}
              {options.skills.length > 0 && ` • ${options.skills.length} skill(s) active(s)`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
