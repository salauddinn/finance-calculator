import {
  parseAdvancedHomeLoanInput,
  parseSimpleLoanInput,
  parseSipInput,
  parseFixedDepositInput
} from "@/lib/validation/calculator-inputs";

describe("parseSimpleLoanInput", () => {
  it("returns field-specific issues for invalid values", () => {
    const result = parseSimpleLoanInput({
      principal: "-500000",
      annualRatePct: "0",
      tenureMonths: "12.5"
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues).toEqual([
        {
          field: "principal",
          message: "Principal must be greater than zero."
        },
        {
          field: "annualRatePct",
          message: "Rate must be greater than zero and at most 100."
        },
        {
          field: "tenureMonths",
          message: "Tenure must be a whole number of months."
        }
      ]);
    }
  });

  it("normalizes valid loan inputs", () => {
    const result = parseSimpleLoanInput({
      principal: "2500000",
      annualRatePct: "8.5",
      tenureMonths: "240"
    });

    expect(result).toEqual({
      ok: true,
      data: {
        principal: {
          value: 2500000,
          currency: "INR"
        },
        annualRatePct: 8.5,
        tenureMonths: 240
      }
    });
  });
});

describe("parseAdvancedHomeLoanInput", () => {
  it("rejects events that are not in chronological order", () => {
    const result = parseAdvancedHomeLoanInput({
      principal: "4500000",
      annualRatePct: "8.75",
      tenureMonths: "240",
      strategy: "keep-emi-adjust-tenure",
      events: [
        {
          id: "event-2",
          monthIndex: "18",
          type: "prepayment",
          amount: "50000"
        },
        {
          id: "event-1",
          monthIndex: "6",
          type: "rate-change",
          newAnnualRatePct: "9.1"
        }
      ]
    });

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      field: "events",
      message: "Events must be ordered by month."
    });
  });
});

describe("parseSipInput", () => {
  it("rejects invalid inputs", () => {
    const result = parseSipInput({
      monthlyContribution: "-1000",
      annualReturnPct: "0",
      durationMonths: "1.5"
    });
    
    expect(result.ok).toBe(false);
  });

  it("normalizes valid advanced SIP inputs", () => {
    const result = parseSipInput({
      monthlyContribution: "10000",
      annualReturnPct: "12",
      durationMonths: "120",
      stepUpPercentage: "10",
      inflationRate: "6",
      taxationEnabled: true
    });

    expect(result).toEqual({
      ok: true,
      data: {
        monthlyContribution: { value: 10000, currency: "INR" },
        annualReturnPct: 12,
        durationMonths: 120,
        advancedConfig: {
          stepUpPercentage: 10,
          inflationRate: 6,
          taxationEnabled: true
        }
      }
    });
  });
});

describe("parseFixedDepositInput", () => {
  it("rejects invalid inputs", () => {
    const result = parseFixedDepositInput({
      principal: "-100",
      annualRatePct: "200",
      durationMonths: "1.5"
    });
    expect(result.ok).toBe(false);
  });

  it("normalizes valid advanced FD inputs", () => {
    const result = parseFixedDepositInput({
      principal: "100000",
      annualRatePct: "7.1",
      durationMonths: "60",
      compoundingFrequency: "quarterly",
      payoutFrequency: "cumulative",
      seniorCitizen: true,
      tdsEnabled: true
    });

    expect(result).toEqual({
      ok: true,
      data: {
        principal: { value: 100000, currency: "INR" },
        annualRatePct: 7.1,
        durationMonths: 60,
        compoundingFrequency: "quarterly",
        advancedConfig: {
          payoutFrequency: "cumulative",
          seniorCitizen: true,
          tdsEnabled: true
        }
      }
    });
  });
});
