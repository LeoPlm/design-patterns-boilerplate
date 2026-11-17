declare const brand : unique symbol

/**
 * Type "marqué" : un string reste un string à l'exécution, mais TypeScript
 * refuse de mélanger un MemberId avec un Email ou un string quelconque.
 */
export type Brand<T, Name extends string> = T & { readonly [brand] : Name}