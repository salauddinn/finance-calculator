import { useMemo, useState } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { calculatePpf } from "@/lib/calculations/ppf/calculate-ppf";

const FMT = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const fmt = (v: number) => FMT.format(v);

const CURRENT_PPF_RATE = 7.1;

export function PpfCalculator() {
  const [annualContribution, setAnnualContribution] = useState("60000");
  const [extensionYears, setExtensionYears] = useState("0");
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () =>
      calculatePpf({
        annualContribution: Number(annualContribution),
        interestRatePct: CURRENT_PPF_RATE,
        years: 15,
        extensionYears: Number(extensionYears),
      }),
    [annualContribution, extensionYears]
  );

  const totalYears = 15 + Number(extensionYears);

  function getSummaryText() {
    return [
      "PPF Calculator Summary",
      `Annual contribution: ${fmt(Number(annualContribution))}`,
      `Interest rate: ${CURRENT_PPF_RATE}% p.a. (current rate)`,
      `Duration: ${totalYears} years (15y lock-in${Number(extensionYears) > 0 ? ` + ${extensionYears}y extension` : ""})`,
      `Total invested: ${fmt(result.totalInvested)}`,
      `Total interest earned: ${fmt(result.totalInterest)}`,
      `Maturity value: ${fmt(result.maturityValue)}`,
      "Estimates only. PPF rate is subject to quarterly review by Government of India.",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">PPF calculator</p>
          <h2>15-year wealth builder</h2>
          <p className="hero-copy" style={{ marginTop: "2px" }}>
            Current PPF interest rate: <strong>{CURRENT_PPF_RATE}% p.a.</strong> (Q1 FY25–26)
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="ppf-contribution"
            label="Annual contribution (₹)"
            value={annualContribution}
            onChange={(e) => setAnnualContribution(e.target.value)}
            min={500}
            max={150000}
            step={500}
            hint="Max allowed: ₹1,50,000 per financial year"
          />
          <SliderInput
            id="ppf-extension"
            label="Extension after 15 years (years)"
            value={extensionYears}
            onChange={(e) => setExtensionYears(e.target.value)}
            min={0}
            max={20}
            step={5}
            hint="Extensions allowed in blocks of 5 years. Interest continues."
          />
        </div>
      </div>

      {/* ── Results ── */}
      <div className="calculator-results">
        <ResultSummaryCard
          isHero
          label="Maturity value"
          value={fmt(result.maturityValue)}
          sublabel={`After ${totalYears} years · ${fmt(Number(annualContribution))}/year`}
          tone="positive"
        />

        <BreakdownBar
          valueA={result.totalInvested}
          valueB={result.totalInterest}
          labelA="Invested"
          labelB="Interest"
          colorA="blue"
          colorB="green"
          formattedA={fmt(result.totalInvested)}
          formattedB={fmt(result.totalInterest)}
        />

        <div className="calculator-metric-grid">
          <ResultSummaryCard
            label="Total invested"
            caption={`${Math.min(15, totalYears)} years × ${fmt(Number(annualContribution))}`}
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
