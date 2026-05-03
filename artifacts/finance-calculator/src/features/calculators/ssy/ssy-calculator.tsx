import { useMemo } from "react";
import { calculateSsy } from "@/lib/calculations/ssy/ssy-engine";
import { SliderInput } from "@/components/primitives/slider-input";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

const CURRENT_SSY_RATE = 8.2; // Q1 FY 2025-26

export function SsyCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("ssy", {
    annualContribution: "150000",
    girlAge: "1",
    interestRate: String(CURRENT_SSY_RATE),
  });

  const result = useMemo(() => {
    const annualContribution = Number(inputs.annualContribution);
    const girlAge = Number(inputs.girlAge);
    const interestRatePct = Number(inputs.interestRate);
    if (annualContribution < 250 || girlAge < 0 || girlAge > 9 || interestRatePct <= 0) return null;
    const calc = calculateSsy({ annualContribution, girlAge, interestRatePct });
    return { ...calc, partialWithdrawal: "At age 18 — up to 50% for education", girlAge };
  }, [inputs]);

  const girlAge = Number(inputs.girlAge);
  const isAgeInvalid = girlAge > 9;

  function getSummaryText() {
    if (!result) return "";
    return (
      `👧 Sukanya Samriddhi Yojana — India Money Toolkit\n` +
      `Annual deposit: ${fmt(result.contrib)}\n` +
      `Girl's current age: ${result.girlAge} years\n` +
      `Interest rate: ${inputs.interestRate}% p.a.\n` +
      `Deposit for ${result.contributionYears} years → matures at age ${result.maturityAge}\n` +
      `Maturity value: ${fmt(result.maturityValue)}\n` +
      `Total deposited: ${fmt(result.totalInvested)} | Interest: ${fmt(result.interest)}\n` +
      `https://indiamoneytoolkit.com/calculators/ssy`
    );
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">👧 SSY calculator</p>
          <h2>Sukanya Samriddhi Yojana</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55 }}>
            Government scheme for girl child. Current rate: <strong>{CURRENT_SSY_RATE}% p.a.</strong> (Q1 FY 2025-26).
            Matures when girl turns 21. Account can be opened until age 10.
          </p>
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="ssy-contrib"
            label="Annual deposit (₹)"
            value={inputs.annualContribution}
            min={250}
            max={150000}
            step={500}
            hint="Minimum ₹250/year · Maximum ₹1.5L/year · Fully tax-free (EEE)"
            onChange={(e) => setInputs((c) => ({ ...c, annualContribution: e.target.value }))}
          />
          <SliderInput
            id="ssy-age"
            label="Girl's current age (years)"
            value={inputs.girlAge}
            min={0}
            max={9}
            step={1}
            hint="Account can only be opened for girls below 10 years of age"
            onChange={(e) => setInputs((c) => ({ ...c, girlAge: e.target.value }))}
          />
          <SliderInput
            id="ssy-rate"
            label="Interest rate (%)"
            value={inputs.interestRate}
            min={6}
            max={10}
            step={0.1}
            hint={`Current rate: ${CURRENT_SSY_RATE}% — revised quarterly by government`}
            onChange={(e) => setInputs((c) => ({ ...c, interestRate: e.target.value }))}
          />
        </div>

        {isAgeInvalid && (
          <div style={{
            padding: "12px 16px", borderRadius: "8px",
            background: "var(--amber-dim)", border: "1px solid var(--amber)",
            fontSize: "0.85rem", color: "var(--text-2)",
          }}>
            ⚠️ SSY accounts can only be opened for girls below 10 years of age.
          </div>
        )}
      </div>

      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label={`Maturity value at girl's age ${result.maturityAge}`}
            value={fmt(result.maturityValue)}
            sublabel={`${result.contributionYears}y deposits + ${result.dormantYears}y growth · ${fmt(result.contrib)}/year at ${inputs.interestRate}%`}
            tone="positive"
          />

          <BreakdownBar
            valueA={result.totalInvested}
            valueB={result.interest}
            labelA="Deposited"
            labelB="Interest earned"
            colorA="blue"
            colorB="amber"
            formattedA={fmt(result.totalInvested)}
            formattedB={fmt(result.interest)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Total deposited"
              caption={`₹${(result.contrib/1000).toFixed(0)}k × ${result.contributionYears} years`}
              value={fmt(result.totalInvested)}
            />
            <ResultSummaryCard
              label="Interest earned"
              caption="Fully tax-free (EEE status)"
              value={fmt(result.interest)}
              tone="positive"
            />
          </div>

          <div style={{ padding: "12px 26px", borderBottom: "1px solid var(--border-sub)" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", lineHeight: 1.6 }}>
              🎓 Partial withdrawal up to 50% allowed after girl turns 18 (for education).
              Full maturity at 21. SSY is EEE — contributions (80C deductible), interest, and maturity
              are all tax-free in old regime.
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
