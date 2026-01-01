# 📚 DOCUMENTATION PROJET KM 360°

## Framework de Connaissance Client pour Cabinets d'Expertise Comptable

---

# 1. VISION DU PROJET

## 1.1 Objectif

Créer un **système de connaissance universel** permettant à n'importe quel cabinet d'expertise comptable de :

1. **Structurer** sa connaissance client, collaborateur et métier
2. **Identifier** automatiquement les contenus manquants
3. **Produire** du contenu contextualisé grâce à l'IA
4. **Distribuer** le bon contenu à la bonne personne au bon moment

## 1.2 Le Crash Test

> *"Si demain tout le monde disparaît et qu'une équipe complètement nouvelle arrive sans aucune passation possible, peut-elle reprendre le cabinet ?"*

Le système doit permettre de répondre OUI à cette question.

## 1.3 Périmètre

- **Cabinets cibles** : 0 à 250 collaborateurs
- **Fonctions couvertes** : Production (comptable, social, juridique) + Support
- **Cycle complet** : Onboarding client → Vie courante → Événements → Offboarding

---

# 2. ARCHITECTURE CONCEPTUELLE

## 2.1 Les 5 Piliers de Connaissance

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONNAISSANCE 360°                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐ │
│  │ CLIENT  │  │COMPÉTENCE│  │ COLLAB  │  │  CYCLE  │  │CONTENU│ │
│  │         │  │          │  │         │  │ DE VIE  │  │       │ │
│  │ Qui est │  │ Que faut │  │ Qui sait│  │ Quand   │  │ Quelle│ │
│  │ le      │  │ il savoir│  │ faire   │  │ agir ?  │  │ info ?│ │
│  │ client? │  │ faire ?  │  │ quoi ?  │  │         │  │       │ │
│  └────┬────┘  └────┬─────┘  └────┬────┘  └────┬────┘  └───┬───┘ │
│       │            │             │            │           │     │
│       └────────────┴──────┬──────┴────────────┴───────────┘     │
│                           │                                     │
│                    ┌──────▼──────┐                              │
│                    │  MATCHING   │                              │
│                    │             │                              │
│                    │ Client X    │                              │
│                    │ nécessite Y │                              │
│                    │ Collab Z    │                              │
│                    │ sait faire Y│                              │
│                    │ → Affecte Z │                              │
│                    └─────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Les 4 Couches du Système

| Couche | Rôle | Composants |
|--------|------|------------|
| **1. Référentiels** | Définir ce qui devrait exister | Compétences, Profils, Secteurs, Cycle de vie, Types contenus |
| **2. Contextualisation** | Adapter au cabinet | Variables cabinet, paramétrage |
| **3. Moteur IA** | Générer le contenu | Prompts système, prompts par type |
| **4. Orchestration** | Piloter la production | Workflow, suivi, matching |

---

# 3. MODÈLE DE DONNÉES

## 3.1 Vue d'ensemble des entités

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           MODÈLE DE DONNÉES                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐            │
│  │   CABINET   │       │   CLIENT    │       │ COLLABORATEUR│            │
│  │             │1     n│             │n     n│             │            │
│  │ id          │───────│ id          │───────│ id          │            │
│  │ name        │       │ cabinet_id  │       │ cabinet_id  │            │
│  │ size        │       │ profile_id  │       │ skills[]    │            │
│  │ config{}    │       │ sector_id   │       │ capacity    │            │
│  └─────────────┘       │ lifecycle   │       └──────┬──────┘            │
│                        └──────┬──────┘              │                   │
│                               │                     │                   │
│         ┌─────────────────────┼─────────────────────┘                   │
│         │                     │                                         │
│         ▼                     ▼                                         │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐            │
│  │ AFFECTATION │       │   PROFIL    │       │ COMPÉTENCE  │            │
│  │             │       │   CLIENT    │       │             │            │
│  │ client_id   │       │             │n     n│ id          │            │
│  │ collab_id   │       │ id          │───────│ family      │            │
│  │ role        │       │ name        │       │ name        │            │
│  │ score       │       │ skills_req[]│       │ level       │            │
│  └─────────────┘       └─────────────┘       └──────┬──────┘            │
│                                                     │                   │
│                               ┌─────────────────────┘                   │
│                               │                                         │
│                               ▼                                         │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐            │
│  │   SECTEUR   │       │   CONTENU   │       │    TYPE     │            │
│  │             │       │             │       │  CONTENU    │            │
│  │ id          │       │ id          │       │             │            │
│  │ name        │       │ element_id  │n     1│ id          │            │
│  │ specifics{} │       │ type_id     │───────│ name        │            │
│  └─────────────┘       │ status      │       │ prompt      │            │
│                        │ notion_id   │       │ structure   │            │
│                        └─────────────┘       └─────────────┘            │
│                                                                          │
│  ┌─────────────┐       ┌─────────────┐                                  │
│  │  ÉVÉNEMENT  │       │   PROMPT    │                                  │
│  │ CYCLE VIE   │       │             │                                  │
│  │             │       │ id          │                                  │
│  │ id          │       │ type        │                                  │
│  │ phase       │       │ template    │                                  │
│  │ trigger     │       │ variables[] │                                  │
│  │ actions     │       └─────────────┘                                  │
│  └─────────────┘                                                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Détail des entités principales

### CABINET
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| name | String | Nom du cabinet |
| size | Enum | micro/petit/moyen/grand/très_grand |
| structure | Enum | généraliste/pôles/multi-sites |
| sectors | Array[String] | Secteurs clients principaux |
| tools | JSON | {compta, paie, ged, crm} |
| config | JSON | Paramètres personnalisés |
| km_maturity | Enum | débutant/intermédiaire/avancé |
| tone | Enum | formel/professionnel/accessible |
| created_at | Timestamp | Date création |

### CLIENT
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| cabinet_id | UUID | FK vers Cabinet |
| file_number | String | N° dossier interne |
| name | String | Raison sociale |
| legal_form | Enum | SASU/SAS/SARL/EURL/SCI/... |
| siren | String(9) | N° SIREN |
| sector_id | UUID | FK vers Secteur |
| profile_id | UUID | FK vers Profil Client |
| employee_count | Enum | 0/1-10/11-50/50+ |
| lifecycle_phase | Enum | onboarding/active/event/offboarding |
| specifics | JSON | Spécificités client |
| created_at | Timestamp | Date création |

### COLLABORATEUR
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| cabinet_id | UUID | FK vers Cabinet |
| employee_id | String | Matricule |
| firstname | String | Prénom |
| lastname | String | Nom |
| job_title | String | Poste |
| job_category | Enum | production/support/direction |
| department | Enum | compta/social/juridique/audit/support |
| skills | Array[UUID] | FK vers Compétences maîtrisées |
| skills_level | JSON | {skill_id: level} |
| capacity_hours | Integer | Heures productives/an |
| allocated_hours | Integer | Heures déjà affectées |
| hire_date | Date | Date entrée |
| turnover_risk | Enum | faible/moyen/élevé/critique |
| is_referent_for | Array[String] | Sujets de référence |
| created_at | Timestamp | Date création |

### COMPÉTENCE
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| code | String | Code unique (FISC-001) |
| family | Enum | FISCAL/SOCIAL/COMPTABLE/JURIDIQUE/OUTILS/TRANSVERSE |
| subfamily | String | Sous-catégorie |
| name | String | Libellé |
| description | Text | Description détaillée |
| complexity | Integer | 1-5 |
| certifiable | Boolean | Certification possible |
| training | String | Formation associée |

### PROFIL_CLIENT
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| code | String | Code unique (TPE_BTP) |
| name | String | Libellé |
| description | Text | Description |
| typical_size | String | Taille typique |
| complexity | Integer | 1-5 |
| required_skills | Array[UUID] | Compétences requises |
| sector_id | UUID | Secteur associé (optionnel) |

### CONTENU
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| cabinet_id | UUID | FK vers Cabinet |
| element_type | Enum | competence/profile/event/sector |
| element_id | UUID | FK vers l'élément concerné |
| content_type_id | UUID | FK vers Type Contenu |
| status | Enum | missing/draft/review/validated/published |
| title | String | Titre |
| body | Text | Contenu markdown |
| notion_page_id | String | ID page Notion |
| created_by | UUID | FK vers Collaborateur |
| validated_by | UUID | FK vers Collaborateur |
| created_at | Timestamp | Date création |
| validated_at | Timestamp | Date validation |
| published_at | Timestamp | Date publication |
| next_review | Date | Prochaine révision |
| feedback_score | Float | Score feedback utilisateurs |

### TYPE_CONTENU
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| code | String | Code unique (PROC, CHECK...) |
| name | String | Libellé |
| description | Text | Description |
| output_format | String | Format de sortie |
| target_length | String | Longueur cible |
| structure | Text | Structure attendue |
| prompt_template | Text | Prompt de génération |

### AFFECTATION
| Champ | Type | Description |
|-------|------|-------------|
| id | UUID | Identifiant unique |
| client_id | UUID | FK vers Client |
| collaborator_id | UUID | FK vers Collaborateur |
| role | Enum | associé/manager/production/support |
| start_date | Date | Début affectation |
| end_date | Date | Fin affectation (si applicable) |
| matching_score | Integer | Score de matching (0-100) |
| hours_budget | Integer | Heures budgétées |
| hours_actual | Integer | Heures réelles |

---

# 4. FICHIER EXCEL - STRUCTURE DÉTAILLÉE

## 4.1 Liste des 20 onglets

| # | Onglet | Couche | Lignes | Colonnes | Description |
|---|--------|--------|--------|----------|-------------|
| 1 | Dictionnaire_Champs | Référentiel | 57 | 8 | Champs clients standardisés |
| 2 | Champs_Complementaires | Référentiel | 21 | 6 | Champs suggérés à ajouter |
| 3 | Questions_IA | Référentiel | 22 | 4 | Exemples de requêtes IA |
| 4 | Template_Donnees | Référentiel | 2 | 29 | Modèle de données client |
| 5 | Référentiel_Secteurs | Référentiel | 11 | 9 | Secteurs avec spécificités |
| 6 | Champs_Sectoriels | Référentiel | 14 | 5 | Champs sectoriels |
| 7 | Référentiel_Compétences | Référentiel | 130 | 8 | Compétences métier |
| 8 | Champs_Collaborateur | Référentiel | 47 | 7 | Champs collaborateur |
| 9 | Profils_Clients_Compétences | Référentiel | 15 | 10 | Mapping profil→compétences |
| 10 | Matrice_Matching | Orchestration | ~15 | 4 | Exemple de matching |
| 11 | Algorithme_Matching | Orchestration | ~25 | 6 | Logique de l'algorithme |
| 12 | Cycle_Vie_Client | Référentiel | 23 | 7 | Événements du cycle |
| 13 | Architecture_Globale | Documentation | ~70 | 2 | Vue d'ensemble |
| 14 | Types_Contenus | Référentiel | 16 | 8 | Types de contenus |
| 15 | Contenus_Requis | Référentiel | ~30 | 13 | Matrice éléments×types |
| 16 | Contexte_Cabinet | Contextualisation | 20 | 6 | Variables de personnalisation |
| 17 | Prompts_Systeme | Moteur IA | 3 | 5 | Prompts système |
| 18 | Prompts_Par_Type | Moteur IA | 11 | 5 | Prompts par type de contenu |
| 19 | Flux_Production | Orchestration | 13 | 6 | Workflow de production |
| 20 | Suivi_Production | Orchestration | ~10 | 13 | Template de suivi |

## 4.2 Relations entre onglets

```
Référentiel_Compétences ◄───────┐
        │                       │
        │ code compétence       │ skills_required
        ▼                       │
Contenus_Requis ◄───────────────┤
        │                       │
        │ element_id            │
        ▼                       │
Profils_Clients_Compétences ────┘
        │
        │ profile_id
        ▼
Champs_Collaborateur
        │
        │ skills[]
        ▼
Algorithme_Matching
        │
        │ score
        ▼
Matrice_Matching
```

---

# 5. SYSTÈME DE PROMPTS

## 5.1 Architecture des prompts

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTÈME DE PROMPTS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐                                           │
│  │ PROMPT SYSTÈME  │  (SYS-001)                                │
│  │ GLOBAL          │                                           │
│  │                 │  Définit le rôle, le contexte cabinet,    │
│  │                 │  les règles générales                      │
│  └────────┬────────┘                                           │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                           │
│  │ VARIABLES       │  (Contexte_Cabinet)                       │
│  │ CONTEXTE        │                                           │
│  │                 │  {{cabinet_name}}, {{cabinet_size}},      │
│  │                 │  {{cabinet_tools_compta}}, ...            │
│  └────────┬────────┘                                           │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                           │
│  │ PROMPT PAR TYPE │  (PROC, CHECK, FAQ, GUIDE, ...)           │
│  │                 │                                           │
│  │                 │  Structure spécifique au type de contenu  │
│  │                 │  + variables de l'élément                 │
│  └────────┬────────┘                                           │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                           │
│  │ CONTENU GÉNÉRÉ  │                                           │
│  │                 │                                           │
│  │ Markdown adapté │                                           │
│  │ au cabinet      │                                           │
│  └─────────────────┘                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 5.2 Variables disponibles

### Variables Cabinet ({{cabinet_*}})
- `{{cabinet_name}}` - Nom du cabinet
- `{{cabinet_size}}` - Taille (micro/petit/moyen/grand/très_grand)
- `{{cabinet_structure}}` - Organisation (généraliste/pôles/multi-sites)
- `{{cabinet_sectors}}` - Secteurs clients
- `{{cabinet_tools_compta}}` - Outil comptable
- `{{cabinet_tools_paie}}` - Outil paie
- `{{cabinet_tone}}` - Ton souhaité
- `{{content_detail_level}}` - Niveau de détail

### Variables Élément ({{element_*}})
- `{{element_name}}` - Nom de l'élément
- `{{element_code}}` - Code de l'élément
- `{{competence_code}}` - Code compétence si applicable
- `{{sector}}` - Secteur si applicable
- `{{target_level}}` - Niveau cible (junior/confirmé/senior)

### Variables Contenu ({{content_*}})
- `{{content_type}}` - Type de contenu
- `{{include_examples}}` - Inclure exemples (oui/non)
- `{{include_legal_refs}}` - Inclure références légales

---

# 6. FLUX DE PRODUCTION

## 6.1 Workflow complet

```
┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
│CONFIG│───▶│ SCAN │───▶│MATCH │───▶│ GAPS │───▶│ PLAN │
└──────┘    └──────┘    └──────┘    └──────┘    └──────┘
                                                    │
┌──────────────────────────────────────────────────┘
│
▼
┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
│GENER.│───▶│REVIEW│───▶│VALID.│───▶│PUBLI.│───▶│NOTIFY│
└──────┘    └──────┘    └──────┘    └──────┘    └──────┘
                                                    │
                                    ┌───────────────┘
                                    ▼
                               ┌──────────┐
                               │ MONITOR  │◄────┐
                               └────┬─────┘     │
                                    │           │
                                    ▼           │
                               ┌──────────┐     │
                               │ UPDATE   │─────┘
                               └──────────┘
```

## 6.2 Détail des étapes

| Étape | Action | Automatisation |
|-------|--------|----------------|
| 1. CONFIG | Paramétrer le contexte cabinet | Manuel (onboarding) |
| 2. SCAN | Scanner les contenus existants | Auto (MCP Notion) |
| 3. MATCH | Comparer référentiel vs existants | Auto |
| 4. GAPS | Identifier les manques | Auto + validation humaine |
| 5. PLAN | Planifier la production | Semi-auto |
| 6. GENERATE | Générer le contenu | Auto (Claude) |
| 7. REVIEW | Relire et ajuster | Manuel (expert) |
| 8. VALIDATE | Valider le contenu | Manuel (manager) |
| 9. PUBLISH | Publier | Auto (MCP Notion) |
| 10. NOTIFY | Notifier les utilisateurs | Auto |
| 11. MONITOR | Suivre usage et feedback | Auto |
| 12. UPDATE | Mettre à jour si besoin | Déclenché par feedback |

---

# 7. STATISTIQUES DU FRAMEWORK

## 7.1 Chiffres clés

| Élément | Quantité |
|---------|----------|
| Champs clients | 85 (57 + 21 + 14) |
| Champs collaborateurs | 47 |
| Compétences référencées | 130 |
| Profils clients types | 15 |
| Secteurs détaillés | 11 |
| Événements cycle de vie | 23 |
| Types de contenus | 16 |
| Variables contexte cabinet | 20 |
| Prompts système | 3 |
| Prompts par type | 11 |
| Étapes workflow | 13 |
| **Total onglets Excel** | **20** |

## 7.2 Couverture estimée

Si un cabinet implémente le framework complet :

| Calcul | Résultat |
|--------|----------|
| Compétences × Types contenus moyens | 130 × 5 = **650 contenus** |
| Profils × Types contenus | 15 × 6 = **90 contenus** |
| Événements × Types contenus | 23 × 4 = **92 contenus** |
| Secteurs × Types contenus | 11 × 4 = **44 contenus** |
| **TOTAL ESTIMÉ** | **~876 contenus** |

---

# 8. PROCHAINE ÉTAPE : MIGRATION SUPABASE + REACT

Voir le document `Architecture_Technique_Supabase_React.md` pour :
- Schéma de base de données PostgreSQL
- API et fonctions Edge
- Structure du frontend React
- Intégration MCP Notion
- Déploiement

---

*Document généré le 24/12/2024*
*Version 1.0*

---

# 9. PILIER PROCESSUS (Ajout V2)

## 9.1 Vue d'ensemble

Le pilier PROCESSUS répond à la question : **"COMMENT faire ?"**

C'est le cœur opérationnel du système. Sans processus documentés, on a des compétences et des contenus... mais pas de mode d'emploi pour faire tourner le cabinet.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PILIER PROCESSUS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ RÉFÉRENTIEL │    │   ÉTAPES    │    │   RÈGLES    │    │ CALENDRIER  │  │
│  │  PROCESSUS  │───▶│  DÉTAILLÉES │───▶│  DE GESTION │───▶│ OBLIGATIONS │  │
│  │  31 proc.   │    │  48 étapes  │    │  25 règles  │    │  30 dates   │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                                                        │         │
│         │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│         └───▶│   RACI      │    │    SLA      │    │    KPI      │◀───────┘│
│              │ 41 lignes   │    │  20 engag.  │    │  24 indic.  │         │
│              └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                             │
│                          ┌─────────────┐                                   │
│                          │  SCRIPTS    │                                   │
│                          │  RELANCE    │                                   │
│                          │  12 modèles │                                   │
│                          └─────────────┘                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Référentiel des processus

### Structure d'un processus

| Champ | Description | Exemple |
|-------|-------------|---------|
| Code_Processus | Identifiant unique | PROC-FIS-001 |
| Famille | Catégorie principale | FISCAL |
| Sous-famille | Sous-catégorie | TVA |
| Nom_Processus | Libellé clair | Déclaration TVA CA3 mensuelle |
| Description | Objectif du processus | Établissement et télétransmission de la CA3 |
| Déclencheur | Ce qui lance le processus | 5 du mois suivant |
| Fréquence | Récurrence | Mensuelle |
| Criticité | Importance | Haute / Critique |
| Durée_Moyenne | Temps estimé | 1h |
| Nb_Etapes | Nombre d'étapes | 8 |
| Rôle_Principal | Responsable | Collaborateur |
| Compétences_Clés | Codes compétences requises | FISC-012 |
| Outils_Utilisés | Applications | impots.gouv, Outil compta |

### Familles de processus

| Famille | Nombre | Couverture |
|---------|--------|------------|
| **COMPTABLE** | 8 | Saisie, Rapprochement, Révision cycles, Clôture, Liasse |
| **FISCAL** | 7 | TVA (CA3/CA12), IS, IR, CFE/CVAE, Contrôle fiscal |
| **SOCIAL** | 8 | Paie, DSN, Embauche, Départ, Rupture conv., Contrôle URSSAF |
| **JURIDIQUE** | 5 | AG, Création société, Cessions, Dissolution |
| **TRANSVERSE** | 3 | Onboarding, Offboarding, RDV bilan |
| **Total** | **31** | |

## 9.3 Étapes des processus

### Structure d'une étape

| Champ | Description |
|-------|-------------|
| Code_Processus | Lien vers le processus parent |
| N°_Etape | Ordre dans le processus |
| Nom_Etape | Libellé de l'étape |
| Description | Ce qu'il faut faire |
| Responsable | Qui exécute |
| Délai | Timing (J, J+1, J-2...) |
| Input | Ce dont on a besoin |
| Output | Ce qu'on produit |
| Outil | Application utilisée |
| Point_Contrôle | Comment vérifier |
| Règle_Gestion | Condition particulière |

### Exemple : Déclaration TVA CA3 (8 étapes)

```
Étape 1 : Extraction balance TVA
   │      Input: Compta clôturée → Output: Balance 445*
   ▼
Étape 2 : Contrôle cohérence CA/TVA
   │      Contrôle: Ratio dans la norme sectorielle
   ▼
Étape 3 : Vérification TVA déductible
   │      Règle: TVA non conforme → exclure
   ▼
Étape 4 : Calcul du solde
   │      Output: TVA à payer ou crédit
   ▼
Étape 5 : Remplissage formulaire CA3
   │      Outil: impots.gouv
   ▼
Étape 6 : Validation manager
   │      Règle: Obligatoire si TVA > 5k€
   ▼
Étape 7 : Télétransmission
   │      Délai: M+1 J5 max
   ▼
Étape 8 : Archivage et suivi paiement
          Contrôle: Paiement effectué à J+10
```

## 9.4 Règles de gestion

### Catégories de règles

| Catégorie | Nombre | Exemples |
|-----------|--------|----------|
| **Délais** | 4 | TVA J+19, Liasse +3 mois, DSN 5/15, AG +6 mois |
| **Validation** | 4 | Décla > 10k€ → validation manager |
| **Contrôle** | 5 | Ratio TVA, Variation CA > 30%, Créances > 90j |
| **Affectation** | 3 | Score matching > 50%, Capacité < 110% |
| **Relance** | 3 | Pièces J+7, Validation J-2, Impayés 30j |
| **Sectoriel** | 4 | Autoliq BTP, CIBTP, Multi-taux CHR |
| **Qualité** | 2 | Revue annuelle, Doc minimum |

### Structure d'une règle

```
┌─────────────────────────────────────────────────────────────────────┐
│ Règle : RG-DEL-001 - Délai dépôt TVA CA3                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DÉCLENCHEUR : Fin de mois                                         │
│                     │                                               │
│                     ▼                                               │
│  CONDITION : Date jour > M+1 J15 ?                                 │
│                     │                                               │
│           ┌────────┴────────┐                                      │
│           ▼                 ▼                                       │
│        OUI               NON                                        │
│           │                 │                                       │
│           ▼                 ▼                                       │
│  ACTION : Alerter      RAS                                         │
│  collaborateur                                                      │
│  + manager                                                          │
│                                                                     │
│  CRITICITÉ : Critique                                              │
│  SOURCE : CGI Art. 287                                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 9.5 Calendrier des obligations

### Par domaine

| Domaine | Obligations | Exemples clés |
|---------|-------------|---------------|
| **FISCAL - TVA** | 4 | CA3 mensuelle J+19, CA12 mai, Acomptes |
| **FISCAL - IS** | 3 | Liasse +3 mois, Acomptes trimestriels, Solde |
| **FISCAL - IR** | 3 | 2042 mai-juin, 2035 BNC, 2031 BIC |
| **FISCAL - Autres** | 4 | CFE déc., CVAE mai, DAS2 mai |
| **SOCIAL** | 7 | DSN 5/15, URSSAF, Retraite, Formation, Apprentissage |
| **JURIDIQUE** | 3 | AG +6 mois, Dépôt comptes +1 mois AG, Bénéficiaires effectifs |
| **SECTORIEL** | 2 | CIBTP mensuel, MSA trimestriel |

### Alertes automatiques suggérées

| Échéance | Rappel J-30 | Rappel J-14 | Rappel J-7 | Alerte J-3 |
|----------|-------------|-------------|------------|------------|
| TVA CA3 | - | ✓ | ✓ | ✓ |
| Liasse fiscale | ✓ | ✓ | ✓ | ✓ |
| DSN | - | - | ✓ | ✓ |
| AG | ✓ | ✓ | - | - |

## 9.6 Matrices RACI

### Légende

| Lettre | Signification | Rôle |
|--------|---------------|------|
| **R** | Responsible | Réalise l'action |
| **A** | Accountable | Approuve / Valide |
| **C** | Consulted | Consulté avant décision |
| **I** | Informed | Informé du résultat |

### Exemple : Processus TVA CA3

| Étape | Collaborateur | Manager | Associé | Client |
|-------|--------------|---------|---------|--------|
| Extraction balance | **R** | I | - | - |
| Contrôle cohérence | **R** | C | - | - |
| Remplissage CA3 | **R** | I | - | - |
| Validation | I | **A** | I | - |
| Télétransmission | **R** | I | - | - |
| Archivage | **R** | - | - | I |

## 9.7 SLA et engagements de service

### Catégories d'engagements

| Catégorie | Exemples |
|-----------|----------|
| **Délais de traitement** | Tenue M+10j, Paie J-3, TVA J-5 |
| **Délais de réponse** | Email 24h, Téléphone 2h, Note conseil 5j |
| **Qualité** | Taux erreur < 2%, Satisfaction > 4/5 |
| **Disponibilité** | Téléphone 9h-18h, Portail 99% |
| **Onboarding** | Mise en production 30j |

### Système de seuils

```
VERT (✓)     ORANGE (⚠️)     ROUGE (✗)
   │              │               │
   ▼              ▼               ▼
Objectif      Vigilance       Alerte
atteint       requise         action
```

## 9.8 Indicateurs KPI

### Dashboard type

```
┌────────────────────────────────────────────────────────────────────┐
│                    TABLEAU DE BORD KM                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  PRODUCTION                          QUALITÉ                       │
│  ┌──────────────┐ ┌──────────────┐  ┌──────────────┐              │
│  │ Facturation  │ │ Occupation   │  │ Taux erreur  │              │
│  │    78%       │ │    92%       │  │    1.2%      │              │
│  │    🟢        │ │    🟢        │  │    🟢        │              │
│  └──────────────┘ └──────────────┘  └──────────────┘              │
│                                                                    │
│  CLIENT                              KM                            │
│  ┌──────────────┐ ┌──────────────┐  ┌──────────────┐              │
│  │     NPS      │ │  Rétention   │  │ Couverture   │              │
│  │     +52      │ │    96%       │  │    72%       │              │
│  │    🟢        │ │    🟢        │  │    🟠        │              │
│  └──────────────┘ └──────────────┘  └──────────────┘              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### KPI par catégorie

| Catégorie | KPI clés | Cible |
|-----------|----------|-------|
| **Production** | Taux facturation, Occupation, Respect délais | > 75%, 80-95%, > 98% |
| **Qualité** | Erreurs décla, Erreurs paie, Score revue | < 2%, < 1%, > 4/5 |
| **Client** | NPS, Rétention, Délai onboarding | > 50, > 95%, < 20j |
| **RH** | Turnover, Formation, Satisfaction | < 10%, > 20h, > 4/5 |
| **Financier** | CA/collab, Marge, DSO | > 120k€, > 40%, < 45j |
| **KM** | Couverture doc, Utilisation, Fraîcheur | > 80%, > 10/mois, > 80% |

## 9.9 Scripts de relance

### Typologie des relances

| Situation | Déclencheur | Canal | Tonalité |
|-----------|-------------|-------|----------|
| Pièces manquantes J+7 | Délai | Email | Courtois |
| Pièces manquantes J+14 | Délai | Email + Tél | Ferme |
| Validation paie J-2 | Échéance | Email | Urgent |
| Validation bilan J-10 | Échéance | Email + Tél | Professionnel |
| Facture impayée +30j | Comptabilité | Email | Courtois |
| Facture impayée +45j | Comptabilité | Email + Courrier | Ferme |
| Facture impayée +60j | Comptabilité | LRAR | Formel |
| Documents onboarding | Onboarding | Email | Bienveillant |
| Confirmation RDV | Planning | Email | Professionnel |
| RDV non planifié | Suivi | Email + Tél | Proactif |
| Contrôle fiscal | Urgence | Email | Urgent |

### Variables disponibles

Les scripts utilisent des variables pour personnalisation automatique :

- `{{client_name}}` - Nom du client
- `{{contact_prenom}}` - Prénom du contact
- `{{mois}}` / `{{date_*}}` - Dates
- `{{montant}}` - Montants
- `{{signature}}` - Signature du collaborateur
- `{{outil_depot}}` - Nom de l'outil de dépôt
- etc.

---

# 10. STATISTIQUES FINALES DU FRAMEWORK

## 10.1 Chiffres clés V2

| Catégorie | Élément | Quantité |
|-----------|---------|----------|
| **Structure** | Onglets | 30 |
| **Client** | Champs clients | 92 (57+21+14) |
| **Client** | Profils types | 15 |
| **Client** | Secteurs | 11 |
| **Compétences** | Compétences | 130 |
| **Collaborateur** | Champs | 47 |
| **Processus** | Processus | 31 |
| **Processus** | Étapes détaillées | 48 |
| **Processus** | Règles de gestion | 25 |
| **Processus** | Obligations calendrier | 30 |
| **Processus** | Lignes RACI | 41 |
| **Processus** | SLA | 20 |
| **Processus** | KPI | 24 |
| **Processus** | Scripts relance | 12 |
| **Cycle de vie** | Événements | 23 |
| **Contenu** | Types | 16 |
| **Contenu** | Variables contexte | 20 |
| **IA** | Prompts | 18 (3+11+4) |

## 10.2 Couverture estimée

Pour un cabinet implémentant le framework complet :

| Calcul | Contenus estimés |
|--------|------------------|
| Compétences × 5 types moyens | ~650 |
| Processus × 4 types moyens | ~124 |
| Profils × 6 types | ~90 |
| Événements × 4 types | ~92 |
| Secteurs × 4 types | ~44 |
| **TOTAL** | **~1000 contenus** |

---

*Document mis à jour le 24/12/2024*
*Version 2.0 - Ajout pilier PROCESSUS*
