import { calculateRentVsBuy } from "@/lib/calculations/rent-vs-buy/rent-vs-buy";

const BASE_INPUT = {
  monthlyRent: 20_000,
  homePrice: 6_000_000,
  downPayment: 1_200_000,
  annualLoanRatePct: 8.5,
  loanTenureYears: 20,
  annualAppreciationPct: 7,
  annualRentIncreasePct: 5,
  comparisonYears: 10,
};

describe("calculateRentVsBuy", () => {
  it("computes loan amount as home price minus down payment", () => {
    const result = calculateRentVsBuy(BASE_INPUT);
    expect(result.loanAmount).toBe(BASE_INPUT.homePrice - BASE_INPUT.downPayment);
  });

  it("computes a positive monthly EMI for a standard loan", () => {
    const result = calculateRentVsBuy(BASE_INPUT);
    expect(result.monthlyEmi).toBeGreaterThan(0);
  });

  it("returns zero EMI when interest rate is zero", () => {
    const result = calculateRentVsBuy({ ...BASE_INPUT, annualLoanRatePct: 0 });
    expect(result.monthlyEmi).toBe(0);
  });

  it("returns zero EMI when down payment equals home price", () => {
    const result = calculateRentVsBuy({ ...BASE_INPUT, downPayment: BASE_INPUT.homePrice });
    expect(result.monthlyEmi).toBe(0);
    expect(result.loanAmount).toBe(0);
  });

  it("totalRentPaid increases with a higher rent-increase rate", () => {
    const low = calculateRentVsBuy({ ...BASE_INPUT, annualRentIncreasePct: 2 });
    const high = calculateRentVsBuy({ ...BASE_INPUT, annualRentIncreasePct: 10 });
    expect(high.totalRentPaid).toBeGreaterThan(low.totalRentPaid);
  });

  it("futureHomeValue increases with a higher appreciation rate", () => {
    const low = calculateRentVsBuy({ ...BASE_INPUT, annualAppreciationPct: 3 });
    const high = calculateRentVsBuy({ ...BASE_INPUT, annualAppreciationPct: 12 });
    expect(high.futureHomeValue).toBeGreaterThan(low.futureHomeValue);
  });

  it("returns a valid conclusion string", () => {
    const result = calculateRentVsBuy(BASE_INPUT);
    expect(["renting_cheaper", "buying_better", "close"]).toContain(result.conclusion);
  });

  it("totalBuyingOutflow includes the down payment", () => {
    const result = calculateRentVsBuy(BASE_INPUT);
    expect(result.totalBuyingOutflow).toBeGreaterThan(BASE_INPUT.downPayment);
  });

  it("emi months capped to comparison years when comparison period < loan tenure", () => {
    const result = calculateRentVsBuy({ ...BASE_INPUT, comparisonYears: 5, loanTenureYears: 20 });
    // total outflow should include 5*12=60 EMI months, not 240
    const loanAmount = BASE_INPUT.homePrice - BASE_INPUT.downPayment;
    const r = BASE_INPUT.annualLoanRatePct / 12 / 100;
    const n = 240;
    const emi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const expectedMax = BASE_INPUT.downPayment + emi * 60;
    expect(result.totalBuyingOutflow).toBeLessThanOrEqual(expectedMax + 1);
  });
});
