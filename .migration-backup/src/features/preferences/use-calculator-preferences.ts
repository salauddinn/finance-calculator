"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_PREFERENCES,
  createPreferencesStorageAdapter,
  type StoredPreferences
} from "@/lib/storage/preferences-storage";

type CalculatorId =
  | "personal-loan"
  | "home-loan"
  | "home-loan-simple"
  | "home-loan-advanced"
  | "sip"
  | "fixed-deposit";

type StoredInputRecord = Record<string, string>;

function loadPreferences(): StoredPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  const result = createPreferencesStorageAdapter().load();
  return result.ok ? result.data : DEFAULT_PREFERENCES;
}

function mergeDefaults<T extends StoredInputRecord>(
  defaults: T,
  storedDefaults: StoredPreferences["calculatorDefaults"][CalculatorId]
): T {
  if (!storedDefaults) {
    return defaults;
  }

  return Object.entries(defaults).reduce((accumulator, [key, value]) => {
    const storedValue = storedDefaults[key];
    const nextValue =
      typeof storedValue === "string" || typeof storedValue === "number"
        ? String(storedValue)
        : value;
    accumulator[key as keyof T] = nextValue as T[keyof T];
    return accumulator;
  }, { ...defaults });
}

export function useCalculatorPreferences<T extends StoredInputRecord>(
  calculatorId: CalculatorId,
  defaults: T
) {
  const [inputs, setInputs] = useState<T>(() => {
    const preferences = loadPreferences();
    return mergeDefaults(defaults, preferences.calculatorDefaults[calculatorId]);
  });

  useEffect(() => {
    const preferences = loadPreferences();

    createPreferencesStorageAdapter().save({
      ...preferences,
      lastUsedCalculator: calculatorId,
      calculatorDefaults: {
        ...preferences.calculatorDefaults,
        [calculatorId]: inputs
      }
    });
  }, [calculatorId, inputs]);

  return [inputs, setInputs] as const;
}
