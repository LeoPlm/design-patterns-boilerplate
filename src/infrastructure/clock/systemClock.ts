import type { Clock } from "../../domains/ports/clock"

/** Horloge réelle : l'instant présent du système. */
export const systemClock: Clock = {
    now: () => new Date(),
};
