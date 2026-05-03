import { CalculatorCategoryCard } from "@/components/layout/calculator-category-card";
import { ContinueCalculatorLink } from "@/components/layout/continue-calculator-link";

const CALCULATOR_CARDS = [
  {
    category: "Loan",
    title: "Personal Loan Calculator",
    description:
      "Understand the monthly commitment before you commit, with totals that are easy to review.",
    href: "/calculators/personal-loan"
  },
  {
    category: "Loan",
    title: "Home Loan Calculator",
    description:
      "Start with a simple EMI check, then move into advanced prepayment and rate-change scenarios.",
    href: "/calculators/home-loan"
  },
  {
    category: "Investment",
    title: "SIP Calculator",
    description:
      "See how regular monthly investing could grow over time without needing finance jargon.",
    href: "/calculators/sip"
  },
  {
    category: "Savings",
    title: "Fixed Deposit Calculator",
    description:
      "Check what you get back at maturity and how much of that is earned interest.",
    href: "/calculators/fixed-deposit"
  }
] as const;

export default function HomePage() {
  return (
    <main className="landing-shell" id="main-content" tabIndex={-1}>
      <section className="landing-hero motion-fade-up motion-stagger-1">
        <p className="landing-badge">India-first finance tools</p>
        <div className="landing-hero__content">
          <h1>Money decisions, made clear</h1>
          <p className="hero-copy">
            Explore calculators for loans, investing, and savings with a calmer
            interface that helps the important numbers stand out quickly.
          </p>
          <div className="landing-hero__actions">
            <a className="button button--primary" href="#calculator-categories">
              Explore Calculators
            </a>
            <a className="button button--secondary" href="#homepage-stats">
              Learn more
            </a>
          </div>
          <ContinueCalculatorLink />
        </div>
      </section>

      <section
        className="category-grid"
        id="calculator-categories"
        aria-label="Calculator categories"
      >
        <div className="section-heading motion-fade-up motion-stagger-3">
          <p className="eyebrow">Choose a starting point</p>
          <h2>Find the calculator that matches your next move</h2>
          <p className="hero-copy">
            Each card opens a focused calculator with the main answer first and
            the supporting context close behind it.
          </p>
        </div>
        {CALCULATOR_CARDS.map((card, index) => (
          <CalculatorCategoryCard
            key={card.href}
            motionClassName={`motion-fade-up motion-stagger-${index + 1}`}
            {...card}
          />
        ))}
      </section>

      <section
        className="landing-stats motion-fade-up motion-stagger-2"
        id="homepage-stats"
        aria-label="Calculator highlights"
      >
        <article className="landing-stats__card">
          <strong>5</strong>
          <span>Calculators</span>
        </article>
        <article className="landing-stats__card">
          <strong>2</strong>
          <span>Home Loan Modes</span>
        </article>
        <article className="landing-stats__card">
          <strong>0</strong>
          <span>Accounts Required</span>
        </article>
      </section>
    </main>
  );
}
