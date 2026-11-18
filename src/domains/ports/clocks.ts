/** Port qui fournit la date du jour. */
export type Clock = {
  // Instant présent
  now(): Date
}