import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PersonalLoanCalculator } from "@/features/calculators/personal-loan/personal-loan-calculator";

describe("PersonalLoanCalculator", () => {
  it("shows updated loan results immediately when inputs change", async () => {
    const user = userEvent.setup();

    render(<PersonalLoanCalculator />);

    await user.clear(screen.getByLabelText(/loan amount/i));
    await user.type(screen.getByLabelText(/loan amount/i), "500000");
    await user.clear(screen.getByLabelText(/annual interest rate/i));
    await user.type(screen.getByLabelText(/annual interest rate/i), "10");
    await user.clear(screen.getByLabelText(/tenure in months/i));
    await user.type(screen.getByLabelText(/tenure in months/i), "24");

    expect(screen.getByText(/monthly emi/i)).toBeInTheDocument();
    expect(screen.getAllByText(/₹23,072/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₹5,53,739/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/₹53,739/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/what this means for your budget/i)).toBeInTheDocument();
    expect(
      screen.getByText(/you would pay around ₹23,072 every month for 24 months/i)
    ).toBeInTheDocument();
  });

  it("shows validation feedback for invalid inputs without breaking the page", async () => {
    const user = userEvent.setup();

    render(<PersonalLoanCalculator />);

    await user.clear(screen.getByLabelText(/loan amount/i));
    await user.type(screen.getByLabelText(/loan amount/i), "-1");

    expect(screen.getByText(/principal must be greater than zero/i)).toBeInTheDocument();
  });
});
