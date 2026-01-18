# PuzzlApp Brain - Serveur d'Agents IA

> **Projet** : Serveur d'agents pour PuzzlApp Brain
> **Stack** : Node.js + TypeScript + Claude Agent SDK
> **Date** : 19 janvier 2026
> **Port** : 3001 (configurable via .env)

## Contexte Projet

Ce projet fait partie de l'écosystème **PuzzlApp Brain** pour le mémoire DEC d'Alexandre ASSOR sur le **Knowledge Management innovant pour les cabinets d'expertise comptable**.

### Projets associés
- **puzzlapp-brain** : Frontend React (port 5173) - dans le même dossier parent
- **Supabase** : Base de données (aeraxtdgjbhdrxfbsczh.supabase.co)

## Description

Ce serveur expose des agents IA basés sur le **Claude Agent SDK** pour assister les utilisateurs de PuzzlApp Brain :

| Agent | Rôle | Interface | Statut |
|-------|------|-----------|--------|
| **Victor** | Rédaction académique | Admin | ✅ Actif |
| **Léo** | Guide parcours | Lecteur | 🔜 À venir |
| **Sophie** | Avant-vente | Lecteur | 🔜 À venir |
| **Marc** | Onboarding | Lecteur | 🔜 À venir |

## Architecture

```
puzzlapp-agents/
├── src/
│   ├── index.ts              # Serveur Express + WebSocket
│   ├── agents/
│   │   ├── index.ts          # Export centralisé
│   │   ├── types.ts          # Types communs
│   │   ├── victor/           # Agent Victor
│   │   │   ├── index.ts      # Logique agent
│   │   │   ├── prompts.ts    # Prompts système
│   │   │   └── test.ts       # Tests standalone
│   │   ├── leo/              # Agent Léo (à créer)
│   │   └── sophie/           # Agent Sophie (à créer)
│   ├── api/
│   │   └── routes.ts         # Routes REST API
│   └── mcp/                  # Serveurs MCP (à créer)
├── package.json
├── tsconfig.json
└── .env.example
```

## Installation

```bash
# Prérequis : Claude Code doit être installé et authentifié
claude --version

# Installation des dépendances
npm install

# Copier et configurer l'environnement
cp .env.example .env
```

## Démarrage

```bash
# Mode développement (avec hot reload)
npm run dev

# Mode production
npm run build
npm start
```

## API

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/agents` | Liste des agents |
| POST | `/api/agents/query` | Requête agent (sync) |
| POST | `/api/agents/stream` | Requête agent (SSE streaming) |

### WebSocket

- URL : `ws://localhost:3001/ws`
- Envoyer un message JSON `AgentRequest`
- Recevoir des événements `StreamEvent`

### Exemple de requête

```typescript
// POST /api/agents/query
{
  "agentType": "victor",
  "skill": "redaction",
  "message": "Aide-moi à rédiger l'introduction sur le modèle SECI",
  "context": {
    "userId": "user-123",
    "sectionTitle": "Le modèle SECI",
    "chapterTitle": "Fondements du KM"
  },
  "conversationHistory": []
}
```

## Agents

### Victor (✅ Implémenté)

Agent de rédaction académique avec 6 compétences :
- **redaction** : Génère du contenu académique
- **recherche** : Recherche web et documentation
- **acquisition** : Capture et structure les connaissances
- **plan** : Structure et organise le contenu
- **bibliographie** : Gère les sources APA 7e
- **critique** : Analyse et améliore le contenu

### Léo (🔜 À venir)

Agent guide pour les parcours lecteur.

### Sophie (🔜 À venir)

Agent pour le parcours avant-vente.

### Marc (🔜 À venir)

Agent pour le parcours onboarding.

## Intégration avec PuzzlApp Brain Frontend

Le frontend (puzzlapp-brain) doit appeler ce serveur pour les interactions agent :

```typescript
// Dans le frontend
const response = await fetch('http://localhost:3001/api/agents/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentType: 'victor',
    skill: 'redaction',
    message: userMessage,
    context: { userId, sectionTitle, chapterTitle }
  })
});
```

## Tests

```bash
# Tester Victor en standalone
npm run test:victor
```

## Instructions pour Claude Code

### Conventions de code

1. **TypeScript strict** : Toujours typer explicitement, pas de `any`
2. **ESM modules** : Utiliser `import/export`, pas CommonJS
3. **Async/await** : Préférer aux Promises brutes
4. **Streaming** : Utiliser des generators (`async function*`) pour le streaming

### Structure d'un nouvel agent

Pour créer un nouvel agent (ex: Léo), suivre ce pattern :

```
src/agents/leo/
├── index.ts     # Exporte runLeo() et runLeoStream()
├── prompts.ts   # Contient les prompts par skill
└── test.ts      # Test standalone
```

### Workflow de développement

```bash
# 1. Vérifier la compilation
npx tsc --noEmit

# 2. Lancer en dev
npm run dev

# 3. Tester un agent
npm run test:victor

# 4. Build production
npm run build
```

### Variables d'environnement requises

```bash
PORT=3001                          # Port serveur
CORS_ORIGIN=http://localhost:5173  # URL frontend
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...        # Service role key
```

### Outils Claude Agent SDK disponibles

| Outil | Description | Usage courant |
|-------|-------------|---------------|
| `Read` | Lecture fichiers | Analyse de contenu |
| `Glob` | Recherche fichiers | Navigation codebase |
| `Grep` | Recherche contenu | Trouver du code |
| `WebSearch` | Recherche web | Informations temps réel |
| `Edit` | Modifier fichiers | Auto-corrections |
| `Bash` | Commandes shell | Scripts, git |

### Points d'attention

- Le Claude Agent SDK nécessite que **Claude Code soit authentifié** sur la machine
- Les outils sont auto-approuvés en mode `acceptEdits`
- Le streaming utilise SSE ou WebSocket selon l'endpoint
