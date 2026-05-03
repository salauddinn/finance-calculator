import { useMemo } from "react";
import { SliderInput } from "@/components/primitives/slider-input";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

const TAX_FREE_LIMIT = 2_000_000; // ₹20 lakh

export function GratuityCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("gratuity", {
    lastSalary: "50000",
    yearsOfService: "10",
  });

  const result = useMemo(() => {
    const salary = Number(inputs.lastSalary);
    const years = Number(inputs.yearsOfService);
    if (salary <= 0 || years <= 0) return null;

    // Payment of Gratuity Act formula (for covered organisations ≥ 10 employees)
    const gratuity = (salary * 15 * years) / 26;
    const taxFree = Math.min(gratuity, TAX_FREE_LIMIT);
    const taxable = Math.max(0, gratuity - TAX_FREE_LIMIT);
    const eligible = years >= 5;

    return { gratuity, taxFree, taxable, eligible, years, salary };
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return (
      `🤝 Gratuity Calculator — India Money Toolkit\n` +
      `Last monthly salary (Basic+DA): ${fmt(result.salary)}\n` +
      `Years of service: ${result.years}\n` +
      `Gratuity amount: ${fmt(result.gratuity)}\n` +
      `Tax-free: ${fmt(result.taxFree)} | Taxable: ${fmt(result.taxable)}\n` +
      `(Tax-free limit under Payment of Gratuity Act: ₹20 lakh)\n` +
      `https://indiamoneytoolkit.com/calculators/gratuity`
    );
  }

  const years = Number(inputs.yearsOfService);

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🤝 Gratuity calculator</p>
          <h2>What gratuity am I owed?</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            Formula: (Basic + DA × 15 × Years) ÷ 26 — as per Payment of Gratuity Act.
            Minimum 5 years of continuous service required.
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="gr-salary"
            label="Last drawn monthly salary — Basic + DA (₹)"
            value={inputs.lastSalary}
            min={10000}
            max={500000}
            step={5000}
            hint="Most private sector employees: DA = 0, use basic salary only"
            onChange={(e) => setInputs((c) => ({ ...c, lastSalary: e.target.value }))}
          />
          <SliderInput
            id="gr-years"
            label="Completed years of service"
            value={inputs.yearsOfService}
            min={1}
            max={40}
            step={1}
            hint="Fraction of year ≥ 6 months is rounded up to the next year"
            onChange={(e) => setInputs((c) => ({ ...c, yearsOfService: e.target.value }))}
          />
        </div>

        {years < 5 && (
          <div style={{
            padding: "12px 16px", borderRadius: "8px",
            background: "var(--amber-dim)", border: "1px solid var(--amber)",
            fontSize: "0.85rem", color: "var(--text-2)", lineHeight: 1.6,
          }}>
            ⚠️ Gratuity requires at least 5 continuous years of service. At {years} year{years !== 1 ? "s" : ""}, you are not yet eligible.
          </div>
        )}
      </div>

      {result && result.eligible && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Gratuity amount"
            value={fmt(result.gratuity)}
            sublabel={`${result.years} years · ${fmt(result.salary)}/month · Formula: (${fmt(result.salary)} × 15 × ${result.years}) ÷ 26`}
            tone="positive"
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Tax-free portion"
              caption="Under Payment of Gratuity Act"
              value={fmt(result.taxFree)}
              tone="positive"
            />
            <ResultSummaryCard
              label="Taxable portion"
              caption={result.taxable > 0 ? "Amount above ₹20L limit" : "None — within ₹20L limit"}
              value={fmt(result.taxable)}
              tone={result.taxable > 0 ? "caution" : "default"}
            />
          </div>

          <div style={{ padding: "12px 26px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.6 }}>
              The ₹20 lakh tax-free limit applies to private sector employees covered under the
              Payment of Gratuity Act (organisations with ≥10 employees). Government employees
              receive full gratuity tax-free. Taxable gratuity is added to your income and taxed
              at your slab rate.
            </p>
          </div>

          <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <WhatsAppShareButton getText={getSummaryText} />
            <CopySummaryButton getText={getSummaryText} />
          </div>
        </div>
      )}

      {result && !result.eligible && (
        <div className="calculator-results">
          <div style={{ padding: "32px 26px", textAlign: "center" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--amber)", marginBottom: "8px" }}>
              Not yet eligible
            </p>
            <p style={{ fontSize: "0.88rem", color: "var(--text-2)" }}>
              You need at least 5 continuous years of service. You have {result.years} year{result.years !== 1 ? "s" : ""}.
              {result.years < 5 ? ` ${5 - result.years} more year${5 - result.years !== 1 ? "s" : ""} to go.` : ""}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
