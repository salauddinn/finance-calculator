export interface NpsInput {
  monthlyContribution: number;
  annualReturnPct: number;
  currentAge: number;
  retirementAge: number;
  annuityRatePct?: number;
  annuityCorpusPct?: number;
}

export interface NpsResult {
  corpus: number;
  totalInvested: number;
  returns: number;
  lumpSum: number;
  annuityCorpus: number;
  monthlyPension: number;
  years: number;
}

export function calculateNps({
  monthlyContribution,
  annualReturnPct,
  currentAge,
  retirementAge,
  annuityRatePct = 6,
  annuityCorpusPct = 0.4,
}: NpsInput): NpsResult {
  const r = annualReturnPct / 100 / 12;
  const n = Math.max(0, retirementAge - currentAge) * 12;
  const corpus = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalInvested = monthlyContribution * n;
  const returns = corpus - totalInvested;
  const annuityCorpus = corpus * annuityCorpusPct;
  const lumpSum = corpus * (1 - annuityCorpusPct);
  const monthlyPension = (annuityCorpus * (annuityRatePct / 100)) / 12;
  const years = retirementAge - currentAge;
  return { corpus, totalInvested, returns, lumpSum, annuityCorpus, monthlyPension, years };
}
