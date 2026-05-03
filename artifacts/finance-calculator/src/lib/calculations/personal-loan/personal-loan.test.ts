import { calculatePersonalLoan } from "@/lib/calculations/personal-loan/personal-loan";

describe("calculatePersonalLoan", () => {
  it("calculates EMI, total repayment, and total interest for a standard loan", () => {
    const result = calculatePersonalLoan({
      principal: 500000,
      annualRatePct: 10,
      tenureMonths: 24
    });

    expect(result.monthlyEmi.value).toBeCloseTo(23072.46, 2);
    expect(result.totalRepayment.value).toBeCloseTo(553739.12, 2);
    expect(result.totalInterest.value).toBeCloseTo(53739.12, 2);
  });
});
