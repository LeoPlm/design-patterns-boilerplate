import type { Brand } from "../shared/brand"

/** Numéro d'adhérent. Unique, attribué à l'inscription, jamais modifié. */
export type MemberId = Brand<string, "MemberId">

/** Email NORMALISÉ (trim + minuscules). Ne s'obtient que via `parseEmail`. */
export type Email = Brand<string, "Email">

export type Member = {
  readonly id : MemberId,
  readonly email : Email,
  readonly lastName : string,
  readonly firstName : string
}

/**
 * Valide un nom ou un prénom.
 * @returns le texte sans espaces autour, ou `undefined` s'il est vide.
 */
export function parseName(str : string): string | undefined {
  const trimmed = str.trim()
  return trimmed === "" ? undefined : trimmed
}

/**
 * Valide un numéro d'adhérent reçu de l'extérieur (ex. une requête HTTP).
 * Ne vérifie que la forme : l'existence se vérifie avec `memberRepository.findById`.
 * @returns le numéro sans espaces autour, ou `undefined` s'il est vide.
 */
export function parseMemberId(str : string): MemberId | undefined {
  const trimmed = str.trim()
  return trimmed === "" ? undefined : trimmed as MemberId
}

const EMAIL_PATTERN =/^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Valide et normalise une adresse email (trim, puis minuscules).
 * Deux emails qui ne diffèrent que par la casse sont donc le même email.
 * @returns l'email normalisé, ou `undefined` si le format est invalide.
 */
export function parseEmail(str : string): Email | undefined {
  const normalise = str.trim().toLocaleLowerCase()
  return EMAIL_PATTERN.test(normalise) ? normalise as Email : undefined
}