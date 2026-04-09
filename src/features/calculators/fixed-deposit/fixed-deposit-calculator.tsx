"use client";

import { useMemo } from "react";

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
    <section className="fixed-deposit-calculator">
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

      <article className="result-summary-card" aria-live="polite">
        <p className="result-summary-card__label">Maturity value</p>
        <p className="result-summary-card__value" data-testid="fd-maturity-value">
          {formatCurrency(result.maturityValue)}
        </p>
        <p className="result-summary-card__label">Interest earned</p>
        <p className="result-summary-card__value">
          {formatCurrency(result.interestEarned)}
        </p>
      </article>
    </section>
  );
}
