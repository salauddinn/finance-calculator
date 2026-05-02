export interface CreditCardPayoffInput {
  balance: number;
  annualRatePct: number;
  monthlyPayment: number;
}

export type CreditCardPayoffResult =
  | { ok: true; monthsToRepay: number; totalInterest: number; totalPaid: number }
  | { ok: false; reason: "payment_too_low" | "zero_balance" };

const MAX_MONTHS = 600;

export function calculateCreditCardPayoff(input: CreditCardPayoffInput): CreditCardPayoffResult {
  const { balance, annualRatePct, monthlyPayment } = input;

  if (balance <= 0) return { ok: false, reason: "zero_balance" };

  const monthlyRate = annualRatePct / 12 / 100;
  const firstMonthInterest = balance * monthlyRate;

  if (monthlyPayment <= firstMonthInterest) {
    return { ok: false, reason: "payment_too_low" };
  }

  let remaining = balance;
  let totalInterest = 0;
  let months = 0;

  while (remaining > 0 && months < MAX_MONTHS) {
    const interest = remaining * monthlyRate;
    totalInterest += interest;
    remaining = remaining + interest - monthlyPayment;
    months++;
    if (remaining < 0) remaining = 0;
  }

  return {
    ok: true,
    monthsToRepay: months,
    totalInterest: Math.round(totalInterest),
    totalPaid: Math.round(balance + totalInterest)
  };
}
