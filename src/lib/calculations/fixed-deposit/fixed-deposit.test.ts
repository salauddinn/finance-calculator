import { calculateFixedDeposit } from "@/lib/calculations/fixed-deposit/fixed-deposit";

describe("calculateFixedDeposit", () => {
  it("calculates maturity value and interest earned for standard cumulative FD", () => {
    const result = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 7.5,
      durationMonths: 24,
      compoundingFrequency: "yearly",
    });

    expect(result.maturityValue).toBeCloseTo(115562.5, 2);
    expect(result.interestEarned).toBeCloseTo(15562.5, 2);
    expect(result.totalTdsDeducted).toBe(0);
    expect(result.payoutPerPeriod).toBe(0);
  });

  it("applies a 0.5% senior citizen bump", () => {
    const standard = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 7.5,
      durationMonths: 24,
      compoundingFrequency: "yearly",
    });

    const senior = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 7.5, // The function should internally add 0.5%
      durationMonths: 24,
      compoundingFrequency: "yearly",
      advancedConfig: {
        payoutFrequency: "cumulative",
        seniorCitizen: true,
        tdsEnabled: false,
      }
    });

    expect(senior.maturityValue).toBeGreaterThan(standard.maturityValue);
  });

  it("deducts 10% TDS from interest on cumulative FDs", () => {
    const withoutTds = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 7.5,
      durationMonths: 12,
      compoundingFrequency: "yearly",
    });

    const withTds = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 7.5,
      durationMonths: 12,
      compoundingFrequency: "yearly",
      advancedConfig: {
        payoutFrequency: "cumulative",
        seniorCitizen: false,
        tdsEnabled: true,
      }
    });

    // 1 year at 7.5% = 7500 interest without TDS
    // With 10% TDS, interest is 6750
    expect(withoutTds.interestEarned).toBeCloseTo(7500, 2);
    expect(withTds.interestEarned).toBeCloseTo(6750, 2);
    expect(withTds.totalTdsDeducted).toBeCloseTo(750, 2);
    expect(withTds.maturityValue).toBeCloseTo(106750, 2);
  });

  it("calculates monthly payouts instead of compounding to maturity", () => {
    const payoutResult = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 6,
      durationMonths: 12,
      compoundingFrequency: "yearly",
      advancedConfig: {
        payoutFrequency: "monthly",
        seniorCitizen: false,
        tdsEnabled: false,
      }
    });

    // 100k @ 6% = 6000 gross interest per year
    // Monthly payout = 500
    expect(payoutResult.maturityValue).toBe(100000); // principal is preserved since interest is paid out
    expect(payoutResult.interestEarned).toBeCloseTo(6000, 2);
    expect(payoutResult.payoutPerPeriod).toBeCloseTo(500, 2);
  });
});
