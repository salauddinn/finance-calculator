import { calculateGratuity, GRATUITY_TAX_FREE_LIMIT } from "@/lib/calculations/gratuity/gratuity-engine";

describe("calculateGratuity", () => {
  it("computes gratuity using (salary × 15 × years) / 26 formula", () => {
    const result = calculateGratuity({ lastSalary: 50_000, yearsOfService: 10 });
    const expected = (50_000 * 15 * 10) / 26;
    expect(result.gratuity).toBeCloseTo(expected, 5);
  });

  it("marks employee as eligible when years >= 5", () => {
    const result = calculateGratuity({ lastSalary: 40_000, yearsOfService: 5 });
    expect(result.eligible).toBe(true);
  });

  it("marks employee as not eligible when years < 5", () => {
    const result = calculateGratuity({ lastSalary: 40_000, yearsOfService: 4 });
    expect(result.eligible).toBe(false);
  });

  it("taxable portion is zero when gratuity is within ₹20L tax-free limit", () => {
    const result = calculateGratuity({ lastSalary: 50_000, yearsOfService: 10 });
    // 50k*15*10/26 ≈ 2.88L — well below ₹20L
    expect(result.taxable).toBe(0);
    expect(result.taxFree).toBeCloseTo(result.gratuity, 5);
  });

  it("taxable portion > 0 when gratuity exceeds ₹20L", () => {
    // To exceed ₹20L: salary * 15 * years / 26 > 2_000_000
    // salary = 500_000, years = 30: 500k*15*30/26 ≈ 86.5L >> 20L
    const result = calculateGratuity({ lastSalary: 500_000, yearsOfService: 30 });
    expect(result.gratuity).toBeGreaterThan(GRATUITY_TAX_FREE_LIMIT);
    expect(result.taxFree).toBe(GRATUITY_TAX_FREE_LIMIT);
    expect(result.taxable).toBeCloseTo(result.gratuity - GRATUITY_TAX_FREE_LIMIT, 5);
  });

  it("taxFree + taxable = gratuity", () => {
    const result = calculateGratuity({ lastSalary: 80_000, yearsOfService: 20 });
    expect(result.taxFree + result.taxable).toBeCloseTo(result.gratuity, 5);
  });

  it("gratuity scales linearly with years of service", () => {
    const r10 = calculateGratuity({ lastSalary: 60_000, yearsOfService: 10 });
    const r20 = calculateGratuity({ lastSalary: 60_000, yearsOfService: 20 });
    expect(r20.gratuity).toBeCloseTo(r10.gratuity * 2, 5);
  });
});
