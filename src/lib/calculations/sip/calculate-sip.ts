export type SipInput = {
  monthlyContribution: number;
  annualReturnPct: number;
  durationMonths: number;
};

export type CurrencyAmount = {
  value: number;
  currency: "INR";
};

export type SipResult = {
  investedAmount: CurrencyAmount;
  estimatedReturns: CurrencyAmount;
  maturityValue: CurrencyAmount;
};

function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toCurrencyAmount(value: number): CurrencyAmount {
  return {
    value: roundToTwoDecimals(value),
    currency: "INR"
  };
}

export function calculateSip({
  monthlyContribution,
  annualReturnPct,
  durationMonths
}: SipInput): SipResult {
  const investedAmount = monthlyContribution * durationMonths;

  if (annualReturnPct === 0) {
    return {
      investedAmount: toCurrencyAmount(investedAmount),
      estimatedReturns: toCurrencyAmount(0),
      maturityValue: toCurrencyAmount(investedAmount)
    };
  }

  const monthlyRate = annualReturnPct / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRate, durationMonths);
  const maturityValue = monthlyContribution * (((growthFactor - 1) / monthlyRate) * (1 + monthlyRate));
  const estimatedReturns = maturityValue - investedAmount;

  return {
    investedAmount: toCurrencyAmount(investedAmount),
    estimatedReturns: toCurrencyAmount(estimatedReturns),
    maturityValue: toCurrencyAmount(maturityValue)
  };
}
