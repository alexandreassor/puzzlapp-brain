# Phase Reflect - Outils et Prompts IA

Phase de capitalisation et préparation de l'implémentation.

---

## 42. I like, I wish, I wonder

**Objectif** : Donner et recevoir du feedback de manière constructive, sûre, et positive.

**Résultat IA** : Un ensemble de prompts de feedback structurés et de réponses simulées pour adopter cet état d'esprit.

### Prompts

#### Faciliter une session de feedback
```
Nous allons donner du feedback sur la présentation du prototype d'un collègue. Pour faciliter une session 'I like, I wish, I wonder', génère deux questions de prompt pour chacune des trois catégories pour aider l'équipe à fournir un feedback spécifique et constructif.
```

#### Reformuler un feedback critique
```
J'ai ce feedback critique : ['L'interface utilisateur est encombrée et confuse']. Reformule ce feedback au format 'I wish...' pour le rendre plus constructif et moins confrontationnel.
```

#### Générer des questions 'I wonder'
```
Basé sur ce concept [décrire concept], génère trois questions 'I wonder...' puissantes. Ce devraient être des questions ouvertes qui éveillent la curiosité et suggèrent de nouvelles possibilités ou domaines à explorer.
```

**Pro-tip** : Demande : "Prends cette critique directe : [critique]. D'abord, reformule-la en utilisant 'I wish...'. Puis, reformule-la à nouveau en utilisant 'I wonder...'. Comment le focus du feedback change-t-il entre la formulation 'wish' et 'wonder' ?"

**Enchaînements** → Retrospective Sailboat, Lessons Learned, Agenda Canvas

---

## 43. Retrospective Sailboat

**Objectif** : Réfléchir sur un projet de manière visuelle et collaborative, identifiant les facteurs qui ont aidé ou freiné.

**Résultat IA** : Une analyse structurée des succès et défis du projet dans la métaphore du bateau.

### Prompts

#### Mise en place de la rétrospective
```
Nous lançons une rétrospective pour notre dernier sprint sur [nom du projet]. Génère un ensemble de questions de prompt pour chaque partie de la métaphore du Bateau : L'Île (Notre Vision/Objectifs), Le Vent (Qu'est-ce qui nous a poussés en avant ?), L'Ancre (Qu'est-ce qui nous a freinés ?), et Les Récifs (Quels sont les risques à venir ?).
```

#### Analyser le feedback
```
Voici le feedback de notre rétrospective Bateau : Vent=[feedback], Ancre=[feedback], Récifs=[feedback]. Synthétise cette information et identifie les 3 thèmes les plus importants. Pour chaque thème, suggère une mesure actionnable pour le prochain sprint.
```

#### Focus sur l'Ancre
```
Notre feedback 'Ancre' inclut [liste des freins]. Utilise la technique des '5 Pourquoi' pour creuser sur le frein le plus significatif et trouver sa cause racine.
```

**Pro-tip** : Demande : "Basé sur notre 'Vent' (ce qui a bien marché), quel est un 'super-pouvoir d'équipe' que nous avons découvert ce sprint ? Comment pouvons-nous délibérément exploiter ce super-pouvoir au prochain sprint pour aller plus vite ou atténuer un des 'Récifs' ?"

**Enchaînements** → Lessons Learned, Agenda Canvas, Design Principles

---

## 44. Create a Pitch

**Objectif** : Partager résultats et insights de manière persuasive avec les parties prenantes.

**Résultat IA** : Un plan de pitch deck structuré et un script narratif qui communique efficacement l'histoire du projet.

### Prompts

#### Structurer le pitch
```
Je dois créer un pitch de 5 minutes pour mon projet : [description projet]. Génère un plan slide-by-slide qui couvre : Intro, Problème, Clients, Solution/Idée, Business Model, et Prochaines Étapes. Pour chaque slide, liste le message clé à transmettre.
```

#### Créer l'histoire
```
En utilisant ces messages clés : [messages du plan], écris un script narratif convaincant pour le pitch. Commence avec un hook engageant qui introduit le problème via une histoire utilisateur.
```

#### Préparer le Q&A
```
Après mon pitch, quelles sont les 5 questions les plus difficiles qu'une partie prenante sceptique (comme un DAF ou un Responsable Conformité) pourrait poser ? Pour chaque question, suggère une réponse concise et efficace.
```

**Pro-tip** : Demande : "Enregistre-toi en pratiquant le pitch, puis donne-moi la transcription et demande : 'Agis comme un coach en communication. Analyse cette transcription de pitch pour la clarté, la persuasion, et la confiance. Où le langage est-il faible ? Quelle est la partie la plus confuse ? Suggère des améliorations spécifiques.'"

**Enchaînements** → NABC, Lean Canvas, Roadmap for Implementation

---

## 45. Lean Canvas

**Objectif** : Déconstruire un business model en ses hypothèses centrales de manière rapide et concise.

**Résultat IA** : Un Lean Canvas peuplé avec des hypothèses interconnectées, mettant en évidence les hypothèses les plus risquées.

### Prompts

#### Premier brouillon
```
J'ai une idée de [produit/service]. Mon client cible est [segment client]. Aide-moi à créer un premier brouillon de Lean Canvas. Passe par chacune des 9 cases et génère 1-2 hypothèses pour chacune.
```

#### Connecter les cases
```
Voici mon brouillon de Lean Canvas : [détails]. Analyse les connexions. Comment la 'Proposition de Valeur Unique' résout-elle directement le 'Problème' pour le 'Segment Client' ? Y a-t-il une ligne claire de la 'Solution' aux 'Flux de Revenus' ?
```

#### Identifier les risques
```
Basé sur ce Lean Canvas complété, quelles sont les 3 hypothèses les plus risquées que je fais ? (Les hypothèses qui, si fausses, feraient échouer tout le business model). Pour chacune, suggère une expérience simple pour la tester.
```

**Pro-tip** : Demande : "Prends ma Proposition de Valeur Unique et transforme-la en une analogie 'High-Level Concept' (ex: 'YouTube pour les chiens'). Génère trois analogies différentes et explique les avantages et inconvénients de chacune pour communiquer l'idée."

**Enchaînements** → MVP, Create a Pitch, Problem to Growth Funnel

---

## 46. Lessons Learned

**Objectif** : Réfléchir systématiquement sur un projet pour capturer les expériences positives et négatives.

**Résultat IA** : Un ensemble structuré de questions réflexives et un résumé synthétisé des apprentissages clés.

### Prompts

#### Structurer la session
```
Nous conduisons une session 'Lessons Learned' pour [nom projet]. Génère un ensemble de questions de facilitation pour le 'Niveau Projet' (ex: Quel a été notre plus grand défi inattendu ?) et le 'Niveau Méta' (ex: Comment aurions-nous pu utiliser le Design Thinking plus efficacement ?).
```

#### Synthétiser les inputs
```
Voici les notes brutes de notre session Lessons Learned : [notes]. Synthétise cette information en 3 apprentissages positifs clés (choses à répéter) et 3 apprentissages négatifs clés (choses à changer). Pour chaque apprentissage négatif, suggère un domaine d'action concret pour le prochain projet.
```

#### Réflexion niveau méta
```
Notre équipe a eu du mal avec [ex: passer de la recherche à l'idéation]. Que nous apprend cela sur comment nous appliquons le processus Design Thinking ? Quel changement spécifique pourrions-nous faire à notre processus au prochain projet pour adresser cela ?
```

**Pro-tip** : Demande : "Basé sur nos apprentissages clés, écris un court 'mémo à nos futurs nous-mêmes' que nous pouvons lire au kickoff de notre prochain projet. Le mémo devrait être un rappel concis et inspirant de nos leçons les plus importantes."

**Enchaînements** → Retrospective Sailboat, Agenda Canvas, Design Principles

---

## 47. Roadmap for Implementation

**Objectif** : Fournir une vue d'ensemble stratégique des étapes nécessaires pour transformer un concept validé en réalité.

**Résultat IA** : Une roadmap d'implémentation structurée avec phases, workstreams, et tâches clés.

### Prompts

#### Structurer la roadmap
```
Nous devons créer une roadmap d'implémentation pour notre [projet]. L'objectif est [objectif]. Brainstorme les tâches et jalons clés pour chacune des quatre phases : Design, Prototype, Acceptation du Concept, et Lancement.
```

#### Définir les workstreams
```
Pour la phase 'Prototype' de notre roadmap, quelles sont les tâches clés dans le workstream 'Conception de la Proposition de Valeur' versus le workstream 'Business Case' ?
```

#### Assigner les responsabilités
```
Voici une tâche sur notre roadmap : [tâche, ex: 'Finaliser le set de fonctionnalités MVP']. Quelles parties prenantes (ex: Product Manager, Lead Engineer, UX Designer) doivent être Responsables, Accountables, Consultées, et Informées (RACI) pour cette tâche ?
```

**Pro-tip** : Demande : "Prends cette roadmap d'implémentation et identifie le 'chemin critique' — la séquence de tâches qui détermine la durée minimum possible du projet. Quels sont les plus grands risques le long de ce chemin critique ?"

**Enchaînements** → Problem to Growth Funnel, Agenda Canvas, Define Success

---

## 48. Problem to Growth & Scale Innovation Funnel

**Objectif** : Gérer et visualiser un portfolio de projets d'innovation basé sur leur maturité.

**Résultat IA** : Un placement stratégique des projets dans l'entonnoir d'innovation avec justification et critères d'avancement.

### Prompts

#### Placement de projet
```
J'ai un projet où nous avons [décrire statut, ex: 'identifié un besoin client clair mais pas encore testé de solutions']. Dans quelle étape de l'entonnoir Problem to Growth & Scale (Distill, Validate, Prove, Invest, Scale) ce projet devrait-il être placé ? Pourquoi ?
```

#### Définir les critères stage-gate
```
Quels sont trois critères clairs et mesurables qu'un projet doit remplir pour passer de l'étape 'Validate (Problem-Solution Fit)' à l'étape 'Prove (Product-Market Fit)' ?
```

#### Équilibrage du portfolio
```
Notre portfolio d'innovation est fortement pondéré avec des projets 'Pipeline Extrapolation' (business existant). Suggère trois idées de projets 'Pipeline Retropolation' (sujets futurs) qui aideraient à équilibrer notre portfolio pour la croissance long terme.
```

**Pro-tip** : Demande : "Un projet a été 'Abandonné' à l'étape 'Prove'. Agis comme un facilitateur de rétrospective et génère trois questions puissantes pour aider l'équipe à réfléchir sur les causes. Les questions devraient se concentrer sur l'apprentissage, pas le blâme."

**Enchaînements** → Lean Canvas, Roadmap for Implementation, Lessons Learned

---

## 49. Digital Transformation Roadmap

**Objectif** : Intégrer les idées de produits et services digitaux dans un business model existant tout en développant un modèle futur.

**Résultat IA** : Une analyse structurée et un plan stratégique pour la transformation digitale.

### Prompts

#### Phase 1 : Réalité Digitale
```
Notre entreprise est [description cabinet]. Pour analyser notre 'Réalité Digitale', quelles sont cinq questions clés que nous devrions poser pour comprendre notre chaîne de valeur actuelle, business model, et exigences clients d'un point de vue digital ?
```

#### Phases 2 & 3 : Ambition & Potentiels
```
Notre 'Ambition Digitale' est de [ambition, ex: 'devenir le leader sur le conseil augmenté par l'IA']. Quels sont trois 'Potentiels Digitaux' (ex: bonnes pratiques, nouvelles technologies comme les chatbots IA, partenaires externes) que nous pourrions exploiter pour atteindre cela ?
```

#### Phases 4 & 5 : Fit & Implémentation
```
Nous considérons une option de [option, ex: 'implémenter un nouveau CRM avec assistant IA intégré']. Pour évaluer le 'Fit Digital', quels critères devrions-nous utiliser (ex: budget, faisabilité, culture d'entreprise) ? Pour planifier l''Implémentation Digitale', quelles sont les considérations clés concernant les interactions clients et les compétences des collaborateurs ?
```

**Pro-tip** : Demande : "Agis comme un Directeur Technique. Pour notre plan de transformation digitale, quelle est la plus grande 'dette technique' ou problème de système legacy que nous risquons de rencontrer ? Comment cela pourrait-il impacter notre timeline d'implémentation ?"

**Enchaînements** → Roadmap for Implementation, Blue Ocean Tool, Stakeholder Map

---

## 50. Agenda Canvas

**Objectif** : Planifier, implémenter, et suivre efficacement un atelier Design Thinking.

**Résultat IA** : Un agenda d'atelier structuré et réaliste avec objectifs, activités, et timings définis.

### Prompts

#### Planning - Design Challenge & Participants
```
Je dois planifier un atelier de [ex: 2 jours] pour [objectif, ex: 'réinventer notre processus d'intégration des nouveaux collaborateurs']. Les participants sont un mix de managers, collaborateurs seniors et juniors. Suggère 3 questions clés auxquelles nous devons répondre pour nous assurer que notre Design Challenge est à la fois pertinent et atteignable dans ce timing.
```

#### Dynamique de groupe
```
Pour un atelier avec un mix de leaders seniors et d'employés juniors, quelles sont deux activités ou techniques de facilitation spécifiques pour s'assurer que toutes les voix sont entendues et que les hiérarchies sont aplanies ?
```

#### Implémentation - Agenda
```
Génère un agenda high-level pour un atelier Design Thinking d'1 jour. L'objectif est de passer de la compréhension d'un problème client à des prototypes low-fidelity. Alloue des blocs de temps pour les phases clés : Comprendre, Définir, Idéer, et Prototyper.
```

#### Follow-up - Prochaines Étapes
```
Un atelier vient de se conclure, produisant trois concepts de prototype prometteurs. Quelles sont les 5 'Prochaines Étapes' les plus critiques qui doivent être définies et assignées pour s'assurer que le momentum n'est pas perdu ?
```

**Pro-tip** : Demande : "Agis comme un facilitateur expérimenté. Pour mon atelier planifié de [nombre] jours, quel est le plus grand risque pour son succès (ex: manquer de temps, objectifs flous, dynamiques de groupe) ? Suggère une stratégie de mitigation spécifique pour adresser ce risque."

**Enchaînements** → Define Success, Roadmap for Implementation, Lessons Learned
