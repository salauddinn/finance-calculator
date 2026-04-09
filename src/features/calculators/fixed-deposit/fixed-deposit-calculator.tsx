"use client";

import { useMemo } from "react";

import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import {
  calculateFixedDeposit,
  type CompoundingFrequency
} from "@/lib/calculations/fixed-deposit/fixed-deposit";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value);
}

export function FixedDepositCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("fixed-deposit", {
    depositAmount: "100000",
    annualRatePct: "7.5",
    tenureMonths: "24",
    compoundingFrequency: "yearly"
  });

  const result = useMemo(
    () =>
      calculateFixedDeposit({
        depositAmount: Number(inputs.depositAmount),
        annualRatePct: Number(inputs.annualRatePct),
        tenureMonths: Number(inputs.tenureMonths),
        compoundingFrequency: inputs.compoundingFrequency as CompoundingFrequency
      }),
    [inputs]
  );

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Fixed deposit calculator</p>
          <h2>See your maturity amount without guesswork</h2>
          <p className="hero-copy">
            Fixed deposits are often chosen for predictability, so the result
            should be just as easy to read.
          </p>
        </div>

        <div className="calculator-grid">
          <div className="field">
            <label className="field__label" htmlFor="fd-deposit">
              Deposit amount
            </label>
            <input
              id="fd-deposit"
              className="text-input"
              value={inputs.depositAmount}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  depositAmount: event.target.value
                }))
              }
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="fd-rate">
              Annual rate
            </label>
            <input
              id="fd-rate"
              className="text-input"
              value={inputs.annualRatePct}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  annualRatePct: event.target.value
                }))
              }
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="fd-tenure">
              Tenure in months
            </label>
            <input
              id="fd-tenure"
              className="text-input"
              value={inputs.tenureMonths}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  tenureMonths: event.target.value
                }))
              }
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="fd-compounding">
              Compounding frequency
            </label>
            <select
              id="fd-compounding"
              className="text-input"
              value={inputs.compoundingFrequency}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  compoundingFrequency: event.target.value
                }))
              }
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      <div className="calculator-results">
        <ResultInsightPanel
          title="What this fixed deposit gives you"
          summary="You keep your original deposit protected while earning a fixed return over the selected period."
          supportingPoints={[
            `Your deposit could grow to ${formatCurrency(result.maturityValue)} by maturity.`,
            `That means ${formatCurrency(result.interestEarned)} would come purely from interest.`
          ]}
        />
        <div className="calculator-metric-grid">
          <ResultSummaryCard
            caption="Amount you receive at maturity"
            label="Maturity value"
            value={formatCurrency(result.maturityValue)}
            valueTestId="fd-maturity-value"
            tone="positive"
          />
          <ResultSummaryCard
            caption="Return earned above your original deposit"
            label="Interest earned"
            value={formatCurrency(result.interestEarned)}
          />
        </div>
      </div>
    </section>
  );
}
