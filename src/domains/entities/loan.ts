import type { Brand } from "../shared/brand"
import type { MemberId } from "./member"
import type { BookCopyId } from "./bookCopy"

/** Identifiant d'emprunt. Fourni par `LoanIdGenerator`, jamais modifié. */
export type LoanId = Brand<string, "LoanId">

/** Données communes à tous les emprunts. */
type LoanBase = {
  readonly id : LoanId,
  readonly memberId : MemberId,
  readonly copyId : BookCopyId,
  readonly borrowedAt : Date,
  readonly dueDate : Date
}

/** Emprunt EN COURS : l'exemplaire n'a pas encore été rapporté. */
export type ActiveLoan = LoanBase & {
  readonly returnedAt : undefined,
  readonly lateDays : undefined
}

/** Emprunt CLÔTURÉ : `lateDays` vaut 0 si l'exemplaire est rendu à temps ou en avance. */
export type ClosedLoan = LoanBase & {
  readonly returnedAt : Date,
  readonly lateDays : number
}

/** Un emprunt est en cours tant que `returnedAt` vaut `undefined`. */
export type Loan = ActiveLoan | ClosedLoan

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
