import type { BookCopy } from "../domains/entities"
import { parseBookCopyId } from "../domains/entities"
import { createBorrowBook, createRegisterMember, createReturnBook } from "../domains/useCase"
import type { BorrowBookUseCase } from "../domains/useCase/borrowBook"
import type { RegisterMemberUseCase } from "../domains/useCase/registerMember"
import type { ReturnBookUseCase } from "../domains/useCase/returnBook"
import { systemClock } from "./clock/systemClock"
import { createSequentialLoanIdGenerator, createSequentialMemberIdGenerator } from "./ids/sequentialIdGenerators"
import {
    createInMemoryBookCopyRepository,
    createInMemoryLoanRepository,
    createInMemoryMemberRepository,
} from "./persistence/inMemoryRepositories"

/** Jeu de données initial : les exemplaires existent avant l'exécution (cf. BookCopyRepository). */
export const INITIAL_COPY_IDS = ["C-001", "C-002", "C-003", "C-004", "C-005"] as const;

export type LibraryUseCases = {
    readonly registerMember: RegisterMemberUseCase;
    readonly borrowBook: BorrowBookUseCase;
    readonly returnBook: ReturnBookUseCase;
};

/**
 * Racine de composition : assemble les adaptateurs d'infrastructure et injecte
 * leurs dépendances dans chaque use case. Seul endroit qui connaît les implémentations concrètes.
 */
export function createLibraryUseCases(): LibraryUseCases {
    const memberRepository = createInMemoryMemberRepository();
    const bookCopyRepository = createInMemoryBookCopyRepository(
        INITIAL_COPY_IDS.map((id): BookCopy => ({
            id: parseBookCopyId(id)!,
            status: "AVAILABLE",
        })),
    );
    const loanRepository = createInMemoryLoanRepository();
    const memberIdGenerator = createSequentialMemberIdGenerator();
    const loanIdGenerator = createSequentialLoanIdGenerator();

    return {
        registerMember: createRegisterMember({ memberRepository, memberIdGenerator }),
        borrowBook: createBorrowBook({
            memberRepository,
            bookCopyRepository,
            loanRepository,
            loanIdGenerator,
            clock: systemClock,
        }),
        returnBook: createReturnBook({ loanRepository, bookCopyRepository, clock: systemClock }),
    };
}
