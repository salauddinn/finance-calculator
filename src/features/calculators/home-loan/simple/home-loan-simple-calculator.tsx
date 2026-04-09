"use client";

import Link from "next/link";
import { useState } from "react";

import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { TextInput } from "@/components/primitives/text-input";
import { calculateSimpleHomeLoan } from "@/lib/calculations/home-loan-simple/home-loan-simple";
import {
  parseSimpleLoanInput,
  type ValidationIssue
} from "@/lib/validation/calculator-inputs";

const DEFAULT_INPUTS = {
  principal: "4500000",
  annualRatePct: "8.75",
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

export function HomeLoanSimpleCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  const validation = parseSimpleLoanInput(inputs);
  const result = validation.ok
    ? calculateSimpleHomeLoan({
        principal: validation.data.principal.value,
        annualRatePct: validation.data.annualRatePct,
        tenureMonths: validation.data.tenureMonths
      })
    : null;

  const validationIssues = validation.ok ? [] : validation.issues;

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Home loan calculator</p>
          <h2>Start simple, then move into real-world planning</h2>
          <p className="hero-copy">
            Use simple mode for a quick EMI estimate before exploring
            prepayments, repo-rate changes, and moratoriums in advanced mode.
          </p>
        </div>

        <div className="calculator-grid">
          <TextInput
            id="home-loan-principal"
            label="Home loan amount"
            value={inputs.principal}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                principal: event.target.value
              }))
            }
          />
          <TextInput
            id="home-loan-rate"
            label="Annual interest rate"
            value={inputs.annualRatePct}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                annualRatePct: event.target.value
              }))
            }
          />
          <TextInput
            id="home-loan-tenure"
            label="Tenure in months"
            value={inputs.tenureMonths}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                tenureMonths: event.target.value
              }))
            }
          />
        </div>

        <Link className="back-link" href="/calculators/home-loan?mode=advanced">
          Switch to advanced home loan planner
        </Link>

        {validationIssues.length > 0 ? (
          <p className="calculator-shell__error">
            {getErrorMessage(validationIssues, "principal") ??
              "Enter valid home loan inputs to see EMI results."}
          </p>
        ) : null}
      </div>

      {result ? (
        <div className="calculator-results">
          <ResultSummaryCard
            label="Monthly EMI"
            value={formatCurrency(result.monthlyEmi.value)}
            tone="positive"
          />
          <ResultSummaryCard
            label="Total repayment"
            value={formatCurrency(result.totalRepayment.value)}
          />
          <ResultSummaryCard
            label="Total interest"
            value={formatCurrency(result.totalInterest.value)}
            tone="caution"
          />
        </div>
      ) : null}
    </section>
  );
}
