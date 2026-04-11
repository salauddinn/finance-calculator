"use client";

import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import {
  parseSimpleLoanInput,
  type ValidationIssue
} from "@/lib/validation/calculator-inputs";
import { calculatePersonalLoan } from "@/lib/calculations/personal-loan/personal-loan";

const DEFAULT_INPUTS = {
  principal: "2500000",
  annualRatePct: "8.5",
  tenureMonths: "240"
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
  const [inputs, setInputs] = useCalculatorPreferences(
    "personal-loan",
    DEFAULT_INPUTS
  );

  const validation = parseSimpleLoanInput(inputs);
  const result = validation.ok
    ? calculatePersonalLoan({
        principal: validation.data.principal.value,
        annualRatePct: validation.data.annualRatePct,
        tenureMonths: validation.data.tenureMonths
      })
    : null;

  const validationIssues = validation.ok ? [] : validation.issues;
  const validatedTenureMonths = validation.ok
    ? validation.data.tenureMonths
    : inputs.tenureMonths;

  return (
    <section className="calculator-shell">
      <div className="calculator-shell__form">
        <SliderInput
          id="personal-loan-principal"
          label="Loan amount"
          value={inputs.principal}
          min={10000}
          max={5000000}
          step={10000}
          onChange={(event) => setInputs((current) => ({ ...current, principal: event.target.value }))}
        />
        <SliderInput
          id="personal-loan-rate"
          label="Annual interest rate"
          value={inputs.annualRatePct}
          min={1}
          max={30}
          step={0.1}
          onChange={(event) => setInputs((current) => ({ ...current, annualRatePct: event.target.value }))}
        />
        <SliderInput
          id="personal-loan-tenure"
          label="Tenure in months"
          value={inputs.tenureMonths}
          min={6}
          max={120}
          step={6}
          onChange={(event) => setInputs((current) => ({ ...current, tenureMonths: event.target.value }))}
        />

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
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
