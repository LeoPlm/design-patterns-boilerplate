import type { BookCopyId, Loan, MemberId } from "../entities"
import type { BookCopyRepository, LoanRepository, MemberRepository } from "../repositories"
import type { Clock } from "../ports/clock"
import type { LoanIdGenerator } from "../ports/loanIdGenerator"
import type { Result } from "../shared/result"

export type BorrowBookInput = {
  readonly memberId : MemberId,
  readonly copyId : BookCopyId
}

export type BorrowBookError =
  /** Aucun adhérent avec ce numéro. */
  | { readonly code : "MEMBER_NOT_FOUND", readonly memberId : MemberId }
  /** Aucun exemplaire avec cet identifiant. */
  | { readonly code : "COPY_NOT_FOUND", readonly copyId : BookCopyId }
  /** L'adhérent a déjà MAX_ACTIVE_LOANS emprunts en cours. */
  | { readonly code : "LOAN_LIMIT_REACHED", readonly memberId : MemberId }
  /** L'exemplaire existe mais son statut est "BORROWED". */
  | { readonly code : "COPY_NOT_AVAILABLE", readonly copyId : BookCopyId }

export type BorrowBookDependencies = {
  readonly memberRepository : MemberRepository,
  readonly bookCopyRepository : BookCopyRepository,
  readonly loanRepository : LoanRepository,
  readonly loanIdGenerator : LoanIdGenerator,
  readonly clock : Clock
}

/** @returns l'emprunt créé en cas de succès, sinon la raison du refus. */
export type BorrowBookUseCase = (input : BorrowBookInput) => Promise<Result<Loan, BorrowBookError>>

export type BorrowBookFactory = (dependencies : BorrowBookDependencies) => BorrowBookUseCase

/**
 * Situation 2 : un adhérent emprunte un exemplaire.
 *
 * Algorithme, dans CET ordre (on s'arrête au premier refus) :
 * 1. `memberRepository.findById(memberId)`      -> absent : MEMBER_NOT_FOUND
 * 2. `bookCopyRepository.findById(copyId)`      -> absent : COPY_NOT_FOUND
 * 3. `loanRepository.countActiveByMemberId(memberId)` puis `isLoanLimitReached(count)`
 *                                               -> true : LOAN_LIMIT_REACHED
 * 4. `copy.status !== "AVAILABLE"`              -> COPY_NOT_AVAILABLE
 * 5. `borrowedAt = clock.now()` (appelé UNE seule fois)
 * 6. Créer le Loan :
 *    id = `loanIdGenerator.next()`, borrowedAt, dueDate = `computeDueDate(borrowedAt)`,
 *    returnedAt = undefined, lateDays = undefined
 * 7. `loanRepository.save(loan)`
 * 8. `bookCopyRepository.save({ ...copy, status: "BORROWED" })`
 * 9. Retourner `success(loan)`
 *
 * Garanties :
 * - En cas de refus, aucun `save` n'est appelé, et ni `clock.now` ni `loanIdGenerator.next`.
 * - Le use case ne lève pas d'exception pour un refus métier.
 */
export const createBorrowBook: BorrowBookFactory = (_dependencies) => {
  return async (_input) => {
    throw new Error("Not implemented")
  }
}
