import type { Email, Member } from "../entities/member"

/** Port de persistance des adhérents. */
export type MemberRepository = {
  /**
   * Cherche un adhérent par son email.
   * @param email email déjà normalisé
   * @returns l'adhérent trouvé, ou `undefined` s'il n'existe pas. Ne lève pas d'erreur.
   */
  findByEmail(email : Email): Promise<Member | undefined>

  /**
   * Enregistre un NOUVEL adhérent. Ne fait aucune vérification métier :
   * c'est au use case de les avoir faites avant l'appel.
   */
  save(member : Member): Promise<void>

}