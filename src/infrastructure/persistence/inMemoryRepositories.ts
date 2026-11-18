import type { BookCopy, BookCopyId, Email, Loan, Member, MemberId, ActiveLoan } from "../../domains/entities"
import type { BookCopyRepository, LoanRepository, MemberRepository } from "../../domains/repositories"

/** Adaptateur mémoire de `MemberRepository`. Les données disparaissent à l'arrêt du processus. */
export function createInMemoryMemberRepository(initial: readonly Member[] = []): MemberRepository {
    const byId = new Map<MemberId, Member>(initial.map((member) => [member.id, member]));

    return {
        async findByEmail(email: Email) {
            for (const member of byId.values()) {
                if (member.email === email) return member;
            }
            return undefined;
        },
        async findById(id: MemberId) {
            return byId.get(id);
        },
        async save(member: Member) {
            byId.set(member.id, member);
        },
    };
}

/** Adaptateur mémoire de `BookCopyRepository`. */
export function createInMemoryBookCopyRepository(initial: readonly BookCopy[] = []): BookCopyRepository {
    const byId = new Map<BookCopyId, BookCopy>(initial.map((copy) => [copy.id, copy]));

    return {
        async findById(id: BookCopyId) {
            return byId.get(id);
        },
        async save(copy: BookCopy) {
            byId.set(copy.id, copy);
        },
    };
}

/** Adaptateur mémoire de `LoanRepository`. */
export function createInMemoryLoanRepository(initial: readonly Loan[] = []): LoanRepository {
    const byId = new Map<string, Loan>(initial.map((loan) => [loan.id, loan]));

    const activeLoans = (): ActiveLoan[] =>
        [...byId.values()].filter((loan): loan is ActiveLoan => loan.returnedAt === undefined);

    return {
        async countActiveByMemberId(memberId: MemberId) {
            return activeLoans().filter((loan) => loan.memberId === memberId).length;
        },
        async findActiveByCopyId(copyId: BookCopyId) {
            return activeLoans().find((loan) => loan.copyId === copyId);
        },
        async save(loan: Loan) {
            byId.set(loan.id, loan);
        },
    };
}
