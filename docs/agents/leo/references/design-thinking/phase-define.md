# Phase Define Point of View - Outils et Prompts IA

Phase de définition de la perspective utilisateur et des opportunités.

---

## 18. "How Might We..." Question

**Objectif** : Recadrer les problèmes et insights en questions optimistes et ouvertes qui stimulent la créativité.

**Résultat IA** : Un ensemble diversifié de questions HMW bien formulées à différents niveaux d'abstraction.

### Prompts

#### Générer des HMW à partir d'insights
```
Basé sur cet insight utilisateur : [ex: 'Les collaborateurs perdent beaucoup de temps à chercher où sont documentées les procédures internes'], génère cinq questions 'How Might We...' différentes. Essaie de varier le focus de chaque question.
```

#### Laddering de HMW
```
Prends ce problème central : [ex: 'Notre wiki interne est peu utilisé']. Génère des questions HMW en utilisant une technique de laddering : une très large (zoom arrière), une juste bien cadrée, et une très spécifique (zoom avant).
```

#### Recadrer depuis différentes perspectives
```
Notre HMW est 'Comment pourrions-nous rendre notre base de connaissances plus engageante ?' Recadre cette HMW depuis la perspective de a) un game designer, b) un psychologue comportemental, et c) un data analyst.
```

**Pro-tip** : Demande : "Prends cette HMW : [HMW]. Maintenant, génère trois 'mauvaises' HMW basées dessus — une trop étroite qui suggère une solution, une trop large et abstraite, et une non centrée utilisateur. Cela aide l'équipe à apprendre les principes d'une bonne formulation HMW."

**Enchaînements** → Brainstorming, Special Brainstorming, Analogies and Benchmarking

---

## 19. Storytelling

**Objectif** : Synthétiser et communiquer les découvertes de recherche de manière mémorable et persuasive.

**Résultat IA** : Un récit structuré et convaincant qui synthétise les découvertes, avec citations clés et conclusion claire.

### Prompts

#### Structurer un récit
```
Je dois raconter une histoire à mes parties prenantes. Voici les insights clés de ma recherche : [coller 3-5 points clés, citations utilisateurs, et points de douleur]. Structure cette information en arc narratif classique : introduction (l'utilisateur et son objectif), montée (le problème qu'il affronte), climax (le point de douleur le plus fort), et conclusion (le besoin non résolu).
```

#### Écrire l'histoire
```
Basé sur ce persona : [persona] et ce problème : [problème], écris une courte histoire de 200 mots qui illustre la lutte de l'utilisateur. Utilise un langage émotif et inclus au moins une citation utilisateur puissante (simulée).
```

#### Créer un pitch story
```
Génère une histoire 'pitch' de 30 secondes que je peux utiliser pour ouvrir une présentation. Elle doit rapidement introduire un utilisateur relatable, décrire son problème frustrant, et finir avec une question 'How Might We...' qui prépare notre solution.
```

**Pro-tip** : Demande : "Prends cette histoire et transforme-la en script de storyboard 6 panneaux. Pour chaque panneau, décris le visuel, l'action, et la narration accompagnante. C'est une excellente étape avant de créer des supports visuels."

**Enchaînements** → Create a Pitch, Context Mapping, Vision Cone

---

## 20. Context Mapping

**Objectif** : Comprendre le système et contexte plus large dans lequel un problème existe.

**Résultat IA** : Une liste complète de facteurs et forces à travers plusieurs catégories pertinentes au contexte utilisateur.

### Prompts

#### Peupler la carte
```
Je crée une carte de contexte pour un utilisateur essayant de [objectif, ex: 'monter en compétence rapidement sur les nouvelles normes']. Brainstorme les facteurs clés pour chacune de ces catégories : Démographie/Ethnologie, Économie/Efficience, Politiques/Systèmes, Environnement, Défis, et Incertitudes.
```

#### Identifier les connexions
```
Basé sur ces éléments de carte de contexte : [liste quelques éléments de différentes catégories], décris deux connexions potentielles ou relations causales entre eux. Par exemple, comment la 'Politique' de conformité réglementaire se connecte-t-elle au facteur 'Économique' de la pression sur les honoraires ?
```

#### Trouver l'espace blanc
```
Revois cette carte de contexte : [détails carte]. Quel est un domaine ou catégorie potentiel qui semble manquer ? Quelles questions devrions-nous poser sur cette pièce manquante ?
```

**Pro-tip** : Demande : "Prends deux forces opposées de cette carte de contexte (ex: 'Désir d'efficacité' vs 'Besoin de qualité de conseil'). Décris un scénario où un utilisateur est pris entre ces deux forces. Quels compromis difficiles doit-il faire ?"

**Enchaînements** → Stakeholder Map, Trend Analysis, Vision Cone

---

## 21. Define Success

**Objectif** : Aligner l'équipe et les parties prenantes sur une définition partagée et multi-facettes du succès.

**Résultat IA** : Un ensemble de métriques de succès mesurables à travers différentes perspectives stakeholders.

### Prompts

#### Générer des critères de succès
```
Nous lançons [produit/service, ex: un nouveau programme de formation KM interne]. Brainstorme une liste de métriques de succès depuis trois perspectives différentes : 1) Le Client/Utilisateur, 2) L'Entreprise, et 3) L'Équipe Projet.
```

#### Définir des KPIs
```
Notre objectif est de [objectif, ex: 'augmenter le taux d'utilisation de notre base documentaire']. Comment pourrions-nous mesurer cela ? Suggère un Indicateur Clé de Performance (KPI) principal et deux métriques secondaires pour suivre cet objectif.
```

#### S'aligner avec les stakeholders
```
Notre partie prenante principale est [stakeholder, ex: l'Associé en charge du développement]. Que signifie probablement 'succès' de notre projet pour lui ? Quelles sont les 3 métriques business qui l'intéresseraient le plus ?
```

**Pro-tip** : Demande : "Pour cette métrique de succès : [ex: 'engagement utilisateur'], définis une 'vanity metric' (une métrique qui a l'air bien mais n'est pas actionnable) et une 'actionable metric' (une métrique qui aide à prendre des décisions). Cela aide l'équipe à se concentrer sur ce qui compte vraiment."

**Enchaînements** → Roadmap for Implementation, Create a Pitch, Lean Canvas

---

## 22. Vision Cone

**Objectif** : Créer et explorer un état futur désirable puis travailler à rebours pour identifier les étapes nécessaires.

**Résultat IA** : Un ensemble de scénarios futurs plausibles et une liste d'actions "rétropolées" nécessaires aujourd'hui.

### Prompts

#### Cartographier passé et présent
```
Notre sujet est [sujet, ex: 'la gestion des connaissances en cabinet comptable']. Cartographions le Vision Cone. Pour le 'Passé', liste trois événements historiques clés ou innovations (ex: arrivée d'Internet, logiciels de compta, GED). Pour le 'Maintenant', décris le statu quo actuel.
```

#### Imaginer le futur
```
Continuons avec notre sujet. Génère trois 'Perspectives Futures' distinctes pour l'année 2030. Donne à chacune un nom accrocheur (ex: 'Le Cabinet Augmenté', 'Hyperspécialisation', 'Désintermédiation'). Décris les caractéristiques clés de chaque futur.
```

#### Rétropolation
```
Choisissons le futur 'Le Cabinet Augmenté' comme notre vision désirable. Agis comme un stratège et 'rétropole' vers aujourd'hui. Quels sont les 5 jalons ou percées clés (technologiques, réglementaires, culturels) qui devraient se produire entre maintenant et 2030 pour rendre ce futur réalité ?
```

**Pro-tip** : Demande : "Pour le futur désirable que nous avons défini, écris un court 'article de presse' de ce futur, décrivant comment le monde a changé en mieux. Cela rend la vision plus tangible et inspirante pour l'équipe."

**Enchaînements** → Storytelling, Roadmap for Implementation, Critical Items Diagram

---

## 23. Critical Items Diagram

**Objectif** : Structurer les découvertes de recherche et s'accorder sur les éléments de succès les plus critiques avant l'idéation.

**Résultat IA** : Une liste priorisée d'expériences et fonctions critiques pour l'utilisateur.

### Prompts

#### Brainstormer les items critiques
```
Basé sur nos découvertes de recherche qui [résumer les découvertes clés], brainstorme une liste d''expériences critiques' et de 'fonctions critiques' potentielles pour notre utilisateur. Génère 5 de chaque.
```

#### Projection future
```
Considérant les tendances de [ex: IA, transformation digitale, évolution réglementaire], quelles nouvelles 'expériences' et 'fonctions' deviendront critiques pour notre utilisateur dans les 5 prochaines années ?
```

#### Priorisation
```
Voici une liste de 15 expériences et fonctions potentielles : [liste]. Agis comme un product lead et sélectionne les 8 items les plus critiques. Fournis une brève justification pourquoi chacun est essentiel au succès de la solution.
```

**Pro-tip** : Demande : "Prends un des items critiques, par exemple [ex: 'Un sentiment de maîtrise']. Maintenant, décris la version 'table stakes' absolue de cela, et une version 'magique' ou 'delightful' de cette expérience. Cela aide à définir l'éventail des possibilités."

**Enchaînements** → "How Might We...", Prototype to Test, Brainstorming
