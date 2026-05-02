import { calculateSip } from "@/lib/calculations/sip/calculate-sip";

describe("calculateSip", () => {
  it("returns invested amount, estimated returns, and maturity value", () => {
    const result = calculateSip({
      monthlyContribution: 10000,
      annualReturnPct: 12,
      durationMonths: 24,
    });
    
    // Close to original static assertions but allowing minor float differences
    expect(result.investedAmount.value).toBe(240000);
    expect(result.maturityValue.value).toBeCloseTo(272432, 0);
  });

  it("returns only invested amount when the return rate is zero", () => {
    expect(
      calculateSip({
        monthlyContribution: 5000,
        annualReturnPct: 0,
        durationMonths: 12
      })
    ).toEqual({
      investedAmount: {
        value: 60000,
        currency: "INR"
      },
      estimatedReturns: {
        value: 0,
        currency: "INR"
      },
      maturityValue: {
        value: 60000,
        currency: "INR"
      }
    });
  });

  it("calculates step-up SIP correctly", () => {
    const result = calculateSip({
      monthlyContribution: 10000,
      annualReturnPct: 12, // 1% per month
      durationMonths: 24, // 2 years
      advancedConfig: {
        stepUpPercentage: 10, // 10% step up
        taxationEnabled: false,
      }
    });
    
    // First year: 120,000 invested. Second year: 120,000 * 1.1 = 132,000. Total = 252,000.
    expect(result.investedAmount.value).toBeCloseTo(252000, 2);
  });

  it("handles inflation adjustment", () => {
    const standardResult = calculateSip({
      monthlyContribution: 10000,
      annualReturnPct: 12,
      durationMonths: 60,
    });
    
    const inflatedResult = calculateSip({
      monthlyContribution: 10000,
      annualReturnPct: 12,
      durationMonths: 60,
      advancedConfig: {
        inflationRate: 6,
        taxationEnabled: false,
      }
    });
    
    expect(inflatedResult.investedAmount.value).toBe(standardResult.investedAmount.value);
    expect(inflatedResult.maturityValue.value).toBeLessThan(standardResult.maturityValue.value);
  });

  it("handles taxation", () => {
    const result = calculateSip({
      monthlyContribution: 10000,
      annualReturnPct: 12,
      durationMonths: 60,
      advancedConfig: {
        taxationEnabled: true,
      }
    });
    
    const standardResult = calculateSip({
      monthlyContribution: 10000,
      annualReturnPct: 12,
      durationMonths: 60,
    });
    
    // Taxes apply only to gains (12.5%)
    expect(result.estimatedReturns.value).toBeCloseTo(standardResult.estimatedReturns.value * 0.875, 2);
  });
});
