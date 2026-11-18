import type { MemberId } from "../entities"

/**
 * Port qui fournit les numéros d'adhérent.
 * Son implémentation est le seul endroit autorisé à fabriquer un `MemberId` (via `as MemberId`).
 * Ailleurs, un `MemberId` externe s'obtient avec `parseMemberId`.
 */
export type MemberIdGenerator = {
  /** @returns un nouveau numéro, jamais renvoyé auparavant. Chaque appel en consomme un. */
  next(): MemberId
}
