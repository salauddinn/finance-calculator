import { Link } from "wouter";
import { CalculatorCategoryCard } from "@/components/layout/calculator-category-card";
import { ContinueCalculatorLink } from "@/components/layout/continue-calculator-link";
import { PageMeta } from "@/components/primitives/page-meta";

const LOAN_CALCULATORS = [
  {
    category: "Loans",
    title: "Personal Loan EMI Calculator",
    description: "Understand your monthly commitment before you commit — with totals that are easy to review.",
    href: "/calculators/personal-loan"
  },
  {
    category: "Loans",
    title: "Home Loan EMI Calculator",
    description: "Simple EMI check or full prepayment and rate-change scenario planning.",
    href: "/calculators/home-loan"
  }
] as const;

const SAVINGS_CALCULATORS = [
  {
    category: "Savings & Investing",
    title: "SIP Calculator",
    description: "See how regular monthly investing could grow over time without needing finance jargon.",
    href: "/calculators/sip"
  },
  {
    category: "Savings & Investing",
    title: "Fixed Deposit Calculator",
    description: "Check what you get back at maturity and how much of that is earned interest.",
    href: "/calculators/fixed-deposit"
  }
] as const;

const PLANNING_CALCULATORS = [
  {
    category: "Planning",
    title: "Emergency Fund Calculator",
    description: "Find out how much emergency buffer you need and how long it will take to build it.",
    href: "/calculators/emergency-fund"
  },
  {
    category: "Planning",
    title: "Credit Card Payoff Calculator",
    description: "Get a realistic debt-free date and see the true cost of carrying a credit card balance.",
    href: "/calculators/credit-card-payoff"
  },
  {
    category: "Planning",
    title: "Rent vs Buy Calculator",
    description: "Compare total outflows for renting versus buying a home over your chosen period.",
    href: "/calculators/rent-vs-buy"
  }
] as const;

const ALL_CARDS = [...LOAN_CALCULATORS, ...SAVINGS_CALCULATORS, ...PLANNING_CALCULATORS];

export default function HomePage() {
  return (
    <main className="landing-shell" id="main-content" tabIndex={-1}>
      <PageMeta
        title="India Money Toolkit — Simple Calculators for Indian Personal Finance"
        description="Free calculators for EMI, SIP, FD, emergency fund, credit card payoff, and rent vs buy — built for Indian rupees, no login required."
      />

      <section className="landing-hero motion-fade-up motion-stagger-1">
        <p className="landing-badge">India-first finance tools</p>
        <div className="landing-hero__content">
          <h1>India Money Toolkit</h1>
          <p className="hero-copy">
            Simple calculators for loans, savings, and everyday financial decisions — built for Indian rupees with sensible defaults. No login, no data stored on a server.
          </p>
          <div className="landing-hero__actions">
            <a className="button button--primary" href="#calculator-categories">
              Explore Calculators
            </a>
            <a className="button button--secondary" href="#trust-section">
              How it works
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
          <h2>7 calculators across loans, savings, and planning</h2>
          <p className="hero-copy">
            Each calculator shows the most important number first, with supporting detail right below it.
          </p>
        </div>

        <div style={{ width: "100%", marginBottom: "0.25rem" }}>
          <p className="eyebrow" style={{ marginBottom: "0.75rem", paddingLeft: "0.25rem" }}>Loans</p>
        </div>
        {LOAN_CALCULATORS.map((card, index) => (
          <CalculatorCategoryCard
            key={card.href}
            motionClassName={`motion-fade-up motion-stagger-${index + 1}`}
            {...card}
          />
        ))}

        <div style={{ width: "100%", marginTop: "1.5rem", marginBottom: "0.25rem" }}>
          <p className="eyebrow" style={{ marginBottom: "0.75rem", paddingLeft: "0.25rem" }}>Savings &amp; Investing</p>
        </div>
        {SAVINGS_CALCULATORS.map((card, index) => (
          <CalculatorCategoryCard
            key={card.href}
            motionClassName={`motion-fade-up motion-stagger-${index + 1}`}
            {...card}
          />
        ))}

        <div style={{ width: "100%", marginTop: "1.5rem", marginBottom: "0.25rem" }}>
          <p className="eyebrow" style={{ marginBottom: "0.75rem", paddingLeft: "0.25rem" }}>Planning</p>
        </div>
        {PLANNING_CALCULATORS.map((card, index) => (
          <CalculatorCategoryCard
            key={card.href}
            motionClassName={`motion-fade-up motion-stagger-${index + 1}`}
            {...card}
          />
        ))}
      </section>

      <section
        className="landing-stats motion-fade-up motion-stagger-2"
        id="trust-section"
        aria-label="Trust highlights"
      >
        <article className="landing-stats__card">
          <strong>7</strong>
          <span>Calculators</span>
        </article>
        <article className="landing-stats__card">
          <strong>0</strong>
          <span>Accounts Required</span>
        </article>
        <article className="landing-stats__card">
          <strong>0</strong>
          <span>Data Sent to Server</span>
        </article>
      </section>

      <section style={{ textAlign: "center", padding: "2rem 1rem 3rem", fontSize: "0.875rem", color: "var(--text-muted, #888)" }}>
        <p style={{ marginBottom: "0.5rem" }}>
          Calculations are estimates for planning purposes only. Results may differ from lender or bank figures.
        </p>
        <p>
          <Link href="/about" style={{ color: "var(--accent, #4f8ef7)", marginRight: "1rem" }}>About</Link>
          <Link href="/privacy" style={{ color: "var(--accent, #4f8ef7)", marginRight: "1rem" }}>Privacy</Link>
          <Link href="/disclaimer" style={{ color: "var(--accent, #4f8ef7)" }}>Disclaimer</Link>
        </p>
      </section>
    </main>
  );
}
