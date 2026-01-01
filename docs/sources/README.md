# Sources du Mémoire DEC

Ce dossier centralise toutes les sources à analyser pour alimenter le mémoire.

---

## Structure

```
sources/
├── ouvrages/           # Livres (PDF, extraits)
├── memoires-dec/       # Mémoires DEC existants
├── articles/           # Articles académiques, presse pro
├── rapports/           # Études CSOEC, Ordre, cabinets conseil
├── web/                # Captures web, articles en ligne
├── fiches-lecture/     # Fiches d'analyse générées
└── REGISTRE.md         # Index de toutes les sources
```

---

## Comment déposer une source

1. **Placer le fichier** dans le bon sous-dossier
2. **Nommer clairement** : `AUTEUR_Titre-court_ANNEE.pdf`
3. **Demander l'analyse** au Rédacteur

**Exemples de nommage :**
- `NONAKA_Knowledge-Creating-Company_1995.pdf`
- `AMAR_Memoire-Agile-Cabinet_2021.pdf`
- `CSOEC_Rapport-Profession_2024.pdf`

---

## Méthodologie d'analyse (MODE ANALYSE)

### Étape 1 : Lecture et extraction
- Identifier la thèse principale
- Extraire les concepts clés
- Repérer les définitions importantes
- Noter les données chiffrées

### Étape 2 : Citations utilisables
- Extraire les citations marquantes (< 40 mots → guillemets)
- Identifier les passages longs à paraphraser
- Noter les pages exactes

### Étape 3 : Mapping mémoire
- Associer chaque extrait à une section du plan
- Identifier les apports uniques de la source
- Repérer les contradictions avec d'autres sources

### Étape 4 : Fiche de lecture
- Générer une fiche structurée dans `fiches-lecture/`
- Format : `FICHE_AUTEUR_Titre_ANNEE.md`

---

## Format des fiches de lecture

```markdown
# Fiche de lecture : [Titre]

## Métadonnées
- **Auteur(s)** :
- **Titre complet** :
- **Éditeur / Source** :
- **Année** :
- **Type** : Ouvrage | Mémoire DEC | Article | Rapport | Web
- **Fichier** : `sources/[dossier]/[fichier]`

## Résumé (5 lignes max)
[...]

## Concepts clés
| Concept | Définition | Page |
|---------|------------|:----:|
| ... | ... | ... |

## Citations utilisables
### Pour section X.X
> "Citation exacte" (p. XX)

**Usage** : [Comment l'utiliser dans le mémoire]

### Pour section Y.Y
> "Citation exacte" (p. XX)

## Données chiffrées
| Donnée | Valeur | Contexte | Page |
|--------|--------|----------|:----:|
| ... | ... | ... | ... |

## Apport pour le mémoire
- [ ] Section 1.1 : [Apport]
- [ ] Section 2.3 : [Apport]
- [ ] ...

## Limites / Points d'attention
- [...]

## Références croisées
- Confirme : [Auteur X, concept Y]
- Contredit : [Auteur Z, sur point W]
```

---

## Registre des sources

Le fichier `REGISTRE.md` maintient l'index de toutes les sources avec leur statut :

| Statut | Signification |
|:------:|---------------|
| 📥 | Déposée (à analyser) |
| 🔍 | En cours d'analyse |
| ✅ | Analysée (fiche créée) |
| 📝 | Intégrée au mémoire |

---

## Demander une analyse

Pour analyser une source, dis au Rédacteur :

```
Analyse la source : docs/sources/ouvrages/NONAKA_Knowledge-Creating-Company_1995.pdf
```

Le Rédacteur va :
1. Lire le document
2. Appliquer la méthodologie
3. Créer la fiche de lecture
4. Mettre à jour le registre
