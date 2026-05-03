import { Link, useParams } from "wouter";
import { Suspense } from "react";
import { CalculatorRoute } from "@/components/calculator-route";
import { PageMeta } from "@/components/primitives/page-meta";

const CALCULATOR_COPY = {
  "personal-loan": {
    title: "Personal Loan EMI Calculator India | India Money Toolkit",
    heading: "Personal Loan EMI",
    description: "Monthly EMI, total interest, and true cost — before you commit.",
    badge: "Loan",
  },
  "home-loan": {
    title: "Home Loan EMI Calculator India | India Money Toolkit",
    heading: "Home Loan EMI",
    description: "EMI check with amortisation table, prepayment and rate-change scenarios.",
    badge: "Loan",
  },
  sip: {
    title: "SIP Calculator India — With Step-Up | India Money Toolkit",
    heading: "SIP Calculator",
    description: "See how monthly investing — with optional annual step-up — compounds over time.",
    badge: "Investing",
  },
  "fixed-deposit": {
    title: "Fixed Deposit Calculator India | India Money Toolkit",
    heading: "Fixed Deposit",
    description: "Maturity value and interest earned across compounding options.",
    badge: "Savings",
  },
  "emergency-fund": {
    title: "Emergency Fund Calculator India | India Money Toolkit",
    heading: "Emergency Fund",
    description: "How much buffer you need and how long to build it.",
    badge: "Planning",
  },
  "credit-card-payoff": {
    title: "Credit Card Payoff Calculator India | India Money Toolkit",
    heading: "Credit Card Payoff",
    description: "Debt-free date and true cost of carrying a balance.",
    badge: "Planning",
  },
  "rent-vs-buy": {
    title: "Rent vs Buy Calculator India | India Money Toolkit",
    heading: "Rent vs Buy",
    description: "Compare total outflows over your chosen horizon.",
    badge: "Planning",
  },
  ppf: {
    title: "PPF Calculator India 2025 — Public Provident Fund | India Money Toolkit",
    heading: "PPF Calculator",
    description: "15-year PPF maturity at current 7.1% interest rate with year-by-year breakdown.",
    badge: "Savings",
  },
  hra: {
    title: "HRA Exemption Calculator India | India Money Toolkit",
    heading: "HRA Exemption",
    description: "How much of your HRA is tax-free under Section 10(13A) of the Income Tax Act.",
    badge: "Tax",
  },
  lumpsum: {
    title: "Lumpsum Investment Calculator India | India Money Toolkit",
    heading: "Lumpsum Calculator",
    description: "What does a one-time investment grow to? Enter amount, rate, and years.",
    badge: "Investing",
  },
  "goal-sip": {
    title: "Goal SIP Calculator India — How Much to Invest Monthly | India Money Toolkit",
    heading: "Goal SIP Calculator",
    description: "Working backwards: how much monthly SIP do you need to reach your target corpus?",
    badge: "Investing",
  },
  "income-tax": {
    title: "Income Tax Calculator India FY 2025-26 — Old vs New Regime | India Money Toolkit",
    heading: "Income Tax Calculator",
    description: "Old vs New Regime comparison for FY 2025-26 with Budget 2025 slabs, surcharge and cess.",
    badge: "Tax",
  },
} as const;

type CalculatorSlug = keyof typeof CALCULATOR_COPY;

const RELATED: Record<CalculatorSlug, CalculatorSlug[]> = {
  "personal-loan": ["home-loan", "emergency-fund"],
  "home-loan": ["personal-loan", "rent-vs-buy"],
  sip: ["goal-sip", "lumpsum"],
  "fixed-deposit": ["sip", "ppf"],
  "emergency-fund": ["sip", "credit-card-payoff"],
  "credit-card-payoff": ["personal-loan", "emergency-fund"],
  "rent-vs-buy": ["home-loan", "personal-loan"],
  ppf: ["sip", "fixed-deposit"],
  hra: ["income-tax", "personal-loan"],
  lumpsum: ["sip", "goal-sip"],
  "goal-sip": ["sip", "lumpsum"],
  "income-tax": ["hra", "ppf"],
};

const SLUG_LABELS: Record<CalculatorSlug, string> = {
  "personal-loan": "Personal Loan EMI",
  "home-loan": "Home Loan EMI",
  sip: "SIP Calculator",
  lumpsum: "Lumpsum Calculator",
  "goal-sip": "Goal SIP",
  "income-tax": "Income Tax",
  "fixed-deposit": "Fixed Deposit",
  "emergency-fund": "Emergency Fund",
  "credit-card-payoff": "Credit Card Payoff",
  "rent-vs-buy": "Rent vs Buy",
  ppf: "PPF Calculator",
  hra: "HRA Exemption",
};

function buildJsonLd(slug: CalculatorSlug, calc: typeof CALCULATOR_COPY[CalculatorSlug]) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: calc.heading + " — India Money Toolkit",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    description: calc.description,
    url: `https://indiamoneytoolkit.com/calculators/${slug}`,
  };
}

export default function CalculatorPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  if (!(slug in CALCULATOR_COPY)) {
    return (
      <main className="calculator-entry" id="main-content" tabIndex={-1}>
        <Link className="back-link" href="/">← All calculators</Link>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Calculator not found</h1>
      </main>
    );
  }

  const calc = CALCULATOR_COPY[slug as CalculatorSlug];
  const related = RELATED[slug as CalculatorSlug];
  const jsonLd = buildJsonLd(slug as CalculatorSlug, calc);

  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <PageMeta title={calc.title} description={calc.description} jsonLd={jsonLd} />

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <Link className="back-link" href="/">← All calculators</Link>
        <span style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>/</span>
        <span style={{
          fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--text-faint)"
        }}>{calc.badge}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 style={{
          fontSize: "clamp(1.7rem, 3.5vw, 2.3rem)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.12,
          color: "var(--text)"
        }}>{calc.heading}</h1>
        <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
          {calc.description}
        </p>
      </div>

      <Suspense>
        <CalculatorRoute slug={slug} />
      </Suspense>

      {/* Related calculators */}
      {related.length > 0 && (
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "20px",
          display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap"
        }}>
          <span style={{
            fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--text-faint)"
          }}>Also try</span>
          {related.map(r => (
            <Link
              key={r}
              href={`/calculators/${r}`}
              style={{
                fontSize: "0.88rem", fontWeight: 600,
                color: "var(--blue)", textDecoration: "none",
                padding: "6px 14px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg-card)",
                transition: "border-color 140ms"
              }}
            >
              {SLUG_LABELS[r]}
            </Link>
          ))}
        </div>
      )}

      <footer style={{
        borderTop: "1px solid var(--border)", paddingTop: "16px",
        fontSize: "0.83rem", color: "var(--text-faint)"
      }}>
        Results are estimates for planning purposes only. Always verify with your lender or bank.
      </footer>
    </main>
  );
}
