# CLAUDE_TASKS_READER.md - Instance Lecteur

> **Instance dédiée à l'interface Lecteur + Jeux**
> **Projet** : PuzzlApp Brain
> **Dernière mise à jour** : 19 janvier 2026

---

## Contexte

Cette instance travaille sur l'**interface Lecteur** de PuzzlApp Brain.
Le lecteur (Pierre, Marie) utilise cette interface pour :
- Choisir et suivre des parcours de lecture
- Lire le contenu du mémoire
- Jouer aux jeux Design Thinking
- Interagir avec les agents IA
- Générer des livrables

**PRD complet** : Voir `../CLAUDE.md` (à la racine Puzzlappbrain)

---

## Scope de cette Instance

### Dossiers à modifier
```
src/app/reader/          # Pages lecteur
src/components/reader/   # Composants lecteur
src/components/games/    # Jeux Design Thinking
src/stores/reader/       # État Zustand lecteur (à créer)
src/services/progress.ts # Service progression (à créer)
src/services/games.ts    # Service jeux (à créer)
src/data/model-cabinet/  # Données cabinet modèle (lecture seule)
```

### Dossiers INTERDITS (autre instance)
```
src/app/admin/           # ❌ Instance Admin
src/components/admin/    # ❌ Instance Admin
```

### Dossiers partagés (coordination requise)
```
src/types/               # Ajouter types si besoin, ne pas supprimer
src/lib/                 # Ne pas modifier
src/components/ui/       # Shadcn - OK d'ajouter des composants
```

---

## Système d'Instances de Cabinet ✅ DISPONIBLE

Le lecteur peut travailler sur **plusieurs instances de cabinet** :

### Architecture

```
┌──────────────────────┐    ┌──────────────────────┐
│  INSTANCE MODÈLE     │    │  MES INSTANCES       │
│  TRAJECTOIRE CONSEIL │    │  (Mon vrai cabinet)  │
├──────────────────────┤    ├──────────────────────┤
│ • Lecture seule      │    │ • Lecture/écriture   │
│ • Apprendre          │    │ • Appliquer          │
│ • JSON statique      │    │ • Supabase dynamique │
└──────────────────────┘    └──────────────────────┘
```

### Service d'instances

```typescript
import {
  // Récupérer les instances
  getInstances,        // Toutes (modèle + miennes)
  getMyInstances,      // Mes instances uniquement
  getModelInstance,    // TRAJECTOIRE CONSEIL
  getInstance,         // Une instance par ID

  // Créer/modifier
  createInstance,      // Nouvelle instance vide
  duplicateInstance,   // Cloner une instance existante

  // Helpers pour les jeux
  getInstanceForDiagnostic,
  getInstanceForPersona,
  getInstanceForSwot,

  MODEL_INSTANCE_ID,
} from '@/services/cabinet-instances';
```

### Cas d'usage

1. **S'entraîner** → `getModelInstance()` (TRAJECTOIRE CONSEIL)
2. **Créer mon cabinet** → `createInstance({ name: "Mon Cabinet" })`
3. **Partir du modèle** → `duplicateInstance(MODEL_INSTANCE_ID, "Mon Cabinet")`
4. **Faire le diagnostic** → `getInstanceForDiagnostic(instanceId)`

---

## Cabinet Modèle "TRAJECTOIRE CONSEIL" ✅ DISPONIBLE

Le lecteur est immergé dans un **cabinet fictif réaliste** pour apprendre le KM de façon concrète.

### Données disponibles (JSON statique)

| Fichier | Contenu |
|---------|---------|
| `cabinet.json` | TRAJECTOIRE CONSEIL, Lyon, 60 collaborateurs, 4.8M€, KMMM 1.6/5 |
| `employees.json` | 60 collaborateurs avec personas détaillés |
| `clients.json` | 10 clients types (BTP, HCR, tech, santé, immobilier...) |
| `processes.json` | 9 processus avec statuts KM |
| `incidents.json` | 6 cas d'étude (passation ratée, départ expert, client mécontent) |
| `documents/*.md` | 3 documents exemples |

### Utilisation pour les jeux

- **Jeu Diagnostic** : Utiliser le `kmmm_score` initial (1.6) et les challenges
- **Jeu Persona** : Utiliser les employés comme base (Françoise, Julie, Thomas...)
- **Jeu SWOT** : Utiliser les `pain_points` des processus
- **Jeu Roadmap** : Utiliser les `km_solution` proposées dans les incidents

---

## Phase 3 : Interface Lecteur

### 3.1 Layout Lecteur ✅ TERMINÉ
- [x] Créer `src/components/reader/ReaderLayout.tsx`
  - Sidebar gauche (parcours, navigation)
  - Zone lecture principale
  - Barre progression en haut
  - Header responsive avec menu mobile
- [x] Créer `src/components/reader/ReaderSidebar.tsx`
  - Liste parcours disponibles
  - Parcours actif avec sections (expandable)
  - Indicateurs de progression
  - Agent Léo en bas de sidebar
  - Stats de progression
- [x] Créer `src/components/reader/ProgressBar.tsx`
  - Progression globale du parcours
  - Composants: ProgressBar, MiniProgress, ProgressBadge
  - Variants: default, success, warning
  - Tailles: sm, md, lg
- [x] Créer `src/components/reader/index.ts` (exports)

### 3.2 Installer Composants Shadcn ✅ TERMINÉ
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add progress
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add sheet
npx shadcn@latest add skeleton
```

### 3.3 Sélection Parcours ⏳
- [ ] Créer `src/components/reader/ParcoursList.tsx`
  - Cards des parcours disponibles
  - Description, agent associé, nb sections
  - Bouton "Commencer" / "Reprendre"
- [ ] Créer `src/components/reader/ParcoursCard.tsx`
  - Visuel attractif
  - Progression si déjà commencé
- [ ] Créer `src/services/parcours.ts`
  - `getParcours()` - Liste parcours
  - `getParcoursById(id)` - Détail avec sections
  - `startParcours(userId, parcoursId)` - Démarrer
  - `getUserParcours(userId)` - Parcours de l'utilisateur

### 3.4 Lecture Contenu ⏳
- [ ] Créer `src/components/reader/SectionReader.tsx`
  - Affichage contenu Markdown/HTML
  - Styles de lecture (typography)
  - Navigation précédent/suivant
- [ ] Créer `src/components/reader/SectionNavigation.tsx`
  - Boutons précédent/suivant
  - Bouton "Marquer comme lu"
- [ ] Créer `src/services/progress.ts`
  - `getUserProgress(userId)` - Sections lues
  - `markSectionComplete(userId, sectionId)` - Marquer lu
  - `getParcoursProgress(userId, parcoursId)` - % completion

### 3.5 Affichage Markdown ⏳
- [ ] Installer `react-markdown` et plugins
```bash
npm install react-markdown remark-gfm rehype-highlight
```
- [ ] Créer `src/components/reader/MarkdownRenderer.tsx`
  - Rendu avec styles custom
  - Support code highlight
  - Blocs spéciaux (citation, conseil, définition)

### 3.6 Page Lecteur Principale ✅ TERMINÉ
- [x] Refaire `src/app/reader/page.tsx`
  - Utiliser ReaderLayout
  - Si pas de parcours actif → DashboardView (accueil)
  - Si parcours actif → ReadingView (lecture)
  - Gestion état: currentParcoursId, currentSectionId
- [ ] Créer routing dynamique pour parcours/sections (TODO)

---

## Phase 5 : Jeux Design Thinking

### 5.1 Infrastructure Jeux ⏳
- [ ] Créer `src/types/games.ts`
```typescript
export type GameType =
  | 'diagnostic'
  | 'persona'
  | 'empathy-map'
  | 'swot'
  | 'roadmap'
  | 'quiz';

export interface Game {
  id: string;
  section_id: string;
  type: GameType;
  title: string;
  config: GameConfig;
}

export interface GameResult {
  id: string;
  user_id: string;
  game_id: string;
  data: Record<string, any>;
  score?: number;
  completed_at: string;
}
```

### 5.2 Composant Jeu Générique ⏳
- [ ] Créer `src/components/games/GameContainer.tsx`
  - Wrapper pour tous les jeux
  - Header avec titre et instructions
  - Zone de jeu
  - Bouton soumettre
- [ ] Créer `src/components/games/GameResult.tsx`
  - Affichage résultat après soumission
  - Score si applicable
  - Bouton "Télécharger livrable"

### 5.3 Jeu Diagnostic KM ⏳
- [ ] Créer `src/components/games/DiagnosticGame.tsx`
  - Questions avec échelle 1-5
  - Calcul score KMMM
  - Radar chart résultat (recharts)
```bash
npm install recharts
```
- [ ] Créer `src/components/games/RadarChart.tsx`

### 5.4 Jeu Persona ⏳
- [ ] Créer `src/components/games/PersonaGame.tsx`
  - Formulaire création persona
  - Champs: nom, rôle, besoins, frustrations
  - Preview card persona
- [ ] Créer `src/components/games/PersonaCard.tsx`
  - Visuel exportable

### 5.5 Jeu Empathy Map ⏳
- [ ] Créer `src/components/games/EmpathyMapGame.tsx`
  - 4 quadrants (Says, Thinks, Does, Feels)
  - Drag & drop post-its
  - Export image

### 5.6 Jeu SWOT ⏳
- [ ] Créer `src/components/games/SwotGame.tsx`
  - 4 quadrants SWOT
  - Ajout items par catégorie
  - Priorisation

### 5.7 Jeu Roadmap ⏳
- [ ] Créer `src/components/games/RoadmapGame.tsx`
  - Timeline interactive
  - Ajout actions avec dates
  - Priorisation drag & drop

### 5.8 Service Jeux ⏳
- [ ] Créer `src/services/games.ts`
  - `getGamesBySection(sectionId)` - Jeux d'une section
  - `saveGameResult(userId, gameId, data)` - Sauvegarder
  - `getUserGameResults(userId)` - Historique

---

## Phase 6 : Export Notion (BYON - Bring Your Own Notion) ✅ IMPLÉMENTÉ

> **Concept** : Chaque lecteur connecte SON propre workspace Notion pour y exporter ses livrables.
> Le lecteur garde le contrôle total de ses données KM.

### 6.1 Infrastructure OAuth Notion ✅
- [x] Créer migration tables `notion_connections`, `notion_exports`
- [x] Créer Edge Function `supabase/functions/notion-oauth/index.ts` (échange code → token)
- [x] Créer Edge Function `supabase/functions/notion-api/index.ts` (proxy API sécurisé)
- [ ] Configurer variables d'environnement Notion :
  - `VITE_NOTION_CLIENT_ID` (côté client)
  - `NOTION_CLIENT_SECRET` (côté Edge Function)
  - `VITE_NOTION_REDIRECT_URI`

### 6.2 Services Notion ✅
- [x] Créer `src/services/notion/notionAuthService.ts`
  - `startNotionOAuth()` - Ouvre popup OAuth
  - `handleNotionCallback(code)` - Échange code → token
  - `getNotionConnection()` - Récupère connexion utilisateur
  - `disconnectNotion()` - Déconnexion
- [x] Créer `src/services/notion/notionExportService.ts`
  - `exportToNotion(deliverables, options)` - Export groupé
  - `getExportHistory()` - Historique exports
  - `isDeliverableExported(id)` - Vérifie si déjà exporté
- [x] Créer `src/services/notion/notionSchemas.ts`
  - Schéma base "Mes Livrables KM - PuzzlApp"
  - Conversion contenu deliverable → blocks Notion

### 6.3 Composants UI Notion ✅
- [x] Créer `src/components/reader/notion/NotionConnectButton.tsx`
  - Bouton connexion OAuth
  - Affichage workspace connecté
  - Bouton déconnexion
- [x] Créer `src/components/reader/notion/NotionExportModal.tsx`
  - Modal multi-étapes (connexion → export → succès)
  - Barre de progression export
  - Lien vers Notion à la fin

### 6.4 Hook & Types ✅
- [x] Créer `src/hooks/useNotionExport.ts`
  - État connexion (isConnected, connection, error)
  - État export (status, progress, result)
  - Actions (connect, disconnect, exportDeliverables, resetExport)
- [x] Créer `src/types/notion.ts`
  - NotionConnection, NotionExport
  - NotionExportStatus, NotionExportResult
  - Schémas et couleurs Notion

### 6.5 Intégration Page Lecteur ✅
- [x] Ajouter section "Exportez vers Notion" dans page lecteur
- [x] Bouton NotionConnectButton pour connexion
- [x] Bouton "Exporter vers Notion" sur les livrables

### 6.6 Prérequis de mise en production ⏳
- [ ] Créer une intégration Notion publique sur https://www.notion.so/my-integrations
  - Type : Public OAuth
  - Redirect URI : `https://[app-url]/auth/notion/callback`
  - Capabilities : Read/Write content
- [ ] Configurer les variables d'environnement dans Supabase Edge Functions
- [ ] Créer page callback `/auth/notion/callback` pour recevoir le code OAuth
- [ ] Tester le flow complet OAuth + export

---

## Phase 6.5 : Intégration Agent → Notion MCP ✅ IMPLÉMENTÉ

> **Concept "Tu parles, Notion se construit"** : L'utilisateur parle à un agent (Sophie, Marc, Léo),
> et l'agent crée automatiquement un espace Notion personnalisé basé sur le parcours terminé.

### Architecture

```
┌────────────────┐     ┌──────────────────┐     ┌───────────────┐
│   AGENT        │     │  NotionMCP       │     │   NOTION      │
│   (Sophie,     │────▶│  Service         │────▶│   WORKSPACE   │
│    Marc, Léo)  │     │  (Orchestration) │     │   (User)      │
└────────────────┘     └──────────────────┘     └───────────────┘
        │                      │
        │    ┌─────────────────┘
        ▼    ▼
┌──────────────────────────────────────────┐
│   NotionWorkspaceBuilder (UI Modal)      │
│   - Connexion OAuth                      │
│   - Preview template                     │
│   - Création automatique                 │
│   - Liens vers résultat                  │
└──────────────────────────────────────────┘
```

### 6.5.1 Service NotionMCPService ✅
- [x] Créer `src/services/notion/notionMCPService.ts`
  - `createWorkspaceFromTemplate(userId, templateId, deliverables)` - Crée espace complet
  - `getTemplateDescription(templateId)` - Description pour l'agent
  - `getTemplatesForParcours(parcours)` - Templates disponibles
  - `generateAgentProposal(agentName, templateId, deliverableCount)` - Message agent formaté

### 6.5.2 Templates Notion par Parcours ✅
- [x] `AVANT_VENTE_TEMPLATE` - Espace commercial (Sophie)
  - Base "Pipeline Prospects" (Kanban, Calendar)
  - Base "Offres & Tarifs"
  - Page "Template Proposition Commerciale"
  - Page "Fiche Découverte Client"

- [x] `ONBOARDING_TEMPLATE` - Espace onboarding (Marc)
  - Base "Clients en Onboarding" (par phase)
  - Base "Checklist Onboarding"
  - Page "Process Onboarding Standard"

- [x] `KM_LIVRABLES_TEMPLATE` - Base livrables KM (Léo)
  - Base unique "Mes Livrables KM - PuzzlApp"
  - Vues par parcours, par type, timeline

### 6.5.3 Composant NotionWorkspaceBuilder ✅
- [x] Créer `src/components/reader/notion/NotionWorkspaceBuilder.tsx`
  - Étape connexion (si pas connecté)
  - Étape preview (aperçu du template)
  - Étape création (progression animée)
  - Étape succès (liens vers Notion)
  - Étape erreur (retry possible)

### 6.5.4 Hook useAgentNotionIntegration ✅
- [x] Créer `src/hooks/useAgentNotionIntegration.ts`
  - `proposeWorkspace(templateId, deliverables, agentName)` - Retourne proposition formatée
  - `showBuilderModal` / `closeBuilderModal` - Contrôle modal
  - `AGENT_NOTION_CONFIG` - Configuration par agent (template par défaut)
  - `generateParcoursCompletionMessage(agentType, parcoursName, deliverableCount)`

### 6.5.5 Intégration Page Lecteur ✅
- [x] Bouton "Créer mon espace Notion" dans section Agent Léo
- [x] Modal NotionWorkspaceBuilder intégré
- [x] Handler `onOpenWorkspaceBuilder(agentType)` dans DashboardView

### Usage par les Agents (futur)

```typescript
// Exemple d'usage dans un agent (Sophie, fin parcours Avant-Vente)
import { useAgentNotionIntegration, AGENT_NOTION_CONFIG } from '@/hooks';

function SophieAgent({ deliverables, parcoursName }) {
  const { proposeWorkspace, showBuilderModal, builderModalParams, closeBuilderModal } = useAgentNotionIntegration();

  // Quand parcours terminé
  const handleParcoursComplete = () => {
    const proposal = proposeWorkspace('avant-vente', deliverables, 'Sophie', '👩‍💼');

    // Afficher le message dans le chat agent
    displayAgentMessage(proposal.message);

    // Si utilisateur clique "Créer"
    proposal.openModal();
  };

  return (
    <>
      {/* Chat agent */}
      {/* ... */}

      {/* Modal création Notion */}
      {builderModalParams && (
        <NotionWorkspaceBuilder
          isOpen={showBuilderModal}
          onClose={closeBuilderModal}
          {...builderModalParams}
        />
      )}
    </>
  );
}
```

### Valeur pour le mémoire DEC

Cette fonctionnalité illustre le niveau **"IA Augmentée"** du KM :
- **Zéro friction** : L'utilisateur novice n'a rien à configurer
- **Personnalisation automatique** : L'espace est adapté au parcours terminé
- **Capitalisation instantanée** : Les livrables sont automatiquement structurés
- **Autonomisation** : Le cabinet possède son propre système de suivi

> "Le Knowledge Management 4.0 ne demande pas à l'utilisateur de s'adapter à l'outil,
> c'est l'outil qui s'adapte à l'utilisateur."

---

## Types à Créer

```typescript
// src/types/reader.ts

export interface Parcours {
  id: string;
  name: string;
  description?: string;
  agent_type: 'leo' | 'sophie' | 'marc' | null;
  sections: string[]; // IDs
  created_at: string;
}

export interface UserParcours {
  id: string;
  user_id: string;
  parcours_id: string;
  started_at: string;
  completed_at?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  section_id: string;
  completed_at: string;
}

export interface ParcoursWithProgress extends Parcours {
  progress: number; // 0-100
  sectionsCompleted: number;
  totalSections: number;
}
```

---

## Store Zustand

```typescript
// src/stores/reader/readerStore.ts

import { create } from 'zustand';

interface ReaderStore {
  currentParcours: Parcours | null;
  currentSection: Section | null;
  progress: Map<string, boolean>; // sectionId -> completed

  selectParcours: (id: string) => Promise<void>;
  nextSection: () => void;
  prevSection: () => void;
  markComplete: () => Promise<void>;
}
```

---

## Supabase - Tables Utilisées

| Table | Usage |
|-------|-------|
| `parcours` | Liste parcours |
| `sections` | Contenu (lecture seule) |
| `chapters` | Métadonnées (lecture seule) |
| `user_parcours` | Parcours démarrés |
| `user_progress` | Sections complétées |
| `games` | Configuration jeux |
| `game_results` | Résultats sauvegardés |
| `deliverables` | Livrables générés |

---

## Données Mock (si contenu pas encore créé)

Pour développer sans attendre l'instance Admin :

```typescript
// src/mocks/content.ts

export const mockParcours: Parcours[] = [
  {
    id: '1',
    name: 'Avant-Vente',
    description: 'Transformez votre approche commerciale',
    agent_type: 'sophie',
    sections: ['s1', 's2', 's3'],
  },
  {
    id: '2',
    name: 'Onboarding Client',
    description: 'Créez une expérience client mémorable',
    agent_type: 'marc',
    sections: ['s4', 's5', 's6'],
  },
];

export const mockSections: Section[] = [
  {
    id: 's1',
    chapter_id: 'c1',
    order: 1,
    title: 'Introduction à l\'avant-vente',
    content_md: '# Introduction\n\nBienvenue dans ce parcours...',
  },
  // ...
];
```

---

## Commandes Utiles

```bash
# Dev
cd puzzlapp-brain
npm run dev

# Ajouter composant Shadcn
npx shadcn@latest add [composant]

# Installer recharts pour les graphiques
npm install recharts

# Installer react-markdown
npm install react-markdown remark-gfm
```

---

## Checklist Avant Commit

- [ ] Code TypeScript sans erreurs (`npm run lint`)
- [ ] Composants dans les bons dossiers (`src/components/reader/`, `src/components/games/`)
- [ ] Types exportés depuis `src/types/`
- [ ] Services utilisent le client Supabase existant
- [ ] Pas de modification des fichiers Admin
- [ ] Jeux fonctionnent avec données mock

---

## Contact

Si besoin de coordination avec l'instance Admin, noter dans ce fichier les types/interfaces partagés créés.

**Types partagés avec Admin** :
- `Section` (défini par Admin dans `src/types/content.ts`)
- `Chapter` (défini par Admin dans `src/types/content.ts`)

---

---

## Session 19 janvier 2026

**Cabinet Modèle créé** :
- Types TypeScript dans `src/types/model-cabinet.ts`
- 60 collaborateurs avec 7 types de personas
- 10 clients, 9 processus, 6 incidents
- 3 documents exemples (passation ratée, frustration junior, procédure incomplète)
- Service de chargement `src/services/model-cabinet.ts`

**Système d'Instances de Cabinet** :
- Types TypeScript dans `src/types/cabinet-instance.ts`
- Service CRUD complet `src/services/cabinet-instances.ts`
- Migration appliquée via MCP Supabase ✅

**Tables Supabase créées** :
| Table | RLS | Description |
|-------|-----|-------------|
| `cabinet_instances` | ✅ | Cabinets (owner_id NULL = modèle) |
| `instance_employees` | ✅ | Collaborateurs |
| `instance_clients` | ✅ | Clients |
| `instance_processes` | ✅ | Processus |
| `instance_incidents` | ✅ | Incidents |

**Prochaine tâche** : Intégrer le sélecteur d'instance dans l'interface lecteur

---

## Session 18 janvier 2026 (soir)

**Phase 6 : Export Notion (BYON) implémentée** :

Cette fonctionnalité permet à chaque lecteur de connecter son propre workspace Notion pour y exporter automatiquement ses livrables KM.

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/types/notion.ts` | Types TypeScript Notion (Connection, Export, Schemas) |
| `src/services/notion/notionAuthService.ts` | Service OAuth Notion |
| `src/services/notion/notionExportService.ts` | Service export vers Notion |
| `src/services/notion/notionSchemas.ts` | Schémas bases et conversion contenu |
| `src/services/notion/index.ts` | Point d'entrée services |
| `src/components/reader/notion/NotionConnectButton.tsx` | Bouton connexion OAuth |
| `src/components/reader/notion/NotionExportModal.tsx` | Modal export multi-étapes |
| `src/components/reader/notion/index.ts` | Point d'entrée composants |
| `src/hooks/useNotionExport.ts` | Hook React principal |
| `src/hooks/index.ts` | Point d'entrée hooks |
| `supabase/functions/notion-oauth/index.ts` | Edge Function échange code→token |
| `supabase/functions/notion-api/index.ts` | Edge Function proxy API |

### Migration Supabase appliquée

Tables créées :
- `notion_connections` : Stockage des tokens OAuth par utilisateur
- `notion_exports` : Historique des exports (traçabilité)

### Intégration page lecteur

La page lecteur (`src/app/reader/page.tsx`) intègre maintenant :
- Section "Exportez vers Notion" avec bouton de connexion
- Modal d'export qui apparaîtra quand des livrables seront disponibles

### Valeur pour le mémoire DEC

Cette fonctionnalité illustre :
- **Capitalisation automatisée** : Les livrables KM sont sauvegardés sans effort
- **Autonomisation** : Le cabinet garde ses données dans SON outil
- **Interopérabilité** : PuzzlApp s'intègre à l'écosystème existant
- **Pérennité** : Les données survivent à l'abonnement PuzzlApp

**Prochaine tâche** : Configurer l'intégration Notion (OAuth) et tester le flow complet

---

## Session 18 janvier 2026 (nuit)

**Phase 3.1 : Layout Lecteur implémenté**

Cette session a créé l'architecture de base de l'interface lecteur pour offrir une expérience de lecture "incroyable" au jury DEC.

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/components/reader/ReaderLayout.tsx` | Layout principal avec header, sidebar, zone lecture |
| `src/components/reader/ReaderSidebar.tsx` | Navigation parcours, sections, agent Léo |
| `src/components/reader/ProgressBar.tsx` | Composants progression (ProgressBar, MiniProgress, ProgressBadge) |
| `src/components/reader/index.ts` | Exports des composants reader |

### Composants Shadcn installés
- `progress` (barre de progression)
- `sheet` (menu mobile)

### Architecture de la page lecteur

```
ReaderLayout
├── Header (fixe)
│   ├── Logo PuzzlApp Brain
│   ├── ProgressBar (progression parcours actif)
│   └── Actions (Admin, user, déconnexion)
├── Sidebar (desktop: fixe / mobile: Sheet)
│   ├── Liste des parcours (expandable)
│   ├── Sections du parcours actif
│   ├── Agent Léo (bouton chat)
│   └── Stats progression
└── Main Content
    ├── DashboardView (si aucun parcours sélectionné)
    │   ├── Message bienvenue
    │   ├── Cards parcours disponibles
    │   ├── Section Agent Léo
    │   ├── Mes livrables
    │   └── Export Notion
    └── ReadingView (si parcours sélectionné)
        ├── Header section
        ├── Contenu (placeholder)
        ├── Zone jeu (placeholder)
        └── Navigation prev/next
```

### Vision confirmée

Le jury DEC lira le mémoire DANS l'application elle-même, vivant ainsi l'expérience KM innovante qu'Alexandre propose.

**Prochaine tâche** : Implémenter les services parcours/progress pour charger les vrais contenus

---

*Instance Lecteur - 18 janvier 2026 (nuit)*

---

## Session 18 janvier 2026 (suite - Intégration MCP Notion)

**Phase 6.5 : Intégration Agent → Notion MCP implémentée**

Cette session a créé l'architecture permettant aux agents IA (Sophie, Marc, Léo) de créer automatiquement des espaces Notion personnalisés pour les utilisateurs. Concept : "Tu parles, Notion se construit".

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/services/notion/notionMCPService.ts` | Service d'orchestration MCP → Notion (templates, création workspace) |
| `src/components/reader/notion/NotionWorkspaceBuilder.tsx` | Modal conversationnel multi-étapes |
| `src/hooks/useAgentNotionIntegration.ts` | Hook pour intégration dans les agents |

### Templates Notion créés

| Template | Agent | Contenu |
|----------|-------|---------|
| `AVANT_VENTE_TEMPLATE` | Sophie | Pipeline Prospects, Offres & Tarifs, Proposition Commerciale, Fiche Découverte |
| `ONBOARDING_TEMPLATE` | Marc | Clients en Onboarding, Checklist, Process Standard |
| `KM_LIVRABLES_TEMPLATE` | Léo | Base "Mes Livrables KM - PuzzlApp" avec vues multiples |

### Intégration page lecteur

- Bouton "Créer mon espace Notion" ajouté dans la section Agent Léo
- Modal `NotionWorkspaceBuilder` intégré avec flow complet (connexion → preview → création → succès)
- Hook `useAgentNotionIntegration` prêt à être utilisé par les futurs agents

### Valeur pour le mémoire DEC

Cette fonctionnalité démontre le niveau "IA Augmentée" du KM :
- L'utilisateur novice n'a rien à configurer
- L'espace Notion est adapté au parcours terminé
- Les livrables sont automatiquement structurés
- Le cabinet possède et contrôle ses données

**Prochaine tâche** : Implémenter les agents Sophie, Marc, Léo avec chat interactif et intégration Notion

---

*Instance Lecteur - 18 janvier 2026 (suite MCP)*
