"use client";

import { useState } from "react";

import { Button } from "@/components/primitives/button";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { TextInput } from "@/components/primitives/text-input";
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
    maximumFractionDigits: 2
  }).format(value);
}

function getErrorMessage(issues: ValidationIssue[], field: string) {
  return issues.find((issue) => issue.field === field)?.message;
}

export function PersonalLoanCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  const validation = parseSimpleLoanInput(inputs);
  const result = validation.ok
    ? calculatePersonalLoan({
        principal: validation.data.principal.value,
        annualRatePct: validation.data.annualRatePct,
        tenureMonths: validation.data.tenureMonths
      })
    : null;

  const validationIssues = validation.ok ? [] : validation.issues;

  return (
    <section className="calculator-shell">
      <div className="calculator-shell__form">
        <TextInput
          id="personal-loan-principal"
          label="Loan amount"
          value={inputs.principal}
          onChange={(event) => setInputs((current) => ({ ...current, principal: event.target.value }))}
        />
        <TextInput
          id="personal-loan-rate"
          label="Annual interest rate"
          value={inputs.annualRatePct}
          onChange={(event) => setInputs((current) => ({ ...current, annualRatePct: event.target.value }))}
        />
        <TextInput
          id="personal-loan-tenure"
          label="Tenure in months"
          value={inputs.tenureMonths}
          onChange={(event) => setInputs((current) => ({ ...current, tenureMonths: event.target.value }))}
        />

        <Button>Calculate now</Button>

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
            <ResultSummaryCard label="Monthly EMI" value={formatCurrency(result.monthlyEmi.value)} tone="positive" />
            <ResultSummaryCard
              label="Total repayment"
              value={formatCurrency(result.totalRepayment.value)}
            />
            <ResultSummaryCard
              label="Total interest"
              value={formatCurrency(result.totalInterest.value)}
              tone="caution"
            />
          </>
        ) : null}
      </div>
    </section>
  );
}
