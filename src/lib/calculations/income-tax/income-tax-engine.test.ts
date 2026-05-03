import {
  slabTax,
  calcNewRegime,
  calcOldRegime,
  getOldRegimeSlabs,
  addSurchargeAndCess,
  NEW_REGIME_SLABS,
} from "@/lib/calculations/income-tax/income-tax-engine";

const NO_DEDUCTIONS = { c80: 0, d80: 0, hra: 0, homeLoan: 0, nps: 0, tttb: 0, edu80E: 0, donations80G: 0 };

describe("slabTax", () => {
  it("returns 0 for income within the zero-rate slab", () => {
    expect(slabTax(200_000, NEW_REGIME_SLABS)).toBe(0);
  });

  it("correctly taxes the 5% slab (₹4L–₹8L)", () => {
    // Taxable of ₹5L: 0 + (5L-4L)*5% = 5000
    expect(slabTax(500_000, NEW_REGIME_SLABS)).toBe(5_000);
  });

  it("correctly taxes across multiple slabs", () => {
    // ₹10L taxable: 0 + 4L*5% + 2L*10% = 20k+20k = 40k
    expect(slabTax(1_000_000, NEW_REGIME_SLABS)).toBe(40_000);
  });
});

describe("calcNewRegime", () => {
  it("returns zero tax for gross income up to ₹12.75L (salaried 87A rebate)", () => {
    const result = calcNewRegime(1_275_000);
    expect(result.tax).toBe(0);
  });

  it("returns zero tax for gross ₹12L (taxable = ₹11.25L, slab tax < ₹60k)", () => {
    const result = calcNewRegime(1_200_000);
    // taxable = 12L - 75k = 11.25L; slab tax = 4L*5% + 3.25L*10% = 20k+32.5k=52.5k < 60k → rebate → 0
    expect(result.tax).toBe(0);
  });

  it("applies 4% cess on tax above the threshold", () => {
    const result = calcNewRegime(2_000_000);
    expect(result.tax).toBeGreaterThan(0);
    // No surcharge at 20L, so tax = base * 1.04
    const taxable = 2_000_000 - 75_000;
    const base = slabTax(taxable, NEW_REGIME_SLABS);
    expect(result.tax).toBe(Math.round(base * 1.04));
  });

  it("stdDed is ₹75,000", () => {
    const result = calcNewRegime(1_500_000);
    expect(result.stdDed).toBe(75_000);
  });

  it("taxable = gross - stdDed", () => {
    const result = calcNewRegime(1_500_000);
    expect(result.taxable).toBe(1_500_000 - 75_000);
  });
});

describe("calcOldRegime", () => {
  it("applies ₹2.5L basic exemption for below-60 taxpayers", () => {
    const result = calcOldRegime(300_000, "below60", NO_DEDUCTIONS);
    // gross=3L, std ded=50k, taxable=2.5L → zero-rate slab → 0 tax
    expect(result.tax).toBe(0);
  });

  it("applies ₹3L basic exemption for senior citizens (60-79)", () => {
    const result = calcOldRegime(350_000, "senior60", NO_DEDUCTIONS);
    // taxable = 3.5L - 50k (std) = 3L → all within ₹3L zero slab → 0
    expect(result.tax).toBe(0);
  });

  it("applies ₹5L basic exemption for very senior citizens (80+)", () => {
    const result = calcOldRegime(550_000, "senior80", NO_DEDUCTIONS);
    // taxable = 5.5L - 50k = 5L → all within ₹5L zero slab → 0
    expect(result.tax).toBe(0);
  });

  it("grants 87A rebate when old-regime taxable ≤ ₹5L", () => {
    // Gross = 5.5L, below60, taxable = 5.5L - 50k = 5L → slab tax = 2.5L*5% = 12,500 → rebate = 12,500 → 0
    const result = calcOldRegime(550_000, "below60", NO_DEDUCTIONS);
    expect(result.tax).toBe(0);
  });

  it("caps 80C deduction at ₹1.5L", () => {
    const result = calcOldRegime(1_000_000, "below60", { ...NO_DEDUCTIONS, c80: 200_000 });
    expect(result.breakdown.c80Allowed).toBe(150_000);
  });

  it("caps 80D deduction at ₹1L", () => {
    const result = calcOldRegime(1_000_000, "below60", { ...NO_DEDUCTIONS, d80: 150_000 });
    expect(result.breakdown.d80Allowed).toBe(100_000);
  });

  it("80G donation deduction is 50% of donation, capped at ₹1L", () => {
    const result = calcOldRegime(2_000_000, "below60", { ...NO_DEDUCTIONS, donations80G: 300_000 });
    // 50% of 3L = 1.5L, capped at 1L
    expect(result.breakdown.g80Allowed).toBe(100_000);
  });

  it("totalDed includes all applicable deductions", () => {
    const ded = { c80: 150_000, d80: 25_000, hra: 100_000, homeLoan: 150_000, nps: 50_000, tttb: 0, edu80E: 0, donations80G: 0 };
    const result = calcOldRegime(2_000_000, "below60", ded);
    const expected = 50_000 + 150_000 + 25_000 + 100_000 + 150_000 + 50_000;
    expect(result.totalDed).toBe(expected);
  });

  it("old regime is better than new for high-deduction scenarios", () => {
    const gross = 1_500_000;
    const newResult = calcNewRegime(gross);
    const ded = { c80: 150_000, d80: 50_000, hra: 200_000, homeLoan: 200_000, nps: 50_000, tttb: 0, edu80E: 0, donations80G: 0 };
    const oldResult = calcOldRegime(gross, "below60", ded);
    expect(oldResult.tax).toBeLessThan(newResult.tax);
  });
});

describe("addSurchargeAndCess", () => {
  it("adds 4% cess only for income ≤ ₹50L", () => {
    const tax = addSurchargeAndCess(100_000, 3_000_000);
    expect(tax).toBe(Math.round(100_000 * 1.04));
  });

  it("adds 10% surcharge for income > ₹50L", () => {
    const tax = addSurchargeAndCess(100_000, 6_000_000);
    const surcharge = 10_000;
    const cess = (100_000 + surcharge) * 0.04;
    expect(tax).toBe(Math.round(100_000 + surcharge + cess));
  });
});
