import { Link, useParams } from "wouter";
import { Suspense } from "react";
import { CalculatorRoute } from "@/components/calculator-route";
import { PageMeta } from "@/components/primitives/page-meta";

const CALCULATOR_COPY = {
  "personal-loan": {
    title: "Personal Loan EMI Calculator India | India Money Toolkit",
    heading: "Personal Loan EMI",
    description: "Monthly EMI, total interest, and true cost — before you commit.",
    badge: "Loan"
  },
  "home-loan": {
    title: "Home Loan EMI Calculator India | India Money Toolkit",
    heading: "Home Loan EMI",
    description: "EMI check with prepayment and rate-change scenarios.",
    badge: "Loan"
  },
  sip: {
    title: "SIP Calculator India | India Money Toolkit",
    heading: "SIP Calculator",
    description: "See how monthly investing compounds over time.",
    badge: "Investing"
  },
  "fixed-deposit": {
    title: "Fixed Deposit Calculator India | India Money Toolkit",
    heading: "Fixed Deposit",
    description: "Maturity value and interest earned across compounding options.",
    badge: "Savings"
  },
  "emergency-fund": {
    title: "Emergency Fund Calculator India | India Money Toolkit",
    heading: "Emergency Fund",
    description: "How much buffer you need and how long to build it.",
    badge: "Planning"
  },
  "credit-card-payoff": {
    title: "Credit Card Payoff Calculator India | India Money Toolkit",
    heading: "Credit Card Payoff",
    description: "Debt-free date and true cost of carrying a balance.",
    badge: "Planning"
  },
  "rent-vs-buy": {
    title: "Rent vs Buy Calculator India | India Money Toolkit",
    heading: "Rent vs Buy",
    description: "Compare total outflows over your chosen horizon.",
    badge: "Planning"
  }
} as const;

type CalculatorSlug = keyof typeof CALCULATOR_COPY;

const RELATED: Record<CalculatorSlug, CalculatorSlug[]> = {
  "personal-loan": ["home-loan", "emergency-fund"],
  "home-loan": ["personal-loan", "rent-vs-buy"],
  sip: ["fixed-deposit", "emergency-fund"],
  "fixed-deposit": ["sip", "emergency-fund"],
  "emergency-fund": ["sip", "credit-card-payoff"],
  "credit-card-payoff": ["personal-loan", "emergency-fund"],
  "rent-vs-buy": ["home-loan", "personal-loan"]
};

const SLUG_LABELS: Record<CalculatorSlug, string> = {
  "personal-loan": "Personal Loan EMI",
  "home-loan": "Home Loan EMI",
  sip: "SIP Calculator",
  "fixed-deposit": "Fixed Deposit",
  "emergency-fund": "Emergency Fund",
  "credit-card-payoff": "Credit Card Payoff",
  "rent-vs-buy": "Rent vs Buy"
};

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

  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <PageMeta title={calc.title} description={calc.description} />

      {/* Page header — compact, not a big hero box */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <Link className="back-link" href="/">← All calculators</Link>
        <span style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>/</span>
        <span style={{
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--text-faint)"
        }}>{calc.badge}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h1 style={{
          fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15,
          color: "var(--text)"
        }}>{calc.heading}</h1>
        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
          {calc.description}
        </p>
      </div>

      {/* Calculator — inputs + results side by side on desktop */}
      <Suspense>
        <CalculatorRoute slug={slug} />
      </Suspense>

      {/* Related calculators — compact inline row */}
      {related.length > 0 && (
        <div style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "20px",
          display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap"
        }}>
          <span style={{
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "var(--text-faint)"
          }}>Also try</span>
          {related.map(r => (
            <Link
              key={r}
              href={`/calculators/${r}`}
              style={{
                fontSize: "0.83rem", fontWeight: 600,
                color: "var(--blue)", textDecoration: "none",
                padding: "4px 10px",
                border: "1px solid var(--border)",
                borderRadius: "6px",
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
        fontSize: "0.78rem", color: "var(--text-faint)"
      }}>
        Results are estimates for planning purposes only. Always verify with your lender or bank.
      </footer>
    </main>
  );
}
