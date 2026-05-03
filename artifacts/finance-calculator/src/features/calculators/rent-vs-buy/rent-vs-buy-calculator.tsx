import { useMemo } from "react";
import { ResultSummaryCard } from "@/components/primitives/result-summary-card";
import { BreakdownBar } from "@/components/primitives/breakdown-bar";
import { SliderInput } from "@/components/primitives/slider-input";
import { CopySummaryButton } from "@/components/primitives/copy-summary-button";
import { WhatsAppShareButton } from "@/components/primitives/whatsapp-share-button";
import { useCalculatorPreferences } from "@/features/preferences/use-calculator-preferences";
import { calculateRentVsBuy } from "@/lib/calculations/rent-vs-buy/rent-vs-buy";

const FMT = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const fmt = (v: number) => FMT.format(v);

const CONCLUSIONS = {
  renting_cheaper: "Renting appears cheaper over this period.",
  buying_better:   "Buying may be better value over this period.",
  close:           "The numbers are close — lifestyle factors matter here.",
};
const CONCLUSION_TONE = {
  renting_cheaper: "positive",
  buying_better:   "positive",
  close:           "default",
} as const;

export function RentVsBuyCalculator() {
  const [inputs, setInputs] = useCalculatorPreferences("rent-vs-buy", {
    monthlyRent:      "25000",
    homePrice:        "7500000",
    downPayment:      "1500000",
    loanRate:         "8.5",
    loanTenure:       "20",
    appreciation:     "6",
    rentIncrease:     "5",
    comparisonYears:  "10",
  });

  const result = useMemo(() => {
    const hp = Number(inputs.homePrice);
    const lt = Number(inputs.loanTenure);
    const cy = Number(inputs.comparisonYears);
    if (hp <= 0 || lt <= 0 || cy <= 0) return null;
    return calculateRentVsBuy({
      monthlyRent:          Number(inputs.monthlyRent),
      homePrice:            hp,
      downPayment:          Number(inputs.downPayment),
      annualLoanRatePct:    Number(inputs.loanRate),
      loanTenureYears:      lt,
      annualAppreciationPct: Number(inputs.appreciation),
      annualRentIncreasePct: Number(inputs.rentIncrease),
      comparisonYears:      cy,
    });
  }, [inputs]);

  function getSummaryText() {
    if (!result) return "";
    return [
      "Rent vs Buy Summary — India Money Toolkit",
      `Monthly rent: ${fmt(Number(inputs.monthlyRent))}`,
      `Home price: ${fmt(Number(inputs.homePrice))}`,
      `Down payment: ${fmt(Number(inputs.downPayment))}`,
      `Loan rate: ${inputs.loanRate}% · Tenure: ${inputs.loanTenure} years`,
      `Comparison period: ${inputs.comparisonYears} years`,
      `EMI: ${fmt(result.monthlyEmi)}`,
      `Total rent paid: ${fmt(result.totalRentPaid)}`,
      `Total buying outflow: ${fmt(result.totalBuyingOutflow)}`,
      `Estimated home value: ${fmt(result.futureHomeValue)}`,
      `Conclusion: ${CONCLUSIONS[result.conclusion]}`,
      "",
      "Simplified estimate. Taxes, maintenance & opportunity cost not included.",
      "https://indiamoneytoolkit.com/calculators/rent-vs-buy",
    ].join("\n");
  }

  return (
    <section className="calculator-shell">
      {/* ── Inputs ── */}
      <div className="calculator-panel">
        <div className="calculator-copy">
          <p className="eyebrow">🏠 Rent vs buy calculator</p>
          <h2>Compare renting vs buying</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--text-2)", marginTop: "2px" }}>
            Total outflow comparison over your chosen horizon — not accounting for opportunity cost.
          </p>
        </div>
        <div className="calculator-grid">
          <SliderInput id="rvb-rent" label="Monthly rent (₹)" value={inputs.monthlyRent}
            onChange={(e) => setInputs((c) => ({ ...c, monthlyRent: e.target.value })) } min={5_000} max={200_000} step={1_000} />
          <SliderInput id="rvb-home-price" label="Home price (₹)" value={inputs.homePrice}
            onChange={(e) => setInputs((c) => ({ ...c, homePrice: e.target.value }))} min={1_000_000} max={100_000_000} step={100_000} />
          <SliderInput id="rvb-down-payment" label="Down payment (₹)" value={inputs.downPayment}
            onChange={(e) => setInputs((c) => ({ ...c, downPayment: e.target.value }))} min={0} max={50_000_000} step={100_000}
            hint="Typically 10–20% of home price" />
          <SliderInput id="rvb-loan-rate" label="Loan interest rate (%)" value={inputs.loanRate}
            onChange={(e) => setInputs((c) => ({ ...c, loanRate: e.target.value }))} min={5} max={20} step={0.1} />
          <SliderInput id="rvb-tenure" label="Loan tenure (years)" value={inputs.loanTenure}
            onChange={(e) => setInputs((c) => ({ ...c, loanTenure: e.target.value }))} min={5} max={30} step={1} />
          <SliderInput id="rvb-appreciation" label="Annual home appreciation (%)" value={inputs.appreciation}
            onChange={(e) => setInputs((c) => ({ ...c, appreciation: e.target.value }))} min={0} max={20} step={0.5}
            hint="India historical average: 5–8% in most cities" />
          <SliderInput id="rvb-rent-increase" label="Annual rent increase (%)" value={inputs.rentIncrease}
            onChange={(e) => setInputs((c) => ({ ...c, rentIncrease: e.target.value }))} min={0} max={20} step={0.5}
            hint="Typical landlord hike: 5–10% per year" />
          <SliderInput id="rvb-comparison-years" label="Comparison period (years)" value={inputs.comparisonYears}
            onChange={(e) => setInputs((c) => ({ ...c, comparisonYears: e.target.value }))} min={1} max={30} step={1} />
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="calculator-results">
          <ResultSummaryCard
            isHero
            label="Verdict"
            value={
              result.conclusion === "renting_cheaper" ? "Renting cheaper"
              : result.conclusion === "buying_better" ? "Buying better"
              : "Roughly equal"
            }
            sublabel={CONCLUSIONS[result.conclusion]}
            tone={CONCLUSION_TONE[result.conclusion]}
          />

          <BreakdownBar
            valueA={result.totalRentPaid}
            valueB={result.totalBuyingOutflow}
            labelA="Total rent"
            labelB="Total buying"
            colorA="green"
            colorB="muted"
            formattedA={fmt(result.totalRentPaid)}
            formattedB={fmt(result.totalBuyingOutflow)}
          />

          <div className="calculator-metric-grid">
            <ResultSummaryCard label="Monthly EMI" caption={`${inputs.loanTenure}y loan at ${inputs.loanRate}%`} value={fmt(result.monthlyEmi)} />
            <ResultSummaryCard label="Total rent paid" caption={`Over ${inputs.comparisonYears} years with increases`} value={fmt(result.totalRentPaid)} />
            <ResultSummaryCard label="Total buying outflow" caption="Down payment + all EMIs" value={fmt(result.totalBuyingOutflow)} />
            <ResultSummaryCard label="Future home value" caption={`At ${inputs.appreciation}% annual appreciation`} value={fmt(result.futureHomeValue)} tone="positive" />
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
