import type { Brand } from "../shared/brand"

/** Identifiant d'un exemplaire physique (pas d'un titre de livre). */
export type BookCopyId = Brand<string, "BookCopyId">

/**
 * AVAILABLE : peut être emprunté.
 * BORROWED  : couvert par exactement un emprunt en cours.
 */
export type BookCopyStatus = "AVALAIBLE" | "BORROWED"

export type BookCopy = {
  readonly id : BookCopyId,
  readonly status : BookCopyStatus
}

