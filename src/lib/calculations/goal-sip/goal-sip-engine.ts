export interface GoalSipInput {
  targetAmount: number;
  annualReturnPct: number;
  years: number;
}

export interface GoalSipResult {
  monthly: number;
  totalInvested: number;
  marketReturns: number;
  targetAmount: number;
}

export function calculateGoalSip({ targetAmount, annualReturnPct, years }: GoalSipInput): GoalSipResult {
  const r = annualReturnPct / 100 / 12;
  const n = years * 12;
  const monthly = (targetAmount * r) / (Math.pow(1 + r, n) - 1);
  const totalInvested = monthly * n;
  const marketReturns = targetAmount - totalInvested;
  return { monthly, totalInvested, marketReturns, targetAmount };
}
