# Exercice : concevoir un domaine métier

> Sujet métier en cours de définition.

## Objectif

Concevoir une petite application autour de **trois agrégats métier** et de leurs transactions (les points d'entrée du domaine).

Le but n'est pas seulement d'écrire du code qui fonctionne : il faut **rendre les intentions métier suffisamment explicites pour qu'un modèle d'IA peu puissant puisse implémenter une transaction sans interprétation ni question supplémentaire**.

## Déroulement

1. Identifier les trois agrégats, leurs responsabilités et leurs invariants.
2. Définir les entités, les types, les contraintes et les ports nécessaires.
3. Décrire les transactions métier avec des contrats explicites.
4. Vérifier que chaque transaction peut être implémentée à partir de son code et du contexte directement accessible.
5. Tester les cas nominaux et les refus métier.

Le professeur pourra sélectionner une transaction et demander directement à un modèle d'IA de l'implémenter. **Les ambiguïtés du contrat font partie de l'évaluation.**

## Contrat attendu pour chaque transaction

La définition d'une transaction doit permettre de déterminer sans deviner :

- Ses entrées et leur signification.
- Les conditions nécessaires à son exécution.
- Les règles métier à appliquer, y compris leurs limites exactes.
- Les modifications d'état et les effets attendus.
- Les sorties et les différents cas d'échec.
- Les dépendances nécessaires, définies par des ports.
- Le comportement attendu dans les cas limites.

Les règles doivent se trouver dans les types, les signatures et les commentaires proches de la transaction : **un agent ne doit pas devoir inventer ce qui manque**.

## Structure de départ

- `src/domains/constraints/` : contraintes métier.
- `src/domains/entities/` : entités du domaine.
- `src/domains/repositories/` : ports de persistance.
- `src/domains/useCase/` : emplacement provisoire des points d'entrée métier.
- `src/infrastructure/` : serveur Express et adaptateurs techniques.

Le domaine métier précis, ses trois agrégats et les transactions à concevoir seront ajoutés ici après choix du sujet.

## Lancer le projet

```bash
pnpm install
pnpm dev
```

Le serveur Express expose `GET /health`. La commande `pnpm typecheck` vérifie les types.
