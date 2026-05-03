import { useMemo, useState } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { calculateRentVsBuy } from "@/lib/calculations/rent-vs-buy/rent-vs-buy";

const FMT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmt = (v: number) => FMT.format(v);

const CONCLUSIONS = {
  renting_cheaper: "Renting appears cheaper over this period.",
  buying_better: "Buying may be better value over this period.",
  close: "The numbers are close — lifestyle factors matter here.",
};

const CONCLUSION_TONE = {
  renting_cheaper: "positive",
  buying_better: "positive",
  close: "default",
} as const;

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
    const lt = Number(loanTenure);
    const cy = Number(comparisonYears);
    if (hp <= 0 || lt <= 0 || cy <= 0) return null;
    return calculateRentVsBuy({
      monthlyRent: Number(monthlyRent),
      homePrice: hp,
      downPayment: Number(downPayment),
      annualLoanRatePct: Number(loanRate),
      loanTenureYears: lt,
      annualAppreciationPct: Number(appreciation),
      annualRentIncreasePct: Number(rentIncrease),
      comparisonYears: cy,
    });
  }, [monthlyRent, homePrice, downPayment, loanRate, loanTenure, appreciation, rentIncrease, comparisonYears]);

  function getSummaryText() {
    if (!result) return "";
    return [
      "Rent vs Buy Summary — India Money Toolkit",
      `Monthly rent: ${fmt(Number(monthlyRent))}`,
      `Home price: ${fmt(Number(homePrice))}`,
      `Down payment: ${fmt(Number(downPayment))}`,
      `Loan rate: ${loanRate}% · Tenure: ${loanTenure} years`,
      `Comparison period: ${comparisonYears} years`,
      `EMI: ${fmt(result.monthlyEmi)}`,
      `Total rent paid: ${fmt(result.totalRentPaid)}`,
      `Total buying outflow: ${fmt(result.totalBuyingOutflow)}`,
      `Estimated home value: ${fmt(result.futureHomeValue)}`,
      `Conclusion: ${CONCLUSIONS[result.conclusion]}`,
      "",
      "Simplified estimate. Taxes, maintenance, and opportunity cost not included.",
      "Calculate yours: indiamoneytoolkit.com/calculators/rent-vs-buy",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🏠 Rent vs buy calculator</p>
          <h2>Compare renting vs buying</h2>
        </div>
        <div className="calculator-grid">
          <SliderInput id="rvb-rent" label="Monthly rent (₹)" value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)} min={5000} max={200000} step={1000} />
          <SliderInput id="rvb-home-price" label="Home price (₹)" value={homePrice}
            onChange={(e) => setHomePrice(e.target.value)} min={1000000} max={100000000} step={100000} />
          <SliderInput id="rvb-down-payment" label="Down payment (₹)" value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)} min={0} max={50000000} step={100000} />
          <SliderInput id="rvb-loan-rate" label="Loan interest rate (%)" value={loanRate}
            onChange={(e) => setLoanRate(e.target.value)} min={5} max={20} step={0.1} />
          <SliderInput id="rvb-tenure" label="Loan tenure (years)" value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)} min={5} max={30} step={1} />
          <SliderInput id="rvb-appreciation" label="Annual home appreciation (%)" value={appreciation}
            onChange={(e) => setAppreciation(e.target.value)} min={0} max={20} step={0.5} />
          <SliderInput id="rvb-rent-increase" label="Annual rent increase (%)" value={rentIncrease}
            onChange={(e) => setRentIncrease(e.target.value)} min={0} max={20} step={0.5} />
          <SliderInput id="rvb-comparison-years" label="Comparison period (years)" value={comparisonYears}
            onChange={(e) => setComparisonYears(e.target.value)} min={1} max={30} step={1} />
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Verdict"
            value={result.conclusion === "renting_cheaper" ? "Renting cheaper" : result.conclusion === "buying_better" ? "Buying better" : "Roughly equal"}
            sublabel={CONCLUSIONS[result.conclusion]}
            tone={CONCLUSION_TONE[result.conclusion]}
          />

          <BreakdownBar
            valueA={result.totalRentPaid}
            valueB={result.totalBuyingOutflow}
            labelA="Total rent"
            labelB="Total buying"
            colorA="green"
            colorB="blue"
            formattedA={fmt(result.totalRentPaid)}
            formattedB={fmt(result.totalBuyingOutflow)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard
              label="Monthly EMI"
              caption={`${loanTenure}y loan at ${loanRate}%`}
              value={fmt(result.monthlyEmi)}
            />
            <ResultSummaryCard
              label="Total rent paid"
              caption={`Over ${comparisonYears} years with increases`}
              value={fmt(result.totalRentPaid)}
            />
            <ResultSummaryCard
              label="Total buying outflow"
              caption="Down payment + all EMIs"
              value={fmt(result.totalBuyingOutflow)}
            />
            <ResultSummaryCard
              label="Future home value"
              caption={`At ${appreciation}% annual appreciation`}
              value={fmt(result.futureHomeValue)}
              tone="positive"
            />
          </div>

          <div className="result-actions" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <WhatsAppShareButton getText={getSummaryText} />
            <CopySummaryButton getText={getSummaryText} />
          </div>
          <p style={{ padding: "0 22px 14px", fontSize: "0.75rem", color: "var(--text-3)" }}>
            Simplified estimate. Taxes, maintenance, and opportunity cost not included.
          </p>
        </div>
      )}
    </section>
  );
}
