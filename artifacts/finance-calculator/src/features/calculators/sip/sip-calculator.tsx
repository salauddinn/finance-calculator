

import { useMemo } from "react";

import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateSip } from "@/lib/calculations/sip/calculate-sip";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function SipCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("sip", {
    monthlyContribution: "10000",
    annualReturnPct: "12",
    durationMonths: "24",
    mode: "simple",
    stepUpPercentage: "0",
    inflationRate: "0",
    taxationEnabled: "false"
  });

  const isAdvanced = inputs.mode === "advanced";

  const result = useMemo(
    () =>
      calculateSip({
        monthlyContribution: Number(inputs.monthlyContribution),
        annualReturnPct: Number(inputs.annualReturnPct),
        durationMonths: Number(inputs.durationMonths),
          advancedConfig: isAdvanced
          ? {
              stepUpPercentage: Number(inputs.stepUpPercentage),
              inflationRate: Number(inputs.inflationRate),
              taxationEnabled: inputs.taxationEnabled === "true"
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
            <p className="eyebrow">SIP calculator</p>
            <h2>Plan monthly investments with confidence</h2>
            <p className="hero-copy">We assume you invest the same amount every month and keep the return rate steady.</p>
          </div>
          <ModeToggle 
            mode={inputs.mode as "simple" | "advanced"} 
            onChange={(mode) => setInputs((current) => ({ ...current, mode }))} 
          />
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="sip-monthly-contribution"
            label="Monthly contribution"
            value={inputs.monthlyContribution as string}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                monthlyContribution: event.target.value
              }))
            }
            min={500}
            max={500000}
            step={500}
          />
          <SliderInput
            id="sip-annual-return"
            label="Expected annual return (%)"
            value={inputs.annualReturnPct as string}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                annualReturnPct: event.target.value
              }))
            }
            min={1}
            max={50}
            step={0.5}
          />
          <SliderInput
            id="sip-duration-months"
            label="Duration in months"
            value={inputs.durationMonths as string}
            onChange={(event) =>
              setInputs((current) => ({
                ...current,
                durationMonths: event.target.value
              }))
            }
            min={6}
            max={360}
            step={6}
          />
        </div>

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Advanced SIP Settings">
            <div className="calculator-grid">
              <SliderInput
                id="sip-step-up"
                label="Annual Step-up (%)"
                value={inputs.stepUpPercentage as string}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    stepUpPercentage: event.target.value
                  }))
                }
                min={0}
                max={50}
                step={1}
              />
              <SliderInput
                id="sip-inflation-rate"
                label="Inflation Rate (%)"
                value={inputs.inflationRate as string}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    inflationRate: event.target.value
                  }))
                }
                min={0}
                max={15}
                step={1}
              />
              <div className="field" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                <input
                  type="checkbox"
                  id="sip-taxation"
                  checked={inputs.taxationEnabled === "true"}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      taxationEnabled: event.target.checked ? "true" : "false"
                    }))
                  }
                  style={{ width: "20px", height: "20px" }}
                />
                <label className="field__label" htmlFor="sip-taxation" style={{ margin: 0, fontWeight: 600 }}>
                  Apply standard LTCG Tax (12.5% on gains)
                </label>
              </div>
            </div>
          </AdvancedOptionsAccordion>
        )}
      </div>

      {result ? (
        <div className="calculator-results">
          <ResultInsightPanel
            title="What this means for your investing goal"
            summary={`If returns stay steady, your money could grow to ${formatCurrency(result.maturityValue.value)} over ${inputs.durationMonths} months.`}
            supportingPoints={[
              `Your own invested amount would be ${formatCurrency(result.investedAmount.value)}.`,
              `The projected gain would be ${formatCurrency(result.estimatedReturns.value)}.`
            ]}
          />
          <div className="calculator-metric-grid">
            <ResultSummaryCard
              caption="Your money contributed"
              label="Invested amount"
              value={formatCurrency(result.investedAmount.value)}
            />
            <ResultSummaryCard
              caption="Projected growth on top of your contributions"
              label="Estimated returns"
              value={formatCurrency(result.estimatedReturns.value)}
              tone="positive"
            />
            <ResultSummaryCard
              caption="Total projected value at the end"
              label="Maturity value"
              value={formatCurrency(result.maturityValue.value)}
              tone="positive"
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <CopySummaryButton getText={() => [
              "SIP Summary",
              `Monthly contribution: ${formatCurrency(Number(inputs.monthlyContribution))}`,
              `Expected annual return: ${inputs.annualReturnPct}%`,
              `Duration: ${inputs.durationMonths} months`,
              `Invested amount: ${formatCurrency(result.investedAmount.value)}`,
              `Estimated returns: ${formatCurrency(result.estimatedReturns.value)}`,
              `Maturity value: ${formatCurrency(result.maturityValue.value)}`,
              "Results are estimates. Actual returns may vary."
            ].join("\n")} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
