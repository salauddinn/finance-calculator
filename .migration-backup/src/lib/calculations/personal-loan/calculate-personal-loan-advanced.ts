export type CurrencyAmount = { value: number; currency: "INR" };

export interface AdvancedPersonalLoanInput {
  principal: CurrencyAmount;
  annualRatePct: number;
  tenureMonths: number;
  delayEmiMonths: number;
  processingFeeAmount: CurrencyAmount;
  prepayments: {
    monthIndex: number;
    amount: CurrencyAmount;
  }[];
}

export interface LoanScheduleRow {
  monthIndex: number;
  openingBalance: CurrencyAmount;
  emi: CurrencyAmount;
  principalPaid: CurrencyAmount;
  interestPaid: CurrencyAmount;
  closingBalance: CurrencyAmount;
  eventApplied?: string;
}

export interface AdvancedPersonalLoanResult {
  monthlyEmi: CurrencyAmount;
  finalTenureMonths: number;
  totalRepayment: CurrencyAmount;
  totalInterest: CurrencyAmount;
  effectiveAprPct: number;
  totalPrepaymentAmount: CurrencyAmount;
  schedule: LoanScheduleRow[];
}

function roundToTwoDecimals(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toCurrencyAmount(value: number): CurrencyAmount {
  return { value: roundToTwoDecimals(value), currency: "INR" };
}

function calculateEmi(principal: number, monthlyRate: number, tenureMonths: number) {
  if (monthlyRate === 0) return principal / tenureMonths;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function calculateIRR(cashFlows: number[]): number {
  if (cashFlows.length < 2) return 0;
  
  let low = 0.0;
  let high = 1.0; 
  let rate = (low + high) / 2;
  
  for (let i = 0; i < 100; i++) {
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
    }
    
    if (Math.abs(npv) < 1e-6) return rate;
    
    if (npv > 0) {
      high = rate;
    } else {
      low = rate;
    }
    rate = (low + high) / 2;
  }
  return rate;
}

export function calculatePersonalLoanAdvanced(
  input: AdvancedPersonalLoanInput
): AdvancedPersonalLoanResult {
  const schedule: LoanScheduleRow[] = [];
  const prepaymentMap = new Map(input.prepayments.map((p) => [p.monthIndex, p]));
  
  const monthlyRate = input.annualRatePct / 12 / 100;
  let balance = input.principal.value;
  let monthIndex = 1;
  let totalRepayment = 0;
  let totalPrepayment = 0;
  let totalInterestSpent = 0;
  
  const cashFlows: number[] = [input.principal.value - input.processingFeeAmount.value];

  // 1. Process Delay EMI period
  for (let i = 0; i < input.delayEmiMonths; i++) {
    const openingBalance = balance;
    const interestPaid = balance * monthlyRate;
    balance += interestPaid; // Interest accrues and is added to principal
    
    schedule.push({
      monthIndex,
      openingBalance: toCurrencyAmount(openingBalance),
      emi: toCurrencyAmount(0),
      principalPaid: toCurrencyAmount(0),
      interestPaid: toCurrencyAmount(interestPaid),
      closingBalance: toCurrencyAmount(balance),
      eventApplied: "delay-emi"
    });
    
    cashFlows.push(0); // No EMI
    monthIndex++;
  }

  // Calculate EMI based on the newly accrued balance and remaining tenure
  let emi = calculateEmi(balance, monthlyRate, input.tenureMonths);
  let remainingMonths = input.tenureMonths;

  // 2. Process Repayment Schedule
  while (balance > 0.01 && remainingMonths > 0) {
    const openingBalance = balance;
    let interestPaid = balance * monthlyRate;
    let principalPaid = Math.min(emi - interestPaid, balance);
    balance = Math.max(0, balance - principalPaid);
    
    let currentEmi = emi;
    // Last month adjustment
    if (remainingMonths === 1) {
      principalPaid = openingBalance;
      currentEmi = principalPaid + interestPaid;
      balance = 0;
    }
    
    let cashFlowOutflow = currentEmi;
    totalRepayment += currentEmi;
    totalInterestSpent += interestPaid;
    
    let eventApplied: string | undefined;

    const prepay = prepaymentMap.get(monthIndex);
    if (prepay) {
      const amount = Math.min(prepay.amount.value, balance);
      balance = Math.max(0, balance - amount);
      totalPrepayment += amount;
      totalRepayment += amount;
      cashFlowOutflow += amount;
      eventApplied = "prepayment";
      
      // Calculate new EMI for remaining tenure or just keep EMI and reduce tenure? 
      // Typical personal loan keeps EMI, reduces tenure
    }

    schedule.push({
      monthIndex,
      openingBalance: toCurrencyAmount(openingBalance),
      emi: toCurrencyAmount(currentEmi),
      principalPaid: toCurrencyAmount(principalPaid),
      interestPaid: toCurrencyAmount(interestPaid),
      closingBalance: toCurrencyAmount(balance),
      eventApplied
    });

    cashFlows.push(-cashFlowOutflow);
    monthIndex++;
    remainingMonths--;
    
    // If balance hit 0 before tenure due to prepayment
    if (balance <= 0.01) {
      break;
    }
  }

  const effectiveAprPct = calculateIRR(cashFlows) * 12 * 100;

  return {
    monthlyEmi: toCurrencyAmount(emi),
    finalTenureMonths: schedule.length,
    totalRepayment: toCurrencyAmount(totalRepayment),
    totalInterest: toCurrencyAmount(totalInterestSpent),
    effectiveAprPct: roundToTwoDecimals(effectiveAprPct),
    totalPrepaymentAmount: toCurrencyAmount(totalPrepayment),
    schedule
  };
}
