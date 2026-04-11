"use client";

import { useSearchParams } from "next/navigation";

import { FixedDepositCalculator } from "@/features/calculators/fixed-deposit/fixed-deposit-calculator";
import { HomeLoanCalculator } from "@/features/calculators/home-loan/home-loan-calculator";
import { ComprehensiveLoanCalculator } from "@/features/calculators/comprehensive-loan/comprehensive-loan-calculator";
import { SipCalculator } from "@/features/calculators/sip/sip-calculator";

type CalculatorRouteProps = {
  slug: string;
};

export function CalculatorRoute({ slug }: CalculatorRouteProps) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  if (slug === "personal-loan") {
    return <ComprehensiveLoanCalculator />;
  }

  if (slug === "home-loan") {
    return <HomeLoanCalculator />;
  }

  if (slug === "sip") {
    return <SipCalculator />;
  }

  if (slug === "fixed-deposit") {
    return <FixedDepositCalculator />;
  }

  return null;
}

