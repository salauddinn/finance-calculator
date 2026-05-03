import { Link } from "wouter";
import { useEffect, useState } from "react";

import { createPreferencesStorageAdapter } from "@/lib/storage/preferences-storage";

const CONTINUE_LINKS: Record<string, { href: string; label: string }> = {
  "personal-loan": {
    href: "/calculators/personal-loan",
    label: "Continue with Personal Loan Calculator"
  },
  "home-loan": {
    href: "/calculators/home-loan",
    label: "Continue with Home Loan Calculator"
  },
  "home-loan-simple": {
    href: "/calculators/home-loan",
    label: "Continue with Home Loan Calculator"
  },
  "home-loan-advanced": {
    href: "/calculators/home-loan?mode=advanced",
    label: "Continue with Advanced Home Loan Calculator"
  },
  sip: {
    href: "/calculators/sip",
    label: "Continue with SIP Calculator"
  },
  "fixed-deposit": {
    href: "/calculators/fixed-deposit",
    label: "Continue with Fixed Deposit Calculator"
  },
  ppf: {
    href: "/calculators/ppf",
    label: "Continue with PPF Calculator"
  },
  hra: {
    href: "/calculators/hra",
    label: "Continue with HRA Calculator"
  },
  "emergency-fund": {
    href: "/calculators/emergency-fund",
    label: "Continue with Emergency Fund Calculator"
  },
  "credit-card-payoff": {
    href: "/calculators/credit-card-payoff",
    label: "Continue with Credit Card Payoff Calculator"
  },
  "rent-vs-buy": {
    href: "/calculators/rent-vs-buy",
    label: "Continue with Rent vs Buy Calculator"
  },
  gratuity: {
    href: "/calculators/gratuity",
    label: "Continue with Gratuity Calculator"
  },
  "ctc-salary": {
    href: "/calculators/ctc-salary",
    label: "Continue with CTC to Take-Home Calculator"
  },
  lumpsum: {
    href: "/calculators/lumpsum",
    label: "Continue with Lumpsum Calculator"
  },
  "goal-sip": {
    href: "/calculators/goal-sip",
    label: "Continue with Goal SIP Calculator"
  },
  "income-tax": {
    href: "/calculators/income-tax",
    label: "Continue with Income Tax Calculator"
  },
  nps: {
    href: "/calculators/nps",
    label: "Continue with NPS Calculator"
  },
  inflation: {
    href: "/calculators/inflation",
    label: "Continue with Inflation Calculator"
  },
  ssy: {
    href: "/calculators/ssy",
    label: "Continue with SSY Calculator"
  }
};

type ContinueLinkState = string | null;

export function ContinueCalculatorLink() {
  const [lastUsedCalculator, setLastUsedCalculator] =
    useState<ContinueLinkState>(null);

  useEffect(() => {
    const result = createPreferencesStorageAdapter().load();

    if (result.ok && result.data.lastUsedCalculator) {
      setLastUsedCalculator(result.data.lastUsedCalculator);
    }
  }, []);

  if (lastUsedCalculator === null) {
    return null;
  }

  const link = CONTINUE_LINKS[lastUsedCalculator];

  if (!link) return null;

  return (
    <Link className="continue-link" href={link.href}>
      {link.label}
    </Link>
  );
}
