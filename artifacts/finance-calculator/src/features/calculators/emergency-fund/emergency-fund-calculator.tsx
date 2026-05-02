import { useMemo, useState } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { calculateEmergencyFund } from "@/lib/calculations/emergency-fund/emergency-fund";

const FMT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmt = (v: number) => FMT.format(v);

export function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState("30000");
  const [targetMonths, setTargetMonths] = useState("6");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [monthlyContribution, setMonthlyContribution] = useState("5000");

  const result = useMemo(() => {
    const me = Number(monthlyExpenses);
    const tm = Number(targetMonths);
    const cs = Number(currentSavings);
    const mc = Number(monthlyContribution);
    if (me <= 0 || tm <= 0) return null;
    return calculateEmergencyFund({ monthlyExpenses: me, targetMonths: tm, currentSavings: cs, monthlyContribution: mc });
  }, [monthlyExpenses, targetMonths, currentSavings, monthlyContribution]);

  function getSummaryText() {
    if (!result) return "";
    return [
      "Emergency Fund Summary",
      `Monthly expenses: ${fmt(Number(monthlyExpenses))}`,
      `Target: ${targetMonths} months`,
      `Current savings: ${fmt(Number(currentSavings))}`,
      `Monthly contribution: ${fmt(Number(monthlyContribution))}`,
      `Required fund: ${fmt(result.requiredFund)}`,
      result.hasSurplus ? `Surplus: ${fmt(result.surplus)}` : `Shortfall: ${fmt(result.shortfall)}`,
      result.monthsToTarget !== null ? `Months to target: ${result.monthsToTarget}` : "",
      "Results are estimates only.",
    ].filter(Boolean).join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Emergency fund calculator</p>
          <h2>Your safety buffer goal</h2>
        </div>
        <div className="calculator-grid">
          <SliderInput
            id="ef-monthly-expenses"
            label="Monthly essential expenses (₹)"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(e.target.value)}
            min={5000} max={500000} step={1000}
          />
          <SliderInput
            id="ef-target-months"
            label="Target months of coverage"
            value={targetMonths}
            onChange={(e) => setTargetMonths(e.target.value)}
            min={1} max={24} step={1}
          />
          <SliderInput
            id="ef-current-savings"
            label="Current emergency savings (₹)"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            min={0} max={5000000} step={5000}
          />
          <SliderInput
            id="ef-monthly-contribution"
            label="Monthly contribution towards goal (₹)"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(e.target.value)}
            min={0} max={200000} step={500}
            hint="Set to 0 to skip time-to-target estimate"
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
            sublabel={`${targetMonths} months × ${fmt(Number(monthlyExpenses))}/month`}
          />

          {/* Saved vs still-needed breakdown */}
          <BreakdownBar
            valueA={Number(currentSavings)}
            valueB={Math.max(0, result.shortfall)}
            labelA="Saved"
            labelB={result.hasSurplus ? "Surplus" : "Still needed"}
            colorA="green"
            colorB={result.hasSurplus ? "green" : "amber"}
            formattedA={fmt(Number(currentSavings))}
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
                caption={`Contributing ${fmt(Number(monthlyContribution))}/month`}
                value={`${result.monthsToTarget} months`}
                tone="positive"
              />
            )}
          </div>

          <div className="result-actions" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <CopySummaryButton getText={getSummaryText} />
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
              Required fund = monthly expenses × target months. Estimates only.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
