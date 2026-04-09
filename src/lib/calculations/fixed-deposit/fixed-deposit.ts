export type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "yearly";

export interface FixedDepositInput {
  depositAmount: number;
  annualRatePct: number;
  tenureMonths: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface FixedDepositResult {
  maturityValue: number;
  interestEarned: number;
}

const COMPOUNDING_PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  monthly: 12,
  quarterly: 4,
  "half-yearly": 2,
  yearly: 1
};

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateFixedDeposit({
  depositAmount,
  annualRatePct,
  tenureMonths,
  compoundingFrequency
}: FixedDepositInput): FixedDepositResult {
  const periodsPerYear = COMPOUNDING_PERIODS_PER_YEAR[compoundingFrequency];
  const annualRate = annualRatePct / 100;
  const years = tenureMonths / 12;
  const maturityValue =
    depositAmount * Math.pow(1 + annualRate / periodsPerYear, periodsPerYear * years);
  const roundedMaturityValue = roundToTwoDecimals(maturityValue);

  return {
    maturityValue: roundedMaturityValue,
    interestEarned: roundToTwoDecimals(roundedMaturityValue - depositAmount)
  };
}
