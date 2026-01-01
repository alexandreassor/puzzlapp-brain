# Architecture du Projet KM 360°

> Documentation technique de l'organisation du projet

---

## Vue d'ensemble

Ce projet contient l'ensemble des ressources pour la rédaction du mémoire DEC sur le Knowledge Management innovant pour les cabinets d'expertise comptable.

---

## Arborescence Détaillée

### Racine `/`

| Fichier | Description |
|---------|-------------|
| `MEMOIRE_MASTER.md` | **Source of truth** — Plan détaillé fidèle à la notice du 12/05/2024 avec parcours lecteur |
| `README.md` | Documentation principale du projet |

---

### `/docs/agents/` — Agents IA

Système d'agents conversationnels pour accompagner les utilisateurs.

```
agents/
├── leo/                          # Agent orchestrateur
│   ├── SKILL.md                  # Définition des capacités
│   ├── assets/
│   │   └── note-cadrage.md       # Template note de cadrage
│   └── references/               # Base de connaissances
│       ├── contexte-cabinet.md
│       ├── fondamentaux.md
│       ├── freins-leviers.md
│       ├── livre-blanc-ourouk.md
│       ├── mission-framework.md
│       ├── mode-mission.md
│       └── design-thinking/      # Phases du Design Thinking
│           ├── phase-understand.md
│           ├── phase-observe.md
│           ├── phase-define.md
│           ├── phase-ideate.md
│           ├── phase-prototype.md
│           ├── phase-test.md
│           ├── phase-reflect.md
│           └── tools-by-phase.md
│
└── parcours/                     # Agents spécialisés
    ├── avant-vente/
    │   └── sophie.md             # Expert parcours avant-vente
    └── onboarding/
        └── marc.md               # Expert parcours onboarding
```

#### Hiérarchie des agents

```
                    ┌─────────┐
                    │   LÉO   │  Orchestrateur
                    └────┬────┘
                         │
           ┌─────────────┼─────────────┐
           │                           │
     ┌─────┴─────┐               ┌─────┴─────┐
     │  SOPHIE   │               │   MARC    │
     │ Avant-Vente│               │ Onboarding │
     └───────────┘               └───────────┘
```

---

### `/docs/frameworks/` — Fichiers Excel

Framework KM 360° avec 40 onglets structurants.

| Fichier | Version | Statut |
|---------|:-------:|:------:|
| `Framework_KM_360_V5.xlsx` | V5 | ⭐ Actuel |
| `Framework_KM_360_V4_Guide_Complet.xlsx` | V4 | Archive |
| `Framework_KM_360_V3_Complet.xlsx` | V3 | Archive |
| `Framework_KM_360_V2_Final.xlsx` | V2 | Archive |
| `Framework_KM_360_V2_Processus.xlsx` | V2 | Archive |
| `Framework_KM_360_Complet.xlsx` | V1 | Archive |
| `Connaissance_Client_360_KM_v2.xlsx` | V2 | Spécialisé |
| `Connaissance_Client_360_KM.xlsx` | V1 | Archive |
| `Connaissance_Client_360_Framework_KM.xlsx` | V1 | Archive |

---

### `/docs/guides/` — Documentation

Guides académiques et techniques.

| Fichier | Version | Contenu |
|---------|:-------:|---------|
| `Guide_KM_360_Academique_V2.md` | V2 | ⭐ Guide académique complet |
| `Guide_KM_360_Academique.md` | V1 | Archive |
| `Documentation_Projet_KM360_V3.md` | V3 | Doc technique |
| `Documentation_Projet_KM360.md` | V1 | Archive |
| `Architecture_Technique_Supabase_React.md` | - | Spec technique app |

---

### `/docs/jeux/` — Jeux Design Thinking

Bibliothèque de jeux pour les ateliers collaboratifs.

| Fichier | Code | Thème |
|---------|------|-------|
| `JEU-001b_Proposition_Valeur.md` | JEU-001b | Proposition de valeur |
| `JEU-001b_PUZZL_Session.md` | JEU-001b | Session Puzzl |
| `JEU-004b_Carte_Offres.md` | JEU-004b | Carte des offres |
| `JEU-015b_Formalisation_Processus.md` | JEU-015b | Formalisation processus |
| `JEUX_AVANT_VENTE_COMPLET.md` | - | Compilation avant-vente |

#### Convention de nommage des jeux

```
JEU-XXXy_Nom_Du_Jeu.md

XXX = Numéro du jeu (001-048)
y   = Variante (a, b, c...)
```

---

### `/docs/memoire/` — Versions du Mémoire

Historique des versions et documents de référence.

```
memoire/
├── notice/                       # Documents officiels
│   └── ASSOR Alexandre notice du 12-05-2024 (1).pdf
│
├── PLAN_MEMOIRE_V3.md           # ⭐ Plan restructuré actuel
├── PLAN_MEMOIRE_V2.md           # Archive
│
├── MEMOIRE_KM_360_COMPLET.md    # Version complète
├── MEMOIRE_KM_360_V2.md         # Archive
├── MEMOIRE_KM_360_V1.md         # Archive
│
├── CORRESPONDANCE_Notice_Memoire.md  # Mapping notice → mémoire
└── ARCHITECTURE_NARRATIVE_MEMOIRE.md # Structure narrative
```

---

### `/docs/processus/` — Process Books

Documentation des processus métier.

| Fichier | Contenu |
|---------|---------|
| `PROCESS_BOOK_Avant_Vente.md` | Process book du parcours avant-vente |
| `PARCOURS_DD_Avant_Vente.md` | Parcours Double Diamant avant-vente |
| `AGENT_SOPHIE_AVANT_VENTE.md` | Spécification agent Sophie |

---

## Les 5 Piliers du Framework

Le Framework KM 360° s'articule autour de 5 piliers :

```
┌─────────────────────────────────────────────────────────┐
│                    FRAMEWORK KM 360°                     │
├───────────┬───────────┬───────────┬───────────┬─────────┤
│  CLIENTS  │COMPÉTENCES│COLLABORA- │ PROCESSUS │CONTENUS │
│           │           │   TEURS   │           │         │
├───────────┼───────────┼───────────┼───────────┼─────────┤
│Dictionnaire│Référentiel│Cartographie│Référentiel│Typologie│
│Profils    │130 compét.│Risques    │Étapes     │Flux     │
│Cycle vie  │Matrice    │départ     │RACI, KPIs │Prompts  │
└───────────┴───────────┴───────────┴───────────┴─────────┘
```

---

## Vues Croisées 360°

Le framework génère 3 vues transversales :

| Vue | Croisement | Valeur |
|-----|------------|--------|
| **Client 360°** | Client × Compétences × Processus × Contenus | Vision complète du client |
| **Collaborateur 360°** | Collaborateur × Compétences × Clients × Processus | Profil complet du collaborateur |
| **Processus 360°** | Processus × Compétences × Contenus × Collaborateurs | Documentation exhaustive |

---

## Conventions de Fichiers

### Nommage

- `MAJUSCULES` : Fichiers principaux (MEMOIRE, README, PLAN)
- `PascalCase` : Guides et documentations
- `kebab-case` : Fichiers de référence agents

### Versioning

- `V1`, `V2`, `V3` : Versions majeures
- `v0.1`, `v0.2` : Versions mineures (dans CHANGELOG)
- Fichier sans version = version unique

### Statuts

| Icône | Signification |
|:-----:|---------------|
| ⭐ | Version actuelle recommandée |
| Archive | Conservé pour historique |

---

## Flux de Travail

```
Notice PDF (12/05/2024)
        │
        ▼
MEMOIRE_MASTER.md ◄──── Source of truth
        │
        ├──► docs/memoire/PLAN_*.md (versions restructurées)
        │
        ├──► docs/frameworks/*.xlsx (outils opérationnels)
        │
        ├──► docs/jeux/*.md (ateliers Design Thinking)
        │
        └──► docs/agents/*.md (assistants IA)
```

---

## Fichiers à Maintenir

### Priorité haute
1. `MEMOIRE_MASTER.md` — Toute modification de structure
2. `README.md` — Toute nouvelle fonctionnalité
3. `docs/frameworks/Framework_KM_360_V5.xlsx` — Framework opérationnel

### Priorité moyenne
4. `docs/memoire/PLAN_MEMOIRE_V3.md` — Plan restructuré
5. `docs/agents/leo/SKILL.md` — Évolutions de Léo

---

*Document technique — Version 1.0 — Janvier 2026*
