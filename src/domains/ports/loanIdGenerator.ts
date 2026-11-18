import type { LoanId } from "../entities"

/** Port qui fournit les identifiants d'emprunt. */
export type LoanIdGenerator = {
  /** @returns un nouvel identifiant, jamais renvoyé auparavant. Chaque appel en consomme un. */
  next(): LoanId
}
