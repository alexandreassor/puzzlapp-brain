# PuzzlApp Brain - Serveur d'Agents IA

> **Version** : 1.0.0
> **Date** : 19 janvier 2026
> **Auteur** : Alexandre ASSOR
> **Projet** : Mémoire DEC - Knowledge Management pour cabinets comptables

---

## Vue d'ensemble

Ce serveur expose des **agents IA autonomes** basés sur le [Claude Agent SDK](https://docs.anthropic.com/fr/docs/agent-sdk/) d'Anthropic. Ces agents peuvent :

- Lire et analyser des fichiers
- Rechercher sur le web en temps réel
- Exécuter des actions complexes en plusieurs étapes
- Utiliser des outils externes via MCP (Model Context Protocol)

### Agents disponibles

| Agent | Rôle | Interface | Statut |
|-------|------|-----------|--------|
| **Victor** | Rédaction académique | Admin | ✅ Actif |
| **Léo** | Guide parcours lecteur | Lecteur | 🔜 À venir |
| **Sophie** | Avant-vente | Lecteur | 🔜 À venir |
| **Marc** | Onboarding | Lecteur | 🔜 À venir |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PUZZLAPP BRAIN ECOSYSTEM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────┐      ┌────────────────────────────────────┐│
│  │   FRONTEND (puzzlapp-brain)│      │   AGENTS SERVER (puzzlapp-agents)  ││
│  │   React + Vite + Tailwind  │      │   Node.js + Claude Agent SDK       ││
│  │                            │      │                                    ││
│  │  ┌──────────┐ ┌──────────┐│      │  ┌─────────────────────────────┐  ││
│  │  │  Admin   │ │  Reader  ││      │  │        EXPRESS SERVER       │  ││
│  │  │  Panel   │ │  Panel   ││      │  │   Port 3001 (configurable)  │  ││
│  │  └────┬─────┘ └────┬─────┘│      │  └──────────────┬──────────────┘  ││
│  │       │            │      │      │                 │                  ││
│  │       └──────┬─────┘      │      │    ┌────────────┼────────────┐    ││
│  │              │            │      │    │            │            │    ││
│  │         ┌────▼────┐       │      │    ▼            ▼            ▼    ││
│  │         │ Victor  │───────┼──────┼▶┌──────┐   ┌──────┐   ┌──────┐   ││
│  │         │ Panel   │  HTTP │      │ │Victor│   │ Léo  │   │Sophie│   ││
│  │         └─────────┘  /WS  │      │ └──┬───┘   └──────┘   └──────┘   ││
│  │                           │      │    │                              ││
│  └───────────────────────────┘      │    ▼                              ││
│                                     │  ┌─────────────────────────────┐  ││
│                                     │  │      CLAUDE AGENT SDK       │  ││
│                                     │  │                             │  ││
│                                     │  │  ┌─────┐ ┌─────┐ ┌───────┐ │  ││
│                                     │  │  │Read │ │Edit │ │WebSrch│ │  ││
│                                     │  │  └─────┘ └─────┘ └───────┘ │  ││
│                                     │  │  ┌─────┐ ┌─────┐ ┌───────┐ │  ││
│                                     │  │  │Glob │ │Grep │ │ Bash  │ │  ││
│                                     │  │  └─────┘ └─────┘ └───────┘ │  ││
│                                     │  └─────────────────────────────┘  ││
│                                     │                 │                  ││
│                                     │                 ▼                  ││
│                                     │  ┌─────────────────────────────┐  ││
│                                     │  │        MCP SERVERS          │  ││
│                                     │  │  ┌─────────┐ ┌─────────┐   │  ││
│                                     │  │  │Supabase │ │ Notion  │   │  ││
│                                     │  │  │   MCP   │ │   MCP   │   │  ││
│                                     │  │  └─────────┘ └─────────┘   │  ││
│                                     │  └─────────────────────────────┘  ││
│                                     └────────────────────────────────────┘│
│                                                       │                   │
│                                                       ▼                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                          SUPABASE                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │   Database   │  │     Auth     │  │   Storage    │              │  │
│  │  │  PostgreSQL  │  │     JWT      │  │    Files     │              │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │  │
│  │                                                                     │  │
│  │  Tables: profiles, chapters, sections, memoir_sources,              │  │
│  │          agent_conversations, cabinet_instances, etc.               │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Prérequis

### Obligatoires

1. **Node.js 18+** - Runtime JavaScript
2. **Claude Code** - Runtime pour le SDK Agent
   ```bash
   # Installation Claude Code
   npm install -g @anthropic-ai/claude-code

   # Authentification (première fois)
   claude
   ```

### Optionnels (pour MCP)

- Compte Supabase avec accès service_role
- Intégration Notion OAuth configurée

---

## Installation

```bash
# 1. Cloner ou naviguer vers le projet
cd puzzlapp-agents

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Vérifier la compilation TypeScript
npx tsc --noEmit
```

---

## Configuration

### Variables d'environnement (.env)

```bash
# Serveur
PORT=3001                                    # Port du serveur (défaut: 3001)
CORS_ORIGIN=http://localhost:5173            # URL du frontend

# Supabase (pour MCP)
SUPABASE_URL=https://xxx.supabase.co         # URL du projet Supabase
SUPABASE_SERVICE_KEY=eyJhbGc...              # Clé service_role (pas anon!)

# Anthropic (optionnel si Claude Code est authentifié)
ANTHROPIC_API_KEY=sk-ant-...                 # Clé API Anthropic

# Notion (pour MCP Notion)
NOTION_CLIENT_ID=xxx                         # Client ID OAuth Notion
NOTION_CLIENT_SECRET=xxx                     # Client Secret OAuth
```

---

## Démarrage

### Mode développement

```bash
npm run dev
```

Le serveur démarre avec hot-reload sur `http://localhost:3001`.

### Mode production

```bash
npm run build
npm start
```

### Test de Victor

```bash
npm run test:victor
```

---

## API Reference

### Endpoints REST

#### `GET /api/health`

Health check du serveur.

**Réponse :**
```json
{
  "status": "ok",
  "timestamp": "2026-01-19T10:30:00.000Z",
  "agents": ["victor", "leo", "sophie", "marc"]
}
```

#### `GET /api/agents`

Liste des agents disponibles.

**Réponse :**
```json
{
  "success": true,
  "agents": {
    "victor": {
      "name": "Victor",
      "description": "Agent de rédaction académique (Admin)",
      "skills": ["redaction", "recherche", "acquisition", "plan", "bibliographie", "critique"]
    },
    "leo": {
      "name": "Léo",
      "description": "Agent guide pour les parcours (Lecteur)",
      "skills": ["guide", "recommandation", "coaching", "diagnostic"],
      "status": "coming_soon"
    }
  }
}
```

#### `POST /api/agents/query`

Envoie une requête à un agent (mode synchrone).

**Corps de la requête :**
```json
{
  "agentType": "victor",
  "skill": "redaction",
  "message": "Aide-moi à rédiger l'introduction sur le modèle SECI",
  "context": {
    "userId": "user-123",
    "sectionTitle": "Le modèle SECI de Nonaka & Takeuchi",
    "chapterTitle": "Fondements théoriques du KM"
  },
  "conversationHistory": [
    { "role": "user", "content": "Message précédent..." },
    { "role": "assistant", "content": "Réponse précédente..." }
  ]
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "## Introduction au modèle SECI\n\nLe modèle SECI...",
  "agentType": "victor",
  "skill": "redaction",
  "usage": {
    "inputTokens": 1250,
    "outputTokens": 890
  }
}
```

#### `POST /api/agents/stream`

Envoie une requête à un agent (mode streaming SSE).

Mêmes paramètres que `/query`, mais retourne un flux SSE :

```
data: {"type":"text","content":"## Introduction"}
data: {"type":"text","content":"\n\nLe modèle SECI..."}
data: {"type":"tool_use","toolCall":{"name":"WebSearch","input":{"query":"SECI model"}}}
data: {"type":"text","content":"D'après mes recherches..."}
data: [DONE]
```

### WebSocket

**URL :** `ws://localhost:3001/ws`

**Envoi :**
```json
{
  "agentType": "victor",
  "skill": "recherche",
  "message": "Trouve des études récentes sur le KM en cabinet comptable",
  "context": { "userId": "user-123" }
}
```

**Réception (stream) :**
```json
{"type": "text", "content": "Je recherche..."}
{"type": "tool_use", "toolCall": {"name": "WebSearch", ...}}
{"type": "text", "content": "J'ai trouvé plusieurs études..."}
{"type": "done"}
```

---

## Agent Victor

Victor est l'agent de rédaction académique pour le mémoire DEC.

### Compétences (Skills)

| Skill | Couleur | Outils | Description |
|-------|---------|--------|-------------|
| `redaction` | Bleu | Read, WebSearch, Glob | Génère du contenu académique structuré |
| `recherche` | Vert | WebSearch, Read | Recherche web en temps réel |
| `acquisition` | Orange | Read, Glob, Grep | Capture et structure les connaissances |
| `plan` | Violet | Read, Glob | Structure et réorganise le contenu |
| `bibliographie` | Jaune | WebSearch, Read | Gère les sources au format APA 7e |
| `critique` | Rouge | Read | Évalue et propose des améliorations |

### Outils disponibles

| Outil | Description | Permissions |
|-------|-------------|-------------|
| `Read` | Lit des fichiers locaux | Auto-approuvé |
| `Glob` | Recherche de fichiers par pattern | Auto-approuvé |
| `Grep` | Recherche dans le contenu des fichiers | Auto-approuvé |
| `WebSearch` | Recherche web en temps réel | Auto-approuvé |
| `Edit` | Modifie des fichiers | Selon permissionMode |
| `Bash` | Exécute des commandes | Selon permissionMode |

### Exemple d'utilisation

```typescript
// Appel depuis le frontend
const response = await fetch('http://localhost:3001/api/agents/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentType: 'victor',
    skill: 'redaction',
    message: 'Rédige un paragraphe sur les enjeux du KM tacite',
    context: {
      userId: 'alexandre',
      sectionTitle: 'Connaissances tacites vs explicites',
      chapterTitle: 'Fondements du KM'
    }
  })
});

const data = await response.json();
console.log(data.message); // Contenu généré
```

---

## Sécurité

### Authentification

Le serveur actuel est conçu pour un usage local/développement. Pour la production :

1. **Ajouter une authentification JWT** via Supabase Auth
2. **Valider les tokens** dans les routes API
3. **Limiter les CORS** aux domaines autorisés

### Permissions des outils

Le mode `acceptEdits` auto-approuve les opérations de fichiers. Pour plus de contrôle :

```typescript
const options = {
  permissionMode: 'default', // Demande confirmation
  // ou
  permissionMode: 'bypassPermissions' // Tout auto-approuvé (CI/CD)
};
```

---

## Déploiement

### Options recommandées

| Plateforme | Avantages | Inconvénients |
|------------|-----------|---------------|
| **Railway** | Simple, auto-scale | Coût variable |
| **Render** | Gratuit pour commencer | Cold starts |
| **VPS (DigitalOcean)** | Contrôle total | Maintenance manuelle |
| **Docker** | Portable | Configuration Claude Code |

### Docker (exemple)

```dockerfile
FROM node:20-slim

# Installer Claude Code
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist

ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/index.js"]
```

**Note :** Claude Code doit être authentifié dans le conteneur.

---

## Évolutions prévues

### Court terme
- [ ] Agent Léo (guide parcours)
- [ ] Intégration MCP Supabase
- [ ] Authentification JWT

### Moyen terme
- [ ] Agent Sophie (avant-vente)
- [ ] Agent Marc (onboarding)
- [ ] MCP Notion pour création automatique

### Long terme
- [ ] Sessions persistantes multi-tours
- [ ] RAG avec embeddings des sources
- [ ] Streaming audio (voice)

---

## Contribution

### Structure du code

```
src/
├── index.ts           # Point d'entrée serveur
├── agents/
│   ├── index.ts       # Exports centralisés
│   ├── types.ts       # Types partagés
│   └── victor/
│       ├── index.ts   # Logique agent
│       ├── prompts.ts # Prompts système
│       └── test.ts    # Tests
├── api/
│   └── routes.ts      # Routes Express
└── mcp/               # Serveurs MCP (à venir)
```

### Ajouter un nouvel agent

1. Créer `src/agents/[nom]/index.ts`
2. Créer `src/agents/[nom]/prompts.ts`
3. Exporter dans `src/agents/index.ts`
4. Ajouter les routes dans `src/api/routes.ts`

---

## Licence

MIT © Alexandre ASSOR

---

## Support

- **Documentation** : Ce README
- **Issues** : GitHub du projet
- **Contact** : alexandre.assor.puzzl@gmail.com
