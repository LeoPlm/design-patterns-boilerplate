import type { Email, Member } from "../entities/member"
import type { MemberRepository } from "../repositories"
import type { MemberIdGenerator } from "../ports/memberIdGenerator"
import { success, failure, type Result } from "../shared/result"

/** Données brutes saisies par le bibliothécaire : NON validées, NON normalisées. */
export type RegisterMemberInput = {
  readonly lastName : string,
  readonly firstName : string,
  readonly email : string
}

export type RegisterMemberError = 
  /** Un champ est invalide (voir parseName / parseEmail). */
  | { readonly code: "INVALID_INPUT"; readonly field: "lastName" | "firstName" | "email" }
  /** Un adhérent possède déjà cet email (après normalisation). */
  | { readonly code: "EMAIL_ALREADY_REGISTERED"; readonly email: Email }

export type RegisterMemberDependancies = {
  readonly memberRepository: MemberRepository
  readonly memberIdGenerator: MemberIdGenerator
}

/** @returns l'adhérent créé en cas de succès, sinon la raison du refus. */
export type RegisterMemberUseCase = (input : RegisterMemberInput) => Promise<Result<Member, RegisterMemberError>>

/**
 * Situation 1 : inscrire un nouvel adhérent.
 *
 * Algorithme, dans CET ordre :
 * 1. Valider `lastName` avec `parseName`      -> sinon INVALID_INPUT, field "lastName"
 * 2. Valider `firstName` avec `parseName`     -> sinon INVALID_INPUT, field "firstName"
 * 3. Valider `email` avec `parseEmail`        -> sinon INVALID_INPUT, field "email"
 *    (on s'arrête à la première erreur ; le repository n'est pas appelé)
 * 4. `memberRepository.findByEmail(email)` :
 *    si un adhérent existe -> EMAIL_ALREADY_REGISTERED (avec l'email normalisé)
 * 5. Créer le Member avec `memberIdGenerator.next()` et les valeurs validées
 * 6. `memberRepository.save(member)`
 * 7. Retourner `success(member)`
 *
 * Garanties :
 * - En cas de refus, ni `save` ni `memberIdGenerator.next` ne sont appelés.
 * - Le use case ne lève pas d'exception pour un refus métier.
 */
export type RegisterMemberFactory = (dependencies : RegisterMemberDependancies) => RegisterMemberUseCase

// Stub pour donner un point d'entré à l'IA
export const createRegisterMember: RegisterMemberFactory = (_dependencies) => {
  return async (_input) => {
    throw new Error("Not implemented")
  }
}
