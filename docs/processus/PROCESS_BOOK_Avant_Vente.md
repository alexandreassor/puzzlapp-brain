# 📋 PROCESS BOOK — MODÈLE PREMIUM

## Template de documentation processus KM 360°

---

# PROCESSUS : AVANT-VENTE CABINET

**Code processus** : `PROC-COM-000`
**Version** : 1.0
**Date de création** : 27/12/2024
**Dernière mise à jour** : 27/12/2024
**Propriétaire** : Direction / Associés
**Statut** : 🟡 En cours de formalisation

---

## 🔗 LIEN AVEC LE KNOWLEDGE MANAGEMENT

> **Pourquoi documenter ce processus ?**
> 
> L'avant-vente concentre des **savoirs tacites critiques** : savoir qualifier un prospect, savoir argumenter, savoir chiffrer, savoir closer. Ces compétences sont souvent détenues par 1-2 personnes au cabinet.
> 
> | Dimension KM | Application |
> |--------------|-------------|
> | **Crash Test** | Si le commercial principal part, peut-on continuer à transformer des prospects ? |
> | **Spirale SECI** | Externaliser le "flair commercial" en critères objectifs et scripts réutilisables |
> | **Transmission** | Former les managers à la posture commerciale sans 5 ans d'expérience |
> | **Capital Client** | Systématiser l'acquisition pour sécuriser la croissance |
> 
> *Un cabinet qui ne formalise pas son avant-vente dépend d'individus. Un cabinet qui le formalise construit un actif.*

---

# SECTION 1 — VUE D'ENSEMBLE

## 1.1 Carte d'identité du processus

| Attribut | Valeur |
|----------|--------|
| **Nom complet** | Processus Avant-Vente — De l'identification au closing |
| **Code** | PROC-COM-000 |
| **Famille** | Commercial |
| **Périmètre** | Du premier contact prospect jusqu'à la signature de la lettre de mission |
| **Hors périmètre** | Onboarding (PROC-TRV-001), Fidélisation, Renouvellement |
| **Fréquence** | Continue (flux entrant de prospects) |
| **Volume estimé** | ~XX prospects/mois → ~XX clients signés/mois |
| **Criticité** | 🔴 Critique (alimente le CA futur) |

## 1.2 Objectifs du processus

| Objectif | Indicateur cible |
|----------|------------------|
| **Transformer les prospects en clients** | Taux de transformation > 30% |
| **Qualifier rapidement** | Délai qualification < 48h |
| **Proposer au bon prix** | Marge brute cible > 40% |
| **Signer vite** | Délai prospect → signature < 30 jours |
| **Zéro mauvais client** | Taux de résiliation an 1 < 5% |

## 1.3 Chaîne de valeur

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           CHAÎNE DE VALEUR AVANT-VENTE                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │          │    │          │    │          │    │          │    │          │      │
│  │ IDENTIF. │───▶│ QUALIF.  │───▶│DÉCOUVERTE│───▶│ PROPOS.  │───▶│ CLOSING  │      │
│  │          │    │          │    │          │    │          │    │          │      │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘      │
│       │              │               │               │               │              │
│       ▼              ▼               ▼               ▼               ▼              │
│   Lead reçu     Go/No-Go       Besoins clairs   Devis envoyé    Signature OK       │
│                                                                                     │
│  ─────────────────────────────────────────────────────────────────────────────     │
│   Délai cible    < 24h          < 48h            < 7 jours      < 30 jours         │
│   Taux passage   100%           60%              80%            50%            40%  │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

# SECTION 2 — ACTEURS ET GOUVERNANCE

## 2.1 Matrice RACI globale

| Étape | Assistante | Collaborateur | Manager | Associé | Direction |
|-------|:----------:|:-------------:|:-------:|:-------:|:---------:|
| **Identification** | R | - | - | - | A |
| **Qualification** | I | - | R | A | I |
| **Découverte (RDV)** | I | - | R | C | A |
| **Proposition** | I | C | R | A | I |
| **Négociation** | I | - | C | R | A |
| **Closing** | R | - | I | R | A |

> **Légende** : R = Réalise | A = Approuve | C = Consulté | I = Informé

## 2.2 Fiches de rôle

### 📌 Responsable Avant-Vente (Manager ou Associé)

| Attribut | Description |
|----------|-------------|
| **Mission** | Transformer les prospects qualifiés en clients rentables |
| **Autorité** | Décision Go/No-Go, négociation prix (dans limites), engagement cabinet |
| **Compétences requises** | TRANS-001, TRANS-002, TRANS-004 |
| **Objectifs** | Taux transfo > 30%, délai < 30j, marge > 40% |

### 📌 Support Commercial (Assistante)

| Attribut | Description |
|----------|-------------|
| **Mission** | Gérer le flux entrant, qualifier le 1er niveau, administrer le pipe |
| **Autorité** | Qualification niveau 1, prise de RDV |
| **Compétences requises** | TRANS-001, Outils CRM |
| **Objectifs** | Délai réponse < 24h, 100% leads tracés dans CRM |

---

# SECTION 3 — ÉTAPES DÉTAILLÉES

## 📍 ÉTAPE 1 : IDENTIFICATION

### Vue synthétique

| Attribut | Valeur |
|----------|--------|
| **Code étape** | COM-01 |
| **Nom** | Identification du lead |
| **Déclencheur** | Réception d'un lead (formulaire, appel, recommandation, réseau) |
| **Responsable** | Assistante |
| **Délai cible** | < 24h |
| **Output** | Fiche lead créée dans CRM |

### Logigramme

```
┌─────────────────┐
│  Lead reçu      │
│  (multicanal)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Source connue ? │──Non──▶│ Identifier     │
└────────┬────────┘     │ la source      │
         │Oui           └────────┬────────┘
         ▼                       │
┌─────────────────┐              │
│ Créer fiche     │◀─────────────┘
│ lead dans CRM   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Accuser         │
│ réception       │
│ (mail auto)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ Transmettre   │
│ pour qualif.    │
└─────────────────┘
```

### Checklist opératoire

| # | Action | Vérification | Fait |
|---|--------|--------------|:----:|
| 1 | Vérifier que le lead n'existe pas déjà | Recherche CRM | ☐ |
| 2 | Créer la fiche lead | Champs obligatoires remplis | ☐ |
| 3 | Identifier et tracer la source | Champ "Origine" renseigné | ☐ |
| 4 | Envoyer accusé réception | Mail parti < 24h | ☐ |
| 5 | Affecter au responsable qualification | Notification envoyée | ☐ |

### Règles de gestion

| Code | Règle | Exception |
|------|-------|-----------|
| RG-COM-01 | Tout lead doit être tracé dans le CRM sous 24h | Aucune |
| RG-COM-02 | Un accusé réception est envoyé systématiquement | Leads manifestement hors cible (spam) |
| RG-COM-03 | La source doit être identifiée pour mesurer le ROI des canaux | Si inconnue, mettre "À identifier" |

### Points de contrôle qualité

| Contrôle | Fréquence | Responsable | Seuil alerte |
|----------|-----------|-------------|--------------|
| Délai traitement leads | Hebdo | Manager | > 48h |
| Taux de leads sans source | Mensuel | Direction | > 10% |

---

## 📍 ÉTAPE 2 : QUALIFICATION

### Vue synthétique

| Attribut | Valeur |
|----------|--------|
| **Code étape** | COM-02 |
| **Nom** | Qualification du prospect |
| **Déclencheur** | Lead transmis par l'assistante |
| **Responsable** | Manager |
| **Délai cible** | < 48h après réception |
| **Output** | Décision Go/No-Go + Score prospect |

### Logigramme

```
┌─────────────────┐
│  Lead reçu      │
│  (fiche CRM)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Appel qualif.   │
│ (15-20 min)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Grille de       │
│ scoring         │
│ (voir ci-après) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│         SCORE OBTENU            │
├─────────────────────────────────┤
│                                 │
│  Score ≥ 70    Score 40-69    Score < 40
│      │              │              │
│      ▼              ▼              ▼
│  ┌───────┐    ┌──────────┐   ┌──────────┐
│  │GO     │    │ GO sous  │   │ NO-GO    │
│  │Priorité│   │ réserve  │   │ Archiver │
│  │haute  │    │ Revoir   │   │ ou refer │
│  └───┬───┘    └────┬─────┘   └──────────┘
│      │             │
│      ▼             ▼
│  Planifier      Nurturing
│  RDV découv.    ou attente
│                                 
└─────────────────────────────────┘
```

### 🎯 Grille de scoring prospect

| Critère | Poids | 0 pt | 5 pt | 10 pt |
|---------|:-----:|------|------|-------|
| **Adéquation cible** | x3 | Hors cible | Partielle | ICP parfait |
| **Budget cohérent** | x2 | Irréaliste | Négociable | OK |
| **Délai projet** | x2 | > 6 mois | 1-3 mois | Immédiat |
| **Décideur identifié** | x1 | Non | Pas sûr | Oui |
| **Complexité gérable** | x2 | Hors compétence | Limite | Standard |
| **Potentiel fidélisation** | x1 | Ponctuel | Moyen | Récurrent |

**Score maximum** : 110 points

| Score | Décision | Action |
|-------|----------|--------|
| ≥ 70 | 🟢 GO Prioritaire | RDV découverte sous 7 jours |
| 40-69 | 🟡 GO sous réserve | Clarifier les points faibles, puis décider |
| < 40 | 🔴 NO-GO | Archiver ou réorienter vers partenaire |

### Checklist opératoire

| # | Action | Vérification | Fait |
|---|--------|--------------|:----:|
| 1 | Appeler le prospect | Contact effectif | ☐ |
| 2 | Dérouler la trame de qualification | Questions clés posées | ☐ |
| 3 | Remplir la grille de scoring | Score calculé | ☐ |
| 4 | Décider Go/No-Go | Décision tracée CRM | ☐ |
| 5 | Si GO : proposer créneau RDV découverte | RDV planifié | ☐ |
| 6 | Si NO-GO : envoyer mail de courtoisie | Mail envoyé | ☐ |

### Script téléphonique (trame)

```
📞 TRAME APPEL QUALIFICATION (15-20 min)

1. ACCROCHE (1 min)
   "Bonjour [Prénom], c'est [Moi] du cabinet [Nom]. 
   Vous nous avez contactés concernant [sujet]. 
   Je vous appelle pour mieux comprendre votre besoin. 
   Avez-vous 15 minutes ?"

2. CONTEXTE (3 min)
   • "Pouvez-vous me présenter votre activité en quelques mots ?"
   • "Quelle est votre forme juridique actuelle ?"
   • "Combien êtes-vous (effectif) ?"
   • "Quel est votre CA approximatif ?"

3. BESOIN (5 min)
   • "Qu'est-ce qui vous amène à chercher un cabinet aujourd'hui ?"
   • "Avez-vous actuellement un expert-comptable ?"
   • "Qu'est-ce qui ne vous convient pas / plus ?"
   • "Quelles missions recherchez-vous précisément ?"

4. PROJET (3 min)
   • "Quel est votre calendrier ? C'est urgent ou vous anticipez ?"
   • "Qui décide ? Êtes-vous seul ou devez-vous en référer ?"
   • "Avez-vous une idée de budget ?"

5. QUALIFICATION INTERNE (2 min — questions pour vous)
   • Est-ce notre cible ? (Taille, secteur, complexité)
   • A-t-on les compétences ?
   • Le feeling passe-t-il ?

6. CONCLUSION (2 min)
   Si GO : "Je vous propose qu'on se voie pour approfondir. 
           Êtes-vous disponible [créneaux] ?"
   Si NO-GO : "Merci pour ces éléments. Je vais en discuter 
              en interne et je reviens vers vous."
```

### Règles de gestion

| Code | Règle | Exception |
|------|-------|-----------|
| RG-COM-10 | Tout prospect doit être scoré avant RDV découverte | Aucune |
| RG-COM-11 | Un NO-GO doit être justifié par écrit | Aucune |
| RG-COM-12 | Délai de réponse au prospect < 48h | Aucune |

---

## 📍 ÉTAPE 3 : DÉCOUVERTE

### Vue synthétique

| Attribut | Valeur |
|----------|--------|
| **Code étape** | COM-03 |
| **Nom** | RDV Découverte |
| **Déclencheur** | Prospect qualifié GO |
| **Responsable** | Manager ou Associé |
| **Délai cible** | RDV sous 7 jours après qualification |
| **Durée** | 45-60 min |
| **Output** | CR découverte + Brief pour proposition |

### Objectifs du RDV

| Objectif | Question clé |
|----------|--------------|
| **Comprendre le contexte** | Qui est-il ? Son historique ? Son marché ? |
| **Identifier les besoins** | Que veut-il vraiment ? Explicite et implicite ? |
| **Évaluer la complexité** | Quels enjeux techniques ? Quels risques ? |
| **Créer la relation** | Le courant passe-t-il ? Confiance ? |
| **Préparer la proposition** | Quoi proposer ? À quel prix ? |

### Checklist préparation RDV

| # | Action | Vérification | Fait |
|---|--------|--------------|:----:|
| 1 | Relire fiche CRM et notes qualification | Contexte en tête | ☐ |
| 2 | Rechercher infos complémentaires | Societe.com, LinkedIn, site web | ☐ |
| 3 | Préparer support de présentation cabinet | Slides prêtes | ☐ |
| 4 | Préparer questions découverte | Liste imprimée | ☐ |
| 5 | Réserver salle / lien visio | Logistique OK | ☐ |

### Guide d'entretien découverte

```
📋 STRUCTURE RDV DÉCOUVERTE (45-60 min)

1. OUVERTURE (5 min)
   • Accueil, café, mise à l'aise
   • "Merci de nous recevoir / de prendre le temps"
   • Rappel du contexte : "Vous nous avez contactés car..."
   • Proposer le déroulé : "Je vous propose qu'on échange 
     sur votre situation, puis je vous présente notre cabinet"

2. EXPLORATION (25 min)

   A. L'entreprise
   • Activité, historique, positionnement
   • Chiffres clés (CA, effectif, résultat)
   • Organisation, filiales, groupe ?
   • Projets, ambitions

   B. La situation comptable/fiscale/sociale actuelle
   • Cabinet actuel ? Depuis quand ?
   • Ce qui fonctionne / ne fonctionne pas
   • Outils utilisés (compta, paie, facturation)
   • Douleurs principales ?

   C. Les besoins
   • Missions attendues (compta, paie, juridique, conseil...)
   • Niveau de service attendu (fréquence RDV, réactivité)
   • Outils souhaités ?
   • Ce qui compte vraiment pour vous ?

   D. Le projet
   • Calendrier (quand souhaitez-vous démarrer ?)
   • Critères de choix ?
   • Autres cabinets consultés ?
   • Budget envisagé ?

3. PRÉSENTATION CABINET (10 min)
   • Qui sommes-nous (pitch)
   • Nos forces différenciantes
   • Comment on travaille
   • Réponse aux questions

4. CLOSING RDV (5 min)
   • Résumé des besoins compris
   • "Est-ce que j'ai bien compris votre besoin ?"
   • Prochaines étapes : "Je vous envoie une proposition sous X jours"
   • Questions ?
```

### Template CR Découverte

```markdown
# COMPTE-RENDU RDV DÉCOUVERTE

**Prospect** : [Nom société]
**Date RDV** : [Date]
**Participants** : [Noms]
**Rédacteur** : [Nom]

## 1. CONTEXTE
- Activité : 
- CA : 
- Effectif : 
- Forme juridique : 
- Secteur NAF : 

## 2. SITUATION ACTUELLE
- Cabinet actuel : 
- Points de satisfaction : 
- Points d'insatisfaction : 
- Outils utilisés : 

## 3. BESOINS EXPRIMÉS
- Missions souhaitées : 
- Niveau de service attendu : 
- Critères de choix : 
- Budget évoqué : 

## 4. ÉVALUATION INTERNE
- Complexité estimée : ⭐⭐⭐ /5
- Adéquation cabinet : ⭐⭐⭐ /5
- Potentiel : ⭐⭐⭐ /5
- Feeling : ⭐⭐⭐ /5

## 5. RECOMMANDATION
☐ GO - Faire proposition
☐ GO sous réserve - [Préciser]
☐ NO-GO - [Justifier]

## 6. BRIEF POUR PROPOSITION
- Missions à proposer : 
- Fourchette tarifaire : 
- Points d'attention : 
- Deadline proposition : 
```

### Règles de gestion

| Code | Règle | Exception |
|------|-------|-----------|
| RG-COM-20 | Tout RDV découverte fait l'objet d'un CR sous 48h | Aucune |
| RG-COM-21 | Le CR est stocké dans le CRM | Aucune |
| RG-COM-22 | Si GO, la proposition doit partir sous 7 jours | Accord prospect pour délai plus long |

---

## 📍 ÉTAPE 4 : PROPOSITION

### Vue synthétique

| Attribut | Valeur |
|----------|--------|
| **Code étape** | COM-04 |
| **Nom** | Élaboration et envoi de la proposition |
| **Déclencheur** | CR découverte validé GO |
| **Responsable** | Manager |
| **Approbateur** | Associé (si hors grille tarifaire) |
| **Délai cible** | < 7 jours après RDV découverte |
| **Output** | Proposition commerciale + Devis |

### Logigramme

```
┌─────────────────┐
│ CR Découverte   │
│ validé GO       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Chiffrer la     │
│ mission         │
│ (grille tarif.) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     
│ Hors grille ?   │     
└────────┬────────┘     
         │
    ┌────┴────┐
    │         │
   Non       Oui
    │         │
    ▼         ▼
┌───────┐  ┌──────────┐
│Valider│  │Validation│
│Manager│  │Associé   │
└───┬───┘  └────┬─────┘
    │           │
    └─────┬─────┘
          │
          ▼
┌─────────────────┐
│ Rédiger         │
│ proposition     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Relecture       │
│ qualité         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Envoi au        │
│ prospect        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ✅ Planifier     │
│ relance J+3     │
└─────────────────┘
```

### Structure de la proposition commerciale

```
📄 STRUCTURE PROPOSITION (Template)

1. PAGE DE GARDE
   - Logo cabinet
   - "Proposition de collaboration"
   - Nom prospect
   - Date

2. SYNTHÈSE EXÉCUTIVE (1 page)
   - "Vous nous avez fait part de..."
   - "Nous vous proposons..."
   - Montant global annuel HT
   - Points forts de notre accompagnement

3. COMPRÉHENSION DE VOS BESOINS (1 page)
   - Reformulation du contexte
   - Enjeux identifiés
   - Attentes exprimées

4. NOTRE PROPOSITION (2-3 pages)
   
   4.1 Missions proposées
   | Mission | Périmètre | Fréquence |
   |---------|-----------|-----------|
   | Tenue comptable | ... | Mensuel |
   | Déclarations fiscales | ... | Selon échéances |
   | etc. | | |
   
   4.2 Livrables
   - Liste des livrables par mission
   
   4.3 Organisation
   - Votre interlocuteur dédié : [Nom]
   - Rythme des points : [Fréquence]
   - Outils utilisés : [Liste]

5. INVESTISSEMENT (1 page)
   
   | Mission | Honoraires annuels HT |
   |---------|----------------------|
   | Tenue comptable | X XXX € |
   | Déclarations fiscales | X XXX € |
   | Missions sociales | X XXX € |
   | Juridique annuel | X XXX € |
   | **TOTAL ANNUEL HT** | **XX XXX €** |
   
   Soit XX € HT / mois
   
   Conditions : [Facturation, paiement, révision]

6. POURQUOI NOUS CHOISIR (1 page)
   - Nos 3 forces
   - Témoignage client (si dispo)
   - Chiffres clés

7. PROCHAINES ÉTAPES
   - Échanges / questions
   - Signature lettre de mission
   - Démarrage prévu : [Date]

8. ANNEXES
   - CGV
   - Lettre de mission pré-remplie (optionnel)
```

### Checklist proposition

| # | Action | Vérification | Fait |
|---|--------|--------------|:----:|
| 1 | Chiffrer toutes les missions | Grille tarifaire respectée | ☐ |
| 2 | Vérifier cohérence prix / besoins | Pas de sur/sous-estimation | ☐ |
| 3 | Rédiger la proposition | Template respecté | ☐ |
| 4 | Faire relire (Manager ou Associé) | Validation obtenue | ☐ |
| 5 | Personnaliser le courrier d'envoi | Pas de mail générique | ☐ |
| 6 | Envoyer au prospect | Accusé réception | ☐ |
| 7 | Tracer dans CRM | Statut mis à jour | ☐ |
| 8 | Planifier relance J+3 | Rappel créé | ☐ |

### Règles de gestion

| Code | Règle | Exception |
|------|-------|-----------|
| RG-COM-30 | Toute remise > 10% doit être validée par un associé | Aucune |
| RG-COM-31 | La proposition doit suivre le template standard | Aucune |
| RG-COM-32 | Relance systématique à J+3 si pas de retour | Prospect a indiqué un délai |

---

## 📍 ÉTAPE 5 : NÉGOCIATION

### Vue synthétique

| Attribut | Valeur |
|----------|--------|
| **Code étape** | COM-05 |
| **Nom** | Traitement des objections et négociation |
| **Déclencheur** | Retour prospect sur proposition |
| **Responsable** | Manager ou Associé |
| **Délai cible** | Réponse < 24h à toute question |
| **Output** | Accord verbal ou proposition révisée |

### Objections courantes et réponses

| Objection | Réponse type | Attitude |
|-----------|--------------|----------|
| **"C'est trop cher"** | "Par rapport à quoi ? Qu'avez-vous comme référence ?" Puis : valoriser le service, comparer au coût de non-qualité | Ne pas baisser le prix en premier |
| **"Je vais réfléchir"** | "Bien sûr. Qu'est-ce qui vous ferait hésiter ? Y a-t-il un point que je peux clarifier ?" | Identifier le vrai frein |
| **"Je consulte d'autres cabinets"** | "C'est normal. Qu'est-ce qui fera la différence pour vous ?" | Comprendre les critères |
| **"On verra plus tard"** | "Je comprends. Qu'est-ce qui changerait la donne ? Voulez-vous qu'on se recontacte à [date] ?" | Fixer une relance |
| **"Mon EC actuel est moins cher"** | "Êtes-vous satisfait du service ? Que manque-t-il ?" | Valoriser le différentiel |
| **"Je dois en parler à mon associé"** | "Bien sûr. Souhaitez-vous qu'on organise un échange ensemble ?" | Accéder au décideur |

### Règles de négociation

| Règle | Application |
|-------|-------------|
| **Ne jamais baisser le prix sans contrepartie** | Si remise, retirer du périmètre ou obtenir engagement durée |
| **Comprendre avant de répondre** | Poser des questions, reformuler l'objection |
| **Savoir dire non** | Un mauvais client coûte plus qu'il ne rapporte |
| **Garder le contrôle du timing** | Fixer des échéances, relancer proactivement |

---

## 📍 ÉTAPE 6 : CLOSING

### Vue synthétique

| Attribut | Valeur |
|----------|--------|
| **Code étape** | COM-06 |
| **Nom** | Closing et signature |
| **Déclencheur** | Accord verbal du prospect |
| **Responsable** | Assistante (admin) + Associé (signature) |
| **Délai cible** | Signature < 7 jours après accord |
| **Output** | Lettre de mission signée |

### Checklist closing

| # | Action | Vérification | Fait |
|---|--------|--------------|:----:|
| 1 | Confirmer l'accord par écrit | Mail de confirmation | ☐ |
| 2 | Préparer lettre de mission définitive | Vérifier montants, périmètre | ☐ |
| 3 | Préparer les CGV | Version à jour | ☐ |
| 4 | Préparer le mandat SEPA | Si prélèvement prévu | ☐ |
| 5 | Envoyer le kit signature | Mail avec tous documents | ☐ |
| 6 | Relancer si pas de retour à J+3 | Relance effectuée | ☐ |
| 7 | Réceptionner documents signés | Vérifier signatures | ☐ |
| 8 | Archiver dans GED | Documents classés | ☐ |
| 9 | Mettre à jour CRM | Statut = Client | ☐ |
| 10 | Déclencher onboarding | PROC-TRV-001 lancé | ☐ |

### Règles de gestion

| Code | Règle | Exception |
|------|-------|-----------|
| RG-COM-40 | Pas de démarrage mission sans lettre signée | Aucune |
| RG-COM-41 | Lettre de mission = modèle cabinet validé | Aucune |
| RG-COM-42 | Transition vers onboarding dans les 48h post-signature | Aucune |

---

# SECTION 4 — INDICATEURS ET PILOTAGE

## 4.1 Tableau de bord avant-vente

| KPI | Formule | Cible | Fréquence |
|-----|---------|-------|-----------|
| **Nb leads reçus** | Comptage CRM | - | Hebdo |
| **Taux de qualification** | Leads GO / Leads totaux | > 60% | Mensuel |
| **Taux de RDV obtenus** | RDV / Leads GO | > 80% | Mensuel |
| **Taux de proposition** | Propositions / RDV | > 80% | Mensuel |
| **Taux de transformation** | Signés / Propositions | > 50% | Mensuel |
| **Taux global (funnel)** | Signés / Leads totaux | > 25% | Mensuel |
| **Délai moyen closing** | Date signature - Date lead | < 30 jours | Mensuel |
| **CA signé** | Somme honoraires signés | Objectif | Mensuel |
| **Panier moyen** | CA signé / Nb clients signés | Selon cible | Mensuel |

## 4.2 Funnel visuel

```
┌─────────────────────────────────────────────────────────────┐
│                    FUNNEL AVANT-VENTE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  LEADS REÇUS                          100  │████████████│  │
│                                             │            │  │
│  LEADS QUALIFIÉS (60%)                 60  │████████    │  │
│                                             │            │  │
│  RDV DÉCOUVERTE (80%)                  48  │██████      │  │
│                                             │            │  │
│  PROPOSITIONS (80%)                    38  │█████       │  │
│                                             │            │  │
│  SIGNÉS (50%)                          19  │██          │  │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│  TAUX GLOBAL : 19%                                          │
│  OBJECTIF : 25%                                             │
└─────────────────────────────────────────────────────────────┘
```

## 4.3 Revue de pipe

| Fréquence | Participants | Ordre du jour |
|-----------|--------------|---------------|
| **Hebdo** (30 min) | Manager + Assistante | Nouveaux leads, relances à faire, blocages |
| **Mensuel** (1h) | Direction + Managers | KPIs, analyse funnel, actions correctives |
| **Trimestriel** (2h) | Direction | Bilan, objectifs, évolution process |

---

# SECTION 5 — CONTENUS ASSOCIÉS

## 5.1 Documents de référence

| Code | Document | Statut | Lien |
|------|----------|--------|------|
| DOC-COM-01 | Proposition de valeur cabinet | ✅ | JEU-001b |
| DOC-COM-02 | Grille tarifaire | 🔴 À créer | - |
| DOC-COM-03 | Template proposition commerciale | 🔴 À créer | - |
| DOC-COM-04 | Lettre de mission type | ⚠️ À vérifier | - |
| DOC-COM-05 | CGV | ⚠️ À vérifier | - |
| DOC-COM-06 | FAQ Objections | 🔴 À créer | - |

## 5.2 Outils

| Outil | Usage | Responsable |
|-------|-------|-------------|
| **CRM** | Suivi du pipe, historique contacts | Tous |
| **Agenda partagé** | Prise de RDV | Assistante |
| **GED** | Stockage documents signés | Assistante |
| **Modèles Word/PPT** | Propositions, présentations | Manager |

## 5.3 Formations associées

| Formation | Public | Durée | Formateur |
|-----------|--------|-------|-----------|
| Qualification téléphonique | Assistantes | 2h | Manager |
| Conduite RDV découverte | Managers | 4h | Associé |
| Négociation et closing | Managers | 4h | Externe ? |
| Utilisation CRM | Tous | 2h | IT |

---

# SECTION 6 — AMÉLIORATION CONTINUE

## 6.1 Historique des versions

| Version | Date | Auteur | Modifications |
|---------|------|--------|---------------|
| 1.0 | 27/12/2024 | [Nom] | Création initiale |

## 6.2 Points d'amélioration identifiés

| # | Point | Priorité | Responsable | Échéance |
|---|-------|----------|-------------|----------|
| 1 | Créer grille tarifaire formalisée | Haute | Direction | - |
| 2 | Mettre en place CRM si inexistant | Haute | IT | - |
| 3 | Former les managers au RDV découverte | Moyenne | RH | - |
| 4 | Créer template proposition PPT | Moyenne | Marketing | - |

## 6.3 Retours d'expérience (REX)

*Section à alimenter après les premiers mois d'utilisation*

| Date | Situation | Problème | Solution | Apprentissage |
|------|-----------|----------|----------|---------------|
| - | - | - | - | - |

---

# ANNEXES

## Annexe A : Grille de scoring vierge

*(À imprimer pour chaque qualification)*

## Annexe B : Trame d'appel qualification

*(Version imprimable)*

## Annexe C : Guide d'entretien découverte

*(Version imprimable)*

## Annexe D : Template CR Découverte

*(Version Word)*

## Annexe E : Template Proposition commerciale

*(Version Word/PPT)*

---

*Document généré selon le template PROCESS BOOK — Framework KM 360°*
*Version 1.0 — Décembre 2024*
