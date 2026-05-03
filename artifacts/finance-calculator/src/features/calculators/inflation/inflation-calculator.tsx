import { useMemo } from "react";
import { SliderInput } from "@/components/primitives/slider-input";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

export function InflationCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("inflation", {
    amount: "100000",
    inflationRate: "6",
    years: "10",
  });

  const result = useMemo(() => {
    const amount = Number(inputs.amount);
    const rate = Number(inputs.inflationRate) / 100;
    const years = Number(inputs.years);
    if (amount <= 0 || rate <= 0 || years <= 0) return null;

    const futureCost = amount * Math.pow(1 + rate, years);
    const realValue = amount / Math.pow(1 + rate, years);
    const purchasingPowerLost = amount - realValue;
    const pctLost = (purchasingPowerLost / amount) * 100;

    return { futureCost, realValue, purchasingPowerLost, pctLost, amount, years, rate };
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return (
      `📉 Inflation Calculator — India Money Toolkit\n` +
      `Amount: ${fmt(result.amount)} · Inflation: ${inputs.inflationRate}% · Years: ${result.years}\n\n` +
      `If prices rise at ${inputs.inflationRate}%/year:\n` +
      `• ${fmt(result.amount)} today → needs ${fmt(result.futureCost)} in ${result.years}y\n` +
      `• Your ₹${result.amount.toLocaleString("en-IN")} buys only ${fmt(result.realValue)} worth in today's terms\n` +
      `• Purchasing power lost: ${result.pctLost.toFixed(1)}%\n` +
      `https://indiamoneytoolkit.com/calculators/inflation`
    );
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">📉 Inflation calculator</p>
          <h2>Real cost of inflation over time</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            India's CPI inflation has averaged 5–7% over the past decade. See how it silently erodes purchasing power.
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="inf-amount"
            label="Amount today (₹)"
            value={inputs.amount}
            min={10000}
            max={10000000}
            step={10000}
            onChange={(e) => setInputs((c) => ({ ...c, amount: e.target.value }))}
          />
          <SliderInput
            id="inf-rate"
            label="Annual inflation rate (%)"
            value={inputs.inflationRate}
            min={1}
            max={15}
            step={0.5}
            hint="India long-run average: ~5–6% CPI | Food inflation often higher"
            onChange={(e) => setInputs((c) => ({ ...c, inflationRate: e.target.value }))}
          />
          <SliderInput
            id="inf-years"
            label="Years into the future"
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
          {/* Primary: purchasing power loss */}
          <ResultSummaryCard
            isHero
            label={`Purchasing power lost in ${result.years} years`}
            value={fmt(result.purchasingPowerLost)}
            sublabel={`${result.pctLost.toFixed(1)}% of value eroded at ${inputs.inflationRate}% inflation — your ₹${Number(inputs.amount).toLocaleString("en-IN")} buys only ${fmt(result.realValue)} worth`}
            tone="caution"
          />

          {/* Two scenarios */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--border-sub)",
          }}>
            {[
              {
                title: `What ${fmt(result.amount)} costs in ${result.years}y`,
                value: fmt(result.futureCost),
                sub: `You'll need ${fmt(result.futureCost)} to buy what costs ${fmt(result.amount)} today`,
                color: "var(--amber)",
              },
              {
                title: `Real value of your money`,
                value: fmt(result.realValue),
                sub: `In today's buying power, ${fmt(result.amount)} will feel like ${fmt(result.realValue)}`,
                color: "var(--text)",
              },
            ].map((item, i) => (
              <div key={i} style={{
                padding: "20px 22px",
                borderRight: i === 0 ? "1px solid var(--border-sub)" : undefined,
              }}>
                <p style={{
                  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase", color: "var(--text-3)", marginBottom: "8px",
                }}>
                  {item.title}
                </p>
                <p style={{
                  fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.04em",
                  color: item.color, marginBottom: "6px",
                }}>
                  {item.value}
                </p>
                <p style={{ fontSize: "0.77rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          <div style={{ padding: "12px 26px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.6 }}>
              💡 To beat inflation, your investments must grow faster than {inputs.inflationRate}% p.a. Equity mutual funds have
              historically delivered 10–14% CAGR over long periods, creating positive real returns.
            </p>
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
