# INDEX — Catalogue des Agents PuzzlApp Brain

> **Dernière mise à jour** : 18 janvier 2026

---

## Vue d'ensemble

```
                         ┌─────────────────┐
                         │      LÉO        │
                         │  Orchestrateur  │
                         │   KM Global     │
                         └────────┬────────┘
                                  │
        ┌─────────────┬───────────┼───────────┬─────────────┐
        ▼             ▼           ▼           ▼             ▼
   ┌─────────┐  ┌──────────┐ ┌─────────┐ ┌─────────┐  ┌─────────┐
   │ SOPHIE  │  │   MARC   │ │ VICTOR  │ │  ÉMILE  │  │   ...   │
   │ Avant-  │  │Onboarding│ │Rédacteur│ │Recherche│  │ Futurs  │
   │ Vente   │  │          │ │ Mémoire │ │Académiq.│  │ Agents  │
   └─────────┘  └──────────┘ └─────────┘ └─────────┘  └─────────┘
```

---

## Agents Actifs

| Agent | Rôle | Parcours | Statut | Dossier |
|-------|------|----------|:------:|---------|
| **Léo** | Orchestrateur KM | Transversal | ✅ Actif | [leo/](leo/) |
| **Sophie** | Avant-Vente & Commercial | Avant-vente | ✅ Actif | [sophie/](sophie/) |
| **Marc** | Onboarding Client | Onboarding | ✅ Actif | [marc/](marc/) |
| **Victor** | Rédacteur Mémoire DEC | Rédaction | ✅ Actif | [redacteur/](redacteur/) |
| **Émile** | Recherche Académique | Recherche | ✅ Actif | [emile/](emile/) |

---

## Agents Prévus

| Agent | Rôle | Parcours | Priorité |
|-------|------|----------|:--------:|
| **Julie** | Social / Paie | Social | Haute |
| **Pierre** | Fiscal | Fiscal | Haute |
| **?** | Juridique | Juridique | Moyenne |
| **?** | Clôture annuelle | Production | Moyenne |
| **?** | Formation collaborateurs | RH | Basse |

---

## Structure d'un agent

Chaque agent suit cette structure :

```
docs/agents/
└── [nom-agent]/
    ├── SKILL.md           # Prompt principal (obligatoire)
    ├── README.md          # Documentation courte (optionnel)
    ├── references/        # Fichiers de contexte à charger
    │   ├── fondamentaux.md
    │   └── ...
    ├── jeux/              # Jeux Design Thinking spécifiques
    │   └── ...
    └── assets/            # Templates, exemples
        └── ...
```

---

## Comment utiliser un agent

### 1. Invocation directe

Demander à Léo de router :
```
"J'ai un problème avec mes prospects" → Sophie
"Comment accueillir un nouveau client ?" → Marc
"Aide-moi à rédiger cette section" → Victor
"Je cherche des sources académiques sur le KM" → Émile
```

### 2. Chargement du SKILL.md

Pour que Claude incarne l'agent, charger son fichier SKILL.md :
```
Lire : docs/agents/sophie/SKILL.md
```

### 3. Chargement des références

Pour enrichir le contexte :
```
Lire : docs/agents/leo/references/fondamentaux.md
```

---

## Créer un nouvel agent

1. Copier le template : `_templates/AGENT_TEMPLATE.md`
2. Créer le dossier : `docs/agents/[nom-agent]/`
3. Renommer en `SKILL.md`
4. Compléter les sections
5. Ajouter à cet INDEX

Voir [_templates/AGENT_TEMPLATE.md](_templates/AGENT_TEMPLATE.md)

---

## Règles de nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Dossier agent | kebab-case | `avant-vente/`, `onboarding/` |
| Fichier principal | SKILL.md | `sophie/SKILL.md` |
| Références | kebab-case | `freins-leviers.md` |
| Code agent | AGENT-XXX-NNN | `AGENT-AV-001` |

---

## Dossiers obsolètes

| Dossier | Statut | Remplacé par |
|---------|:------:|--------------|
| `parcours/avant-vente/` | OBSOLÈTE | `sophie/SKILL.md` |
| `parcours/onboarding/` | OBSOLÈTE | `marc/SKILL.md` |

> Ces dossiers sont conservés comme backup. Ne plus les utiliser.

---

## Changelog

| Date | Modification |
|------|--------------|
| 2026-01-18 | Réorganisation : agents au premier niveau |
| 2026-01-18 | Création INDEX.md |
| 2026-01-03 | Création initiale (Léo, Sophie, Marc) |

---

*Ce fichier est la source de vérité pour le catalogue des agents.*
