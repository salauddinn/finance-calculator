import { CalculatorCategoryCard } from "@/components/layout/calculator-category-card";
import { ContinueCalculatorLink } from "@/components/layout/continue-calculator-link";

const CALCULATOR_CARDS = [
  {
    title: "Personal Loan Calculator",
    highlight: "Borrowing clarity",
    description:
      "Understand the monthly commitment before you commit, with totals that are easy to review.",
    href: "/calculators/personal-loan"
  },
  {
    title: "Home Loan Calculator",
    highlight: "Big-decision planning",
    description:
      "Start with a simple EMI check, then move into advanced prepayment and rate-change scenarios.",
    href: "/calculators/home-loan"
  },
  {
    title: "SIP Calculator",
    highlight: "Long-term investing",
    description:
      "See how regular monthly investing could grow over time without needing finance jargon.",
    href: "/calculators/sip"
  },
  {
    title: "Fixed Deposit Calculator",
    highlight: "Low-risk savings",
    description:
      "Check what you get back at maturity and how much of that is earned interest.",
    href: "/calculators/fixed-deposit"
  }
] as const;

export default function HomePage() {
  return (
    <main className="landing-shell" id="main-content" tabIndex={-1}>
      <section className="landing-hero">
        <div className="landing-hero__content">
          <p className="eyebrow">India-first finance planning</p>
          <h1>Finance calculators for real life decisions</h1>
          <p className="hero-copy">
            Plan loans, SIP growth, and fixed deposits with clearer assumptions,
            calmer visuals, and numbers that are easier to act on.
          </p>
        </div>
        <div className="landing-hero__spotlight">
          <p className="landing-hero__spotlight-label">Built for everyday clarity</p>
          <p className="landing-hero__spotlight-copy">
            Designed for salary earners, first-time investors, and real financial
            planning.
          </p>
          <div className="landing-hero__spotlight-grid">
            <div>
              <strong>5</strong>
              <span>Core calculators</span>
            </div>
            <div>
              <strong>2</strong>
              <span>Home loan modes</span>
            </div>
            <div>
              <strong>0</strong>
              <span>Accounts required</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Trust messaging">
        <div className="trust-strip__block">
          <p className="trust-strip__eyebrow">What makes this different</p>
          <p>Built for transparent assumptions, not hidden surprises.</p>
        </div>
        <div className="trust-strip__block">
          <p className="trust-strip__eyebrow">Why people use it</p>
          <p>Every result is designed to feel readable, reviewable, and calm.</p>
        </div>
        <div className="trust-strip__block">
          <p className="trust-strip__eyebrow">Where to start</p>
          <p>Understand the monthly commitment before you commit.</p>
        </div>
        <ContinueCalculatorLink />
      </section>

      <section className="category-grid" aria-label="Calculator categories">
        <div className="section-heading">
          <p className="eyebrow">Choose a starting point</p>
          <h2>Pick the calculator that matches your next money decision</h2>
          <p className="hero-copy">
            Each calculator is designed to show the main answer first, then
            explain the supporting numbers in plain language.
          </p>
        </div>
        {CALCULATOR_CARDS.map((card) => (
          <CalculatorCategoryCard key={card.href} {...card} />
        ))}
      </section>
    </main>
  );
}
