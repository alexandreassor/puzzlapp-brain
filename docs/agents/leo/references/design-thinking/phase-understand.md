# Phase Understand - Outils et Prompts IA

Phase de cadrage du problème et de compréhension du contexte.

---

## 1. Problem Statement

**Objectif** : Cadrer le défi design avec clarté via des questions "How Might We".

**Résultat IA** : Un ensemble de problem statements bien définis, centrés utilisateur, qui challengent les hypothèses initiales.

### Prompts

#### Questions préparatoires
```
Agis comme un analyste stratégique. Mon problème est [ex: faible adoption de notre outil de GED par les collaborateurs]. Pour chacune des catégories suivantes (Why, Who, What, When, Where, How), génère trois questions profondes qui aideraient une équipe à comprendre les causes racines et le contexte complet de ce problème.
```

#### Challenger les hypothèses
```
Mon problème déclaré est [problème]. Quelles sont trois hypothèses critiques et non-évidentes qui pourraient être intégrées dans cet énoncé et que nous devrions questionner ?
```

#### Itération Problem Statement
```
Étant donné ce contexte : [Coller les réponses aux questions préparatoires]. Génère trois énoncés "How Might We" distincts. Un large et ambitieux, un focalisé sur un point de douleur spécifique, et un provocateur de type "Et si...".
```

#### Critique du HMW
```
Critique cet énoncé de problème : [Coller le HMW]. Est-il trop large ? Trop étroit ? Suggère-t-il subtilement une solution ? Propose une amélioration pour le rendre plus puissant.
```

**Pro-tip** : Après avoir généré les HMW, demande : "Maintenant, agis comme un membre du conseil sceptique et critique ces HMW. Lequel est trop vague pour investir ? Lequel manque d'ambition ?"

**Enchaînements** → Interview for Empathy, Stakeholder Map, Design Principles

---

## 2. Design Principles

**Objectif** : Établir un ensemble de valeurs guides assurant cohérence et alignement.

**Résultat IA** : Une liste priorisée de principes de design avec justifications claires.

### Prompts

#### Brainstorming principes
```
Nous concevons [ex: un nouveau portail collaborateur pour notre cabinet comptable destiné aux seniors]. Brainstorme une liste de 10 principes de design potentiels. Pour chacun, fournis une phrase de justification expliquant pourquoi c'est important pour ce groupe d'utilisateurs.
```

#### Analyse benchmark
```
Analyse les principes de design de trois entreprises réussies dans différents secteurs : [ex: Notion, Slack, et Docusign]. Quels sont les thèmes communs ? Suggère trois principes universels que nous pourrions adapter.
```

#### Tri et sélection
```
Voici notre liste de principes brainstormés : [Liste]. Agis comme un chef de projet et trie-les en deux catégories : 'Bonnes Pratiques Générales' et 'Règles Spécifiques au Projet'. Recommande les 3 principes les plus critiques et explique ton raisonnement.
```

**Pro-tip** : Pour un principe comme "Simplicité", demande : "Génère trois exemples tangibles de comment le principe de 'Simplicité' se manifesterait dans l'interface. Que devrions-nous explicitement ÉVITER pour respecter ce principe ?"

**Enchaînements** → Define Success, Explorative Interview

---

## 3. Interview for Empathy

**Objectif** : Gagner une compréhension profonde et empathique du monde de l'utilisateur.

**Résultat IA** : Un ensemble complet de questions ouvertes empathiques et des simulations de réponses utilisateur.

### Prompts

#### Carte de questions
```
Je dois conduire un entretien d'empathie sur [sujet, ex: comment les collaborateurs gèrent leur montée en compétence sur les nouvelles réglementations]. Crée une carte de questions avec au moins 3 questions ouvertes puissantes pour chacune des catégories : Comment, Quoi, Quand, Qui, et Pourquoi. Les questions doivent éliciter des histoires, pas des réponses oui/non.
```

#### Parcours et émotions
```
Basé sur un entretien hypothétique sur [sujet], simule les 'Douleurs' et 'Gains' qu'un utilisateur pourrait exprimer. Pour chaque point, infère l'émotion sous-jacente (ex: anxiété, fierté, confusion, soulagement).
```

#### Analyse d'une réponse
```
Un utilisateur décrit le processus de [ex: recherche d'information dans nos bases documentaires] comme 'frustrant'. Décompose cela. Quelles actions spécifiques dans ce parcours pourraient causer ce sentiment ? Quels sont les points bas émotionnels potentiels ?
```

**Pro-tip** : Demande : "Génère un exemple de 'mauvais' script d'entretien plein de questions orientées et fermées. Puis réécris-le en version 'bonne' et empathique. Cela aide l'équipe à apprendre ce qu'il faut éviter."

**Enchaînements** → Empathy Map, Persona, Ask 5x Why

---

## 4. Explorative Interview

**Objectif** : Apprendre sur la vie quotidienne de l'utilisateur sans le biais d'une solution pré-existante.

**Résultat IA** : Un guide d'entretien structuré mais flexible conçu pour découvrir les besoins latents via des prompts narratifs.

### Prompts

#### Guide d'entretien
```
Crée un guide d'entretien exploratoire pour comprendre [sujet, ex: l'expérience de la transmission de dossier entre collaborateurs]. Génère 3 questions 'brise-glace', 5 questions 'raconte-moi toute l'histoire' qui explorent espoirs et peurs, et 2 questions de 'conclusion' sur les souhaits et rêves.
```

#### Approfondir
```
Un interviewé dit : 'La transmission de dossier, c'est toujours stressant.' Génère 5 questions de relance différentes 'Pourquoi ?' ou 'Dis-m'en plus sur...' pour déballer cette déclaration et découvrir les points de douleur spécifiques.
```

#### Simuler un dialogue
```
Simule un court dialogue où un intervieweur explore les espoirs et motivations derrière le désir d'un utilisateur de [ex: avoir accès à une base de connaissances centralisée].
```

**Pro-tip** : Demande : "Génère trois questions puissantes 'basées sur les artefacts' pour cet entretien. Ce sont des questions qui demandent à l'utilisateur de montrer quelque chose, comme 'Pouvez-vous me montrer l'outil que vous utilisez le plus pour [tâche] et me guider ?'"

**Enchaînements** → AEIOU, Jobs to be Done, Customer Journey

---

## 5. Ask 5x Why

**Objectif** : Dépasser les symptômes de surface pour découvrir la cause racine d'un problème.

**Résultat IA** : Une chaîne claire et logique de causalité révélant une cause racine.

### Prompts

#### Génération de chaîne causale
```
Faisons une analyse '5 Pourquoi'. Le problème de surface est : [ex: Les collaborateurs n'utilisent pas notre wiki interne]. Agis comme un manager et simule la chaîne de cinq questions 'Pourquoi' et réponses pour découvrir une cause racine potentielle.
```

#### Identifier les problèmes systémiques
```
Le problème initial est [problème]. Après avoir demandé 'Pourquoi ?' trois fois, la cause semble être [cause intermédiaire]. Quels types d'obstacles systémiques ou organisationnels pourraient être à l'origine de cette cause intermédiaire ?
```

#### Brainstorming solutions
```
La cause racine a été identifiée comme [cause racine]. Maintenant, pour chacune des 5 réponses 'Pourquoi' de la chaîne, brainstorme une solution potentielle ou intervention qui aurait pu briser la chaîne à ce point.
```

**Pro-tip** : Après avoir identifié une cause racine, demande : "Maintenant, effectue une analyse '5 Comment'. En partant de la cause racine, demande 'Comment pouvons-nous résoudre cela ?' cinq fois pour générer une chaîne de solutions potentielles, du stratégique au tactique."

**Enchaînements** → Problem Statement, "How Might We...", Context Mapping

---

## 6. Five WH Questions

**Objectif** : Gagner une compréhension holistique en explorant les dimensions fondamentales.

**Résultat IA** : Une banque de questions complète couvrant toutes les facettes du problème.

### Prompts

#### Compréhension complète
```
Mon projet concerne [sujet, ex: améliorer l'expérience d'intégration des nouveaux collaborateurs]. Génère un ensemble de questions 5W+H pour aider mon équipe à avoir une vue complète. Pour chacune des 6 catégories, fournis deux questions profondes et perspicaces.
```

#### Préparation observation
```
Nous allons observer comment les utilisateurs [effectuent une tâche, ex: recherchent une information dans les archives]. Crée un guide d'observation 5W+H. Quelles choses spécifiques devrions-nous chercher sous 'Qui', 'Quoi', 'Où', etc. ?
```

#### Déconstruire une découverte
```
Prends cette découverte de recherche : ['Les collaborateurs reportent se sentir perdus lors de leur premier mois']. Utilise le framework 5W+H pour déconstruire cette découverte et identifier ce que nous ne savons toujours pas sur la situation.
```

**Pro-tip** : Après avoir obtenu les réponses 5W+H, demande : "Basé sur ces réponses, quel est l'insight le plus surprenant ou contradictoire ? Formule une question 'Pourquoi ?' de suivi pour explorer cette contradiction."

**Enchaînements** → Jobs to be Done, Persona, Context Mapping

---

## 7. Jobs to be Done

**Objectif** : Se concentrer sur la motivation sous-jacente de l'utilisateur plutôt que sur les caractéristiques démographiques ou produit.

**Résultat IA** : Un ensemble d'énoncés JTBD bien formulés révélant les vraies motivations et résultats désirés.

### Prompts

#### Formulation JTBD
```
Mon persona est [description persona]. Il essaie de [atteindre un objectif]. Génère trois énoncés 'Jobs to be Done' distincts en utilisant le format 'Quand..., je veux..., afin de...'. Un devrait être fonctionnel, un social, et un émotionnel.
```

#### Analyse produit/service
```
Analyse ce service : [description, ex: notre plateforme de formation en ligne interne]. Quels sont les principaux 'jobs' pour lesquels les collaborateurs l'engagent ? Va au-delà des fonctionnalités évidentes pour considérer les jobs émotionnels et sociaux.
```

#### Analyse des solutions de contournement
```
Notre utilisateur utilise actuellement [solution actuelle ou contournement, ex: demander aux collègues par email ou Teams] pour résoudre son problème. Qu'est-ce que cela nous dit sur le 'job' qu'il essaie d'accomplir ? Quelles sont les douleurs de sa solution actuelle ?
```

**Pro-tip** : Après avoir défini un JTBD, demande : "Quelles sont les 'forces du progrès' qui pousseraient un utilisateur à adopter une nouvelle solution pour ce job ? Considère les push de la situation, les pull de la nouvelle idée, les anxiétés du changement, et les habitudes du présent."

**Enchaînements** → Blue Ocean Tool, NABC, "How Might We..."

---

## 8. Extreme Users/Lead Users

**Objectif** : Découvrir des besoins et solutions innovantes que les utilisateurs moyens ne peuvent pas encore articuler.

**Résultat IA** : Un profil d'utilisateurs extrêmes/lead users potentiels avec des hypothèses sur leurs besoins uniques.

### Prompts

#### Identifier les archétypes
```
Nous concevons une solution pour [domaine, ex: la gestion des connaissances dans un cabinet comptable]. Identifie trois archétypes d'utilisateurs extrêmes que nous devrions interviewer (ex: un novice, un expert, un utilisateur avec une contrainte spécifique). Pour chacun, décris ses caractéristiques et les besoins uniques qu'il pourrait avoir.
```

#### Profil lead user
```
Notre produit est [description]. Qui serait un 'lead user' pour cela ? Décris les caractéristiques de quelqu'un qui pousse les limites de ce que ce produit peut faire et pourrait créer ses propres solutions ou 'hacks'.
```

#### Analyser les contournements
```
Un utilisateur extrême [ex: un senior manager gérant 20 dossiers complexes] a un contournement pour [problème]. Que nous apprend ce contournement sur les besoins potentiels non satisfaits de l'utilisateur moyen ?
```

**Pro-tip** : Demande : "Imagine que tu es cet utilisateur extrême. Écris une review produit pour un produit 'parfait' imaginaire qui résout tes besoins uniques. Quelles fonctionnalités a-t-il qu'aucun produit actuel n'offre ?"

**Enchaînements** → Interview for Empathy, Analogies and Benchmarking, Trend Analysis

---

## 9. Stakeholder Map

**Objectif** : Obtenir une vue holistique de tous ceux qui ont un intérêt ou sont affectés par le projet.

**Résultat IA** : Une liste complète des parties prenantes catégorisées par leur influence et intérêt potentiels.

### Prompts

#### Identification stakeholders
```
Notre projet est de [description, ex: déployer une base de connaissances centralisée dans le cabinet]. Brainstorme une liste complète de toutes les parties prenantes potentielles. Catégorise-les en Internes, Externes, et Publiques.
```

#### Analyse des relations
```
Pour notre projet, deux parties prenantes clés sont [ex: le Responsable IT] et [ex: les Collaborateurs comptables]. Quels sont probablement les objectifs, motivations, et points de conflit potentiels entre ces deux groupes ?
```

#### Stratégie d'engagement
```
Génère une liste de questions clés que nous devrions poser à nos parties prenantes principales (comme [nom stakeholder]) pour comprendre leurs besoins et attentes pour ce projet.
```

**Pro-tip** : Après la cartographie, demande : "Crée un simple plan de communication. Pour chaque groupe de parties prenantes clés, quel est le message clé à transmettre, quelle est leur préoccupation principale à adresser, et quel est le meilleur canal pour les atteindre ?"

**Enchaînements** → Define Success, Roadmap for Implementation, Create a Pitch

---

## 10. Emotional Response Cards

**Objectif** : Aider les utilisateurs à articuler leurs sentiments et réactions émotionnelles à une expérience.

**Résultat IA** : Une liste d'adjectifs curatée pour les cartes de réponse émotionnelle et des questions de suivi.

### Prompts

#### Génération de cartes
```
Génère une liste de 20 adjectifs pour un ensemble de Cartes de Réponse Émotionnelle. Les cartes seront utilisées pour obtenir du feedback sur [type de produit, ex: notre nouveau tableau de bord de suivi de dossiers]. Inclus un mélange équilibré de mots positifs et négatifs.
```

#### Préparation entretien
```
Un utilisateur a sélectionné les cartes 'Confus', 'Professionnel', et 'Lent' pour décrire son expérience avec notre prototype. Génère trois questions 'Pourquoi ?' de suivi pour chaque carte afin de comprendre les raisons derrière ses choix.
```

#### Test comparatif
```
Nous voulons tester si notre nouveau design semble plus [émotion désirée, ex: 'rassurant'] que l'ancien. Quelles sont 5 paires d'adjectifs opposés (ex: Rassurant vs Inquiétant) que nous pourrions utiliser sur les cartes de réponse pour mesurer cette dimension spécifique ?
```

**Pro-tip** : Demande : "Un utilisateur a choisi le mot 'Efficace'. Cela pourrait être interprété positivement (rapide, productif) ou négativement (froid, sans âme). Quelles sont deux questions de suivi différentes pour comprendre son sens spécifique ?"

**Enchaînements** → Feedback Capture Grid, Solution Interview, I like I wish I wonder
