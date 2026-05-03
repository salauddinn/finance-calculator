import { Link } from "wouter";
import { PageMeta } from "@/components/primitives/page-meta";

export default function AboutPage() {
  return (
    <main className="calculator-entry" id="main-content" tabIndex={-1}>
      <PageMeta
        title="About | India Money Toolkit"
        description="Learn what India Money Toolkit does, who it is for, and how it keeps your data private."
      />
      <Link className="back-link" href="/">Back to calculators</Link>
      <section className="calculator-entry__panel">
        <div className="calculator-entry__hero">
          <p className="landing-badge">About</p>
          <h1>About India Money Toolkit</h1>
          <p className="hero-copy">
            Simple, fast calculators for Indian personal finance — built for everyone, not just finance professionals.
          </p>
        </div>
      </section>
      <section className="calculator-entry__panel">
        <div style={{ maxWidth: "640px", lineHeight: 1.8 }}>
          <h2 style={{ marginBottom: "0.75rem" }}>What it does</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            India Money Toolkit gives you focused calculators for the financial decisions that come up most often in daily life — planning an EMI, projecting SIP returns, building an emergency buffer, comparing rent versus buying, and managing credit card debt. Each calculator shows you the most important number first and keeps the supporting detail close by.
          </p>
          <h2 style={{ marginBottom: "0.75rem" }}>Who it is for</h2>
          <ul style={{ marginBottom: "1.5rem", paddingLeft: "1.25rem" }}>
            <li>Salaried professionals planning loans, savings, and household decisions.</li>
            <li>Students and early-career users learning personal finance basics.</li>
            <li>Families comparing common financial choices.</li>
          </ul>
          <h2 style={{ marginBottom: "0.75rem" }}>Not financial advice</h2>
          <p style={{ marginBottom: "1.5rem" }}>
            This toolkit is built for simple planning and quick estimates, not professional financial advice. Every calculator labels its results as estimates and recommends verifying important decisions with a qualified advisor or official provider terms.
          </p>
          <p>
            <Link href="/disclaimer" style={{ color: "var(--accent, #4f8ef7)" }}>Read the full disclaimer</Link>
            {" · "}
            <Link href="/privacy" style={{ color: "var(--accent, #4f8ef7)" }}>Privacy policy</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
