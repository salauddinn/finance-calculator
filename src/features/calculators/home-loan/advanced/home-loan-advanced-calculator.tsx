

import { useMemo, useState } from "react";

import { Button } from "@/components/primitives/button";
import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateAdvancedHomeLoan } from "@/lib/calculations/home-loan-advanced/home-loan-advanced";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function HomeLoanAdvancedCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("home-loan-advanced", {
    strategy: "keep-emi-adjust-tenure",
    prepaymentAmount: "200000"
  });
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
        strategy: inputs.strategy as
          | "keep-emi-adjust-tenure"
          | "keep-tenure-adjust-emi",
        events: [
          {
            id: "prepay-6",
            monthIndex: 6,
            type: "prepayment",
            amount: {
              value: Number(inputs.prepaymentAmount),
              currency: "INR"
            }
          }
        ]
      }),
    [inputs, refreshKey]
  );

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🏡 Advanced home loan planner</p>
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
              value={inputs.strategy}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  strategy: event.target.value
                }))
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

          <SliderInput
            id="advanced-home-loan-prepayment"
            label="Prepayment amount"
            value={inputs.prepaymentAmount}
            min={0}
            max={5000000}
            step={10000}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                prepaymentAmount: event.target.value
              }))
            }
          />
        </div>

        <Button onClick={() => setRefreshKey((value) => value + 1)}>
          Recalculate advanced plan
        </Button>
      </div>

      <div className="calculator-results">
        <ResultInsightPanel
          title="What this scenario is telling you"
          summary={`With the current events and strategy, your plan lands at about ${formatCurrency(result.finalMonthlyEmi.value)} per month by the end of the scenario.`}
          supportingPoints={[
            `The full repayment path comes to ${formatCurrency(result.totalRepayment.value)}.`,
            `You are contributing ${formatCurrency(result.totalPrepaymentAmount.value)} as planned prepayments.`
          ]}
        />
        <div className="calculator-metric-grid">
          <ResultSummaryCard
            caption="End-state monthly payment"
            label="Final monthly EMI"
            value={formatCurrency(result.finalMonthlyEmi.value)}
            tone="positive"
          />
          <ResultSummaryCard
            caption="Total paid across the modeled journey"
            label="Total repayment"
            value={formatCurrency(result.totalRepayment.value)}
          />
          <ResultSummaryCard
            caption="Extra amount you plan to prepay"
            label="Total prepayment amount"
            value={formatCurrency(result.totalPrepaymentAmount.value)}
            tone="caution"
          />
        </div>
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
