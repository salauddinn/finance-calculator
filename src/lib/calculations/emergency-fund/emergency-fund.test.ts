import { calculateEmergencyFund } from "@/lib/calculations/emergency-fund/emergency-fund";

describe("calculateEmergencyFund", () => {
  it("calculates required fund as monthly expenses × target months", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50_000,
      targetMonths: 6,
      currentSavings: 0,
      monthlyContribution: 10_000,
    });
    expect(result.requiredFund).toBe(300_000);
  });

  it("reports shortfall and monthsToTarget when savings < required", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50_000,
      targetMonths: 6,
      currentSavings: 100_000,
      monthlyContribution: 10_000,
    });
    expect(result.hasSurplus).toBe(false);
    expect(result.shortfall).toBe(200_000);
    expect(result.surplus).toBe(0);
    expect(result.monthsToTarget).toBe(20);
  });

  it("reports surplus and hasSurplus=true when savings exceed required", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 30_000,
      targetMonths: 6,
      currentSavings: 250_000,
      monthlyContribution: 5_000,
    });
    expect(result.hasSurplus).toBe(true);
    expect(result.surplus).toBe(70_000);
    expect(result.shortfall).toBe(0);
    expect(result.monthsToTarget).toBeNull();
  });

  it("monthsToTarget is null when already at target (no shortfall)", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 40_000,
      targetMonths: 6,
      currentSavings: 240_000,
      monthlyContribution: 10_000,
    });
    expect(result.hasSurplus).toBe(true);
    expect(result.monthsToTarget).toBeNull();
  });

  it("monthsToTarget is null when shortfall exists but contribution is zero", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50_000,
      targetMonths: 6,
      currentSavings: 0,
      monthlyContribution: 0,
    });
    expect(result.hasSurplus).toBe(false);
    expect(result.monthsToTarget).toBeNull();
  });

  it("monthsToTarget rounds up to next whole month", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50_000,
      targetMonths: 6,
      currentSavings: 0,
      monthlyContribution: 7_000,
    });
    // shortfall = 300k, 300k / 7k = 42.857 → ceil = 43
    expect(result.monthsToTarget).toBe(43);
  });
});
