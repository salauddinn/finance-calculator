import { render, screen, waitFor } from "@testing-library/react";

import { CalculatorRoute } from "@/app/calculators/[slug]/calculator-route";

describe("CalculatorRoute", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the chosen calculator and restores saved defaults", async () => {
    window.localStorage.setItem(
      "finance-calculator:preferences",
      JSON.stringify({
        schemaVersion: 1,
        theme: "dark",
        calculatorDefaults: {
          "personal-loan": {
            principal: "765432"
          }
        },
        lastUsedCalculator: "sip"
      })
    );

    render(<CalculatorRoute slug="personal-loan" />);

    await waitFor(() => {
      expect(screen.getByRole("textbox", { name: /loan amount/i })).toHaveValue("765432");
    });
  });

  it("records the current calculator as the last used one", async () => {
    render(<CalculatorRoute slug="fixed-deposit" />);

    await waitFor(() => {
      const preferences = JSON.parse(
        window.localStorage.getItem("finance-calculator:preferences") ?? "{}"
      );

      expect(preferences.lastUsedCalculator).toBe("fixed-deposit");
    });
  });
});
