import type { LoanId } from "../entities"

/**
 * Port qui fournit les identifiants d'emprunt.
 * Son implémentation est le seul endroit autorisé à fabriquer un `LoanId` (via `as LoanId`).
 */
export type LoanIdGenerator = {
  /** @returns un nouvel identifiant, jamais renvoyé auparavant. Chaque appel en consomme un. */
  next(): LoanId
}
