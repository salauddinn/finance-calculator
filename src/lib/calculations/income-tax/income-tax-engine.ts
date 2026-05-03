type Slab = { from: number; to: number; rate: number };
export type AgeGroup = "below60" | "senior60" | "senior80";

export const NEW_REGIME_SLABS: Slab[] = [
  { from: 0,         to:   400_000, rate: 0  },
  { from:   400_000, to:   800_000, rate: 5  },
  { from:   800_000, to: 1_200_000, rate: 10 },
  { from: 1_200_000, to: 1_600_000, rate: 15 },
  { from: 1_600_000, to: 2_000_000, rate: 20 },
  { from: 2_000_000, to: 2_400_000, rate: 25 },
  { from: 2_400_000, to: Infinity,  rate: 30 },
];

export function getOldRegimeSlabs(age: AgeGroup): Slab[] {
  if (age === "senior80") return [
    { from:         0, to:   500_000, rate: 0  },
    { from:   500_000, to: 1_000_000, rate: 20 },
    { from: 1_000_000, to: Infinity,  rate: 30 },
  ];
  if (age === "senior60") return [
    { from:         0, to:   300_000, rate: 0  },
    { from:   300_000, to:   500_000, rate: 5  },
    { from:   500_000, to: 1_000_000, rate: 20 },
    { from: 1_000_000, to: Infinity,  rate: 30 },
  ];
  return [
    { from:         0, to:   250_000, rate: 0  },
    { from:   250_000, to:   500_000, rate: 5  },
    { from:   500_000, to: 1_000_000, rate: 20 },
    { from: 1_000_000, to: Infinity,  rate: 30 },
  ];
}

export function slabTax(income: number, slabs: Slab[]): number {
  let tax = 0;
  for (const s of slabs) {
    if (income <= s.from) break;
    tax += (Math.min(income, s.to) - s.from) * s.rate / 100;
  }
  return tax;
}

export function addSurchargeAndCess(baseTax: number, gross: number, capAt25 = false): number {
  let sr = 0;
  if (gross > 50_000_000)      sr = capAt25 ? 25 : 37;
  else if (gross > 20_000_000) sr = 25;
  else if (gross > 10_000_000) sr = 15;
  else if (gross >  5_000_000) sr = 10;
  const surcharge = baseTax * sr / 100;
  const cess = (baseTax + surcharge) * 0.04;
  return Math.round(baseTax + surcharge + cess);
}

export interface NewRegimeResult {
  tax: number;
  taxable: number;
  stdDed: number;
}

export function calcNewRegime(gross: number): NewRegimeResult {
  const stdDed = 75_000;
  const taxable = Math.max(0, gross - stdDed);
  let base = slabTax(taxable, NEW_REGIME_SLABS);
  if (taxable <= 1_200_000) base = Math.max(0, base - 60_000);
  const threshold = 1_275_000;
  if (gross > threshold && gross < threshold + 200_000 && base > 0) {
    const excess = gross - threshold;
    const cappedBase = Math.min(base, excess);
    base = Math.max(0, cappedBase);
  }
  return { tax: addSurchargeAndCess(base, gross, true), taxable, stdDed };
}

export interface OldRegimeDeductions {
  c80: number;
  d80: number;
  hra: number;
  homeLoan: number;
  nps: number;
  tttb: number;
  edu80E: number;
  donations80G: number;
}

export interface OldRegimeBreakdown {
  c80Allowed: number;
  d80Allowed: number;
  hraAllowed: number;
  homeLoanAllowed: number;
  npsAllowed: number;
  tttbAllowed: number;
  edu80EAllowed: number;
  g80Allowed: number;
}

export interface OldRegimeResult {
  tax: number;
  taxable: number;
  totalDed: number;
  stdDed: number;
  breakdown: OldRegimeBreakdown;
}

export function calcOldRegime(gross: number, age: AgeGroup, ded: OldRegimeDeductions): OldRegimeResult {
  const slabs = getOldRegimeSlabs(age);
  const isSenior = age !== "below60";
  const stdDed = 50_000;
  const tttbMax = isSenior ? 50_000 : 10_000;

  const c80Allowed    = Math.min(150_000, ded.c80);
  const d80Allowed    = Math.min(100_000, ded.d80);
  const hraAllowed    = ded.hra;
  const homeLoanAllowed = Math.min(200_000, ded.homeLoan);
  const npsAllowed    = Math.min(50_000, ded.nps);
  const tttbAllowed   = Math.min(tttbMax, ded.tttb);
  const edu80EAllowed = ded.edu80E;
  const g80Allowed    = Math.min(100_000, Math.floor(ded.donations80G * 0.5));

  const totalDed = stdDed + c80Allowed + d80Allowed + hraAllowed
    + homeLoanAllowed + npsAllowed + tttbAllowed + edu80EAllowed + g80Allowed;

  const taxable = Math.max(0, gross - totalDed);
  let base = slabTax(taxable, slabs);
  if (taxable <= 500_000) base = Math.max(0, base - 12_500);

  return {
    tax: addSurchargeAndCess(base, gross, false),
    taxable,
    totalDed,
    stdDed,
    breakdown: { c80Allowed, d80Allowed, hraAllowed, homeLoanAllowed, npsAllowed, tttbAllowed, edu80EAllowed, g80Allowed },
  };
}
