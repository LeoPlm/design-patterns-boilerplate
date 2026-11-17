import type { MemberId } from "../entities"

/** Port qui fournit les numéros d'adhérent. */
export type MemberIdGenerator = {
  /** @returns un nouveau numéro, jamais renvoyé auparavant. Chaque appel en consomme un. */
  next(): MemberId
}