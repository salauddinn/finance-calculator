import { useSearch } from "wouter";
import { FixedDepositCalculator } from "@/features/calculators/fixed-deposit/fixed-deposit-calculator";
import { HomeLoanCalculator } from "@/features/calculators/home-loan/home-loan-calculator";
import { ComprehensiveLoanCalculator } from "@/features/calculators/comprehensive-loan/comprehensive-loan-calculator";
import { SipCalculator } from "@/features/calculators/sip/sip-calculator";
import { EmergencyFundCalculator } from "@/features/calculators/emergency-fund/emergency-fund-calculator";
import { CreditCardPayoffCalculator } from "@/features/calculators/credit-card-payoff/credit-card-payoff-calculator";
import { RentVsBuyCalculator } from "@/features/calculators/rent-vs-buy/rent-vs-buy-calculator";
import { PpfCalculator } from "@/features/calculators/ppf/ppf-calculator";
import { HraCalculator } from "@/features/calculators/hra/hra-calculator";

type CalculatorRouteProps = {
  slug: string;
};

export function CalculatorRoute({ slug }: CalculatorRouteProps) {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const _mode = params.get("mode");

  if (slug === "personal-loan") return <ComprehensiveLoanCalculator />;
  if (slug === "home-loan") return <HomeLoanCalculator />;
  if (slug === "sip") return <SipCalculator />;
  if (slug === "fixed-deposit") return <FixedDepositCalculator />;
  if (slug === "emergency-fund") return <EmergencyFundCalculator />;
  if (slug === "credit-card-payoff") return <CreditCardPayoffCalculator />;
  if (slug === "rent-vs-buy") return <RentVsBuyCalculator />;
  if (slug === "ppf") return <PpfCalculator />;
  if (slug === "hra") return <HraCalculator />;

  return null;
}
