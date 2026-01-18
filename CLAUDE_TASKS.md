# CLAUDE_TASKS.md — Instructions Prioritaires pour Claude Code

> **⚠️ STOP — LIS CECI EN PREMIER**
> 
> **Date** : 18 janvier 2026
> **Auteur** : Alexandre (via Claude Opus)

---

## 🚨 INSTRUCTION PRIORITAIRE

**AVANT DE CODER QUOI QUE CE SOIT**, tu DOIS lire :

1. **`CLAUDE_AGENT_SDK_INSTRUCTIONS.md`** — Guide complet des meilleures pratiques Agent SDK 2025-2026
2. **`CLAUDE.md`** — PRD du projet PuzzlApp Brain

Ces fichiers contiennent les décisions d'architecture validées. Ne pas improviser.

---

## 📋 ÉTAT ACTUEL DU PROJET

| Composant | Statut | Commentaire |
|-----------|--------|-------------|
| Setup Vite + React + TS | ⏳ À faire | |
| Supabase Auth + DB | ⏳ À faire | |
| Éditeur TipTap | ⏳ À faire | |
| Interface Admin | ⏳ À faire | |
| Interface Lecteur | ⏳ À faire | |
| **Service Claude API modulaire** | 🔴 PRIORITÉ | Voir ci-dessous |
| Skills Léo/Sophie/Marc | ⏳ À faire | |
| Hooks sécurité | ⏳ À faire | |

---

## 🎯 TÂCHE PRIORITAIRE : Service Claude API Modulaire

### Objectif

Créer un service qui permet d'activer/désactiver les fonctionnalités Claude **dynamiquement**, comme le fait claude.ai avec le bouton **+**.

### Ce qu'on veut

```typescript
// L'utilisateur peut activer/désactiver via des toggles UI :
// ✅ Léo (KM Strategy)
// ✅ Sophie (Avant-Vente)  
// ✅ Marc (Onboarding)
// ✅ Web Search
// ✅ Extended Thinking
// ✅ Notion export
// ✅ Monday export
// ✅ Excel generation

// Et l'API s'adapte automatiquement
```

### Fichier à créer

`src/services/claudeService.ts`

### Architecture

Voir **`CLAUDE_AGENT_SDK_INSTRUCTIONS.md`** section "SERVICE CLAUDE API MODULAIRE" pour le code complet.

### Points clés à respecter

1. **Skills dans la Console Anthropic** — Les personnalités Léo/Sophie/Marc sont stockées dans la Console et appelées via `container.skills`

2. **Beta headers requis pour Skills** :
   ```javascript
   betas: ["code-execution-2025-08-25", "skills-2025-10-02"]
   ```

3. **Activation conditionnelle** — Chaque fonctionnalité s'ajoute SI et SEULEMENT SI le toggle est activé

4. **MCP Servers** — Notion et Monday via `mcp_servers` dans la requête

---

## 📚 DOCUMENTATION OFFICIELLE

**LIS CES LIENS AVANT DE CODER** :

| Ressource | URL |
|-----------|-----|
| **Agent SDK Overview** | https://platform.claude.com/docs/en/agent-sdk/overview |
| **Building Agents (Blog)** | https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk |
| **Long-running Agents** | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents |
| **Agent Skills** | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview |
| **Skills API Guide** | https://docs.claude.com/en/api/skills-guide |
| **Web Search Tool** | https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool |
| **MCP Connector** | https://platform.claude.com/docs/en/agents-and-tools/mcp-connector |
| **Extended Thinking** | https://platform.claude.com/docs/en/build-with-claude/extended-thinking |
| **Memory Tool** | https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool |
| **Python SDK** | https://platform.claude.com/docs/en/agent-sdk/python |
| **TypeScript SDK** | https://platform.claude.com/docs/en/agent-sdk/typescript |
| **Example Agents** | https://github.com/anthropics/claude-agent-sdk-demos |
| **Quickstart autonome** | https://github.com/anthropics/claude-quickstarts/tree/main/autonomous-coding |

---

## ⚠️ ERREURS À ÉVITER

1. **NE PAS** créer un agent monolithique — utiliser des sous-agents spécialisés
2. **NE PAS** ignorer la gestion de contexte multi-session
3. **NE PAS** oublier les hooks de sécurité
4. **NE PAS** logger des données sensibles
5. **NE PAS** permettre des commandes bash dangereuses (rm -rf, sudo, DROP)
6. **NE PAS** one-shot une app complexe — travailler feature par feature
7. **NE PAS** marquer une feature comme "done" sans test end-to-end
8. **NE PAS** improviser l'architecture — suivre `CLAUDE_AGENT_SDK_INSTRUCTIONS.md`

---

## 📁 STRUCTURE FICHIERS ATTENDUE

```
puzzlapp-brain/
├── src/
│   ├── services/
│   │   └── claudeService.ts      # ← PRIORITÉ 1
│   ├── hooks/
│   │   ├── preToolUse.ts
│   │   ├── postToolUse.ts
│   │   └── onError.ts
│   ├── config/
│   │   └── agentPermissions.ts
│   ├── components/
│   │   └── reader/
│   │       └── AgentToolbar.tsx  # Toggles UI
│   └── types/
│       └── agent.ts
│
├── .claude/
│   └── skills/
│       ├── leo-km/SKILL.md
│       ├── sophie-vente/SKILL.md
│       └── marc-onboarding/SKILL.md
│
├── context/                      # Contexte métier par cabinet
├── progress/                     # Gestion multi-session
└── outputs/                      # Livrables générés
```

---

## 🔄 WORKFLOW DE TRAVAIL

### Pour chaque session Claude Code :

1. **ORIENTATION** (toujours faire en premier)
   ```bash
   pwd
   cat CLAUDE_TASKS.md
   cat CLAUDE_AGENT_SDK_INSTRUCTIONS.md
   git log --oneline -10
   ```

2. **CHOISIR UNE TÂCHE**
   - Prendre la tâche prioritaire marquée 🔴
   - UNE SEULE tâche par session

3. **IMPLÉMENTER**
   - Suivre les instructions du fichier `CLAUDE_AGENT_SDK_INSTRUCTIONS.md`
   - Tester end-to-end

4. **CLEAN STATE**
   - git commit avec message descriptif
   - Mettre à jour ce fichier (statut de la tâche)

---

## 📊 PROCHAINES ÉTAPES

### Étape 1 : Service Claude API (MAINTENANT)
- [ ] Créer `src/services/claudeService.ts`
- [ ] Implémenter l'activation conditionnelle des fonctionnalités
- [ ] Tester avec différentes combinaisons de toggles

### Étape 2 : Skills personnalisées
- [ ] Créer `/.claude/skills/leo-km/SKILL.md`
- [ ] Créer `/.claude/skills/sophie-vente/SKILL.md`
- [ ] Créer `/.claude/skills/marc-onboarding/SKILL.md`
- [ ] Uploader dans la Console Anthropic

### Étape 3 : Interface utilisateur
- [ ] Créer `AgentToolbar.tsx` avec les toggles
- [ ] Connecter les toggles au service Claude
- [ ] Streaming des réponses

### Étape 4 : Hooks et sécurité
- [ ] Implémenter `preToolUse` (bloquer commandes dangereuses)
- [ ] Implémenter `postToolUse` (télémétrie)
- [ ] Implémenter `onError` (escalation)

### Étape 5 : Gestion multi-session
- [ ] Implémenter harness initializer/working agent
- [ ] Créer `feature_list.json` et `claude-progress.txt`
- [ ] Tester reprise de session

---

## 📎 FICHIERS DE RÉFÉRENCE

| Fichier | Description |
|---------|-------------|
| `CLAUDE.md` | PRD complet du projet |
| `CLAUDE_AGENT_SDK_INSTRUCTIONS.md` | **← LIS CE FICHIER** Guide Agent SDK |
| `CLAUDE_TASKS.md` | Ce fichier (tâches prioritaires) |
| `docs/` | Documentation additionnelle |

---

*Dernière mise à jour : 18 janvier 2026*
