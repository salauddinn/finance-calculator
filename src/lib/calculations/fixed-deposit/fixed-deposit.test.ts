import { calculateFixedDeposit } from "@/lib/calculations/fixed-deposit/fixed-deposit";

describe("calculateFixedDeposit", () => {
  it("returns maturity value and interest earned for yearly compounding", () => {
    expect(
      calculateFixedDeposit({
        depositAmount: 100000,
        annualRatePct: 7.5,
        tenureMonths: 24,
        compoundingFrequency: "yearly"
      })
    ).toEqual({
      maturityValue: 115562.5,
      interestEarned: 15562.5
    });
  });

  it("produces a larger maturity value when compounding more frequently", () => {
    const yearly = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 7.5,
      tenureMonths: 24,
      compoundingFrequency: "yearly"
    });
    const monthly = calculateFixedDeposit({
      depositAmount: 100000,
      annualRatePct: 7.5,
      tenureMonths: 24,
      compoundingFrequency: "monthly"
    });

    expect(monthly.maturityValue).toBeGreaterThan(yearly.maturityValue);
  });
});
