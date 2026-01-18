# 📋 TÂCHE — PuzzlApp Brain (Writing Tool)

> 16 janvier 2026 — Préparé par Marco

---

## Contexte

Alexandre a besoin d'un outil d'écriture optimisé pour rédiger son mémoire DEC avec l'aide d'agents IA (Victor le rédacteur, et potentiellement d'autres). L'outil doit combiner :
- Un éditeur riche Markdown
- Une gestion de contexte multi-couches (Novel-OS style)
- L'intégration avec les agents existants
- Un suivi de l'avancement par section

Recherche effectuée sur GitHub :
- **Novel-OS** : Système 3 couches pour la cohérence IA (Standards → Novel → Manuscripts)
- **TipTap** : Éditeur headless sur ProseMirror (34.5k stars, utilisé par Doist)
- **Shadcn-editor** : TipTap + Shadcn UI pour React

---

## Stack Technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Framework | React + TypeScript | Écosystème riche, typage fort |
| Éditeur | TipTap + @tiptap/extension-markdown | Headless, extensible, Markdown natif |
| UI | Shadcn UI + Tailwind CSS | Composants modernes, personnalisables |
| État | Zustand ou Context | Léger, pas de Redux overkill |
| Build | Vite | Rapide, HMR |

---

## Architecture 3 Couches (inspiré Novel-OS)

```
┌─────────────────────────────────────────────────────────────┐
│  COUCHE 1 : STANDARDS (invariant)                           │
│  └── .brain/standards/                                      │
│      ├── writing-style.md    (ton académique DEC)           │
│      ├── thesis-structure.md (plan chapitres obligatoires)  │
│      └── citation-rules.md   (normes bibliographiques)      │
├─────────────────────────────────────────────────────────────┤
│  COUCHE 2 : PROJET (spécifique mémoire)                     │
│  └── .brain/project/                                        │
│      ├── plan.md             (MEMOIRE_MASTER_V1.md importé) │
│      ├── sources.json        (42 sources indexées)          │
│      ├── decisions.md        (choix validés par Alexandre)  │
│      └── agents/             (Victor, Léo, Jules configs)   │
├─────────────────────────────────────────────────────────────┤
│  COUCHE 3 : SESSION (éphémère)                              │
│  └── .brain/session/                                        │
│      ├── current-section.md  (section en cours)             │
│      ├── progress.json       (avancement par chapitre)      │
│      └── notes.md            (idées de la session)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Objectif

Créer une application React avec :
1. Un éditeur TipTap pour rédiger en Markdown
2. Un panneau latéral gauche (plan/navigation)
3. Un panneau latéral droit (agents/sources/contexte)
4. Une gestion d'état pour le suivi d'avancement
5. Export Markdown vers les fichiers du projet

---

## Fichiers à Créer

### Phase 1 : Setup (Day 1)

```
puzzlapp-brain/
├── package.json              # Dépendances
├── vite.config.ts            # Config Vite
├── tsconfig.json             # TypeScript
├── tailwind.config.js        # Tailwind
├── postcss.config.js         # PostCSS
│
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Layout principal
│   ├── index.css             # Styles globaux
│   │
│   ├── components/
│   │   └── ui/               # Shadcn components (Button, etc.)
│   │
│   └── lib/
│       └── utils.ts          # Helpers (cn, etc.)
```

**Instructions :**
1. `npm create vite@latest puzzlapp-brain -- --template react-ts`
2. Installer TipTap : `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-markdown`
3. Installer Shadcn : suivre https://ui.shadcn.com/docs/installation/vite
4. Configurer Tailwind

### Phase 2 : Éditeur TipTap (Day 2)

```
src/
├── components/
│   ├── editor/
│   │   ├── Editor.tsx        # Composant TipTap principal
│   │   ├── Toolbar.tsx       # Barre d'outils (bold, italic, etc.)
│   │   ├── MenuBar.tsx       # Menu slash commands
│   │   └── extensions/
│   │       └── MarkdownExtension.ts
│   │
│   └── ui/
│       └── ... (Shadcn)
```

**Instructions :**
1. Créer `Editor.tsx` avec TipTap + StarterKit
2. Ajouter extension Markdown pour import/export
3. Créer `Toolbar.tsx` avec boutons formatage
4. Tester écriture et conversion Markdown

### Phase 3 : Layout 3 Panneaux (Day 3)

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx    # Grid 3 colonnes
│   │   ├── LeftPanel.tsx     # Plan/Navigation
│   │   ├── CenterPanel.tsx   # Éditeur
│   │   └── RightPanel.tsx    # Contexte/Agents
│   │
│   ├── plan/
│   │   ├── PlanTree.tsx      # Arborescence chapitres
│   │   └── SectionItem.tsx   # Item cliquable
│   │
│   └── context/
│       ├── SourcesPanel.tsx  # Sources bibliographiques
│       ├── AgentPanel.tsx    # Agent actif (Victor)
│       └── ProgressBar.tsx   # Avancement section
```

**Instructions :**
1. Créer layout responsive avec Tailwind grid
2. Panneau gauche redimensionnable
3. Panneau droit collapsible
4. Intégrer l'éditeur au centre

### Phase 4 : Gestion Contexte (Day 4)

```
src/
├── stores/
│   ├── useProjectStore.ts    # État projet (plan, sources)
│   ├── useSessionStore.ts    # État session (section active)
│   └── useProgressStore.ts   # Avancement
│
├── types/
│   ├── project.ts            # Types projet
│   ├── section.ts            # Types section
│   └── source.ts             # Types source
│
└── services/
    ├── fileService.ts        # Lecture/écriture fichiers
    └── contextService.ts     # Assemblage contexte pour IA
```

**Instructions :**
1. Créer stores Zustand pour état global
2. Importer plan depuis MEMOIRE_MASTER_V1.md
3. Indexer sources depuis BASE_CONNAISSANCES.md
4. Créer service d'assemblage contexte

### Phase 5 : Intégration Agents (Day 5)

```
src/
├── components/
│   └── agent/
│       ├── AgentSelector.tsx # Sélection agent actif
│       ├── AgentChat.tsx     # Zone interaction
│       └── PromptBuilder.tsx # Construction prompt contextuel
│
└── services/
    └── agentService.ts       # Préparation prompts avec contexte
```

**Instructions :**
1. Charger configs agents depuis `.claude/agents/`
2. Créer composant sélecteur d'agent
3. Builder de prompt avec contexte 3 couches
4. Zone d'affichage suggestions agent

---

## Critères de Succès

- [ ] Éditeur TipTap fonctionnel avec Markdown
- [ ] Export/Import Markdown depuis/vers fichiers projet
- [ ] Plan du mémoire navigable dans panneau gauche
- [ ] Sources accessibles dans panneau droit
- [ ] Contexte assemblé automatiquement pour chaque section
- [ ] Suivi d'avancement visuel (% par chapitre)
- [ ] Agents sélectionnables avec prompts contextualisés

---

## ⚠️ Attention

| Piège | Solution |
|-------|----------|
| TipTap SSR issues | Utiliser `dynamic import` avec `ssr: false` si Next.js |
| Bundle size TipTap | Tree-shake extensions non utilisées |
| Markdown parsing edge cases | Utiliser `@tiptap/extension-markdown` officiel (v3.7+) |
| Chemins fichiers Windows | Utiliser `path.normalize()` ou `/` uniformément |
| Agents trop verbeux | Limiter contexte à section active + sources liées |

---

## Ressources

| Ressource | URL |
|-----------|-----|
| TipTap Docs | https://tiptap.dev/docs |
| TipTap Markdown | https://tiptap.dev/docs/editor/extensions/functionality/markdown |
| Shadcn UI | https://ui.shadcn.com |
| Novel-OS (inspiration) | https://github.com/forsonny/book-os |
| Doist Typist (TipTap) | https://github.com/doist/typist |

---

## Historique

| Date | Tâche | Statut |
|------|-------|--------|
| 2026-01-16 | Recherche stack (Marco) | ✅ |
| 2026-01-16 | Rédaction CLAUDE_TASKS.md | ✅ |
| - | Phase 1 : Setup | ⏳ |
| - | Phase 2 : Éditeur | ⏳ |
| - | Phase 3 : Layout | ⏳ |
| - | Phase 4 : Contexte | ⏳ |
| - | Phase 5 : Agents | ⏳ |

---

*Marco — Lead Tech pour Alexandre*


Construction de l'agent ou des agents de rédaction : 
🎯 MAPPING OPENDRAFT → WORKFLOW MÉMOIRE DEC
1️⃣ Adaptation des 19 Agents OpenDraft → 6 Agents DEC
Principe de Consolidation
OpenDraft utilise 19 agents très granulaires. Pour ton mémoire DEC, je propose de consolider en 6 agents plus puissants avec mémoire persistante :
┌─────────────────────────────────────────────────────────────────────────┐
│                    MAPPING AGENTS                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  OPENDRAFT (19 agents)              →    MÉMOIRE DEC (6 agents)        │
│                                                                         │
│  ┌─ Scout ─────────────────┐                                           │
│  │  Scribe                 │  →  🔍 SOPHIE (Chercheuse)                │
│  │  Signal                 │      Recherche + Synthèse + Citations     │
│  │  Citation Manager       │                                           │
│  └─────────────────────────┘                                           │
│                                                                         │
│  ┌─ Architect ─────────────┐                                           │
│  │  Formatter              │  →  🏗️ LÉO (Orchestrateur)               │
│  │  Compose                │      Planning + Structure + Coordination  │
│  └─────────────────────────┘                                           │
│                                                                         │
│  ┌─ Crafter ───────────────┐                                           │
│  │  Thread                 │  →  ✍️ MARC (Rédacteur)                   │
│  │  Narrator               │      Rédaction + Cohérence + Style        │
│  │  Voice                  │                                           │
│  └─────────────────────────┘                                           │
│                                                                         │
│  ┌─ Skeptic ───────────────┐                                           │
│  │  Verifier               │  →  👨‍⚖️ VICTOR (Critique)                 │
│  │  Referee                │      Vérification + Peer Review + Score   │
│  │  Entropy                │                                           │
│  └─────────────────────────┘                                           │
│                                                                         │
│  ┌─ Polish ────────────────┐                                           │
│  │  Enhancer               │  →  ✨ CLAIRE (Finaliste)                 │
│  │  Abstract Generator     │      Polish + Format DEC + Abstract       │
│  │  Citation Verifier      │                                           │
│  └─────────────────────────┘                                           │
│                                                                         │
│  ┌─ (NOUVEAU) ─────────────┐                                           │
│  │  Aucun équivalent       │  →  📋 ÉMILE (Conformité DEC)             │
│  │  dans OpenDraft         │      Notice + Critères Jury + Posture EC  │
│  └─────────────────────────┘                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

2️⃣ Définition Détaillée des 6 Agents
🔍 SOPHIE — Agent Chercheuse
yamlAgent: SOPHIE
Role: Chercheuse Académique & Synthèse
Hérite de: Scout + Scribe + Signal + Citation Manager (OpenDraft)

Responsabilités:
  - Analyser le besoin de recherche pour chaque section
  - Générer des requêtes de recherche optimisées
  - Collecter sources académiques + professionnelles EC
  - Créer des fiches de lecture structurées
  - Vérifier et valider les citations (4-tier fallback)
  - Stocker les sources validées dans la mémoire

Outils:
  - web_search (Cairn, HAL, Google Scholar)
  - web_fetch (lecture articles)
  - read_docs (PDFs mémoire)
  - memory_write (Mem0)

Sources prioritaires:
  - Cairn.info (articles francophones EC)
  - HAL (thèses et mémoires)
  - Semantic Scholar (200M+ papers)
  - Revue Française de Comptabilité
  - CSOEC publications

Output:
  - Fiches de lecture structurées
  - Citations vérifiées avec DOI/URL
  - Synthèse thématique
  - Recommandations de sources manquantes

Mémoire persistante:
  - Sources déjà utilisées (éviter doublons)
  - Auteurs clés du domaine KM
  - Patterns de citation réussis

🏗️ LÉO — Agent Orchestrateur
yamlAgent: LÉO
Role: Orchestrateur & Architecte de Contenu
Hérite de: Architect + Formatter + Compose (OpenDraft)

Responsabilités:
  - Analyser le plan V3 et la notice DEC
  - Décomposer chaque section en sous-tâches
  - Assigner les tâches aux autres agents
  - Gérer les transitions entre phases
  - Assurer la cohérence globale du mémoire
  - Décider quand une section est "terminée"

Workflow de décision:
  1. Charger contexte section (plan, objectifs)
  2. Vérifier prérequis (sections précédentes)
  3. Lancer SOPHIE si recherche nécessaire
  4. Lancer MARC pour rédaction
  5. Lancer VICTOR pour critique
  6. Boucle amélioration si score < seuil
  7. Lancer CLAIRE pour finalisation
  8. Lancer ÉMILE pour conformité DEC
  9. Valider et passer à section suivante

Critères de passage:
  - Score qualité Victor ≥ 8/10
  - Conformité DEC Émile ≥ 8/10
  - Cohérence avec sections précédentes ✓
  - Citations vérifiées ✓

Mémoire persistante:
  - État d'avancement global
  - Fil argumentatif du mémoire
  - Décisions d'architecture prises
  - Patterns de structure réussis

✍️ MARC — Agent Rédacteur
yamlAgent: MARC
Role: Rédacteur Académique Expert
Hérite de: Crafter + Thread + Narrator + Voice (OpenDraft)

Responsabilités:
  - Rédiger le contenu de chaque section
  - Intégrer les citations de SOPHIE
  - Assurer la cohérence intra-section
  - Maintenir le ton académique français
  - Respecter la posture Expert-Comptable
  - Adapter le style au type de section

Styles par section:
  - Introduction: Accroche + contextualisation
  - Revue littérature: Synthèse critique
  - Méthodologie: Précision technique
  - Résultats: Objectivité + données
  - Discussion: Analyse + nuance
  - Conclusion: Synthèse + ouverture

Contraintes rédactionnelles:
  - Phrases < 30 mots (clarté)
  - Paragraphes cohérents (1 idée = 1 paragraphe)
  - Transitions explicites entre parties
  - Vocabulaire académique sans jargon excessif
  - Citations intégrées naturellement

Output:
  - Draft de section en markdown
  - Liste des citations utilisées
  - Suggestions de visuels/tableaux
  - Points d'attention pour Victor

Mémoire persistante:
  - Vocabulaire/glossaire du mémoire
  - Définitions déjà posées
  - Style validé par Victor
  - Formulations réussies

👨‍⚖️ VICTOR — Agent Critique
yamlAgent: VICTOR
Role: Critique & Simulation Jury DEC
Hérite de: Skeptic + Verifier + Referee + Entropy (OpenDraft)

Responsabilités:
  - Évaluer chaque section selon grille DEC
  - Identifier les faiblesses argumentatives
  - Vérifier l'exactitude des affirmations
  - Simuler les questions du jury
  - Scorer la qualité (0-10)
  - Proposer des améliorations concrètes

Grille d'évaluation (10 critères):
  1. Clarté de l'argumentation (0-10)
  2. Pertinence des sources (0-10)
  3. Qualité des citations (0-10)
  4. Cohérence avec plan (0-10)
  5. Valeur ajoutée EC (0-10)
  6. Originalité/apport (0-10)
  7. Qualité rédactionnelle (0-10)
  8. Respect format DEC (0-10)
  9. Faisabilité recommandations (0-10)
  10. Préparation soutenance (0-10)

Simulation jury:
  - 3 questions probables par section
  - Points de vigilance
  - Objections potentielles
  - Éléments à renforcer

Output:
  - Score global (moyenne pondérée)
  - Points forts (à conserver)
  - Points faibles (à améliorer)
  - Recommandations priorisées
  - Questions jury simulées

Seuils de validation:
  - Score < 6 : Réécriture complète
  - Score 6-7 : Amélioration majeure
  - Score 7-8 : Amélioration mineure
  - Score ≥ 8 : Validation OK

Mémoire persistante:
  - Patterns d'erreurs fréquentes
  - Améliorations qui ont fonctionné
  - Critères jury les plus exigeants

✨ CLAIRE — Agent Finaliste
yamlAgent: CLAIRE
Role: Finalisation & Mise en Forme
Hérite de: Polish + Enhancer + Abstract Generator (OpenDraft)

Responsabilités:
  - Finaliser le texte après validation Victor
  - Uniformiser le style sur tout le mémoire
  - Générer les éléments annexes (abstract, sommaire)
  - Vérifier la cohérence typographique
  - Préparer les exports (PDF, DOCX, LaTeX)

Tâches de finalisation:
  - Relecture orthographique/grammaticale
  - Cohérence des temps verbaux
  - Uniformisation des abréviations
  - Vérification des références croisées
  - Numérotation des figures/tableaux
  - Formatage bibliographie

Génération automatique:
  - Abstract (français + anglais)
  - Sommaire détaillé
  - Liste des figures
  - Liste des tableaux
  - Glossaire
  - Index des auteurs cités

Output:
  - Document finalisé en markdown
  - Fichiers export (PDF, DOCX)
  - Check-list de conformité
  - Statistiques du document

Mémoire persistante:
  - Style typographique validé
  - Conventions adoptées
  - Templates réutilisables

📋 ÉMILE — Agent Conformité DEC (NOUVEAU)
yamlAgent: ÉMILE
Role: Expert Conformité DEC & Posture EC
Aucun équivalent dans OpenDraft (agent custom)

Responsabilités:
  - Vérifier la conformité avec la notice DEC
  - Assurer la posture Expert-Comptable
  - Valider l'ancrage professionnel
  - Checker les critères du jury
  - Garantir l'applicabilité cabinet

Connaissances intégrées:
  - Notice DEC 12/05/2024 (complète)
  - Critères d'évaluation jury
  - Exemples mémoires 16-20/20
  - Attentes CSOEC
  - Déontologie EC

Vérifications spécifiques:
  1. Lien sujet ↔ exercice professionnel EC
  2. Apport pour la profession
  3. Faisabilité des recommandations
  4. Positionnement personnel de l'auteur
  5. Qualité de la problématique
  6. Pertinence de la méthodologie
  7. Valeur ajoutée des annexes
  8. Préparation orale

Questions de contrôle:
  - "En quoi ce mémoire aide-t-il un EC dans sa pratique ?"
  - "Quelle est la valeur ajoutée pour un cabinet ?"
  - "Les recommandations sont-elles applicables demain ?"
  - "L'auteur démontre-t-il sa compétence d'EC ?"

Output:
  - Score conformité DEC (0-10)
  - Points de non-conformité
  - Suggestions de renforcement
  - Éléments différenciants à valoriser

Mémoire persistante:
  - Éléments validés comme "conformes DEC"
  - Patterns de valeur ajoutée EC
  - Formulations approuvées notice
```

---

## 3️⃣ Workflow Complet avec Mémoire Persistante
```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WORKFLOW MÉMOIRE DEC                                 │
│                    Avec Mémoire Persistante (Mem0)                      │
└─────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────┐
                         │  INITIALISATION │
                         │  - Plan V3      │
                         │  - Notice DEC   │
                         │  - Sources base │
                         └────────┬────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  PHASE 0 : CHARGEMENT MÉMOIRE                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Mem0.load()                                                     │  │
│  │  - Contexte sections précédentes                                 │  │
│  │  - Sources déjà utilisées                                        │  │
│  │  - Définitions/glossaire                                         │  │
│  │  - Patterns réussis                                              │  │
│  │  - Fil argumentatif global                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  POUR CHAQUE SECTION DU PLAN :                                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PHASE 1 : PLANIFICATION (LÉO)                         ~2 min   │   │
│  │  ├── Analyser objectifs section                                 │   │
│  │  ├── Identifier besoins recherche                               │   │
│  │  ├── Vérifier prérequis (sections précédentes)                  │   │
│  │  └── Créer plan de travail section                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                                  ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PHASE 2 : RECHERCHE (SOPHIE)                          ~5 min   │   │
│  │  ├── Générer requêtes optimisées                                │   │
│  │  ├── Collecter sources (web_search, read_docs)                  │   │
│  │  ├── Créer fiches de lecture                                    │   │
│  │  ├── Vérifier citations (4-tier fallback)                       │   │
│  │  └── Stocker dans mémoire mid-term                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                                  ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PHASE 3 : RÉDACTION (MARC)                            ~8 min   │   │
│  │  ├── Charger contexte + sources SOPHIE                          │   │
│  │  ├── Rédiger draft section                                      │   │
│  │  ├── Intégrer citations                                         │   │
│  │  ├── Assurer cohérence avec sections précédentes                │   │
│  │  └── Générer draft V1                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                                  ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PHASE 4 : CRITIQUE (VICTOR)                           ~3 min   │   │
│  │  ├── Évaluer selon grille 10 critères                           │   │
│  │  ├── Identifier forces/faiblesses                               │   │
│  │  ├── Simuler questions jury                                     │   │
│  │  └── Générer score + recommandations                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                         Score < 8 ?                                     │
│                        /          \                                     │
│                      OUI          NON                                   │
│                       │            │                                    │
│                       ▼            │                                    │
│  ┌────────────────────────────┐   │                                    │
│  │  BOUCLE AMÉLIORATION       │   │                                    │
│  │  (max 3 itérations)        │   │                                    │
│  │  ├── MARC révise           │   │                                    │
│  │  ├── SOPHIE recherche +    │   │                                    │
│  │  └── VICTOR réévalue       │   │                                    │
│  └────────────┬───────────────┘   │                                    │
│               │                   │                                    │
│               └───────────────────┤                                    │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PHASE 5 : CONFORMITÉ DEC (ÉMILE)                      ~2 min   │   │
│  │  ├── Vérifier alignement notice                                 │   │
│  │  ├── Valider posture EC                                         │   │
│  │  ├── Checker valeur ajoutée profession                          │   │
│  │  └── Générer score conformité                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                       Score < 8 ?                                       │
│                        /          \                                     │
│                      OUI          NON                                   │
│                       │            │                                    │
│                       ▼            │                                    │
│  ┌────────────────────────────┐   │                                    │
│  │  AJUSTEMENT CONFORMITÉ     │   │                                    │
│  │  MARC + ÉMILE collaborent  │   │                                    │
│  └────────────┬───────────────┘   │                                    │
│               │                   │                                    │
│               └───────────────────┤                                    │
│                                   │                                    │
│                                   ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PHASE 6 : FINALISATION (CLAIRE)                       ~2 min   │   │
│  │  ├── Polish final                                               │   │
│  │  ├── Uniformiser style                                          │   │
│  │  └── Préparer export                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                                  ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  PHASE 7 : CONSOLIDATION MÉMOIRE (LÉO)                 ~1 min   │   │
│  │  ├── Sauvegarder section validée                                │   │
│  │  ├── Mettre à jour fil argumentatif                             │   │
│  │  ├── Mémoriser patterns réussis                                 │   │
│  │  ├── Consolider sources utilisées                               │   │
│  │  └── Préparer contexte section suivante                         │   │
│  │                                                                 │   │
│  │  Mem0.save({                                                    │   │
│  │    section_content: "...",                                      │   │
│  │    sources_used: [...],                                         │   │
│  │    patterns_success: [...],                                     │   │
│  │    argument_thread: "...",                                      │   │
│  │    scores: {victor: 8.5, emile: 8.2}                           │   │
│  │  })                                                             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                  │                                      │
│                                  ▼                                      │
│                    SECTION SUIVANTE...                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

                         TEMPS ESTIMÉ PAR SECTION
                    ┌─────────────────────────────┐
                    │  Phase 1 (LÉO)    :  2 min  │
                    │  Phase 2 (SOPHIE) :  5 min  │
                    │  Phase 3 (MARC)   :  8 min  │
                    │  Phase 4 (VICTOR) :  3 min  │
                    │  Phase 5 (ÉMILE)  :  2 min  │
                    │  Phase 6 (CLAIRE) :  2 min  │
                    │  Phase 7 (LÉO)    :  1 min  │
                    ├─────────────────────────────┤
                    │  TOTAL/SECTION   : ~23 min  │
                    │  + Boucles       : +5-10 min│
                    └─────────────────────────────┘

                    Pour un mémoire de ~15 sections :
                    15 × 30 min = ~7.5 heures de génération
                    (vs 200-400 heures manuelles)

4️⃣ Structure de la Mémoire Persistante (Mem0)
yamlMemory Structure:
  
  short_term: # Effacée fin session
    current_section: "2.1.3"
    working_draft: "..."
    temp_sources: [...]
    
  mid_term: # Sessions récentes
    recent_sources:
      - paper: "Nonaka 1995"
        used_in: ["1.2", "2.1"]
        citation_key: "nonaka1995"
    recent_patterns:
      - pattern: "Accroche chiffrée en intro"
        score_victor: 9
        
  long_term: # Permanent
    argument_thread:
      - section: "1.1"
        key_claim: "Le KM est un enjeu stratégique pour les EC"
        supports: "2.1, 3.2"
      - section: "2.1"
        key_claim: "Design Thinking améliore adoption KM"
        depends_on: "1.1"
        
    glossary:
      - term: "Knowledge Management"
        definition: "Ensemble des processus..."
        defined_in: "1.1"
        
    sources_master:
      - id: "nonaka1995"
        title: "The Knowledge-Creating Company"
        authors: ["Nonaka", "Takeuchi"]
        year: 1995
        used_count: 5
        sections: ["1.1", "1.2", "2.1", "3.1", "4.2"]
        
    patterns_validated:
      - type: "intro_section"
        template: "Accroche → Contexte → Problème → Annonce plan"
        score_avg: 8.7
      - type: "citation_integration"
        template: "Selon [Auteur] (année), [claim] (p.X)"
        score_avg: 8.9
        
    dec_compliance:
      - criterion: "Ancrage professionnel"
        validated_in: ["1.1", "3.2", "5.1"]
        score: 8.5
      - criterion: "Valeur ajoutée EC"
        validated_in: ["4.1", "5.2"]
        score: 8.2

5️⃣ Prochaine Étape : Création des Prompts
Tu veux que je crée les prompts système détaillés pour chaque agent ?
Je peux générer :

Prompt SOPHIE (Chercheuse) — avec instructions de recherche académique
Prompt LÉO (Orchestrateur) — avec logique de décision et coordination
Prompt MARC (Rédacteur) — avec style académique et consignes DEC
Prompt VICTOR (Critique) — avec grille d'évaluation détaillée
Prompt CLAIRE (Finaliste) — avec check-list de finalisation
Prompt ÉMILE (Conformité DEC) — avec critères notice et jury

Confirme et je génère les 6 prompts complets !ces agents sont issues du git?13:26Non, tu as raison de challenger ! Laisse-moi clarifier :

🔍 Analyse Critique : D'où viennent ces agents ?
Ce qui vient VRAIMENT d'OpenDraft (GitHub) :
Les 19 agents OpenDraft sont réels et documentés :
Agent OpenDraftRôle documentéSourceScoutResearch planning✅ GitHub READMEScribeLiterature review✅ GitHub READMESignalCitation discovery✅ GitHub READMEArchitectStructure design✅ GitHub READMEFormatterAcademic formatting✅ GitHub READMECrafterSection writing✅ GitHub READMEThreadCoherence checking✅ GitHub READMENarratorStyle refinement✅ GitHub READMESkepticFact verification✅ GitHub READMEVerifierCitation validation✅ GitHub READMERefereePeer review simulation✅ GitHub READMEVoiceTone optimization✅ GitHub READMEEntropyOriginality scoring✅ GitHub READMEPolishFinal editing✅ GitHub READMEEnhancerPublication polish✅ GitHub README+ 4 autres(Citation Manager, Compose, Abstract Generator, Citation Verifier)✅ Site opendraft.xyz

Ce que J'AI CRÉÉ (pas dans le Git) :
Les 6 agents "SOPHIE, LÉO, MARC, VICTOR, CLAIRE, ÉMILE" sont ma proposition de consolidation — ils n'existent PAS dans OpenDraft.
J'ai :

Analysé les 19 agents OpenDraft
Regroupé par fonction similaire
Renommé avec des noms français
Ajouté un agent custom (ÉMILE) pour la conformité DEC
Inventé la structure mémoire Mem0 intégrée


⚠️ Ce qu'on devrait faire maintenant
Option A : Aller voir le vrai code source d'OpenDraft pour comprendre comment leurs agents sont implémentés (prompts, logique, orchestration)
Option B : Utiliser OpenDraft tel quel et l'adapter pour le DEC
Option C : S'inspirer de l'architecture mais créer nos propres agents from scratch
Tu préfères quelle approche ? Je peux aller chercher le code réel des agents dans le repo si tu veux voir comment ils fonctionnent vraiment.