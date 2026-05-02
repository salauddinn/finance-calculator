export type HomeLoanSimpleInput = {
  principal: number;
  annualRatePct: number;
  tenureMonths: number;
};

export type HomeLoanSimpleResult = {
  monthlyEmi: {
    value: number;
    currency: "INR";
  };
  totalRepayment: {
    value: number;
    currency: "INR";
  };
  totalInterest: {
    value: number;
    currency: "INR";
  };
};

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateSimpleHomeLoan(
  input: HomeLoanSimpleInput
): HomeLoanSimpleResult {
  const monthlyRate = input.annualRatePct / 12 / 100;
  const monthlyEmi =
    monthlyRate === 0
      ? input.principal / input.tenureMonths
      : (input.principal *
          monthlyRate *
          Math.pow(1 + monthlyRate, input.tenureMonths)) /
        (Math.pow(1 + monthlyRate, input.tenureMonths) - 1);

  const totalRepayment = monthlyEmi * input.tenureMonths;
  const totalInterest = totalRepayment - input.principal;

  return {
    monthlyEmi: {
      value: roundToTwoDecimals(monthlyEmi),
      currency: "INR"
    },
    totalRepayment: {
      value: roundToTwoDecimals(totalRepayment),
      currency: "INR"
    },
    totalInterest: {
      value: roundToTwoDecimals(totalInterest),
      currency: "INR"
    }
  };
}
