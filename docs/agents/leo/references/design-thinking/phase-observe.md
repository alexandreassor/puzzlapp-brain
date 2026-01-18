# Phase Observe - Outils et Prompts IA

Phase de synthèse de la recherche et de construction de l'empathie.

---

## 11. Empathy Map

**Objectif** : Synthétiser la recherche et construire une compréhension partagée et profonde du monde de l'utilisateur.

**Résultat IA** : Une Empathy Map peuplée révélant les contradictions et insights profonds sur l'expérience utilisateur.

### Prompts

#### Synthèse de recherche
```
Voici mes notes brutes d'entretien avec un utilisateur : [coller les notes]. Agis comme un chercheur utilisateur et peuple une Empathy Map basée sur ces informations. Remplis les quadrants 'Dit', 'Pense', 'Fait', et 'Ressent'. Puis, infère les principales 'Douleurs' et 'Gains'.
```

#### Identifier les contradictions
```
Basé sur cette Empathy Map peuplée : [détails de la map], quelles sont les contradictions les plus significatives entre ce que l'utilisateur DIT et ce qu'il FAIT ? Qu'impliquent ces contradictions sur ses vrais besoins ?
```

#### Pré-peupler avant recherche
```
Nous allons rechercher l'expérience de [type utilisateur, ex: un nouveau collaborateur pendant ses 3 premiers mois]. Génère une Empathy Map hypothétique basée sur les connaissances communes. Cela servira de point de départ d'hypothèses à valider.
```

**Pro-tip** : Après avoir rempli la map, demande : "Transforme les 'Douleurs' et 'Gains' de cette Empathy Map en une série de questions 'How Might We...'. Cela connecte directement ta synthèse de recherche à la phase d'idéation."

**Enchaînements** → Persona, Storytelling, "How Might We..."

---

## 12. Persona/User Profile

**Objectif** : Créer une représentation réaliste et mémorable d'un segment utilisateur clé.

**Résultat IA** : Un profil persona détaillé et narratif basé sur les données de recherche.

### Prompts

#### Génération de persona
```
Basé sur ces insights de recherche : [résumé des entretiens, empathy map, etc.], génère un persona utilisateur détaillé. Donne-lui un nom, une suggestion de photo, une citation, une bio, des objectifs, et des frustrations (douleurs). Fais de la bio une courte histoire narrative.
```

#### Construction de scénario
```
Pour ce persona : [détails persona], écris un court scénario 'une journée dans la vie' où il rencontre le problème que nous essayons de résoudre.
```

#### Approfondir le profil
```
Approfondissons ce persona : [coller persona]. Quels sont ses 'Jobs to be Done' ? Quelles tendances pourraient l'influencer ? Et qui sont ses principaux influenceurs (famille, collègues, etc.) ?
```

**Pro-tip** : Demande : "Agis comme ce persona. Je vais te décrire une nouvelle fonctionnalité. S'il te plaît, donne-moi ton feedback honnête, en caractère, en utilisant tes propres mots et exprimant tes motivations et frustrations uniques."

**Enchaînements** → Customer Journey, Storytelling, Brainstorming

---

## 13. Customer Journey

**Objectif** : Comprendre et visualiser l'expérience bout-en-bout de l'utilisateur, identifiant les moments de joie et de frustration.

**Résultat IA** : Une carte de parcours structurée avec phases, actions, pensées, et hauts/bas émotionnels.

### Prompts

#### Cartographie du parcours
```
Crée une carte de parcours client pour ce persona : [persona]. Le scénario est [ex: 'rechercher et trouver une information technique sur une nouvelle réglementation fiscale']. Découpe le parcours en phases clés (ex: Déclencheur, Recherche, Consultation, Application). Pour chaque phase, liste les actions de l'utilisateur, ses pensées, et ses émotions potentielles.
```

#### Identifier les points de douleur
```
Basé sur cette carte de parcours : [détails parcours], identifie les trois 'moments de misère' ou points de douleur les plus critiques. Pour chacun, explique pourquoi c'est un problème pour l'utilisateur.
```

#### Brainstormer les opportunités
```
Pour chaque point de douleur identifié dans le parcours, brainstorme une 'opportunité' ou question 'How Might We...' d'amélioration.
```

**Pro-tip** : Demande : "Prends cette carte de parcours client et crée une vue 'service blueprint'. Pour chaque action client, quelles sont les actions correspondantes 'frontstage' (ex: interface visible) et 'backstage' (ex: processus internes) que l'organisation doit effectuer ?"

**Enchaînements** → Service Blueprint, Critical Items Diagram, Ideate

---

## 14. AEIOU

**Objectif** : Fournir un framework structuré pour les observations terrain assurant une vue holistique.

**Résultat IA** : Un guide d'observation structuré avec des questions spécifiques pour chaque catégorie AEIOU.

### Prompts

#### Créer un guide d'observation
```
Je vais dans [lieu, ex: un open space de collaborateurs comptables] pour observer comment les gens [activité, ex: partagent des informations entre eux]. Crée un guide d'observation utilisant le framework AEIOU. Pour chacune des 5 catégories (Activités, Environnements, Interactions, Objets, Utilisateurs), fournis 3 questions spécifiques auxquelles je devrais essayer de répondre.
```

#### Synthétiser les observations
```
Voici mes notes brutes d'observation terrain : [coller notes]. Organise ces notes dans le framework AEIOU. Extrais la découverte la plus significative de chaque catégorie.
```

#### Générer des insights
```
Basé sur ces notes AEIOU catégorisées : [notes organisées], quel est l'insight le plus surprenant sur [ex: l'environnement] de l'utilisateur ? Comment l'interaction entre [un objet] et [une activité] crée-t-elle un problème ?
```

**Pro-tip** : Demande : "À partir de ces observations AEIOU, génère une déclaration 'Et si...' qui challenge une hypothèse fondamentale sur le comportement de l'utilisateur. Par exemple, 'Et si l'objet le plus important n'était pas son ordinateur, mais son carnet de notes papier ?'"

**Enchaînements** → Peers Observing Peers, Empathy Map, Context Mapping

---

## 15. Analysis Question Builder

**Objectif** : Préparer l'analyse de données ciblée en commençant par des questions spécifiques.

**Résultat IA** : Un ensemble structuré de questions analytiques et d'hypothèses sur les facteurs influents.

### Prompts

#### Définir l'analyse
```
Le centre de notre analyse est [focus, ex: le taux de rotation du personnel dans notre cabinet]. Brainstorme une mind map des 'facteurs influents' potentiels qui pourraient contribuer à cela.
```

#### Générer des questions
```
Pour le facteur influent [facteur, ex: 'charge de travail pendant les pics d'activité'], génère 5 questions WH spécifiques que nous pourrions investiguer avec des données. Pour chaque question, suggère une source de données potentielle (ex: données RH, timesheets, enquêtes internes).
```

#### Formulation d'hypothèses
```
Basé sur la question [question, ex: 'Quel est le nombre moyen d'heures sup pendant la période fiscale ?'], formule une hypothèse claire et testable.
```

**Pro-tip** : Demande : "Agis comme un data scientist. Voici ma question d'analyse : [question]. Quels sont les pièges potentiels ou biais dont je devrais être conscient en essayant de répondre avec [source de données] ? Par exemple, corrélation vs causalité."

**Enchaînements** → Trend Analysis, Define Success, Lean Canvas

---

## 16. Peers Observing Peers

**Objectif** : Obtenir des insights authentiques sur un processus vécu en faisant observer des collègues entre eux.

**Résultat IA** : Un protocole d'observation clair et des questions interprétatives pour séparer observation et hypothèse.

### Prompts

#### Mise en place de l'observation
```
Nous voulons mettre en place une session 'Pairs Observant Pairs' pour la tâche de [tâche, ex: 'répondre à une question client complexe']. Crée une feuille d'observation simple pour l'observateur. Quelles sont 5 choses clés qu'il devrait chercher et documenter ?
```

#### Différencier observation et interprétation
```
Un observateur note : 'Elle semblait stressée par le logiciel.' C'est une interprétation. Reformule cela comme une pure observation. Puis, génère trois questions de suivi que l'observateur pourrait poser à son pair pour valider cette interprétation.
```

#### Synthétiser les découvertes
```
Voici les notes d'observation de trois sessions 'Pairs Observant Pairs' différentes : [coller notes]. Synthétise ces notes pour identifier un contournement commun, un comportement surprenant, et un apprentissage clé.
```

**Pro-tip** : Demande : "Agis comme un coach pour la personne observée. Après la session, quelles sont trois questions puissantes et non-jugeantes que tu pourrais lui poser pour stimuler sa propre réflexion sur le processus ?"

**Enchaînements** → Service Blueprint, Customer Journey, Brainstorming

---

## 17. Trend Analysis

**Objectif** : Identifier et comprendre les tendances macro qui pourraient impacter l'espace problème.

**Résultat IA** : Une liste curatée de mégatendances pertinentes et des scénarios "et si" basés sur leurs intersections.

### Prompts

#### Identification des tendances
```
Notre projet est dans le domaine de [secteur, ex: l'expertise comptable et la gestion des connaissances]. Identifie 5 mégatendances majeures (ex: facturation électronique, IA générative, pénurie de talents) qui sont pertinentes. Pour chaque tendance, liste trois manifestations ou sous-tendances spécifiques.
```

#### Analyse des intersections
```
Prends deux tendances : [ex: Montée de l'IA générative] et [ex: Financiarisation de la profession comptable]. Décris trois opportunités de produit ou service nouvelles qui pourraient exister à l'intersection de ces deux tendances.
```

#### Clustering par affinité
```
Voici une liste de sujets liés aux tendances : [liste]. Regroupe-les en 3-5 groupes significatifs en utilisant une logique de diagramme d'affinité et donne à chaque cluster un nom descriptif.
```

**Pro-tip** : Demande : "Prends une tendance clé comme [ex: 'automatisation des tâches répétitives']. Maintenant, agis comme un contrarian et argumente pourquoi cette tendance pourrait être une mode ou avoir des conséquences négatives significatives. Cela aide à challenger les hypothèses et préparer les risques."

**Enchaînements** → Vision Cone, Blue Ocean Tool, Problem Statement
