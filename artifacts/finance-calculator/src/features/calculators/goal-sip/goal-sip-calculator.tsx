import { useMemo } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

export function GoalSipCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("goal-sip", {
    targetAmount: "10000000",
    annualReturnPct: "12",
    years: "10",
  });

  const result = useMemo(() => {
    const fv = Number(inputs.targetAmount);
    const r = Number(inputs.annualReturnPct) / 100 / 12;
    const n = Number(inputs.years) * 12;
    if (fv <= 0 || r <= 0 || n <= 0) return null;
    const monthly = (fv * r) / (Math.pow(1 + r, n) - 1);
    const totalInvested = monthly * n;
    const marketReturns = fv - totalInvested;
    return { monthly, totalInvested, marketReturns, targetAmount: fv };
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return (
      `🎯 Goal SIP — India Money Toolkit\n` +
      `Target: ${fmt(result.targetAmount)} in ${inputs.years} years\n` +
      `Required monthly SIP: ${fmt(result.monthly)}\n` +
      `Total invested: ${fmt(result.totalInvested)}\n` +
      `Market adds: ${fmt(result.marketReturns)}\n` +
      `https://indiamoneytoolkit.com/calculators/goal-sip`
    );
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🎯 Goal SIP calculator</p>
          <h2>How much to invest monthly?</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            Enter your target corpus and we'll work backwards to the monthly SIP you need.
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="gs-target"
            label="Target corpus (₹)"
            value={inputs.targetAmount}
            min={100000}
            max={100000000}
            step={100000}
            hint="Popular goals: ₹50L retirement, ₹1Cr house, ₹25L education"
            onChange={(e) => setInputs((c) => ({ ...c, targetAmount: e.target.value }))}
          />
          <SliderInput
            id="gs-return"
            label="Expected annual return (%)"
            value={inputs.annualReturnPct}
            min={1}
            max={30}
            step={0.5}
            hint="Equity MFs historically: 10–14% long-term"
            onChange={(e) => setInputs((c) => ({ ...c, annualReturnPct: e.target.value }))}
          />
          <SliderInput
            id="gs-years"
            label="Time horizon (years)"
            value={inputs.years}
            min={1}
            max={40}
            step={1}
            onChange={(e) => setInputs((c) => ({ ...c, years: e.target.value }))}
          />
        </div>
      </div>

      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Required monthly SIP"
            value={fmt(result.monthly)}
            sublabel={`To reach ${fmt(result.targetAmount)} in ${inputs.years} years at ${inputs.annualReturnPct}%`}
            tone="positive"
          />

          <BreakdownBar
            valueA={result.totalInvested}
            valueB={result.marketReturns}
            labelA="You invest"
            labelB="Market adds"
            colorA="blue"
            colorB="green"
            formattedA={fmt(result.totalInvested)}
            formattedB={fmt(result.marketReturns)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Total you invest"
              caption="Your contributions over the period"
              value={fmt(result.totalInvested)}
            />
            <ResultSummaryCard
              label="Market adds"
              caption="Growth on top of your investment"
              value={fmt(result.marketReturns)}
              tone="positive"
            />
          </div>

          <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <WhatsAppShareButton getText={getSummaryText} />
            <CopySummaryButton getText={getSummaryText} />
          </div>
        </div>
      )}
    </section>
  );
}
