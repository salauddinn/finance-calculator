import { Link } from "wouter";
import { ContinueCalculatorLink } from "@/components/layout/continue-calculator-link";
import { PageMeta } from "@/components/primitives/page-meta";

const INTENT_CHIPS = [
  { label: "Loan EMI", href: "/calculators/personal-loan" },
  { label: "My take-home", href: "/calculators/ctc-salary" },
  { label: "SIP returns", href: "/calculators/sip" },
  { label: "Save tax", href: "/calculators/income-tax" },
  { label: "Lumpsum growth", href: "/calculators/lumpsum" },
  { label: "SIP goal", href: "/calculators/goal-sip" },
  { label: "NPS pension", href: "/calculators/nps" },
  { label: "Inflation impact", href: "/calculators/inflation" },
  { label: "Girl child SSY", href: "/calculators/ssy" },
  { label: "Home loan", href: "/calculators/home-loan" },
  { label: "FD earnings", href: "/calculators/fixed-deposit" },
  { label: "PPF maturity", href: "/calculators/ppf" },
  { label: "HRA exemption", href: "/calculators/hra" },
  { label: "Gratuity", href: "/calculators/gratuity" },
  { label: "Emergency fund", href: "/calculators/emergency-fund" },
];

const TOOLS = [
  {
    group: "Loans",
    variant: "loan",
    items: [
      {
        title: "Personal Loan EMI",
        desc: "Monthly payment, total interest, and true cost of borrowing.",
        href: "/calculators/personal-loan",
      },
      {
        title: "Home Loan EMI",
        desc: "EMI with amortisation table, prepayment and rate-change scenarios.",
        href: "/calculators/home-loan",
      },
    ],
  },
  {
    group: "Savings & Investing",
    variant: "savings",
    items: [
      {
        title: "SIP Calculator",
        desc: "How a monthly SIP — with optional step-up — compounds into wealth.",
        href: "/calculators/sip",
      },
      {
        title: "Lumpsum Calculator",
        desc: "One-time investment: what does ₹1L become at 12% in 10 years?",
        href: "/calculators/lumpsum",
      },
      {
        title: "Goal SIP",
        desc: "Working backwards — how much monthly SIP to reach your target corpus?",
        href: "/calculators/goal-sip",
      },
      {
        title: "Fixed Deposit",
        desc: "Maturity value and interest earned across compounding options.",
        href: "/calculators/fixed-deposit",
      },
      {
        title: "PPF Calculator",
        desc: "15-year Public Provident Fund maturity at current 7.1% rate.",
        href: "/calculators/ppf",
      },
      {
        title: "SSY Calculator",
        desc: "Sukanya Samriddhi Yojana — 8.2% p.a., EEE tax-free, matures at girl's age 21.",
        href: "/calculators/ssy",
      },
    ],
  },
  {
    group: "Tax",
    variant: "tax",
    items: [
      {
        title: "Income Tax (Old vs New Regime)",
        desc: "FY 2025-26 Budget 2025 slabs — find which regime saves you more.",
        href: "/calculators/income-tax",
      },
      {
        title: "HRA Exemption",
        desc: "How much of your HRA is tax-free under Section 10(13A).",
        href: "/calculators/hra",
      },
    ],
  },
  {
    group: "Salary & Pension",
    variant: "salary",
    items: [
      {
        title: "CTC to Take-home",
        desc: "Break your CTC into monthly in-hand after PF, TDS, and professional tax.",
        href: "/calculators/ctc-salary",
      },
      {
        title: "NPS Calculator",
        desc: "National Pension System corpus, lump sum, and estimated monthly pension.",
        href: "/calculators/nps",
      },
      {
        title: "Gratuity Calculator",
        desc: "What gratuity are you owed? Formula + tax-free limit under Gratuity Act.",
        href: "/calculators/gratuity",
      },
    ],
  },
  {
    group: "Planning",
    variant: "planning",
    items: [
      {
        title: "Emergency Fund",
        desc: "How much safety buffer you need and how fast you can build it.",
        href: "/calculators/emergency-fund",
      },
      {
        title: "Inflation Calculator",
        desc: "How inflation silently erodes your money — and what you need to beat it.",
        href: "/calculators/inflation",
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
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className="landing-shell">
      <PageMeta
        title="India Money Toolkit — Free Finance Calculators for India"
        description="Free calculators for EMI, SIP, FD, PPF, HRA, emergency fund, credit card payoff, and rent vs buy — built for Indian rupees, no login required."
      />

      {/* Hero */}
      <section className="landing-hero motion-fade-up motion-stagger-1">
        <span className="landing-badge">India-first · No login · No server</span>
        <h1>India Money<br />Toolkit</h1>
        <p className="hero-copy">
          17 calculators for loans, savings, tax, salary, and everyday money decisions — built for Indian rupees with sensible defaults.
        </p>
        <div className="landing-hero__actions">
          <a className="button button--primary" href="#tools">Pick a calculator</a>
          <ContinueCalculatorLink />
        </div>
      </section>

      {/* Quick intent chips */}
      <section className="intent-strip motion-fade-up motion-stagger-2" aria-label="Quick navigation">
        <p className="intent-strip__label">What are you planning?</p>
        <div className="intent-chips">
          {INTENT_CHIPS.map((chip) => (
            <Link key={chip.href} href={chip.href} className="intent-chip">
              {chip.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Calculator directory */}
      <section
        id="tools"
        aria-label="All calculators"
        className="motion-fade-up motion-stagger-3"
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
        className="landing-stats motion-fade-up motion-stagger-4"
        aria-label="Quick facts"
      >
        <div className="landing-stats__card">
          <strong>17</strong>
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
