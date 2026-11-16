# Exercice : concevoir un domaine métier

> Sujet métier en cours de définition.

## Objectif

Concevoir une petite application autour de **trois use cases** : trois fonctions qui constituent des points d'entrée du métier.

L'objectif n'est pas de produire le maximum de code, mais de **décrire précisément le comportement attendu**. Le professeur sélectionnera le code d'un use case et demandera à un modèle d'IA peu puissant de l'implémenter.

**Le modèle ne doit avoir aucune règle métier à deviner.**

## Travail demandé

1. Identifier les entités et leurs responsabilités.
2. Définir les types, les ports et les règles métier nécessaires.
3. Déclarer trois use cases avec des contrats explicites.
4. Prévoir les cas nominaux, les cas limites et les refus métier.
5. Vérifier que chaque use case peut être implémenté en se fondant sur son contrat et les définitions du projet.

La forme des contraintes et des abstractions métier est **laissée à votre appréciation**. Créez les outils qui rendent les règles explicites plutôt que de les laisser implicites.

## Contrat attendu pour chaque use case

Le modèle d'IA doit pouvoir déterminer sans interprétation :

- Les entrées, leur signification et leurs types.
- Les préconditions et les règles métier exactes.
- Les lectures, modifications d'état et effets attendus.
- Les dépendances utilisées à travers des ports.
- Les valeurs de retour et les erreurs possibles.
- Le comportement attendu dans les cas limites.

Exprimez autant que possible ces informations dans les types, les signatures et les commentaires proches du code concerné.

**L'ambiguïté d'une règle ou d'un comportement fait partie de l'évaluation.**

## Structure de départ

- `src/domains/entities/` : entités métier.
- `src/domains/repositories/` : ports de persistance.
- `src/domains/useCase/` : points d'entrée du métier.
- `src/infrastructure/` : serveur Express et implémentations techniques.

Vous pouvez ajouter les fichiers et dossiers nécessaires à votre conception.

Le sujet métier précis et les trois use cases seront indiqués ici après validation du sujet.

## Démarrage

```bash
pnpm install
pnpm dev
```

Le serveur Express expose `GET /health`. Utilisez `pnpm typecheck` pour vérifier le typage.
