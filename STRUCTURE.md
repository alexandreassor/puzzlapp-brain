# Structure du Projet DEC-KM

> **Version** : 1.0 | **Mise à jour** : 2026-01-11

---

## Métadonnées (Machine-Readable)

```yaml
project:
  name: DEC-KM
  type: thesis
  author: ASSOR Alexandre
  version: 1.0
  language: fr

directories:
  root: /
  docs: /docs
  agents: /docs/agents
  sources: /docs/sources
  archive: /docs/_archive  # Ignoré par les outils

conventions:
  naming: SCREAMING_SNAKE_CASE pour les documents principaux
  versioning: Suffixe _V{n} pour les versions (ex: _V5)
  current_version: Toujours le numéro le plus élevé
  archive_prefix: "_" (dossiers ignorés commencent par _)
```

---

## Arborescence

```
DEC-KM/
│
├── README.md                 # Documentation principale du projet
├── STRUCTURE.md              # CE FICHIER - Structure et conventions
├── CLAUDE.md                 # 🆕 Contexte projet pour Claude Code
├── CLAUDE_TASKS.md           # 🆕 Tâches de développement
│
├── .claude/                  # Configuration agents Claude Code
│   └── agents/               # Définitions des agents IA
│       ├── redacteur.md      # Victor - Rédacteur mémoire
│       ├── architecte.md     # Jules - Architecte outils
│       ├── leo.md            # Léo - Orchestrateur KM
│       ├── sophie.md         # Sophie - Avant-Vente
│       └── marc.md           # Marc - Onboarding
│
└── docs/                     # TOUTE LA DOCUMENTATION
    │
    ├── IDEES_VRAC.md         # Bloc-notes idées à trier
    ├── ARCHITECTURE.md       # Architecture technique
    ├── DEMARCHE_KM_360.md    # Démarche méthodologique
    ├── PREAMBULE_KM.md       # Préambule Knowledge Management
    ├── audit_coherence.json  # Audit de cohérence (machine)
    │
    ├── agents/               # Base de connaissances des agents
    │   ├── leo/              # Agent Léo
    │   │   ├── SKILL.md
    │   │   ├── assets/
    │   │   └── references/
    │   ├── parcours/
    │   │   ├── avant-vente/sophie.md
    │   │   └── onboarding/marc.md
    │   └── redacteur/SKILL.md
    │
    ├── frameworks/           # Fichiers Excel KM 360°
    │   ├── Framework_KM_360_V5.xlsx              # VERSION ACTIVE
    │   └── Connaissance_Client_360_Framework_KM.xlsx
    │
    ├── guides/               # Guides et documentation
    │   ├── Guide_KM_360_Academique_V2.md         # Guide académique
    │   ├── Architecture_Technique_Supabase_React.md
    │   └── prd-km-saas.md    # PRD Plateforme SaaS
    │
    ├── jeux/                 # Jeux Design Thinking
    │   ├── JEUX_AVANT_VENTE_COMPLET.md           # Index complet
    │   ├── JEU-001b_Proposition_Valeur.md
    │   ├── JEU-001b_PUZZL_Session.md
    │   ├── JEU-004b_Carte_Offres.md
    │   └── JEU-015b_Formalisation_Processus.md
    │
    ├── memoire/              # Mémoire DEC
    │   ├── MEMOIRE_KM_360_COMPLET.md             # VERSION FINALE
    │   ├── MEMOIRE_MASTER_V1.md                  # Plan révisé
    │   ├── PLAN_MEMOIRE_V3.md                    # Plan actuel
    │   ├── NOTE_LIMINAIRE.md
    │   ├── ANALYSE_REFONTE_PLAN.md
    │   ├── ARCHITECTURE_NARRATIVE_MEMOIRE.md
    │   ├── CORRESPONDANCE_Notice_Memoire.md
    │   └── notice/           # Notice originale
    │       └── ASSOR Alexandre notice du 12-05-2024 (1).pdf
    │
    ├── processus/            # Process books
    │   ├── PROCESS_BOOK_Avant_Vente.md
    │   ├── PARCOURS_DD_Avant_Vente.md
    │   └── AGENT_SOPHIE_AVANT_VENTE.md
    │
    ├── sources/              # Sources et références
    │   ├── BASE_CONNAISSANCES.md
    │   ├── BIBLIOGRAPHIE_COMPLETE.md
    │   ├── REGISTRE.md
    │   ├── README.md
    │   ├── Livre-blanc-Ourouk-Knowlegde-Management-edition-2023.pdf
    │   ├── *.pdf             # Documents sources (Xerfi, etc.)
    │   └── fiches-lecture/   # Fiches de lecture
    │
    ├── templates/            # Templates réutilisables
    │   ├── NOTION_TEMPLATE_KM360.md
    │   └── AI-Executable-Document-Methodology.md
    │
    └── _archive/             # ANCIENNES VERSIONS (ignoré)
        ├── frameworks/       # Anciens XLSX
        ├── memoire/          # Anciennes versions mémoire
        └── guides/           # Anciens guides
```

---

## Conventions de Nommage

### Fichiers

| Type | Convention | Exemple |
|------|------------|---------|
| Document principal | `NOM_DOCUMENT.md` | `MEMOIRE_MASTER.md` |
| Avec version | `NOM_DOCUMENT_V{n}.md` | `PLAN_MEMOIRE_V3.md` |
| Jeu Design Thinking | `JEU-{XXX}{a-z}_{Nom}.md` | `JEU-001b_Proposition_Valeur.md` |
| Framework Excel | `{Nom}_V{n}.xlsx` | `Framework_KM_360_V5.xlsx` |

### Dossiers

| Préfixe | Signification |
|---------|---------------|
| `_` | Ignoré (archive, temp) |
| Pas de préfixe | Actif |

### Versions

- La version **la plus récente** est toujours **active**
- Les anciennes versions vont dans `_archive/`
- Format : `_V1`, `_V2`, `_V3`... (ordre croissant)

---

## Points d'Entrée

| Besoin | Fichier |
|--------|---------|
| Comprendre le projet | `README.md` |
| Structure technique | `STRUCTURE.md` (ce fichier) |
| Lire le mémoire | `docs/memoire/MEMOIRE_KM_360_COMPLET.md` |
| Voir le framework | `docs/frameworks/Framework_KM_360_V5.xlsx` |
| Jeux Design Thinking | `docs/jeux/JEUX_AVANT_VENTE_COMPLET.md` |
| Sources bibliographiques | `docs/sources/BIBLIOGRAPHIE_COMPLETE.md` |

---

## Agents IA

| Agent | Fichier | Rôle |
|-------|---------|------|
| Victor | `.claude/agents/redacteur.md` | Rédaction mémoire |
| Jules | `.claude/agents/architecte.md` | Architecture & UX |
| Léo | `.claude/agents/leo.md` | Stratégie KM |
| Sophie | `.claude/agents/sophie.md` | Avant-Vente |
| Marc | `.claude/agents/marc.md` | Onboarding |

---

## Règles pour les Machines

```json
{
  "ignore_patterns": [
    "_archive/**",
    "*.backup",
    "*.tmp"
  ],
  "entry_points": {
    "readme": "README.md",
    "structure": "STRUCTURE.md",
    "memoire": "docs/memoire/MEMOIRE_KM_360_COMPLET.md",
    "framework": "docs/frameworks/Framework_KM_360_V5.xlsx"
  },
  "active_version_rule": "highest_version_number",
  "language": "fr"
}
```

---

*Généré automatiquement le 2026-01-11*
