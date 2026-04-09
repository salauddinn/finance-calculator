"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/primitives/button";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { TextInput } from "@/components/primitives/text-input";
import { calculateAdvancedHomeLoan } from "@/lib/calculations/home-loan-advanced/home-loan-advanced";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

export function HomeLoanAdvancedCalculator() {
  const [strategy, setStrategy] = useState<
    "keep-emi-adjust-tenure" | "keep-tenure-adjust-emi"
  >("keep-emi-adjust-tenure");
  const [prepaymentAmount, setPrepaymentAmount] = useState("200000");
  const [refreshKey, setRefreshKey] = useState(0);

  const result = useMemo(
    () =>
      calculateAdvancedHomeLoan({
        principal: {
          value: 4500000,
          currency: "INR"
        },
        annualRatePct: 8.75,
        tenureMonths: 240,
        strategy,
        events: [
          {
            id: "prepay-6",
            monthIndex: 6,
            type: "prepayment",
            amount: {
              value: Number(prepaymentAmount),
              currency: "INR"
            }
          }
        ]
      }),
    [prepaymentAmount, refreshKey, strategy]
  );

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Advanced home loan planner</p>
          <h2>Model events that change repayment over time</h2>
          <p className="hero-copy">
            Layer prepayments, repo-linked rate changes, and moratorium periods
            into one scenario before you commit to a plan.
          </p>
        </div>

        <div className="calculator-grid">
          <div className="field">
            <label className="field__label" htmlFor="advanced-home-loan-strategy">
              Strategy
            </label>
            <select
              id="advanced-home-loan-strategy"
              className="text-input"
              value={strategy}
              onChange={(event) =>
                setStrategy(
                  event.target.value as
                    | "keep-emi-adjust-tenure"
                    | "keep-tenure-adjust-emi"
                )
              }
            >
              <option value="keep-emi-adjust-tenure">
                Keep EMI, adjust tenure
              </option>
              <option value="keep-tenure-adjust-emi">
                Keep tenure, adjust EMI
              </option>
            </select>
          </div>

          <TextInput
            id="advanced-home-loan-prepayment"
            label="Prepayment amount"
            value={prepaymentAmount}
            onChange={(event) => setPrepaymentAmount(event.target.value)}
          />
        </div>

        <Button onClick={() => setRefreshKey((value) => value + 1)}>
          Recalculate advanced plan
        </Button>
      </div>

      <div className="calculator-results">
        <ResultSummaryCard
          label="Final monthly EMI"
          value={formatCurrency(result.finalMonthlyEmi.value)}
          tone="positive"
        />
        <ResultSummaryCard
          label="Total repayment"
          value={formatCurrency(result.totalRepayment.value)}
        />
        <ResultSummaryCard
          label="Total prepayment amount"
          value={formatCurrency(result.totalPrepaymentAmount.value)}
          tone="caution"
        />
      </div>

      <section className="calculator-panel">
        <h3>Impact summary</h3>
        <ul className="impact-summary">
          {result.impactSummary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
