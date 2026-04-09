import { calculateSip } from "@/lib/calculations/sip/calculate-sip";

describe("calculateSip", () => {
  it("returns invested amount, estimated returns, and maturity value", () => {
    expect(
      calculateSip({
        monthlyContribution: 10000,
        annualReturnPct: 12,
        durationMonths: 24
      })
    ).toEqual({
      investedAmount: {
        value: 240000,
        currency: "INR"
      },
      estimatedReturns: {
        value: 32432,
        currency: "INR"
      },
      maturityValue: {
        value: 272432,
        currency: "INR"
      }
    });
  });

  it("returns only invested amount when the return rate is zero", () => {
    expect(
      calculateSip({
        monthlyContribution: 5000,
        annualReturnPct: 0,
        durationMonths: 12
      })
    ).toEqual({
      investedAmount: {
        value: 60000,
        currency: "INR"
      },
      estimatedReturns: {
        value: 0,
        currency: "INR"
      },
      maturityValue: {
        value: 60000,
        currency: "INR"
      }
    });
  });
});
