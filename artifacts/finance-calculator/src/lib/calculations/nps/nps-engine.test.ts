import { calculateNps } from "@/lib/calculations/nps/nps-engine";

describe("calculateNps", () => {
  it("returns corpus, totalInvested, returns, and pension for a 30-year accumulation", () => {
    const result = calculateNps({
      monthlyContribution: 5_000,
      annualReturnPct: 10,
      currentAge: 30,
      retirementAge: 60,
    });
    expect(result.years).toBe(30);
    expect(result.totalInvested).toBe(5_000 * 30 * 12);
    expect(result.corpus).toBeGreaterThan(result.totalInvested);
    expect(result.returns).toBeCloseTo(result.corpus - result.totalInvested, 1);
  });

  it("lumpSum is 60% of corpus and annuityCorpus is 40% by default", () => {
    const result = calculateNps({
      monthlyContribution: 10_000,
      annualReturnPct: 10,
      currentAge: 25,
      retirementAge: 60,
    });
    expect(result.lumpSum).toBeCloseTo(result.corpus * 0.6, 1);
    expect(result.annuityCorpus).toBeCloseTo(result.corpus * 0.4, 1);
  });

  it("monthlyPension = (annuityCorpus × annuityRate) / 12", () => {
    const result = calculateNps({
      monthlyContribution: 5_000,
      annualReturnPct: 10,
      currentAge: 30,
      retirementAge: 60,
      annuityRatePct: 6,
    });
    expect(result.monthlyPension).toBeCloseTo((result.annuityCorpus * 0.06) / 12, 1);
  });

  it("longer accumulation period produces a much larger corpus", () => {
    const short = calculateNps({ monthlyContribution: 5_000, annualReturnPct: 10, currentAge: 50, retirementAge: 60 });
    const long = calculateNps({ monthlyContribution: 5_000, annualReturnPct: 10, currentAge: 25, retirementAge: 60 });
    expect(long.corpus).toBeGreaterThan(short.corpus * 2);
  });

  it("higher return rate increases corpus significantly", () => {
    const low = calculateNps({ monthlyContribution: 5_000, annualReturnPct: 8, currentAge: 30, retirementAge: 60 });
    const high = calculateNps({ monthlyContribution: 5_000, annualReturnPct: 12, currentAge: 30, retirementAge: 60 });
    expect(high.corpus).toBeGreaterThan(low.corpus);
  });

  it("custom annuityCorpusPct changes the split", () => {
    const result = calculateNps({
      monthlyContribution: 5_000,
      annualReturnPct: 10,
      currentAge: 30,
      retirementAge: 60,
      annuityCorpusPct: 0.5,
    });
    expect(result.lumpSum).toBeCloseTo(result.corpus * 0.5, 1);
    expect(result.annuityCorpus).toBeCloseTo(result.corpus * 0.5, 1);
  });
});
