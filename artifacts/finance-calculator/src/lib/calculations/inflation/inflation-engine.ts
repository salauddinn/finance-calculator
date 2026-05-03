export interface InflationInput {
  amount: number;
  inflationRatePct: number;
  years: number;
}

export interface InflationResult {
  futureCost: number;
  realValue: number;
  purchasingPowerLost: number;
  pctLost: number;
}

export function calculateInflation({ amount, inflationRatePct, years }: InflationInput): InflationResult {
  const rate = inflationRatePct / 100;
  const futureCost = amount * Math.pow(1 + rate, years);
  const realValue = amount / Math.pow(1 + rate, years);
  const purchasingPowerLost = amount - realValue;
  const pctLost = (purchasingPowerLost / amount) * 100;
  return { futureCost, realValue, purchasingPowerLost, pctLost };
}
