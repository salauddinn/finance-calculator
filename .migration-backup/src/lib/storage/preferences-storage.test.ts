import {
  createPreferencesStorageAdapter,
  DEFAULT_PREFERENCES
} from "@/lib/storage/preferences-storage";

describe("createPreferencesStorageAdapter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads valid stored preferences", () => {
    window.localStorage.setItem(
      "finance-calculator:preferences",
      JSON.stringify({
        schemaVersion: 1,
        theme: "dark",
        calculatorDefaults: {
          "personal-loan": {
            tenureMonths: 60
          }
        },
        lastUsedCalculator: "personal-loan"
      })
    );

    const adapter = createPreferencesStorageAdapter();

    expect(adapter.load()).toEqual({
      ok: true,
      data: {
        schemaVersion: 1,
        theme: "dark",
        calculatorDefaults: {
          "personal-loan": {
            tenureMonths: 60
          }
        },
        lastUsedCalculator: "personal-loan"
      }
    });
  });

  it("rejects malformed payloads safely", () => {
    window.localStorage.setItem(
      "finance-calculator:preferences",
      JSON.stringify({
        schemaVersion: 2,
        theme: "midnight"
      })
    );

    const adapter = createPreferencesStorageAdapter();

    expect(adapter.load()).toEqual({
      ok: false,
      issues: [
        {
          field: "preferences",
          message: "Stored preferences are invalid and were reset."
        }
      ]
    });
    expect(window.localStorage.getItem("finance-calculator:preferences")).toBeNull();
  });

  it("saves and clears preferences using the schema contract", () => {
    const adapter = createPreferencesStorageAdapter();

    adapter.save({
      ...DEFAULT_PREFERENCES,
      theme: "dark",
      lastUsedCalculator: "sip"
    });

    expect(JSON.parse(window.localStorage.getItem("finance-calculator:preferences") ?? "{}")).toEqual({
      schemaVersion: 1,
      theme: "dark",
      calculatorDefaults: {},
      lastUsedCalculator: "sip"
    });

    adapter.clear();

    expect(window.localStorage.getItem("finance-calculator:preferences")).toBeNull();
  });
});
