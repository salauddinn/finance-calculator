# Interface Contracts

> **Status:** Draft complete
> **Stage:** implementation-planning
> **Last updated:** 2026-04-08

## Shared Type Contracts

### Calculator identifiers

```ts
type CalculatorId =
  | "personal-loan"
  | "home-loan-simple"
  | "home-loan-advanced"
  | "sip"
  | "fixed-deposit";
```

### Common value objects

```ts
interface CurrencyAmount {
  value: number;
  currency: "INR";
}

interface PercentageRate {
  annualRatePct: number;
}

interface Tenure {
  months: number;
}
```

## Loan Calculator Contracts

### Simple loan input

```ts
interface SimpleLoanInput {
  principal: CurrencyAmount;
  annualRatePct: number;
  tenureMonths: number;
}
```

### Simple loan result

```ts
interface SimpleLoanResult {
  monthlyEmi: CurrencyAmount;
  totalRepayment: CurrencyAmount;
  totalInterest: CurrencyAmount;
  monthlyRatePct: number;
}
```

### Advanced personal loan input

```ts
interface AdvancedPersonalLoanInput extends SimpleLoanInput {
  delayEmiMonths: number;
  processingFeeAmount: CurrencyAmount;
  prepayments: {
    monthIndex: number;
    amount: CurrencyAmount;
  }[];
}
```

### Advanced personal loan result

```ts
interface AdvancedPersonalLoanResult {
  monthlyEmi: CurrencyAmount;
  finalTenureMonths: number;
  totalRepayment: CurrencyAmount;
  totalInterest: CurrencyAmount;
  effectiveAprPct: number;
  totalPrepaymentAmount: CurrencyAmount;
  schedule: LoanScheduleRow[];
}
```

### Advanced home loan event schema

```ts
type HomeLoanEventType = "prepayment" | "rate-change" | "moratorium";

interface HomeLoanEventBase {
  id: string;
  monthIndex: number;
  type: HomeLoanEventType;
  note?: string;
}

interface PrepaymentEvent extends HomeLoanEventBase {
  type: "prepayment";
  amount: CurrencyAmount;
}

interface RateChangeEvent extends HomeLoanEventBase {
  type: "rate-change";
  newAnnualRatePct: number;
}

interface MoratoriumEvent extends HomeLoanEventBase {
  type: "moratorium";
  durationMonths: number;
  interestAccrues: boolean;
}

type HomeLoanEvent = PrepaymentEvent | RateChangeEvent | MoratoriumEvent;
```

### Advanced home loan input

```ts
interface AdvancedHomeLoanInput extends SimpleLoanInput {
  events: HomeLoanEvent[];
  strategy: "keep-emi-adjust-tenure" | "keep-tenure-adjust-emi";
}
```

### Advanced home loan result

```ts
interface LoanScheduleRow {
  monthIndex: number;
  openingBalance: CurrencyAmount;
  emi: CurrencyAmount;
  principalPaid: CurrencyAmount;
  interestPaid: CurrencyAmount;
  closingBalance: CurrencyAmount;
  eventApplied?: HomeLoanEventType;
}

interface AdvancedHomeLoanResult {
  finalMonthlyEmi: CurrencyAmount;
  finalTenureMonths: number;
  totalRepayment: CurrencyAmount;
  totalInterest: CurrencyAmount;
  totalPrepaymentAmount: CurrencyAmount;
  schedule: LoanScheduleRow[];
  impactSummary: string[];
}
```

## SIP Contracts

### SIP input

```ts
interface SipAdvancedConfig {
  stepUpPercentage?: number;
  inflationRate?: number;
  taxationEnabled: boolean;
}

interface SipInput {
  monthlyContribution: CurrencyAmount;
  annualReturnPct: number;
  durationMonths: number;
  advancedConfig?: SipAdvancedConfig;
}
```

### SIP result

```ts
interface SipResult {
  investedAmount: CurrencyAmount;
  estimatedReturns: CurrencyAmount;
  maturityValue: CurrencyAmount;
}
```

## Fixed Deposit Contracts

### Fixed deposit input

```ts
type CompoundingFrequency = "monthly" | "quarterly" | "half-yearly" | "yearly";

interface FdAdvancedConfig {
  payoutFrequency: "cumulative" | "monthly" | "quarterly" | "yearly";
  seniorCitizen: boolean;
  tdsEnabled: boolean;
}

interface FixedDepositInput {
  depositAmount: CurrencyAmount;
  annualRatePct: number;
  durationMonths: number;    // NOTE: Code uses `durationMonths` but old docs said `tenureMonths`
  compoundingFrequency: CompoundingFrequency;
  advancedConfig?: FdAdvancedConfig;
}
```

### Fixed deposit result

```ts
interface FixedDepositResult {
  maturityValue: CurrencyAmount;
  interestEarned: CurrencyAmount;
}
```

## Validation Contracts

### Parser result

```ts
interface ValidationIssue {
  field: string;
  message: string;
}

interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  issues?: ValidationIssue[];
}
```

Rules:
- Currency fields must be positive numbers greater than zero
- Rate fields must be numbers between 0 and 100
- Tenure must be a positive whole number of months
- Advanced home loan events must be ordered by `monthIndex`
- Moratorium duration cannot exceed a defined scenario guardrail without validation failure

## Persistence Contracts

### App preference payload

```ts
interface StoredPreferences {
  schemaVersion: 1;
  theme: "light" | "dark" | "system";
  calculatorDefaults: Partial<Record<CalculatorId, Record<string, number | string | boolean>>>;
  lastUsedCalculator?: CalculatorId;
}
```

### Persistence adapter

```ts
interface PreferencesStorageAdapter {
  load(): ValidationResult<StoredPreferences>;
  save(preferences: StoredPreferences): void;
  clear(): void;
}
```

Rules:
- Only non-sensitive UI preferences and recent input defaults may be stored
- Storage reads must validate `schemaVersion`
- Invalid payloads must be ignored and replaced with defaults

## UI Boundary Contracts

### Calculator page shell props

```ts
interface CalculatorPageShellProps {
  title: string;
  description: string;
  disclaimer: string;
  primaryResultLabel: string;
}
```

### Result summary item

```ts
interface ResultSummaryItem {
  label: string;
  value: string;
  tone?: "default" | "positive" | "caution";
}
```

## Comprehensive Underwriting Engine Contracts (V2)

### 11-Group JSON Payload

```ts
type CalculationMode = "emi" | "loan_amount" | "tenure";
type InterestCalculationMethod = "reducing" | "flat";
type CompoundingFrequency = "monthly" | "quarterly" | "daily";
type EmiType = "standard" | "step_up" | "step_down" | "bullet";

interface MasterUnderwritingInput {
  loan: {
    loanAmount: number;
    interestRateAnnual: number;
    tenureMonths: number;
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
    emiStepPercent?: number; // Default: 5. Annual step % for step_up/step_down.
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
  };
}
```

### Computed Underwriting Output

```ts
interface MasterUnderwritingResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  apr: number;
  interestSaved: number;
  tenureReduced: number;
  schedule: AmortizationRow[];
}

interface AmortizationRow {
  month: number;
  emi: number;
  interest: number;
  principal: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}
```

## External Interfaces

V2 remains a frontend-first product with no server-side user data storage. All FOIR analysis runs locally. Any future integrations require a superseding ADR and updated contracts in this document before implementation.
