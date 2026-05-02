import { calculateAdvancedHomeLoan } from "@/lib/calculations/home-loan-advanced/home-loan-advanced";

describe("calculateAdvancedHomeLoan", () => {
  it("recalculates deterministically for a prepayment event while keeping tenure fixed", () => {
    const result = calculateAdvancedHomeLoan({
      principal: {
        value: 4500000,
        currency: "INR"
      },
      annualRatePct: 8.75,
      tenureMonths: 240,
      strategy: "keep-tenure-adjust-emi",
      events: [
        {
          id: "prepay-6",
          monthIndex: 6,
          type: "prepayment",
          amount: {
            value: 200000,
            currency: "INR"
          }
        }
      ]
    });

    expect(result.finalMonthlyEmi.value).toBeCloseTo(37982.71, 2);
    expect(result.totalRepayment.value).toBeCloseTo(9326556.27, 2);
    expect(result.totalPrepaymentAmount.value).toBe(200000);
    expect(result.impactSummary[0]).toMatch(/prepayment of ₹2,00,000/i);
    expect(result.schedule.some((row) => row.eventApplied === "prepayment")).toBe(true);
  });

  it("supports rate changes and moratorium periods in the same scenario", () => {
    const result = calculateAdvancedHomeLoan({
      principal: {
        value: 4500000,
        currency: "INR"
      },
      annualRatePct: 8.75,
      tenureMonths: 240,
      strategy: "keep-emi-adjust-tenure",
      events: [
        {
          id: "rate-13",
          monthIndex: 13,
          type: "rate-change",
          newAnnualRatePct: 9.25
        },
        {
          id: "moratorium-25",
          monthIndex: 25,
          type: "moratorium",
          durationMonths: 3,
          interestAccrues: true
        }
      ]
    });

    expect(result.finalMonthlyEmi.value).toBeCloseTo(39766.98, 2);
    expect(result.finalTenureMonths).toBeGreaterThan(240);
    expect(result.impactSummary.join(" ")).toMatch(/rate changed to 9.25%/i);
    expect(result.impactSummary.join(" ")).toMatch(/moratorium for 3 months/i);
    expect(result.schedule.some((row) => row.eventApplied === "moratorium")).toBe(true);
  });
});
