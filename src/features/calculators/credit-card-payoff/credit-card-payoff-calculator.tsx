import { useMemo } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateCreditCardPayoff } from "@/lib/calculations/credit-card-payoff/credit-card-payoff";

const FMT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmt = (v: number) => FMT.format(v);

export function CreditCardPayoffCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("credit-card-payoff", {
    balance:        "50000",
    annualRate:     "36",
    monthlyPayment: "3000",
  });

  const result = useMemo(() => {
    const b = Number(inputs.balance);
    const r = Number(inputs.annualRate);
    const p = Number(inputs.monthlyPayment);
    if (b <= 0 || r <= 0 || p <= 0) return null;
    return calculateCreditCardPayoff({ balance: b, annualRatePct: r, monthlyPayment: p });
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    if (!result.ok) {
      return result.reason === "payment_too_low"
        ? `Credit Card Payoff\nBalance: ${fmt(Number(inputs.balance))}\nMonthly payment: ${fmt(Number(inputs.monthlyPayment))}\nWarning: Payment too low — doesn't cover monthly interest.`
        : "Credit Card Payoff\nBalance is zero or invalid.";
    }
    return [
      "Credit Card Payoff Summary — India Money Toolkit",
      `Balance: ${fmt(Number(inputs.balance))}`,
      `Annual rate: ${inputs.annualRate}%`,
      `Monthly payment: ${fmt(Number(inputs.monthlyPayment))}`,
      `Months to repay: ${result.monthsToRepay}`,
      `Total interest: ${fmt(result.totalInterest)}`,
      `Total paid: ${fmt(result.totalPaid)}`,
      "",
      "Monthly compounding simulation. May differ from card statement.",
      "https://indiamoneytoolkit.com/calculators/credit-card-payoff",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">💳 Credit card payoff calculator</p>
          <h2>Your debt-free timeline</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", marginTop: "2px" }}>
            Indian credit cards charge 2.5–3.75%/month (30–45% p.a.) on revolving balances.
          </p>
        </div>
        <div className="calculator-grid">
          <SliderInput
            id="cc-balance"
            label="Outstanding balance (₹)"
            value={inputs.balance}
            onChange={(e) => setInputs((c) => ({ ...c, balance: e.target.value }))}
            min={1_000} max={1_000_000} step={1_000}
          />
          <SliderInput
            id="cc-rate"
            label="Annual interest rate (%)"
            value={inputs.annualRate}
            onChange={(e) => setInputs((c) => ({ ...c, annualRate: e.target.value }))}
            min={1} max={60} step={0.5}
            hint="Most Indian cards: 36–42% p.a. Check your card statement"
          />
          <SliderInput
            id="cc-payment"
            label="Monthly payment (₹)"
            value={inputs.monthlyPayment}
            onChange={(e) => setInputs((c) => ({ ...c, monthlyPayment: e.target.value }))}
            min={500} max={500_000} step={500}
            hint="Pay more than the minimum due to avoid debt trap"
          />
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="calculator-results">
          {!result.ok && result.reason === "payment_too_low" ? (
            <div style={{ padding: "24px 26px" }}>
              <p style={{ fontWeight: 700, color: "var(--amber)", marginBottom: "6px", fontSize: "1rem" }}>
                ⚠️ Payment too low
              </p>
              <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                At {inputs.annualRate}% annual interest, {fmt(Number(inputs.monthlyPayment))}/month doesn't
                cover the first month's interest. Increase your payment to make any progress on the balance.
              </p>
            </div>
          ) : result.ok ? (
            <>
              <ResultSummaryCard
                isHero
                label="Months to repay"
                value={`${result.monthsToRepay} months`}
                sublabel={`Paying ${fmt(Number(inputs.monthlyPayment))}/month at ${inputs.annualRate}% p.a.`}
                tone="positive"
              />

              <BreakdownBar
                valueA={Number(inputs.balance)}
                valueB={result.totalInterest}
                labelA="Principal"
                labelB="Interest"
                colorA="blue"
                colorB="red"
                formattedA={fmt(Number(inputs.balance))}
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
                Monthly compounding simulation. May differ from your card statement.
              </p>
            </>
          ) : null}
        </div>
      )}
    </section>
  );
}
