import { useMemo } from "react";
import { SliderInput } from "@/components/primitives/slider-input";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

type Slab = { from: number; to: number; rate: number };

function slabTax(income: number, slabs: Slab[]): number {
  let tax = 0;
  for (const s of slabs) {
    if (income <= s.from) break;
    tax += (Math.min(income, s.to) - s.from) * s.rate / 100;
  }
  return tax;
}

function addSurchargeAndCess(baseTax: number, gross: number, capAt25 = false): number {
  let sr = 0;
  if (gross > 50_000_000) sr = capAt25 ? 25 : 37;
  else if (gross > 20_000_000) sr = 25;
  else if (gross > 10_000_000) sr = 15;
  else if (gross > 5_000_000) sr = 10;
  const surcharge = baseTax * sr / 100;
  const cess = (baseTax + surcharge) * 0.04;
  return Math.round(baseTax + surcharge + cess);
}

const NEW_SLABS: Slab[] = [
  { from: 0,         to: 400_000,   rate: 0  },
  { from: 400_000,   to: 800_000,   rate: 5  },
  { from: 800_000,   to: 1_200_000, rate: 10 },
  { from: 1_200_000, to: 1_600_000, rate: 15 },
  { from: 1_600_000, to: 2_000_000, rate: 20 },
  { from: 2_000_000, to: 2_400_000, rate: 25 },
  { from: 2_400_000, to: Infinity,  rate: 30 },
];

const OLD_SLABS: Slab[] = [
  { from: 0,         to: 250_000,  rate: 0  },
  { from: 250_000,   to: 500_000,  rate: 5  },
  { from: 500_000,   to: 1_000_000, rate: 20 },
  { from: 1_000_000, to: Infinity, rate: 30 },
];

function calcNew(gross: number) {
  const taxable = Math.max(0, gross - 75_000);
  let base = slabTax(taxable, NEW_SLABS);
  if (taxable <= 1_200_000) base = Math.max(0, base - 60_000);
  return { tax: addSurchargeAndCess(base, gross, true), taxable };
}

function calcOld(gross: number, ded: {
  c80: number; d80: number; hra: number; homeLoan: number; nps: number;
}) {
  const totalDed = 50_000
    + Math.min(150_000, ded.c80)
    + Math.min(100_000, ded.d80)
    + ded.hra
    + Math.min(200_000, ded.homeLoan)
    + Math.min(50_000, ded.nps);
  const taxable = Math.max(0, gross - totalDed);
  let base = slabTax(taxable, OLD_SLABS);
  if (taxable <= 500_000) base = Math.max(0, base - 12_500);
  return { tax: addSurchargeAndCess(base, gross, false), taxable, totalDed };
}

export function IncomeTaxCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("income-tax", {
    grossIncome: "1200000",
    deduction80C: "150000",
    deduction80D: "25000",
    hraExemption: "0",
    homeLoanInterest: "0",
    nps80CCD: "0",
    showDeductions: "true",
  });

  const result = useMemo(() => {
    const gross = Number(inputs.grossIncome);
    if (gross <= 0) return null;
    const newRes = calcNew(gross);
    const oldRes = calcOld(gross, {
      c80: Number(inputs.deduction80C),
      d80: Number(inputs.deduction80D),
      hra: Number(inputs.hraExemption),
      homeLoan: Number(inputs.homeLoanInterest),
      nps: Number(inputs.nps80CCD),
    });
    const saving = Math.abs(newRes.tax - oldRes.tax);
    const betterRegime = newRes.tax <= oldRes.tax ? "New" : "Old";
    return {
      newTax: newRes.tax,
      oldTax: oldRes.tax,
      newTaxable: newRes.taxable,
      oldTaxable: oldRes.taxable,
      totalOldDed: oldRes.totalDed,
      saving,
      betterRegime,
      gross,
    };
  }, [inputs]);

  const showDed = inputs.showDeductions === "true";

  function getSummaryText() {
    if (!result) return "";
    return (
      `🧾 Income Tax FY 2025-26 — India Money Toolkit\n` +
      `Gross income: ${fmt(result.gross)}\n` +
      `New Regime tax: ${fmt(result.newTax)} (taxable: ${fmt(result.newTaxable)})\n` +
      `Old Regime tax: ${fmt(result.oldTax)} (taxable: ${fmt(result.oldTaxable)})\n` +
      `💡 ${result.betterRegime} Regime saves you ${fmt(result.saving)}\n` +
      `https://indiamoneytoolkit.com/calculators/income-tax`
    );
  }

  return (
    <section className="calculator-shell">
      {/* ── Form ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🧾 Income tax calculator</p>
          <h2>Old vs New Regime — FY 2025-26</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            Budget 2025 slabs · Standard deduction included · Surcharge + 4% cess applied.
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="it-income"
            label="Gross annual income (₹)"
            value={inputs.grossIncome}
            min={300000}
            max={10000000}
            step={50000}
            onChange={(e) => setInputs((c) => ({ ...c, grossIncome: e.target.value }))}
          />
        </div>

        {/* Old regime deductions toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="it-show-ded"
            checked={showDed}
            onChange={(e) => setInputs((c) => ({ ...c, showDeductions: e.target.checked ? "true" : "false" }))}
            style={{ width: "17px", height: "17px", accentColor: "var(--blue)", flexShrink: 0, cursor: "pointer" }}
          />
          <label className="field__label" htmlFor="it-show-ded" style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}>
            Add old regime deductions (80C, HRA, home loan…)
          </label>
        </div>

        {showDed && (
          <div className="calculator-grid">
            <SliderInput
              id="it-80c"
              label="Section 80C (₹)"
              value={inputs.deduction80C}
              min={0}
              max={150000}
              step={5000}
              hint="PF, PPF, ELSS, LIC, tuition fees — max ₹1.5L"
              onChange={(e) => setInputs((c) => ({ ...c, deduction80C: e.target.value }))}
            />
            <SliderInput
              id="it-80d"
              label="Section 80D health insurance (₹)"
              value={inputs.deduction80D}
              min={0}
              max={100000}
              step={5000}
              hint="Self + family ₹25k; senior parents adds ₹50k"
              onChange={(e) => setInputs((c) => ({ ...c, deduction80D: e.target.value }))}
            />
            <SliderInput
              id="it-hra"
              label="HRA exemption (₹)"
              value={inputs.hraExemption}
              min={0}
              max={1200000}
              step={12000}
              hint="Use the HRA calculator to find your exempt amount"
              onChange={(e) => setInputs((c) => ({ ...c, hraExemption: e.target.value }))}
            />
            <SliderInput
              id="it-homeloan"
              label="Home loan interest Sec 24b (₹)"
              value={inputs.homeLoanInterest}
              min={0}
              max={300000}
              step={10000}
              hint="Self-occupied property — max ₹2L"
              onChange={(e) => setInputs((c) => ({ ...c, homeLoanInterest: e.target.value }))}
            />
            <SliderInput
              id="it-nps"
              label="NPS 80CCD(1B) (₹)"
              value={inputs.nps80CCD}
              min={0}
              max={50000}
              step={5000}
              hint="Extra ₹50k deduction over and above 80C limit"
              onChange={(e) => setInputs((c) => ({ ...c, nps80CCD: e.target.value }))}
            />
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label={`${result.betterRegime} Regime saves more`}
            value={fmt(result.saving)}
            sublabel={`Choose ${result.betterRegime} Regime — pay ${fmt(result.saving)} less tax this year`}
            tone={result.saving > 0 ? "positive" : "default"}
          />

          {/* Side-by-side comparison */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderBottom: "1px solid var(--border-sub)",
          }}>
            {[
              { label: "Old Regime", tax: result.oldTax, taxable: result.oldTaxable, isBetter: result.betterRegime === "Old" },
              { label: "New Regime", tax: result.newTax, taxable: result.newTaxable, isBetter: result.betterRegime === "New" },
            ].map((r, i) => (
              <div
                key={r.label}
                style={{
                  padding: "20px 22px",
                  borderRight: i === 0 ? "1px solid var(--border-sub)" : undefined,
                  background: r.isBetter ? "var(--green-dim)" : undefined,
                }}
              >
                <p style={{
                  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em",
                  textTransform: "uppercase", color: "var(--text-3)", marginBottom: "8px",
                }}>
                  {r.label}{r.isBetter ? " ✓ Better" : ""}
                </p>
                <p style={{
                  fontSize: "1.7rem", fontWeight: 800, letterSpacing: "-0.04em",
                  color: r.isBetter ? "var(--green)" : "var(--text)",
                  marginBottom: "6px",
                }}>
                  {fmt(r.tax)}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-3)" }}>
                  Effective: {result.gross > 0 ? (r.tax / result.gross * 100).toFixed(1) : 0}%
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-4)", marginTop: "3px" }}>
                  Taxable income: {fmt(r.taxable)}
                </p>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{ padding: "12px 26px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.6 }}>
              Old regime includes ₹50k std deduction
              {showDed ? ` + ₹${((result.totalOldDed - 50000) / 1000).toFixed(0)}k other deductions` : ""}.
              New regime includes ₹75k std deduction. No other deductions in new regime.
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
