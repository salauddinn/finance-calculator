import { useMemo } from "react";

import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateSip } from "@/lib/calculations/sip/calculate-sip";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function fmt(value: number) {
  return currencyFormatter.format(value);
}

export function SipCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("sip", {
    monthlyContribution: "10000",
    annualReturnPct: "12",
    durationMonths: "24",
    mode: "simple",
    stepUpPercentage: "0",
    inflationRate: "0",
    taxationEnabled: "false",
  });

  const isAdvanced = inputs.mode === "advanced";

  const result = useMemo(
    () =>
      calculateSip({
        monthlyContribution: Number(inputs.monthlyContribution),
        annualReturnPct: Number(inputs.annualReturnPct),
        durationMonths: Number(inputs.durationMonths),
        advancedConfig: isAdvanced
          ? {
              stepUpPercentage: Number(inputs.stepUpPercentage),
              inflationRate: Number(inputs.inflationRate),
              taxationEnabled: inputs.taxationEnabled === "true",
            }
          : undefined,
      }),
    [inputs, isAdvanced]
  );

  const months = Number(inputs.durationMonths);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const durationLabel = years > 0
    ? `${years}y${remMonths > 0 ? ` ${remMonths}m` : ""}`
    : `${months}m`;

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div className="calculator-copy">
            <p className="eyebrow">SIP calculator</p>
            <h2>Monthly investment planner</h2>
          </div>
          <ModeToggle
            mode={inputs.mode as "simple" | "advanced"}
            onChange={(mode) => setInputs((c) => ({ ...c, mode }))}
          />
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="sip-monthly"
            label="Monthly contribution (₹)"
            value={inputs.monthlyContribution as string}
            min={500}
            max={500000}
            step={500}
            onChange={(e) => setInputs((c) => ({ ...c, monthlyContribution: e.target.value }))}
          />
          <SliderInput
            id="sip-return"
            label="Expected annual return (%)"
            value={inputs.annualReturnPct as string}
            min={1}
            max={50}
            step={0.5}
            onChange={(e) => setInputs((c) => ({ ...c, annualReturnPct: e.target.value }))}
          />
          <SliderInput
            id="sip-duration"
            label="Duration (months)"
            value={inputs.durationMonths as string}
            min={6}
            max={360}
            step={6}
            onChange={(e) => setInputs((c) => ({ ...c, durationMonths: e.target.value }))}
          />
        </div>

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Advanced options">
            <div className="calculator-grid">
              <SliderInput
                id="sip-step-up"
                label="Annual step-up (%)"
                value={inputs.stepUpPercentage as string}
                min={0} max={50} step={1}
                onChange={(e) => setInputs((c) => ({ ...c, stepUpPercentage: e.target.value }))}
              />
              <SliderInput
                id="sip-inflation"
                label="Inflation rate (%)"
                value={inputs.inflationRate as string}
                min={0} max={15} step={1}
                onChange={(e) => setInputs((c) => ({ ...c, inflationRate: e.target.value }))}
              />
              <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="sip-tax"
                  checked={inputs.taxationEnabled === "true"}
                  onChange={(e) => setInputs((c) => ({ ...c, taxationEnabled: e.target.checked ? "true" : "false" }))}
                  style={{ width: "16px", height: "16px", accentColor: "var(--blue)", flexShrink: 0 }}
                />
                <label className="field__label" htmlFor="sip-tax" style={{ margin: 0 }}>
                  Apply LTCG tax (12.5% on gains)
                </label>
              </div>
            </div>
          </AdvancedOptionsAccordion>
        )}
      </div>

      {/* ── Results ── */}
      {result ? (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Maturity value"
            value={fmt(result.maturityValue.value)}
            sublabel={`After ${durationLabel} · ₹${Number(inputs.monthlyContribution).toLocaleString("en-IN")}/month`}
            tone="positive"
          />

          <BreakdownBar
            valueA={result.investedAmount.value}
            valueB={result.estimatedReturns.value}
            labelA="Invested"
            labelB="Returns"
            colorA="blue"
            colorB="green"
            formattedA={fmt(result.investedAmount.value)}
            formattedB={fmt(result.estimatedReturns.value)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Invested amount"
              caption="Your total contributions"
              value={fmt(result.investedAmount.value)}
            />
            <ResultSummaryCard
              label="Estimated returns"
              caption="Projected growth on top"
              value={fmt(result.estimatedReturns.value)}
              tone="positive"
            />
          </div>

          <div className="result-actions">
            <CopySummaryButton
              getText={() =>
                [
                  "SIP Summary",
                  `Monthly: ${fmt(Number(inputs.monthlyContribution))}`,
                  `Return: ${inputs.annualReturnPct}%`,
                  `Duration: ${inputs.durationMonths} months`,
                  `Invested: ${fmt(result.investedAmount.value)}`,
                  `Returns: ${fmt(result.estimatedReturns.value)}`,
                  `Maturity: ${fmt(result.maturityValue.value)}`,
                  "Estimates only. Actual returns may vary.",
                ].join("\n")
              }
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
