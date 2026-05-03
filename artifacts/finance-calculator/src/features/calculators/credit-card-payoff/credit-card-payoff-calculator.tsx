import { useMemo, useState } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
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
        ? `Credit Card Payoff\nBalance: ${fmt(Number(balance))}\nMonthly payment: ${fmt(Number(monthlyPayment))}\nWarning: Payment too low — doesn't cover monthly interest.`
        : "Credit Card Payoff\nBalance is zero or invalid.";
    }
    return [
      "Credit Card Payoff Summary — India Money Toolkit",
      `Balance: ${fmt(Number(balance))}`,
      `Annual rate: ${annualRate}%`,
      `Monthly payment: ${fmt(Number(monthlyPayment))}`,
      `Months to repay: ${result.monthsToRepay}`,
      `Total interest: ${fmt(result.totalInterest)}`,
      `Total paid: ${fmt(result.totalPaid)}`,
      "",
      "Estimates based on monthly compounding.",
      "Calculate yours: indiamoneytoolkit.com/calculators/credit-card-payoff",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Credit card payoff calculator</p>
          <h2>Your debt-free timeline</h2>
        </div>
        <div className="calculator-grid">
          <SliderInput
            id="cc-balance"
            label="Outstanding balance (₹)"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            min={1000} max={1000000} step={1000}
          />
          <SliderInput
            id="cc-rate"
            label="Annual interest rate (%)"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            min={1} max={60} step={0.5}
          />
          <SliderInput
            id="cc-payment"
            label="Monthly payment (₹)"
            value={monthlyPayment}
            onChange={(e) => setMonthlyPayment(e.target.value)}
            min={500} max={500000} step={500}
          />
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="calculator-results">
          {!result.ok && result.reason === "payment_too_low" ? (
            <div style={{ padding: "20px 22px" }}>
              <p style={{ fontWeight: 700, color: "var(--amber)", marginBottom: "4px" }}>
                Payment too low
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>
                At {annualRate}% annual interest, {fmt(Number(monthlyPayment))}/month doesn't cover the first month's interest. Increase your payment to make progress.
              </p>
            </div>
          ) : result.ok ? (
            <>
              <ResultSummaryCard
                isHero
                label="Months to repay"
                value={`${result.monthsToRepay} months`}
                sublabel={`Paying ${fmt(Number(monthlyPayment))}/month at ${annualRate}% p.a.`}
                tone="positive"
              />

              <BreakdownBar
                valueA={Number(balance)}
                valueB={result.totalInterest}
                labelA="Principal"
                labelB="Interest"
                colorA="blue"
                colorB="red"
                formattedA={fmt(Number(balance))}
                formattedB={fmt(result.totalInterest)}
              />

              <div className="calculator-metric-grid">
                <ResultSummaryCard
                  label="Total interest"
                  caption="Cost of carrying this balance"
                  value={fmt(result.totalInterest)}
                  tone="caution"
                />
                <ResultSummaryCard
                  label="Total amount paid"
                  caption="Principal + all interest"
                  value={fmt(result.totalPaid)}
                />
              </div>

              <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <WhatsAppShareButton getText={getSummaryText} />
                <CopySummaryButton getText={getSummaryText} />
              </div>
              <p style={{ padding: "0 22px 14px", fontSize: "0.75rem", color: "var(--text-3)" }}>
                Monthly compounding simulation. May differ from card statement.
              </p>
            </>
          ) : null}
        </div>
      )}
    </section>
  );
}
