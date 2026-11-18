import type { LoanId, MemberId } from "../../domains/entities"
import type { LoanIdGenerator } from "../../domains/ports/loanIdGenerator"
import type { MemberIdGenerator } from "../../domains/ports/memberIdGenerator"

/**
 * Génère des numéros d'adhérent uniques : "M-1", "M-2", ...
 * `startAt` permet de reprendre après les données existantes.
 */
export function createSequentialMemberIdGenerator(startAt = 1): MemberIdGenerator {
    let counter = startAt;
    return {
        next: () => `M-${counter++}` as MemberId,
    };
}

/** Génère des identifiants d'emprunt uniques : "L-1", "L-2", ... */
export function createSequentialLoanIdGenerator(startAt = 1): LoanIdGenerator {
    let counter = startAt;
    return {
        next: () => `L-${counter++}` as LoanId,
    };
}
