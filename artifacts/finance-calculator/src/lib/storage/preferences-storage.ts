import type { ValidationIssue, ValidationResult } from "@/lib/validation/calculator-inputs";

const STORAGE_KEY = "finance-calculator:preferences";
const CALCULATOR_IDS = [
  "personal-loan",
  "home-loan",
  "home-loan-simple",
  "home-loan-advanced",
  "sip",
  "fixed-deposit",
  "ppf",
  "hra",
  "emergency-fund",
  "credit-card-payoff",
  "rent-vs-buy",
  "gratuity",
  "ctc-salary",
  "lumpsum",
  "goal-sip",
  "income-tax",
  "nps",
  "inflation",
  "ssy"
] as const;
const THEMES = ["light", "dark", "system"] as const;

type CalculatorId = (typeof CALCULATOR_IDS)[number];
type ThemePreference = (typeof THEMES)[number];

export interface StoredPreferences {
  schemaVersion: 1;
  theme: ThemePreference;
  calculatorDefaults: Partial<Record<CalculatorId, Record<string, number | string | boolean>>>;
  lastUsedCalculator?: CalculatorId;
}

export interface PreferencesStorageAdapter {
  load(): ValidationResult<StoredPreferences>;
  save(preferences: StoredPreferences): void;
  clear(): void;
}

export const DEFAULT_PREFERENCES: StoredPreferences = {
  schemaVersion: 1,
  theme: "light",
  calculatorDefaults: {}
};

const INVALID_PREFERENCES_ISSUES: ValidationIssue[] = [
  {
    field: "preferences",
    message: "Stored preferences are invalid and were reset."
  }
];

function invalidPreferences(): ValidationResult<StoredPreferences> {
  return {
    ok: false,
    issues: INVALID_PREFERENCES_ISSUES
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === "string" && THEMES.includes(value as ThemePreference);
}

function isCalculatorId(value: unknown): value is CalculatorId {
  return typeof value === "string" && CALCULATOR_IDS.includes(value as CalculatorId);
}

function areDefaultsValid(value: unknown): value is StoredPreferences["calculatorDefaults"] {
  if (!isPlainObject(value)) {
    return false;
  }

  return Object.entries(value).every(([calculatorId, defaults]) => {
    if (!isCalculatorId(calculatorId) || !isPlainObject(defaults)) {
      return false;
    }

    return Object.values(defaults).every((entry) => {
      const type = typeof entry;
      return type === "number" || type === "string" || type === "boolean";
    });
  });
}

function parseStoredPreferences(value: unknown): ValidationResult<StoredPreferences> {
  if (!isPlainObject(value)) {
    return invalidPreferences();
  }

  if (value.schemaVersion !== 1 || !isThemePreference(value.theme) || !areDefaultsValid(value.calculatorDefaults)) {
    return invalidPreferences();
  }

  if (value.lastUsedCalculator !== undefined && !isCalculatorId(value.lastUsedCalculator)) {
    return invalidPreferences();
  }

  return {
    ok: true,
    data: {
      schemaVersion: 1,
      theme: value.theme,
      calculatorDefaults: value.calculatorDefaults,
      lastUsedCalculator: value.lastUsedCalculator
    }
  };
}

function resetInvalidPayload(storage: Storage): ValidationIssue[] {
  storage.removeItem(STORAGE_KEY);
  return INVALID_PREFERENCES_ISSUES;
}

export function createPreferencesStorageAdapter(storage: Storage = window.localStorage): PreferencesStorageAdapter {
  return {
    load() {
      const rawValue = storage.getItem(STORAGE_KEY);

      if (rawValue === null) {
        return { ok: true, data: DEFAULT_PREFERENCES };
      }

      try {
        const parsed = JSON.parse(rawValue);
        const result = parseStoredPreferences(parsed);

        if (!result.ok) {
          return {
            ok: false,
            issues: resetInvalidPayload(storage)
          };
        }

        return result;
      } catch {
        return {
          ok: false,
          issues: resetInvalidPayload(storage)
        };
      }
    },
    save(preferences) {
      storage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    },
    clear() {
      storage.removeItem(STORAGE_KEY);
    }
  };
}
