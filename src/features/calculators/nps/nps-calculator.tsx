import { useMemo } from "react";
import { calculateNps } from "@/lib/calculations/nps/nps-engine";
import { SliderInput } from "@/components/primitives/slider-input";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

export function NpsCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("nps", {
    monthlyContribution: "5000",
    annualReturnPct: "10",
    currentAge: "30",
    retirementAge: "60",
  });

  const result = useMemo(() => {
    const monthly = Number(inputs.monthlyContribution);
    const annualReturnPct = Number(inputs.annualReturnPct);
    const currentAge = Number(inputs.currentAge);
    const retirementAge = Number(inputs.retirementAge);
    if (monthly <= 0 || annualReturnPct <= 0 || retirementAge <= currentAge) return null;
    return calculateNps({ monthlyContribution: monthly, annualReturnPct, currentAge, retirementAge });
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return (
      `🏦 NPS Calculator — India Money Toolkit\n` +
      `Monthly contribution: ${fmt(Number(inputs.monthlyContribution))}\n` +
      `Period: ${result.years} years at ${inputs.annualReturnPct}%\n` +
      `Total corpus: ${fmt(result.corpus)}\n` +
      `Lump sum (60%): ${fmt(result.lumpSum)}\n` +
      `Est. monthly pension (40% annuity @ 6%): ${fmt(result.monthlyPension)}\n` +
      `https://indiamoneytoolkit.com/calculators/nps`
    );
  }

  const currentAge = Number(inputs.currentAge);
  const retirementAge = Number(inputs.retirementAge);
  const ageError = retirementAge <= currentAge;

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🏛️ NPS calculator</p>
          <h2>National Pension System planner</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            At retirement: 60% lump sum withdrawal + 40% mandatory annuity for monthly pension.
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="nps-monthly"
            label="Monthly contribution (₹)"
            value={inputs.monthlyContribution}
            min={500}
            max={100000}
            step={500}
            hint="80CCD(1B) gives extra ₹50k/year deduction over 80C in old regime"
            onChange={(e) => setInputs((c) => ({ ...c, monthlyContribution: e.target.value }))}
          />
          <SliderInput
            id="nps-return"
            label="Expected annual return (%)"
            value={inputs.annualReturnPct}
            min={6}
            max={14}
            step={0.5}
            hint="NPS equity fund (E tier): ~10–12% historical; mixed: ~9%"
            onChange={(e) => setInputs((c) => ({ ...c, annualReturnPct: e.target.value }))}
          />
          <SliderInput
            id="nps-current-age"
            label="Current age (years)"
            value={inputs.currentAge}
            min={18}
            max={59}
            step={1}
            onChange={(e) => setInputs((c) => ({ ...c, currentAge: e.target.value }))}
          />
          <SliderInput
            id="nps-retire-age"
            label="Retirement age (years)"
            value={inputs.retirementAge}
            min={Number(inputs.currentAge) + 1}
            max={70}
            step={1}
            onChange={(e) => setInputs((c) => ({ ...c, retirementAge: e.target.value }))}
          />
        </div>

        {ageError && (
          <p style={{ fontSize: "0.85rem", color: "var(--amber)", marginTop: "8px" }}>
            Retirement age must be greater than current age.
          </p>
        )}
      </div>

      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Total NPS corpus at retirement"
            value={fmt(result.corpus)}
            sublabel={`After ${result.years} years · ${fmt(Number(inputs.monthlyContribution))}/month at ${inputs.annualReturnPct}%`}
            tone="positive"
          />

          <BreakdownBar
            valueA={result.totalInvested}
            valueB={result.returns}
            labelA="Contributed"
            labelB="Growth"
            colorA="blue"
            colorB="amber"
            formattedA={fmt(result.totalInvested)}
            formattedB={fmt(result.returns)}
          />

          {/* Withdrawal breakdown */}
          <div style={{ padding: "18px 26px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "12px" }}>
              At retirement
            </p>
            <div className="calculator-metric-grid" style={{ marginBottom: 0 }}>
              <ResultSummaryCard
                label="Lump sum (60%)"
                caption="Tax-free withdrawal at 60"
                value={fmt(result.lumpSum)}
                tone="positive"
              />
              <ResultSummaryCard
                label="Annuity corpus (40%)"
                caption="Mandatory — buys monthly pension"
                value={fmt(result.annuityCorpus)}
              />
              <ResultSummaryCard
                label="Est. monthly pension"
                caption="Annuity @ 6% p.a. (indicative)"
                value={fmt(result.monthlyPension)}
                tone="positive"
              />
            </div>
          </div>

          <div style={{ padding: "12px 26px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.6 }}>
              Annuity rate varies by provider (typically 5–7%). Monthly pension is an estimate.
              NPS also qualifies for ₹50k extra deduction under 80CCD(1B) in old income tax regime.
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
