import {
  executeMasterUnderwriting,
  type MasterUnderwritingInput,
} from "./comprehensive-loan-engine";

function makeConfig(
  overrides: Partial<MasterUnderwritingInput> = {}
): MasterUnderwritingInput {
  return {
    loan: { loanAmount: 500000, interestRateAnnual: 10.5, tenureMonths: 60 },
    interestConfig: {
      interestType: "fixed",
      interestCalculationMethod: "reducing",
      compoundingFrequency: "monthly",
    },
    fees: {
      processingFeeType: "percentage",
      processingFeeValue: 1.5,
      gstRate: 18,
      insuranceAmount: 5000,
      otherCharges: 2000,
    },
    emiConfig: {
      emiType: "standard",
      emiStepPercent: 5,
      emiStartDelayMonths: 0,
      emiFrequency: "monthly",
    },
    prepayment: {
      prepaymentEnabled: false,
      prepaymentType: "lump_sum",
      prepaymentAmount: 50000,
      prepaymentFrequency: "one_time",
      prepaymentStartMonth: 12,
      prepaymentChargesPercent: 2,
    },
    rateChanges: [],
    moratorium: { moratoriumMonths: 0, moratoriumInterestTreatment: "accrue" },
    calculation: { calculationMode: "emi" },
    ...overrides,
  };
}

describe("executeMasterUnderwriting", () => {
  describe("EMI mode — reducing balance", () => {
    it("computes basic EMI for a 5L loan at 10.5% for 60 months", () => {
      const result = executeMasterUnderwriting(makeConfig());
      expect(result.emi).toBeGreaterThan(10000);
      expect(result.emi).toBeLessThan(12000);
      expect(result.totalInterest).toBeGreaterThan(0);
      expect(result.computedTenureMonths).toBe(60);
    });

    it("calculates correct total fees", () => {
      const result = executeMasterUnderwriting(makeConfig());
      // 1.5% of 5L = 7500 + 18% GST=1350 + 5000 ins + 2000 other = 15850
      expect(result.totalPayment).toBeGreaterThan(500000 + 15850);
    });
  });

  describe("flat interest", () => {
    it("computes higher EMI with flat rate vs reducing", () => {
      const reducing = executeMasterUnderwriting(makeConfig());
      const flat = executeMasterUnderwriting(
        makeConfig({
          interestConfig: {
            interestType: "fixed",
            interestCalculationMethod: "flat",
            compoundingFrequency: "monthly",
          },
        })
      );
      expect(flat.emi).toBeGreaterThan(reducing.emi);
    });
  });

  describe("prepayment", () => {
    it("reduces total interest when a lump-sum prepayment is applied", () => {
      const noPrepay = executeMasterUnderwriting(makeConfig());
      const withPrepay = executeMasterUnderwriting(
        makeConfig({
          prepayment: {
            prepaymentEnabled: true,
            prepaymentType: "lump_sum",
            prepaymentAmount: 50000,
            prepaymentFrequency: "one_time",
            prepaymentStartMonth: 12,
            prepaymentChargesPercent: 2,
          },
        })
      );
      expect(withPrepay.totalInterest).toBeLessThan(noPrepay.totalInterest);
      expect(withPrepay.interestSaved).toBeGreaterThan(0);
    });
  });

  describe("moratorium", () => {
    it("accrues interest during moratorium, increasing final EMI", () => {
      const noMora = executeMasterUnderwriting(makeConfig());
      const withMora = executeMasterUnderwriting(
        makeConfig({
          moratorium: {
            moratoriumMonths: 3,
            moratoriumInterestTreatment: "accrue",
          },
        })
      );
      expect(withMora.emi).toBeGreaterThan(noMora.emi);
      expect(withMora.schedule.length).toBeGreaterThan(noMora.schedule.length);
    });
  });

  describe("reverse solver — loan_amount mode", () => {
    it("resolves maximum loan amount for a given target EMI", () => {
      const result = executeMasterUnderwriting(
        makeConfig({
          calculation: { calculationMode: "loan_amount", targetEmi: 10000 },
        })
      );
      expect(result.computedLoanAmount).toBeGreaterThan(0);
      expect(result.computedLoanAmount).toBeLessThan(500000);
      expect(result.emi).toBeCloseTo(10000, -2);
    });
  });

  describe("reverse solver — tenure mode", () => {
    it("resolves tenure for a given target EMI (rounded up)", () => {
      const result = executeMasterUnderwriting(
        makeConfig({
          calculation: { calculationMode: "tenure", targetEmi: 15000 },
        })
      );
      expect(result.computedTenureMonths).toBeGreaterThan(0);
      expect(Number.isInteger(result.computedTenureMonths)).toBe(true);
    });
  });

  describe("FOIR check", () => {
    it("flags FOIR exceeded when EMI + existing obligations breach limit", () => {
      const result = executeMasterUnderwriting(
        makeConfig({
          userProfile: {
            monthlyIncome: 25000,
            existingEMIs: 10000,
            foirLimit: 50,
          },
        })
      );
      expect(result.foirExceeded).toBe(true);
      expect(result.foirValue).toBeGreaterThan(50);
    });

    it("passes FOIR when income is high enough", () => {
      const result = executeMasterUnderwriting(
        makeConfig({
          userProfile: {
            monthlyIncome: 200000,
            existingEMIs: 0,
            foirLimit: 50,
          },
        })
      );
      expect(result.foirExceeded).toBe(false);
    });
  });

  describe("step_up EMI", () => {
    it("uses configurable step percent", () => {
      const result = executeMasterUnderwriting(
        makeConfig({
          emiConfig: {
            emiType: "step_up",
            emiStepPercent: 10,
            emiStartDelayMonths: 0,
            emiFrequency: "monthly",
          },
        })
      );
      // With step_up, later EMIs should be higher, so total tenure should reduce
      expect(result.computedTenureMonths).toBeLessThanOrEqual(60);
      expect(result.schedule.length).toBeGreaterThan(0);
    });
  });
});
