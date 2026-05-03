import { useMemo } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateHra } from "@/lib/calculations/hra/calculate-hra";

const FMT = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
});
const fmt = (v: number) => FMT.format(v);

const METRO_CITIES = ["Delhi", "Mumbai", "Kolkata", "Chennai"];

export function HraCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("hra", {
    basicSalary:  "50000",
    daAmount:     "0",
    hraReceived:  "20000",
    monthlyRent:  "18000",
    isMetro:      "true",
  });

  const isMetro = inputs.isMetro === "true";

  const result = useMemo(
    () =>
      calculateHra({
        basicSalary:      Number(inputs.basicSalary),
        daAmount:         Number(inputs.daAmount),
        hraReceived:      Number(inputs.hraReceived),
        monthlyRentPaid:  Number(inputs.monthlyRent),
        isMetroCity:      isMetro,
      }),
    [inputs, isMetro]
  );

  const limitLabels = {
    hra_received:    "Actual HRA received",
    rent_minus_basic: "Rent paid − 10% of Basic+DA",
    city_limit:       `${isMetro ? "50%" : "40%"} of Basic+DA (city limit)`,
  };

  function getSummaryText() {
    return [
      "HRA Exemption Summary — India Money Toolkit",
      `Basic salary: ${fmt(Number(inputs.basicSalary))}/month`,
      `DA: ${fmt(Number(inputs.daAmount))}/month`,
      `HRA received: ${fmt(Number(inputs.hraReceived))}/month`,
      `Rent paid: ${fmt(Number(inputs.monthlyRent))}/month`,
      `City type: ${isMetro ? "Metro" : "Non-metro"}`,
      "",
      `Annual HRA received: ${fmt(result.actualHraReceived)}`,
      `HRA exemption (annual): ${fmt(result.hraExemption)}`,
      `Taxable HRA (annual): ${fmt(result.taxableHra)}`,
      `Limited by: ${limitLabels[result.limitingFactor]}`,
      "",
      "Exemption = min(Actual HRA, Rent−10% Basic+DA, 50%/40% of Basic+DA).",
      "https://indiamoneytoolkit.com/calculators/hra",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🧾 HRA exemption calculator</p>
          <h2>How much HRA is tax-free?</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", marginTop: "2px" }}>
            Under Section 10(13A) of the Income Tax Act
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="hra-basic"
            label="Basic salary per month (₹)"
            value={inputs.basicSalary}
            onChange={(e) => setInputs((c) => ({ ...c, basicSalary: e.target.value }))}
            min={10_000} max={500_000} step={1_000}
          />
          <SliderInput
            id="hra-da"
            label="Dearness allowance per month (₹)"
            value={inputs.daAmount}
            onChange={(e) => setInputs((c) => ({ ...c, daAmount: e.target.value }))}
            min={0} max={200_000} step={1_000}
            hint="DA is ₹0 for most private sector employees"
          />
          <SliderInput
            id="hra-received"
            label="HRA received per month (₹)"
            value={inputs.hraReceived}
            onChange={(e) => setInputs((c) => ({ ...c, hraReceived: e.target.value }))}
            min={0} max={200_000} step={500}
          />
          <SliderInput
            id="hra-rent"
            label="Actual rent paid per month (₹)"
            value={inputs.monthlyRent}
            onChange={(e) => setInputs((c) => ({ ...c, monthlyRent: e.target.value }))}
            min={0} max={200_000} step={500}
            hint="Must exceed 10% of Basic+DA to claim any exemption"
          />

          {/* Metro toggle */}
          <div className="field">
            <label className="field__label">City type</label>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              {([true, false] as const).map((metro) => (
                <button
                  key={String(metro)}
                  type="button"
                  onClick={() => setInputs((c) => ({ ...c, isMetro: metro ? "true" : "false" }))}
                  className="seg__btn"
                  aria-pressed={isMetro === metro}
                  style={{ flex: 1 }}
                >
                  {metro ? "Metro (50%)" : "Non-metro (40%)"}
                </button>
              ))}
            </div>
            <p className="field__hint">Metro cities: {METRO_CITIES.join(", ")}</p>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="calculator-results">
        <ResultSummaryCard
          isHero
          label="HRA exemption (annual)"
          value={fmt(result.hraExemption)}
          sublabel={`${fmt(result.hraExemption / 12)}/month · Limited by: ${limitLabels[result.limitingFactor]}`}
          tone="positive"
        />

        {/* Three-rule breakdown */}
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border-sub)" }}>
          <p style={{
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--text-3)", marginBottom: "10px",
          }}>
            Exemption = minimum of three rules
          </p>
          {[
            { label: "Actual HRA received", value: result.actualHraReceived, active: result.limitingFactor === "hra_received" },
            { label: "Rent paid − 10% of Basic+DA", value: result.rentMinusBasic, active: result.limitingFactor === "rent_minus_basic" },
            { label: `${isMetro ? "50%" : "40%"} of Basic+DA`, value: result.cityBasedLimit, active: result.limitingFactor === "city_limit" },
          ].map((rule) => (
            <div
              key={rule.label}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 10px", marginBottom: "4px",
                borderRadius: "var(--r-sm)",
                background: rule.active ? "var(--green-dim)" : "transparent",
                border: `1px solid ${rule.active ? "var(--green)" : "var(--border-sub)"}`,
              }}
            >
              <span style={{ fontSize: "0.82rem", color: rule.active ? "var(--text)" : "var(--text-2)" }}>
                {rule.label}
                {rule.active && <span style={{ marginLeft: "6px", fontSize: "0.7rem", fontWeight: 700, color: "var(--green)" }}>← Minimum</span>}
              </span>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: rule.active ? "var(--green)" : "var(--text)" }}>
                {fmt(rule.value)}
              </span>
            </div>
          ))}
        </div>

        <div className="calculator-metric-grid">
          <ResultSummaryCard
            label="Taxable HRA (annual)"
            caption="Added to your taxable income"
            value={fmt(result.taxableHra)}
            tone={result.taxableHra > 0 ? "caution" : "positive"}
          />
          <ResultSummaryCard
            label="Annual HRA received"
            caption="From your employer"
            value={fmt(result.actualHraReceived)}
          />
        </div>

        <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <WhatsAppShareButton getText={getSummaryText} />
          <CopySummaryButton getText={getSummaryText} />
        </div>

        <p style={{ padding: "0 22px 14px", fontSize: "0.72rem", color: "var(--text-3)", lineHeight: 1.5 }}>
          Under Section 10(13A). Self-employed individuals cannot claim HRA exemption. Consult a CA for your exact tax computation.
        </p>
      </div>
    </section>
  );
}
