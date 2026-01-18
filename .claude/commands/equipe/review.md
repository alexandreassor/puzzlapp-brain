---
name: review
description: Review collective du code par l'équipe (Sonia + Théo)
---

# /equipe:review — Review Collective

Tu coordonnes une review collective avec Sonia (sécurité) et Théo (qualité).

## Processus

1. **Identifie** les fichiers modifiés récemment
2. **Sonia** vérifie la sécurité (RLS, validation, secrets)
3. **Théo** vérifie la qualité (tests, TypeScript, patterns)
4. **Synthétise** les retours
5. **Priorise** les corrections

## Format de sortie

```
🔍 REVIEW COLLECTIVE

## Fichiers analysés
- `src/components/MissionCard.tsx`
- `supabase/migrations/xxx.sql`

## Sécurité (Sonia)

| Fichier | Issue | Sévérité | Action |
|---------|-------|----------|--------|
| xxx.sql | RLS manquante | HAUTE | Ajouter policy |

## Qualité (Théo)

| Fichier | Issue | Sévérité | Action |
|---------|-------|----------|--------|
| MissionCard.tsx | Pas de test | MOYENNE | Ajouter test |

## Actions prioritaires

1. 🔴 [HAUTE] Ajouter RLS sur table missions
2. 🟡 [MOYENNE] Ajouter tests MissionCard
3. 🟢 [BASSE] Refactorer hook

Appliquer les corrections ? (oui/sélectionner/ignorer)
```
