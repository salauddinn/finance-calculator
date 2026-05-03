import { calculateGoalSip } from "@/lib/calculations/goal-sip/goal-sip-engine";

describe("calculateGoalSip", () => {
  it("required SIP × months ≈ total invested", () => {
    const result = calculateGoalSip({ targetAmount: 10_000_000, annualReturnPct: 12, years: 10 });
    expect(result.totalInvested).toBeCloseTo(result.monthly * 120, 0);
  });

  it("totalInvested + marketReturns = targetAmount", () => {
    const result = calculateGoalSip({ targetAmount: 5_000_000, annualReturnPct: 10, years: 8 });
    expect(result.totalInvested + result.marketReturns).toBeCloseTo(result.targetAmount, 1);
  });

  it("longer time horizon reduces the required monthly SIP", () => {
    const short = calculateGoalSip({ targetAmount: 10_000_000, annualReturnPct: 12, years: 5 });
    const long = calculateGoalSip({ targetAmount: 10_000_000, annualReturnPct: 12, years: 15 });
    expect(long.monthly).toBeLessThan(short.monthly);
  });

  it("higher return rate reduces the required monthly SIP for the same goal", () => {
    const low = calculateGoalSip({ targetAmount: 10_000_000, annualReturnPct: 8, years: 10 });
    const high = calculateGoalSip({ targetAmount: 10_000_000, annualReturnPct: 14, years: 10 });
    expect(high.monthly).toBeLessThan(low.monthly);
  });

  it("market returns are positive — compounding adds value over invested amount", () => {
    const result = calculateGoalSip({ targetAmount: 2_000_000, annualReturnPct: 12, years: 5 });
    expect(result.marketReturns).toBeGreaterThan(0);
    expect(result.totalInvested).toBeLessThan(result.targetAmount);
  });

  it("targetAmount is preserved in the result", () => {
    const target = 7_500_000;
    const result = calculateGoalSip({ targetAmount: target, annualReturnPct: 10, years: 12 });
    expect(result.targetAmount).toBe(target);
  });
});
