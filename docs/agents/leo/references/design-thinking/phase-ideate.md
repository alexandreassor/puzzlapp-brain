# Phase Ideate - Outils et Prompts IA

Phase de génération et priorisation des idées.

---

## 24. Brainstorming

**Objectif** : Générer une grande quantité et variété d'idées en peu de temps.

**Résultat IA** : Un grand volume d'idées diverses incluant des variations et des "builds" sur les concepts initiaux.

### Prompts

#### Brainstorming ouvert
```
Faisons un brainstorming. Notre question 'How Might We' est : [HMW]. Génère 20 idées, allant du pratique au fou et absurde. Utilise des bullet points.
```

#### Construire sur les idées
```
Voici une idée initiale : [ex: 'Une base de connaissances avec recherche sémantique']. Maintenant, construis sur cette idée. Suggère 5 variations ou améliorations de ce concept central.
```

#### Brainstorming structuré
```
Faisons un brainstorm structuré sur notre HMW. Génère 3 idées pour chacune de ces catégories : 1) Solutions technologiques, 2) Solutions basées sur les services/processus, et 3) Solutions low-tech/no-tech.
```

**Pro-tip** : Demande : "Prends notre question HMW et agis comme un 'brainstormer inversé'. Au lieu de résoudre le problème, génère 10 idées sur comment rendre le problème pire. Puis, pour chaque 'mauvaise idée', retourne-la pour créer une solution positive innovante."

**Enchaînements** → 2x2-Matrix, Dot Voting, NABC

---

## 25. 2x2-Matrix

**Objectif** : Catégoriser, trier, et prioriser les idées visuellement.

**Résultat IA** : Un tri logique des idées dans une matrice 2x2 avec justification des axes et placements.

### Prompts

#### Définir les axes
```
Nous devons prioriser une liste d'idées de nouvelles fonctionnalités. Suggère trois frameworks de matrice 2x2 différents et significatifs que nous pourrions utiliser (ex: Valeur Utilisateur vs Valeur Business, Innovation vs Faisabilité). Pour chacun, explique quel type de conversation il stimulerait.
```

#### Positionner les idées
```
Utilisons une matrice 'Impact vs Effort'. Voici une liste d'idées : [5-10 idées]. Pour chaque idée, estime brièvement son impact (Haut/Bas) et son effort (Haut/Bas) et place-la dans le bon quadrant.
```

#### Analyser la matrice
```
Voici le résultat de notre exercice de matrice 2x2 : [décrire quelles idées sont dans quel quadrant]. Basé sur cela, quels sont nos 'quick wins' (Impact Haut, Effort Bas) ? Quelles sont nos 'initiatives stratégiques' (Impact Haut, Effort Haut) ? Et quel est un pattern surprenant ou espace vide sur cette carte ?
```

**Pro-tip** : Demande : "Nous avons identifié une idée dans le quadrant 'Impact Haut, Effort Haut'. Décompose cette grande idée en trois 'phases' ou fonctionnalités plus petites et plus gérables qui pourraient être placées sur la matrice. Cela aide à dé-risquer les gros paris."

**Enchaînements** → Dot Voting, Roadmap for Implementation, Prototype to Test

---

## 26. Dot Voting

**Objectif** : Prendre des décisions rapidement et démocratiquement sur une liste d'options.

**Résultat IA** : Un ensemble clair de critères d'évaluation non biaisés pour guider la session de vote.

### Prompts

#### Définir les critères de vote
```
Notre équipe va voter par points sur un ensemble de 15 idées. Pour nous assurer que nous sommes alignés, génère une liste de 5 critères d'évaluation clairs. L'objectif du projet est [objectif]. Les critères devraient être formulés comme questions, ex: 'Cette idée adresse-t-elle directement le point de douleur principal de notre persona ?'
```

#### Simuler un vote
```
Voici trois idées : A) [idée A], B) [idée B], C) [idée C]. Et voici nos critères de vote : [critères]. Agis comme trois membres d'équipe différents (un pragmatique, un visionnaire, un défenseur de l'utilisateur) et explique comment chacun distribuerait ses 3 votes et pourquoi.
```

#### Discussion post-vote
```
Le vote par points est terminé. L'idée A a eu 10 votes, l'idée B 9 votes, et l'idée C 1 vote. Génère un ensemble de questions de discussion pour aider l'équipe à comprendre les résultats. Inclus des questions sur les idées gagnantes, celles qui étaient proches, et les outliers surprenants.
```

**Pro-tip** : Demande : "L'idée gagnante est [idée]. Cependant, elle est très complexe. L'idée avec un seul vote était très simple mais innovante. Quelle est une idée 'mash-up' potentielle qui combine la valeur utilisateur centrale de l'idée gagnante avec la simplicité de l'idée outlier ?"

**Enchaînements** → Prototype to Test, Brainwriting, NABC

---

## 27. Brainwriting/6-3-5-Method

**Objectif** : Générer et construire sur les idées de manière structurée, silencieuse, et collaborative.

**Résultat IA** : Une session de brainwriting simulée générant une chaîne d'idées évoluant.

### Prompts

#### Lancer la session
```
Notre problème est [énoncé ou HMW]. Pour démarrer notre session de brainwriting 6-3-5, génère 3 idées initiales distinctes. Elles devraient être assez différentes pour inspirer des trains de pensée variés.
```

#### Simuler un tour
```
Voici les idées du tour précédent : 1) [idée 1], 2) [idée 2], 3) [idée 3]. Agis comme le prochain participant de la session de brainwriting. Pour chacune des trois idées, fournis une nouvelle idée qui construit dessus, les combine, ou est inspirée par l'originale.
```

#### Consolider et clusteriser
```
Voici l'output complet d'une session de brainwriting 6-3-5 : [liste de toutes les idées générées]. Analyse la liste et identifie 3-5 thèmes ou clusters de concepts émergents. Donne à chaque cluster un nom et liste les idées clés qui y appartiennent.
```

**Pro-tip** : Demande : "Après la session de brainwriting, nous avons un cluster prometteur d'idées autour de [thème]. Synthétise ces idées liées en un seul 'énoncé de concept' plus robuste qui capture les meilleurs éléments du cluster."

**Enchaînements** → 2x2-Matrix, Dot Voting, Special Brainstorming

---

## 28. Special Brainstorming

**Objectif** : Sortir des schémas de pensée conventionnels quand le groupe est bloqué.

**Résultat IA** : Des prompts créatifs et outputs simulés pour diverses techniques de brainstorming spéciales.

### Prompts

#### Negative Brainstorming
```
Faisons un Brainstorm Négatif pour notre HMW : [HMW]. Génère 10 idées sur comment nous pourrions rendre ce problème significativement pire pour l'utilisateur. Puis, pour les 3 meilleures 'mauvaises idées', retourne-les en solutions positives innovantes.
```

#### Figuring Storming
```
Comment [personne célèbre, ex: Marie Kondo, Steve Jobs, ou un personnage fictif comme Sherlock Holmes] résoudrait ce problème : [énoncé] ? Décris son approche unique et les 3 meilleures idées qu'il/elle pourrait générer.
```

#### Préparation Bodystorming
```
Nous allons bodystormer l'expérience de [scénario, ex: un nouveau collaborateur cherchant comment faire sa première clôture annuelle]. Quels sont 5 props, actions, ou facteurs environnementaux spécifiques que nous devrions simuler pour rendre l'expérience aussi réaliste que possible ?
```

**Pro-tip** : Demande : "Combine deux techniques. Comment [personne célèbre] aborderait un Brainstorm Négatif pour notre problème ? Quelles idées délicieusement machiavéliques trouverait-il pour rendre le problème pire ?"

**Enchaînements** → Analogies and Benchmarking, Prototype to Test, 2x2-Matrix

---

## 29. Analogies and Benchmarking

**Objectif** : Trouver inspiration et solutions nouvelles en regardant comment des problèmes similaires sont résolus ailleurs.

**Résultat IA** : Une liste d'analogies pertinentes de domaines divers et les principes transférables.

### Prompts

#### Trouver des analogies
```
Le défi central de notre problème est [défi, ex: 'gérer un flux de travail complexe avec beaucoup de passages de main']. Trouve trois analogies pour ce défi dans différents domaines (ex: une cuisine de restaurant, une tour de contrôle aérien, une colonie de fourmis). Pour chacune, explique l'analogie.
```

#### Extraire les principes
```
Utilisons l'analogie d'un [ex: équipe de pit stop F1] pour résoudre notre problème de [ex: 'accélérer notre processus de production des bilans']. Quels sont les 5 principes clés qu'une équipe de pit stop utilise pour atteindre rapidité et précision ? (ex: spécialisation extrême, traitement parallèle, mouvements chorégraphiés).
```

#### Adapter les solutions
```
Basé sur le principe de [ex: 'biomimicry d'une ruche'], génère trois idées concrètes sur comment nous pourrions améliorer notre [produit/service, ex: logiciel de collaboration d'équipe].
```

**Pro-tip** : Demande : "Crée un prompt 'Analogie Forcée'. Combine notre problème [problème] avec un objet aléatoire [ex: un thermostat]. En quoi notre problème ressemble-t-il à un thermostat ? Que pouvons-nous apprendre de son fonctionnement pour résoudre notre problème ?"

**Enchaînements** → Brainstorming, Blue Ocean Tool, Storytelling

---

## 30. NABC

**Objectif** : Structurer et communiquer une idée business de manière claire et concise.

**Résultat IA** : Un pitch NABC bien structuré articulant la proposition de valeur et différenciation.

### Prompts

#### Structurer une idée
```
J'ai une idée : [décrire brièvement]. Structure cette idée en utilisant le framework NABC. Pour chacune des quatre sections (Need, Approach, Benefit, Competition), écris 2-3 bullet points qui expliquent clairement ce composant.
```

#### Renforcer le "Benefit"
```
Voici mon NABC : [NABC draft]. La section 'Benefit' est faible. Aide-moi à la renforcer. Génère trois bénéfices quantitatifs (ex: économise X heures, augmente le chiffre de Y%) et trois bénéfices qualitatifs (ex: réduit le stress, améliore le moral de l'équipe).
```

#### Analyser la "Competition"
```
Pour notre idée, les concurrents directs sont [liste]. Mais quelles sont les solutions indirectes ou alternatives que les clients utilisent aujourd'hui ? Aide-moi à identifier la compétition non-évidente pour renforcer le 'C' de notre NABC.
```

**Pro-tip** : Demande : "Prends ce NABC complété et transforme-le en un script de 'pitch elevator' de 60 secondes. Le script doit être conversationnel, persuasif, et mémorable."

**Enchaînements** → Create a Pitch, Lean Canvas, Solution Interview

---

## 31. Blue Ocean Tool & Buyer-Utility-Map

**Objectif** : Créer une proposition de valeur unique en identifiant un espace de marché inexploré.

**Résultat IA** : Une analyse stratégique utilisant le Four Actions Framework et identification d'un nouvel espace de marché.

### Prompts

#### Analyser l'océan rouge
```
Notre industrie est [industrie, ex: la formation professionnelle en cabinet comptable]. Quels sont les 5 principaux facteurs sur lesquels toutes les entreprises de ce secteur se font concurrence ? (ex: prix, durée, certifications, formats).
```

#### Appliquer le Four Actions Framework
```
Créons une stratégie Blue Ocean pour un nouveau programme de formation. En utilisant le Four Actions Framework, suggère : 1) Un facteur à ÉLIMINER, 2) Un à RÉDUIRE, 3) Un à ÉLEVER bien au-dessus du standard de l'industrie, et 4) Un facteur complètement nouveau à CRÉER.
```

#### Utiliser la Buyer Utility Map
```
Analyse le cycle d'expérience acheteur pour un [produit/service, ex: un programme d'onboarding collaborateur]. Pour chacune des six étapes (Achat, Livraison, Utilisation, Suppléments, Maintenance, Élimination), où est le plus grand 'blocage' d'utilité pour les clients ? Suggère une innovation pour supprimer ce blocage.
```

**Pro-tip** : Demande : "Basé sur la stratégie Blue Ocean que nous avons définie, écris un slogan et un court énoncé de proposition de valeur pour cette nouvelle offre qui communique clairement sa différenciation unique au client cible."

**Enchaînements** → NABC, Lean Canvas, Prototype to Test
