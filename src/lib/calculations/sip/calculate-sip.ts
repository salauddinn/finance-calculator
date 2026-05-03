export type CurrencyAmount = {
  value: number;
  currency: "INR";
};

export interface SipAdvancedConfig {
  stepUpPercentage?: number;
  inflationRate?: number;
  taxationEnabled: boolean;
}

export interface SipInput {
  monthlyContribution: number;
  annualReturnPct: number;
  durationMonths: number;
  advancedConfig?: SipAdvancedConfig;
}

export interface SipResult {
  investedAmount: CurrencyAmount;
  estimatedReturns: CurrencyAmount;
  maturityValue: CurrencyAmount;
}

function roundToTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toCurrencyAmount(value: number): CurrencyAmount {
  return {
    value: roundToTwoDecimals(value),
    currency: "INR",
  };
}

export function calculateSip({
  monthlyContribution,
  annualReturnPct,
  durationMonths,
  advancedConfig,
}: SipInput): SipResult {
  const monthlyRate = annualReturnPct / 12 / 100;
  
  let totalInvested = 0;
  let maturityValue = 0;
  
  const stepUpRate = (advancedConfig?.stepUpPercentage || 0) / 100;
  const inflationRate = (advancedConfig?.inflationRate || 0) / 100;
  
  let currentMonthlyContribution = monthlyContribution;

  // We calculate month by month to apply step-ups correctly
  for (let month = 1; month <= durationMonths; month++) {
    totalInvested += currentMonthlyContribution;
    
    // Add contribution, then compound for the month
    maturityValue += currentMonthlyContribution;
    maturityValue *= (1 + monthlyRate);

    // Step up at the end of each year
    if (month % 12 === 0 && stepUpRate > 0) {
      currentMonthlyContribution += currentMonthlyContribution * stepUpRate;
    }
  }

  // Handle Inflation
  if (inflationRate > 0) {
    const years = durationMonths / 12;
    // Adjust the maturity value to its present value using the inflation rate
    maturityValue = maturityValue / Math.pow(1 + inflationRate, years);
  }

  let estimatedReturns = maturityValue - totalInvested;

  // Handle Taxation
  if (advancedConfig?.taxationEnabled) {
    // Standard simplified LTCG tax assumption: 12.5% on gains (ignoring 1.25L exemption for simplicity here unless requested)
    if (estimatedReturns > 0) {
      const tax = estimatedReturns * 0.125;
      estimatedReturns -= tax;
      maturityValue -= tax;
    }
  }

  if (estimatedReturns < 0 && !advancedConfig?.inflationRate) {
     // If no inflation, returns shouldn't normally drop below 0 unless rate is negative.
  }

  // Ensure returns don't look broken if inflation drastically reduces it
  return {
    investedAmount: toCurrencyAmount(totalInvested),
    estimatedReturns: toCurrencyAmount(estimatedReturns),
    maturityValue: toCurrencyAmount(maturityValue),
  };
}
