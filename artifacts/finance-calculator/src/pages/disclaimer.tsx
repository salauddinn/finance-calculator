import { Link } from "wouter";
import { PageMeta } from "@/components/primitives/page-meta";

export default function DisclaimerPage() {
  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <PageMeta
        title="Disclaimer | India Money Toolkit"
        description="All calculations on India Money Toolkit are estimates. Verify important decisions with a qualified professional."
      />
      <Link className="back-link" href="/">Back to calculators</Link>
      <section className="calculator-entry__panel">
        <div className="calculator-entry__hero">
          <p className="landing-badge">Disclaimer</p>
          <h1>Disclaimer</h1>
          <p className="hero-copy">
            Results shown on this site are estimates for planning purposes only.
          </p>
        </div>
      </section>
      <section className="calculator-entry__panel">
        <div style={{ maxWidth: "640px", lineHeight: 1.8 }}>
          <h2 style={{ marginBottom: "0.75rem" }}>Calculations are estimates</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            All results shown on India Money Toolkit — including EMI amounts, maturity values, interest totals, payoff timelines, and comparisons — are estimates based on simplified mathematical models. They are provided for general planning and illustrative purposes only.
          </p>
          <h2 style={{ marginBottom: "0.75rem" }}>Results may differ from official figures</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Actual amounts may differ from the results shown here due to rounding, lender-specific policies, tax treatment, processing fees, market conditions, and other factors not modelled by these calculators. Results should not be treated as a quote, offer, or guarantee from any bank, lender, or financial institution.
          </p>
          <h2 style={{ marginBottom: "0.75rem" }}>Not professional financial advice</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            This toolkit does not provide professional financial, tax, legal, or investment advice. For important financial decisions — such as taking a home loan, planning retirement, or managing significant debt — please consult a qualified financial advisor or verify directly with your bank, lender, or relevant authority.
          </p>
          <p>
            <Link href="/about" style={{ color: "var(--accent, #4f8ef7)" }}>About</Link>
            {" · "}
            <Link href="/privacy" style={{ color: "var(--accent, #4f8ef7)" }}>Privacy</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
