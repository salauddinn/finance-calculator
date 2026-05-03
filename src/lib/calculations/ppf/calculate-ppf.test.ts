import { calculatePpf } from "@/lib/calculations/ppf/calculate-ppf";

describe("calculatePpf", () => {
  it("returns correct maturity for 15 years at 7.1%", () => {
    const result = calculatePpf({ annualContribution: 150_000, interestRatePct: 7.1, years: 15 });
    expect(result.totalInvested).toBe(2_250_000);
    expect(result.maturityValue).toBeGreaterThan(result.totalInvested);
    expect(result.totalInterest).toBe(result.maturityValue - result.totalInvested);
    expect(result.schedule.length).toBe(15);
  });

  it("generates a schedule row for every year", () => {
    const result = calculatePpf({ annualContribution: 50_000, years: 10 });
    expect(result.schedule).toHaveLength(10);
    result.schedule.forEach((row, i) => {
      expect(row.year).toBe(i + 1);
      expect(row.contribution).toBe(50_000);
      expect(row.interestEarned).toBeGreaterThan(0);
      expect(row.closingBalance).toBeGreaterThan(0);
    });
  });

  it("balance is monotonically increasing each year", () => {
    const result = calculatePpf({ annualContribution: 100_000, years: 15 });
    for (let i = 1; i < result.schedule.length; i++) {
      expect(result.schedule[i].closingBalance).toBeGreaterThan(result.schedule[i - 1].closingBalance);
    }
  });

  it("handles extension years correctly — no contributions, interest still accrues", () => {
    const base = calculatePpf({ annualContribution: 100_000, years: 15, extensionYears: 0 });
    const extended = calculatePpf({ annualContribution: 100_000, years: 15, extensionYears: 5 });

    expect(extended.schedule.length).toBe(20);
    expect(extended.totalInvested).toBe(base.totalInvested);
    expect(extended.maturityValue).toBeGreaterThan(base.maturityValue);

    // Extension rows should have zero contribution
    for (let i = 15; i < 20; i++) {
      expect(extended.schedule[i].contribution).toBe(0);
    }
  });

  it("closing balance of last schedule row matches maturityValue", () => {
    const result = calculatePpf({ annualContribution: 120_000, years: 15 });
    const lastRow = result.schedule[result.schedule.length - 1];
    expect(lastRow.closingBalance).toBe(result.maturityValue);
  });

  it("year 1 interest uses opening balance of zero (contribution is the only base)", () => {
    const rate = 7.1;
    const contrib = 100_000;
    const result = calculatePpf({ annualContribution: contrib, interestRatePct: rate, years: 1 });
    const expectedInterest = Math.round(contrib * rate / 100);
    expect(result.schedule[0].interestEarned).toBe(expectedInterest);
  });
});
