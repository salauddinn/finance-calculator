import { Link, useParams } from "wouter";
import { Suspense } from "react";
import { CalculatorRoute } from "@/components/calculator-route";
import { PageMeta } from "@/components/primitives/page-meta";

const CALCULATOR_COPY = {
  "personal-loan": {
    title: "Personal Loan EMI Calculator India | India Money Toolkit",
    heading: "Personal Loan EMI Calculator",
    description: "Estimate your monthly EMI, total interest, and repayment amount for a personal loan. No login required.",
    badge: "Loan calculator"
  },
  "home-loan": {
    title: "Home Loan EMI Calculator India | India Money Toolkit",
    heading: "Home Loan EMI Calculator",
    description: "Calculate your home loan EMI, total interest, and repayment with simple and advanced modes. No login required.",
    badge: "Loan calculator"
  },
  sip: {
    title: "SIP Calculator India | India Money Toolkit",
    heading: "SIP Calculator",
    description: "Project your monthly SIP investment into future value with estimated returns. No login required.",
    badge: "Investment calculator"
  },
  "fixed-deposit": {
    title: "Fixed Deposit Calculator India | India Money Toolkit",
    heading: "Fixed Deposit Calculator",
    description: "Check your FD maturity value and interest earned across compounding options. No login required.",
    badge: "Savings calculator"
  },
  "emergency-fund": {
    title: "Emergency Fund Calculator India | India Money Toolkit",
    heading: "Emergency Fund Calculator",
    description: "Find out how much emergency savings you need and how long it will take to build the buffer. No login required.",
    badge: "Planning calculator"
  },
  "credit-card-payoff": {
    title: "Credit Card Payoff Calculator India | India Money Toolkit",
    heading: "Credit Card Payoff Calculator",
    description: "See your debt-free date and total interest cost based on your balance and monthly payment. No login required.",
    badge: "Planning calculator"
  },
  "rent-vs-buy": {
    title: "Rent vs Buy Calculator India | India Money Toolkit",
    heading: "Rent vs Buy Calculator",
    description: "Compare total outflows for renting and buying a home over your chosen period. Estimate only. No login required.",
    badge: "Planning calculator"
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
  "personal-loan": "Personal Loan",
  "home-loan": "Home Loan",
  sip: "SIP",
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
        <Link className="back-link" href="/">
          Back to all calculators
        </Link>
        <section className="calculator-entry__panel">
          <div className="calculator-entry__hero">
            <h1>Calculator not found</h1>
          </div>
        </section>
      </main>
    );
  }

  const calc = CALCULATOR_COPY[slug as CalculatorSlug];
  const related = RELATED[slug as CalculatorSlug];

  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <PageMeta title={calc.title} description={calc.description} />
      <Link className="back-link" href="/">
        Back to all calculators
      </Link>
      <section className="calculator-entry__panel">
        <div className="calculator-entry__hero">
          <p className="landing-badge">{calc.badge}</p>
          <h1>{calc.heading}</h1>
          <p className="hero-copy">{calc.description}</p>
        </div>
      </section>
      <section className="calculator-entry__panel">
        <Suspense>
          <CalculatorRoute slug={slug} />
        </Suspense>
      </section>
      {related.length > 0 && (
        <section className="calculator-entry__panel" style={{ paddingTop: "1.5rem" }}>
          <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Related calculators</p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {related.map(r => (
              <Link
                key={r}
                href={`/calculators/${r}`}
                className="button button--secondary"
                style={{ fontSize: "0.85rem" }}
              >
                {SLUG_LABELS[r]} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
