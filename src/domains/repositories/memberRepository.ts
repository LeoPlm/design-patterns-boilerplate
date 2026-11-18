import type { Email, Member, MemberId } from "../entities"

/** Port de persistance des adhérents. */
export type MemberRepository = {
  /**
   * Cherche un adhérent par son email.
   * @param email email déjà normalisé
   * @returns l'adhérent trouvé, ou `undefined` s'il n'existe pas. Ne lève pas d'erreur.
   */
  findByEmail(email : Email): Promise<Member | undefined>

  /**
   * Cherche un adhérent par son numéro.
   * @returns l'adhérent trouvé, ou `undefined` s'il n'existe pas. Ne lève pas d'erreur.
   */
  findById(id : MemberId): Promise<Member | undefined>

  /**
   * Enregistre un NOUVEL adhérent. Ne fait aucune vérification métier :
   * c'est au use case de les avoir faites avant l'appel.
   */
  save(member : Member): Promise<void>
}
