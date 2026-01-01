# Mémoire DEC — Knowledge Management Innovant

> **Titre** : Le Knowledge Management innovant au service de la performance des cabinets d'expertise comptable : proposition d'un guide
>
> **Auteur** : ASSOR Alexandre | **Session** : Novembre 2024

---

## Problématique

> *Comment concevoir et déployer une stratégie de knowledge management augmenté pour accroître durablement la performance des cabinets d'expertise comptable ?*

---

## Structure du Projet

```
m-moire-KM/
│
├── MEMOIRE_MASTER.md          # Plan détaillé du mémoire (source of truth)
├── README.md                  # Ce fichier
│
└── docs/
    ├── agents/                # Agents IA (Léo + spécialistes)
    │   ├── leo/               # Orchestrateur principal
    │   │   ├── SKILL.md       # Définition du skill Léo
    │   │   ├── assets/        # Templates (note de cadrage...)
    │   │   └── references/    # Base de connaissances
    │   │       └── design-thinking/  # 7 phases du DT
    │   └── parcours/          # Agents spécialisés par parcours
    │       ├── avant-vente/sophie.md
    │       └── onboarding/marc.md
    │
    ├── frameworks/            # Fichiers Excel KM 360°
    │   └── Framework_KM_360_V5.xlsx  # ⭐ Version actuelle
    │
    ├── guides/                # Documentation académique
    │   └── Guide_KM_360_Academique_V2.md  # ⭐ Version actuelle
    │
    ├── jeux/                  # Jeux Design Thinking
    │   ├── JEU-001b_*.md      # Proposition de valeur
    │   ├── JEU-004b_*.md      # Carte des offres
    │   ├── JEU-015b_*.md      # Formalisation processus
    │   └── JEUX_AVANT_VENTE_COMPLET.md
    │
    ├── memoire/               # Versions du mémoire
    │   ├── notice/            # Notice originale (12/05/2024)
    │   ├── PLAN_MEMOIRE_V3.md # ⭐ Plan restructuré actuel
    │   ├── CORRESPONDANCE_*.md # Mapping notice → mémoire
    │   └── ARCHITECTURE_NARRATIVE_MEMOIRE.md
    │
    ├── templates/             # Templates pour le lecteur
    │   └── NOTION_TEMPLATE_KM360.md  # ⭐ Carnet de bord projet
    │
    └── processus/             # Process books
        ├── PROCESS_BOOK_Avant_Vente.md
        ├── PARCOURS_DD_Avant_Vente.md
        └── AGENT_SOPHIE_AVANT_VENTE.md
```

---

## Fichiers Clés

| Fichier | Rôle | Version |
|---------|------|:-------:|
| `MEMOIRE_MASTER.md` | Plan détaillé fidèle à la notice du 12/05/2024 | v0.2 |
| `docs/frameworks/Framework_KM_360_V5.xlsx` | Framework Excel 40 onglets | V5 |
| `docs/guides/Guide_KM_360_Academique_V2.md` | Guide académique complet | V2 |
| `docs/memoire/PLAN_MEMOIRE_V3.md` | Plan restructuré (9 chapitres) | V3 |
| `docs/templates/NOTION_TEMPLATE_KM360.md` | Carnet de bord lecteur (42 actions) | v1.0 |

---

## Méthodologie

### Double Diamant

```
    DÉCOUVRIR          DÉFINIR           DÉVELOPPER          DÉLIVRER
        ◇                 ◇                  ◇                  ◇
       / \               / \                / \                / \
      /   \             /   \              /   \              /   \
     /     \___________/     \____________/     \____________/     \

    Diagnostic         Stratégie          Écosystème         Déploiement
    (Partie I)         (Partie II.1)      (Partie II.2)      (Partie II.3)
```

### Crash Test

> *"Si demain toute l'équipe disparaît, une nouvelle équipe peut-elle reprendre sans passation ?"*

Le Crash Test est le fil rouge du mémoire — un objectif concret et mesurable pour évaluer la maturité KM.

---

## Agents IA

Le projet intègre un système d'agents IA pour accompagner les utilisateurs :

| Agent | Rôle | Fichier |
|-------|------|---------|
| **Léo** | Orchestrateur principal, guide l'utilisateur | `docs/agents/leo/SKILL.md` |
| **Sophie** | Spécialiste Avant-Vente | `docs/agents/parcours/avant-vente/sophie.md` |
| **Marc** | Spécialiste Onboarding | `docs/agents/parcours/onboarding/marc.md` |

---

## Cas Fil Rouge : Cabinet Puzzl

- **Structure** : 4 associés, 100 collaborateurs, 4 pôles
- **Pôles** : Expertise comptable, Audit, Social, Juridique
- **Score KMMM initial** : 1.4/5
- **Objectif** : Atteindre 3.2/5 en 6 mois

---

## Pour les Lecteurs : Carnet de Bord

Un **template Notion** est disponible pour suivre votre projet KM :

📋 [`docs/templates/NOTION_TEMPLATE_KM360.md`](docs/templates/NOTION_TEMPLATE_KM360.md)

**Contenu :**
- 42 actions à cocher au fil de la lecture
- Templates à compléter (note de cadrage, RACI, roadmap...)
- Suivi de progression par partie
- Score KMMM et Crash Test
- Tableaux pré-formatés pour vos données cabinet

**Comment l'utiliser :**
1. Importer le fichier Markdown dans Notion
2. Dupliquer dans votre espace
3. Compléter au fur et à mesure de la lecture du guide

---

## Conventions

### Versioning

Les fichiers suivent un versioning sémantique :
- `V1`, `V2`, `V3`... pour les versions majeures
- Le fichier le plus récent est marqué ⭐ dans la structure

### Statuts de rédaction

| Statut | Signification |
|:------:|---------------|
| ❌ | À rédiger |
| 🔄 | En cours |
| ✅ | Rédigé |
| ✔️ | Validé |

---

## Contribuer

1. Travailler sur la branche dédiée
2. Mettre à jour le `MEMOIRE_MASTER.md` pour tout changement de structure
3. Respecter les conventions de nommage (`V1`, `V2`...)
4. Documenter les modifications dans le CHANGELOG du fichier concerné

---

## Références

- **Notice originale** : `docs/memoire/notice/ASSOR Alexandre notice du 12-05-2024 (1).pdf`
- **Correspondance** : `docs/memoire/CORRESPONDANCE_Notice_Memoire.md`

---

*Dernière mise à jour : Janvier 2026*
