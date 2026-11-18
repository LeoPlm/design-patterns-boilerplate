import type { Loan, MemberId } from "../entities"

/** Port de persistance des emprunts. */
export type LoanRepository = {
  /**
   * @returns le nombre d'emprunts EN COURS (`returnedAt === undefined`) de cet adhérent.
   * Les emprunts déjà rendus ne comptent pas.
   */
  countActiveByMemberId(memberId : MemberId): Promise<number>

  /** Enregistre l'emprunt. Aucune vérification métier. */
  save(loan : Loan): Promise<void>
}