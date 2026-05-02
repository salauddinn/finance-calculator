export type CalculationMode = "emi" | "loan_amount" | "tenure";
export type InterestCalculationMethod = "reducing" | "flat";
export type CompoundingFrequency = "monthly" | "quarterly" | "daily";
export type EmiType = "standard" | "step_up" | "step_down" | "bullet";

export interface MasterUnderwritingInput {
  loan: {
    loanAmount: number; // Ignored if calculationMode === "loan_amount"
    interestRateAnnual: number;
    tenureMonths: number; // Ignored if calculationMode === "tenure"
  };
  interestConfig: {
    interestType: "fixed" | "floating";
    interestCalculationMethod: InterestCalculationMethod;
    compoundingFrequency: CompoundingFrequency;
  };
  fees: {
    processingFeeType: "percentage" | "fixed";
    processingFeeValue: number;
    gstRate: number;
    insuranceAmount: number;
    otherCharges: number;
  };
  emiConfig: {
    emiType: EmiType;
    emiStepPercent?: number; // Default: 5%. Annual step increment for step_up/step_down.
    emiStartDelayMonths: number;
    emiFrequency: "monthly" | "biweekly";
  };
  prepayment: {
    prepaymentEnabled: boolean;
    prepaymentType: "lump_sum" | "recurring";
    prepaymentAmount: number;
    prepaymentFrequency: "monthly" | "yearly" | "one_time";
    prepaymentStartMonth: number;
    prepaymentChargesPercent: number;
  };
  rateChanges: {
    month: number;
    newRate: number;
  }[];
  moratorium: {
    moratoriumMonths: number;
    moratoriumInterestTreatment: "accrue" | "pay_only_interest" | "defer_all";
  };
  userProfile?: {
    monthlyIncome: number;
    existingEMIs: number;
    foirLimit: number;
  };
  calculation: {
    calculationMode: CalculationMode;
    targetEmi?: number; // Required if mode is "loan_amount" or "tenure"
  };
}

export interface AmortizationRow {
  month: number;
  emi: number;
  interest: number;
  principal: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface MasterUnderwritingResult {
  emi: number;
  computedLoanAmount: number;
  computedTenureMonths: number;
  totalInterest: number;
  totalPayment: number;
  apr: number;
  interestSaved: number;
  tenureReduced: number;
  schedule: AmortizationRow[];
  foirExceeded: boolean;
  foirValue: number;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

// APR using Newton-Raphson approximation
function calculateAPR(principal: number, schedule: AmortizationRow[], totalUpfrontFees: number): number {
  if (schedule.length === 0) return 0;
  
  // Cash flows
  const cashflows = [ -(principal - totalUpfrontFees) ];
  schedule.forEach(row => {
    // Total cash out this month = regular payment + any direct principal/prepayment hits that happened outside of regular EMI
    // Actually, `emi` in schedule reflects the row's total scheduled payment (inclusive of pay_only_interest)
    // Plus any extra prepayment/penalties must be reconstructed, but we didn't store penalties in AmortizationRow per schema.
    // Assuming `row.emi` is the absolute cash amount the user parted with.
    let cashout = row.emi; 
    cashflows.push(cashout);
  });

  let rate = 0.1 / 12; // Start guess at 10% annual
  for (let i = 0; i < 20; i++) {
    let npv = 0;
    let npvDeriv = 0;
    
    for (let t = 0; t < cashflows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      npv += cashflows[t] / denom;
      if (t > 0) {
        npvDeriv -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1);
      }
    }
    
    // Fallback if derivation flattens
    if (Math.abs(npvDeriv) < 0.0000001) break;

    const rateNext = rate - npv / npvDeriv;
    if (Math.abs(rateNext - rate) < 0.000001) {
      rate = rateNext;
      break;
    }
    rate = rateNext;
  }
  return round(rate * 12 * 100);
}

export function executeMasterUnderwriting(config: MasterUnderwritingInput): MasterUnderwritingResult {
  let principal = config.loan.loanAmount;
  let tenure = config.loan.tenureMonths;
  let annualRate = config.loan.interestRateAnnual;
  const mode = config.calculation.calculationMode;
  let targetEmiInput = config.calculation.targetEmi || 0;

  // --- REVERSE SOLVERS ---
  // In reverse solvers, we use the BASE loan parameters before applying moratoriums or complex step_ups.
  const rMonthly = (annualRate / 12) / 100;
  
  if (config.interestConfig.interestCalculationMethod === "reducing") {
    if (mode === "loan_amount" && targetEmiInput > 0 && rMonthly > 0) {
      // P = EMI * (1 - (1+r)^-n) / r
      principal = targetEmiInput * (1 - Math.pow(1 + rMonthly, -tenure)) / rMonthly;
    } else if (mode === "tenure" && targetEmiInput > 0 && rMonthly > 0) {
      // n = -log(1 - P*r/EMI) / log(1+r)
      const ratio = 1 - ((principal * rMonthly) / targetEmiInput);
      if (ratio > 0) {
        tenure = Math.ceil(-Math.log(ratio) / Math.log(1 + rMonthly)); // Rounding up as requested/standard
      } else {
        // EMI is too low to even cover interest
        tenure = 1200; // Unsolvable effectively, cap it
      }
    }
  } else if (config.interestConfig.interestCalculationMethod === "flat") {
    if (mode === "loan_amount" && targetEmiInput > 0) {
      // EMI = (P + P*R*T) / T => P(1 + R*T) = EMI * T => P = EMI * T / (1 + R*T)
      const years = tenure / 12;
      principal = (targetEmiInput * tenure) / (1 + (annualRate / 100) * years);
    } else if (mode === "tenure" && targetEmiInput > 0) {
      // P + P*R*n/12 = EMI * n => P = n * (EMI - P*R/12) => n = P / (EMI - P*R/12)
      const tempP = principal;
      const denom = targetEmiInput - (tempP * (annualRate / 100) / 12);
      tenure = denom > 0 ? Math.ceil(tempP / denom) : 1200;
    }
  }

  // Calculate Fees
  const feesCfg = config.fees;
  const pFee = feesCfg.processingFeeType === "percentage" 
    ? principal * (feesCfg.processingFeeValue / 100) 
    : feesCfg.processingFeeValue;
  const gst = pFee * (feesCfg.gstRate / 100);
  const totalFees = pFee + gst + feesCfg.insuranceAmount + feesCfg.otherCharges;

  // Base setup
  const schedule: AmortizationRow[] = [];
  let currentBalance = principal;
  
  let targetEmi = mode === "emi" ? 0 : targetEmiInput;
  if (mode === "emi" && rMonthly > 0 && config.interestConfig.interestCalculationMethod === "reducing") {
    targetEmi = (principal * rMonthly * Math.pow(1 + rMonthly, tenure)) / (Math.pow(1 + rMonthly, tenure) - 1);
  } else if (mode === "emi" && config.interestConfig.interestCalculationMethod === "flat") {
    targetEmi = (principal + principal * (annualRate / 100) * (tenure / 12)) / tenure;
  }

  let baseInterest = (targetEmi * tenure) - principal;

  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let currentMonth = 1;
  const moratoriumMonths = config.moratorium.moratoriumMonths || 0;

  // Moratorium Phase
  for (let i = 0; i < moratoriumMonths; i++) {
    const interest = currentBalance * rMonthly;
    let emiToPay = 0;
    
    if (config.moratorium.moratoriumInterestTreatment === "accrue") {
      currentBalance += interest;
    } else if (config.moratorium.moratoriumInterestTreatment === "pay_only_interest") {
      emiToPay = interest; // user pays it, balance stays same
    } else { // defer_all
      currentBalance += interest;
    }
    
    cumulativeInterest += interest;
    schedule.push({
      month: currentMonth++,
      emi: round(emiToPay),
      interest: round(interest),
      principal: 0,
      balance: round(currentBalance),
      cumulativeInterest: round(cumulativeInterest),
      cumulativePrincipal: round(cumulativePrincipal)
    });
  }

  // Recalc EMI if balance altered by moratorium (common for accrue/defer_all)
  if (moratoriumMonths > 0 && rMonthly > 0 && config.interestConfig.interestCalculationMethod === "reducing") {
    // If we assume same tenure, recalculate EMI over original `tenure`
    if (['accrue', 'defer_all'].includes(config.moratorium.moratoriumInterestTreatment)) {
       targetEmi = (currentBalance * rMonthly * Math.pow(1 + rMonthly, tenure)) / (Math.pow(1 + rMonthly, tenure) - 1);
    }
  }

  // Repayment Phase
  let totalPrepayment = 0;
  
  // Watchdog prevents infinite loops (e.g. rate drops to 0 or flat interest limits)
  let watchdog = 0;
  while (currentBalance > 0.01 && watchdog < 600) {
    watchdog++;
    
    // Floating Rate Checks
    if (config.interestConfig.interestType === "floating") {
      const change = config.rateChanges?.find(r => r.month === currentMonth);
      if (change && rMonthly > 0) {
        annualRate = change.newRate;
        const newRMonthly = (annualRate / 12) / 100;
        const remainingTenure = tenure - (currentMonth - moratoriumMonths - 1);
        if (remainingTenure > 0) {
           targetEmi = (currentBalance * newRMonthly * Math.pow(1 + newRMonthly, remainingTenure)) / (Math.pow(1 + newRMonthly, remainingTenure) - 1);
        }
      }
    }

    const currentRMonthly = (annualRate / 12) / 100;
    const interestForMonth = currentBalance * currentRMonthly;

    // EMI Types Logic
    let dynamicEmi = targetEmi;
    if (config.emiConfig.emiType === "step_up") {
      const stepRate = 1 + (config.emiConfig.emiStepPercent ?? 5) / 100;
      const year = Math.floor((currentMonth - moratoriumMonths - 1) / 12);
      if (year > 0) dynamicEmi = dynamicEmi * Math.pow(stepRate, year);
    } else if (config.emiConfig.emiType === "step_down") {
      const stepRate = 1 - (config.emiConfig.emiStepPercent ?? 5) / 100;
      const year = Math.floor((currentMonth - moratoriumMonths - 1) / 12);
      if (year > 0) dynamicEmi = Math.max(dynamicEmi * Math.pow(stepRate, year), interestForMonth + 1);
    } else if (config.emiConfig.emiType === "bullet") {
      // Bullet = Pay only interest until the final month
      // This usually breaks "tenure" boundaries unless tightly controlled.
      if (currentMonth - moratoriumMonths < tenure) {
        dynamicEmi = interestForMonth; 
      } else {
        dynamicEmi = currentBalance + interestForMonth;
      }
    }

    // Prepayment evaluation
    let prepayAmount = 0;
    let prepayPenalty = 0;
    const pp = config.prepayment;
    if (pp.prepaymentEnabled && currentBalance > 0) {
      if (pp.prepaymentType === "lump_sum" && currentMonth === pp.prepaymentStartMonth) {
         prepayAmount = Math.min(pp.prepaymentAmount, currentBalance);
      } else if (pp.prepaymentType === "recurring") {
         if (pp.prepaymentFrequency === "monthly" && currentMonth >= pp.prepaymentStartMonth) {
           prepayAmount = Math.min(pp.prepaymentAmount, currentBalance);
         } else if (pp.prepaymentFrequency === "yearly" && currentMonth >= pp.prepaymentStartMonth && (currentMonth - pp.prepaymentStartMonth) % 12 === 0) {
           prepayAmount = Math.min(pp.prepaymentAmount, currentBalance);
         }
      }

      if (prepayAmount > 0) {
        prepayPenalty = prepayAmount * (pp.prepaymentChargesPercent / 100);
      }
    }

    let principalPaid = dynamicEmi - interestForMonth;
    
    // Cap principal paid
    if (principalPaid + prepayAmount > currentBalance) {
      principalPaid = currentBalance - prepayAmount;
      dynamicEmi = principalPaid + interestForMonth;
    }

    currentBalance -= (principalPaid + prepayAmount);
    if (currentBalance < 0.01) currentBalance = 0;

    cumulativeInterest += interestForMonth;
    cumulativePrincipal += (principalPaid + prepayAmount);
    totalPrepayment += prepayAmount;

    // Reconstruct the actual user cash out for that row (dynamicEmi + prepay + penalty)
    const rowCashOut = dynamicEmi + prepayAmount + prepayPenalty;

    schedule.push({
      month: currentMonth,
      emi: round(rowCashOut), // Reporting total cash outflow mapped dynamically
      interest: round(interestForMonth),
      principal: round(principalPaid + prepayAmount),
      balance: round(currentBalance),
      cumulativeInterest: round(cumulativeInterest),
      cumulativePrincipal: round(cumulativePrincipal)
    });

    currentMonth++;
  }

  // Compute final FOIR
  let foirExceeded = false;
  let currentFoir = 0;
  if (config.userProfile && config.userProfile.monthlyIncome > 0) {
    currentFoir = ((targetEmi + config.userProfile.existingEMIs) / config.userProfile.monthlyIncome) * 100;
    foirExceeded = currentFoir > config.userProfile.foirLimit;
  }

  const effectiveApr = calculateAPR(principal, schedule, totalFees);
  const totalPayment = principal + cumulativeInterest + totalFees; // Simple reflection

  const finalTenure = currentMonth - 1;
  const tenureReduced = Math.max(0, (tenure + moratoriumMonths) - finalTenure);
  const interestSaved = Math.max(0, baseInterest - cumulativeInterest);

  return {
    emi: round(targetEmi),
    computedLoanAmount: round(principal),
    computedTenureMonths: finalTenure,
    totalInterest: round(cumulativeInterest),
    totalPayment: round(totalPayment),
    apr: effectiveApr,
    interestSaved: round(interestSaved),
    tenureReduced,
    schedule,
    foirExceeded,
    foirValue: round(currentFoir)
  };
}
