import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeLoanSimpleCalculator } from "@/features/calculators/home-loan/simple/home-loan-simple-calculator";

describe("HomeLoanSimpleCalculator", () => {
  it("shows EMI results in simple mode when inputs change", async () => {
    const user = userEvent.setup();

    render(<HomeLoanSimpleCalculator />);

    await user.clear(screen.getByRole("textbox", { name: /home loan amount/i }));
    await user.type(screen.getByRole("textbox", { name: /home loan amount/i }), "4500000");
    await user.clear(screen.getByRole("textbox", { name: /annual interest rate/i }));
    await user.type(screen.getByRole("textbox", { name: /annual interest rate/i }), "8.75");
    await user.clear(screen.getByRole("textbox", { name: /tenure in months/i }));
    await user.type(screen.getByRole("textbox", { name: /tenure in months/i }), "240");

    expect(screen.getByText(/monthly emi/i)).toBeInTheDocument();
    expect(screen.getAllByText(/₹39,767/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₹95,44,076/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₹50,44,076/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/what this means for your home plan/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your current estimate is about ₹39,767 per month/i)
    ).toBeInTheDocument();
  });

  it("shows a clear path to advanced home loan planning", () => {
    render(<HomeLoanSimpleCalculator />);

    expect(
      screen.getByRole("link", { name: /switch to advanced home loan planner/i })
    ).toHaveAttribute("href", "/calculators/home-loan?mode=advanced");
  });
});
