

import { useMemo } from "react";

import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateSimpleHomeLoan } from "@/lib/calculations/home-loan-simple/home-loan-simple";
import { calculateAdvancedHomeLoan, type LoanScheduleRow } from "@/lib/calculations/home-loan-advanced/home-loan-advanced";
import { parseSimpleLoanInput, type ValidationIssue } from "@/lib/validation/calculator-inputs";
import { Button } from "@/components/primitives/button";
import { exportToExcel, type ExcelColumn } from "@/lib/export/excel-export";
const DEFAULT_INPUTS = {
  principal: "4500000",
  annualRatePct: "8.75",
  tenureMonths: "240",
  mode: "simple",
  strategy: "keep-emi-adjust-tenure",
  prepaymentAmount: "200000",
  prepaymentMonth: "6"
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getErrorMessage(issues: ValidationIssue[], field: string) {
  return issues.find((issue) => issue.field === field)?.message;
}

export function HomeLoanCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("home-loan", DEFAULT_INPUTS);

  const isAdvanced = inputs.mode === "advanced";
  const validation = parseSimpleLoanInput(inputs);
  const validationIssues = validation.ok ? [] : validation.issues;

  const result = useMemo(() => {
    if (!validation.ok) return null;

    if (isAdvanced) {
      return calculateAdvancedHomeLoan({
        principal: {
          value: validation.data.principal.value,
          currency: "INR"
        },
        annualRatePct: validation.data.annualRatePct,
        tenureMonths: validation.data.tenureMonths,
        strategy: inputs.strategy as "keep-emi-adjust-tenure" | "keep-tenure-adjust-emi",
        events: [
          {
            id: "prepay-1",
            monthIndex: Number(inputs.prepaymentMonth),
            type: "prepayment",
            amount: { value: Number(inputs.prepaymentAmount), currency: "INR" }
          }
        ]
      });
    }

    const simpleResult = calculateSimpleHomeLoan({
      principal: validation.data.principal.value,
      annualRatePct: validation.data.annualRatePct,
      tenureMonths: validation.data.tenureMonths
    });

    return {
      finalMonthlyEmi: { value: simpleResult.monthlyEmi.value, currency: "INR" },
      totalRepayment: { value: simpleResult.totalRepayment.value, currency: "INR" },
      totalInterest: { value: simpleResult.totalInterest.value, currency: "INR" },
      finalTenureMonths: validation.data.tenureMonths,
      totalPrepaymentAmount: { value: 0, currency: "INR" },
      impactSummary: []
    };
  }, [validation, inputs, isAdvanced]);

  const validatedTenureMonths = result ? result.finalTenureMonths : inputs.tenureMonths;

  const handleExport = async () => {
    if (!result || !('schedule' in result)) return;
    const schedule = (result as { schedule: LoanScheduleRow[] }).schedule;
    
    const data = schedule.map((row) => ({
      month: row.monthIndex,
      opening: row.openingBalance.value,
      emi: row.emi.value,
      principal: row.principalPaid.value,
      interest: row.interestPaid.value,
      closing: row.closingBalance.value,
      event: row.eventApplied || '-'
    }));

    const columns: ExcelColumn<typeof data[0]>[] = [
      { header: 'Month', key: 'month', width: 10, format: 'number' },
      { header: 'Opening Balance', key: 'opening', width: 20, format: 'currency' },
      { header: 'EMI', key: 'emi', width: 15, format: 'currency' },
      { header: 'Principal Paid', key: 'principal', width: 15, format: 'currency', color: 'FFD1FAE5' },
      { header: 'Interest Paid', key: 'interest', width: 15, format: 'currency', color: 'FFFEE2E2' },
      { header: 'Closing Balance', key: 'closing', width: 20, format: 'currency' },
      { header: 'Event', key: 'event', width: 15, format: 'text' },
    ];

    await exportToExcel('home-loan-schedule', 'Schedule', data, columns);
  };

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p className="eyebrow">Home loan planner</p>
            <h2>Plan your home loan journey</h2>
            <p className="hero-copy">
              See standard EMI schedules or model real-world events like mid-tenure prepayments.
            </p>
          </div>
          <ModeToggle 
            mode={inputs.mode as "simple" | "advanced"} 
            onChange={(mode) => setInputs((current) => ({ ...current, mode }))} 
          />
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="home-loan-principal"
            label="Home loan amount"
            value={inputs.principal as string}
            min={100000}
            max={50000000}
            step={100000}
            onChange={(event) =>
              setInputs((current) => ({ ...current, principal: event.target.value }))
            }
          />
          <SliderInput
            id="home-loan-rate"
            label="Annual interest rate"
            value={inputs.annualRatePct as string}
            min={1}
            max={20}
            step={0.1}
            onChange={(event) =>
              setInputs((current) => ({ ...current, annualRatePct: event.target.value }))
            }
          />
          <SliderInput
            id="home-loan-tenure"
            label="Tenure in months"
            value={inputs.tenureMonths as string}
            min={12}
            max={360}
            step={12}
            onChange={(event) =>
              setInputs((current) => ({ ...current, tenureMonths: event.target.value }))
            }
          />
        </div>

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Scenario Modeling (Prepayments & Strategy)">
            <div className="calculator-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="field">
                <label className="field__label" htmlFor="advanced-home-loan-strategy">
                  Adjustment Strategy After Given Events
                </label>
                <select
                  id="advanced-home-loan-strategy"
                  className="text-input"
                  value={inputs.strategy as string}
                  onChange={(event) =>
                    setInputs((current) => ({
                      ...current,
                      strategy: event.target.value
                    }))
                  }
                >
                  <option value="keep-emi-adjust-tenure">Keep EMI, adjust tenure</option>
                  <option value="keep-tenure-adjust-emi">Keep tenure, adjust EMI</option>
                </select>
              </div>

              <SliderInput
                id="advanced-home-loan-prepayment"
                label="Lump Sum Prepayment Amount"
                value={inputs.prepaymentAmount as string}
                min={0}
                max={5000000}
                step={10000}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    prepaymentAmount: event.target.value
                  }))
                }
              />
              <SliderInput
                id="advanced-home-loan-prepay-month"
                label={`Prepayment Month (1 to ${inputs.tenureMonths})`}
                value={inputs.prepaymentMonth as string}
                min={1}
                max={Number(inputs.tenureMonths)}
                step={1}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    prepaymentMonth: event.target.value
                  }))
                }
              />
            </div>
          </AdvancedOptionsAccordion>
        )}

        {validationIssues.length > 0 ? (
          <p className="calculator-shell__error">
            {getErrorMessage(validationIssues, "principal") ??
              "Enter valid home loan inputs to see EMI results."}
          </p>
        ) : null}
      </div>

      {result ? (
        <>
          <div className="calculator-results">
            <ResultInsightPanel
              title="What this scenario is telling you"
              summary={isAdvanced ? `With this strategy, your plan lands at about ${formatCurrency(result.finalMonthlyEmi.value)} per month.` : `Your current estimate is ${formatCurrency(result.finalMonthlyEmi.value)} per month.`}
              supportingPoints={[
                `The full repayment path comes to ${formatCurrency(result.totalRepayment.value)}.`,
                isAdvanced ? `You are planning to prepay ${formatCurrency(result.totalPrepaymentAmount.value)}.` : `The interest portion alone would be ${formatCurrency(result.totalInterest.value)}.`
              ]}
            />
            <div className="calculator-metric-grid">
              <ResultSummaryCard
                caption="End-state monthly payment"
                label="Final monthly EMI"
                value={formatCurrency(result.finalMonthlyEmi.value)}
                tone="positive"
              />
              <ResultSummaryCard
                caption="Total paid across the journey"
                label="Total repayment"
                value={formatCurrency(result.totalRepayment.value)}
              />
              <ResultSummaryCard
                caption={isAdvanced ? "Extra amount paid" : "Cost over time"}
                label={isAdvanced ? "Total prepayment" : "Total interest"}
                value={formatCurrency(isAdvanced ? result.totalPrepaymentAmount.value : result.totalInterest.value)}
                tone="caution"
              />
            </div>
          </div>

          {isAdvanced && result.impactSummary && result.impactSummary.length > 0 && (
            <section className="calculator-panel" style={{ marginTop: "24px" }}>
              <h3>Impact summary</h3>
              <ul className="impact-summary" style={{ paddingLeft: "24px", color: "var(--color-text-muted-light)" }}>
                {result.impactSummary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {isAdvanced && 'schedule' in result && (
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleExport} variant="primary">
                Download Schedule (Excel)
              </Button>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
