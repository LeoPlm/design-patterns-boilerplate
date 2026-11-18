import type { Brand } from "../shared/brand"
import type { MemberId } from "./member"
import type { BookCopyId } from "./bookCopy"

export type LoanId = Brand<string, "LoanId">

/**
 * Un emprunt est "en cours" tant que `returnedAt` vaut `undefined`.
 * Au retour : `returnedAt` est renseigné ET `lateDays` est un nombre (0 si rendu à temps).
 * Tant que l'emprunt est en cours, `lateDays` vaut `undefined`.
 */
export type Loan = {
  readonly id : LoanId,
  readonly memberId : MemberId,
  readonly copyId : BookCopyId,
  readonly borrowedAt : Date,
  readonly dueDate : Date,
  readonly returnedAt : Date | undefined,
  readonly lateDays : number | undefined
}

/** Durée d'un emprunt, en jours. */
export const LOAN_DURATION_DAYS = 14

/** Nombre maximum d'emprunts en cours par adhérent. */
export const MAX_ACTIVE_LOANS = 3

/**
 * @param activeLoansCount nombre d'emprunts en cours de l'adhérent, AVANT le nouvel emprunt
 * @returns true si l'adhérent ne peut plus emprunter (il en a déjà 3 ou plus)
 */
export function isLoanLimitReached(activeLoansCount : number): boolean {
  return activeLoansCount >= MAX_ACTIVE_LOANS
}

/** @returns la date de retour prévue : `borrowedAt` + 14 jours. Ne modifie pas l'argument. */
export function computeDueDate(borrowedAt : Date): Date {
  const due = new Date(borrowedAt.getTime())
  due.setUTCDate(due.getUTCDate() + LOAN_DURATION_DAYS)
  return due
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function startOfUtcDay(date : Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

/**
 * Compare les JOURS calendaires (UTC), pas les heures :
 * rendu le jour de `dueDate`, à n'importe quelle heure -> 0.
 * @returns le nombre de jours de retard (entier >= 0), 0 si rendu à temps ou en avance.
 */
export function computeLateDays(dueDate : Date, returnedAt : Date): number {
  const days = Math.round((startOfUtcDay(returnedAt) - startOfUtcDay(dueDate)) / MS_PER_DAY)
  return Math.max(0, days)
}