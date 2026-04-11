import { calculateFixedDeposit } from "@/lib/calculations/fixed-deposit/fixed-deposit";
import { calculateAdvancedHomeLoan } from "@/lib/calculations/home-loan-advanced/home-loan-advanced";
import { calculatePersonalLoan } from "@/lib/calculations/personal-loan/personal-loan";
import { calculateSip } from "@/lib/calculations/sip/calculate-sip";
import { measureAgainstBudget } from "@/lib/performance/performance-budget";

describe("performance budgets", () => {
  it("keeps representative calculator runs under the approved budget", () => {
    const personalLoanRun = measureAgainstBudget("personal-loan", () => {
      for (let index = 0; index < 200; index += 1) {
        calculatePersonalLoan({
          principal: 2500000,
          annualRatePct: 8.5,
          tenureMonths: 240
        });
      }
    });
    expect(personalLoanRun.elapsedMs).toBeLessThan(personalLoanRun.budgetMs);

    const sipRun = measureAgainstBudget("sip", () => {
      for (let index = 0; index < 200; index += 1) {
        calculateSip({
          monthlyContribution: 10000,
          annualReturnPct: 12,
          durationMonths: 120
        });
      }
    });
    expect(sipRun.elapsedMs).toBeLessThan(sipRun.budgetMs);

    const fixedDepositRun = measureAgainstBudget("fixed-deposit", () => {
      for (let index = 0; index < 200; index += 1) {
        calculateFixedDeposit({
          depositAmount: 100000,
          annualRatePct: 7.5,
          tenureMonths: 24,
          compoundingFrequency: "quarterly"
        });
      }
    });
    expect(fixedDepositRun.elapsedMs).toBeLessThan(fixedDepositRun.budgetMs);

    const advancedHomeLoanRun = measureAgainstBudget("advanced-home-loan", () => {
      for (let index = 0; index < 100; index += 1) {
        calculateAdvancedHomeLoan({
          principal: { value: 4500000, currency: "INR" },
          annualRatePct: 8.75,
          tenureMonths: 240,
          strategy: "keep-emi-adjust-tenure",
          events: [
            {
              id: "rate-shift",
              monthIndex: 12,
              type: "rate-change",
              annualRatePct: 9.1
            },
            {
              id: "moratorium",
              monthIndex: 24,
              type: "moratorium",
              durationMonths: 3
            },
            {
              id: "prepay",
              monthIndex: 36,
              type: "prepayment",
              amount: { value: 300000, currency: "INR" }
            }
          ]
        });
      }
    });
    expect(advancedHomeLoanRun.elapsedMs).toBeLessThan(
      advancedHomeLoanRun.budgetMs
    );
  });
});
