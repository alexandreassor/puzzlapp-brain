# Phase Prototype - Outils et Prompts IA

Phase d'expérimentation et de matérialisation des concepts.

---

## 32. Exploration Map

**Objectif** : Visualiser le portfolio d'expérimentations et s'assurer que l'équipe explore un large éventail de solutions.

**Résultat IA** : Une évaluation stratégique du portfolio d'expériences sur la carte d'exploration.

### Prompts

#### Positionner les expériences
```
Voici trois expériences que nous avons menées : 1) [A/B test sur un bouton], 2) [Prototype papier d'un nouveau workflow], 3) [Test 'Wizard of Oz' pour un assistant IA]. Pour chacune, place-la sur la Carte d'Exploration (Zone de Confort, Zone d'Étirement, Zone de Risque, ou Zone Sombre) et justifie le placement.
```

#### Discuter de la position
```
Notre équipe a principalement mené des expériences dans la 'Zone de Confort'. Quels sont les risques de rester dans cette zone trop longtemps ? Quels sont les bénéfices de pousser vers les zones 'Étirement' ou 'Risque' ?
```

#### Planifier la prochaine expérience
```
Basé sur notre dernière expérience dans la [ex: Zone d'Étirement], quelle est une prochaine expérience logique qui nous pousserait dans la 'Zone de Risque' ? Décris l'expérience et ce que nous espérons en apprendre.
```

**Pro-tip** : Demande : "Agis comme un gestionnaire de portfolio d'innovation. En regardant notre répartition d'expériences sur la Carte d'Exploration, quel est notre 'profil de risque' ? Sommes-nous trop conservateurs ? Trop imprudents ? Suggère une nouvelle expérience qui équilibrerait mieux notre portfolio."

**Enchaînements** → Prototype to Test, Testing Sheet, Lessons Learned

---

## 33. Prototype to Test

**Objectif** : Définir intentionnellement les prototypes en clarifiant ce qui doit être appris et quelles hypothèses doivent être vérifiées.

**Résultat IA** : Un plan de test structuré incluant l'objectif d'apprentissage, la question centrale, une hypothèse testable, et des suggestions de fidélité.

### Prompts

#### Définir le "Pourquoi"
```
Nous avons une idée de [décrire idée]. Quelle est la plus grande hypothèse que nous faisons qui, si fausse, causerait l'échec de toute l'idée ? Formule cela comme une hypothèse testable. Quelle est la question centrale à laquelle nous devons répondre avec notre prochain prototype ?
```

#### Définir le "Comment" et "Quoi"
```
Basé sur notre question centrale [question], comment pourrions-nous rendre cela tangible pour un utilisateur ? Brainstorme trois concepts de prototype différents avec des niveaux de fidélité variés (ex: sketch papier, scénario de jeu de rôle, maquette cliquable). Pour chacun, décris ce que nous apprendrions.
```

#### Sélectionner et détailler
```
Notre équipe a choisi le prototype [ex: scénario de jeu de rôle]. Génère une description courte et détaillée de cette expérience. Quel est le setup, quelle est la tâche de l'utilisateur, et quels comportements spécifiques allons-nous observer ?
```

**Pro-tip** : Demande : "Agis comme un facilitateur 'pre-mortem'. Pour notre test de prototype planifié, quelles sont trois raisons pour lesquelles ce test pourrait échouer à nous donner une réponse claire ? (ex: question trop vague, prototype trompeur, mauvais utilisateurs testés). Cela aide à dé-risquer l'expérience."

**Enchaînements** → Testing Sheet, Service Blueprint, MVP

---

## 34. Service Blueprint

**Objectif** : Visualiser tous les composants d'un service en détail, incluant les processus visibles et cachés.

**Résultat IA** : Un blueprint de service structuré cartographiant les actions client vers les actions frontstage/backstage et identifiant les points de défaillance.

### Prompts

#### Blueprinter un processus
```
Créons un blueprint de service pour le processus de [ex: 'intégrer un nouveau collaborateur dans l'équipe']. Pour chaque action client (ex: arrive le premier jour, rencontre son manager, accède aux outils), liste les actions 'Frontstage' correspondantes (ce que le client voit) et les actions 'Backstage' (ce qui se passe en coulisses).
```

#### Identifier les risques
```
Basé sur ce blueprint de service : [détails blueprint], où sont les 3 plus grands risques ou points de défaillance potentiels ? (ex: où un passage de main entre deux départements pourrait mal tourner).
```

#### Améliorer le service
```
Voici un point de douleur dans notre blueprint : [décrire]. Brainstorme trois changements potentiels aux processus backstage ou systèmes de support qui pourraient éliminer ce problème pour le client.
```

**Pro-tip** : Demande : "Prends ce blueprint de service et ajoute une 'couche technologie'. Pour chaque action backstage, quel logiciel, base de données, ou appel API spécifique est requis pour la réaliser ? Cela aide à faire le pont entre la conception de service et l'implémentation technique."

**Enchaînements** → MVP, Roadmap for Implementation, Customer Journey

---

## 35. MVP - Minimum Viable Product

**Objectif** : Tester une hypothèse produit centrale avec le minimum d'effort et de ressources.

**Résultat IA** : Un périmètre MVP clairement défini incluant l'hypothèse centrale, les 3 fonctionnalités principales, et les métriques clés.

### Prompts

#### Définir le MVP
```
Notre vision produit est [décrire la vision complète]. Notre persona initial est [décrire persona]. Quel est le plus gros problème unique que nous devrions résoudre pour lui en premier ? Basé sur cela, définis un MVP en forme de T : décris la fonction centrale bout-en-bout (la barre verticale du T) et les 2-3 fonctionnalités essentielles qui la supportent (la barre horizontale).
```

#### Priorisation des fonctionnalités
```
Voici une liste de 10 fonctionnalités pour notre nouveau produit : [liste]. Lesquelles 3 sont absolument essentielles pour un MVP conçu pour tester l'hypothèse centrale que [énoncé d'hypothèse] ?
```

#### Définir la mesure
```
Pour notre MVP, comment pouvons-nous mesurer le succès ? Définis une 'métrique d'apprentissage' clé qui validera notre hypothèse centrale. Suggère une cible spécifique et mesurable pour cette métrique (ex: '20% des utilisateurs utiliseront la fonctionnalité centrale plus d'une fois dans la première semaine').
```

**Pro-tip** : Demande : "Décris trois types de MVP différents que nous pourrions construire pour tester notre idée : 1) Un MVP 'Concierge' (manuel, haut niveau de contact), 2) Un MVP 'Wizard of Oz' (backend simulé), et 3) Un MVP 'Landing Page'. Qu'apprendrions-nous de chacun ?"

**Enchaînements** → A/B Testing, Lean Canvas, Problem to Growth Funnel
