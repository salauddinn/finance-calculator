import { calculateInflation } from "@/lib/calculations/inflation/inflation-engine";

describe("calculateInflation", () => {
  it("doubles the future cost of ₹1L at 7.2% over 10 years (rule of 72)", () => {
    const result = calculateInflation({ amount: 100_000, inflationRatePct: 7.2, years: 10 });
    expect(result.futureCost).toBeCloseTo(200_000, -3);
  });

  it("futureCost is always greater than amount for positive inflation", () => {
    const result = calculateInflation({ amount: 50_000, inflationRatePct: 5, years: 5 });
    expect(result.futureCost).toBeGreaterThan(50_000);
  });

  it("realValue is always less than amount for positive inflation", () => {
    const result = calculateInflation({ amount: 50_000, inflationRatePct: 5, years: 5 });
    expect(result.realValue).toBeLessThan(50_000);
  });

  it("purchasingPowerLost = amount - realValue", () => {
    const amount = 100_000;
    const result = calculateInflation({ amount, inflationRatePct: 6, years: 10 });
    expect(result.purchasingPowerLost).toBeCloseTo(amount - result.realValue, 5);
  });

  it("pctLost is between 0 and 100 for realistic inputs", () => {
    const result = calculateInflation({ amount: 100_000, inflationRatePct: 6, years: 20 });
    expect(result.pctLost).toBeGreaterThan(0);
    expect(result.pctLost).toBeLessThan(100);
  });

  it("higher inflation rate means higher futureCost and more purchasing power lost", () => {
    const low = calculateInflation({ amount: 100_000, inflationRatePct: 3, years: 10 });
    const high = calculateInflation({ amount: 100_000, inflationRatePct: 9, years: 10 });
    expect(high.futureCost).toBeGreaterThan(low.futureCost);
    expect(high.purchasingPowerLost).toBeGreaterThan(low.purchasingPowerLost);
  });

  it("longer period means more purchasing power erosion", () => {
    const short = calculateInflation({ amount: 100_000, inflationRatePct: 6, years: 5 });
    const long = calculateInflation({ amount: 100_000, inflationRatePct: 6, years: 20 });
    expect(long.pctLost).toBeGreaterThan(short.pctLost);
  });
});
