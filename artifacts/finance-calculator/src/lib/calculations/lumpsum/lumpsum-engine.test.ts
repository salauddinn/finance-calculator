import { calculateLumpsum } from "@/lib/calculations/lumpsum/lumpsum-engine";

describe("calculateLumpsum", () => {
  it("doubles principal at 100% return over 1 year", () => {
    const result = calculateLumpsum({ principal: 100_000, annualReturnPct: 100, years: 1 });
    expect(result.maturity).toBeCloseTo(200_000, 0);
    expect(result.gain).toBeCloseTo(100_000, 0);
    expect(result.multiple).toBeCloseTo(2, 5);
  });

  it("grows principal at 12% return over 6 years correctly", () => {
    const result = calculateLumpsum({ principal: 500_000, annualReturnPct: 12, years: 6 });
    // 500k * 1.12^6 = 500k * 1.97382... ≈ 986,911
    expect(result.maturity).toBeCloseTo(986_911, 0);
    expect(result.gain).toBeCloseTo(486_911, 0);
    expect(result.multiple).toBeGreaterThan(1.9);
  });

  it("maturity equals principal + gain", () => {
    const result = calculateLumpsum({ principal: 200_000, annualReturnPct: 8, years: 10 });
    expect(result.maturity).toBeCloseTo(result.principal + result.gain, 5);
  });

  it("longer tenure produces higher maturity value", () => {
    const short = calculateLumpsum({ principal: 100_000, annualReturnPct: 12, years: 5 });
    const long = calculateLumpsum({ principal: 100_000, annualReturnPct: 12, years: 10 });
    expect(long.maturity).toBeGreaterThan(short.maturity);
  });

  it("higher return rate produces higher maturity value for same principal and tenure", () => {
    const low = calculateLumpsum({ principal: 100_000, annualReturnPct: 7, years: 10 });
    const high = calculateLumpsum({ principal: 100_000, annualReturnPct: 14, years: 10 });
    expect(high.maturity).toBeGreaterThan(low.maturity);
  });

  it("multiple is maturity / principal", () => {
    const result = calculateLumpsum({ principal: 300_000, annualReturnPct: 10, years: 7 });
    expect(result.multiple).toBeCloseTo(result.maturity / result.principal, 5);
  });
});
