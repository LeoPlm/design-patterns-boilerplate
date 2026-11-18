import type { BookCopyId, ClosedLoan } from "../entities"
import { computeLateDays } from "../entities"
import type { BookCopyRepository, LoanRepository } from "../repositories"
import type { Clock } from "../ports/clock"
import { success, failure, type Result } from "../shared/result"

export type ReturnBookInput = {
  readonly copyId : BookCopyId
}

export type ReturnBookError =
  /** Aucun emprunt en cours pour cet exemplaire (inclut : exemplaire inconnu, ou déjà rendu). */
  | { readonly code : "NO_ACTIVE_LOAN", readonly copyId : BookCopyId }
  /** Incohérence de données : un emprunt en cours existe mais l'exemplaire est introuvable. */
  | { readonly code : "COPY_NOT_FOUND", readonly copyId : BookCopyId }

export type ReturnBookDependencies = {
  readonly loanRepository : LoanRepository,
  readonly bookCopyRepository : BookCopyRepository,
  readonly clock : Clock
}

/** @returns l'emprunt clôturé (`ClosedLoan`, avec `returnedAt` et `lateDays`) en cas de succès. */
export type ReturnBookUseCase = (input : ReturnBookInput) => Promise<Result<ClosedLoan, ReturnBookError>>

export type ReturnBookFactory = (dependencies : ReturnBookDependencies) => ReturnBookUseCase

/**
 * Situation 3 : un adhérent rapporte un exemplaire.
 *
 * Algorithme, dans CET ordre (on s'arrête au premier refus) :
 * 1. `loanRepository.findActiveByCopyId(copyId)` -> absent : NO_ACTIVE_LOAN
 * 2. `bookCopyRepository.findById(copyId)`       -> absent : COPY_NOT_FOUND
 * 3. `returnedAt = clock.now()` (appelé UNE seule fois)
 * 4. `lateDays = computeLateDays(loan.dueDate, returnedAt)`
 * 5. Créer le `ClosedLoan` : `{ ...loan, returnedAt, lateDays }`
 * 6. `loanRepository.save(closedLoan)`
 * 7. `bookCopyRepository.save({ ...copy, status: "AVAILABLE" })`
 * 8. Retourner `success(closedLoan)`
 *
 * Règles :
 * - Un retour en retard est TOUJOURS accepté : le retard n'est jamais une erreur,
 *   il est seulement enregistré dans `lateDays`.
 * - Rendre un exemplaire déjà rendu donne NO_ACTIVE_LOAN (et ne modifie rien).
 *
 * Garanties :
 * - En cas de refus, aucun `save` n'est appelé et `clock.now` non plus.
 * - Le use case ne lève pas d'exception pour un refus métier.
 * - Les erreurs techniques (une promesse rejetée par un port) ne sont ni interceptées
 *   ni transformées en `failure` : elles remontent telles quelles à l'appelant.
 */
export const createReturnBook: ReturnBookFactory = ({ loanRepository, bookCopyRepository, clock }) => {
  return async (input) => {
    const loan = await loanRepository.findActiveByCopyId(input.copyId)
    if (loan === undefined) {
      return failure({ code: "NO_ACTIVE_LOAN", copyId: input.copyId })
    }

    const copy = await bookCopyRepository.findById(input.copyId)
    if (copy === undefined) {
      return failure({ code: "COPY_NOT_FOUND", copyId: input.copyId })
    }

    const returnedAt = clock.now()
    const closedLoan: ClosedLoan = {
      ...loan,
      returnedAt,
      lateDays: computeLateDays(loan.dueDate, returnedAt),
    }

    await loanRepository.save(closedLoan)
    await bookCopyRepository.save({ ...copy, status: "AVAILABLE" })
    return success(closedLoan)
  }
}
