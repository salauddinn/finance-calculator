type CurrencyAmount = {
  value: number;
  currency: "INR";
};

type HomeLoanEvent =
  | {
      id: string;
      monthIndex: number;
      type: "prepayment";
      amount: CurrencyAmount;
      note?: string;
    }
  | {
      id: string;
      monthIndex: number;
      type: "rate-change";
      newAnnualRatePct: number;
      note?: string;
    }
  | {
      id: string;
      monthIndex: number;
      type: "moratorium";
      durationMonths: number;
      interestAccrues: boolean;
      note?: string;
    };

type AdvancedHomeLoanInput = {
  principal: CurrencyAmount;
  annualRatePct: number;
  tenureMonths: number;
  events: HomeLoanEvent[];
  strategy: "keep-emi-adjust-tenure" | "keep-tenure-adjust-emi";
};

type LoanScheduleRow = {
  monthIndex: number;
  openingBalance: CurrencyAmount;
  emi: CurrencyAmount;
  principalPaid: CurrencyAmount;
  interestPaid: CurrencyAmount;
  closingBalance: CurrencyAmount;
  eventApplied?: "prepayment" | "rate-change" | "moratorium";
};

type AdvancedHomeLoanResult = {
  finalMonthlyEmi: CurrencyAmount;
  finalTenureMonths: number;
  totalRepayment: CurrencyAmount;
  totalInterest: CurrencyAmount;
  totalPrepaymentAmount: CurrencyAmount;
  schedule: LoanScheduleRow[];
  impactSummary: string[];
};

function roundToTwoDecimals(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toCurrencyAmount(value: number): CurrencyAmount {
  return {
    value: roundToTwoDecimals(value),
    currency: "INR"
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function calculateEmi(
  principal: number,
  monthlyRate: number,
  tenureMonths: number
) {
  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
}

export function calculateAdvancedHomeLoan(
  input: AdvancedHomeLoanInput
): AdvancedHomeLoanResult {
  const orderedEvents = [...input.events].sort(
    (left, right) => left.monthIndex - right.monthIndex
  );
  const eventMap = new Map(orderedEvents.map((event) => [event.monthIndex, event]));
  const schedule: LoanScheduleRow[] = [];
  const impactSummary: string[] = [];

  let balance = input.principal.value;
  let annualRatePct = input.annualRatePct;
  let monthlyRate = annualRatePct / 12 / 100;
  let remainingMonths = input.tenureMonths;
  let totalRepayment = 0;
  let totalPrepayment = 0;
  let monthIndex = 1;
  let emi = calculateEmi(balance, monthlyRate, remainingMonths);

  while (balance > 0.01 && monthIndex <= 600) {
    const event = eventMap.get(monthIndex);

    if (event?.type === "rate-change") {
      annualRatePct = event.newAnnualRatePct;
      monthlyRate = annualRatePct / 12 / 100;

      if (input.strategy === "keep-tenure-adjust-emi") {
        emi = calculateEmi(balance, monthlyRate, remainingMonths);
      }

      impactSummary.push(`Interest rate changed to ${annualRatePct}% in month ${monthIndex}.`);
    }

    if (event?.type === "moratorium") {
      impactSummary.push(
        `A moratorium for ${event.durationMonths} months was applied from month ${monthIndex}.`
      );

      for (let offset = 0; offset < event.durationMonths; offset += 1) {
        const openingBalance = balance;
        const interestPaid = event.interestAccrues ? balance * monthlyRate : 0;
        balance += interestPaid;
        remainingMonths -= 1;
        schedule.push({
          monthIndex,
          openingBalance: toCurrencyAmount(openingBalance),
          emi: toCurrencyAmount(0),
          principalPaid: toCurrencyAmount(0),
          interestPaid: toCurrencyAmount(interestPaid),
          closingBalance: toCurrencyAmount(balance),
          eventApplied: "moratorium"
        });
        monthIndex += 1;
      }

      if (input.strategy === "keep-tenure-adjust-emi") {
        emi = calculateEmi(balance, monthlyRate, remainingMonths);
      } else {
        remainingMonths += event.durationMonths;
      }

      continue;
    }

    const openingBalance = balance;
    const interestPaid = balance * monthlyRate;
    const principalPaid = Math.min(emi - interestPaid, balance);
    balance = Math.max(0, balance - principalPaid);
    totalRepayment += emi;
    remainingMonths -= 1;

    let eventApplied: LoanScheduleRow["eventApplied"];

    if (event?.type === "prepayment") {
      balance = Math.max(0, balance - event.amount.value);
      totalPrepayment += event.amount.value;
      totalRepayment += event.amount.value;
      eventApplied = "prepayment";

      impactSummary.push(
        `A prepayment of ${formatCurrency(event.amount.value)} reduced the balance in month ${monthIndex}.`
      );

      if (input.strategy === "keep-tenure-adjust-emi") {
        emi = calculateEmi(balance, monthlyRate, remainingMonths);
      }
    }

    schedule.push({
      monthIndex,
      openingBalance: toCurrencyAmount(openingBalance),
      emi: toCurrencyAmount(emi),
      principalPaid: toCurrencyAmount(principalPaid),
      interestPaid: toCurrencyAmount(interestPaid),
      closingBalance: toCurrencyAmount(balance),
      eventApplied
    });

    monthIndex += 1;
  }

  const finalTenureMonths = schedule.length;
  const totalInterest = totalRepayment - input.principal.value;

  return {
    finalMonthlyEmi: toCurrencyAmount(emi),
    finalTenureMonths,
    totalRepayment: toCurrencyAmount(totalRepayment),
    totalInterest: toCurrencyAmount(totalInterest),
    totalPrepaymentAmount: toCurrencyAmount(totalPrepayment),
    schedule,
    impactSummary
  };
}
