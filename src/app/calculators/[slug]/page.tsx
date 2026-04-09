import Link from "next/link";
import { notFound } from "next/navigation";

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

type CalculatorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CalculatorEntryPage({
  params
}: CalculatorPageProps) {
  const { slug } = await params;

  if (!(slug in CALCULATOR_COPY)) {
    notFound();
  }

  const calculator = CALCULATOR_COPY[slug as CalculatorSlug];

  return (
    <main className="calculator-entry">
      <Link className="back-link" href="/">
        Back to all calculators
      </Link>
      <section className="calculator-entry__panel">
        <p className="eyebrow">Calculator entry</p>
        <h1>{calculator.title}</h1>
        <p className="hero-copy">{calculator.description}</p>
      </section>
    </main>
  );
}
