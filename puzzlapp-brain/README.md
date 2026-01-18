# PuzzlApp Brain

Plateforme de conseil KM augmenté qui transforme le mémoire DEC d'Alexandre ASSOR en expérience interactive.

## Statut du Projet

**Phase actuelle** : Phase 1 - Fondations (COMPLÉTÉE)
**Date de mise à jour** : 18 janvier 2026

### Avancement

| Phase | Description | Statut |
|-------|-------------|--------|
| Phase 1 | Fondations (Setup + Auth + DB) | ✅ Complétée |
| Phase 2 | Interface Admin (TipTap Editor) | ⏳ À faire |
| Phase 3 | Interface Lecteur (Parcours) | ⏳ À faire |
| Phase 4 | Agents IA (Léo, Sophie, Marc) | ⏳ À faire |
| Phase 5 | Jeux Design Thinking | ⏳ À faire |

---

## Stack Technique

- **Frontend** : React 19.2.0 + TypeScript 5.9.3 + Vite 7.3.1
- **Styling** : Tailwind CSS 3.4.17
- **UI Components** : Shadcn/ui (à installer progressivement)
- **State Management** : Zustand
- **Routing** : React Router DOM 7.6.3
- **Backend** : Supabase (Auth, Database, Storage)

---

## Configuration Supabase

| Propriété | Valeur |
|-----------|--------|
| **Project ID** | `aeraxtdgjbhdrxfbsczh` |
| **Région** | `eu-west-1` (Irlande) |
| **URL** | `https://aeraxtdgjbhdrxfbsczh.supabase.co` |

### Tables créées

- `profiles` - Profils utilisateurs avec rôles (admin/reader)
- `cabinets` - Cabinets comptables
- `chapters` - Chapitres du mémoire
- `sections` - Sections avec contenu Markdown
- `games` - Jeux Design Thinking
- `parcours` - Parcours de lecture
- `user_parcours` - Progression des parcours
- `user_progress` - Progression des sections
- `game_results` - Résultats des jeux
- `deliverables` - Livrables générés
- `agent_conversations` - Historique conversations IA

### Migrations appliquées

1. `001_initial_schema` - Création des 11 tables
2. `002_rls_policies` - Politiques RLS + trigger auto-création profil
3. `003_superadmin_alexandre` - Rôle admin pour alexandre.assor.puzzl@gmail.com

---

## Installation

```bash
# Cloner et installer
cd puzzlapp-brain
npm install

# Configurer les variables d'environnement
# Le fichier .env.local existe déjà avec les credentials Supabase

# Lancer le serveur de développement
npm run dev
```

Le serveur démarre sur `http://localhost:5173` (ou le prochain port disponible).

---

## Structure du Projet

```
puzzlapp-brain/
├── src/
│   ├── app/
│   │   ├── admin/page.tsx       # Page admin (protégée)
│   │   └── reader/page.tsx      # Page lecteur (protégée)
│   ├── components/
│   │   └── auth/
│   │       ├── LoginPage.tsx    # Page de connexion
│   │       └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx      # Contexte d'authentification
│   ├── lib/
│   │   ├── supabase.ts          # Client Supabase
│   │   └── utils.ts             # Helpers (cn, etc.)
│   ├── utils/
│   │   └── authErrorMapper.ts   # Messages d'erreur FR
│   ├── App.tsx                  # Routes principales
│   ├── main.tsx
│   └── index.css                # Tailwind + CSS variables
├── .env.local                   # Credentials Supabase
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── tsconfig.app.json
```

---

## Routes

| Route | Accès | Description |
|-------|-------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Connexion/Inscription |
| `/admin` | Admin uniquement | Interface d'administration |
| `/reader` | Authentifié | Interface lecteur |

---

## Authentification

Le système d'auth est basé sur Supabase Auth avec :
- Connexion par email/mot de passe
- Création automatique du profil à l'inscription
- Rôles : `admin` ou `reader`
- Redirection automatique selon le rôle

### Premier utilisateur Admin

`alexandre.assor.puzzl@gmail.com` est configuré comme admin automatiquement.
Pour activer le compte : s'inscrire via l'interface `/login`.

---

## Prochaines Étapes (Phase 2)

1. Installer les composants Shadcn/ui nécessaires
2. Créer l'éditeur TipTap pour les sections
3. Implémenter le sidebar de navigation admin
4. Créer les API pour CRUD chapitres/sections
5. Ajouter le système de publication

---

## Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

---

## Équipe

- **Alexandre ASSOR** - Product Owner
- **Claude Code (Marco)** - Lead Dev

---

*Dernière mise à jour : 18 janvier 2026*
