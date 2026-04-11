"use client";

import { useMemo } from "react";

import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import {
  calculateFixedDeposit,
  type CompoundingFrequency
} from "@/lib/calculations/fixed-deposit/fixed-deposit";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function formatCurrency(value: number) {
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
    tdsEnabled: "false"
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
              payoutFrequency: inputs.payoutFrequency as "cumulative" | "monthly" | "quarterly" | "yearly",
              seniorCitizen: inputs.seniorCitizen === "true",
              tdsEnabled: inputs.tdsEnabled === "true"
            }
          : undefined
      }),
    [inputs, isAdvanced]
  );

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p className="eyebrow">Fixed deposit calculator</p>
            <h2>See your maturity amount without guesswork</h2>
            <p className="hero-copy">
              Fixed deposits are often chosen for predictability, so the result
              should be just as easy to read.
            </p>
          </div>
          <ModeToggle 
            mode={inputs.mode as "simple" | "advanced"} 
            onChange={(mode) => setInputs((current) => ({ ...current, mode }))} 
          />
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="fd-deposit"
            label="Deposit amount"
            value={inputs.depositAmount as string}
            min={10000}
            max={10000000}
            step={10000}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                depositAmount: event.target.value
              }))
            }
          />

          <SliderInput
            id="fd-rate"
            label="Annual rate"
            value={inputs.annualRatePct as string}
            min={1}
            max={15}
            step={0.1}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                annualRatePct: event.target.value
              }))
            }
          />

          <SliderInput
            id="fd-tenure"
            label="Tenure in months"
            value={inputs.tenureMonths as string}
            min={6}
            max={120}
            step={6}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                tenureMonths: event.target.value
              }))
            }
          />

          <div className="field">
            <label className="field__label" htmlFor="fd-compounding">
              Compounding frequency
            </label>
            <select
              id="fd-compounding"
              className="text-input"
              value={inputs.compoundingFrequency as string}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  compoundingFrequency: event.target.value
                }))
              }
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half-yearly">Half-yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Advanced FD Settings">
            <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="field">
                <label className="field__label" htmlFor="fd-payout">
                  Interest Payout Frequency
                </label>
                <select
                  id="fd-payout"
                  className="text-input"
                  value={inputs.payoutFrequency as string}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      payoutFrequency: event.target.value
                    }))
                  }
                >
                  <option value="cumulative">Cumulative (At Maturity)</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="field" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <input
                  type="checkbox"
                  id="fd-senior"
                  checked={inputs.seniorCitizen === "true"}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      seniorCitizen: event.target.checked ? "true" : "false"
                    }))
                  }
                  style={{ width: "20px", height: "20px" }}
                />
                <label className="field__label" htmlFor="fd-senior" style={{ margin: 0, fontWeight: 600 }}>
                  Senior Citizen (+0.5% Returns)
                </label>
              </div>

              <div className="field" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <input
                  type="checkbox"
                  id="fd-tds"
                  checked={inputs.tdsEnabled === "true"}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      tdsEnabled: event.target.checked ? "true" : "false"
                    }))
                  }
                  style={{ width: "20px", height: "20px" }}
                />
                <label className="field__label" htmlFor="fd-tds" style={{ margin: 0, fontWeight: 600 }}>
                  Deduct TDS (10%)
                </label>
              </div>
            </div>
          </AdvancedOptionsAccordion>
        )}
      </div>

      <div className="calculator-results">
        <ResultInsightPanel
          title="What this fixed deposit gives you"
          summary="You keep your original deposit protected while earning a fixed return over the selected period."
          supportingPoints={[
            inputs.payoutFrequency === "cumulative" 
              ? `Your deposit could grow to ${formatCurrency(result.maturityValue)} by maturity.`
              : `You will get payouts of ${formatCurrency(result.payoutPerPeriod)} per period.`,
            `That means ${formatCurrency(result.interestEarned)} would come purely from interest.`
          ]}
        />
        <div className="calculator-metric-grid">
          <ResultSummaryCard
            caption="Amount you receive at maturity"
            label="Maturity value"
            value={formatCurrency(result.maturityValue)}
            valueTestId="fd-maturity-value"
            tone="positive"
          />
          <ResultSummaryCard
            caption="Return earned above your original deposit"
            label="Interest earned"
            value={formatCurrency(result.interestEarned)}
          />
          {result.totalTdsDeducted > 0 && (
            <ResultSummaryCard
              caption="Taxes deducted at source (10%)"
              label="TDS Deducted"
              value={formatCurrency(result.totalTdsDeducted)}
              tone="caution"
            />
          )}
          {result.payoutPerPeriod > 0 && (
            <ResultSummaryCard
              caption={`Amount paid out safely per ${inputs.payoutFrequency}`}
              label="Periodic Payout"
              value={formatCurrency(result.payoutPerPeriod)}
              tone="positive"
            />
          )}
        </div>
      </div>
    </section>
  );
}
