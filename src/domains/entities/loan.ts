import type { Brand } from "../shared/brand"
import type { MemberId } from "../entities/member"
import type { BookCopyId } from "./bookCopy"

export type LoanId = Brand<string, "LoanId">

/**
 * Un emprunt est "en cours" tant que `returnedAt` vaut `undefined`.
 * `lateDays` n'est renseigné qu'au retour (voir situation 3).
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