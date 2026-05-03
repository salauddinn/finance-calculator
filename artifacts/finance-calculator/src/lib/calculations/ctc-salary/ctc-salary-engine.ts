import { slabTax, NEW_REGIME_SLABS } from "@/lib/calculations/income-tax/income-tax-engine";

const PF_BASIC_CEILING_ANNUAL = 180_000; // ₹15,000/month

function newRegimeTaxForCtc(grossSalary: number): number {
  const taxable = Math.max(0, grossSalary - 75_000);
  let base = slabTax(taxable, NEW_REGIME_SLABS);
  if (taxable <= 1_200_000) base = Math.max(0, base - 60_000);
  return Math.round(base * 1.04);
}

export interface CtcSalaryInput {
  annualCtc: number;
  basicPct: number;
  isMetroCity: boolean;
  profTaxAnnual: number;
}

export interface CtcSalaryResult {
  monthlyTakeHome: number;
  annualTakeHome: number;
  grossSalary: number;
  monthlyGross: number;
  basic: number;
  hra: number;
  otherAllowances: number;
  monthlyPf: number;
  monthlyProfTax: number;
  monthlyTds: number;
  totalMonthlyDeductions: number;
  effectiveTaxRate: number;
}

export function calculateCtcSalary({
  annualCtc,
  basicPct,
  isMetroCity,
  profTaxAnnual,
}: CtcSalaryInput): CtcSalaryResult {
  const basic = annualCtc * (basicPct / 100);
  const hra = basic * (isMetroCity ? 0.5 : 0.4);
  const pfBase = Math.min(basic, PF_BASIC_CEILING_ANNUAL);
  const employerPf = pfBase * 0.12;
  const employeePf = pfBase * 0.12;
  const grossSalary = annualCtc - employerPf;
  const otherAllowances = grossSalary - basic - hra;
  const incomeTax = newRegimeTaxForCtc(grossSalary);
  const annualTakeHome = grossSalary - employeePf - profTaxAnnual - incomeTax;
  const monthlyTakeHome = annualTakeHome / 12;

  return {
    monthlyTakeHome,
    annualTakeHome,
    grossSalary,
    monthlyGross: grossSalary / 12,
    basic: basic / 12,
    hra: hra / 12,
    otherAllowances: otherAllowances / 12,
    monthlyPf: employeePf / 12,
    monthlyProfTax: profTaxAnnual / 12,
    monthlyTds: incomeTax / 12,
    totalMonthlyDeductions: (employeePf + profTaxAnnual + incomeTax) / 12,
    effectiveTaxRate: incomeTax / grossSalary * 100,
  };
}
