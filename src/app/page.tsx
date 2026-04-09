import { CalculatorCategoryCard } from "@/components/layout/calculator-category-card";
import { ContinueCalculatorLink } from "@/components/layout/continue-calculator-link";

const CALCULATOR_CARDS = [
  {
    title: "Personal Loan Calculator",
    description:
      "Get a quick EMI estimate for everyday borrowing decisions with transparent totals.",
    href: "/calculators/personal-loan"
  },
  {
    title: "Home Loan Calculator",
    description:
      "Plan both simple and advanced repayment scenarios, including future changes.",
    href: "/calculators/home-loan"
  },
  {
    title: "SIP Calculator",
    description:
      "Project investment growth and understand the balance between invested amount and returns.",
    href: "/calculators/sip"
  },
  {
    title: "Fixed Deposit Calculator",
    description:
      "Compare maturity value and interest earned with clear compounding assumptions.",
    href: "/calculators/fixed-deposit"
  }
] as const;

export default function HomePage() {
  return (
    <main className="landing-shell" id="main-content" tabIndex={-1}>
      <section className="landing-hero">
        <p className="eyebrow">India-first finance planning</p>
        <h1>Finance calculators for real life decisions</h1>
        <p className="hero-copy">
          Plan loans, SIP growth, and fixed deposits with clear assumptions and
          trustworthy breakdowns.
        </p>
      </section>

      <section className="trust-strip" aria-label="Trust messaging">
        <p>Built for transparent assumptions, not hidden surprises.</p>
        <p>Every result is designed to feel readable, reviewable, and calm.</p>
        <ContinueCalculatorLink />
      </section>

      <section className="category-grid" aria-label="Calculator categories">
        {CALCULATOR_CARDS.map((card) => (
          <CalculatorCategoryCard key={card.href} {...card} />
        ))}
      </section>
    </main>
  );
}
