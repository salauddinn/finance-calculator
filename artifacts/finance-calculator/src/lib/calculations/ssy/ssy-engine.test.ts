import { calculateSsy } from "@/lib/calculations/ssy/ssy-engine";

describe("calculateSsy", () => {
  it("caps annual contribution at ₹1.5L regardless of input", () => {
    const capped = calculateSsy({ annualContribution: 200_000, girlAge: 0, interestRatePct: 8.2 });
    const atMax = calculateSsy({ annualContribution: 150_000, girlAge: 0, interestRatePct: 8.2 });
    expect(capped.contrib).toBe(150_000);
    expect(capped.maturityValue).toBe(atMax.maturityValue);
  });

  it("for girl aged 0 — 15 contribution years and 6 dormant years", () => {
    const result = calculateSsy({ annualContribution: 100_000, girlAge: 0, interestRatePct: 8.2 });
    expect(result.contributionYears).toBe(15);
    expect(result.dormantYears).toBe(6);
    expect(result.maturityYears).toBe(21);
  });

  it("for girl aged 9 — contribution years capped at 12 (not 15), zero dormant", () => {
    const result = calculateSsy({ annualContribution: 100_000, girlAge: 9, interestRatePct: 8.2 });
    expect(result.maturityYears).toBe(12);
    expect(result.contributionYears).toBe(12);
    expect(result.dormantYears).toBe(0);
  });

  it("totalInvested = contrib × contributionYears", () => {
    const result = calculateSsy({ annualContribution: 100_000, girlAge: 5, interestRatePct: 8.2 });
    expect(result.totalInvested).toBe(result.contrib * result.contributionYears);
  });

  it("maturityValue > totalInvested for any positive interest rate", () => {
    const result = calculateSsy({ annualContribution: 100_000, girlAge: 0, interestRatePct: 8.2 });
    expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
  });

  it("interest = maturityValue - totalInvested", () => {
    const result = calculateSsy({ annualContribution: 150_000, girlAge: 3, interestRatePct: 8.2 });
    expect(result.interest).toBe(result.maturityValue - result.totalInvested);
  });

  it("older girl (fewer years) produces a smaller maturity value at same contribution", () => {
    const young = calculateSsy({ annualContribution: 100_000, girlAge: 0, interestRatePct: 8.2 });
    const older = calculateSsy({ annualContribution: 100_000, girlAge: 9, interestRatePct: 8.2 });
    expect(young.maturityValue).toBeGreaterThan(older.maturityValue);
  });

  it("higher interest rate produces a higher maturity value", () => {
    const low = calculateSsy({ annualContribution: 100_000, girlAge: 0, interestRatePct: 7 });
    const high = calculateSsy({ annualContribution: 100_000, girlAge: 0, interestRatePct: 9 });
    expect(high.maturityValue).toBeGreaterThan(low.maturityValue);
  });
});
