# Mémoire DEC — Knowledge Management Innovant

> **Titre** : Le Knowledge Management innovant au service de la performance des cabinets d'expertise comptable : proposition d'un guide
>
> **Auteur** : ASSOR Alexandre | **Session** : Novembre 2024

---

## Problématique

> *Comment concevoir et déployer une stratégie de knowledge management augmenté pour accroître durablement la performance des cabinets d'expertise comptable ?*

---

## Vision du Projet

### Ce qui rend ce mémoire unique

Ce mémoire n'est pas un document académique classique. C'est un **système vivant** :

```
┌─────────────────────────────────────────────────────────────────┐
│                     MÉMOIRE (lecture générale)                  │
│              Théorie KM + Méthodologie + Cas Puzzl              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │    JEUX     │ │   AGENTS    │ │  PLATEFORME │
    │Design Think │ │  IA (Léo)   │ │ Notion/App  │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           └───────────────┼───────────────┘
                           ▼
            ┌─────────────────────────────┐
            │  EXPÉRIENCE PERSONNALISÉE   │
            │      pour MON cabinet       │
            └─────────────────────────────┘
```

**Le lecteur** (dirigeant de cabinet) lit un mémoire général, mais vit une **expérience personnalisée** grâce aux jeux Design Thinking, aux interactions avec les agents IA, et aux outils qu'il configure pour son cabinet.

### Évolution du plan (Notice → V1)

Le plan a évolué depuis la notice du 12/05/2024 :

| Notice originale | Plan V1 révisé | Pourquoi |
|------------------|----------------|----------|
| Structure académique classique | Structure Double Diamant | Plus actionnable |
| Théorie avant pratique | Immersion Avant-Vente dès Partie II | Apprentissage par l'exemple |
| Parcours en annexe | Parcours au cœur | Le lecteur choisit son parcours |

> La **Note Liminaire** (`docs/memoire/NOTE_LIMINAIRE.md`) justifie ces évolutions pour le jury.

### Méthodologie des sources

Victor (le rédacteur) n'est pas un compilateur de citations. Il **s'imprègne** des auteurs :

1. **Analyse source** → Fiche de lecture détaillée
2. **Extraction** → Concepts, citations, données chiffrées
3. **Double Mapping** → Vers plan V1 ET notice originale (traçabilité jury)
4. **Enrichissement** → `docs/sources/BASE_CONNAISSANCES.md`

La **Base de Connaissances** synthétise ce que Victor a "appris" pour écrire avec l'expertise des auteurs, pas juste les citer mécaniquement.

### Fichiers de contexte essentiels

Pour comprendre le projet en profondeur :

| Fichier | Ce qu'il apporte |
|---------|------------------|
| `docs/sources/BASE_CONNAISSANCES.md` | Expertise intégrée des sources |
| `docs/memoire/NOTE_LIMINAIRE.md` | Justification des évolutions |
| `docs/sources/BIBLIOGRAPHIE_COMPLETE.md` | 42 sources référencées |
| `.claude/agents/*.md` | Définition complète des agents |

---

## Structure du Projet

```
m-moire-KM/
│
├── MEMOIRE_MASTER.md              # Plan original (notice 12/05/2024)
├── IDEES_VRAC.md                  # ⭐ Idées en vrac à organiser
├── README.md                      # Ce fichier
│
├── .claude/
│   └── agents/                    # ⭐ Agents Claude Code
│       ├── redacteur.md           # Victor — Rédacteur mémoire DEC
│       ├── architecte.md          # Jules — Architecte outils & UX
│       ├── leo.md                 # Léo — Orchestrateur KM
│       ├── sophie.md              # Sophie — Spécialiste Avant-Vente
│       └── marc.md                # Marc — Spécialiste Onboarding
│
└── docs/
    ├── agents/                    # Base de connaissances agents
    │   ├── leo/                   # Références Léo
    │   │   ├── SKILL.md           # Définition skill
    │   │   ├── assets/            # Templates
    │   │   └── references/        # Base de connaissances
    │   ├── parcours/              # Agents spécialisés
    │   │   ├── avant-vente/sophie.md
    │   │   └── onboarding/marc.md
    │   └── redacteur/SKILL.md     # Documentation rédacteur
    │
    ├── frameworks/                # Fichiers Excel KM 360°
    │   └── Framework_KM_360_V5.xlsx
    │
    ├── guides/                    # Documentation académique
    │   └── Guide_KM_360_Academique_V2.md
    │
    ├── jeux/                      # Jeux Design Thinking
    │   └── JEUX_AVANT_VENTE_COMPLET.md
    │
    ├── memoire/                   # Versions du mémoire
    │   ├── notice/                # Notice originale PDF
    │   ├── MEMOIRE_MASTER_V1.md   # ⭐ Plan révisé v1.0
    │   ├── NOTE_LIMINAIRE.md      # ⭐ Justification jury
    │   └── CORRESPONDANCE_*.md    # Mapping notice → mémoire
    │
    ├── templates/                 # Templates lecteur
    │   └── NOTION_TEMPLATE_KM360.md
    │
    └── processus/                 # Process books
        └── PROCESS_BOOK_Avant_Vente.md
```

---

## Fichiers Clés

| Fichier | Rôle | Version |
|---------|------|:-------:|
| `IDEES_VRAC.md` | **Idées en vrac** — déposez vos notes, Victor les organisera | v1.0 |
| `docs/memoire/MEMOIRE_MASTER_V1.md` | Plan détaillé révisé (100 pages, 10 chapitres) | v1.0 |
| `docs/memoire/NOTE_LIMINAIRE.md` | Justification des évolutions pour le jury | v1.0 |
| `MEMOIRE_MASTER.md` | Plan original fidèle à la notice | v0.2 |
| `docs/frameworks/Framework_KM_360_V5.xlsx` | Framework Excel 40 onglets | V5 |
| `docs/templates/NOTION_TEMPLATE_KM360.md` | Carnet de bord lecteur (42 actions) | v1.0 |

---

## Contribuer des Idées

Le fichier [`IDEES_VRAC.md`](IDEES_VRAC.md) est votre **bloc-notes personnel** pour le projet.

### Comment l'utiliser

1. **Ouvrez le fichier** et ajoutez vos idées dans la section appropriée
2. **Format libre** : phrases, mots-clés, liens, citations — tout est accepté
3. **Demandez à Victor** : *"Organise mes idées en vrac"*
4. **Victor intègre** chaque idée au bon endroit dans le projet

### Thèmes disponibles

- Mémoire (contenu, arguments)
- Agents IA (comportements, nouvelles fonctionnalités)
- Jeux Design Thinking
- Framework KM 360°
- Sources & Références
- Application / Outils
- Cabinet Puzzl (cas fil rouge)
- Méthodologie
- Non classé (si vous ne savez pas où mettre)

---

## Agents Claude Code

Le projet intègre un système d'agents IA sous **Claude Opus 4.5** pour accompagner la rédaction du mémoire.

### Installation

Les agents sont situés dans `.claude/agents/` et sont automatiquement reconnus par Claude Code.

### Agents disponibles

| Agent | Rôle | Modèle | Fichier |
|-------|------|:------:|---------|
| **Victor** | Rédacteur du mémoire DEC | Opus 4.5 | `.claude/agents/redacteur.md` |
| **Jules** | Architecte outils & expérience UX | Opus 4.5 | `.claude/agents/architecte.md` |
| **Léo** | Orchestrateur KM, stratégie, SECI | Opus 4.5 | `.claude/agents/leo.md` |
| **Sophie** | Spécialiste Avant-Vente | Opus 4.5 | `.claude/agents/sophie.md` |
| **Marc** | Spécialiste Onboarding | Opus 4.5 | `.claude/agents/marc.md` |

### Utilisation de Victor (Rédacteur)

L'agent **Victor** est le rédacteur principal du mémoire. Il dispose de 7 modes :

```
1. MODE RÉDACTION    → "Rédige la section 1.2"
2. MODE RECHERCHE    → Recherche web de sources
3. MODE ACQUISITION  → Demande d'achat de documents
4. MODE PLAN         → Affiner une section du plan
5. MODE BIBLIOGRAPHIE → Gérer les sources
6. MODE CONSULTATION → Appeler Léo, Sophie ou Marc
7. MODE ANALYSE      → Analyser une source PDF
```

**Démarrage** :
```
Sur quelle section souhaitez-vous travailler ?

1. Rédiger une section (ex: 1.2 Modèle SECI)
2. Rechercher des sources sur un sujet
3. Affiner le plan d'une partie
4. Voir l'état d'avancement
5. Bibliographie — gérer les sources
6. Consulter un agent (Léo, Sophie, Marc)
7. Analyser une source (PDF dans docs/sources/)
```

### Utilisation de Jules (Architecte)

L'agent **Jules** conçoit et développe les outils du projet KM 360°. Il dispose de 5 modes :

```
1. MODE NOTION       → Templates et espaces Notion
2. MODE REACT NATIVE → Composants et écrans mobile
3. MODE MCP          → Intégrations Model Context Protocol
4. MODE JEUX         → Jeux Design Thinking avec supports
5. MODE DASHBOARD    → Tableaux de bord et visualisations
```

**Architecture cible** :
- Frontend : React Native + Expo
- Backend : Supabase (Auth, Database, Storage)
- IA : Claude API + agents (Léo, Sophie, Marc)
- Intégrations : MCP (Notion, Google, outils métier)

### Consultation des agents spécialisés

Victor peut consulter les autres agents selon les besoins :

| Sujet | Agent à consulter |
|-------|-------------------|
| KM général, SECI, Crash Test, stratégie | **Léo** |
| Commercial, proposition de valeur, objections | **Sophie** |
| Onboarding, accueil client, mise en production | **Marc** |

**Exemple d'utilisation** :
- Pour rédiger le Chapitre 4 (DÉCOUVRIR l'Avant-Vente) → Consulte **Sophie**
- Pour rédiger la section sur le modèle SECI → Consulte **Léo**
- Pour rédiger le Chapitre 8.2 (Onboarding) → Consulte **Marc**

### Outils disponibles par agent

| Agent | Outils |
|-------|--------|
| Victor | Read, Grep, Glob, WebFetch, WebSearch, Write, Edit |
| Jules | Read, Grep, Glob, Write, Edit, WebSearch, WebFetch |
| Léo | Read, Grep, Glob |
| Sophie | Read, Grep, Glob |
| Marc | Read, Grep, Glob |

---

## Méthodologie

### Double Diamant

```
    DÉCOUVRIR          DÉFINIR           DÉVELOPPER          DÉLIVRER
        ◇                 ◇                  ◇                  ◇
       / \               / \                / \                / \
      /   \             /   \              /   \              /   \
     /     \___________/     \____________/     \____________/     \
```

### Crash Test

> *"Si demain toute l'équipe disparaît, une nouvelle équipe peut-elle reprendre sans passation ?"*

Le Crash Test est le fil rouge du mémoire — un objectif concret et mesurable pour évaluer la maturité KM.

---

## Structure du Mémoire (Plan v1.0)

| Partie | Chapitres | Pages | Contenu |
|--------|:---------:|:-----:|---------|
| **Introduction** | - | 5 | Crash Test, Double Diamant, Parcours, Puzzl, Léo |
| **Partie I** | 3 | 20 | Fondations KM + Diagnostic + Choix parcours |
| **Partie II** | 4 | 40 | Vivre l'Avant-Vente (12 jeux DT) |
| **Partie III** | 3 | 30 | Industrialiser les autres parcours |
| **Conclusion** | - | 5 | Vision 2030, Manifeste |
| **TOTAL** | **10** | **100** | |

---

## Cas Fil Rouge : Cabinet Puzzl

- **Structure** : 4 associés, 100 collaborateurs, 4 pôles
- **Pôles** : Expertise comptable, Audit, Social, Juridique
- **Score KMMM initial** : 1.4/5
- **Objectif** : Atteindre 3.2/5 en 6 mois

---

## Pour les Lecteurs : Carnet de Bord

Un **template Notion** est disponible pour suivre votre projet KM :

[`docs/templates/NOTION_TEMPLATE_KM360.md`](docs/templates/NOTION_TEMPLATE_KM360.md)

**Contenu :**
- 42 actions à cocher au fil de la lecture
- Templates à compléter (note de cadrage, RACI, roadmap...)
- Suivi de progression par partie
- Score KMMM et Crash Test

---

## Conventions

### Versioning

- `V1`, `V2`, `V3`... pour les versions majeures
- Le fichier le plus récent est marqué ⭐

### Statuts de rédaction

| Statut | Signification |
|:------:|---------------|
| ❌ | À rédiger |
| 🔄 | En cours |
| ✅ | Rédigé |
| ✔️ | Validé |

---

## Références

- **Notice originale** : `docs/memoire/notice/ASSOR Alexandre notice du 12-05-2024 (1).pdf`
- **Note liminaire** : `docs/memoire/NOTE_LIMINAIRE.md`
- **Correspondance** : `docs/memoire/CORRESPONDANCE_Notice_Memoire.md`

---

*Dernière mise à jour : Janvier 2026*
