import { LoanId } from "../entities";

export type LoanIdGenerator = {
  /** @returns un nouvel identifiant, jamais renvoyé auparavant. */
  next(): LoanId
}