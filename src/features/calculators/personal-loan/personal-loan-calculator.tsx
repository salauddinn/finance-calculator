"use client";

import { useMemo } from "react";

import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { parseSimpleLoanInput, type ValidationIssue } from "@/lib/validation/calculator-inputs";
import { calculatePersonalLoan } from "@/lib/calculations/personal-loan/personal-loan";
import { calculatePersonalLoanAdvanced } from "@/lib/calculations/personal-loan/calculate-personal-loan-advanced";

const DEFAULT_INPUTS = {
  principal: "2500000",
  annualRatePct: "8.5",
  tenureMonths: "24",
  mode: "simple",
  delayEmiMonths: "0",
  processingFeeAmount: "0"
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getErrorMessage(issues: ValidationIssue[], field: string) {
  return issues.find((issue) => issue.field === field)?.message;
}

export function PersonalLoanCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("personal-loan", DEFAULT_INPUTS);

  const isAdvanced = inputs.mode === "advanced";
  const validation = parseSimpleLoanInput(inputs);

  const result = useMemo(() => {
    if (!validation.ok) return null;
    
    if (isAdvanced) {
      return calculatePersonalLoanAdvanced({
        principal: validation.data.principal,
        annualRatePct: validation.data.annualRatePct,
        tenureMonths: validation.data.tenureMonths,
        delayEmiMonths: Number(inputs.delayEmiMonths),
        processingFeeAmount: { value: Number(inputs.processingFeeAmount), currency: "INR" },
        prepayments: [] // Full dynamic prepayments list OOS for basic advanced accordion, focus on fees/delay
      });
    }

    // Wrap the simple result to match structure for UI displaying
    const rawResult = calculatePersonalLoan({
      principal: validation.data.principal.value,
      annualRatePct: validation.data.annualRatePct,
      tenureMonths: validation.data.tenureMonths
    });

    return {
      monthlyEmi: rawResult.monthlyEmi,
      totalRepayment: rawResult.totalRepayment,
      totalInterest: rawResult.totalInterest,
      effectiveAprPct: validation.data.annualRatePct,
      finalTenureMonths: validation.data.tenureMonths
    };
  }, [validation, inputs, isAdvanced]);

  const validationIssues = validation.ok ? [] : validation.issues;
  const validatedTenureMonths = result ? result.finalTenureMonths : inputs.tenureMonths;

  return (
    <section className="calculator-shell">
      <div className="calculator-shell__form">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "var(--type-heading-md)", fontWeight: "600" }}>Personal Loan</h2>
            <p className="hero-copy" style={{ marginTop: "4px" }}>Plan out your personal loan EMIs.</p>
          </div>
          <ModeToggle 
            mode={inputs.mode as "simple" | "advanced"} 
            onChange={(mode) => setInputs((current) => ({ ...current, mode }))} 
          />
        </div>

        <SliderInput
          id="personal-loan-principal"
          label="Loan amount"
          value={inputs.principal as string}
          min={10000}
          max={5000000}
          step={10000}
          onChange={(event) => setInputs((current) => ({ ...current, principal: event.target.value }))}
        />
        <SliderInput
          id="personal-loan-rate"
          label="Annual interest rate"
          value={inputs.annualRatePct as string}
          min={1}
          max={30}
          step={0.1}
          onChange={(event) => setInputs((current) => ({ ...current, annualRatePct: event.target.value }))}
        />
        <SliderInput
          id="personal-loan-tenure"
          label="Tenure in months"
          value={inputs.tenureMonths as string}
          min={6}
          max={120}
          step={6}
          onChange={(event) => setInputs((current) => ({ ...current, tenureMonths: event.target.value }))}
        />

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Advanced Loan Config">
            <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
              <SliderInput
                id="pl-processing-fee"
                label="Upfront Processing Fee"
                value={inputs.processingFeeAmount as string}
                min={0}
                max={50000}
                step={500}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    processingFeeAmount: event.target.value
                  }))
                }
              />
              <SliderInput
                id="pl-delay-emi"
                label="Delay EMI Starts (Months)"
                value={inputs.delayEmiMonths as string}
                min={0}
                max={12}
                step={1}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    delayEmiMonths: event.target.value
                  }))
                }
              />
            </div>
          </AdvancedOptionsAccordion>
        )}

        {validationIssues?.length ? (
          <p className="calculator-shell__error">
            {getErrorMessage(validationIssues, "principal") ??
              "Enter a valid loan amount to see EMI results."}
          </p>
        ) : null}
      </div>

      <div className="calculator-shell__results">
        {result ? (
          <>
            <ResultInsightPanel
              title="What this means for your budget"
              summary={`You would pay around ${formatCurrency(result.monthlyEmi.value)} every month for ${validatedTenureMonths} months.`}
              supportingPoints={[
                `Across the full loan, you would repay ${formatCurrency(result.totalRepayment.value)}.`,
                `Out of that total, ${formatCurrency(result.totalInterest.value)} is interest.`
              ]}
            />
            <div className="calculator-metric-grid">
              <ResultSummaryCard
                caption="Main monthly commitment"
                label="Monthly EMI"
                value={formatCurrency(result.monthlyEmi.value)}
                tone="positive"
              />
              <ResultSummaryCard
                caption="Amount repaid over the full term"
                label="Total repayment"
                value={formatCurrency(result.totalRepayment.value)}
              />
              <ResultSummaryCard
                caption="Cost of borrowing"
                label="Total interest"
                value={formatCurrency(result.totalInterest.value)}
                tone="caution"
              />
              {isAdvanced && result.effectiveAprPct && (
                <ResultSummaryCard
                  caption="True cost of loan considering fees/delays"
                  label="Effective APR"
                  value={`${result.effectiveAprPct.toFixed(2)}%`}
                  tone={result.effectiveAprPct > Number(inputs.annualRatePct) ? "caution" : "default"}
                />
              )}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
