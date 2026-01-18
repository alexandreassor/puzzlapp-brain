# 🎮 JEU-004b : LA CARTE DES OFFRES

## Fiche Jeu Design Thinking

| Attribut | Valeur |
|----------|--------|
| **Code** | JEU-004b |
| **Nom** | La carte des offres |
| **Phase** | 1-DÉCOUVRIR |
| **Catégorie DT** | Understand |
| **Objectif** | Formaliser la grille tarifaire : missions × prix × profils clients |
| **Durée** | 45-60 min |
| **Format** | Duo (dirigeant/associé + IA) ou Atelier associés |
| **Difficulté** | Quick |
| **Prérequis** | JEU-001b (Proposition de valeur) recommandé |
| **Déclencheur** | Besoin de clarifier "combien ça coûte" |
| **Output** | Grille tarifaire formalisée |

---

## 🔗 LIEN AVEC LE KNOWLEDGE MANAGEMENT

> **Pourquoi ce jeu relève du KM ?**
> 
> La grille tarifaire est une **connaissance stratégique tacite** souvent détenue uniquement par les associés. Sans elle, impossible de chiffrer une proposition sans "demander à Laurent". C'est un goulot d'étranglement majeur dans le processus commercial.
> 
> | Dimension KM | Application |
> |--------------|-------------|
> | **Spirale SECI** | Externalisation : le "feeling prix" devient une grille objective |
> | **Crash Test** | Si l'associé est absent, peut-on chiffrer une mission ? |
> | **Transmission** | Permettre aux managers de proposer des prix cohérents |
> | **Capital Structurel** | La politique tarifaire devient un actif documenté |
> 
> *"Un cabinet dont les prix sont dans la tête d'une personne est un cabinet fragile."*

---

## 🎯 POURQUOI CE JEU ?

### Le problème

Dans la plupart des cabinets :
- Les prix sont "dans la tête" des associés
- Chaque devis est réinventé from scratch
- Les managers n'osent pas proposer de prix
- Incohérences entre les propositions
- Temps perdu en allers-retours

### La solution

Une **grille tarifaire** qui répond à :
- **Quoi ?** → Liste des missions proposées
- **Pour qui ?** → Profils clients cibles
- **Combien ?** → Fourchettes de prix
- **Qu'est-ce qui est inclus ?** → Périmètre clair

---

## 🚀 MODE TURBO : ALIMENTER L'IA

### Avant de commencer, rassemblez :

```
┌─────────────────────────────────────────────────────────────────┐
│  📁 ASSETS À FOURNIR À L'IA                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⭐⭐⭐ HAUTE VALEUR                                              │
│  □ 5-10 lettres de mission récentes (anonymisées)              │
│  □ 5-10 devis récents (gagnés et perdus)                       │
│  □ Liste des missions réellement facturées (extrait compta)    │
│                                                                 │
│  ⭐⭐ MOYENNE VALEUR                                              │
│  □ Benchmark tarifaire du marché (si disponible)               │
│  □ Grille tarifaire existante (même ancienne)                  │
│  □ Statistiques portefeuille (CA moyen par type de client)     │
│                                                                 │
│  ⭐ COMPLÉMENTAIRE                                               │
│  □ Retours sur devis perdus ("trop cher" / "pas assez")       │
│  □ Taux horaire cible / politique de marge                     │
│  □ Temps passé réel par type de mission (si suivi)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 💡 Prompt de démarrage

```
Je veux créer la grille tarifaire de mon cabinet d'expertise comptable.

Voici les éléments dont je dispose :
- [X] lettres de mission récentes
- [X] devis récents
- Notre positionnement : [résumé JEU-001b]
- Notre cible principale : [type de clients]

Analyse ces documents et propose-moi une première version 
de grille tarifaire structurée par :
1. Type de mission
2. Profil client (taille, complexité)
3. Fourchette de prix

Utilise le code couleur :
✅ Données trouvées dans les documents
❓ Estimations à confirmer
🔴 Informations manquantes
```

---

## 📋 DÉROULÉ DU JEU

### ⏱️ Planning (45-60 min)

| Phase | Durée | Activité |
|-------|-------|----------|
| **1. Inventaire** | 10 min | Lister toutes les missions proposées |
| **2. Segmentation** | 15 min | Définir les profils clients |
| **3. Tarification** | 20 min | Associer des prix à chaque case |
| **4. Validation** | 10 min | Vérifier la cohérence |

---

## 📝 PARTIE 1 : INVENTAIRE DES MISSIONS (10 min)

### 1.1 Missions comptables

| Mission | Proposée ? | Fréquence |
|---------|:----------:|-----------|
| Tenue comptable externalisée | ☐ Oui ☐ Non | |
| Supervision comptable | ☐ Oui ☐ Non | |
| Révision des comptes | ☐ Oui ☐ Non | |
| Situations intermédiaires | ☐ Oui ☐ Non | |
| Établissement des comptes annuels | ☐ Oui ☐ Non | |
| Consolidation | ☐ Oui ☐ Non | |
| Autre : _____________ | ☐ Oui ☐ Non | |

### 1.2 Missions fiscales

| Mission | Proposée ? | Fréquence |
|---------|:----------:|-----------|
| Déclarations de TVA | ☐ Oui ☐ Non | |
| Liasse fiscale | ☐ Oui ☐ Non | |
| Déclaration IR dirigeant | ☐ Oui ☐ Non | |
| Optimisation fiscale | ☐ Oui ☐ Non | |
| CVAE / CFE | ☐ Oui ☐ Non | |
| Autre : _____________ | ☐ Oui ☐ Non | |

### 1.3 Missions sociales

| Mission | Proposée ? | Fréquence |
|---------|:----------:|-----------|
| Établissement des paies | ☐ Oui ☐ Non | |
| Déclarations sociales (DSN) | ☐ Oui ☐ Non | |
| Gestion entrées/sorties | ☐ Oui ☐ Non | |
| Conseil social | ☐ Oui ☐ Non | |
| Audit social | ☐ Oui ☐ Non | |
| Autre : _____________ | ☐ Oui ☐ Non | |

### 1.4 Missions juridiques

| Mission | Proposée ? | Fréquence |
|---------|:----------:|-----------|
| Juridique annuel (AG, PV) | ☐ Oui ☐ Non | |
| Création de société | ☐ Oui ☐ Non | |
| Modification statutaire | ☐ Oui ☐ Non | |
| Cession / Transmission | ☐ Oui ☐ Non | |
| Autre : _____________ | ☐ Oui ☐ Non | |

### 1.5 Missions de conseil

| Mission | Proposée ? | Fréquence |
|---------|:----------:|-----------|
| Tableaux de bord | ☐ Oui ☐ Non | |
| Prévisionnel / Business plan | ☐ Oui ☐ Non | |
| Évaluation d'entreprise | ☐ Oui ☐ Non | |
| Conseil ponctuel (à l'heure) | ☐ Oui ☐ Non | |
| Accompagnement stratégique | ☐ Oui ☐ Non | |
| Autre : _____________ | ☐ Oui ☐ Non | |

---

## 📝 PARTIE 2 : SEGMENTATION CLIENTS (15 min)

### 2.1 Définir vos segments

*Quels sont les profils de clients qui ont des besoins et des prix différents ?*

| Segment | Critères | Exemple |
|---------|----------|---------|
| **Segment 1** | | Ex: TNS < 100K€ CA |
| **Segment 2** | | Ex: TPE 1-5 salariés |
| **Segment 3** | | Ex: TPE 5-20 salariés |
| **Segment 4** | | Ex: PME 20-50 salariés |
| **Segment 5** | | Ex: PME > 50 salariés |

### 2.2 Critères de segmentation possibles

| Critère | Options |
|---------|---------|
| **Chiffre d'affaires** | < 100K€ / 100-500K€ / 500K-2M€ / > 2M€ |
| **Effectif** | 0 / 1-5 / 5-20 / 20-50 / > 50 |
| **Forme juridique** | EI / EURL-SASU / SARL-SAS / SA-SCA |
| **Régime fiscal** | Micro / Réel simplifié / Réel normal |
| **Secteur** | Standard / Complexe (BTP, immo, agricole...) |
| **Volume pièces** | < 50 / 50-200 / 200-500 / > 500 / mois |

### 2.3 Vos segments retenus

| # | Nom du segment | Critères | Volume estimé |
|---|----------------|----------|---------------|
| S1 | | | clients |
| S2 | | | clients |
| S3 | | | clients |
| S4 | | | clients |
| S5 | | | clients |

---

## 📝 PARTIE 3 : GRILLE TARIFAIRE (20 min)

### 3.1 Grille principale : Missions récurrentes

| Mission | S1 | S2 | S3 | S4 | S5 |
|---------|:--:|:--:|:--:|:--:|:--:|
| **Tenue comptable** | €/mois | €/mois | €/mois | €/mois | €/mois |
| **Supervision** | €/mois | €/mois | €/mois | €/mois | €/mois |
| **Déclarations TVA** | Inclus ☐ | Inclus ☐ | Inclus ☐ | Inclus ☐ | Inclus ☐ |
| **Liasse fiscale** | €/an | €/an | €/an | €/an | €/an |
| **Juridique annuel** | €/an | €/an | €/an | €/an | €/an |
| **Paie (par bulletin)** | €/bul | €/bul | €/bul | €/bul | €/bul |

### 3.2 Grille missions ponctuelles

| Mission | Prix | Commentaire |
|---------|:----:|-------------|
| Création société (standard) | € | |
| Création société (complexe) | € | |
| Prévisionnel simple | € | |
| Prévisionnel détaillé | € | |
| Évaluation entreprise | € ou % | |
| Conseil (taux horaire) | €/h | |
| Attestation | € | |

### 3.3 Packages / Formules (si applicable)

| Formule | Contenu | Prix indicatif |
|---------|---------|:--------------:|
| **Essentiel** | Tenue + Liasse + TVA | €/mois |
| **Confort** | Essentiel + Juridique + Conseil inclus | €/mois |
| **Premium** | Confort + TB + Accompagnement | €/mois |

---

## 📝 PARTIE 4 : RÈGLES ET AJUSTEMENTS (10 min)

### 4.1 Règles de majoration

| Situation | Majoration |
|-----------|:----------:|
| Secteur complexe (BTP, immo, agricole) | + __% |
| Multi-établissements | + __% |
| Reprise de dossier en cours d'année | + __€ |
| Client éloigné (déplacements) | + __€/dépl |
| Urgence (< délai standard) | + __% |

### 4.2 Règles de remise

| Situation | Remise max |
|-----------|:----------:|
| Groupement de sociétés | - __% |
| Apporteur d'affaires | - __% |
| Engagement durée (3 ans) | - __% |
| Paiement annuel d'avance | - __% |

### 4.3 Ce qui n'est PAS inclus (toujours facturer en sus)

| Prestation | Prix |
|------------|:----:|
| | € |
| | € |
| | € |

---

## ✅ CHECKLIST DE VALIDATION

| Critère | Validé |
|---------|:------:|
| Toutes les missions proposées sont tarifées | ☐ |
| Les segments couvrent 90% des clients | ☐ |
| Les fourchettes sont réalistes (benchmark) | ☐ |
| Les règles de majoration/remise sont claires | ☐ |
| La marge cible est respectée | ☐ |
| Un associé a validé la grille | ☐ |

---

## 📤 OUTPUT DU JEU

À l'issue de ce jeu, vous disposez de :

1. **Grille tarifaire** structurée (missions × segments × prix)
2. **Règles d'ajustement** (majorations, remises)
3. **Base pour les devis** (fini les approximations)

### Format de restitution

```
┌─────────────────────────────────────────────────────────────────┐
│                    GRILLE TARIFAIRE [CABINET]                   │
│                    Version 1.0 — [Date]                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MISSIONS RÉCURRENTES                                           │
│  ┌─────────────────┬──────┬──────┬──────┬──────┬──────┐       │
│  │                 │  S1  │  S2  │  S3  │  S4  │  S5  │       │
│  ├─────────────────┼──────┼──────┼──────┼──────┼──────┤       │
│  │ Tenue comptable │ XXX€ │ XXX€ │ XXX€ │ XXX€ │ XXX€ │       │
│  │ ...             │      │      │      │      │      │       │
│  └─────────────────┴──────┴──────┴──────┴──────┴──────┘       │
│                                                                 │
│  MISSIONS PONCTUELLES                                           │
│  • Création société : XXX€                                     │
│  • Prévisionnel : XXX€                                         │
│  • ...                                                          │
│                                                                 │
│  RÈGLES                                                         │
│  • Majoration BTP/Immo : +20%                                  │
│  • Remise groupe max : -15%                                    │
│                                                                 │
│  Validé par : [Associé] — [Date]                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 LIENS AVEC LES AUTRES JEUX

| Avant | Ce jeu | Après |
|-------|--------|-------|
| JEU-001b Proposition de valeur | **JEU-004b** | PROCESS BOOK (proposition commerciale) |
| JEU-004 Galerie des clients | **Carte des offres** | JEU-027 Production template devis |

---

## 💡 CONSEILS

### Bonnes pratiques

| Conseil | Pourquoi |
|---------|----------|
| **Donner des fourchettes, pas des prix fixes** | Garder de la flexibilité commerciale |
| **Réviser annuellement** | Les coûts et le marché évoluent |
| **Tester sur des cas réels** | Vérifier que la grille fonctionne |
| **Former les managers** | Qu'ils puissent l'utiliser en autonomie |

### Pièges à éviter

| Piège | Solution |
|-------|----------|
| Grille trop complexe | Max 5-6 segments |
| Prix trop bas | Calculer le coût de revient réel |
| Prix trop précis | Arrondir, garder de la marge de manœuvre |
| Grille figée | Prévoir une clause de révision |

---

## 📝 NOTES DE SESSION

```
Date de la session : _______________
Participants : _______________
Animateur/IA : _______________

Décisions prises :
_________________________________________________________________
_________________________________________________________________

Points à approfondir :
_________________________________________________________________
_________________________________________________________________

Prochaine révision prévue : _______________
```

---

*JEU-004b — Version 1.0 — Framework KM 360°*
