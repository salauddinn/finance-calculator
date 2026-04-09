import { calculateSimpleHomeLoan } from "@/lib/calculations/home-loan-simple/home-loan-simple";

describe("calculateSimpleHomeLoan", () => {
  it("calculates EMI, total repayment, and total interest for a standard home loan", () => {
    const result = calculateSimpleHomeLoan({
      principal: 4500000,
      annualRatePct: 8.75,
      tenureMonths: 240
    });

    expect(result.monthlyEmi.value).toBeCloseTo(39766.98, 2);
    expect(result.totalRepayment.value).toBeCloseTo(9544075.66, 2);
    expect(result.totalInterest.value).toBeCloseTo(5044075.66, 2);
  });
});
