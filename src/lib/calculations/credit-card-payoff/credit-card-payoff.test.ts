import { calculateCreditCardPayoff } from "@/lib/calculations/credit-card-payoff/credit-card-payoff";

describe("calculateCreditCardPayoff", () => {
  it("calculates months and total interest for a standard payoff scenario", () => {
    const result = calculateCreditCardPayoff({
      balance: 50_000,
      annualRatePct: 36,
      monthlyPayment: 3_000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.monthsToRepay).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPaid).toBeCloseTo(result.totalInterest + 50_000, -2);
  });

  it("returns zero_balance when balance is zero or negative", () => {
    const r1 = calculateCreditCardPayoff({ balance: 0, annualRatePct: 36, monthlyPayment: 1_000 });
    const r2 = calculateCreditCardPayoff({ balance: -500, annualRatePct: 36, monthlyPayment: 1_000 });
    expect(r1.ok).toBe(false);
    expect(r2.ok).toBe(false);
    if (!r1.ok) expect(r1.reason).toBe("zero_balance");
    if (!r2.ok) expect(r2.reason).toBe("zero_balance");
  });

  it("returns payment_too_low when monthly payment does not cover first-month interest", () => {
    const result = calculateCreditCardPayoff({
      balance: 100_000,
      annualRatePct: 36,
      monthlyPayment: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("payment_too_low");
  });

  it("higher monthly payment leads to fewer months and less total interest", () => {
    const low = calculateCreditCardPayoff({ balance: 50_000, annualRatePct: 24, monthlyPayment: 2_000 });
    const high = calculateCreditCardPayoff({ balance: 50_000, annualRatePct: 24, monthlyPayment: 5_000 });
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (!low.ok || !high.ok) return;
    expect(high.monthsToRepay).toBeLessThan(low.monthsToRepay);
    expect(high.totalInterest).toBeLessThan(low.totalInterest);
  });

  it("higher interest rate leads to more months and more total interest for same payment", () => {
    const low = calculateCreditCardPayoff({ balance: 50_000, annualRatePct: 18, monthlyPayment: 3_000 });
    const high = calculateCreditCardPayoff({ balance: 50_000, annualRatePct: 36, monthlyPayment: 3_000 });
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (!low.ok || !high.ok) return;
    expect(high.monthsToRepay).toBeGreaterThan(low.monthsToRepay);
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest);
  });

  it("totalPaid equals balance + totalInterest", () => {
    const result = calculateCreditCardPayoff({
      balance: 30_000,
      annualRatePct: 24,
      monthlyPayment: 2_500,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.totalPaid).toBeCloseTo(30_000 + result.totalInterest, 0);
  });

  it("payment just above the monthly interest threshold leads to very many months", () => {
    // balance=50k, rate=36%, monthlyInterest=1500, payment=1501 → convergence takes 200+ months
    const result = calculateCreditCardPayoff({
      balance: 50_000,
      annualRatePct: 36,
      monthlyPayment: 1_501,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.monthsToRepay).toBeGreaterThan(100);
  });
});
