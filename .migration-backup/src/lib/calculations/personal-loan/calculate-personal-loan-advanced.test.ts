import { calculatePersonalLoanAdvanced } from "@/lib/calculations/personal-loan/calculate-personal-loan-advanced";

describe("calculatePersonalLoanAdvanced", () => {
  it("calculates basic schedule the same as simple loan when no advanced options are used", () => {
    const result = calculatePersonalLoanAdvanced({
      principal: { value: 500000, currency: "INR" },
      annualRatePct: 10,
      tenureMonths: 24,
      delayEmiMonths: 0,
      processingFeeAmount: { value: 0, currency: "INR" },
      prepayments: []
    });

    expect(result.monthlyEmi.value).toBeCloseTo(23072.46, 2);
    expect(result.totalRepayment.value).toBeCloseTo(553739.12, 2);
    expect(result.totalInterest.value).toBeCloseTo(53739.12, 2);
    expect(result.finalTenureMonths).toBe(24);
    expect(result.effectiveAprPct).toBeCloseTo(10, 2);
  });

  it("handles processing fees which impacts effective APR", () => {
    const result = calculatePersonalLoanAdvanced({
      principal: { value: 500000, currency: "INR" },
      annualRatePct: 10,
      tenureMonths: 24,
      delayEmiMonths: 0,
      processingFeeAmount: { value: 10000, currency: "INR" },
      prepayments: []
    });

    expect(result.monthlyEmi.value).toBeCloseTo(23072.46, 2);
    // Effective APR should be > 10% because of processing fee
    expect(result.effectiveAprPct).toBeGreaterThan(10);
  });

  it("handles delay EMI months by adding accrued interest to principal", () => {
    const result = calculatePersonalLoanAdvanced({
      principal: { value: 500000, currency: "INR" },
      annualRatePct: 10,
      tenureMonths: 24, // 2 months delay + 24 months remaining
      delayEmiMonths: 2,
      processingFeeAmount: { value: 0, currency: "INR" },
      prepayments: []
    });

    // Interest for 2 months on 500k at 10% is about ~4,166+4,201 = 8,368. Principal becomes ~508,368
    // Then 24 months EMI on ~508,368
    expect(result.monthlyEmi.value).toBeGreaterThan(23072.46);
    expect(result.finalTenureMonths).toBe(26); // 2 delay + 24 emi months
  });

  it("handles prepayments reducing the tenure", () => {
    const result = calculatePersonalLoanAdvanced({
      principal: { value: 500000, currency: "INR" },
      annualRatePct: 10,
      tenureMonths: 24,
      delayEmiMonths: 0,
      processingFeeAmount: { value: 0, currency: "INR" },
      prepayments: [
        { monthIndex: 6, amount: { value: 50000, currency: "INR" } }
      ]
    });

    expect(result.totalPrepaymentAmount.value).toBe(50000);
    expect(result.finalTenureMonths).toBeLessThan(24); // Early payoff
    expect(result.schedule[5].eventApplied).toBe("prepayment");
  });
});
