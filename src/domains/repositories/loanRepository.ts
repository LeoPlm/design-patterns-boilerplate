import type { BookCopyId, Loan, MemberId } from "../entities"

/** Port de persistance des emprunts. */
export type LoanRepository = {
  /**
   * @returns le nombre d'emprunts EN COURS (`returnedAt === undefined`) de cet adhérent.
   * Les emprunts déjà rendus ne comptent pas.
   */
  countActiveByMemberId(memberId : MemberId): Promise<number>

  /**
   * @returns l'emprunt EN COURS (`returnedAt === undefined`) de cet exemplaire,
   * ou `undefined` s'il n'y en a pas. Ne lève pas d'erreur.
   * Un exemplaire a au plus un emprunt en cours.
   */
  findActiveByCopyId(copyId : BookCopyId): Promise<Loan | undefined>

  /**
   * Enregistre l'emprunt. S'il existe déjà un emprunt de même `id`, il est mis à jour
   * avec les valeurs reçues. Aucune vérification métier.
   */
  save(loan : Loan): Promise<void>
}
