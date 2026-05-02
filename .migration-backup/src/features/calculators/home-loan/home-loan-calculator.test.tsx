import { render, screen } from "@testing-library/react";
import { HomeLoanCalculator } from "./home-loan-calculator";

// Mock the preferences hook
vi.mock("@/features/preferences/use-calculator-preferences", () => ({
  useCalculatorPreferences: (id: string, defaultVals: any) => [
    defaultVals,
    vi.fn(),
  ],
}));

describe("HomeLoanCalculator wrapper", () => {
  it("renders simple mode by default", () => {
    render(<HomeLoanCalculator />);
    
    expect(screen.getByText("Home loan planner")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /home loan amount/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /annual interest rate/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /tenure in months/i })).toBeInTheDocument();

    // Verify it calculates
    expect(screen.getByText(/Total repayment/i)).toBeInTheDocument();
  });
});
