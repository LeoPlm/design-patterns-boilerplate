/** Port qui fournit la date du jour. */
export type Clock = {
  /** @returns l'instant présent. */
  now(): Date
}
