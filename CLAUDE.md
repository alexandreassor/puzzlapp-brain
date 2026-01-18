# CLAUDE.md — PuzzlApp Brain

> **Product Requirements Document (PRD)**
> Version 3.0 | 16 janvier 2026

---

## 1. Problème

### Constat

Les cabinets d'expertise comptable font face à une **crise de transmission des savoirs** :

- Départs à la retraite massifs (génération baby-boom)
- Turnover élevé des collaborateurs
- Savoirs tacites non documentés
- Outils KM inadaptés ou inexistants
- Pas de méthodologie actionnable

### Le Crash Test

> *"Si demain toute l'équipe disparaît, une nouvelle équipe peut-elle reprendre sans passation ?"*

**Score moyen des cabinets** : 1.4/5 (KMMM)
**Objectif** : 3.2/5 en 6 mois

### Pourquoi maintenant ?

L'IA générative permet enfin de créer un **Knowledge Manager virtuel** capable de :
- Guider la transformation KM pas à pas
- S'adapter à chaque cabinet
- Accompagner en temps réel
- Capitaliser les connaissances automatiquement

---

## 2. Vision

**PuzzlApp Brain** est une plateforme de conseil KM augmenté qui transforme un mémoire académique en **expérience interactive de transformation**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   MÉMOIRE CLASSIQUE                    PUZZLAPP BRAIN                       │
│   ════════════════                     ══════════════                       │
│                                                                             │
│   📄 PDF 100 pages          →          🎮 Expérience interactive            │
│   📖 Lecture passive        →          🎯 Parcours personnalisés            │
│   📚 Théorie abstraite      →          🎲 Jeux Design Thinking              │
│   ❌ Fin = refermer         →          ✅ Fin = plan d'action               │
│   🤷 Seul face au texte     →          🤖 Agents IA qui accompagnent        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Vision long terme

```
PHASE 1 (2026)
└── Plateforme mémoire interactif + agents

PHASE 2 (2026-2027)
└── Knowledge Manager personnel par cabinet
    • Connaît l'historique complet
    • Accès données réelles du cabinet
    • Conseille en temps réel

PHASE 3 (2027+)
└── Plateforme SaaS multi-cabinets
    • Benchmark anonymisé
    • Communauté de pratique
    • Marketplace de templates KM
```

---

## 3. Utilisateurs

### Persona 1 : Alexandre (Admin)

| Attribut | Détail |
|----------|--------|
| **Rôle** | Auteur du mémoire, créateur de contenu |
| **Objectif** | Rédiger le mémoire et configurer l'expérience lecteur |
| **Frustration** | Processus de rédaction long, difficile de visualiser l'expérience finale |
| **Besoin** | Un cockpit de rédaction assisté par IA avec prévisualisation |

### Persona 2 : Pierre (Lecteur - Dirigeant)

| Attribut | Détail |
|----------|--------|
| **Rôle** | Associé gérant d'un cabinet de 50 personnes |
| **Objectif** | Transformer la gestion des connaissances de son cabinet |
| **Frustration** | Pas de temps, pas de méthode, ne sait pas par où commencer |
| **Besoin** | Un guide pas-à-pas adapté à SA situation avec des actions concrètes |

### Persona 3 : Marie (Lecteur - Manager)

| Attribut | Détail |
|----------|--------|
| **Rôle** | Responsable pôle Audit, 15 collaborateurs |
| **Objectif** | Améliorer l'intégration des nouveaux et capitaliser les savoirs |
| **Frustration** | Perd du temps à réexpliquer, départs = perte de savoir |
| **Besoin** | Un parcours ciblé (Onboarding) avec des livrables prêts à l'emploi |

---

## 4. Parcours Disponibles

Le lecteur choisit UN ou PLUSIEURS parcours selon ses priorités.

### Parcours détaillés dans le mémoire (100 pages)

| # | Parcours | Agent | Jeux | Livrables |
|---|----------|-------|------|-----------|
| 1 | **Avant-Vente** | Sophie | 12 jeux | Proposition valeur, Carte offres, Process book |
| 2 | **Onboarding Client** | Marc | 8 jeux | Checklist accueil, Kit bienvenue, Parcours 90j |

### Parcours en annexe / plateforme

| # | Parcours | Agent | Description |
|---|----------|-------|-------------|
| 3 | **Production Comptable** | À définir | Dossiers permanents, contrôles, révision |
| 4 | **Audit & CAC** | À définir | Méthodologie, papiers de travail, revue |
| 5 | **Social / Paie** | À définir | Process paie, veille sociale, DSN |
| 6 | **Juridique** | À définir | Actes, AG, formalités |
| 7 | **Gestion Interne** | À définir | RH, formation, qualité |
| 8 | **Formation Collaborateurs** | À définir | Parcours intégration, montée en compétences |
| 9 | **Départ Collaborateur** | À définir | Passation, documentation, exit interview |
| 10 | **Gestion des Connaissances** | Léo | Outils, Notion, bases de données, IA |

### Agent transversal

| Agent | Rôle | Disponibilité |
|-------|------|---------------|
| **Léo** | Orchestrateur KM, stratégie, SECI, Crash Test | Tous les parcours |

---

## 5. Fonctionnalités

### Interface Admin

| Priorité | Fonctionnalité | Description |
|:--------:|----------------|-------------|
| **MUST** | Éditeur TipTap | Rédaction Markdown avec formatage riche |
| **MUST** | Navigation plan | Arborescence chapitres/sections avec statuts |
| **MUST** | Communication Claude Code | Chat intégré pour piloter Victor |
| **MUST** | Gestion sections | CRUD chapitres, sections, ordre |
| **SHOULD** | Prévisualisation lecteur | Voir le rendu final en temps réel |
| **SHOULD** | Configuration jeux | Paramétrer les jeux par section |
| **SHOULD** | Gestion sources | Bibliothèque de sources liées |
| **COULD** | Analytics admin | Stats de progression des lecteurs |
| **COULD** | Multi-auteurs | Collaboration sur le contenu |

### Interface Lecteur

| Priorité | Fonctionnalité | Description |
|:--------:|----------------|-------------|
| **MUST** | Authentification | Compte utilisateur avec données cabinet |
| **MUST** | Parcours lecture | Navigation linéaire avec progression |
| **MUST** | Sauvegarde progression | Reprendre où on s'est arrêté |
| **MUST** | Jeux intégrés | Design Thinking dans l'interface |
| **MUST** | Chat agents | Conversation avec Léo/Sophie/Marc |
| **SHOULD** | Multi-parcours | Suivre plusieurs parcours en parallèle |
| **SHOULD** | Livrables | Génération et stockage des outputs |
| **SHOULD** | Profil cabinet | Données cabinet utilisées par les agents |
| **COULD** | Sync Notion | Export livrables vers Notion via MCP |
| **COULD** | Mode hors-ligne | Lecture sans connexion |
| **WONT** | App mobile native | Desktop/web prioritaire (v1) |

---

## 6. User Stories

### Admin (Alexandre)

```
US-A1: En tant qu'admin, je veux rédiger une section dans un éditeur riche,
       pour produire du contenu formaté facilement.

US-A2: En tant qu'admin, je veux communiquer avec Claude Code dans l'interface,
       pour que Victor m'aide à rédiger sans changer d'outil.

US-A3: En tant qu'admin, je veux voir la progression des lecteurs,
       pour savoir quelles sections fonctionnent.

US-A4: En tant qu'admin, je veux configurer un jeu pour une section,
       pour que le lecteur ait une expérience interactive.

US-A5: En tant qu'admin, je veux prévisualiser le rendu lecteur,
       pour valider l'expérience avant publication.
```

### Lecteur (Pierre/Marie)

```
US-L1: En tant que lecteur, je veux créer un compte avec les infos de mon cabinet,
       pour que l'expérience soit personnalisée.

US-L2: En tant que lecteur, je veux choisir un ou plusieurs parcours,
       pour me concentrer sur mes priorités.

US-L3: En tant que lecteur, je veux reprendre ma lecture là où je m'étais arrêté,
       pour avancer à mon rythme.

US-L4: En tant que lecteur, je veux faire un jeu Design Thinking appliqué à mon cabinet,
       pour obtenir des résultats concrets.

US-L5: En tant que lecteur, je veux poser une question à Sophie sur l'avant-vente,
       pour avoir des conseils personnalisés.

US-L6: En tant que lecteur, je veux récupérer mes livrables (canvas, plans d'action),
       pour les utiliser dans mon cabinet.

US-L7: En tant que lecteur, je veux exporter mes livrables vers Notion,
       pour les intégrer à mes outils existants.
```

---

## 7. Architecture Technique

### Stack

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| Framework | React + TypeScript | Écosystème riche, typage |
| Éditeur | TipTap | Headless, Markdown natif |
| UI | Shadcn UI + Tailwind | Moderne, personnalisable |
| État | Zustand | Léger, simple |
| Auth/DB/Storage | Supabase | All-in-one, RLS |
| IA | Claude API | Agents intelligents |
| Intégrations | MCP | Notion, outils métier |
| Build | Vite | Rapide |

### Base de Données

```
┌─────────────────────────────────────────────────────────────┐
│  UTILISATEURS                                               │
│  • profiles (id, email, role, cabinet_id)                   │
│  • cabinets (id, name, siren, data_json)                    │
├─────────────────────────────────────────────────────────────┤
│  CONTENU (Admin)                                            │
│  • chapters (id, order, title, status)                      │
│  • sections (id, chapter_id, order, title, content_md)      │
│  • games (id, section_id, type, config_json)                │
│  • parcours (id, name, sections[], agent_type)              │
├─────────────────────────────────────────────────────────────┤
│  PROGRESSION (Lecteur)                                      │
│  • user_parcours (id, user_id, parcours_id, started_at)     │
│  • user_progress (id, user_id, section_id, completed_at)    │
│  • game_results (id, user_id, game_id, data_json)           │
│  • deliverables (id, user_id, type, content_json)           │
├─────────────────────────────────────────────────────────────┤
│  AGENTS                                                     │
│  • agent_conversations (id, user_id, agent_type, messages)  │
└─────────────────────────────────────────────────────────────┘
```

### Intégrations MCP

| Service | Usage | Priorité |
|---------|-------|:--------:|
| **Notion** | Créer/MAJ bases de données lecteur | SHOULD |
| **Monday** | Suivi projets KM | COULD |
| **Google Drive** | Import/export docs | COULD |

---

## 8. Métriques de Succès

### Admin

| Métrique | Objectif |
|----------|----------|
| Sections rédigées | 100% du plan |
| Jeux configurés | 1+ par section clé |
| Temps moyen rédaction section | < 2h avec Victor |

### Lecteur

| Métrique | Objectif |
|----------|----------|
| Taux d'inscription | > 50% des visiteurs |
| Taux de complétion parcours | > 60% |
| NPS (satisfaction) | > 40 |
| Livrables générés par lecteur | > 5 |
| Questions aux agents | > 10 par lecteur |

### Business

| Métrique | Objectif |
|----------|----------|
| Cabinets actifs | 50 (an 1) |
| Score KMMM moyen après parcours | +1.5 points |
| Conversion gratuit → payant | > 20% (si modèle freemium) |

---

## 9. Scope MVP

### IN (MVP)

- [ ] Interface Admin avec éditeur TipTap
- [ ] Communication Claude Code intégrée
- [ ] Interface Lecteur avec parcours linéaire
- [ ] 2 parcours complets (Avant-Vente, Onboarding)
- [ ] Jeux Design Thinking intégrés
- [ ] 3 agents (Léo, Sophie, Marc)
- [ ] Authentification Supabase
- [ ] Sauvegarde progression
- [ ] Génération livrables basiques

### OUT (MVP)

- App mobile native
- Sync Notion (MCP)
- 10 parcours complets
- Analytics avancés
- Multi-auteurs
- Mode hors-ligne
- Benchmark inter-cabinets

---

## 10. Risques

| Risque | Impact | Probabilité | Mitigation |
|--------|:------:|:-----------:|------------|
| Complexité agents | Élevé | Moyenne | Commencer par Léo seul, itérer |
| Coût Claude API | Moyen | Élevée | Caching, limites tokens |
| Adoption lecteurs | Élevé | Moyenne | UX soignée, quick wins rapides |
| Scope creep | Élevé | Élevée | MVP strict, validation phase par phase |
| Contenu insuffisant | Élevé | Faible | Alexandre rédige en parallèle du dev |

---

## 11. Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SEMAINE 1-2 : FONDATIONS                                                   │
│  • Setup projet (Vite, Supabase, Shadcn)                                    │
│  • Schéma DB + Auth                                                         │
│  • Layout Admin basique                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 3-4 : ADMIN                                                        │
│  • Éditeur TipTap complet                                                   │
│  • Navigation plan                                                          │
│  • Communication Claude Code                                                │
│  • CRUD sections                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 5-6 : LECTEUR                                                      │
│  • Interface lecture                                                        │
│  • Progression sauvegardée                                                  │
│  • Affichage jeux                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 7-8 : AGENTS                                                       │
│  • Chat intégré                                                             │
│  • Agent Léo fonctionnel                                                    │
│  • Sophie + Marc                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMAINE 9-10 : LIVRABLES & POLISH                                          │
│  • Génération livrables                                                     │
│  • Tests utilisateurs                                                       │
│  • Corrections UX                                                           │
│  • Déploiement beta                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Fichiers Projet

| Fichier | Chemin | Usage |
|---------|--------|-------|
| PRD | `CLAUDE.md` | Ce document |
| Tâches dev | `CLAUDE_TASKS.md` | Instructions Claude Code |
| Plan mémoire | `docs/memoire/MEMOIRE_MASTER_V1.md` | Structure 10 chapitres |
| Sources | `docs/sources/BASE_CONNAISSANCES.md` | 42 sources |
| Jeux | `docs/jeux/JEUX_AVANT_VENTE_COMPLET.md` | 12+ jeux DT |
| Framework | `docs/frameworks/Framework_KM_360_V5.xlsx` | KM 360° |
| Agents | `.claude/agents/*.md` | Définitions agents |

---

## 13. Conventions Code

| Type | Convention |
|------|------------|
| Composants React | PascalCase (`Editor.tsx`) |
| Hooks | `use` prefix (`useProgress.ts`) |
| Types | PascalCase (`Section.ts`) |
| Services | camelCase (`agentService.ts`) |

### Structure src/

```
src/
├── app/
│   ├── admin/            # Interface Admin
│   └── reader/           # Interface Lecteur
├── components/
│   ├── admin/            # Composants Admin
│   ├── reader/           # Composants Lecteur
│   └── shared/           # Composants partagés
├── stores/               # Zustand
├── services/             # API, Supabase, Agents
├── types/                # TypeScript
└── lib/                  # Utilitaires
```

---

*Marco — Lead Tech pour Alexandre*
*Document vivant, mis à jour au fil du projet*
