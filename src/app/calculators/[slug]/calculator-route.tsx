"use client";

import { FixedDepositCalculator } from "@/features/calculators/fixed-deposit/fixed-deposit-calculator";
import { HomeLoanAdvancedCalculator } from "@/features/calculators/home-loan/advanced/home-loan-advanced-calculator";
import { HomeLoanSimpleCalculator } from "@/features/calculators/home-loan/simple/home-loan-simple-calculator";
import { PersonalLoanCalculator } from "@/features/calculators/personal-loan/personal-loan-calculator";
import { SipCalculator } from "@/features/calculators/sip/sip-calculator";

type CalculatorRouteProps = {
  mode?: string;
  slug: string;
};

export function CalculatorRoute({ mode, slug }: CalculatorRouteProps) {
  if (slug === "personal-loan") {
    return <PersonalLoanCalculator />;
  }

  if (slug === "home-loan") {
    return mode === "advanced" ? (
      <HomeLoanAdvancedCalculator />
    ) : (
      <HomeLoanSimpleCalculator />
    );
  }

  if (slug === "sip") {
    return <SipCalculator />;
  }

  if (slug === "fixed-deposit") {
    return <FixedDepositCalculator />;
  }

  return null;
}
