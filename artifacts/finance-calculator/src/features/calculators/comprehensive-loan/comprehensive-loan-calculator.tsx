

import { useMemo } from "react";

import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { Button } from "@/components/primitives/button";
import { exportToExcel } from "@/lib/export/excel-export";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculatePersonalLoan } from "@/lib/calculations/personal-loan/personal-loan";
import {
  executeMasterUnderwriting,
  type MasterUnderwritingInput,
} from "@/lib/calculations/comprehensive-loan/comprehensive-loan-engine";

const DEFAULT_INPUTS = {
  /* Group 1: Core */
  loanAmount: "500000",
  interestRateAnnual: "10.5",
  tenureMonths: "60",
  /* Mode */
  mode: "simple",
  /* Group 2: Interest */
  interestType: "fixed",
  interestCalculationMethod: "reducing",
  compoundingFrequency: "monthly",
  /* Group 3: Fees */
  processingFeeType: "percentage",
  processingFeeValue: "1.5",
  gstRate: "18",
  insuranceAmount: "0",
  otherCharges: "0",
  /* Group 4: EMI */
  emiType: "standard",
  emiStepPercent: "5",
  emiStartDelayMonths: "0",
  emiFrequency: "monthly",
  /* Group 5: Prepayment */
  prepaymentEnabled: "false",
  prepaymentType: "lump_sum",
  prepaymentAmount: "50000",
  prepaymentFrequency: "one_time",
  prepaymentStartMonth: "12",
  prepaymentChargesPercent: "2",
  /* Group 6: Rate Changes */
  rateChangeMonth: "24",
  rateChangeNewRate: "11",
  rateChangeEnabled: "false",
  /* Group 7: Moratorium */
  moratoriumMonths: "0",
  moratoriumInterestTreatment: "accrue",
  /* Group 8: User Profile */
  profileEnabled: "false",
  monthlyIncome: "80000",
  existingEMIs: "10000",
  foirLimit: "50",
  /* Group 9: Calculation Mode */
  calculationMode: "emi",
  targetEmi: "10000",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ComprehensiveLoanCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences(
    "personal-loan", // Reuses existing personal-loan preference namespace
    DEFAULT_INPUTS
  );

  const isAdvanced = inputs.mode === "advanced";

  const result = useMemo(() => {
    const loanAmount = Number(inputs.loanAmount);
    const rate = Number(inputs.interestRateAnnual);
    const tenure = Number(inputs.tenureMonths);

    if (loanAmount <= 0 || rate <= 0 || tenure <= 0) return null;

    if (!isAdvanced) {
      // Simple mode: basic EMI using existing personal loan math
      const simple = calculatePersonalLoan({
        principal: loanAmount,
        annualRatePct: rate,
        tenureMonths: tenure,
      });
      return {
        emi: simple.monthlyEmi.value,
        totalInterest: simple.totalInterest.value,
        totalPayment: simple.totalRepayment.value,
        apr: rate,
        interestSaved: 0,
        tenureReduced: 0,
        computedLoanAmount: loanAmount,
        computedTenureMonths: tenure,
        schedule: [],
        foirExceeded: false,
        foirValue: 0,
      };
    }

    // Advanced mode: full underwriting engine
    const config: MasterUnderwritingInput = {
      loan: {
        loanAmount,
        interestRateAnnual: rate,
        tenureMonths: tenure,
      },
      interestConfig: {
        interestType: inputs.interestType as "fixed" | "floating",
        interestCalculationMethod: inputs.interestCalculationMethod as
          | "reducing"
          | "flat",
        compoundingFrequency: inputs.compoundingFrequency as
          | "monthly"
          | "quarterly"
          | "daily",
      },
      fees: {
        processingFeeType: inputs.processingFeeType as "percentage" | "fixed",
        processingFeeValue: Number(inputs.processingFeeValue),
        gstRate: Number(inputs.gstRate),
        insuranceAmount: Number(inputs.insuranceAmount),
        otherCharges: Number(inputs.otherCharges),
      },
      emiConfig: {
        emiType: inputs.emiType as
          | "standard"
          | "step_up"
          | "step_down"
          | "bullet",
        emiStepPercent: Number(inputs.emiStepPercent),
        emiStartDelayMonths: Number(inputs.emiStartDelayMonths),
        emiFrequency: inputs.emiFrequency as "monthly" | "biweekly",
      },
      prepayment: {
        prepaymentEnabled: inputs.prepaymentEnabled === "true",
        prepaymentType: inputs.prepaymentType as "lump_sum" | "recurring",
        prepaymentAmount: Number(inputs.prepaymentAmount),
        prepaymentFrequency: inputs.prepaymentFrequency as
          | "monthly"
          | "yearly"
          | "one_time",
        prepaymentStartMonth: Number(inputs.prepaymentStartMonth),
        prepaymentChargesPercent: Number(inputs.prepaymentChargesPercent),
      },
      rateChanges:
        inputs.rateChangeEnabled === "true"
          ? [
              {
                month: Number(inputs.rateChangeMonth),
                newRate: Number(inputs.rateChangeNewRate),
              },
            ]
          : [],
      moratorium: {
        moratoriumMonths: Number(inputs.moratoriumMonths),
        moratoriumInterestTreatment: inputs.moratoriumInterestTreatment as
          | "accrue"
          | "pay_only_interest"
          | "defer_all",
      },
      userProfile:
        inputs.profileEnabled === "true"
          ? {
              monthlyIncome: Number(inputs.monthlyIncome),
              existingEMIs: Number(inputs.existingEMIs),
              foirLimit: Number(inputs.foirLimit),
            }
          : undefined,
      calculation: {
        calculationMode: inputs.calculationMode as
          | "emi"
          | "loan_amount"
          | "tenure",
        targetEmi:
          inputs.calculationMode !== "emi"
            ? Number(inputs.targetEmi)
            : undefined,
      },
    };

    return executeMasterUnderwriting(config);
  }, [inputs, isAdvanced]);

  const set = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInputs((current) => ({ ...current, [field]: event.target.value }));

  const setChecked = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputs((current) => ({
      ...current,
      [field]: event.target.checked ? "true" : "false",
    }));

  const handleExport = async () => {
    if (!result || !isAdvanced || !('schedule' in result) || result.schedule.length === 0) return;
    
    await exportToExcel(
      "Comprehensive_Loan_Schedule",
      "Amortization",
      result.schedule,
      [
        { header: "Month", key: "month", format: "number" },
        { header: "EMI", key: "emi", format: "currency", width: 18 },
        { header: "Principal Paid", key: "principal", format: "currency", width: 18, color: 'FFD1FAE5' },
        { header: "Interest Paid", key: "interest", format: "currency", width: 18, color: 'FFFEE2E2' },
        { header: "Closing Balance", key: "balance", format: "currency", width: 20 },
        { header: "Cumulative Interest", key: "cumulativeInterest", format: "currency", width: 20 },
        { header: "Cumulative Principal", key: "cumulativePrincipal", format: "currency", width: 20 }
      ]
    );
  };

  return (
    <section className="calculator-shell">
      <div className="calculator-shell__form">
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <p className="eyebrow">Comprehensive loan engine</p>
            <h2>Personal Loan Calculator</h2>
            <p className="hero-copy">
              Plan your EMI, model prepayments, and check affordability.
            </p>
          </div>
          <ModeToggle
            mode={inputs.mode as "simple" | "advanced"}
            onChange={(mode) =>
              setInputs((current) => ({ ...current, mode }))
            }
          />
        </div>

        {/* ── Group 1: Core Loan Fields (always visible) ── */}
        <SliderInput
          id="cl-loan-amount"
          label="Loan amount"
          value={inputs.loanAmount as string}
          min={10000}
          max={10000000}
          step={10000}
          onChange={set("loanAmount")}
        />
        <SliderInput
          id="cl-interest-rate"
          label="Annual interest rate"
          value={inputs.interestRateAnnual as string}
          min={1}
          max={36}
          step={0.1}
          onChange={set("interestRateAnnual")}
        />
        <SliderInput
          id="cl-tenure"
          label="Tenure in months"
          value={inputs.tenureMonths as string}
          min={3}
          max={360}
          step={1}
          onChange={set("tenureMonths")}
        />

        {/* ── Advanced Groups (2-9) ── */}
        {isAdvanced && (
          <>
            {/* Group 2: Interest Config */}
            <AdvancedOptionsAccordion title="Interest Configuration">
              <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="field">
                  <label className="field__label" htmlFor="cl-interest-type">
                    Interest type
                  </label>
                  <select
                    id="cl-interest-type"
                    className="text-input"
                    value={inputs.interestType as string}
                    onChange={set("interestType")}
                  >
                    <option value="fixed">Fixed</option>
                    <option value="floating">Floating</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="cl-calc-method">
                    Calculation method
                  </label>
                  <select
                    id="cl-calc-method"
                    className="text-input"
                    value={inputs.interestCalculationMethod as string}
                    onChange={set("interestCalculationMethod")}
                  >
                    <option value="reducing">Reducing balance</option>
                    <option value="flat">Flat rate</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="cl-compounding">
                    Compounding frequency
                  </label>
                  <select
                    id="cl-compounding"
                    className="text-input"
                    value={inputs.compoundingFrequency as string}
                    onChange={set("compoundingFrequency")}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>
            </AdvancedOptionsAccordion>

            {/* Group 3: Fees & Charges */}
            <AdvancedOptionsAccordion title="Fees & Charges">
              <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="field">
                  <label className="field__label" htmlFor="cl-fee-type">
                    Processing fee type
                  </label>
                  <select
                    id="cl-fee-type"
                    className="text-input"
                    value={inputs.processingFeeType as string}
                    onChange={set("processingFeeType")}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <SliderInput
                  id="cl-fee-value"
                  label={
                    inputs.processingFeeType === "percentage"
                      ? "Processing fee %"
                      : "Processing fee (₹)"
                  }
                  value={inputs.processingFeeValue as string}
                  min={0}
                  max={inputs.processingFeeType === "percentage" ? 10 : 100000}
                  step={inputs.processingFeeType === "percentage" ? 0.1 : 500}
                  onChange={set("processingFeeValue")}
                />
                <SliderInput
                  id="cl-gst"
                  label="GST rate %"
                  value={inputs.gstRate as string}
                  min={0}
                  max={28}
                  step={1}
                  onChange={set("gstRate")}
                />
                <SliderInput
                  id="cl-insurance"
                  label="Insurance amount"
                  value={inputs.insuranceAmount as string}
                  min={0}
                  max={100000}
                  step={1000}
                  onChange={set("insuranceAmount")}
                />
                <SliderInput
                  id="cl-other-charges"
                  label="Other charges"
                  value={inputs.otherCharges as string}
                  min={0}
                  max={50000}
                  step={500}
                  onChange={set("otherCharges")}
                />
              </div>
            </AdvancedOptionsAccordion>

            {/* Group 4: EMI Configuration */}
            <AdvancedOptionsAccordion title="EMI Configuration">
              <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="field">
                  <label className="field__label" htmlFor="cl-emi-type">
                    EMI type
                  </label>
                  <select
                    id="cl-emi-type"
                    className="text-input"
                    value={inputs.emiType as string}
                    onChange={set("emiType")}
                  >
                    <option value="standard">Standard</option>
                    <option value="step_up">Step Up</option>
                    <option value="step_down">Step Down</option>
                    <option value="bullet">Bullet</option>
                  </select>
                </div>
                {(inputs.emiType === "step_up" ||
                  inputs.emiType === "step_down") && (
                  <SliderInput
                    id="cl-emi-step"
                    label="Annual step % (Default: 5%)"
                    hint="How much the EMI changes each year"
                    value={inputs.emiStepPercent as string}
                    min={1}
                    max={25}
                    step={1}
                    onChange={set("emiStepPercent")}
                  />
                )}
                <SliderInput
                  id="cl-emi-delay"
                  label="EMI start delay (months)"
                  value={inputs.emiStartDelayMonths as string}
                  min={0}
                  max={12}
                  step={1}
                  onChange={set("emiStartDelayMonths")}
                />
              </div>
            </AdvancedOptionsAccordion>

            {/* Group 5: Prepayment/Foreclosure */}
            <AdvancedOptionsAccordion title="Prepayment / Foreclosure">
              <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="field">
                  <label
                    className="field__label"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      type="checkbox"
                      checked={inputs.prepaymentEnabled === "true"}
                      onChange={setChecked("prepaymentEnabled")}
                    />
                    Enable prepayment
                  </label>
                </div>
                {inputs.prepaymentEnabled === "true" && (
                  <>
                    <div className="field">
                      <label className="field__label" htmlFor="cl-prepay-type">
                        Prepayment type
                      </label>
                      <select
                        id="cl-prepay-type"
                        className="text-input"
                        value={inputs.prepaymentType as string}
                        onChange={set("prepaymentType")}
                      >
                        <option value="lump_sum">Lump Sum</option>
                        <option value="recurring">Recurring</option>
                      </select>
                    </div>
                    <SliderInput
                      id="cl-prepay-amount"
                      label="Prepayment amount"
                      value={inputs.prepaymentAmount as string}
                      min={0}
                      max={5000000}
                      step={10000}
                      onChange={set("prepaymentAmount")}
                    />
                    <div className="field">
                      <label className="field__label" htmlFor="cl-prepay-freq">
                        Frequency
                      </label>
                      <select
                        id="cl-prepay-freq"
                        className="text-input"
                        value={inputs.prepaymentFrequency as string}
                        onChange={set("prepaymentFrequency")}
                      >
                        <option value="one_time">One Time</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                    <SliderInput
                      id="cl-prepay-start"
                      label="Start month"
                      value={inputs.prepaymentStartMonth as string}
                      min={1}
                      max={Number(inputs.tenureMonths)}
                      step={1}
                      onChange={set("prepaymentStartMonth")}
                    />
                    <SliderInput
                      id="cl-prepay-charges"
                      label="Prepayment penalty %"
                      value={inputs.prepaymentChargesPercent as string}
                      min={0}
                      max={5}
                      step={0.5}
                      onChange={set("prepaymentChargesPercent")}
                    />
                  </>
                )}
              </div>
            </AdvancedOptionsAccordion>

            {/* Group 6: Floating Rate Changes */}
            {inputs.interestType === "floating" && (
              <AdvancedOptionsAccordion title="Rate Changes (Floating)">
                <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="field">
                    <label
                      className="field__label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={inputs.rateChangeEnabled === "true"}
                        onChange={setChecked("rateChangeEnabled")}
                      />
                      Model a rate change
                    </label>
                  </div>
                  {inputs.rateChangeEnabled === "true" && (
                    <>
                      <SliderInput
                        id="cl-rate-change-month"
                        label="Rate change at month"
                        value={inputs.rateChangeMonth as string}
                        min={1}
                        max={Number(inputs.tenureMonths)}
                        step={1}
                        onChange={set("rateChangeMonth")}
                      />
                      <SliderInput
                        id="cl-rate-change-value"
                        label="New rate %"
                        value={inputs.rateChangeNewRate as string}
                        min={1}
                        max={36}
                        step={0.1}
                        onChange={set("rateChangeNewRate")}
                      />
                    </>
                  )}
                </div>
              </AdvancedOptionsAccordion>
            )}

            {/* Group 7: Moratorium */}
            <AdvancedOptionsAccordion title="Moratorium / Grace Period">
              <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                <SliderInput
                  id="cl-moratorium-months"
                  label="Moratorium months"
                  value={inputs.moratoriumMonths as string}
                  min={0}
                  max={24}
                  step={1}
                  onChange={set("moratoriumMonths")}
                />
                <div className="field">
                  <label
                    className="field__label"
                    htmlFor="cl-moratorium-treatment"
                  >
                    Interest treatment during moratorium
                  </label>
                  <select
                    id="cl-moratorium-treatment"
                    className="text-input"
                    value={inputs.moratoriumInterestTreatment as string}
                    onChange={set("moratoriumInterestTreatment")}
                  >
                    <option value="accrue">Accrue (add to principal)</option>
                    <option value="pay_only_interest">
                      Pay interest only
                    </option>
                    <option value="defer_all">Defer all payments</option>
                  </select>
                </div>
              </div>
            </AdvancedOptionsAccordion>

            {/* Group 8: User Financial Profile */}
            <AdvancedOptionsAccordion title="Affordability Check (FOIR)">
              <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="field">
                  <label
                    className="field__label"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <input
                      type="checkbox"
                      checked={inputs.profileEnabled === "true"}
                      onChange={setChecked("profileEnabled")}
                    />
                    Enable affordability analysis
                  </label>
                </div>
                {inputs.profileEnabled === "true" && (
                  <>
                    <SliderInput
                      id="cl-monthly-income"
                      label="Monthly income"
                      value={inputs.monthlyIncome as string}
                      min={10000}
                      max={1000000}
                      step={5000}
                      onChange={set("monthlyIncome")}
                    />
                    <SliderInput
                      id="cl-existing-emis"
                      label="Existing EMI obligations"
                      value={inputs.existingEMIs as string}
                      min={0}
                      max={200000}
                      step={1000}
                      onChange={set("existingEMIs")}
                    />
                    <SliderInput
                      id="cl-foir-limit"
                      label="FOIR limit %"
                      value={inputs.foirLimit as string}
                      min={20}
                      max={80}
                      step={5}
                      onChange={set("foirLimit")}
                    />
                  </>
                )}
              </div>
            </AdvancedOptionsAccordion>

            {/* Group 9: Reverse Calculation Mode */}
            <AdvancedOptionsAccordion title="Reverse Calculation Mode">
              <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="field">
                  <label className="field__label" htmlFor="cl-calc-mode">
                    What do you want to calculate?
                  </label>
                  <select
                    id="cl-calc-mode"
                    className="text-input"
                    value={inputs.calculationMode as string}
                    onChange={set("calculationMode")}
                  >
                    <option value="emi">Calculate EMI</option>
                    <option value="loan_amount">
                      Calculate max loan amount
                    </option>
                    <option value="tenure">Calculate tenure needed</option>
                  </select>
                </div>
                {inputs.calculationMode !== "emi" && (
                  <SliderInput
                    id="cl-target-emi"
                    label="Target EMI you can afford"
                    value={inputs.targetEmi as string}
                    min={1000}
                    max={500000}
                    step={1000}
                    onChange={set("targetEmi")}
                  />
                )}
              </div>
            </AdvancedOptionsAccordion>
          </>
        )}
      </div>

      {/* ── Results Panel ── */}
      <div className="calculator-shell__results">
        {result ? (
          <>
            <ResultInsightPanel
              title={
                isAdvanced
                  ? "Your comprehensive loan analysis"
                  : "What this means for your budget"
              }
              summary={
                inputs.calculationMode === "loan_amount"
                  ? `With a monthly EMI of ${formatCurrency(Number(inputs.targetEmi))}, you can afford a loan of up to ${formatCurrency(result.computedLoanAmount)}.`
                  : inputs.calculationMode === "tenure"
                    ? `To repay ${formatCurrency(Number(inputs.loanAmount))} at ${formatCurrency(Number(inputs.targetEmi))}/month, you need approximately ${result.computedTenureMonths} months.`
                    : `You would pay around ${formatCurrency(result.emi)} every month for ${result.computedTenureMonths} months.`
              }
              supportingPoints={[
                `Total repayment: ${formatCurrency(result.totalPayment)}.`,
                `Total interest cost: ${formatCurrency(result.totalInterest)}.`,
                ...(isAdvanced && result.interestSaved > 0
                  ? [
                      `Interest saved through prepayments: ${formatCurrency(result.interestSaved)}.`,
                    ]
                  : []),
                ...(isAdvanced && result.tenureReduced > 0
                  ? [
                      `Tenure reduced by ${result.tenureReduced} months.`,
                    ]
                  : []),
              ]}
            />

            {/* FOIR Warning */}
            {isAdvanced && result.foirExceeded && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  borderRadius: "var(--border-radius-md)",
                  padding: "16px",
                  marginBottom: "16px",
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: "#ef4444",
                    marginBottom: "4px",
                  }}
                >
                  ⚠️ Affordability Warning
                </p>
                <p style={{ color: "var(--color-text-muted-light)" }}>
                  Your FOIR is {result.foirValue.toFixed(1)}%, which exceeds
                  the {inputs.foirLimit}% limit. Banks may reject this loan
                  application.
                </p>
              </div>
            )}

            <div className="calculator-metric-grid">
              <ResultSummaryCard
                caption="Your scheduled payment"
                label={
                  inputs.calculationMode === "loan_amount"
                    ? "Max Loan Amount"
                    : "Monthly EMI"
                }
                value={
                  inputs.calculationMode === "loan_amount"
                    ? formatCurrency(result.computedLoanAmount)
                    : formatCurrency(result.emi)
                }
                tone="positive"
              />
              <ResultSummaryCard
                caption="Total amount repaid"
                label="Total payment"
                value={formatCurrency(result.totalPayment)}
              />
              <ResultSummaryCard
                caption="Cost of borrowing"
                label="Total interest"
                value={formatCurrency(result.totalInterest)}
                tone="caution"
              />
              {isAdvanced && (
                <ResultSummaryCard
                  caption="True cost including fees"
                  label="Effective APR"
                  value={`${result.apr.toFixed(2)}%`}
                  tone={
                    result.apr > Number(inputs.interestRateAnnual)
                      ? "caution"
                      : "default"
                  }
                />
              )}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <CopySummaryButton getText={() => [
                "Personal Loan Summary",
                `Loan amount: ${formatCurrency(Number(inputs.loanAmount))}`,
                `Annual rate: ${inputs.interestRateAnnual}%`,
                `Tenure: ${inputs.tenureMonths} months`,
                `Monthly EMI: ${formatCurrency(result.emi)}`,
                `Total interest: ${formatCurrency(result.totalInterest)}`,
                `Total repayment: ${formatCurrency(result.totalPayment)}`,
                "Results are estimates. Verify with your lender."
              ].join("\n")} />
            </div>

            {/* Amortization Schedule (first 12 rows) */}
            {isAdvanced && result.schedule.length > 0 && (
              <section
                className="calculator-panel"
                style={{ marginTop: "24px", overflowX: "auto" }}
              >
                <h3 style={{ marginBottom: "12px" }}>
                  Amortization Schedule (first 12 months)
                </h3>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "var(--type-body-sm)",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      <th style={{ textAlign: "left", padding: "8px 4px" }}>
                        Month
                      </th>
                      <th style={{ textAlign: "right", padding: "8px 4px" }}>
                        EMI
                      </th>
                      <th style={{ textAlign: "right", padding: "8px 4px" }}>
                        Interest
                      </th>
                      <th style={{ textAlign: "right", padding: "8px 4px" }}>
                        Principal
                      </th>
                      <th style={{ textAlign: "right", padding: "8px 4px" }}>
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, 12).map((row) => (
                      <tr
                        key={row.month}
                        style={{
                          borderBottom: "1px solid var(--color-border-light)",
                        }}
                      >
                        <td style={{ padding: "8px 4px" }}>{row.month}</td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>
                          {formatCurrency(row.emi)}
                        </td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>
                          {formatCurrency(row.interest)}
                        </td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>
                          {formatCurrency(row.principal)}
                        </td>
                        <td style={{ textAlign: "right", padding: "8px 4px" }}>
                          {formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
}
