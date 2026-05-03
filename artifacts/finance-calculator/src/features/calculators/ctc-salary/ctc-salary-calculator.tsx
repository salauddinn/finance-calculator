import { useMemo } from "react";
import { calculateCtcSalary } from "@/lib/calculations/ctc-salary/ctc-salary-engine";
import { SliderInput } from "@/components/primitives/slider-input";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

export function CtcSalaryCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("ctc-salary", {
    annualCtc: "1200000",
    basicPct: "40",
    metroCityHra: "true",
    profTaxAnnual: "2400",
  });

  const result = useMemo(() => {
    const annualCtc = Number(inputs.annualCtc);
    const basicPct = Number(inputs.basicPct);
    const isMetroCity = inputs.metroCityHra === "true";
    const profTaxAnnual = Number(inputs.profTaxAnnual);
    if (annualCtc <= 0) return null;
    return calculateCtcSalary({ annualCtc, basicPct, isMetroCity, profTaxAnnual });
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return (
      `💼 CTC to Take-home — India Money Toolkit\n` +
      `Annual CTC: ${fmt(Number(inputs.annualCtc))}\n` +
      `Monthly gross: ${fmt(result.monthlyGross)}\n` +
      `  PF (employee): ${fmt(result.monthlyPf)}/mo\n` +
      `  TDS (income tax): ${fmt(result.monthlyTds)}/mo\n` +
      `Monthly in-hand: ${fmt(result.monthlyTakeHome)}\n` +
      `https://indiamoneytoolkit.com/calculators/ctc-salary`
    );
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">💼 CTC to take-home calculator</p>
          <h2>What's my actual in-hand salary?</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            New Regime tax applied by default. PF ceiling ₹15,000/month basic.
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="ctc-amount"
            label="Annual CTC (₹)"
            value={inputs.annualCtc}
            min={300000}
            max={10000000}
            step={50000}
            onChange={(e) => setInputs((c) => ({ ...c, annualCtc: e.target.value }))}
          />
          <SliderInput
            id="ctc-basic"
            label="Basic as % of CTC"
            value={inputs.basicPct}
            min={30}
            max={60}
            step={5}
            hint="Typically 30–50% in private sector"
            onChange={(e) => setInputs((c) => ({ ...c, basicPct: e.target.value }))}
          />
          <SliderInput
            id="ctc-proftax"
            label="Professional tax (₹/year)"
            value={inputs.profTaxAnnual}
            min={0}
            max={2500}
            step={200}
            hint="₹2,400/year in most states (₹0 in some states)"
            onChange={(e) => setInputs((c) => ({ ...c, profTaxAnnual: e.target.value }))}
          />
        </div>

        {/* Metro city toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="ctc-metro"
            checked={inputs.metroCityHra === "true"}
            onChange={(e) => setInputs((c) => ({ ...c, metroCityHra: e.target.checked ? "true" : "false" }))}
            style={{ width: "17px", height: "17px", accentColor: "var(--blue)", flexShrink: 0, cursor: "pointer" }}
          />
          <label className="field__label" htmlFor="ctc-metro" style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}>
            Metro city (HRA = 50% of basic; non-metro = 40%)
          </label>
        </div>
      </div>

      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Monthly in-hand salary"
            value={fmt(result.monthlyTakeHome)}
            sublabel={`After PF, TDS & prof tax · Annual take-home: ${fmt(result.annualTakeHome)}`}
            tone="positive"
          />

          <BreakdownBar
            valueA={result.annualTakeHome}
            valueB={result.totalMonthlyDeductions * 12}
            labelA="Take-home"
            labelB="Deductions"
            colorA="green"
            colorB="amber"
            formattedA={fmt(result.annualTakeHome)}
            formattedB={fmt(result.totalMonthlyDeductions * 12)}
          />

          {/* Monthly gross breakdown */}
          <div style={{ padding: "18px 26px 6px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "12px" }}>
              Monthly gross — {fmt(result.monthlyGross)}
            </p>
            <div className="calculator-metric-grid" style={{ marginBottom: 0 }}>
              <ResultSummaryCard label="Basic" caption="Base pay" value={fmt(result.basic)} />
              <ResultSummaryCard label="HRA" caption="House rent allowance" value={fmt(result.hra)} />
              <ResultSummaryCard label="Other allowances" caption="Special / conveyance" value={fmt(result.otherAllowances)} />
            </div>
          </div>

          {/* Monthly deductions */}
          <div style={{ padding: "18px 26px 6px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "12px" }}>
              Monthly deductions
            </p>
            <div className="calculator-metric-grid" style={{ marginBottom: 0 }}>
              <ResultSummaryCard label="PF (employee)" caption="12% of basic, max ₹15k/mo" value={fmt(result.monthlyPf)} tone="caution" />
              <ResultSummaryCard label="TDS (income tax)" caption={`Eff. rate: ${result.effectiveTaxRate.toFixed(1)}%`} value={fmt(result.monthlyTds)} tone="caution" />
              <ResultSummaryCard label="Professional tax" caption="State tax" value={fmt(result.monthlyProfTax)} />
            </div>
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
