# CLAUDE_TASKS.md - PuzzlApp Brain (Principal)

> **Fichier de suivi des tâches pour Claude Code**
> **Projet** : PuzzlApp Brain
> **Dernière mise à jour** : 19 janvier 2026

---

## Instances Parallèles

Ce projet peut être travaillé par **plusieurs instances Claude** en parallèle :

| Instance | Fichier | Scope |
|----------|---------|-------|
| **Admin** | `CLAUDE_TASKS_ADMIN.md` | Interface Admin, TipTap, CRUD contenu |
| **Lecteur** | `CLAUDE_TASKS_READER.md` | Interface Lecteur, Parcours, Jeux |

**Types partagés** : `src/types/index.ts` (ne pas supprimer, seulement ajouter)

---

## Contexte Projet

PuzzlApp Brain est une plateforme de conseil KM augmenté avec :
- **Interface Admin** : Rédaction du mémoire avec TipTap + communication Claude Code
- **Interface Lecteur** : Parcours interactifs avec jeux Design Thinking et agents IA
- **Backend Supabase** : Auth, base de données, storage

**Documentation de référence** :
- `PRD.md` - Product Requirements Document v3.0
- `AGENTS_SPECS.md` - Spécifications des agents IA (Léo, Sophie, Marc)
- `MEMOIRE_STRUCTURE.md` - Structure du mémoire DEC

---

## PHASE 1 : Fondations ✅ COMPLÉTÉE

### 1.1 Setup Projet ✅
- [x] Créer projet Vite + React + TypeScript
- [x] Configurer Tailwind CSS 3.4.17
- [x] Configurer path aliases (@/)
- [x] Installer dépendances de base (zustand, react-router-dom)

### 1.2 Supabase Setup ✅
- [x] Créer projet Supabase "PuzzlApp Brain"
  - Project ID: `aeraxtdgjbhdrxfbsczh`
  - Région: `eu-west-1`
- [x] Configurer .env.local avec credentials
- [x] Créer client Supabase (`src/lib/supabase.ts`)

### 1.3 Schéma Base de Données ✅
- [x] Migration 001: Créer 11 tables
  - profiles, cabinets, chapters, sections, games
  - parcours, user_parcours, user_progress
  - game_results, deliverables, agent_conversations
- [x] Migration 002: Politiques RLS + trigger auto-profil
- [x] Migration 003: Admin role pour alexandre.assor.puzzl@gmail.com
- [x] Migration 004: Système bibliographique Victor
  - memoir_sources, memoir_source_mappings, memoir_citations
  - 7 sources initiales + 6 mappings

### 1.4 Authentification ✅
- [x] Copier et adapter système auth de TAVT
- [x] Créer AuthContext avec signIn/signUp/signOut
- [x] Créer LoginPage avec formulaire FR
- [x] Créer ProtectedRoute avec vérification rôle
- [x] Mapper erreurs auth en français

### 1.5 Routing ✅
- [x] Configurer React Router
- [x] Route `/` - Landing page
- [x] Route `/login` - Connexion
- [x] Route `/admin` - Interface admin (protégée + admin)
- [x] Route `/reader` - Interface lecteur (protégée)

### 1.6 Pages de Base ✅
- [x] Landing page avec features
- [x] Page Admin placeholder
- [x] Page Reader placeholder

---

## PHASE 2 : Interface Admin ✅ QUASI-COMPLÉTÉE

### 2.1 Layout Admin ✅
- [x] Créer sidebar navigation (`AdminSidebar.tsx`)
- [x] Créer header avec user info + logout (`AdminHeader.tsx`)
- [x] Créer zone de contenu principale (`AdminLayout.tsx`)

### 2.2 Composants Shadcn ✅
- [x] Installer Button, Input, Card
- [x] Installer Dialog, DropdownMenu
- [x] Installer Tabs, Tooltip
- [x] Installer scroll-area, separator, badge, avatar

### 2.3 Éditeur TipTap ✅
- [x] Installer @tiptap/react et extensions
- [x] Créer composant RichTextEditor
- [x] Toolbar avec formatage (bold, italic, headings)
- [x] Support Markdown import/export
- [ ] Blocs spéciaux (citation, définition, conseil)

### 2.4 Gestion Chapitres/Sections ✅
- [ ] Liste des chapitres avec drag & drop (dnd-kit)
- [x] CRUD chapitres (`src/services/chapters.ts`)
- [x] Liste des sections par chapitre
- [x] CRUD sections (`src/services/sections.ts`)
- [x] Édition section avec TipTap + auto-save

### 2.5 Système de Publication ⏳ Partiel
- [x] Status: draft → review → published (dans le modèle)
- [ ] Boutons de transition de statut dans l'UI
- [ ] Workflow de validation
- [ ] Preview mode

### 2.6 Victor - Agent IA Rédaction ✅
- [x] Tables Supabase : `agent_conversations`, `memoir_sources`, `memoir_source_mappings`, `memoir_citations`
- [x] Données initiales : 7 sources + 6 mappings
- [x] Types TypeScript (`src/types/victor.ts`)
- [x] Services : `agents.ts`, `bibliography.ts`
- [x] Composants UI : VictorPanel, VictorSkillButtons, VictorChat, VictorMessage
- [x] Intégration Layout avec bouton toggle + raccourci Ctrl+Shift+V

---

## PHASE 2.9 : Cabinet Modèle "TRAJECTOIRE CONSEIL" ✅ COMPLÉTÉE

### Contexte
Le lecteur est immergé dans un **cabinet fictif réaliste** pour apprendre le KM de façon concrète.
- **60 collaborateurs** avec personas détaillés
- **Problématiques couvertes** : départs, turnover, silos, onboarding lent, savoirs tacites
- **Données statiques JSON** (versionnées Git)

## PHASE 2.10 : Système d'Instances de Cabinet ✅ COMPLÉTÉE

### Concept

```
┌────────────────────────────────────────────────────────────────┐
│                      PUZZLAPP BRAIN                             │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐    ┌──────────────────────┐         │
│  │  INSTANCE MODÈLE     │    │  INSTANCE LECTEUR    │         │
│  │  TRAJECTOIRE CONSEIL │    │  "Mon Cabinet"       │         │
│  ├──────────────────────┤    ├──────────────────────┤         │
│  │ • 60 collaborateurs  │    │ • Mes collaborateurs │         │
│  │ • 10 clients         │    │ • Mes clients        │         │
│  │ • Lecture seule      │    │ • Lecture/écriture   │         │
│  │ • Apprendre          │    │ • Appliquer          │         │
│  └──────────────────────┘    └──────────────────────┘         │
│              │                         │                       │
│              └────────────┬────────────┘                       │
│                           ▼                                    │
│                 ┌──────────────────┐                           │
│                 │   MÊMES JEUX     │                           │
│                 │  Diagnostic KMMM │                           │
│                 │  Crash Test      │                           │
│                 │  Personas, SWOT  │                           │
│                 └──────────────────┘                           │
└────────────────────────────────────────────────────────────────┘
```

### Architecture

| Type | Stockage | Accès | Modification |
|------|----------|-------|--------------|
| **Instance Modèle** | JSON statique | Tous les users | Lecture seule |
| **Instance User** | Supabase | Owner + Admin | Lecture/écriture |

### Fichiers Créés ✅

| Fichier | Description |
|---------|-------------|
| `supabase/migrations/20260119000000_cabinet_instances.sql` | 5 tables + RLS |
| `src/types/cabinet-instance.ts` | Types TypeScript instances |
| `src/services/cabinet-instances.ts` | CRUD + helpers jeux |

### Tables Supabase

- `cabinet_instances` : Instances de cabinet (owner_id NULL = modèle)
- `instance_employees` : Collaborateurs d'une instance
- `instance_clients` : Clients d'une instance
- `instance_processes` : Processus d'une instance
- `instance_incidents` : Incidents d'une instance

### Service principal

```typescript
import {
  getInstances,
  getMyInstances,
  createInstance,
  duplicateInstance,
  getInstance,
  getModelInstance,
  MODEL_INSTANCE_ID,
} from '@/services/cabinet-instances';
```

### Fonctionnalités clés

1. **getModelInstance()** : Retourne TRAJECTOIRE CONSEIL (JSON)
2. **createInstance()** : Crée un cabinet vide pour le user
3. **duplicateInstance()** : Clone une instance (ex: partir du modèle)
4. **getInstanceForDiagnostic()** : Prépare données pour jeu Diagnostic
5. **updateInstanceKmmmScore()** : Met à jour le score après diagnostic

---

### Fichiers Créés ✅

| Fichier | Description |
|---------|-------------|
| `src/types/model-cabinet.ts` | Types TypeScript (ModelCabinet, ModelEmployee, etc.) |
| `src/data/model-cabinet/cabinet.json` | Identité cabinet (TRAJECTOIRE CONSEIL, Lyon, 4.8M€) |
| `src/data/model-cabinet/employees.json` | 60 collaborateurs avec personas |
| `src/data/model-cabinet/clients.json` | 10 clients types multi-secteurs |
| `src/data/model-cabinet/processes.json` | 9 processus avec statuts KM |
| `src/data/model-cabinet/incidents.json` | 6 incidents/cas d'étude |
| `src/data/model-cabinet/documents/*.md` | 3 documents exemples (échec passation, frustration, procédure) |
| `src/data/model-cabinet/index.ts` | Export centralisé |
| `src/services/model-cabinet.ts` | Service de chargement |

### PersonaTypes disponibles
- `expert_protector` : Expert qui protège son savoir (Françoise)
- `skeptic` : Manager sceptique (Thomas)
- `overworked` : Collaborateur surchargé (Sophie)
- `enthusiast` : Enthousiaste digital (Romain)
- `newcomer` : Junior perdu (Julie)
- `founder` : Associé fondateur (Pierre)
- `neutral` : Collaborateur neutre

### Incidents clés (cas d'étude)
1. "Le jour où Françoise était malade" - Perte savoir paie BTP
2. "Départ Jean-Claude : 40 ans perdus" - Passation ratée
3. "Client Le Comptoir Lyonnais" - Réexpliquer 3 fois
4. "Fusion MERCIER" - Intégration ratée
5. "Période fiscale" - Mêmes questions chaque année
6. "Villeurbanne déconnectée" - Silos géographiques

---

## PHASE 3 : Interface Lecteur ⏳ À FAIRE

### 3.1 Layout Lecteur
- [ ] Sidebar avec parcours disponibles
- [ ] Zone de lecture principale
- [ ] Barre de progression

### 3.2 Affichage Contenu
- [ ] Rendu Markdown/HTML du contenu
- [ ] Styles de lecture (typography)
- [ ] Mode sombre/clair

### 3.3 Système de Parcours
- [ ] Sélection d'un parcours
- [ ] Navigation entre sections
- [ ] Marquage section comme lue
- [ ] Calcul progression

### 3.4 Profil Lecteur
- [ ] Page profil avec stats
- [ ] Historique des parcours
- [ ] Badges/achievements

---

## PHASE 4 : Agents IA ⏳ À FAIRE

### 4.1 Infrastructure
- [ ] Service de conversation IA
- [ ] Stockage historique conversations
- [ ] Rate limiting

### 4.2 Agent Léo (Stratégie KM)
- [ ] Prompt system spécialisé
- [ ] Contexte mémoire injecté
- [ ] Interface chat dédiée

### 4.3 Agent Sophie (Change Management)
- [ ] Prompt system spécialisé
- [ ] Exercices guidés
- [ ] Conseils personnalisés

### 4.4 Agent Marc (Architecture IT)
- [ ] Prompt system spécialisé
- [ ] Recommandations outils
- [ ] Comparatifs solutions

### 4.5 Panel Admin Agents
- [ ] Configuration prompts
- [ ] Logs conversations
- [ ] Analytics usage

---

## PHASE 5 : Jeux Design Thinking ⏳ À FAIRE

### 5.1 Infrastructure Jeux
- [ ] Système de scoring
- [ ] Sauvegarde résultats
- [ ] Templates de jeux

### 5.2 Jeu Diagnostic KM
- [ ] Questions interactives
- [ ] Scoring et radar chart
- [ ] Recommandations personnalisées

### 5.3 Jeu Persona
- [ ] Création collaborateurs types
- [ ] Analyse besoins
- [ ] Export persona cards

### 5.4 Jeu Roadmap
- [ ] Timeline interactive
- [ ] Priorisation actions
- [ ] Export plan d'action

### 5.5 Livrables
- [ ] Génération PDF
- [ ] Export données
- [ ] Partage résultats

---

## PHASE 6 : Export Notion (BYON) ✅ IMPLÉMENTÉE

> **Concept BYON (Bring Your Own Notion)** : Chaque lecteur connecte SON propre workspace Notion pour y exporter ses livrables KM. Le lecteur garde le contrôle total de ses données.

### 6.1 Infrastructure ✅
- [x] Migration Supabase (tables `notion_connections`, `notion_exports`)
- [x] Edge Function `notion-oauth` (échange code OAuth → token)
- [x] Edge Function `notion-api` (proxy API sécurisé)

### 6.2 Services ✅
- [x] `src/services/notion/notionAuthService.ts` - OAuth flow
- [x] `src/services/notion/notionExportService.ts` - Export livrables
- [x] `src/services/notion/notionSchemas.ts` - Schémas bases Notion

### 6.3 Composants UI ✅
- [x] `src/components/reader/notion/NotionConnectButton.tsx`
- [x] `src/components/reader/notion/NotionExportModal.tsx`

### 6.4 Hook & Types ✅
- [x] `src/hooks/useNotionExport.ts` - Hook React principal
- [x] `src/types/notion.ts` - Types complets

### 6.5 Intégration ✅
- [x] Section "Exportez vers Notion" dans page lecteur
- [x] Bouton export quand livrables disponibles

### 6.6 Mise en production ⏳
- [ ] Créer intégration Notion publique (OAuth)
- [ ] Configurer variables d'environnement
- [ ] Page callback `/auth/notion/callback`
- [ ] Test flow complet

### Valeur pour le mémoire DEC

Cette fonctionnalité illustre :
- **Capitalisation automatisée** : Les livrables KM sont sauvegardés sans effort
- **Autonomisation** : Le cabinet garde ses données dans SON outil
- **Interopérabilité** : PuzzlApp s'intègre à l'écosystème existant
- **Pérennité** : Les données survivent à l'abonnement PuzzlApp

---

## Notes Techniques

### Credentials Supabase
```
URL: https://aeraxtdgjbhdrxfbsczh.supabase.co
Anon Key: Dans .env.local
```

### Commandes Utiles
```bash
npm run dev      # Serveur de dev
npm run build    # Build production
npm run lint     # Vérification code
```

### Fichiers Clés à Modifier
| Phase | Fichiers |
|-------|----------|
| 2 | `src/app/admin/page.tsx`, `src/components/admin/*` |
| 3 | `src/app/reader/page.tsx`, `src/components/reader/*` |
| 4 | `src/services/agents.ts`, `src/components/chat/*` |
| 5 | `src/components/games/*`, `src/services/games.ts` |

---

## Historique des Sessions

### Session 18 janvier 2026 (matin)
- Création projet Vite + React + TypeScript
- Configuration Tailwind 3.4.17 (downgrade depuis v4)
- Création projet Supabase + 3 migrations
- Implémentation système auth (copié de TAVT)
- Configuration routing avec pages placeholder
- Documentation README.md et CLAUDE_TASKS.md

### Session 18 janvier 2026 (soir)
- **Phase 2 quasi-complétée** :
  - Layout Admin (Sidebar, Header, Layout)
  - 11 composants Shadcn installés
  - Éditeur TipTap avec toolbar complet
  - CRUD Chapitres/Sections avec auto-save
- **Victor (Agent IA Rédaction)** :
  - 3 tables Supabase créées (sources, mappings, citations)
  - 7 sources bibliographiques initiales insérées
  - Types TypeScript + Services CRUD
  - Composants UI (Panel, SkillButtons, Chat, Message)
  - SKILL.md enrichi avec modes RECHERCHE et CRITIQUE
- **Cabinet Modèle TRAJECTOIRE CONSEIL** :
  - Types TypeScript pour le modèle
  - 60 collaborateurs avec personas détaillés
  - 10 clients, 9 processus, 6 incidents
  - 3 documents exemples (passation ratée, frustration, procédure)
  - Service de chargement + export centralisé

**Système d'instances créé** :
- Migration Supabase avec 5 tables (cabinet_instances, instance_employees, etc.)
- Types TypeScript pour les instances dynamiques
- Service CRUD complet avec helpers pour les jeux
- Fonction duplicateInstance() pour cloner le modèle

**Prochaine tâche** : Interface Lecteur Phase 3 avec sélection d'instance

### Session 19 janvier 2026

**Migration Cabinet Instances appliquée via MCP Supabase** :

Les 5 tables du système d'instances ont été créées en production :
- `cabinet_instances` (RLS ✅)
- `instance_employees` (RLS ✅)
- `instance_clients` (RLS ✅)
- `instance_processes` (RLS ✅)
- `instance_incidents` (RLS ✅)

Le système est maintenant prêt à recevoir les instances utilisateur.

### Session 18 janvier 2026 (soir - suite)

**Phase 6 : Export Notion (BYON) implémentée** :

Nouvelle fonctionnalité permettant aux lecteurs de connecter leur propre workspace Notion pour y exporter automatiquement leurs livrables KM.

**Fichiers créés** :
| Fichier | Description |
|---------|-------------|
| `src/types/notion.ts` | Types Notion (Connection, Export, Schemas) |
| `src/services/notion/notionAuthService.ts` | Service OAuth Notion |
| `src/services/notion/notionExportService.ts` | Service export vers Notion |
| `src/services/notion/notionSchemas.ts` | Schémas bases et conversion |
| `src/services/notion/index.ts` | Point d'entrée services |
| `src/components/reader/notion/NotionConnectButton.tsx` | Bouton connexion OAuth |
| `src/components/reader/notion/NotionExportModal.tsx` | Modal export multi-étapes |
| `src/components/reader/notion/index.ts` | Point d'entrée composants |
| `src/hooks/useNotionExport.ts` | Hook React principal |
| `src/hooks/index.ts` | Point d'entrée hooks |
| `supabase/functions/notion-oauth/index.ts` | Edge Function OAuth |
| `supabase/functions/notion-api/index.ts` | Edge Function proxy API |

**Migration Supabase** : Tables `notion_connections` et `notion_exports` créées

**Intégration** : Page lecteur mise à jour avec section Notion

**Prochaine tâche** : Configurer l'intégration Notion OAuth et tester le flow complet

---

*Ce fichier doit être mis à jour à chaque session de travail.*
