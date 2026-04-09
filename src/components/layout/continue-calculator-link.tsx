"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { createPreferencesStorageAdapter } from "@/lib/storage/preferences-storage";

const CONTINUE_LINKS = {
  "personal-loan": {
    href: "/calculators/personal-loan",
    label: "Continue with Personal Loan Calculator"
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
  }
} as const;

type ContinueLinkState = keyof typeof CONTINUE_LINKS | null;

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

  return (
    <Link className="continue-link" href={link.href}>
      {link.label}
    </Link>
  );
}
