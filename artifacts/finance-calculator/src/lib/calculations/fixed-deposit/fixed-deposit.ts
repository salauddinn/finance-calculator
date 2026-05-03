export type CurrencyAmount = { value: number; currency: "INR" };

export type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "yearly";

export interface FdAdvancedConfig {
  payoutFrequency: "cumulative" | "monthly" | "quarterly" | "yearly";
  seniorCitizen: boolean;
  tdsEnabled: boolean;
}

export interface FixedDepositInput {
  depositAmount: number; // Keeping primitive number for backward compatibility, though domain specifies CurrencyAmount. Will wrap output.
  annualRatePct: number;
  durationMonths: number;
  compoundingFrequency: CompoundingFrequency;
  advancedConfig?: FdAdvancedConfig;
}

export interface FixedDepositResult {
  maturityValue: number;
  interestEarned: number;
  totalTdsDeducted: number;
  payoutPerPeriod: number; // Will be 0 if cumulative
}

const COMPOUNDING_PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  yearly: 1,
};

const PAYOUT_PERIODS_PER_YEAR: Record<Exclude<FdAdvancedConfig["payoutFrequency"], "cumulative">, number> = {
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateFixedDeposit({
  depositAmount,
  annualRatePct,
  durationMonths,
  compoundingFrequency,
  advancedConfig,
}: FixedDepositInput): FixedDepositResult {
  let rate = annualRatePct;
  if (advancedConfig?.seniorCitizen) {
    rate += 0.5; // +0.5% standard bump
  }

  const periodsPerYear = COMPOUNDING_PERIODS_PER_YEAR[compoundingFrequency];
  const annualRate = rate / 100;
  const years = durationMonths / 12;

  let totalInterest = 0;
  let maturityValue = depositAmount;
  let payoutPerPeriod = 0;
  let totalTdsDeducted = 0;

  const isCumulative = !advancedConfig || advancedConfig.payoutFrequency === "cumulative";

  if (isCumulative) {
    const compoundedMaturity = depositAmount * Math.pow(1 + annualRate / periodsPerYear, periodsPerYear * years);
    totalInterest = compoundedMaturity - depositAmount;

    if (advancedConfig?.tdsEnabled) {
      // Typically 10% TDS on total interest (ignoring the 40k/50k exemption for simplicity here as per implementation plan defaults)
      totalTdsDeducted = totalInterest * 0.10;
      totalInterest -= totalTdsDeducted;
    }
    
    maturityValue = depositAmount + totalInterest;
  } else {
    // Non-cumulative payout
    // Standard banking logic: simple interest disbursed at payout frequency
    const payoutsPerYear = PAYOUT_PERIODS_PER_YEAR[advancedConfig!.payoutFrequency as keyof typeof PAYOUT_PERIODS_PER_YEAR];
    
    // Total interest over entire duration = P * R * T for simple interest 
    // Technically FD pays compounded interest if payout freq < compounding freq, 
    // but in India, monthly/quarterly payouts are typically discounted. 
    // We'll keep it simple: total interest = P * r * (months/12)
    const grossInterest = depositAmount * annualRate * years;
    
    let netInterest = grossInterest;

    if (advancedConfig?.tdsEnabled) {
      totalTdsDeducted = grossInterest * 0.10;
      netInterest -= totalTdsDeducted;
    }

    const numberOfPayouts = payoutsPerYear * years;
    payoutPerPeriod = numberOfPayouts > 0 ? netInterest / numberOfPayouts : 0;
    
    totalInterest = netInterest;
    maturityValue = depositAmount; // Since interest is paid out, maturity is just principal
  }

  return {
    maturityValue: roundToTwoDecimals(maturityValue),
    interestEarned: roundToTwoDecimals(totalInterest),
    totalTdsDeducted: roundToTwoDecimals(totalTdsDeducted),
    payoutPerPeriod: roundToTwoDecimals(payoutPerPeriod),
  };
}
