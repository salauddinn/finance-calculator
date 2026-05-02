import { useMemo, useState } from "react";
import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
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
    const lines = [
      "Emergency Fund Summary",
      `Monthly expenses: ${fmt(Number(monthlyExpenses))}`,
      `Target months: ${targetMonths}`,
      `Current savings: ${fmt(Number(currentSavings))}`,
      `Monthly contribution: ${fmt(Number(monthlyContribution))}`,
      `Required fund: ${fmt(result.requiredFund)}`,
      result.hasSurplus ? `Surplus: ${fmt(result.surplus)}` : `Shortfall: ${fmt(result.shortfall)}`,
      result.monthsToTarget !== null ? `Months to reach target: ${result.monthsToTarget}` : "",
      "Results are estimates. Verify with a financial advisor."
    ].filter(Boolean);
    return lines.join("\n");
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Emergency fund calculator</p>
          <h2>Know exactly how much buffer you need</h2>
          <p className="hero-copy">
            We calculate your target fund based on monthly essential expenses and show how long it will take to build it.
          </p>
        </div>
        <div className="calculator-grid">
          <SliderInput
            id="ef-monthly-expenses"
            label="Monthly essential expenses (₹)"
            value={monthlyExpenses}
            onChange={e => setMonthlyExpenses(e.target.value)}
            min={5000} max={500000} step={1000}
          />
          <SliderInput
            id="ef-target-months"
            label="Target months of coverage"
            value={targetMonths}
            onChange={e => setTargetMonths(e.target.value)}
            min={1} max={24} step={1}
          />
          <SliderInput
            id="ef-current-savings"
            label="Current emergency savings (₹)"
            value={currentSavings}
            onChange={e => setCurrentSavings(e.target.value)}
            min={0} max={5000000} step={5000}
          />
          <SliderInput
            id="ef-monthly-contribution"
            label="Monthly contribution towards goal (₹)"
            value={monthlyContribution}
            onChange={e => setMonthlyContribution(e.target.value)}
            min={0} max={200000} step={500}
            hint="Leave at 0 to skip the time-to-target estimate"
          />
        </div>
      </div>

      {result && (
        <div className="calculator-results">
          <ResultInsightPanel
            title={result.hasSurplus ? "You already have a comfortable buffer" : "Here is your savings gap and timeline"}
            summary={
              result.hasSurplus
                ? `Your current savings cover your target. You have a surplus of ${fmt(result.surplus)}.`
                : `You need ${fmt(result.requiredFund)} to cover ${targetMonths} months of expenses. You are ${fmt(result.shortfall)} short.`
            }
            supportingPoints={
              result.monthsToTarget !== null
                ? [`At your current contribution rate, you will reach the target in ${result.monthsToTarget} months.`]
                : []
            }
          />
          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Required emergency fund"
              caption={`${targetMonths} months × ${fmt(Number(monthlyExpenses))}`}
              value={fmt(result.requiredFund)}
            />
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
                caption="Amount still needed to reach target"
                value={fmt(result.shortfall)}
                tone="caution"
              />
            )}
            {result.monthsToTarget !== null && (
              <ResultSummaryCard
                label="Months to reach target"
                caption={`Contributing ${fmt(Number(monthlyContribution))} per month`}
                value={`${result.monthsToTarget} months`}
                tone="positive"
              />
            )}
          </div>
          <div style={{ marginTop: "1rem" }}>
            <CopySummaryButton getText={getSummaryText} />
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted, #888)", marginTop: "0.5rem" }}>
            Formula: Required fund = monthly expenses × target months. Results are estimates.
          </p>
        </div>
      )}
    </section>
  );
}
