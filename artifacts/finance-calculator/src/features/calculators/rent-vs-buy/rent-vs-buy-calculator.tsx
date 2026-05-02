import { useMemo, useState } from "react";
import { ResultInsightPanel } from "@/components/primitives/result-insight-panel";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { calculateRentVsBuy } from "@/lib/calculations/rent-vs-buy/rent-vs-buy";

const FMT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmt = (v: number) => FMT.format(v);

const CONCLUSIONS = {
  renting_cheaper: "Based on these estimates, renting appears cheaper over this period.",
  buying_better: "Based on these estimates, buying may be better value over this period.",
  close: "The numbers are close — this decision depends on personal and lifestyle factors."
};

export function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState("25000");
  const [homePrice, setHomePrice] = useState("7500000");
  const [downPayment, setDownPayment] = useState("1500000");
  const [loanRate, setLoanRate] = useState("8.5");
  const [loanTenure, setLoanTenure] = useState("20");
  const [appreciation, setAppreciation] = useState("6");
  const [rentIncrease, setRentIncrease] = useState("5");
  const [comparisonYears, setComparisonYears] = useState("10");

  const result = useMemo(() => {
    const hp = Number(homePrice);
    const dp = Number(downPayment);
    const lt = Number(loanTenure);
    const cy = Number(comparisonYears);
    if (hp <= 0 || lt <= 0 || cy <= 0) return null;
    return calculateRentVsBuy({
      monthlyRent: Number(monthlyRent),
      homePrice: hp,
      downPayment: dp,
      annualLoanRatePct: Number(loanRate),
      loanTenureYears: lt,
      annualAppreciationPct: Number(appreciation),
      annualRentIncreasePct: Number(rentIncrease),
      comparisonYears: cy
    });
  }, [monthlyRent, homePrice, downPayment, loanRate, loanTenure, appreciation, rentIncrease, comparisonYears]);

  function getSummaryText() {
    if (!result) return "";
    return [
      "Rent vs Buy Summary",
      `Monthly rent: ${fmt(Number(monthlyRent))}`,
      `Home price: ${fmt(Number(homePrice))}`,
      `Down payment: ${fmt(Number(downPayment))}`,
      `Loan rate: ${loanRate}%`,
      `Loan tenure: ${loanTenure} years`,
      `Comparison period: ${comparisonYears} years`,
      `Estimated EMI: ${fmt(result.monthlyEmi)}`,
      `Total rent over period: ${fmt(result.totalRentPaid)}`,
      `Total buying outflow: ${fmt(result.totalBuyingOutflow)}`,
      `Estimated future home value: ${fmt(result.futureHomeValue)}`,
      `Conclusion: ${CONCLUSIONS[result.conclusion]}`,
      "This is a simplified estimate. Taxes, maintenance, and opportunity cost are not included."
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">Rent vs buy calculator</p>
          <h2>Compare renting and buying over time</h2>
          <p className="hero-copy">
            A simplified comparison of total outflows when renting versus buying a home over your chosen period. Results are estimates.
          </p>
        </div>
        <div className="calculator-grid">
          <SliderInput
            id="rvb-rent"
            label="Current monthly rent (₹)"
            value={monthlyRent}
            onChange={e => setMonthlyRent(e.target.value)}
            min={5000} max={200000} step={1000}
          />
          <SliderInput
            id="rvb-home-price"
            label="Home price (₹)"
            value={homePrice}
            onChange={e => setHomePrice(e.target.value)}
            min={1000000} max={100000000} step={100000}
          />
          <SliderInput
            id="rvb-down-payment"
            label="Down payment (₹)"
            value={downPayment}
            onChange={e => setDownPayment(e.target.value)}
            min={0} max={50000000} step={100000}
          />
          <SliderInput
            id="rvb-loan-rate"
            label="Loan interest rate (%)"
            value={loanRate}
            onChange={e => setLoanRate(e.target.value)}
            min={5} max={20} step={0.1}
          />
          <SliderInput
            id="rvb-tenure"
            label="Loan tenure (years)"
            value={loanTenure}
            onChange={e => setLoanTenure(e.target.value)}
            min={5} max={30} step={1}
          />
          <SliderInput
            id="rvb-appreciation"
            label="Annual home appreciation (%)"
            value={appreciation}
            onChange={e => setAppreciation(e.target.value)}
            min={0} max={20} step={0.5}
          />
          <SliderInput
            id="rvb-rent-increase"
            label="Annual rent increase (%)"
            value={rentIncrease}
            onChange={e => setRentIncrease(e.target.value)}
            min={0} max={20} step={0.5}
          />
          <SliderInput
            id="rvb-comparison-years"
            label="Comparison period (years)"
            value={comparisonYears}
            onChange={e => setComparisonYears(e.target.value)}
            min={1} max={30} step={1}
          />
        </div>
      </div>

      {result && (
        <div className="calculator-results">
          <ResultInsightPanel
            title="Rent vs buy — simplified estimate"
            summary={CONCLUSIONS[result.conclusion]}
            supportingPoints={[
              `Total rent paid over ${comparisonYears} years: ${fmt(result.totalRentPaid)}.`,
              `Total buying outflow (down payment + EMIs): ${fmt(result.totalBuyingOutflow)}.`,
              `Estimated home value after ${comparisonYears} years: ${fmt(result.futureHomeValue)}.`
            ]}
          />
          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Estimated monthly EMI"
              caption={`${loanTenure}-year loan at ${loanRate}%`}
              value={fmt(result.monthlyEmi)}
            />
            <ResultSummaryCard
              label="Total rent paid"
              caption={`Over ${comparisonYears} years with annual increases`}
              value={fmt(result.totalRentPaid)}
            />
            <ResultSummaryCard
              label="Total buying outflow"
              caption="Down payment + EMIs over period"
              value={fmt(result.totalBuyingOutflow)}
            />
            <ResultSummaryCard
              label="Estimated future home value"
              caption={`At ${appreciation}% annual appreciation`}
              value={fmt(result.futureHomeValue)}
              tone="positive"
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <CopySummaryButton getText={getSummaryText} />
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted, #888)", marginTop: "0.5rem" }}>
            This is a simplified estimate. Taxes, maintenance, brokerage, and opportunity cost are not included in v1.
          </p>
        </div>
      )}
    </section>
  );
}
