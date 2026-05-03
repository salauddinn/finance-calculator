export interface LumpsumInput {
  principal: number;
  annualReturnPct: number;
  years: number;
}

export interface LumpsumResult {
  maturity: number;
  gain: number;
  principal: number;
  multiple: number;
}

export function calculateLumpsum({ principal, annualReturnPct, years }: LumpsumInput): LumpsumResult {
  const r = annualReturnPct / 100;
  const maturity = principal * Math.pow(1 + r, years);
  const gain = maturity - principal;
  const multiple = maturity / principal;
  return { maturity, gain, principal, multiple };
}
