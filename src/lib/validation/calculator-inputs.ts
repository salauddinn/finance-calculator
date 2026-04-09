export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationSuccess<T> {
  ok: true;
  data: T;
}

export interface ValidationFailure {
  ok: false;
  issues: ValidationIssue[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

type RawSimpleLoanInput = {
  principal: string;
  annualRatePct: string;
  tenureMonths: string;
};

type HomeLoanStrategy = "keep-emi-adjust-tenure" | "keep-tenure-adjust-emi";

type RawAdvancedEvent =
  | {
      id: string;
      monthIndex: string;
      type: "prepayment";
      amount: string;
    }
  | {
      id: string;
      monthIndex: string;
      type: "rate-change";
      newAnnualRatePct: string;
    }
  | {
      id: string;
      monthIndex: string;
      type: "moratorium";
      durationMonths: string;
      interestAccrues: boolean;
    };

type RawAdvancedHomeLoanInput = RawSimpleLoanInput & {
  strategy: HomeLoanStrategy;
  events: RawAdvancedEvent[];
};

type CurrencyAmount = {
  value: number;
  currency: "INR";
};

type SimpleLoanInput = {
  principal: CurrencyAmount;
  annualRatePct: number;
  tenureMonths: number;
};

type HomeLoanEvent =
  | {
      id: string;
      monthIndex: number;
      type: "prepayment";
      amount: CurrencyAmount;
    }
  | {
      id: string;
      monthIndex: number;
      type: "rate-change";
      newAnnualRatePct: number;
    }
  | {
      id: string;
      monthIndex: number;
      type: "moratorium";
      durationMonths: number;
      interestAccrues: boolean;
    };

type AdvancedHomeLoanInput = SimpleLoanInput & {
  strategy: HomeLoanStrategy;
  events: HomeLoanEvent[];
};

function parsePositiveAmount(value: string, field: string): ValidationIssue | number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return {
      field,
      message: "Principal must be greater than zero."
    };
  }

  return parsed;
}

function parseRate(value: string, field: string): ValidationIssue | number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 100) {
    return {
      field,
      message: "Rate must be greater than zero and at most 100."
    };
  }

  return parsed;
}

function parseWholeMonths(value: string, field: string, label = "Tenure"): ValidationIssue | number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return {
      field,
      message: `${label} must be a whole number of months.`
    };
  }

  return parsed;
}

function issueOrValue<T>(value: ValidationIssue | T, issues: ValidationIssue[]): T | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    "field" in value
  ) {
    issues.push(value as ValidationIssue);
    return undefined;
  }

  return value as T;
}

export function parseSimpleLoanInput(input: RawSimpleLoanInput): ValidationResult<SimpleLoanInput> {
  const issues: ValidationIssue[] = [];
  const principal = issueOrValue(parsePositiveAmount(input.principal, "principal"), issues);
  const annualRatePct = issueOrValue(parseRate(input.annualRatePct, "annualRatePct"), issues);
  const tenureMonths = issueOrValue(parseWholeMonths(input.tenureMonths, "tenureMonths"), issues);

  if (issues.length > 0 || principal === undefined || annualRatePct === undefined || tenureMonths === undefined) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    data: {
      principal: {
        value: principal,
        currency: "INR"
      },
      annualRatePct,
      tenureMonths
    }
  };
}

function parseAdvancedEvent(event: RawAdvancedEvent, issues: ValidationIssue[]): HomeLoanEvent | undefined {
  const monthIndex = issueOrValue(parseWholeMonths(event.monthIndex, "events", "Event month"), issues);

  if (monthIndex === undefined) {
    return undefined;
  }

  if (event.type === "prepayment") {
    const amount = issueOrValue(parsePositiveAmount(event.amount, "events"), issues);
    if (amount === undefined) {
      return undefined;
    }

    return {
      id: event.id,
      monthIndex,
      type: "prepayment",
      amount: { value: amount, currency: "INR" }
    };
  }

  if (event.type === "rate-change") {
    const newAnnualRatePct = issueOrValue(parseRate(event.newAnnualRatePct, "events"), issues);
    if (newAnnualRatePct === undefined) {
      return undefined;
    }

    return {
      id: event.id,
      monthIndex,
      type: "rate-change",
      newAnnualRatePct
    };
  }

  const durationMonths = issueOrValue(parseWholeMonths(event.durationMonths, "events", "Moratorium duration"), issues);
  if (durationMonths === undefined) {
    return undefined;
  }

  return {
    id: event.id,
    monthIndex,
    type: "moratorium",
    durationMonths,
    interestAccrues: event.interestAccrues
  };
}

export function parseAdvancedHomeLoanInput(
  input: RawAdvancedHomeLoanInput
): ValidationResult<AdvancedHomeLoanInput> {
  const baseResult = parseSimpleLoanInput(input);

  if (!baseResult.ok) {
    return baseResult;
  }

  const issues: ValidationIssue[] = [];
  const events = input.events
    .map((event) => parseAdvancedEvent(event, issues))
    .filter((event): event is HomeLoanEvent => event !== undefined);

  if (events.some((event, index) => index > 0 && event.monthIndex < events[index - 1].monthIndex)) {
    issues.push({
      field: "events",
      message: "Events must be ordered by month."
    });
  }

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    data: {
      ...baseResult.data,
      strategy: input.strategy,
      events
    }
  };
}
