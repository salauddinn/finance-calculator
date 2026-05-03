import { useMemo, useState } from "react";

import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { ModeToggle } from "@/components/primitives/mode-toggle";
import { AdvancedOptionsAccordion } from "@/components/primitives/advanced-options-accordion";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
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
  prepaymentMonth: "6",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(value);
}

function getErrorMessage(issues: ValidationIssue[], field: string) {
  return issues.find((issue) => issue.field === field)?.message;
}

type YearlyRow = {
  year: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
};

function computeYearlyAmortization(
  principal: number,
  annualRatePct: number,
  months: number
): YearlyRow[] {
  const monthlyRate = annualRatePct / 100 / 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  let balance = principal;
  const rows: YearlyRow[] = [];
  let month = 0;
  let year = 1;

  while (month < months && balance > 1) {
    const openingBalance = balance;
    let yearInterest = 0;
    let yearPrincipal = 0;
    const monthsInYear = Math.min(12, months - month);

    for (let m = 0; m < monthsInYear; m++) {
      const interest = balance * monthlyRate;
      const principalPaid = Math.min(emi - interest, balance);
      yearInterest += interest;
      yearPrincipal += principalPaid;
      balance -= principalPaid;
    }

    rows.push({
      year,
      openingBalance: Math.round(openingBalance),
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      closingBalance: Math.round(Math.max(0, balance)),
    });

    month += monthsInYear;
    year++;
  }

  return rows;
}

export function HomeLoanCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("home-loan", DEFAULT_INPUTS);
  const [showAmort, setShowAmort] = useState(false);

  const isAdvanced = inputs.mode === "advanced";
  const validation = parseSimpleLoanInput(inputs);
  const validationIssues = validation.ok ? [] : validation.issues;

  const result = useMemo(() => {
    if (!validation.ok) return null;
    if (isAdvanced) {
      return calculateAdvancedHomeLoan({
        principal: { value: validation.data.principal.value, currency: "INR" },
        annualRatePct: validation.data.annualRatePct,
        tenureMonths: validation.data.tenureMonths,
        strategy: inputs.strategy as "keep-emi-adjust-tenure" | "keep-tenure-adjust-emi",
        events: [{
          id: "prepay-1",
          monthIndex: Number(inputs.prepaymentMonth),
          type: "prepayment",
          amount: { value: Number(inputs.prepaymentAmount), currency: "INR" },
        }],
      });
    }
    const simpleResult = calculateSimpleHomeLoan({
      principal: validation.data.principal.value,
      annualRatePct: validation.data.annualRatePct,
      tenureMonths: validation.data.tenureMonths,
    });
    return {
      finalMonthlyEmi: { value: simpleResult.monthlyEmi.value, currency: "INR" },
      totalRepayment: { value: simpleResult.totalRepayment.value, currency: "INR" },
      totalInterest: { value: simpleResult.totalInterest.value, currency: "INR" },
      finalTenureMonths: validation.data.tenureMonths,
      totalPrepaymentAmount: { value: 0, currency: "INR" },
      impactSummary: [],
    };
  }, [validation, inputs, isAdvanced]);

  const amortSchedule = useMemo(() => {
    if (!validation.ok || !showAmort) return [];
    return computeYearlyAmortization(
      validation.data.principal.value,
      validation.data.annualRatePct,
      validation.data.tenureMonths
    );
  }, [validation, showAmort]);

  const handleExport = async () => {
    if (!result || !("schedule" in result)) return;
    const schedule = (result as { schedule: LoanScheduleRow[] }).schedule;
    const data = schedule.map((row) => ({
      month: row.monthIndex,
      opening: row.openingBalance.value,
      emi: row.emi.value,
      principal: row.principalPaid.value,
      interest: row.interestPaid.value,
      closing: row.closingBalance.value,
      event: row.eventApplied || "-",
    }));
    const columns: ExcelColumn<(typeof data)[0]>[] = [
      { header: "Month", key: "month", width: 10, format: "number" },
      { header: "Opening Balance", key: "opening", width: 20, format: "currency" },
      { header: "EMI", key: "emi", width: 15, format: "currency" },
      { header: "Principal Paid", key: "principal", width: 15, format: "currency", color: "FFD1FAE5" },
      { header: "Interest Paid", key: "interest", width: 15, format: "currency", color: "FFFEE2E2" },
      { header: "Closing Balance", key: "closing", width: 20, format: "currency" },
      { header: "Event", key: "event", width: 15, format: "text" },
    ];
    await exportToExcel("home-loan-schedule", "Schedule", data, columns);
  };

  const months = Number(inputs.tenureMonths);
  const years = Math.floor(months / 12);
  const durationLabel = `${years}y`;

  function getSummaryText() {
    if (!result) return "";
    return [
      "Home Loan Summary — India Money Toolkit",
      `Loan amount: ${formatCurrency(Number(inputs.principal))}`,
      `Annual rate: ${inputs.annualRatePct}%`,
      `Tenure: ${months} months (${durationLabel})`,
      `Monthly EMI: ${formatCurrency(result.finalMonthlyEmi.value)}`,
      `Total interest: ${formatCurrency(result.totalInterest.value)}`,
      `Total repayment: ${formatCurrency(result.totalRepayment.value)}`,
      "",
      "Estimates only. Verify with your lender.",
      "Calculate yours: indiamoneytoolkit.com/calculators/home-loan",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div className="calculator-copy">
            <p className="eyebrow">🏡 Home loan planner</p>
            <h2>Plan your home loan journey</h2>
          </div>
          <ModeToggle
            mode={inputs.mode as "simple" | "advanced"}
            onChange={(mode) => setInputs((c) => ({ ...c, mode }))}
          />
        </div>

        <div className="calculator-grid">
          <SliderInput
            id="home-loan-principal"
            label="Home loan amount (₹)"
            value={inputs.principal as string}
            min={100000} max={50000000} step={100000}
            onChange={(e) => setInputs((c) => ({ ...c, principal: e.target.value }))}
          />
          <SliderInput
            id="home-loan-rate"
            label="Annual interest rate (%)"
            value={inputs.annualRatePct as string}
            min={1} max={20} step={0.1}
            onChange={(e) => setInputs((c) => ({ ...c, annualRatePct: e.target.value }))}
          />
          <SliderInput
            id="home-loan-tenure"
            label="Tenure (months)"
            value={inputs.tenureMonths as string}
            min={12} max={360} step={12}
            onChange={(e) => setInputs((c) => ({ ...c, tenureMonths: e.target.value }))}
          />
        </div>

        {isAdvanced && (
          <AdvancedOptionsAccordion title="Prepayment & strategy">
            <div className="calculator-grid">
              <div className="field">
                <label className="field__label" htmlFor="advanced-home-loan-strategy">
                  After prepayment, adjust…
                </label>
                <select
                  id="advanced-home-loan-strategy"
                  className="text-input"
                  value={inputs.strategy as string}
                  onChange={(e) => setInputs((c) => ({ ...c, strategy: e.target.value }))}
                >
                  <option value="keep-emi-adjust-tenure">Tenure (keep EMI same)</option>
                  <option value="keep-tenure-adjust-emi">EMI (keep tenure same)</option>
                </select>
              </div>
              <SliderInput
                id="advanced-home-loan-prepayment"
                label="Lump-sum prepayment (₹)"
                value={inputs.prepaymentAmount as string}
                min={0} max={5000000} step={10000}
                onChange={(e) => setInputs((c) => ({ ...c, prepaymentAmount: e.target.value }))}
              />
              <SliderInput
                id="advanced-home-loan-prepay-month"
                label={`Prepayment at month (1–${inputs.tenureMonths})`}
                value={inputs.prepaymentMonth as string}
                min={1} max={Number(inputs.tenureMonths)} step={1}
                onChange={(e) => setInputs((c) => ({ ...c, prepaymentMonth: e.target.value }))}
              />
            </div>
          </AdvancedOptionsAccordion>
        )}

        {validationIssues.length > 0 && (
          <p className="calculator-shell__error">
            {getErrorMessage(validationIssues, "principal") ??
              "Enter valid home loan inputs."}
          </p>
        )}
      </div>

      {/* ── Results ── */}
      {result ? (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Monthly EMI"
            value={formatCurrency(result.finalMonthlyEmi.value)}
            sublabel={`per month · ${durationLabel} loan`}
            tone="positive"
          />

          <BreakdownBar
            valueA={Number(inputs.principal)}
            valueB={result.totalInterest.value}
            labelA="Principal"
            labelB="Interest"
            colorA="blue"
            colorB="amber"
            formattedA={formatCurrency(Number(inputs.principal))}
            formattedB={formatCurrency(result.totalInterest.value)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Total repayment"
              caption="Full amount paid over tenure"
              value={formatCurrency(result.totalRepayment.value)}
            />
            <ResultSummaryCard
              label="Total interest"
              caption="Cost over and above principal"
              value={formatCurrency(result.totalInterest.value)}
              tone="caution"
            />
            {isAdvanced && result.totalPrepaymentAmount.value > 0 && (
              <ResultSummaryCard
                label="Prepayment applied"
                caption="Lump-sum amount paid ahead"
                value={formatCurrency(result.totalPrepaymentAmount.value)}
                tone="positive"
              />
            )}
          </div>

          {isAdvanced && result.impactSummary && result.impactSummary.length > 0 && (
            <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border-sub)" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "6px" }}>
                Impact
              </p>
              <ul style={{ paddingLeft: "14px", display: "flex", flexDirection: "column", gap: "3px" }}>
                {result.impactSummary.map((item) => (
                  <li key={item} style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Amortisation table — simple and advanced */}
          {!isAdvanced && (
            <div style={{ padding: "0 22px 4px" }}>
              <button
                type="button"
                className="amort-toggle"
                onClick={() => setShowAmort((s) => !s)}
                aria-expanded={showAmort}
              >
                {showAmort ? "▲ Hide" : "▼ Show"} year-by-year amortisation
              </button>
            </div>
          )}

          {showAmort && !isAdvanced && amortSchedule.length > 0 && (
            <div className="amort-table-wrap">
              <table className="amort-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Opening</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Closing</th>
                  </tr>
                </thead>
                <tbody>
                  {amortSchedule.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{formatCurrency(row.openingBalance)}</td>
                      <td style={{ color: "var(--blue)", fontWeight: 600 }}>{formatCurrency(row.principalPaid)}</td>
                      <td style={{ color: "var(--amber)", fontWeight: 600 }}>{formatCurrency(row.interestPaid)}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(row.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isAdvanced && "schedule" in result && (
            <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border-sub)" }}>
              <Button onClick={handleExport} variant="secondary">
                Download schedule (Excel)
              </Button>
            </div>
          )}

          <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <WhatsAppShareButton getText={getSummaryText} />
            <CopySummaryButton getText={getSummaryText} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
