import { useMemo } from "react";
import { SliderInput } from "@/components/primitives/slider-input";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;
const fmtPct = (n: number) => `${n.toFixed(1)}%`;

type Slab = { from: number; to: number; rate: number };
type AgeGroup = "below60" | "senior60" | "senior80";

// ── New Regime (Budget 2025) — age-neutral ────────────────────────────────────
const NEW_SLABS: Slab[] = [
  { from: 0,         to:   400_000, rate: 0  },
  { from:   400_000, to:   800_000, rate: 5  },
  { from:   800_000, to: 1_200_000, rate: 10 },
  { from: 1_200_000, to: 1_600_000, rate: 15 },
  { from: 1_600_000, to: 2_000_000, rate: 20 },
  { from: 2_000_000, to: 2_400_000, rate: 25 },
  { from: 2_400_000, to: Infinity,  rate: 30 },
];

// ── Old Regime — basic exemption varies by age ────────────────────────────────
function getOldSlabs(age: AgeGroup): Slab[] {
  if (age === "senior80") return [
    { from:         0, to:   500_000, rate: 0  },  // ₹5L exemption
    { from:   500_000, to: 1_000_000, rate: 20 },
    { from: 1_000_000, to: Infinity,  rate: 30 },
  ];
  if (age === "senior60") return [
    { from:         0, to:   300_000, rate: 0  },  // ₹3L exemption
    { from:   300_000, to:   500_000, rate: 5  },
    { from:   500_000, to: 1_000_000, rate: 20 },
    { from: 1_000_000, to: Infinity,  rate: 30 },
  ];
  return [
    { from:         0, to:   250_000, rate: 0  },  // ₹2.5L exemption
    { from:   250_000, to:   500_000, rate: 5  },
    { from:   500_000, to: 1_000_000, rate: 20 },
    { from: 1_000_000, to: Infinity,  rate: 30 },
  ];
}

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
  if (gross > 50_000_000)      sr = capAt25 ? 25 : 37;
  else if (gross > 20_000_000) sr = 25;
  else if (gross > 10_000_000) sr = 15;
  else if (gross >  5_000_000) sr = 10;
  const surcharge = baseTax * sr / 100;
  const cess = (baseTax + surcharge) * 0.04;
  return Math.round(baseTax + surcharge + cess);
}

function calcNew(gross: number) {
  const stdDed = 75_000;
  const taxable = Math.max(0, gross - stdDed);
  let base = slabTax(taxable, NEW_SLABS);
  // 87A rebate (Budget 2025): taxable ≤ ₹12L → rebate up to ₹60k
  if (taxable <= 1_200_000) base = Math.max(0, base - 60_000);
  // Marginal relief: ensure tax never exceeds income above ₹12.75L threshold
  const threshold = 1_275_000; // ₹12L + ₹75k std ded
  if (gross > threshold && gross < threshold + 200_000 && base > 0) {
    const excess = gross - threshold;
    const cappedBase = Math.min(base, excess);
    base = Math.max(0, cappedBase);
  }
  return { tax: addSurchargeAndCess(base, gross, true), taxable, stdDed };
}

function calcOld(gross: number, age: AgeGroup, ded: {
  c80: number; d80: number; hra: number; homeLoan: number;
  nps: number; tttb: number; edu80E: number; donations80G: number;
}) {
  const slabs = getOldSlabs(age);
  const isSenior = age !== "below60";
  const stdDed = 50_000;
  const tttbMax = isSenior ? 50_000 : 10_000;  // 80TTB senior / 80TTA others

  const c80Allowed   = Math.min(150_000, ded.c80);
  const d80Allowed   = Math.min(100_000, ded.d80);
  const hraAllowed   = ded.hra;
  const homeLoanAllowed = Math.min(200_000, ded.homeLoan);
  const npsAllowed   = Math.min(50_000, ded.nps);
  const tttbAllowed  = Math.min(tttbMax, ded.tttb);
  const edu80EAllowed = ded.edu80E;  // no cap
  const g80Allowed   = Math.min(100_000, Math.floor(ded.donations80G * 0.5));

  const totalDed = stdDed + c80Allowed + d80Allowed + hraAllowed
    + homeLoanAllowed + npsAllowed + tttbAllowed + edu80EAllowed + g80Allowed;

  const taxable = Math.max(0, gross - totalDed);
  let base = slabTax(taxable, slabs);

  // 87A rebate (old regime): taxable ≤ ₹5L → rebate up to ₹12,500
  if (taxable <= 500_000) base = Math.max(0, base - 12_500);

  return {
    tax: addSurchargeAndCess(base, gross, false),
    taxable,
    totalDed,
    stdDed,
    breakdown: { c80Allowed, d80Allowed, hraAllowed, homeLoanAllowed, npsAllowed, tttbAllowed, edu80EAllowed, g80Allowed },
  };
}

const AGE_OPTIONS: { value: AgeGroup; label: string; sub: string }[] = [
  { value: "below60",  label: "Below 60",          sub: "₹2.5L basic exemption" },
  { value: "senior60", label: "60 – 79 years",     sub: "₹3L basic exemption"   },
  { value: "senior80", label: "80+ years",          sub: "₹5L basic exemption"   },
];

export function IncomeTaxCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("income-tax", {
    grossIncome:     "1200000",
    ageGroup:        "below60",
    deduction80C:    "150000",
    deduction80D:    "25000",
    hraExemption:    "0",
    homeLoanInterest:"0",
    nps80CCD:        "0",
    tttb:            "0",
    edu80E:          "0",
    donations80G:    "0",
    showDeductions:  "false",
  });

  const result = useMemo(() => {
    const gross  = Number(inputs.grossIncome);
    const age    = (inputs.ageGroup || "below60") as AgeGroup;
    if (gross <= 0) return null;
    const newRes = calcNew(gross);
    const oldRes = calcOld(gross, age, {
      c80:         Number(inputs.deduction80C),
      d80:         Number(inputs.deduction80D),
      hra:         Number(inputs.hraExemption),
      homeLoan:    Number(inputs.homeLoanInterest),
      nps:         Number(inputs.nps80CCD),
      tttb:        Number(inputs.tttb),
      edu80E:      Number(inputs.edu80E),
      donations80G:Number(inputs.donations80G),
    });
    const saving       = Math.abs(newRes.tax - oldRes.tax);
    const betterRegime = newRes.tax <= oldRes.tax ? "New" : "Old";
    return { newRes, oldRes, saving, betterRegime, gross };
  }, [inputs]);

  const showDed = inputs.showDeductions === "true";
  const isSenior = inputs.ageGroup !== "below60";

  function getSummaryText() {
    if (!result) return "";
    const r = result;
    return (
      `🧾 Income Tax FY 2025-26 — India Money Toolkit\n` +
      `Gross income: ${fmt(r.gross)} · Age: ${AGE_OPTIONS.find(a => a.value === inputs.ageGroup)?.label}\n` +
      `New Regime: ${fmt(r.newRes.tax)} (eff. ${fmtPct(r.newRes.tax/r.gross*100)}) · Monthly TDS: ${fmt(r.newRes.tax/12)}\n` +
      `Old Regime: ${fmt(r.oldRes.tax)} (eff. ${fmtPct(r.oldRes.tax/r.gross*100)}) · Monthly TDS: ${fmt(r.oldRes.tax/12)}\n` +
      `💡 ${r.betterRegime} Regime saves ${fmt(r.saving)}\n` +
      `https://indiamoneytoolkit.com/calculators/income-tax`
    );
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🧾 Income tax calculator</p>
          <h2>Old vs New Regime — FY 2025-26</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            Budget 2025 slabs · Age-based old-regime exemptions · 87A rebate · 4% cess applied.
          </p>
        </div>

        {/* ── Age selector ── */}
        <div>
          <p className="field__label" style={{ marginBottom: "10px" }}>Age group</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {AGE_OPTIONS.map((opt) => {
              const active = inputs.ageGroup === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setInputs((c) => ({ ...c, ageGroup: opt.value }))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: `2px solid ${active ? "var(--blue)" : "var(--border)"}`,
                    background: active ? "var(--blue)" : "var(--surface-raised)",
                    color: active ? "#fff" : "var(--text)",
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "2px",
                    transition: "border 0.15s, background 0.15s",
                  }}
                >
                  <span>{opt.label}</span>
                  <span style={{ fontWeight: 400, opacity: 0.85, fontSize: "0.74rem" }}>{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="it-income"
            label="Gross annual income (₹)"
            value={inputs.grossIncome}
            min={300_000}
            max={10_000_000}
            step={50_000}
            hint="Total salary / income before any deductions"
            onChange={(e) => setInputs((c) => ({ ...c, grossIncome: e.target.value }))}
          />
        </div>

        {/* ── Old regime deductions toggle ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="it-show-ded"
            checked={showDed}
            onChange={(e) => setInputs((c) => ({ ...c, showDeductions: e.target.checked ? "true" : "false" }))}
            style={{ width: "17px", height: "17px", accentColor: "var(--blue)", flexShrink: 0, cursor: "pointer" }}
          />
          <label className="field__label" htmlFor="it-show-ded" style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}>
            Add old regime deductions (80C, HRA, home loan, 80E…)
          </label>
        </div>

        {showDed && (
          <div className="calculator-grid">
            <SliderInput
              id="it-80c"
              label="Section 80C (₹)"
              value={inputs.deduction80C}
              min={0}
              max={150_000}
              step={5_000}
              hint="PF, PPF, ELSS, LIC, tuition fees — max ₹1.5L"
              onChange={(e) => setInputs((c) => ({ ...c, deduction80C: e.target.value }))}
            />
            <SliderInput
              id="it-80d"
              label="Section 80D — health insurance (₹)"
              value={inputs.deduction80D}
              min={0}
              max={100_000}
              step={5_000}
              hint={`Self + family ₹25k${isSenior ? " (₹50k if self is senior)" : ""}; parents adds ₹25–50k more — max ₹1L`}
              onChange={(e) => setInputs((c) => ({ ...c, deduction80D: e.target.value }))}
            />
            <SliderInput
              id="it-hra"
              label="HRA exemption (₹)"
              value={inputs.hraExemption}
              min={0}
              max={1_200_000}
              step={12_000}
              hint="Use the HRA calculator to find your exempt amount"
              onChange={(e) => setInputs((c) => ({ ...c, hraExemption: e.target.value }))}
            />
            <SliderInput
              id="it-homeloan"
              label="Home loan interest — Sec 24(b) (₹)"
              value={inputs.homeLoanInterest}
              min={0}
              max={300_000}
              step={10_000}
              hint="Self-occupied property — max ₹2L"
              onChange={(e) => setInputs((c) => ({ ...c, homeLoanInterest: e.target.value }))}
            />
            <SliderInput
              id="it-nps"
              label="NPS 80CCD(1B) (₹)"
              value={inputs.nps80CCD}
              min={0}
              max={50_000}
              step={5_000}
              hint="Extra ₹50k deduction over and above 80C limit"
              onChange={(e) => setInputs((c) => ({ ...c, nps80CCD: e.target.value }))}
            />
            {/* 80TTA vs 80TTB based on age */}
            <SliderInput
              id="it-tttb"
              label={isSenior ? "80TTB — bank deposit interest (₹)" : "80TTA — savings account interest (₹)"}
              value={inputs.tttb}
              min={0}
              max={isSenior ? 50_000 : 10_000}
              step={1_000}
              hint={isSenior
                ? "Senior citizens: savings + FD interest — max ₹50k"
                : "Savings account interest only — max ₹10k"}
              onChange={(e) => setInputs((c) => ({ ...c, tttb: e.target.value }))}
            />
            <SliderInput
              id="it-80e"
              label="80E — education loan interest (₹)"
              value={inputs.edu80E}
              min={0}
              max={500_000}
              step={5_000}
              hint="Higher education loan interest — no upper limit, allowed for 8 years"
              onChange={(e) => setInputs((c) => ({ ...c, edu80E: e.target.value }))}
            />
            <SliderInput
              id="it-80g"
              label="80G — charitable donations (₹)"
              value={inputs.donations80G}
              min={0}
              max={500_000}
              step={5_000}
              hint="50% of donation is deductible (PM CARES, PM Relief Fund = 100%)"
              onChange={(e) => setInputs((c) => ({ ...c, donations80G: e.target.value }))}
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
            {([
              { label: "Old Regime", res: result.oldRes, isBetter: result.betterRegime === "Old" },
              { label: "New Regime", res: result.newRes, isBetter: result.betterRegime === "New" },
            ] as const).map((r, i) => (
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
                  marginBottom: "4px",
                }}>
                  {fmt(r.res.tax)}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-3)", marginBottom: "3px" }}>
                  Effective rate: {fmtPct(r.res.tax / result.gross * 100)}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginBottom: "3px" }}>
                  Monthly TDS: <strong>{fmt(r.res.tax / 12)}</strong>
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
                  Taxable income: {fmt(r.res.taxable)}
                </p>
              </div>
            ))}
          </div>

          {/* Deduction summary for old regime */}
          {showDed && (
            <div style={{ padding: "14px 26px", borderBottom: "1px solid var(--border-sub)" }}>
              <p style={{
                fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em",
                textTransform: "uppercase", color: "var(--text-3)", marginBottom: "10px",
              }}>
                Old regime deductions
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "6px 16px" }}>
                {[
                  ["Std deduction", result.oldRes.stdDed],
                  ["80C", result.oldRes.breakdown.c80Allowed],
                  ["80D", result.oldRes.breakdown.d80Allowed],
                  ["HRA", result.oldRes.breakdown.hraAllowed],
                  ["Sec 24(b)", result.oldRes.breakdown.homeLoanAllowed],
                  ["80CCD(1B)", result.oldRes.breakdown.npsAllowed],
                  [isSenior ? "80TTB" : "80TTA", result.oldRes.breakdown.tttbAllowed],
                  ["80E", result.oldRes.breakdown.edu80EAllowed],
                  ["80G (50%)", result.oldRes.breakdown.g80Allowed],
                ].filter(([, v]) => (v as number) > 0).map(([label, val]) => (
                  <div key={label as string} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                    <span style={{ color: "var(--text-3)" }}>{label}</span>
                    <span style={{ fontWeight: 600 }}>{fmt(val as number)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: 700, borderTop: "1px solid var(--border-sub)", paddingTop: "6px", gridColumn: "1/-1" }}>
                  <span>Total deductions</span>
                  <span style={{ color: "var(--green)" }}>{fmt(result.oldRes.totalDed)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          <div style={{ padding: "12px 26px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.6 }}>
              New regime: ₹75k std deduction + 87A rebate (zero tax up to ₹12.75L gross for salaried).
              Old regime: ₹50k std deduction{showDed ? ` + ₹${((result.oldRes.totalDed - 50_000) / 1_000).toFixed(0)}k other deductions` : ""}.
              Surcharge + 4% cess included.
              {inputs.ageGroup === "senior80" ? " Very senior citizens: basic exemption ₹5L, no 87A in old regime." : ""}
              {inputs.ageGroup === "senior60" ? " Senior citizens: basic exemption ₹3L, 80TTB up to ₹50k." : ""}
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
