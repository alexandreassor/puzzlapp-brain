# Phase Test - Outils et Prompts IA

Phase de validation avec les utilisateurs.

---

## 36. Testing Sheet

**Objectif** : Planifier et documenter systématiquement les tests utilisateurs de prototypes.

**Résultat IA** : Un plan de test complet incluant scénario, critères de succès, procédure, et questions ouvertes.

### Prompts

#### Planification du test
```
Nous devons tester notre prototype : [décrire prototype]. L'objectif est d'apprendre [objectif d'apprentissage]. Crée un plan de Testing Sheet. Définis : 1) Le scénario de test (une tâche réaliste pour l'utilisateur), 2) Les critères de succès (quel comportement validerait notre hypothèse ?), et 3) Les rôles (qui facilite, qui prend des notes ?).
```

#### Générer des questions
```
Génère une liste de 5 questions ouvertes puissantes à poser à l'utilisateur après qu'il a interagi avec le prototype. Les questions devraient sonder sa compréhension, sa réaction émotionnelle, et sa probabilité d'utiliser le produit.
```

#### Synthétiser les apprentissages
```
Voici les résultats d'un test utilisateur : [notes brutes, citations, observations]. Synthétise cette information en trois 'Apprentissages' clés. Pour chaque apprentissage, suggère un changement concret que nous devrions faire au prototype.
```

**Pro-tip** : Demande : "Agis comme l'utilisateur testé. Je vais décrire le prototype et la tâche. S'il te plaît, fournis un narratif 'think-aloud' de tes pensées, sentiments, et points de confusion pendant que tu imagines interagir avec."

**Enchaînements** → Feedback Capture Grid, Solution Interview, Exploration Map

---

## 37. Feedback Capture Grid

**Objectif** : Documenter rapidement et facilement le feedback utilisateur de manière structurée.

**Résultat IA** : Un ensemble de questions de sondage pour chacun des quatre quadrants, conçues pour éliciter un feedback spécifique et actionnable.

### Prompts

#### Préparer la capture de feedback
```
Nous allons obtenir du feedback sur notre prototype. Génère une liste de questions spécifiques et ouvertes que le facilitateur peut poser pour chaque quadrant du Feedback Capture Grid. Par exemple, pour 'I wish', une question pourrait être 'Si tu avais une baguette magique, qu'est-ce que tu changerais ?'
```

#### Synthétiser une grille
```
Voici un Feedback Capture Grid complété : [contenu des quatre quadrants]. Analyse ce feedback et résume l'insight positif le plus important, le feedback négatif le plus critique, la question utilisateur la plus pressante, et l'idée nouvelle la plus prometteuse.
```

#### Transformer le feedback en action
```
Basé sur le quadrant 'I wish' contenant [liste de critiques], et le quadrant 'Ideas' contenant [liste d'idées], brainstorme trois items d'action concrets pour la prochaine itération de design.
```

**Pro-tip** : Demande : "Les quadrants 'I like' et 'I wish' semblent se contredire sur ce point : [décrire contradiction]. Que nous dit ce paradoxe sur les besoins de l'utilisateur ? Quelle tension plus profonde pourrait exister ?"

**Enchaînements** → I like I wish I wonder, Dot Voting, Prototype to Test

---

## 38. Powerful Questions for Experience Testing

**Objectif** : Évaluer les idées et prototypes en posant les bonnes questions au bon niveau de fidélité.

**Résultat IA** : Un ensemble de questions de test adaptées au niveau de fidélité du prototype.

### Prompts

#### Test de prototype Lo-Fi
```
Nous testons un sketch papier Lo-Fi de [concept]. Notre objectif est de valider le problème central et le concept de base. Génère 5 questions puissantes à poser à l'utilisateur qui se focalisent sur le problème, ses solutions actuelles, et sa compréhension du bénéfice du concept.
```

#### Test de prototype Med-Fi
```
Nous avons un wireframe Med-Fi de [interface]. Génère 5 questions puissantes qui se focalisent sur la réaction de l'utilisateur au design, la clarté du workflow, et les fonctionnalités manquantes.
```

#### Test de prototype Hi-Fi
```
Nous avons un prototype Hi-Fi, semi-fonctionnel de [produit]. Génère 5 questions puissantes qui se focalisent sur l'utilisabilité, la navigation, la cohérence du design, et la probabilité que l'utilisateur recommande le produit.
```

**Pro-tip** : Demande : "Un utilisateur dit 'Je n'aime pas le design'. C'est un feedback vague. Génère une 'échelle de feedback' de 3 questions de suivi qui vont de la clarification à la compréhension du principe sous-jacent. Par exemple : 1. Qu'est-ce que vous n'aimez pas spécifiquement ? 2. Comment cela vous a-t-il fait sentir ? 3. Qu'auriez-vous attendu à la place ?"

**Enchaînements** → Solution Interview, Structured Usability Testing, A/B Testing

---

## 39. Solution Interview

**Objectif** : Obtenir un feedback approfondi sur une solution quasi-finale ou prototype haute-résolution.

**Résultat IA** : Un guide d'entretien solution complet incluant objectifs, screener candidat, et agenda structuré.

### Prompts

#### Définition des objectifs et screening
```
Nous devons conduire un entretien solution pour notre [prototype/MVP]. La question clé à laquelle nous voulons répondre est [question clé]. Basé sur cela, quels sont les 3 principaux critères pour sélectionner les candidats à interviewer qui correspondent à notre persona ?
```

#### Créer le guide d'entretien
```
Génère un guide d'entretien en 4 phases pour notre entretien solution. Inclus les durées et questions clés pour : 1) Warm-up, 2) Introduction au Contexte, 3) Expérience de la Solution, et 4) Résumé.
```

#### Sonder la valeur de la solution
```
Pendant la phase 'Expérience de la Solution', quelles sont trois questions puissantes que je peux poser pour déterminer si l'utilisateur paierait réellement pour cette solution ? Les questions devraient être indirectes et éviter une simple réponse 'oui/non'.
```

**Pro-tip** : Demande : "L'utilisateur a fini d'interagir avec la solution. Génère un prompt utilisant le framework 'Net Promoter Score' (NPS) : 'Sur une échelle de 0 à 10, quelle est la probabilité que vous recommandiez ceci à un ami ou collègue ?' Puis, génère la question de suivi cruciale : 'Quelle est la raison principale de votre score ?'"

**Enchaînements** → Create a Pitch, Lean Canvas, Roadmap for Implementation

---

## 40. Structured Usability Testing

**Objectif** : Vérifier formellement si une solution est efficace, efficiente, et satisfaisante.

**Résultat IA** : Un plan de test d'utilisabilité détaillé incluant concept, tâches utilisateur, et script modérateur.

### Prompts

#### Phase de planification
```
Nous devons planifier un test d'utilisabilité structuré pour notre [objet de test, ex: nouvelle page d'accueil du wiki]. Quel est l'objectif principal ? Définis trois tâches spécifiques et mesurables pour l'utilisateur (ex: 'Trouver l'information de contact', 'S'inscrire à la newsletter').
```

#### Script du modérateur
```
Génère un script de modérateur pour le test. Inclus un accueil, une explication du protocole 'think aloud', les instructions de tâche, et un ensemble de questions de conclusion.
```

#### Définir les métriques
```
Pour la tâche ['ex: compléter le processus de recherche'], quelles sont trois métriques d'utilisabilité clés que nous pourrions mesurer ? Inclus une pour l'efficacité (ex: taux de succès de la tâche), une pour l'efficience (ex: temps sur tâche), et une pour la satisfaction (ex: question d'aisance unique).
```

**Pro-tip** : Demande : "Un utilisateur est complètement bloqué sur une tâche pendant un test d'utilisabilité. Quelles sont trois choses que le modérateur peut dire ou faire pour aider l'utilisateur sans invalider les données du test ? Les prompts devraient être neutres et encourager l'utilisateur à continuer à penser à haute voix."

**Enchaînements** → A/B Testing, Lessons Learned, Problem to Growth Funnel

---

## 41. A/B Testing

**Objectif** : Comparer quantitativement deux versions d'un design pour voir laquelle performe mieux.

**Résultat IA** : Un plan de test A/B bien défini incluant hypothèse claire, variable spécifique, et métrique clé.

### Prompts

#### Définir le test
```
Nous voulons lancer un test A/B pour améliorer [objectif, ex: le taux de consultation des fiches procédures]. Notre hypothèse est que [ex: 'un moteur de recherche plus visible augmentera les consultations']. Quelle est la variable unique que nous devrions changer entre la Variante A (Contrôle) et la Variante B (Challenger) ? Quelle est la métrique clé que nous mesurerons ?
```

#### Brainstormer des variantes
```
Brainstormons des variantes pour un test A/B sur notre page d'accueil. L'objectif est d'augmenter les clics sur 'Accéder à la base de connaissances'. Génère trois hypothèses différentes que nous pourrions tester, chacune avec un changement de design correspondant pour la Variante B.
```

#### Interpréter les résultats
```
Le test A/B est terminé. La Variante B a augmenté le taux de clic de 5% avec une signification statistique de 95%. Cependant, le temps passé sur la page a diminué. Comment devrions-nous interpréter ces résultats ? Quel est un test de suivi potentiel que nous pourrions lancer ?
```

**Pro-tip** : Demande : "Décris un scénario où un résultat de test A/B pourrait être trompeur à cause du Paradoxe de Simpson (où une tendance apparaît dans différents groupes de données mais disparaît ou s'inverse quand ces groupes sont combinés). Comment pourrions-nous segmenter nos résultats pour vérifier cela ?"

**Enchaînements** → Analysis Question Builder, Roadmap for Implementation, MVP
