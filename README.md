# Mémoire DEC — Knowledge Management Innovant

> **Titre** : Le Knowledge Management innovant au service de la performance des cabinets d'expertise comptable : proposition d'un guide
>
> **Auteur** : ASSOR Alexandre | **Session** : Novembre 2024

---

## 🆕 PuzzlApp Brain — Outil d'Écriture

Un outil d'écriture assisté par IA est en cours de développement pour optimiser la rédaction du mémoire.

### Stack Technique

| Technologie | Usage |
|-------------|-------|
| React + TypeScript | Framework |
| TipTap | Éditeur riche Markdown |
| Shadcn UI + Tailwind | Interface |
| Zustand | Gestion d'état |
| Vite | Build |

### Architecture 3 Couches (inspiré Novel-OS)

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARDS (invariant)                                      │
│  └── Ton académique, structure DEC, normes citations        │
├─────────────────────────────────────────────────────────────┤
│  PROJET (spécifique mémoire)                                │
│  └── Plan, 42 sources, décisions, configs agents            │
├─────────────────────────────────────────────────────────────┤
│  SESSION (éphémère)                                         │
│  └── Section en cours, avancement, notes                    │
└─────────────────────────────────────────────────────────────┘
```

### Fichiers

| Fichier | Rôle |
|---------|------|
| `CLAUDE.md` | Contexte pour Claude Code |
| `CLAUDE_TASKS.md` | Tâches de développement |

> Voir `CLAUDE_TASKS.md` pour les instructions complètes.

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

---

## Structure du Projet

> Voir [`STRUCTURE.md`](STRUCTURE.md) pour la documentation technique complète.

```
DEC-KM/
│
├── README.md                      # Ce fichier
├── STRUCTURE.md                   # Structure & conventions
├── CLAUDE.md                      # 🆕 Contexte pour Claude Code
├── CLAUDE_TASKS.md                # 🆕 Tâches développement
│
├── .claude/
│   └── agents/                    # Agents Claude Code
│       ├── redacteur.md           # Victor — Rédacteur mémoire DEC
│       ├── architecte.md          # Jules — Architecte outils & UX
│       ├── leo.md                 # Léo — Orchestrateur KM
│       ├── sophie.md              # Sophie — Spécialiste Avant-Vente
│       └── marc.md                # Marc — Spécialiste Onboarding
│
└── docs/
    ├── IDEES_VRAC.md              # Idées en vrac à organiser
    │
    ├── agents/                    # Base de connaissances agents
    ├── frameworks/                # Fichiers Excel KM 360°
    │   └── Framework_KM_360_V5.xlsx  # ⭐ Version active
    ├── guides/                    # Documentation & guides
    ├── jeux/                      # Jeux Design Thinking
    ├── memoire/                   # Mémoire DEC
    │   ├── MEMOIRE_KM_360_COMPLET.md   # ⭐ Version finale
    │   ├── MEMOIRE_MASTER_V1.md        # Plan révisé
    │   └── NOTE_LIMINAIRE.md           # Justification jury
    ├── processus/                 # Process books
    ├── sources/                   # Bibliographie & PDF sources
    │   └── BASE_CONNAISSANCES.md      # 42 sources indexées
    ├── templates/                 # Templates réutilisables
    └── _archive/                  # Anciennes versions (ignoré)
```

---

## Fichiers Clés

| Fichier | Rôle | Version |
|---------|------|:-------:|
| `CLAUDE.md` | Contexte projet pour Claude Code | 🆕 v1.0 |
| `CLAUDE_TASKS.md` | Tâches de développement | 🆕 v1.0 |
| `docs/memoire/MEMOIRE_KM_360_COMPLET.md` | **Mémoire complet** | ⭐ |
| `docs/memoire/MEMOIRE_MASTER_V1.md` | Plan détaillé (100 pages, 10 chapitres) | v1.0 |
| `docs/memoire/NOTE_LIMINAIRE.md` | Justification évolutions jury | v1.0 |
| `docs/frameworks/Framework_KM_360_V5.xlsx` | Framework Excel 40 onglets | V5 |
| `docs/sources/BASE_CONNAISSANCES.md` | Sources bibliographiques | v1.0 |

---

## Agents Claude Code

| Agent | Rôle | Fichier |
|-------|------|---------|
| **Victor** | Rédacteur du mémoire DEC | `.claude/agents/redacteur.md` |
| **Jules** | Architecte outils & expérience UX | `.claude/agents/architecte.md` |
| **Léo** | Orchestrateur KM, stratégie, SECI | `.claude/agents/leo.md` |
| **Sophie** | Spécialiste Avant-Vente | `.claude/agents/sophie.md` |
| **Marc** | Spécialiste Onboarding | `.claude/agents/marc.md` |

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

### Consultation des agents spécialisés

| Sujet | Agent à consulter |
|-------|-------------------|
| KM général, SECI, Crash Test, stratégie | **Léo** |
| Commercial, proposition de valeur, objections | **Sophie** |
| Onboarding, accueil client, mise en production | **Marc** |

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

*Dernière mise à jour : 16 janvier 2026*
