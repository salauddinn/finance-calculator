import { Link } from "wouter";
import { ContinueCalculatorLink } from "@/components/layout/continue-calculator-link";
import { PageMeta } from "@/components/primitives/page-meta";

const GROUPS = [
  {
    label: "Loans",
    cards: [
      {
        title: "Personal Loan EMI",
        description: "Monthly payment, total interest, and true cost at a glance.",
        href: "/calculators/personal-loan",
      },
      {
        title: "Home Loan EMI",
        description: "EMI check plus prepayment and rate-change scenarios.",
        href: "/calculators/home-loan",
      },
    ],
  },
  {
    label: "Savings & Investing",
    cards: [
      {
        title: "SIP Calculator",
        description: "See how monthly investing grows over time with compounding.",
        href: "/calculators/sip",
      },
      {
        title: "Fixed Deposit",
        description: "Maturity value and interest earned for any FD.",
        href: "/calculators/fixed-deposit",
      },
    ],
  },
  {
    label: "Planning",
    cards: [
      {
        title: "Emergency Fund",
        description: "How much buffer you need and how long to build it.",
        href: "/calculators/emergency-fund",
      },
      {
        title: "Credit Card Payoff",
        description: "Debt-free date and true cost of carrying a balance.",
        href: "/calculators/credit-card-payoff",
      },
      {
        title: "Rent vs Buy",
        description: "Compare total outflows over your chosen horizon.",
        href: "/calculators/rent-vs-buy",
      },
    ],
  },
] as const;

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="landing-shell">
      <PageMeta
        title="India Money Toolkit — Simple Calculators for Indian Personal Finance"
        description="Free calculators for EMI, SIP, FD, emergency fund, credit card payoff, and rent vs buy — built for Indian rupees, no login required."
      />

      {/* Hero */}
      <section className="landing-hero motion-fade-up motion-stagger-1">
        <span className="landing-badge">India-first finance tools</span>
        <h1>India Money<br />Toolkit</h1>
        <p className="hero-copy">
          Plain calculators for loans, savings, and everyday financial decisions — built for Indian rupees with sensible defaults. No login, no data sent anywhere.
        </p>
        <div className="landing-hero__actions">
          <a className="button button--primary" href="#calculators">
            Open a calculator ↓
          </a>
          <ContinueCalculatorLink />
        </div>
      </section>

      {/* Stats */}
      <div className="landing-stats motion-fade-up motion-stagger-2" aria-label="Quick facts">
        <div className="landing-stats__card">
          <strong>7</strong>
          <span>Calculators</span>
        </div>
        <div className="landing-stats__card">
          <strong>0</strong>
          <span>Accounts required</span>
        </div>
        <div className="landing-stats__card">
          <strong>0</strong>
          <span>Data sent to server</span>
        </div>
        <div className="landing-stats__card">
          <strong>₹</strong>
          <span>Indian rupee defaults</span>
        </div>
      </div>

      {/* Calculator groups */}
      <section id="calculators" aria-label="All calculators" className="category-grid motion-fade-up motion-stagger-3">
        {GROUPS.map((group) => (
          <div key={group.label} className="category-grid__group">
            <p className="category-grid__label">{group.label}</p>
            <div className="category-grid__cards">
              {group.cards.map((card) => (
                <Link key={card.href} href={card.href} className="category-card">
                  <p className="category-card__title">{card.title}</p>
                  <p className="category-card__description">{card.description}</p>
                  <span className="category-card__link">Open →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="trust-footer">
        <p>Results are estimates for planning purposes only. Always verify with your lender or bank.</p>
        <p>
          <Link href="/about">About</Link>
          {" · "}
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <Link href="/disclaimer">Disclaimer</Link>
        </p>
      </footer>
    </main>
  );
}
