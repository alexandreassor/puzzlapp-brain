# AI-Executable Document (AED)
## Méthodologie de création de documents de formation auto-porteurs

> **Version** : 1.0  
> **Date** : Janvier 2025  
> **Auteur** : Alexandre — Experts-Entreprendre  
> **Statut** : Concept validé, en expérimentation

---

## 1. Concept

### Définition

Un **AI-Executable Document (AED)** est un document de formation qui contient à la fois :
- Le **contenu pédagogique** lisible par un humain
- Les **instructions d'exécution** interprétables par une IA conversationnelle
- Les **critères de validation** permettant une correction automatisée

Le document devient **son propre système prompt** — portable, agnostique de la plateforme IA.

### Analogie

| Concept | Équivalent informatique |
|---------|------------------------|
| Document classique | Fichier de données statique |
| Document + IA externe | Application client-serveur |
| **AI-Executable Document** | **Script auto-exécutable** |

### Principe clé

```
Document AED + N'importe quelle IA = Tuteur personnalisé
```

L'utilisateur n'a besoin d'aucune compétence technique. Il uploade le document, dit "je veux faire les exercices", et l'IA devient son formateur.

---

## 2. Problème résolu

### Situation actuelle

| Approche | Avantage | Inconvénient |
|----------|----------|--------------|
| Formation présentielle | Interaction, correction en direct | Coût, disponibilité |
| E-learning classique | Scalable | Pas de correction personnalisée |
| ChatGPT/Claude + prompt manuel | Flexible | L'utilisateur doit savoir prompter |
| Custom GPT / Claude Project | Expérience guidée | Verrouillé à une plateforme |
| **AI-Executable Document** | **Portable, agnostique, autonome** | **Nouveau concept à évangéliser** |

### Proposition de valeur

1. **Zéro dépendance plateforme** : Fonctionne avec ChatGPT, Claude, Gemini, Mistral...
2. **Zéro compétence requise** : L'utilisateur dit juste "mode exercice"
3. **Correction personnalisée** : L'IA analyse screenshots et réponses textuelles
4. **Scalabilité infinie** : Un document, des milliers d'apprenants simultanés
5. **Mise à jour simple** : Modifier le document = mettre à jour la formation

---

## 3. Architecture d'un document AED

### Structure recommandée

```
┌─────────────────────────────────────────┐
│  SECTION 1 : MODE EXERCICE INTERACTIF   │  ← Visible par humain ET IA
│  ├── Instructions utilisateur           │
│  ├── Instructions IA (encadrées)        │
│  └── Critères de validation             │
├─────────────────────────────────────────┤
│  SECTION 2-N : CONTENU PÉDAGOGIQUE      │  ← Contenu classique
│  ├── Théorie                            │
│  ├── Exemples                           │
│  └── Exercices                          │
└─────────────────────────────────────────┘
```

### Composants obligatoires

#### 3.1 Instructions utilisateur (pour l'humain)

```markdown
## Comment utiliser ce document avec une IA ?

1. Ouvre une conversation avec ChatGPT, Claude, ou une autre IA
2. Uploade ce document (PDF ou Word)
3. Dis simplement : "Je veux faire les exercices"
4. L'IA te guidera et te corrigera
```

#### 3.2 Instructions IA (bloc exécutable)

```markdown
══════════ INSTRUCTIONS IA ══════════

Si tu es une IA et que l'utilisateur dit "exercice", "mode exercice", 
"je veux m'entraîner" ou "corrige-moi", applique ces règles :

COMPORTEMENT PÉDAGOGIQUE :
• Propose UN exercice à la fois, dans l'ordre
• Attends la réponse de l'utilisateur (texte OU screenshot)
• Corrige avec bienveillance : félicite si correct, explique si incorrect
• Ne donne PAS la solution complète immédiatement — guide l'utilisateur
• Utilise les CRITÈRES DE VALIDATION pour évaluer

FORMAT DE CORRECTION :
✅ Correct — si le critère est validé
❌ À corriger — avec explication et indice
💡 Conseil — astuce pour aller plus loin

══════════════════════════════════════
```

#### 3.3 Critères de validation (par exercice)

```markdown
EXERCICE 1 — Navigation de base
✓ `pwd` affiche un chemin absolu
✓ `ls` affiche une liste de fichiers/dossiers
✓ `cd Documents` ne produit pas d'erreur
✓ `pwd` après cd montre le nouveau chemin
✓ `cd ..` ramène au dossier parent
```

---

## 4. Patterns de déclenchement

### Mots-clés activateurs

L'IA doit détecter ces patterns pour basculer en mode exercice :

| Pattern | Exemples |
|---------|----------|
| Explicite | "mode exercice", "je veux faire les exercices" |
| Implicite | "je veux m'entraîner", "on commence ?" |
| Correction | "corrige-moi", "c'est bon ?", "j'ai fait ça" |
| Continuation | "exercice suivant", "on passe au 2" |
| Screenshot | [image uploadée] + contexte d'exercice |

### Anti-patterns (ne pas déclencher)

- "C'est quoi un exercice ?" → Question théorique
- "Montre-moi un exemple d'exercice" → Demande d'information
- "Je ne comprends pas l'exercice 3" → Demande d'explication

---

## 5. Bonnes pratiques de rédaction

### 5.1 Critères de validation

| ✅ Bon critère | ❌ Mauvais critère |
|---------------|-------------------|
| `ls` affiche README.md | L'utilisateur a bien fait |
| Le chemin contient /projets-git/ | Le pwd est correct |
| Pas de message d'erreur | Ça marche |

**Règle** : Un critère doit être **vérifiable objectivement** par l'IA, y compris sur un screenshot.

### 5.2 Progression pédagogique

```
Exercice 1 : Guidé pas à pas (commandes données)
Exercice 2 : Semi-guidé (objectif + indices)
Exercice 3 : Objectif seul
Exercice 4 : Défi autonome (aucune aide)
```

### 5.3 Gestion des erreurs courantes

Anticiper les erreurs fréquentes dans les instructions IA :

```markdown
ERREURS COURANTES À DÉTECTER :
• "cd document" au lieu de "cd documents" → Rappeler la sensibilité à la casse
• Oubli de `cd` avant manipulation → Vérifier le répertoire courant
• `rm` sans confirmation → Rappeler le danger de rm -r
```

---

## 6. Formats de sortie

### Formats recommandés

| Format | Avantage | Cas d'usage |
|--------|----------|-------------|
| **PDF** | Universel, non modifiable | Distribution finale |
| **DOCX** | Modifiable, images intégrées | Travail collaboratif |
| **Markdown** | Léger, versionnable | Développeurs, GitHub |

### Compatibilité IA testée

| IA | PDF | DOCX | MD | Screenshots |
|----|-----|------|----| ------------|
| ChatGPT (GPT-4) | ✅ | ✅ | ✅ | ✅ |
| Claude | ✅ | ✅ | ✅ | ✅ |
| Gemini | ✅ | ✅ | ✅ | ✅ |
| Mistral | ✅ | ⚠️ | ✅ | ⚠️ |

---

## 7. Cas d'usage business

### 7.1 Formation interne cabinet

```
Problème : Former 10 collaborateurs à Git, planning impossible
Solution : Document AED + chaque collaborateur s'entraîne à son rythme avec l'IA
Gain : 0 temps formateur, feedback personnalisé
```

### 7.2 Onboarding client

```
Problème : Clients livrés sur Odoo, formation chronophage
Solution : Guide utilisateur AED que le client utilise en autonomie
Gain : Réduction du support, montée en compétence accélérée
```

### 7.3 Vente de formations

```
Problème : Formations e-learning peu engageantes
Solution : Formations AED vendues en téléchargement
Différenciation : "Formation avec tuteur IA inclus"
```

### 7.4 Certification / Évaluation

```
Problème : Évaluer des compétences à distance
Solution : Document AED avec exercices + l'IA génère un rapport de validation
Livrable : Compte-rendu des critères validés/échoués
```

---

## 8. Évolutions possibles

### Court terme
- [ ] Tester sur 10 utilisateurs réels
- [ ] Mesurer le taux de complétion vs e-learning classique
- [ ] Documenter les cas où l'IA échoue à corriger

### Moyen terme
- [ ] Template générique réutilisable
- [ ] Générateur de critères de validation assisté par IA
- [ ] Intégration avec systèmes de suivi (qui a fait quoi)

### Long terme
- [ ] Standard ouvert "AED Format"
- [ ] Marketplace de documents AED
- [ ] Certification de conformité AED

---

## 9. Limites et risques

| Limite | Mitigation |
|--------|------------|
| Dépendance aux capacités de l'IA | Critères simples et objectifs |
| Évolution des modèles IA | Instructions robustes, pas de syntaxe spécifique |
| Triche possible | L'objectif est l'apprentissage, pas la certification |
| Pas de suivi centralisé | Acceptable pour formation interne |

---

## 10. Checklist de création d'un AED

### Avant de commencer
- [ ] Définir les objectifs pédagogiques
- [ ] Identifier le public cible
- [ ] Lister les compétences à valider

### Structure du document
- [ ] Section "Mode Exercice Interactif" en première page
- [ ] Instructions utilisateur (4 étapes max)
- [ ] Bloc "Instructions IA" clairement délimité
- [ ] Critères de validation pour chaque exercice

### Qualité des exercices
- [ ] Progression du guidé vers l'autonome
- [ ] Critères vérifiables objectivement
- [ ] Erreurs courantes anticipées
- [ ] Résultats attendus explicites

### Test
- [ ] Tester avec ChatGPT
- [ ] Tester avec Claude
- [ ] Tester avec un utilisateur naïf
- [ ] Valider que les screenshots sont bien interprétés

---

## 11. Exemple de référence

Le document **"Formation GitHub - Notes de formation"** est le premier AED créé avec cette méthodologie. Il contient :

- 5 exercices CLI progressifs
- 27 critères de validation
- Instructions IA complètes
- Support des screenshots

Ce document sert de **template de référence** pour les futurs AED.

---

## Annexe : Glossaire

| Terme | Définition |
|-------|------------|
| **AED** | AI-Executable Document — document auto-porteur avec instructions IA |
| **Critère de validation** | Condition vérifiable pour valider un exercice |
| **Déclencheur** | Mot ou phrase qui active le mode exercice |
| **Mode exercice** | État où l'IA agit comme tuteur/correcteur |
| **Agnostique** | Indépendant de la plateforme IA utilisée |

---

*Document de capitalisation — Knowledge Management — Experts-Entreprendre*
