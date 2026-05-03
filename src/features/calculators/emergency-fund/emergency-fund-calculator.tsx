import { useMemo } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateEmergencyFund } from "@/lib/calculations/emergency-fund/emergency-fund";

const FMT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmt = (v: number) => FMT.format(v);

export function EmergencyFundCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("emergency-fund", {
    monthlyExpenses:     "30000",
    targetMonths:        "6",
    currentSavings:      "50000",
    monthlyContribution: "5000",
  });

  const result = useMemo(() => {
    const me = Number(inputs.monthlyExpenses);
    const tm = Number(inputs.targetMonths);
    const cs = Number(inputs.currentSavings);
    const mc = Number(inputs.monthlyContribution);
    if (me <= 0 || tm <= 0) return null;
    return calculateEmergencyFund({ monthlyExpenses: me, targetMonths: tm, currentSavings: cs, monthlyContribution: mc });
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return [
      "Emergency Fund Summary — India Money Toolkit",
      `Monthly expenses: ${fmt(Number(inputs.monthlyExpenses))}`,
      `Target: ${inputs.targetMonths} months`,
      `Current savings: ${fmt(Number(inputs.currentSavings))}`,
      `Monthly contribution: ${fmt(Number(inputs.monthlyContribution))}`,
      `Required fund: ${fmt(result.requiredFund)}`,
      result.hasSurplus ? `Surplus: ${fmt(result.surplus)}` : `Shortfall: ${fmt(result.shortfall)}`,
      result.monthsToTarget !== null ? `Months to target: ${result.monthsToTarget}` : "",
      "",
      "Calculate yours: https://indiamoneytoolkit.com/calculators/emergency-fund",
    ].filter(Boolean).join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🛡️ Emergency fund calculator</p>
          <h2>Your safety buffer goal</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", marginTop: "2px" }}>
            Rule of thumb: 3–6 months of expenses. Aim for 6+ if self-employed or single income.
          </p>
        </div>
        <div className="calculator-grid">
          <SliderInput
            id="ef-monthly-expenses"
            label="Monthly essential expenses (₹)"
            value={inputs.monthlyExpenses}
            onChange={(e) => setInputs((c) => ({ ...c, monthlyExpenses: e.target.value }))}
            min={5_000} max={500_000} step={1_000}
            hint="Include rent, EMIs, groceries, utilities — exclude savings"
          />
          <SliderInput
            id="ef-target-months"
            label="Target months of coverage"
            value={inputs.targetMonths}
            onChange={(e) => setInputs((c) => ({ ...c, targetMonths: e.target.value }))}
            min={1} max={24} step={1}
          />
          <SliderInput
            id="ef-current-savings"
            label="Current emergency savings (₹)"
            value={inputs.currentSavings}
            onChange={(e) => setInputs((c) => ({ ...c, currentSavings: e.target.value }))}
            min={0} max={5_000_000} step={5_000}
          />
          <SliderInput
            id="ef-monthly-contribution"
            label="Monthly contribution towards goal (₹)"
            value={inputs.monthlyContribution}
            onChange={(e) => setInputs((c) => ({ ...c, monthlyContribution: e.target.value }))}
            min={0} max={200_000} step={500}
            hint="Set to ₹0 to skip time-to-target estimate"
          />
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Required emergency fund"
            value={fmt(result.requiredFund)}
            sublabel={`${inputs.targetMonths} months × ${fmt(Number(inputs.monthlyExpenses))}/month`}
            tone={result.hasSurplus ? "positive" : "default"}
          />

          <BreakdownBar
            valueA={Number(inputs.currentSavings)}
            valueB={Math.max(0, result.shortfall)}
            labelA="Saved"
            labelB={result.hasSurplus ? "Surplus" : "Still needed"}
            colorA="green"
            colorB={result.hasSurplus ? "muted" : "amber"}
            formattedA={fmt(Number(inputs.currentSavings))}
            formattedB={result.hasSurplus ? fmt(result.surplus) : fmt(result.shortfall)}
          />

          <div className="calculator-metric-grid">
            {result.hasSurplus ? (
              <ResultSummaryCard
                label="Current surplus"
                caption="Your savings exceed the target"
                value={fmt(result.surplus)}
                tone="positive"
              />
            ) : (
              <ResultSummaryCard
                label="Shortfall"
                caption="Amount still needed"
                value={fmt(result.shortfall)}
                tone="caution"
              />
            )}
            {result.monthsToTarget !== null && (
              <ResultSummaryCard
                label="Months to reach target"
                caption={`Contributing ${fmt(Number(inputs.monthlyContribution))}/month`}
                value={`${result.monthsToTarget} months`}
                tone="positive"
              />
            )}
          </div>

          <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <WhatsAppShareButton getText={getSummaryText} />
            <CopySummaryButton getText={getSummaryText} />
          </div>
          <p style={{ padding: "0 22px 14px", fontSize: "0.75rem", color: "var(--text-3)" }}>
            Required fund = monthly expenses × target months. Estimates only.
          </p>
        </div>
      )}
    </section>
  );
}
