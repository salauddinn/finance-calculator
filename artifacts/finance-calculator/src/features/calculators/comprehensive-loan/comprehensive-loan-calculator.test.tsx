import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComprehensiveLoanCalculator } from "./comprehensive-loan-calculator";

// Mock the preferences hook
vi.mock("@/features/preferences/use-calculator-preferences", () => ({
  useCalculatorPreferences: (id: string, defaultVals: any) => [
    defaultVals,
    vi.fn(),
  ],
}));

describe("ComprehensiveLoanCalculator", () => {
  it("renders simple mode by default with standard inputs", () => {
    render(<ComprehensiveLoanCalculator />);
    
    // Check titles and basic inputs
    expect(screen.getByText("Personal Loan Calculator")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /loan amount/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /annual interest rate/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /tenure in months/i })).toBeInTheDocument();

    // Check basic results
    expect(screen.getByText(/What this means for your budget/i)).toBeInTheDocument();
    expect(screen.getByText("Monthly EMI")).toBeInTheDocument();
    expect(screen.getByText("Total payment")).toBeInTheDocument();
    expect(screen.getByText("Total interest")).toBeInTheDocument();

    // Advanced accordions should not be visible in simple mode
    expect(screen.queryByText("Interest Configuration")).not.toBeInTheDocument();
  });
});
