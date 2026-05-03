import { useMemo } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { Button } from "@/components/primitives/button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { parseSimpleLoanInput, type ValidationIssue } from "@/lib/validation/calculator-inputs";
import { calculatePersonalLoan } from "@/lib/calculations/personal-loan/personal-loan";
import { calculatePersonalLoanAdvanced, type LoanScheduleRow } from "@/lib/calculations/personal-loan/calculate-personal-loan-advanced";
import { exportToExcel, type ExcelColumn } from "@/lib/export/excel-export";

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format;

function getErrorMessage(issues: ValidationIssue[], field: string) {
  return issues.find((i) => i.field === field)?.message;
}

export function PersonalLoanCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("personal-loan", {
    principal:           "500000",
    annualRatePct:       "10.5",
    tenureMonths:        "24",
    mode:                "simple",
    delayEmiMonths:      "0",
    processingFeeAmount: "0",
  });

  const isAdvanced = inputs.mode === "advanced";
  const validation = parseSimpleLoanInput(inputs);

  const result = useMemo(() => {
    if (!validation.ok) return null;
    if (isAdvanced) {
      return calculatePersonalLoanAdvanced({
        principal: validation.data.principal,
        annualRatePct: validation.data.annualRatePct,
        tenureMonths: validation.data.tenureMonths,
        delayEmiMonths: Number(inputs.delayEmiMonths),
        processingFeeAmount: { value: Number(inputs.processingFeeAmount), currency: "INR" },
        prepayments: [],
      });
    }
    const raw = calculatePersonalLoan({
      principal: validation.data.principal.value,
      annualRatePct: validation.data.annualRatePct,
      tenureMonths: validation.data.tenureMonths,
    });
    return {
      monthlyEmi:        { value: raw.monthlyEmi },
      totalRepayment:    { value: raw.totalRepayment },
      totalInterest:     { value: raw.totalInterest },
      effectiveAprPct:   validation.data.annualRatePct,
      finalTenureMonths: validation.data.tenureMonths,
    };
  }, [validation, inputs, isAdvanced]);

  const validationIssues = validation.ok ? [] : validation.issues;
  const tenureMonths = result ? result.finalTenureMonths : Number(inputs.tenureMonths);

  function getSummaryText() {
    if (!result) return "";
    return (
      `💰 Personal Loan EMI — India Money Toolkit\n` +
      `Loan amount: ${fmt(Number(inputs.principal))}\n` +
      `Rate: ${inputs.annualRatePct}% · Tenure: ${tenureMonths} months\n` +
      `Monthly EMI: ${fmt(result.monthlyEmi.value)}\n` +
      `Total interest: ${fmt(result.totalInterest.value)}\n` +
      `Total repayment: ${fmt(result.totalRepayment.value)}\n` +
      `https://indiamoneytoolkit.com/calculators/personal-loan`
    );
  }

  const handleExport = async () => {
    if (!result || !("schedule" in result)) return;
    const schedule = (result as { schedule: LoanScheduleRow[] }).schedule;
    const data = schedule.map((row) => ({
      month: row.monthIndex, opening: row.openingBalance.value, emi: row.emi.value,
      principal: row.principalPaid.value, interest: row.interestPaid.value,
      closing: row.closingBalance.value, event: row.eventApplied || "-",
    }));
    const columns: ExcelColumn<typeof data[0]>[] = [
      { header: "Month", key: "month", width: 10, format: "number" },
      { header: "Opening Balance", key: "opening", width: 20, format: "currency" },
      { header: "EMI", key: "emi", width: 15, format: "currency" },
      { header: "Principal Paid", key: "principal", width: 15, format: "currency", color: "FFD1FAE5" },
      { header: "Interest Paid", key: "interest", width: 15, format: "currency", color: "FFFEE2E2" },
      { header: "Closing Balance", key: "closing", width: 20, format: "currency" },
      { header: "Event", key: "event", width: 15, format: "text" },
    ];
    await exportToExcel("personal-loan-schedule", "Schedule", data, columns);
  };

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div className="calculator-copy">
            <p className="eyebrow">💰 Personal loan EMI calculator</p>
            <h2>Plan your personal loan</h2>
          </div>
          <ModeToggle
            mode={inputs.mode as "simple" | "advanced"}
            onChange={(mode) => setInputs((c) => ({ ...c, mode }))}
          />
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="pl-principal"
            label="Loan amount (₹)"
            value={inputs.principal}
            min={10_000} max={5_000_000} step={10_000}
            onChange={(e) => setInputs((c) => ({ ...c, principal: e.target.value }))}
          />
          <SliderInput
            id="pl-rate"
            label="Annual interest rate (%)"
            value={inputs.annualRatePct}
            min={1} max={36} step={0.1}
            hint="Personal loan rates typically 10–24% p.a."
            onChange={(e) => setInputs((c) => ({ ...c, annualRatePct: e.target.value }))}
          />
          <SliderInput
            id="pl-tenure"
            label="Tenure (months)"
            value={inputs.tenureMonths}
            min={6} max={84} step={6}
            hint="Most banks offer personal loans up to 60–84 months"
            onChange={(e) => setInputs((c) => ({ ...c, tenureMonths: e.target.value }))}
          />
        </div>

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Processing fee & EMI delay">
            <div className="calculator-grid">
              <SliderInput
                id="pl-processing-fee"
                label="Processing fee (₹)"
                value={inputs.processingFeeAmount}
                min={0} max={50_000} step={500}
                hint="Typically 1–3% of loan amount — raises effective APR"
                onChange={(e) => setInputs((c) => ({ ...c, processingFeeAmount: e.target.value }))}
              />
              <SliderInput
                id="pl-delay-emi"
                label="EMI moratorium / delay (months)"
                value={inputs.delayEmiMonths}
                min={0} max={12} step={1}
                hint="Interest accrues during any delay period"
                onChange={(e) => setInputs((c) => ({ ...c, delayEmiMonths: e.target.value }))}
              />
            </div>
          </AdvancedOptionsAccordion>
        )}

        {validationIssues.length > 0 && (
          <p className="calculator-shell__error">
            {getErrorMessage(validationIssues, "principal") ?? "Enter a valid loan amount to see EMI results."}
          </p>
        )}
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Monthly EMI"
            value={fmt(result.monthlyEmi.value)}
            sublabel={`${tenureMonths} months · ${inputs.annualRatePct}% p.a. · ${fmt(Number(inputs.principal))} loan`}
            tone="positive"
          />

          <BreakdownBar
            valueA={Number(inputs.principal)}
            valueB={result.totalInterest.value}
            labelA="Principal"
            labelB="Interest"
            colorA="blue"
            colorB="amber"
            formattedA={fmt(Number(inputs.principal))}
            formattedB={fmt(result.totalInterest.value)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Total repayment"
              caption="Principal + all interest"
              value={fmt(result.totalRepayment.value)}
            />
            <ResultSummaryCard
              label="Total interest"
              caption="True cost of this loan"
              value={fmt(result.totalInterest.value)}
              tone="caution"
            />
            {isAdvanced && result.effectiveAprPct !== undefined && (
              <ResultSummaryCard
                label="Effective APR"
                caption="Including fees & delays"
                value={`${result.effectiveAprPct.toFixed(2)}%`}
                tone={result.effectiveAprPct > Number(inputs.annualRatePct) ? "caution" : "default"}
              />
            )}
          </div>

          {isAdvanced && "schedule" in result && (
            <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border-sub)" }}>
              <Button onClick={handleExport} variant="secondary">
                Download amortisation schedule (Excel)
              </Button>
            </div>
          )}

          <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <WhatsAppShareButton getText={getSummaryText} />
            <CopySummaryButton getText={getSummaryText} />
          </div>

          <p style={{ padding: "0 22px 14px", fontSize: "0.75rem", color: "var(--text-3)" }}>
            Calculated using reducing balance method. Actual EMI may vary; verify with your lender.
          </p>
        </div>
      )}
    </section>
  );
}
