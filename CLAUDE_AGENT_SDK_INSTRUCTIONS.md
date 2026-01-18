# CLAUDE_AGENT_SDK_INSTRUCTIONS.md — Guide Complet pour PuzzlApp Brain

> **INSTRUCTION PRIORITAIRE** : Lis ce fichier EN ENTIER avant de coder quoi que ce soit.
> Ce document contient les meilleures pratiques 2025-2026 de Anthropic pour les agents de production.

---

## 🚨 CONTEXTE CRITIQUE

Alexandre veut construire un **SaaS avec des agents IA évolutifs** pour les cabinets d'expertise comptable.

**Les agents** :
- **Léo** — Consultant KM (stratégie, diagnostic, SECI)
- **Sophie** — Avant-Vente (proposition valeur, scoring)
- **Marc** — Onboarding (formation, intégration)

**L'objectif** : Une expérience aussi fluide que claude.ai où l'utilisateur peut activer/désactiver les fonctionnalités avec des toggles (comme le bouton **+** dans claude.ai).

---

## 📚 DOCUMENTATION OFFICIELLE À LIRE

Avant d'implémenter, consulte ces liens :

| Ressource | URL |
|-----------|-----|
| **Agent SDK Overview** | https://platform.claude.com/docs/en/agent-sdk/overview |
| **Building Agents (Blog Anthropic)** | https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk |
| **Long-running Agents** | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents |
| **Agent Skills** | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview |
| **Web Search Tool** | https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool |
| **MCP Connector** | https://platform.claude.com/docs/en/agents-and-tools/mcp-connector |
| **Extended Thinking** | https://platform.claude.com/docs/en/build-with-claude/extended-thinking |
| **Memory Tool** | https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool |
| **Python SDK** | https://platform.claude.com/docs/en/agent-sdk/python |
| **TypeScript SDK** | https://platform.claude.com/docs/en/agent-sdk/typescript |
| **Skills API Guide** | https://docs.claude.com/en/api/skills-guide |
| **Example Agents** | https://github.com/anthropics/claude-agent-sdk-demos |
| **Quickstart autonome** | https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding |

---

## 🏗️ PRINCIPE FONDAMENTAL : Donner un "ordinateur" à Claude

Le principe clé du Claude Agent SDK est de donner à l'agent les mêmes outils qu'un humain utiliserait :
- Chercher des fichiers
- Écrire du code
- Exécuter des scripts
- Itérer jusqu'à la réussite

### Boucle Agentique Fondamentale

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   GATHER     │    │    TAKE      │    │   VERIFY     │
│   CONTEXT    │───▶│   ACTION     │───▶│    WORK      │───┐
│              │    │              │    │              │   │
└──────────────┘    └──────────────┘    └──────────────┘   │
       ▲                                                    │
       └────────────────────────────────────────────────────┘
                           REPEAT
```

---

## 🎛️ ARCHITECTURE "FLUIDE" — Comment activer/désactiver les fonctionnalités

Toutes les fonctionnalités sont des **options qu'on active ou pas** dans chaque appel API.

### Structure d'un appel API

```javascript
const response = await anthropic.messages.create({
  
  // ══════════════════════════════════════════════════════════
  // OBLIGATOIRE (toujours présent)
  // ══════════════════════════════════════════════════════════
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 4096,
  system: "Tu es Léo, consultant KM...",  // Personnalité agent
  messages: [
    { role: "user", content: "Aide-moi à diagnostiquer mon cabinet" }
  ],

  // ══════════════════════════════════════════════════════════
  // OPTIONNEL — Ajouter CE QUE VOUS VOULEZ selon les toggles UI
  // ══════════════════════════════════════════════════════════

  // 🔍 Web Search — SI toggle activé
  tools: [
    { type: "web_search_20250305", name: "web_search" }
  ],

  // 🧠 Extended Thinking — SI toggle activé
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },

  // 🔌 MCP Servers — SI toggles activés
  mcp_servers: [
    { type: "url", url: "https://mcp.notion.com/mcp", name: "notion" },
    { type: "url", url: "https://mcp.monday.com/mcp", name: "monday" }
  ]

});
```

### Matrice des combinaisons possibles

| Cas d'usage | tools | thinking | mcp_servers |
|-------------|-------|----------|-------------|
| **Chat simple** avec Léo | ❌ | ❌ | ❌ |
| **Diagnostic KM approfondi** | ❌ | ✅ | ❌ |
| **Veille réglementaire** | ✅ web_search | ❌ | ❌ |
| **Export livrables vers Notion** | ❌ | ❌ | ✅ notion |
| **Diagnostic + veille + export** | ✅ web_search | ✅ | ✅ notion |

---

## 📁 SKILLS — Compétences stockées dans la Console Anthropic

Les **Agent Skills** permettent de stocker les "personnalités" des agents dans la Console Anthropic.
Le lien se fait automatiquement quand tu appelles l'API.

### Comment appeler une Skill depuis l'API

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    
    # ══════════════════════════════════════════════════════════
    # BETA HEADERS REQUIS pour les Skills
    # ══════════════════════════════════════════════════════════
    betas=[
        "code-execution-2025-08-25",  # Requis pour skills
        "skills-2025-10-02"            # Requis pour skills
    ],
    
    # ══════════════════════════════════════════════════════════
    # SKILLS — Compétences stockées dans la Console
    # ══════════════════════════════════════════════════════════
    container={
        "skills": [
            # Skill custom (uploadée dans Console)
            {"type": "custom", "skill_id": "leo-km-consultant", "version": "latest"},
            
            # Skill Anthropic (pré-construite)
            {"type": "anthropic", "skill_id": "xlsx", "version": "latest"}
        ]
    },
    
    # ══════════════════════════════════════════════════════════
    # TOOLS — Activés/désactivés à la demande
    # ══════════════════════════════════════════════════════════
    tools=[
        {"type": "code_execution_20250825", "name": "code_execution"},  # Requis pour skills
        {"type": "web_search_20250305", "name": "web_search"}           # Optionnel
    ],
    
    messages=[
        {"role": "user", "content": "Aide-moi à diagnostiquer le KM de mon cabinet"}
    ]
)
```

### Skills pré-construites Anthropic

| skill_id | Description |
|----------|-------------|
| `xlsx` | Création/manipulation Excel |
| `pptx` | Création PowerPoint |
| `docx` | Création Word |
| `pdf` | Manipulation PDF |

### Skills custom à créer pour PuzzlApp

| skill_id | Description |
|----------|-------------|
| `leo-km-consultant` | Consultant KM stratégie |
| `sophie-avant-vente` | Experte avant-vente |
| `marc-onboarding` | Spécialiste onboarding |

---

## 🏛️ ARCHITECTURE MULTI-AGENTS SPÉCIALISÉS

**Best Practice 2025** : Ne pas faire un seul agent monolithique. Créer des sous-agents spécialisés orchestrés par un agent principal.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATEUR                                   │
│              (Minimal toolset: read files, route tasks, log)            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │      LÉO        │  │     SOPHIE      │  │      MARC       │         │
│  │  (KM Strategy)  │  │  (Avant-Vente)  │  │  (Onboarding)   │         │
│  │                 │  │                 │  │                 │         │
│  │ - Diagnostic    │  │ - Proposition   │  │ - Formation     │         │
│  │ - Roadmap       │  │ - Scoring       │  │ - Intégration   │         │
│  │ - Best practices│  │ - Négociation   │  │ - Support       │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │    REVIEWER     │  │   RESEARCHER    │  │    EXECUTOR     │         │
│  │                 │  │                 │  │                 │         │
│  │ - Validation    │  │ - Web Search    │  │ - Code/Export   │         │
│  │ - QA            │  │ - Veille        │  │ - Documents     │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Pourquoi des sous-agents ?

1. **Parallélisation** — Plusieurs sous-agents peuvent travailler simultanément
2. **Gestion du contexte** — Chaque sous-agent a sa propre fenêtre de contexte isolée
3. **Spécialisation** — Chaque agent est optimisé pour sa tâche
4. **Retour synthétique** — Les sous-agents ne renvoient que l'information pertinente

---

## 📂 STRUCTURE DE FICHIERS RECOMMANDÉE

```
/puzzlapp-brain/
│
├── CLAUDE.md                    # 🧠 Memory — Conventions projet, instructions globales
│
├── .claude/
│   ├── skills/                  # 📚 Skills personnalisées
│   │   ├── leo-km/SKILL.md
│   │   ├── sophie-vente/SKILL.md
│   │   └── marc-onboarding/SKILL.md
│   │
│   ├── commands/                # ⚡ Slash commands
│   │   ├── diagnostic.md
│   │   ├── proposition.md
│   │   └── onboard.md
│   │
│   └── hooks/                   # 🔗 Hooks (pre/post tool use)
│       ├── preToolUse.ts
│       ├── postToolUse.ts
│       └── onError.ts
│
├── context/                     # 📁 Contexte métier (agentic search)
│   ├── cabinet-profile.json     # Profil du cabinet client
│   ├── km-framework/            # Framework KM 360
│   │   ├── competencies.json
│   │   ├── processes.json
│   │   └── templates/
│   └── conversations/           # Historique conversations
│
├── progress/                    # 📊 Suivi de progression (multi-session)
│   ├── claude-progress.txt      # Log de ce que les agents ont fait
│   └── feature_list.json        # Liste des fonctionnalités à implémenter
│
└── outputs/                     # 📤 Livrables générés
    ├── diagnostics/
    ├── propositions/
    └── formations/
```

---

## ⏱️ GESTION DES SESSIONS LONGUES

**Problème** : Les agents perdent le contexte entre les sessions.

**Solution Anthropic 2025** : Utiliser un **Initializer Agent** + **Working Agent**.

### Architecture bi-agent pour sessions longues

```python
# src/services/agentHarness.py

class PuzzlAppAgentHarness:
    """
    Harness pour agents longue durée avec gestion de contexte.
    """
    
    def __init__(self, cabinet_id: str):
        self.cabinet_id = cabinet_id
        self.progress_file = f"context/{cabinet_id}/claude-progress.txt"
        self.features_file = f"context/{cabinet_id}/feature_list.json"
    
    async def run_session(self, user_prompt: str, is_first_session: bool = False):
        """
        Exécute une session agent avec le bon prompt.
        """
        if is_first_session:
            return await self._run_initializer_agent(user_prompt)
        else:
            return await self._run_working_agent(user_prompt)
    
    async def _run_initializer_agent(self, prompt: str):
        """
        Premier agent : setup de l'environnement.
        
        Responsabilités:
        - Créer la feature_list.json avec toutes les tâches
        - Initialiser claude-progress.txt
        - Créer le commit git initial
        - Écrire init.sh pour le setup
        """
        system_prompt = """
        Tu es l'INITIALIZER AGENT pour PuzzlApp Brain.
        
        Ta mission pour cette PREMIÈRE SESSION :
        1. Analyser la demande du client
        2. Créer feature_list.json avec TOUTES les tâches à accomplir
           (chaque feature marquée "passes": false)
        3. Créer claude-progress.txt vide
        4. Faire un commit git initial
        5. NE PAS commencer à implémenter - juste préparer
        
        Format de feature_list.json :
        {
          "features": [
            {
              "id": "F001",
              "category": "diagnostic",
              "description": "Analyser la maturité KM du cabinet",
              "steps": ["...", "..."],
              "passes": false
            }
          ]
        }
        """
        # ... appel SDK
    
    async def _run_working_agent(self, prompt: str):
        """
        Agents suivants : travail incrémental.
        
        Responsabilités:
        - Lire le progress file et git log
        - Choisir UNE seule feature à implémenter
        - Implémenter et tester
        - Mettre à jour progress et faire commit
        """
        system_prompt = """
        Tu es un WORKING AGENT pour PuzzlApp Brain.
        
        ÉTAPE 1 - ORIENTATION (toujours faire en premier) :
        - pwd pour voir le répertoire
        - Lire claude-progress.txt
        - Lire feature_list.json
        - git log --oneline -20
        
        ÉTAPE 2 - CHOISIR UNE FEATURE :
        - Prendre la feature prioritaire avec "passes": false
        - UNE SEULE feature par session
        
        ÉTAPE 3 - IMPLÉMENTER :
        - Travailler de manière incrémentale
        - Tester end-to-end
        - Ne marquer "passes": true QU'APRÈS test réussi
        
        ÉTAPE 4 - CLEAN STATE :
        - git commit avec message descriptif
        - Mettre à jour claude-progress.txt
        - Laisser le code mergeable (pas de bugs, bien documenté)
        
        ⚠️ RÈGLE ABSOLUE : Ne JAMAIS supprimer ou modifier les tests existants.
        """
        # ... appel SDK
```

---

## 🔗 HOOKS — Contrôle fin de l'exécution

Les **Hooks** permettent d'injecter de la logique avant/après chaque action de l'agent.

```typescript
// src/hooks/preToolUse.ts
import type { PreToolUseHook } from 'claude-agent-sdk';

export const preToolUse: PreToolUseHook = async ({ tool, input, context }) => {
  
  // 🔒 SÉCURITÉ — Bloquer commandes dangereuses
  if (tool === 'Bash') {
    const dangerousCommands = ['rm -rf', 'sudo', 'DROP TABLE'];
    if (dangerousCommands.some(cmd => input.command.includes(cmd))) {
      return {
        decision: 'block',
        message: 'Commande dangereuse bloquée. Demander confirmation humaine.'
      };
    }
  }
  
  // 📊 TÉLÉMÉTRIE — Logger chaque action
  await logToTelemetry({
    traceId: context.sessionId,
    tool,
    input,
    timestamp: new Date().toISOString()
  });
  
  // ✅ VALIDATION — Sanitizer les inputs
  const sanitizedInput = sanitizeInput(input);
  
  return {
    decision: 'allow',
    input: sanitizedInput
  };
};

// src/hooks/postToolUse.ts
export const postToolUse: PostToolUseHook = async ({ tool, output, context }) => {
  
  // 📈 Métriques
  await recordMetrics({
    tool,
    latency: output.duration,
    success: !output.error,
    tokenCount: output.tokens
  });
  
  // 🔄 Promotion d'artefacts
  if (tool === 'FileWrite' && output.path.endsWith('.json')) {
    await promoteToKnowledgeBase(output.path);
  }
  
  return output;
};

// src/hooks/onError.ts
export const onError: ErrorHook = async ({ error, context }) => {
  
  // 🚨 Escalation vers humain si erreur critique
  if (error.severity === 'critical') {
    await notifyHumanOverseer({
      error,
      sessionId: context.sessionId,
      lastActions: context.recentActions
    });
  }
  
  // 📝 Log pour debugging
  await logError(error);
  
  return {
    retry: error.retryable,
    fallback: error.fallbackAction
  };
};
```

---

## 🔐 PERMISSIONS GRANULAIRES

**Best Practice 2025** : Commencer par "deny-all" et autoriser uniquement ce qui est nécessaire.

```typescript
// src/config/agentPermissions.ts

const agentPermissions = {
  leo: {
    allowedTools: ['Read', 'Search', 'WebSearch', 'Bash'],
    allowedDirectories: ['/context/km-framework/', '/context/cabinet-profile.json'],
    blockedCommands: ['rm', 'git push', 'curl -X POST'],
    requireConfirmation: ['WriteFile', 'SendEmail'],
    maxTokensPerSession: 50000
  },
  
  sophie: {
    allowedTools: ['Read', 'Search', 'WebSearch', 'CalculateROI'],
    allowedDirectories: ['/context/propositions/', '/templates/'],
    blockedCommands: ['*'],  // Pas de bash pour Sophie
    requireConfirmation: ['GenerateProposal', 'SendToClient'],
    maxTokensPerSession: 30000
  },
  
  marc: {
    allowedTools: ['Read', 'Search', 'CreateDocument', 'Notion'],
    allowedDirectories: ['/context/formations/', '/outputs/'],
    blockedCommands: ['rm', 'git'],
    requireConfirmation: ['PublishToNotion', 'SendNotification'],
    maxTokensPerSession: 40000
  }
};

// Usage dans le SDK
const options: ClaudeAgentOptions = {
  model: 'claude-sonnet-4-5-20250929',
  allowedTools: agentPermissions.leo.allowedTools,
  permissions: {
    directories: agentPermissions.leo.allowedDirectories,
    blockedCommands: agentPermissions.leo.blockedCommands
  },
  hooks: {
    preToolUse: async ({ tool }) => {
      if (agentPermissions.leo.requireConfirmation.includes(tool)) {
        return await requestHumanConfirmation(tool);
      }
      return { decision: 'allow' };
    }
  }
};
```

---

## 📊 OBSERVABILITÉ & TÉLÉMÉTRIE

```typescript
// src/telemetry/agentObservability.ts

interface AgentTelemetry {
  traceId: string;
  sessionId: string;
  agentName: string;
  startTime: Date;
  events: AgentEvent[];
  metrics: AgentMetrics;
}

interface AgentMetrics {
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  toolCalls: number;
  latencyMs: number;
  successRate: number;
  cost: number;
}

class AgentObserver {
  private telemetry: AgentTelemetry;
  
  async recordToolUse(tool: string, input: any, output: any, duration: number) {
    this.telemetry.events.push({
      type: 'tool_use',
      tool,
      inputHash: hash(input),  // Ne pas logger les données sensibles
      success: !output.error,
      duration,
      timestamp: new Date()
    });
    
    this.telemetry.metrics.toolCalls++;
    this.telemetry.metrics.latencyMs += duration;
  }
  
  async exportMetrics() {
    // Export vers votre système de monitoring
    await sendToDatadog(this.telemetry.metrics);
    await sendToPosthog({
      event: 'agent_session_complete',
      properties: this.telemetry
    });
  }
  
  async alertOnAnomaly() {
    // Détection d'anomalies
    if (this.telemetry.metrics.successRate < 0.7) {
      await alertOncall('Agent success rate below threshold');
    }
    if (this.telemetry.metrics.cost > 10) {
      await alertOncall('Agent cost exceeds $10 for single session');
    }
  }
}
```

---

## 📝 FORMAT SKILL.md

```markdown
# /.claude/skills/leo-km-consultant/SKILL.md

---
name: leo-km-consultant
description: |
  Léo est un consultant virtuel expert en Knowledge Management 
  pour les cabinets d'expertise comptable.
version: 1.2.0
author: PuzzlApp Brain
triggers:
  - diagnostic KM
  - maturité knowledge
  - stratégie savoirs
  - capitalisation
---

# Léo — Consultant KM

## Identité
Tu es Léo, consultant senior en Knowledge Management spécialisé 
dans les cabinets d'expertise comptable (0-250 collaborateurs).

## Modes d'intervention

### Mode Mission
Pour les projets structurés multi-semaines :
1. Phase Découverte (2 semaines)
2. Phase Définition (1 semaine)
3. Phase Développement (3 semaines)
4. Phase Déploiement (2 semaines)

### Mode Expert
Pour les questions ponctuelles :
- Répondre de manière directe et factuelle
- Citer les sources
- Proposer des actions concrètes

### Mode Sparring
Pour le role-play et les simulations :
- Jouer le rôle demandé
- Challenger les idées
- Fournir du feedback constructif

## Outils disponibles
- `diagnose_km_maturity` : Évaluer le niveau KMMM
- `generate_roadmap` : Créer une roadmap KM
- `search_best_practices` : Rechercher les bonnes pratiques

## Contraintes
- Ne jamais inventer de données chiffrées
- Toujours demander le contexte cabinet si non fourni
- Recommander une validation humaine pour les décisions stratégiques
```

---

## 🌐 SERVICE CLAUDE API MODULAIRE

```typescript
// src/services/claudeService.ts

import Anthropic from '@anthropic-ai/sdk';

interface AgentOptions {
  // Skills (stockées dans Console)
  skills?: {
    leo?: boolean;
    sophie?: boolean;
    marc?: boolean;
    xlsx?: boolean;
    pptx?: boolean;
    pdf?: boolean;
  };
  
  // Tools (API natives)
  tools?: {
    webSearch?: boolean;
    codeExecution?: boolean;
  };
  
  // Capabilities
  extendedThinking?: boolean;
  thinkingBudget?: number;
  
  // MCP Connections
  mcp?: {
    notion?: boolean;
    monday?: boolean;
  };
}

const anthropic = new Anthropic();

export async function callPuzzlAppAgent(
  message: string,
  options: AgentOptions = {}
) {
  const request: any = {
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 4096,
    betas: [],
    messages: [{ role: "user", content: message }]
  };

  // ═══════════════════════════════════════════════════════
  // SKILLS — Activation conditionnelle
  // ═══════════════════════════════════════════════════════
  const skills = [];
  
  if (options.skills?.leo) {
    skills.push({ type: "custom", skill_id: "leo-km-consultant", version: "latest" });
  }
  if (options.skills?.sophie) {
    skills.push({ type: "custom", skill_id: "sophie-avant-vente", version: "latest" });
  }
  if (options.skills?.marc) {
    skills.push({ type: "custom", skill_id: "marc-onboarding", version: "latest" });
  }
  if (options.skills?.xlsx) {
    skills.push({ type: "anthropic", skill_id: "xlsx", version: "latest" });
  }
  if (options.skills?.pptx) {
    skills.push({ type: "anthropic", skill_id: "pptx", version: "latest" });
  }
  
  if (skills.length > 0) {
    request.betas.push("code-execution-2025-08-25", "skills-2025-10-02");
    request.container = { skills };
    request.tools = request.tools || [];
    request.tools.push({ type: "code_execution_20250825", name: "code_execution" });
  }

  // ═══════════════════════════════════════════════════════
  // TOOLS — Activation conditionnelle
  // ═══════════════════════════════════════════════════════
  if (options.tools?.webSearch) {
    request.tools = request.tools || [];
    request.tools.push({ type: "web_search_20250305", name: "web_search" });
  }

  // ═══════════════════════════════════════════════════════
  // EXTENDED THINKING — Activation conditionnelle
  // ═══════════════════════════════════════════════════════
  if (options.extendedThinking) {
    request.thinking = {
      type: "enabled",
      budget_tokens: options.thinkingBudget || 10000
    };
  }

  // ═══════════════════════════════════════════════════════
  // MCP SERVERS — Activation conditionnelle
  // ═══════════════════════════════════════════════════════
  if (options.mcp?.notion || options.mcp?.monday) {
    request.mcp_servers = [];
    if (options.mcp.notion) {
      request.mcp_servers.push({ type: "url", url: "https://mcp.notion.com/mcp", name: "notion" });
    }
    if (options.mcp.monday) {
      request.mcp_servers.push({ type: "url", url: "https://mcp.monday.com/mcp", name: "monday" });
    }
  }

  return await anthropic.messages.create(request);
}
```

---

## 🎨 UI CÔTÉ LECTEUR — Toggles style claude.ai

```tsx
// src/components/reader/AgentToolbar.tsx

import { Switch } from '@/components/ui/switch';

interface AgentToolbarProps {
  options: AgentOptions;
  onOptionsChange: (options: AgentOptions) => void;
}

export function AgentToolbar({ options, onOptionsChange }: AgentToolbarProps) {
  return (
    <div className="flex items-center gap-4 p-2 border-b">
      {/* Agents */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Agents:</span>
        <Toggle 
          icon="🧠" 
          label="Léo" 
          checked={options.skills?.leo}
          onChange={(v) => onOptionsChange({...options, skills: {...options.skills, leo: v}})}
        />
        <Toggle 
          icon="💼" 
          label="Sophie" 
          checked={options.skills?.sophie}
          onChange={(v) => onOptionsChange({...options, skills: {...options.skills, sophie: v}})}
        />
        <Toggle 
          icon="📋" 
          label="Marc" 
          checked={options.skills?.marc}
          onChange={(v) => onOptionsChange({...options, skills: {...options.skills, marc: v}})}
        />
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* Tools */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Outils:</span>
        <Toggle 
          icon="🔍" 
          label="Web" 
          checked={options.tools?.webSearch}
          onChange={(v) => onOptionsChange({...options, tools: {...options.tools, webSearch: v}})}
        />
        <Toggle 
          icon="🧠" 
          label="Réflexion" 
          checked={options.extendedThinking}
          onChange={(v) => onOptionsChange({...options, extendedThinking: v})}
        />
        <Toggle 
          icon="📊" 
          label="Excel" 
          checked={options.skills?.xlsx}
          onChange={(v) => onOptionsChange({...options, skills: {...options.skills, xlsx: v}})}
        />
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      {/* MCP */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Export:</span>
        <Toggle 
          icon="📝" 
          label="Notion" 
          checked={options.mcp?.notion}
          onChange={(v) => onOptionsChange({...options, mcp: {...options.mcp, notion: v}})}
        />
        <Toggle 
          icon="📅" 
          label="Monday" 
          checked={options.mcp?.monday}
          onChange={(v) => onOptionsChange({...options, mcp: {...options.mcp, monday: v}})}
        />
      </div>
    </div>
  );
}

function Toggle({ icon, label, checked, onChange }) {
  return (
    <button 
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors
        ${checked ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
      onClick={() => onChange(!checked)}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
```

---

## ✅ CHECKLIST PRODUCTION

```markdown
## ✅ Avant mise en production

### Sécurité
- [ ] Permissions deny-all par défaut
- [ ] Commandes dangereuses bloquées (rm -rf, sudo, DROP)
- [ ] Confirmation humaine pour actions sensibles
- [ ] Secrets jamais dans le contexte agent
- [ ] Rate limiting par utilisateur/cabinet

### Observabilité
- [ ] Trace IDs sur chaque session
- [ ] Métriques : latence, tokens, coût, success rate
- [ ] Alertes sur anomalies
- [ ] Logs structurés (pas de données sensibles)

### Contexte
- [ ] CLAUDE.md avec conventions projet
- [ ] Skills versionées et validées
- [ ] Hooks idempotents
- [ ] Gestion multi-session (progress file)

### Testing
- [ ] Tests end-to-end (pas juste unit tests)
- [ ] Évaluation sur cas représentatifs
- [ ] Vérification visuelle si UI générée
- [ ] Rollback possible (git commits)

### Scalabilité
- [ ] Sous-agents spécialisés
- [ ] Parallélisation où possible
- [ ] Compaction automatique
- [ ] Cache pour contextes fréquents
```

---

## 🎯 TÂCHES PRIORITAIRES À IMPLÉMENTER

### Phase 1 : Service Claude API modulaire
1. Créer `src/services/claudeService.ts` avec activation conditionnelle des fonctionnalités
2. Implémenter les types TypeScript pour `AgentOptions`
3. Tester avec chaque combinaison de toggles

### Phase 2 : Skills personnalisées
1. Créer les fichiers SKILL.md pour Léo, Sophie, Marc dans `/.claude/skills/`
2. Uploader les skills dans la Console Anthropic
3. Tester l'appel via l'API avec `container.skills`

### Phase 3 : Interface utilisateur
1. Créer `AgentToolbar.tsx` avec les toggles
2. Connecter les toggles au service Claude
3. Implémenter le streaming des réponses

### Phase 4 : Hooks et sécurité
1. Implémenter `preToolUse` pour bloquer commandes dangereuses
2. Implémenter `postToolUse` pour télémétrie
3. Implémenter `onError` pour escalation

### Phase 5 : Gestion multi-session
1. Implémenter le harness initializer/working agent
2. Créer `feature_list.json` et `claude-progress.txt`
3. Tester la reprise de session

---

## ⚠️ ERREURS À ÉVITER

1. **NE PAS** créer un agent monolithique — utiliser des sous-agents spécialisés
2. **NE PAS** ignorer la gestion de contexte multi-session
3. **NE PAS** oublier les hooks de sécurité
4. **NE PAS** logger des données sensibles
5. **NE PAS** permettre des commandes bash dangereuses
6. **NE PAS** one-shot une app complexe — travailler feature par feature
7. **NE PAS** marquer une feature comme "done" sans test end-to-end

---

*Document créé le 18 janvier 2026*
*Basé sur la documentation officielle Anthropic et les best practices 2025-2026*
