import { calculateCtcSalary } from "@/lib/calculations/ctc-salary/ctc-salary-engine";

const BASE = {
  annualCtc: 1_200_000,
  basicPct: 40,
  isMetroCity: true,
  profTaxAnnual: 2_400,
};

describe("calculateCtcSalary", () => {
  it("grossSalary = CTC - employer PF", () => {
    const result = calculateCtcSalary(BASE);
    const basic = 1_200_000 * 0.4;
    const pfBase = Math.min(basic, 180_000);
    const employerPf = pfBase * 0.12;
    expect(result.grossSalary).toBeCloseTo(1_200_000 - employerPf, 1);
  });

  it("monthlyTakeHome is less than monthlyGross due to deductions", () => {
    const result = calculateCtcSalary(BASE);
    expect(result.monthlyTakeHome).toBeLessThan(result.monthlyGross);
  });

  it("monthly values are annual / 12", () => {
    const result = calculateCtcSalary(BASE);
    expect(result.monthlyGross).toBeCloseTo(result.grossSalary / 12, 1);
    expect(result.monthlyTakeHome).toBeCloseTo(result.annualTakeHome / 12, 1);
  });

  it("HRA is 50% of basic for metro, 40% for non-metro", () => {
    const metro = calculateCtcSalary({ ...BASE, isMetroCity: true });
    const nonMetro = calculateCtcSalary({ ...BASE, isMetroCity: false });
    const basicMonthly = (1_200_000 * 0.4) / 12;
    expect(metro.hra).toBeCloseTo(basicMonthly * 0.5, 1);
    expect(nonMetro.hra).toBeCloseTo(basicMonthly * 0.4, 1);
  });

  it("PF ceiling: PF based on ₹15,000/month basic when basic exceeds ceiling", () => {
    const highCtc = calculateCtcSalary({ ...BASE, annualCtc: 5_000_000, basicPct: 50 });
    // basic = 25L/year — exceeds 1.8L PF ceiling
    // Employee PF = 1.8L * 12% = 21,600 / 12 = 1800/month
    expect(highCtc.monthlyPf).toBeCloseTo(1_800, 0);
  });

  it("professional tax deducted monthly", () => {
    const result = calculateCtcSalary({ ...BASE, profTaxAnnual: 2_400 });
    expect(result.monthlyProfTax).toBeCloseTo(200, 1);
  });

  it("professional tax of 0 does not affect take-home calculation", () => {
    const withTax = calculateCtcSalary({ ...BASE, profTaxAnnual: 2_400 });
    const noTax = calculateCtcSalary({ ...BASE, profTaxAnnual: 0 });
    expect(noTax.monthlyTakeHome).toBeCloseTo(withTax.monthlyTakeHome + 200, 0);
  });

  it("higher CTC leads to higher take-home", () => {
    const low = calculateCtcSalary({ ...BASE, annualCtc: 800_000 });
    const high = calculateCtcSalary({ ...BASE, annualCtc: 2_000_000 });
    expect(high.monthlyTakeHome).toBeGreaterThan(low.monthlyTakeHome);
  });

  it("effectiveTaxRate is income tax / gross salary × 100", () => {
    const result = calculateCtcSalary(BASE);
    expect(result.effectiveTaxRate).toBeCloseTo(result.monthlyTds * 12 / result.grossSalary * 100, 1);
  });
});
