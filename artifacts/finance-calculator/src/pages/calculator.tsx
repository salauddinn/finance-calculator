import { Link, useParams } from "wouter";
import { Suspense } from "react";
import { CalculatorRoute } from "@/components/calculator-route";

const CALCULATOR_COPY = {
  "personal-loan": {
    title: "Personal Loan Calculator",
    description: "Estimate EMI, total repayment, and interest with clear assumptions."
  },
  "home-loan": {
    title: "Home Loan Calculator",
    description: "Switch between simple and advanced planning for realistic home loan scenarios."
  },
  sip: {
    title: "SIP Calculator",
    description: "Project monthly investments, maturity value, and estimated returns."
  },
  "fixed-deposit": {
    title: "Fixed Deposit Calculator",
    description: "Check maturity value and interest earned across compounding options."
  }
} as const;

type CalculatorSlug = keyof typeof CALCULATOR_COPY;

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

  const calculator = CALCULATOR_COPY[slug as CalculatorSlug];

  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <Link className="back-link" href="/">
        Back to all calculators
      </Link>
      <section className="calculator-entry__panel">
        <div className="calculator-entry__hero">
          <p className="landing-badge">Calculator entry</p>
          <h1>{calculator.title}</h1>
          <p className="hero-copy">{calculator.description}</p>
        </div>
      </section>
      <section className="calculator-entry__panel">
        <Suspense>
          <CalculatorRoute slug={slug} />
        </Suspense>
      </section>
    </main>
  );
}
