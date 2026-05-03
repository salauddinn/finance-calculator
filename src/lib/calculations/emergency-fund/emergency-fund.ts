export interface EmergencyFundInput {
  monthlyExpenses: number;
  targetMonths: number;
  currentSavings: number;
  monthlyContribution: number;
}

export interface EmergencyFundResult {
  requiredFund: number;
  shortfall: number;
  surplus: number;
  hasSurplus: boolean;
  monthsToTarget: number | null;
}

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const { monthlyExpenses, targetMonths, currentSavings, monthlyContribution } = input;

  const requiredFund = monthlyExpenses * targetMonths;
  const gap = requiredFund - currentSavings;
  const hasSurplus = gap <= 0;
  const shortfall = hasSurplus ? 0 : gap;
  const surplus = hasSurplus ? Math.abs(gap) : 0;

  let monthsToTarget: number | null = null;
  if (!hasSurplus && monthlyContribution > 0) {
    monthsToTarget = Math.ceil(shortfall / monthlyContribution);
  }

  return { requiredFund, shortfall, surplus, hasSurplus, monthsToTarget };
}
