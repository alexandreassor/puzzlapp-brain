# .claude/agents/

> **Prompts courts** pour Claude Code

---

## Rôle de ce dossier

Ce dossier contient des **prompts raccourcis** utilisés par Claude Code pour reconnaître et invoquer les agents.

**Ce ne sont PAS les prompts complets** — ceux-ci sont dans `docs/agents/`.

---

## Organisation

| Dossier | Contenu | Quand l'utiliser |
|---------|---------|------------------|
| `.claude/agents/` | Prompts courts (ce dossier) | Invocation rapide par Claude Code |
| `docs/agents/` | Prompts complets + références | Documentation, personnalisation |

---

## Agents KM (métier)

| Fichier | Agent | Prompt complet |
|---------|-------|----------------|
| `leo.md` | Léo (orchestrateur) | `docs/agents/leo/SKILL.md` |
| `sophie.md` | Sophie (avant-vente) | `docs/agents/sophie/SKILL.md` |
| `marc.md` | Marc (onboarding) | `docs/agents/marc/SKILL.md` |
| `redacteur.md` | Victor (rédacteur) | `docs/agents/redacteur/SKILL.md` |

---

## Agents Dev (techniques)

Ces agents sont pour le développement de PuzzlApp Brain :

| Fichier | Rôle |
|---------|------|
| `marco-lead.md` | Lead Dev, coordonne l'équipe |
| `hugo-backend.md` | Backend Supabase |
| `louise-frontend.md` | Frontend React Native |
| `sonia-security.md` | Sécurité et revue code |
| `theo-qa.md` | QA et debug |
| `nadia-data.md` | Data et analytics |
| `architecte.md` | Architecture technique |

---

## Comment ajouter un agent

1. Créer le prompt complet dans `docs/agents/[nom]/SKILL.md`
2. Créer le prompt court ici dans `.claude/agents/[nom].md`
3. Le prompt court doit référencer le prompt complet

---

## Format d'un prompt court

```yaml
---
name: nom-agent
description: >
  Description courte pour l'invocation
tools: Read, Grep, Glob
model: claude-opus-4-5-20251101
---

# Nom — Rôle

[Identité courte]

## Références

- `docs/agents/[nom]/SKILL.md` (prompt complet)
- [autres références]

[Résumé des capacités]
```

---

*Ce dossier est géré par Claude Code. Pour modifier un agent, éditer `docs/agents/`.*
