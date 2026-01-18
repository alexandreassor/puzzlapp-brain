# CLAUDE_TASKS_ADMIN.md - Instance Admin

> **Instance dédiée à l'interface Admin**
> **Projet** : PuzzlApp Brain
> **Dernière mise à jour** : 18 janvier 2026 (soir)

---

## Contexte

Cette instance travaille sur l'**interface Admin** de PuzzlApp Brain.
L'admin (Alexandre) utilise cette interface pour :
- Rédiger le contenu du mémoire
- Organiser les chapitres et sections
- Configurer les jeux Design Thinking
- Prévisualiser l'expérience lecteur
- **Collaborer avec Victor** (agent IA rédaction)

**PRD complet** : Voir `../CLAUDE.md` (à la racine Puzzlappbrain)

---

## Scope de cette Instance

### Dossiers à modifier
```
src/app/admin/           # Pages admin
src/components/admin/    # Composants admin
src/components/admin/victor/  # Composants Victor (à créer)
src/stores/admin/        # État Zustand admin (à créer)
src/services/            # Services CRUD + agents + bibliography
```

### Dossiers INTERDITS (autre instance)
```
src/app/reader/          # ❌ Instance Lecteur
src/components/reader/   # ❌ Instance Lecteur
src/components/games/    # ❌ Instance Lecteur
```

### Dossiers partagés (coordination requise)
```
src/types/               # Ajouter types si besoin, ne pas supprimer
src/lib/                 # Ne pas modifier
src/components/ui/       # Shadcn - OK d'ajouter des composants
```

---

## Phase 2 : Interface Admin

### 2.1 Layout Admin ✅ COMPLÉTÉ
- [x] Créer `src/components/admin/AdminLayout.tsx`
- [x] Créer `src/components/admin/AdminSidebar.tsx`
- [x] Créer `src/components/admin/AdminHeader.tsx`

### 2.2 Installer Composants Shadcn ✅ COMPLÉTÉ
```bash
# Composants installés :
# button, input, card, dialog, dropdown-menu, tabs, tooltip, scroll-area, separator, badge, avatar
```

### 2.3 Éditeur TipTap ✅ COMPLÉTÉ
- [x] Installer dépendances TipTap
- [x] Créer `src/components/admin/editor/RichTextEditor.tsx`
- [x] Créer `src/components/admin/editor/EditorToolbar.tsx`
- [x] Créer `src/components/admin/editor/utils.ts`

### 2.4 Gestion Chapitres ✅ COMPLÉTÉ
- [x] Créer `src/services/chapters.ts`
- [x] Interface intégrée dans AdminPage avec dialogs

### 2.5 Gestion Sections ✅ COMPLÉTÉ
- [x] Créer `src/services/sections.ts`
- [x] Interface intégrée dans AdminPage

### 2.6 Page Admin Principale ✅ COMPLÉTÉ
- [x] Dashboard, vue chapitre, vue section avec éditeur
- [x] Auto-save du contenu

### 2.7 Système de Publication ⏳ À FAIRE
- [x] Statuts: draft / review / published (dans le modèle)
- [ ] Boutons de transition de statut dans l'UI
- [ ] Workflow de validation

---

## Phase 2.8 : Victor - Agent IA Rédaction ✅ COMPLÉTÉ

### Avancement (18 janvier 2026 - soir)

| Élément | Statut | Détails |
|---------|:------:|---------|
| Tables Supabase | ✅ | `agent_conversations`, `memoir_sources`, `memoir_source_mappings`, `memoir_citations` |
| Données initiales | ✅ | 7 sources + 6 mappings insérés |
| Types TypeScript | ✅ | `src/types/victor.ts` - VictorSkill, VictorMessage, MemoirSource, etc. |
| Service agents.ts | ✅ | CRUD conversations, messages |
| Service bibliography.ts | ✅ | CRUD sources, mappings, citations, formatage APA |
| Composants UI | ✅ | VictorPanel, VictorSkillButtons, VictorChat, VictorMessage |
| Intégration Layout | ✅ | Bouton Victor dans Header, Panel intégré dans Layout |
| Raccourci clavier | ✅ | Ctrl+Shift+V pour toggle |

### Concept

Victor est l'agent IA qui assiste Alexandre dans la rédaction du mémoire.
**UI inspirée de Claude Cowork** (janvier 2026) : panneau latéral droit avec chat contextuel.

### Architecture UI

```
┌─────────────────────────────────────────────────────────────────────────┐
│  AdminHeader                                                    [Victor]│
├──────────┬──────────────────────────────────────┬───────────────────────┤
│          │                                      │                       │
│ Sidebar  │     Zone Éditeur TipTap              │   Victor Panel        │
│ Chapitres│                                      │                       │
│          │                                      │   [6 Compétences]     │
│          │                                      │                       │
│          │                                      │   [Chat contextuel]   │
│          │                                      │                       │
│          │                                      │   [Input message]     │
└──────────┴──────────────────────────────────────┴───────────────────────┘
```

### 6 Compétences de Victor

| Compétence | Couleur | Description | Prompt System |
|------------|---------|-------------|---------------|
| **Rédaction** | `blue-500` | Génère contenu, reformule, complète | "Tu es un rédacteur académique expert en KM pour cabinets comptables..." |
| **Recherche** | `green-500` | Web search, trouve infos, enrichit | "Tu es un chercheur spécialisé en Knowledge Management..." |
| **Acquisition** | `orange-500` | Capture connaissances, extrait de docs | "Tu captures et structures les connaissances..." |
| **Plan** | `purple-500` | Structure, outline, réorganise | "Tu es un architecte de contenu académique..." |
| **Bibliographie** | `yellow-500` | Gère sources, citations, références | "Tu gères la bibliographie au format APA 7e édition..." |
| **Critique** | `red-500` | Review, cohérence, suggestions | "Tu es un critique constructif et exigeant..." |

### Tables Supabase Utilisées

#### `agent_conversations`
```sql
- id: UUID
- user_id: UUID → profiles
- agent_type: 'victor' (ou 'leo', 'sophie', 'marc')
- messages: JSONB[]  -- [{role: 'user'|'assistant', content: string, timestamp: string, skill?: string}]
- created_at, updated_at
```

#### `memoir_sources` (Bibliographie)
```sql
- id: UUID
- citation_key: TEXT (unique)     -- ex: "nonaka_1995"
- title: TEXT
- authors: TEXT[]
- year: INTEGER
- type: 'book' | 'article' | 'thesis_dec' | 'report' | 'web' | 'video'
- publisher, doi, isbn, url: TEXT
- status: 'to_read' | 'reading' | 'read' | 'key_source'
- verified: BOOLEAN
- abstract, keywords[], notes: TEXT
```

#### `memoir_source_mappings` (Lien sources → sections)
```sql
- id: UUID
- source_id: UUID → memoir_sources
- section_code: TEXT              -- ex: "2.3.1"
- section_title: TEXT
- relevance: 1-3                  -- 1=essentiel, 3=optionnel
- concepts: TEXT[]                -- ex: ["SECI", "ba"]
- usage_suggestion: TEXT
```

#### `memoir_citations` (Citations extraites)
```sql
- id: UUID
- source_id: UUID → memoir_sources
- quote: TEXT                     -- citation exacte
- page: TEXT
- is_paraphrase: BOOLEAN
- target_section: TEXT            -- où l'utiliser
- used_in_section: TEXT           -- où c'est utilisé
- used_at: TIMESTAMP
- context, comment: TEXT
```

### Fichiers à Créer

| Fichier | Description |
|---------|-------------|
| `src/components/admin/victor/VictorPanel.tsx` | Panneau principal Victor |
| `src/components/admin/victor/VictorSkillButtons.tsx` | 6 boutons compétences |
| `src/components/admin/victor/VictorChat.tsx` | Interface chat |
| `src/components/admin/victor/VictorMessage.tsx` | Composant message |
| `src/components/admin/victor/index.ts` | Exports |
| `src/services/agents.ts` | Service conversations agents |
| `src/services/bibliography.ts` | Service sources, citations, mappings |
| `src/types/victor.ts` | Types Victor |

### Types TypeScript

```typescript
// src/types/victor.ts

export type VictorSkill =
  | 'redaction'
  | 'recherche'
  | 'acquisition'
  | 'plan'
  | 'bibliographie'
  | 'critique';

export interface VictorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  skill?: VictorSkill;
  metadata?: {
    sectionId?: string;
    chapterId?: string;
    sourceIds?: string[];
  };
}

export interface VictorConversation {
  id: string;
  user_id: string;
  agent_type: 'victor';
  messages: VictorMessage[];
  created_at: string;
  updated_at: string;
}

export interface VictorContext {
  currentSkill: VictorSkill;
  currentSection?: Section;
  currentChapter?: Chapter;
  isOpen: boolean;
}

// Bibliography types
export interface MemoirSource {
  id: string;
  citation_key: string;
  title: string;
  authors: string[];
  year?: number;
  type: 'book' | 'article' | 'thesis_dec' | 'report' | 'web' | 'video';
  publisher?: string;
  doi?: string;
  isbn?: string;
  url?: string;
  status: 'to_read' | 'reading' | 'read' | 'key_source';
  verified: boolean;
  abstract?: string;
  keywords?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MemoirSourceMapping {
  id: string;
  source_id: string;
  section_code: string;
  section_title?: string;
  relevance: 1 | 2 | 3;
  concepts?: string[];
  usage_suggestion?: string;
  created_at: string;
}

export interface MemoirCitation {
  id: string;
  source_id: string;
  quote: string;
  page?: string;
  is_paraphrase: boolean;
  target_section?: string;
  used_in_section?: string;
  used_at?: string;
  context?: string;
  comment?: string;
  created_at: string;
}
```

### Prompts System par Compétence

```typescript
// src/services/agents.ts

export const VICTOR_PROMPTS: Record<VictorSkill, string> = {
  redaction: `Tu es Victor, un rédacteur académique expert en Knowledge Management pour cabinets d'expertise comptable.
Tu aides Alexandre à rédiger son mémoire DEC.
Tu écris dans un style académique mais accessible.
Tu utilises le vouvoiement et un ton professionnel.
Tu structures tes réponses avec des titres et sous-titres.
Contexte actuel : Section "{sectionTitle}" du chapitre "{chapterTitle}".`,

  recherche: `Tu es Victor, un chercheur spécialisé en Knowledge Management.
Tu recherches des informations pertinentes pour enrichir le mémoire.
Tu cites toujours tes sources et vérifies leur fiabilité.
Tu proposes des pistes de recherche complémentaires.
Tu connais les auteurs clés : Nonaka, Davenport, Sveiby, Ermine.`,

  acquisition: `Tu es Victor, expert en capture et structuration des connaissances.
Tu aides à extraire les informations clés des documents.
Tu crées des fiches de synthèse structurées.
Tu identifies les concepts importants et leurs relations.
Tu proposes des tags et mots-clés pertinents.`,

  plan: `Tu es Victor, architecte de contenu académique.
Tu aides à structurer le mémoire de façon logique et cohérente.
Tu proposes des plans détaillés avec transitions.
Tu vérifies que la progression est fluide.
Tu suggères des réorganisations si nécessaire.`,

  bibliographie: `Tu es Victor, gestionnaire bibliographique expert.
Tu gères les sources au format APA 7e édition.
Tu vérifies la validité et la pertinence des sources.
Tu suggères des sources complémentaires.
Tu aides à formuler des citations correctes.
Base de données disponible : memoir_sources, memoir_citations.`,

  critique: `Tu es Victor, critique constructif et exigeant.
Tu analyses le contenu avec un regard critique mais bienveillant.
Tu identifies les faiblesses et incohérences.
Tu vérifies la rigueur académique.
Tu proposes des améliorations concrètes.
Tu notes sur une échelle de 1 à 5 : clarté, rigueur, originalité.`,
};
```

### Fonctionnalités UI

1. **Bouton toggle Victor** dans AdminHeader (icône robot)
2. **Panel coulissant** depuis la droite (300px de large)
3. **6 boutons compétences** avec couleurs distinctes
4. **Indicateur skill actif** (bordure + background léger)
5. **Chat contextuel** qui affiche la section active
6. **Raccourcis clavier** : Ctrl+Shift+V (toggle), Ctrl+1 à Ctrl+6 (skills)
7. **Historique** des conversations par skill
8. **Actions rapides** : insérer dans l'éditeur, copier, sauvegarder source

---

## Fichiers Créés (Phase 2.1-2.8)

| Fichier | Description |
|---------|-------------|
| `src/components/admin/AdminLayout.tsx` | Layout principal admin (avec Victor intégré) |
| `src/components/admin/AdminSidebar.tsx` | Navigation chapitres/sections |
| `src/components/admin/AdminHeader.tsx` | Header avec user menu et bouton Victor |
| `src/components/admin/editor/RichTextEditor.tsx` | Éditeur TipTap |
| `src/components/admin/editor/EditorToolbar.tsx` | Barre d'outils éditeur |
| `src/components/admin/editor/utils.ts` | Conversion HTML/Markdown |
| `src/components/admin/victor/VictorPanel.tsx` | Panneau principal Victor |
| `src/components/admin/victor/VictorSkillButtons.tsx` | 6 boutons compétences |
| `src/components/admin/victor/VictorChat.tsx` | Interface chat |
| `src/components/admin/victor/VictorMessage.tsx` | Composant message |
| `src/components/admin/victor/index.ts` | Exports Victor |
| `src/services/chapters.ts` | CRUD chapitres |
| `src/services/sections.ts` | CRUD sections |
| `src/services/agents.ts` | CRUD conversations agents |
| `src/services/bibliography.ts` | CRUD sources, citations, mappings |
| `src/types/victor.ts` | Types Victor et bibliographie |
| `src/app/admin/page.tsx` | Page admin complète |

---

## Prochaines Tâches (ordre de priorité)

1. ~~**Victor Panel** - Créer les composants Victor~~ ✅
2. ~~**Services agents + bibliography** - CRUD Supabase~~ ✅
3. ~~**Intégration layout** - Ajouter Victor à AdminLayout~~ ✅
4. **Workflow publication** - Boutons de statut dans l'UI
5. **Drag & drop** - Réordonnement chapitres/sections (dnd-kit)
6. **Connexion API Claude** - Remplacer simulateAIResponse par appel réel
7. **Page Bibliographie** - Interface dédiée pour gérer les sources

---

## Session 18 janvier 2026 (soir)

**Réalisé** :
- Initialisé Shadcn UI + 11 composants
- Créé layout Admin complet
- Créé éditeur TipTap
- Créé services CRUD chapters/sections
- Page Admin avec 3 vues
- Build vérifié sans erreurs
- **Spécifications Victor définies** (6 compétences, prompts, types)
- **Victor implémenté** :
  - Types dans `src/types/victor.ts`
  - Services `agents.ts` et `bibliography.ts`
  - Composants Victor (Panel, SkillButtons, Chat, Message)
  - Intégration dans AdminLayout et AdminHeader
  - Raccourci clavier Ctrl+Shift+V
  - Réponses de démonstration (prêt pour API Claude)

**Prochaine tâche** : Workflow publication ou Page Bibliographie

---

*Instance Admin - 18 janvier 2026 (soir)*
