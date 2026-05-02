import { Link } from "wouter";
import { ContinueCalculatorLink } from "@/components/layout/continue-calculator-link";
import { PageMeta } from "@/components/primitives/page-meta";

const TOOLS = [
  {
    group: "Loans",
    variant: "loan" as const,
    items: [
      {
        title: "Personal Loan EMI",
        desc: "Monthly payment, total interest, and true cost of borrowing.",
        href: "/calculators/personal-loan",
      },
      {
        title: "Home Loan EMI",
        desc: "EMI estimate with optional prepayment and rate-change scenarios.",
        href: "/calculators/home-loan",
      },
    ],
  },
  {
    group: "Savings & Investing",
    variant: "savings" as const,
    items: [
      {
        title: "SIP Calculator",
        desc: "See how a monthly SIP compounds into wealth over time.",
        href: "/calculators/sip",
      },
      {
        title: "Fixed Deposit",
        desc: "Maturity value and interest earned across compounding options.",
        href: "/calculators/fixed-deposit",
      },
    ],
  },
  {
    group: "Planning",
    variant: "planning" as const,
    items: [
      {
        title: "Emergency Fund",
        desc: "How much safety buffer you need and how fast you can build it.",
        href: "/calculators/emergency-fund",
      },
      {
        title: "Credit Card Payoff",
        desc: "Debt-free date and true interest cost of carrying a balance.",
        href: "/calculators/credit-card-payoff",
      },
      {
        title: "Rent vs Buy",
        desc: "Total outflows compared over a horizon of your choice.",
        href: "/calculators/rent-vs-buy",
      },
    ],
  },
] as const;

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="landing-shell">
      <PageMeta
        title="India Money Toolkit — Free Finance Calculators for India"
        description="Free calculators for EMI, SIP, FD, emergency fund, credit card payoff, and rent vs buy — built for Indian rupees, no login required."
      />

      {/* Hero */}
      <section className="landing-hero motion-fade-up motion-stagger-1">
        <span className="landing-badge">India-first · No login · No server</span>
        <h1>India Money<br />Toolkit</h1>
        <p className="hero-copy">
          Seven calculators for loans, savings, and everyday money decisions — built for Indian rupees with sensible defaults.
        </p>
        <div className="landing-hero__actions">
          <a className="button button--primary" href="#tools">Pick a calculator</a>
          <ContinueCalculatorLink />
        </div>
      </section>

      {/* Calculator directory */}
      <section
        id="tools"
        aria-label="All calculators"
        className="motion-fade-up motion-stagger-2"
        style={{ display: "flex", flexDirection: "column", gap: "28px" }}
      >
        {TOOLS.map((group) => (
          <div key={group.group} className="tool-section">
            <p className="tool-section__label">{group.group}</p>
            <div className="tool-grid">
              {group.items.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`tool-card tool-card--${group.variant}`}
                >
                  <p className="tool-card__title">{tool.title}</p>
                  <p className="tool-card__desc">{tool.desc}</p>
                  <span className="tool-card__cta">Calculate →</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Trust stats */}
      <div
        className="landing-stats motion-fade-up motion-stagger-3"
        aria-label="Quick facts"
      >
        <div className="landing-stats__card">
          <strong>7</strong>
          <span>Calculators</span>
        </div>
        <div className="landing-stats__card">
          <strong>0</strong>
          <span>Accounts needed</span>
        </div>
        <div className="landing-stats__card">
          <strong>0</strong>
          <span>Data sent anywhere</span>
        </div>
        <div className="landing-stats__card">
          <strong>₹</strong>
          <span>Rupee defaults</span>
        </div>
      </div>

      {/* Footer */}
      <footer className="trust-footer">
        <p>
          Results are estimates for planning purposes only.
          Always verify with your lender or bank.
        </p>
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
