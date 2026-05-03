import { useMemo } from "react";

import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import {
  calculateFixedDeposit,
  type CompoundingFrequency,
} from "@/lib/calculations/fixed-deposit/fixed-deposit";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function fmt(value: number) {
  return CURRENCY_FORMATTER.format(value);
}

export function FixedDepositCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("fixed-deposit", {
    depositAmount: "100000",
    annualRatePct: "7.5",
    tenureMonths: "24",
    compoundingFrequency: "yearly",
    mode: "simple",
    payoutFrequency: "cumulative",
    seniorCitizen: "false",
    tdsEnabled: "false",
  });

  const isAdvanced = inputs.mode === "advanced";

  const result = useMemo(
    () =>
      calculateFixedDeposit({
        depositAmount: Number(inputs.depositAmount),
        annualRatePct: Number(inputs.annualRatePct),
        durationMonths: Number(inputs.tenureMonths),
        compoundingFrequency: inputs.compoundingFrequency as CompoundingFrequency,
        advancedConfig: isAdvanced
          ? {
              payoutFrequency: inputs.payoutFrequency as
                | "cumulative"
                | "monthly"
                | "quarterly"
                | "yearly",
              seniorCitizen: inputs.seniorCitizen === "true",
              tdsEnabled: inputs.tdsEnabled === "true",
            }
          : undefined,
      }),
    [inputs, isAdvanced]
  );

  const months = Number(inputs.tenureMonths);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const durationLabel = years > 0
    ? `${years}y${remMonths > 0 ? ` ${remMonths}m` : ""}`
    : `${months}m`;

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div className="calculator-copy">
            <p className="eyebrow">Fixed deposit calculator</p>
            <h2>Maturity & interest earned</h2>
          </div>
          <ModeToggle
            mode={inputs.mode as "simple" | "advanced"}
            onChange={(mode) => setInputs((c) => ({ ...c, mode }))}
          />
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="fd-deposit"
            label="Deposit amount (₹)"
            value={inputs.depositAmount as string}
            min={10000} max={10000000} step={10000}
            onChange={(e) => setInputs((c) => ({ ...c, depositAmount: e.target.value }))}
          />
          <SliderInput
            id="fd-rate"
            label="Annual interest rate (%)"
            value={inputs.annualRatePct as string}
            min={1} max={15} step={0.1}
            onChange={(e) => setInputs((c) => ({ ...c, annualRatePct: e.target.value }))}
          />
          <SliderInput
            id="fd-tenure"
            label="Tenure (months)"
            value={inputs.tenureMonths as string}
            min={6} max={120} step={6}
            onChange={(e) => setInputs((c) => ({ ...c, tenureMonths: e.target.value }))}
          />
          <div className="field">
            <label className="field__label" htmlFor="fd-compounding">Compounding frequency</label>
            <select
              id="fd-compounding"
              className="text-input"
              value={inputs.compoundingFrequency as string}
              onChange={(e) => setInputs((c) => ({ ...c, compoundingFrequency: e.target.value }))}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Advanced options">
            <div className="calculator-grid">
              <div className="field">
                <label className="field__label" htmlFor="fd-payout">Interest payout</label>
                <select
                  id="fd-payout"
                  className="text-input"
                  value={inputs.payoutFrequency as string}
                  onChange={(e) => setInputs((c) => ({ ...c, payoutFrequency: e.target.value }))}
                >
                  <option value="cumulative">Cumulative (at maturity)</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="fd-senior"
                  checked={inputs.seniorCitizen === "true"}
                  onChange={(e) => setInputs((c) => ({ ...c, seniorCitizen: e.target.checked ? "true" : "false" }))}
                  style={{ width: "16px", height: "16px", accentColor: "var(--blue)", flexShrink: 0 }}
                />
                <label className="field__label" htmlFor="fd-senior" style={{ margin: 0 }}>
                  Senior citizen (+0.5% rate)
                </label>
              </div>
              <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="fd-tds"
                  checked={inputs.tdsEnabled === "true"}
                  onChange={(e) => setInputs((c) => ({ ...c, tdsEnabled: e.target.checked ? "true" : "false" }))}
                  style={{ width: "16px", height: "16px", accentColor: "var(--blue)", flexShrink: 0 }}
                />
                <label className="field__label" htmlFor="fd-tds" style={{ margin: 0 }}>
                  Deduct TDS (10%)
                </label>
              </div>
            </div>
          </AdvancedOptionsAccordion>
        )}
      </div>

      {/* ── Results ── */}
      <div className="calculator-results">
        <ResultSummaryCard
          isHero
          label="Maturity value"
          value={fmt(result.maturityValue)}
          sublabel={`After ${durationLabel} · ${inputs.annualRatePct}% p.a.`}
          tone="positive"
          valueTestId="fd-maturity-value"
        />

        <BreakdownBar
          valueA={Number(inputs.depositAmount)}
          valueB={result.interestEarned}
          labelA="Principal"
          labelB="Interest"
          colorA="blue"
          colorB="green"
          formattedA={fmt(Number(inputs.depositAmount))}
          formattedB={fmt(result.interestEarned)}
        />

        <div className="calculator-metric-grid">
          <ResultSummaryCard
            label="Interest earned"
            caption="Return above your deposit"
            value={fmt(result.interestEarned)}
            tone="positive"
          />
          {result.totalTdsDeducted > 0 && (
            <ResultSummaryCard
              label="TDS deducted"
              caption="Tax deducted at source (10%)"
              value={fmt(result.totalTdsDeducted)}
              tone="caution"
            />
          )}
          {result.payoutPerPeriod > 0 && (
            <ResultSummaryCard
              label="Periodic payout"
              caption={`Per ${inputs.payoutFrequency}`}
              value={fmt(result.payoutPerPeriod)}
              tone="positive"
            />
          )}
        </div>

        <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <WhatsAppShareButton getText={() => [
            "Fixed Deposit Summary — India Money Toolkit",
            `Deposit: ${fmt(Number(inputs.depositAmount))}`,
            `Rate: ${inputs.annualRatePct}%`,
            `Tenure: ${inputs.tenureMonths} months`,
            `Compounding: ${inputs.compoundingFrequency}`,
            `Interest earned: ${fmt(result.interestEarned)}`,
            `Maturity value: ${fmt(result.maturityValue)}`,
            result.totalTdsDeducted > 0 ? `TDS deducted: ${fmt(result.totalTdsDeducted)}` : "",
            "",
            "Estimates only. Verify with your bank.",
            "Calculate yours: indiamoneytoolkit.com/calculators/fixed-deposit",
          ].filter(Boolean).join("\n")} />
          <CopySummaryButton
            getText={() =>
              [
                "Fixed Deposit Summary",
                `Deposit: ${fmt(Number(inputs.depositAmount))}`,
                `Rate: ${inputs.annualRatePct}%`,
                `Tenure: ${inputs.tenureMonths} months`,
                `Compounding: ${inputs.compoundingFrequency}`,
                `Interest earned: ${fmt(result.interestEarned)}`,
                `Maturity value: ${fmt(result.maturityValue)}`,
                result.totalTdsDeducted > 0
                  ? `TDS deducted: ${fmt(result.totalTdsDeducted)}`
                  : "",
                "Estimates only. Verify with your bank.",
              ]
                .filter(Boolean)
                .join("\n")
            }
          />
        </div>
      </div>
    </section>
  );
}
