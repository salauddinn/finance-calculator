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

export function LumpsumCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("lumpsum", {
    principal: "500000",
    annualReturnPct: "12",
    years: "10",
  });

  const result = useMemo(() => {
    const p = Number(inputs.principal);
    const r = Number(inputs.annualReturnPct) / 100;
    const n = Number(inputs.years);
    if (p <= 0 || r <= 0 || n <= 0) return null;
    const maturity = p * Math.pow(1 + r, n);
    const gain = maturity - p;
    const multiple = maturity / p;
    return { maturity, gain, principal: p, multiple };
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return (
      `💰 Lumpsum Investment — India Money Toolkit\n` +
      `Principal: ${fmt(result.principal)}\n` +
      `Annual return: ${inputs.annualReturnPct}% for ${inputs.years} years\n` +
      `Maturity value: ${fmt(result.maturity)}\n` +
      `Total gain: ${fmt(result.gain)} (${result.multiple.toFixed(1)}x)\n` +
      `https://indiamoneytoolkit.com/calculators/lumpsum`
    );
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">💰 Lumpsum calculator</p>
          <h2>One-time investment planner</h2>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="ls-principal"
            label="Investment amount (₹)"
            value={inputs.principal}
            min={10000}
            max={10000000}
            step={10000}
            onChange={(e) => setInputs((c) => ({ ...c, principal: e.target.value }))}
          />
          <SliderInput
            id="ls-return"
            label="Expected annual return (%)"
            value={inputs.annualReturnPct}
            min={1}
            max={30}
            step={0.5}
            hint="Equity MFs: 10–14% | FD: 7–8% | PPF: 7.1%"
            onChange={(e) => setInputs((c) => ({ ...c, annualReturnPct: e.target.value }))}
          />
          <SliderInput
            id="ls-years"
            label="Investment period (years)"
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
            label="Maturity value"
            value={fmt(result.maturity)}
            sublabel={`After ${inputs.years}y · ${fmt(result.principal)} at ${inputs.annualReturnPct}% p.a. · ${result.multiple.toFixed(1)}x growth`}
            tone="positive"
          />

          <BreakdownBar
            valueA={result.principal}
            valueB={result.gain}
            labelA="Invested"
            labelB="Gain"
            colorA="blue"
            colorB="green"
            formattedA={fmt(result.principal)}
            formattedB={fmt(result.gain)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Amount invested"
              caption="One-time principal"
              value={fmt(result.principal)}
            />
            <ResultSummaryCard
              label="Total gain"
              caption="Wealth created on top"
              value={fmt(result.gain)}
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
