import { useMemo, useState } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculatePpf } from "@/lib/calculations/ppf/calculate-ppf";

const FMT = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
});
const fmt = (v: number) => FMT.format(v);

const CURRENT_PPF_RATE = 7.1;

export function PpfCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("ppf", {
    annualContribution: "60000",
    extensionYears: "0",
  });
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () =>
      calculatePpf({
        annualContribution: Number(inputs.annualContribution),
        interestRatePct: CURRENT_PPF_RATE,
        years: 15,
        extensionYears: Number(inputs.extensionYears),
      }),
    [inputs]
  );

  const totalYears = 15 + Number(inputs.extensionYears);

  function getSummaryText() {
    return [
      "PPF Calculator Summary — India Money Toolkit",
      `Annual contribution: ${fmt(Number(inputs.annualContribution))}`,
      `Interest rate: ${CURRENT_PPF_RATE}% p.a. (current rate)`,
      `Duration: ${totalYears} years (15y lock-in${Number(inputs.extensionYears) > 0 ? ` + ${inputs.extensionYears}y extension` : ""})`,
      `Total invested: ${fmt(result.totalInvested)}`,
      `Total interest earned: ${fmt(result.totalInterest)}`,
      `Maturity value: ${fmt(result.maturityValue)}`,
      "Estimates only. PPF rate is subject to quarterly review.",
      "https://indiamoneytoolkit.com/calculators/ppf",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🏛️ PPF calculator</p>
          <h2>15-year wealth builder</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", marginTop: "2px" }}>
            Current PPF interest rate: <strong>{CURRENT_PPF_RATE}% p.a.</strong> (Q1 FY25–26) · EEE tax status
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="ppf-contribution"
            label="Annual contribution (₹)"
            value={inputs.annualContribution}
            onChange={(e) => setInputs((c) => ({ ...c, annualContribution: e.target.value }))}
            min={500}
            max={150_000}
            step={500}
            hint="Max ₹1,50,000 per financial year · Fully tax-free (80C + EEE)"
          />
          <SliderInput
            id="ppf-extension"
            label="Extension after 15 years (years)"
            value={inputs.extensionYears}
            onChange={(e) => setInputs((c) => ({ ...c, extensionYears: e.target.value }))}
            min={0}
            max={20}
            step={5}
            hint="Extensions in 5-year blocks with or without contributions"
          />
        </div>
      </div>

      {/* ── Results ── */}
      <div className="calculator-results">
        <ResultSummaryCard
          isHero
          label="Maturity value"
          value={fmt(result.maturityValue)}
          sublabel={`After ${totalYears} years · ${fmt(Number(inputs.annualContribution))}/year`}
          tone="positive"
        />

        <BreakdownBar
          valueA={result.totalInvested}
          valueB={result.totalInterest}
          labelA="Invested"
          labelB="Interest"
          colorA="blue"
          colorB="amber"
          formattedA={fmt(result.totalInvested)}
          formattedB={fmt(result.totalInterest)}
        />

        <div className="calculator-metric-grid">
          <ResultSummaryCard
            label="Total invested"
            caption={`${Math.min(15, totalYears)} years × ${fmt(Number(inputs.annualContribution))}`}
            value={fmt(result.totalInvested)}
          />
          <ResultSummaryCard
            label="Interest earned"
            caption={`At ${CURRENT_PPF_RATE}% p.a. compounded annually`}
            value={fmt(result.totalInterest)}
            tone="positive"
          />
        </div>

        {/* Year-by-year table toggle */}
        <div style={{ padding: "0 22px 4px" }}>
          <button
            type="button"
            className="amort-toggle"
            onClick={() => setShowTable((s) => !s)}
            aria-expanded={showTable}
          >
            {showTable ? "▲ Hide" : "▼ Show"} year-by-year breakdown
          </button>
        </div>

        {showTable && (
          <div className="amort-table-wrap">
            <table className="amort-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Contribution</th>
                  <th>Interest</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{row.contribution > 0 ? fmt(row.contribution) : "—"}</td>
                    <td>{fmt(row.interestEarned)}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <WhatsAppShareButton getText={getSummaryText} />
          <CopySummaryButton getText={getSummaryText} />
        </div>

        <p style={{ padding: "0 22px 14px", fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.5 }}>
          PPF rate is set by the Government of India each quarter. Currently {CURRENT_PPF_RATE}% p.a. for Q1 FY2025–26. Results are estimates.
        </p>
      </div>
    </section>
  );
}
