export type PpfScheduleRow = {
  year: number;
  contribution: number;
  interestEarned: number;
  closingBalance: number;
};

export type PpfResult = {
  maturityValue: number;
  totalInvested: number;
  totalInterest: number;
  schedule: PpfScheduleRow[];
};

export function calculatePpf({
  annualContribution,
  interestRatePct = 7.1,
  years = 15,
  extensionYears = 0,
}: {
  annualContribution: number;
  interestRatePct?: number;
  years?: number;
  extensionYears?: number;
}): PpfResult {
  const totalYears = years + extensionYears;
  const r = interestRatePct / 100;
  let balance = 0;
  const schedule: PpfScheduleRow[] = [];

  for (let year = 1; year <= totalYears; year++) {
    // During extension (years > 15), no new contributions
    const contribution = year <= years ? annualContribution : 0;
    // PPF interest = (opening balance + contribution) × rate
    const interest = Math.round((balance + contribution) * r);
    balance = balance + contribution + interest;
    schedule.push({
      year,
      contribution,
      interestEarned: interest,
      closingBalance: Math.round(balance),
    });
  }

  const totalInvested = annualContribution * Math.min(years, totalYears);

  return {
    maturityValue: Math.round(balance),
    totalInvested,
    totalInterest: Math.round(balance) - totalInvested,
    schedule,
  };
}
