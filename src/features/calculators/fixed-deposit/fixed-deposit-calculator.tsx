"use client";

import { useMemo, useState } from "react";

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
  const [depositAmount, setDepositAmount] = useState("100000");
  const [annualRatePct, setAnnualRatePct] = useState("7.5");
  const [tenureMonths, setTenureMonths] = useState("24");
  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>("yearly");

  const result = useMemo(
    () =>
      calculateFixedDeposit({
        depositAmount: Number(depositAmount),
        annualRatePct: Number(annualRatePct),
        tenureMonths: Number(tenureMonths),
        compoundingFrequency
      }),
    [annualRatePct, compoundingFrequency, depositAmount, tenureMonths]
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
          value={depositAmount}
          onChange={(event) => setDepositAmount(event.target.value)}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="fd-rate">
          Annual rate
        </label>
        <input
          id="fd-rate"
          className="text-input"
          value={annualRatePct}
          onChange={(event) => setAnnualRatePct(event.target.value)}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="fd-tenure">
          Tenure in months
        </label>
        <input
          id="fd-tenure"
          className="text-input"
          value={tenureMonths}
          onChange={(event) => setTenureMonths(event.target.value)}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="fd-compounding">
          Compounding frequency
        </label>
        <select
          id="fd-compounding"
          className="text-input"
          value={compoundingFrequency}
          onChange={(event) =>
            setCompoundingFrequency(event.target.value as CompoundingFrequency)
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
