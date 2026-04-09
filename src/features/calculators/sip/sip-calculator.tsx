"use client";

import { useMemo, useState, type FormEvent } from "react";

import { Button } from "@/components/primitives/button";
import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { TextInput } from "@/components/primitives/text-input";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateSip, type SipResult } from "@/lib/calculations/sip/calculate-sip";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function toNumber(value: string) {
  return Number(value);
}

export function SipCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("sip", {
    monthlyContribution: "10000",
    annualReturnPct: "12",
    durationMonths: "24"
  });
  const [result, setResult] = useState<SipResult | null>(null);

  const assumptions = useMemo(
    () => "We assume you invest the same amount every month and keep the return rate steady.",
    []
  );

  function handleCalculate(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    setResult(
      calculateSip({
        monthlyContribution: toNumber(inputs.monthlyContribution),
        annualReturnPct: toNumber(inputs.annualReturnPct),
        durationMonths: toNumber(inputs.durationMonths)
      })
    );
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">SIP calculator</p>
          <h2>Plan monthly investments with confidence</h2>
          <p className="hero-copy">{assumptions}</p>
        </div>

        <form className="calculator-grid" onSubmit={handleCalculate}>
          <TextInput
            id="sip-monthly-contribution"
            label="Monthly contribution"
            value={inputs.monthlyContribution}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                monthlyContribution: event.target.value
              }))
            }
            inputMode="decimal"
            type="number"
            step="any"
            min="0"
          />
          <TextInput
            id="sip-annual-return"
            label="Expected annual return"
            value={inputs.annualReturnPct}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                annualReturnPct: event.target.value
              }))
            }
            inputMode="decimal"
            type="number"
            step="any"
            min="0"
          />
          <TextInput
            id="sip-duration-months"
            label="Duration in months"
            value={inputs.durationMonths}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                durationMonths: event.target.value
              }))
            }
            inputMode="numeric"
            type="number"
            step="1"
            min="1"
          />

          <Button type="submit">Calculate SIP</Button>
        </form>
      </div>

      {result ? (
        <div className="calculator-results">
          <ResultInsightPanel
            title="What this means for your investing goal"
            summary={`If returns stay steady, your money could grow to ${formatCurrency(result.maturityValue.value)} over ${inputs.durationMonths} months.`}
            supportingPoints={[
              `Your own invested amount would be ${formatCurrency(result.investedAmount.value)}.`,
              `The projected gain would be ${formatCurrency(result.estimatedReturns.value)}.`
            ]}
          />
          <div className="calculator-metric-grid">
            <ResultSummaryCard
              caption="Your money contributed"
              label="Invested amount"
              value={formatCurrency(result.investedAmount.value)}
            />
            <ResultSummaryCard
              caption="Projected growth on top of your contributions"
              label="Estimated returns"
              value={formatCurrency(result.estimatedReturns.value)}
              tone="positive"
            />
            <ResultSummaryCard
              caption="Total projected value at the end"
              label="Maturity value"
              value={formatCurrency(result.maturityValue.value)}
              tone="positive"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
