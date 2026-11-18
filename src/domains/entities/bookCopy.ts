import type { Brand } from "../shared/brand"

/** Identifiant d'un exemplaire physique (pas d'un titre de livre). */
export type BookCopyId = Brand<string, "BookCopyId">

/**
 * AVAILABLE : peut être emprunté.
 * BORROWED  : couvert par exactement un emprunt en cours.
 */
export type BookCopyStatus = "AVAILABLE" | "BORROWED"

export type BookCopy = {
  readonly id : BookCopyId,
  readonly status : BookCopyStatus
}

/**
 * Valide un identifiant d'exemplaire reçu de l'extérieur (ex. une requête HTTP).
 * Ne vérifie que la forme : l'existence se vérifie avec `bookCopyRepository.findById`.
 * @returns l'identifiant sans espaces autour, ou `undefined` s'il est vide.
 */
export function parseBookCopyId(str : string): BookCopyId | undefined {
  const trimmed = str.trim()
  return trimmed === "" ? undefined : trimmed as BookCopyId
}
