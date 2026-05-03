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
import { LumpsumCalculator } from "@/features/calculators/lumpsum/lumpsum-calculator";
import { GoalSipCalculator } from "@/features/calculators/goal-sip/goal-sip-calculator";
import { IncomeTaxCalculator } from "@/features/calculators/income-tax/income-tax-calculator";
import { CtcSalaryCalculator } from "@/features/calculators/ctc-salary/ctc-salary-calculator";
import { NpsCalculator } from "@/features/calculators/nps/nps-calculator";
import { GratuityCalculator } from "@/features/calculators/gratuity/gratuity-calculator";
import { InflationCalculator } from "@/features/calculators/inflation/inflation-calculator";
import { SsyCalculator } from "@/features/calculators/ssy/ssy-calculator";

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
  if (slug === "lumpsum") return <LumpsumCalculator />;
  if (slug === "goal-sip") return <GoalSipCalculator />;
  if (slug === "income-tax") return <IncomeTaxCalculator />;
  if (slug === "ctc-salary") return <CtcSalaryCalculator />;
  if (slug === "nps") return <NpsCalculator />;
  if (slug === "gratuity") return <GratuityCalculator />;
  if (slug === "inflation") return <InflationCalculator />;
  if (slug === "ssy") return <SsyCalculator />;

  return null;
}
