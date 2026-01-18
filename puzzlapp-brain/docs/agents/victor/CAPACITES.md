# Victor - Capacités et Configuration

> Documentation des fonctionnalités avancées de l'agent Victor
> Dernière mise à jour : 18 janvier 2026

---

## Vue d'ensemble

Victor dispose de **capacités avancées** configurables depuis le panneau de paramètres. Ces capacités permettent d'étendre ses fonctionnalités en utilisant les outils natifs de l'API Anthropic.

---

## 1. Web Search (Recherche Web)

### Description
Permet à Victor d'effectuer des recherches web en temps réel pour obtenir des informations actualisées.

### Fonctionnement technique
- **Tool natif** : `web_search_20250305`
- **Moteur** : Brave Search (intégré par Anthropic)
- **Limite** : 5 recherches max par requête

### Cas d'usage
- Rechercher des statistiques récentes sur le Knowledge Management
- Vérifier des informations factuelles
- Trouver des sources académiques récentes

### Coût
Augmente la consommation de tokens (requêtes supplémentaires).

---

## 2. Réflexion Approfondie (Extended Thinking)

### Description
Active le mode de raisonnement étendu de Claude, permettant une analyse plus profonde et structurée.

### Fonctionnement technique
- **Paramètre** : `thinking: { type: 'enabled', budget_tokens: X }`
- **Budget min** : 1 024 tokens
- **Budget max** : 50 000 tokens
- **Défaut** : 10 000 tokens

### Cas d'usage
- Analyse critique de texte académique
- Structuration de plans complexes
- Résolution de problèmes méthodologiques

### Configuration
Le slider permet d'ajuster le budget de tokens alloué à la réflexion :
- **1k** : Réflexion rapide
- **10k** : Réflexion standard (recommandé)
- **50k** : Réflexion profonde (analyses complexes)

### Coût
Le budget de thinking s'ajoute aux tokens de sortie.

---

## 3. Code Execution

### Description
Permet à Victor d'exécuter du code Python dans un environnement sandbox sécurisé.

### Fonctionnement technique
- **Tool** : `code_execution_20250522`
- **API Beta** : `code-execution-2025-05-22`
- **Environnement** : Sandbox Anthropic (Python)

### Cas d'usage
- Analyse de données
- Génération de graphiques
- Calculs statistiques
- Manipulation de fichiers (avec Skills)

### Prérequis
S'active automatiquement quand des Skills sont ajoutées.

---

## 4. Skills Anthropic

### Description
Les Skills sont des capacités spécialisées permettant à Victor de manipuler différents formats de fichiers.

### Skills pré-construites disponibles

| Skill | ID | Description |
|-------|-----|-------------|
| Excel/XLSX | `xlsx` | Analyse et création de fichiers Excel |
| PDF | `pdf` | Lecture et extraction de documents PDF |
| Word/DOCX | `docx` | Manipulation de documents Word |
| PowerPoint | `pptx` | Création de présentations |

### Fonctionnement technique
```typescript
// Structure d'une Skill
interface AnthropicSkill {
  type: 'anthropic' | 'custom';
  skill_id: string;
  version: string;
  name?: string;
}

// Envoi à l'API
container: {
  skills: [
    { type: 'anthropic', skill_id: 'xlsx', version: 'latest' }
  ]
}
```

### API Beta requise
- `skills-2025-01-24`
- `code-execution-2025-05-22` (requis pour les Skills)

### Limite
Maximum **8 skills** par requête.

---

## 5. Skills Custom (Console Anthropic)

### Description
Possibilité d'ajouter des Skills personnalisées créées dans la Console Anthropic.

### Comment créer une Skill custom

1. **Accéder à la Console Anthropic** : [console.anthropic.com](https://console.anthropic.com)
2. **Créer une nouvelle Skill** avec un fichier SKILL.md
3. **Copier le `skill_id`** attribué
4. **Ajouter dans Victor** via le champ "Skills custom"

### Format SKILL.md
```yaml
---
name: ma-skill-custom
description: Description de ma skill
---

# Instructions

Ici les instructions pour la skill...
```

### Utilisation dans Victor
1. Ouvrir le panneau "Capacités"
2. Section "Skills custom (Console)"
3. Entrer le `skill_id`
4. Appuyer sur Entrée ou cliquer sur "+"

---

## 6. Architecture technique

### Frontend (puzzlapp-brain)

```
src/components/admin/victor/
├── VictorSettings.tsx    # Composant de configuration
├── VictorPanel.tsx       # Panel principal (intègre VictorSettings)
└── index.ts              # Exports
```

### Types exportés
```typescript
// VictorOptions - Configuration complète
export interface VictorOptions {
  webSearch: boolean;
  extendedThinking: boolean;
  thinkingBudget: number;
  skills: AnthropicSkill[];
  codeExecution: boolean;
  mcpNotion: boolean;      // (futur)
  mcpSupabase: boolean;    // (futur)
}

// AnthropicSkill - Définition d'une skill
export interface AnthropicSkill {
  type: 'anthropic' | 'custom';
  skill_id: string;
  version: string;
  name?: string;
  description?: string;
}
```

### Backend (puzzlapp-agents)

```
src/agents/
├── types.ts              # Types partagés (AgentOptions, AnthropicSkill)
├── victor/
│   └── index.ts          # Logique d'appel API avec options
└── api/
    └── routes.ts         # Route POST /api/agents/query
```

### Flux de données

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  VictorPanel    │────>│  Agents Server  │────>│  Anthropic API  │
│  (Frontend)     │     │  (Backend)      │     │  (Claude)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
   VictorOptions          AgentOptions            API Request
   - webSearch            - webSearch             - tools[]
   - extendedThinking     - extendedThinking      - thinking{}
   - skills[]             - skills[]              - container.skills[]
   - codeExecution        - codeExecution         - betas[]
```

---

## 7. Références Anthropic

### Documentation officielle
- [Web Search Tool](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool)
- [Extended Thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
- [Skills API](https://docs.anthropic.com/en/docs/agents-and-tools/skills)
- [Code Execution](https://docs.anthropic.com/en/docs/agents-and-tools/code-execution)

### Versions des API Beta
| Feature | Beta Header |
|---------|-------------|
| Code Execution | `code-execution-2025-05-22` |
| Skills | `skills-2025-01-24` |

---

## 8. Coûts et optimisation

### Estimation des coûts (Claude Opus 4.5)
- **Input** : $15 / million tokens
- **Output** : $75 / million tokens
- **Extended Thinking** : Compte dans les tokens de sortie

### Recommandations
1. **Web Search** : Utiliser uniquement quand nécessaire
2. **Extended Thinking** : Ajuster le budget selon la complexité
3. **Skills** : N'activer que celles nécessaires
4. **Code Execution** : S'active auto avec Skills (pas de surcoût isolé)

---

## 9. Fonctionnalités futures (MCP)

### Connexions MCP prévues
- **Notion** : Accès aux pages et bases de données Notion
- **Supabase/Bibliographie** : Accès direct aux sources du mémoire

Ces fonctionnalités seront disponibles dans une prochaine version via le protocole MCP (Model Context Protocol).

---

*Documentation générée le 18 janvier 2026*
