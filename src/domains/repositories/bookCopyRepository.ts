import type { BookCopy, BookCopyId } from "../entities"

/** Port de persistance des exemplaires. */
export type BookCopyRepository = {
  /** @returns l'exemplaire, ou `undefined` s'il n'existe pas. Ne lève pas d'erreur. */
  findById(id : BookCopyId): Promise<BookCopy | undefined>

  /** Met à jour l'exemplaire portant le même `id` avec les valeurs reçues. Aucune vérification métier. */
  save(copy : BookCopy): Promise<void>
}
