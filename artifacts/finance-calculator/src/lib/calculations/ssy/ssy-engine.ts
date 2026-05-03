export interface SsyInput {
  annualContribution: number;
  girlAge: number;
  interestRatePct: number;
}

export interface SsyResult {
  maturityValue: number;
  totalInvested: number;
  interest: number;
  contrib: number;
  maturityYears: number;
  contributionYears: number;
  dormantYears: number;
  maturityAge: number;
}

export function calculateSsy({ annualContribution, girlAge, interestRatePct }: SsyInput): SsyResult {
  const contrib = Math.min(annualContribution, 150_000);
  const rate = interestRatePct / 100;

  // Account interpreted as maturing when girl turns 21 (21 - girlAge years from now)
  const maturityYears = 21 - girlAge;
  // Deposits required for 15 years from opening OR until maturity, whichever is earlier
  const contributionYears = Math.min(15, maturityYears);
  const dormantYears = maturityYears - contributionYears;

  let balance = 0;
  for (let y = 1; y <= contributionYears; y++) {
    balance = (balance + contrib) * (1 + rate);
  }
  for (let y = 1; y <= dormantYears; y++) {
    balance = balance * (1 + rate);
  }

  const maturityValue = Math.round(balance);
  const totalInvested = contrib * contributionYears;
  const interest = maturityValue - totalInvested;

  return { maturityValue, totalInvested, interest, contrib, maturityYears, contributionYears, dormantYears, maturityAge: 21 };
}
