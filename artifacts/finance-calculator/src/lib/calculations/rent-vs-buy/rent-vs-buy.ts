export interface RentVsBuyInput {
  monthlyRent: number;
  homePrice: number;
  downPayment: number;
  annualLoanRatePct: number;
  loanTenureYears: number;
  annualAppreciationPct: number;
  annualRentIncreasePct: number;
  comparisonYears: number;
}

export interface RentVsBuyResult {
  loanAmount: number;
  monthlyEmi: number;
  totalRentPaid: number;
  totalBuyingOutflow: number;
  futureHomeValue: number;
  conclusion: "renting_cheaper" | "buying_better" | "close";
}

function calcEmi(principal: number, annualRatePct: number, tenureMonths: number): number {
  if (principal <= 0 || annualRatePct <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const {
    monthlyRent,
    homePrice,
    downPayment,
    annualLoanRatePct,
    loanTenureYears,
    annualAppreciationPct,
    annualRentIncreasePct,
    comparisonYears
  } = input;

  const loanAmount = Math.max(homePrice - downPayment, 0);
  const tenureMonths = loanTenureYears * 12;
  const monthlyEmi = calcEmi(loanAmount, annualLoanRatePct, tenureMonths);

  const comparisonMonths = comparisonYears * 12;

  let totalRentPaid = 0;
  let currentRent = monthlyRent;
  for (let year = 0; year < comparisonYears; year++) {
    totalRentPaid += currentRent * 12;
    currentRent *= 1 + annualRentIncreasePct / 100;
  }

  const emiMonths = Math.min(comparisonMonths, tenureMonths);
  const totalBuyingOutflow = Math.round(downPayment + monthlyEmi * emiMonths);

  const futureHomeValue = Math.round(
    homePrice * Math.pow(1 + annualAppreciationPct / 100, comparisonYears)
  );

  const rentNetCost = Math.round(totalRentPaid);
  const buyNetCost = totalBuyingOutflow - futureHomeValue;

  const diff = Math.abs(rentNetCost - buyNetCost);
  const threshold = Math.max(rentNetCost, Math.abs(buyNetCost)) * 0.1;

  let conclusion: RentVsBuyResult["conclusion"];
  if (diff <= threshold) {
    conclusion = "close";
  } else if (rentNetCost < buyNetCost) {
    conclusion = "renting_cheaper";
  } else {
    conclusion = "buying_better";
  }

  return {
    loanAmount,
    monthlyEmi: Math.round(monthlyEmi),
    totalRentPaid: Math.round(totalRentPaid),
    totalBuyingOutflow,
    futureHomeValue,
    conclusion
  };
}
