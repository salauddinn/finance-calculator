import { useMemo, useState } from "react";
import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { calculateCreditCardPayoff } from "@/lib/calculations/credit-card-payoff/credit-card-payoff";

const FMT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmt = (v: number) => FMT.format(v);

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState("50000");
  const [annualRate, setAnnualRate] = useState("36");
  const [monthlyPayment, setMonthlyPayment] = useState("3000");

  const result = useMemo(() => {
    const b = Number(balance);
    const r = Number(annualRate);
    const p = Number(monthlyPayment);
    if (b <= 0 || r <= 0 || p <= 0) return null;
    return calculateCreditCardPayoff({ balance: b, annualRatePct: r, monthlyPayment: p });
  }, [balance, annualRate, monthlyPayment]);

  function getSummaryText() {
    if (!result) return "";
    if (!result.ok) {
      return result.reason === "payment_too_low"
        ? `Credit Card Payoff\nBalance: ${fmt(Number(balance))}\nMonthly payment: ${fmt(Number(monthlyPayment))}\nWarning: Payment is too low — it does not cover the monthly interest.`
        : `Credit Card Payoff\nBalance is zero or invalid.`;
    }
    return [
      "Credit Card Payoff Summary",
      `Outstanding balance: ${fmt(Number(balance))}`,
      `Annual interest rate: ${annualRate}%`,
      `Monthly payment: ${fmt(Number(monthlyPayment))}`,
      `Months to repay: ${result.monthsToRepay}`,
      `Total interest: ${fmt(result.totalInterest)}`,
      `Total amount paid: ${fmt(result.totalPaid)}`,
      "Results are estimates based on a simple monthly simulation."
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Credit card payoff calculator</p>
          <h2>See when you will be free of credit card debt</h2>
          <p className="hero-copy">
            Enter your outstanding balance, interest rate, and what you can pay monthly to get a realistic payoff timeline.
          </p>
        </div>
        <div className="calculator-grid">
          <SliderInput
            id="cc-balance"
            label="Outstanding balance (₹)"
            value={balance}
            onChange={e => setBalance(e.target.value)}
            min={1000} max={1000000} step={1000}
          />
          <SliderInput
            id="cc-rate"
            label="Annual interest rate (%)"
            value={annualRate}
            onChange={e => setAnnualRate(e.target.value)}
            min={1} max={60} step={0.5}
          />
          <SliderInput
            id="cc-payment"
            label="Monthly payment (₹)"
            value={monthlyPayment}
            onChange={e => setMonthlyPayment(e.target.value)}
            min={500} max={500000} step={500}
          />
        </div>
      </div>

      {result && (
        <div className="calculator-results">
          {!result.ok && result.reason === "payment_too_low" && (
            <ResultInsightPanel
              title="Payment too low to reduce the balance"
              summary={`At ${annualRate}% annual interest, your monthly payment of ${fmt(Number(monthlyPayment))} does not cover the first month's interest. Increase your monthly payment to make progress on this debt.`}
              supportingPoints={[]}
            />
          )}
          {result.ok && (
            <>
              <ResultInsightPanel
                title="Your debt-free timeline"
                summary={`Paying ${fmt(Number(monthlyPayment))} per month, you will clear this balance in ${result.monthsToRepay} months.`}
                supportingPoints={[
                  `You will pay ${fmt(result.totalInterest)} in interest on top of the original balance.`,
                  `Total amount paid: ${fmt(result.totalPaid)}.`
                ]}
              />
              <div className="calculator-metric-grid">
                <ResultSummaryCard
                  label="Months to repay"
                  caption="Based on your monthly payment"
                  value={`${result.monthsToRepay} months`}
                  tone="positive"
                />
                <ResultSummaryCard
                  label="Total interest"
                  caption="Cost of carrying this balance"
                  value={fmt(result.totalInterest)}
                  tone="caution"
                />
                <ResultSummaryCard
                  label="Total amount paid"
                  caption="Principal + interest combined"
                  value={fmt(result.totalPaid)}
                />
              </div>
            </>
          )}
          <div style={{ marginTop: "1rem" }}>
            <CopySummaryButton getText={getSummaryText} />
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted, #888)", marginTop: "0.5rem" }}>
            Simulation uses monthly compounding. Results are estimates and may differ from your card statement.
          </p>
        </div>
      )}
    </section>
  );
}
