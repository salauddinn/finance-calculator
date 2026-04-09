import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeLoanSimpleCalculator } from "@/features/calculators/home-loan/simple/home-loan-simple-calculator";

describe("HomeLoanSimpleCalculator", () => {
  it("shows EMI results in simple mode when inputs change", async () => {
    const user = userEvent.setup();

    render(<HomeLoanSimpleCalculator />);

    await user.clear(screen.getByLabelText(/home loan amount/i));
    await user.type(screen.getByLabelText(/home loan amount/i), "4500000");
    await user.clear(screen.getByLabelText(/annual interest rate/i));
    await user.type(screen.getByLabelText(/annual interest rate/i), "8.75");
    await user.clear(screen.getByLabelText(/tenure in months/i));
    await user.type(screen.getByLabelText(/tenure in months/i), "240");

    expect(screen.getByText(/monthly emi/i)).toBeInTheDocument();
    expect(screen.getByText(/₹39,766\.98/i)).toBeInTheDocument();
    expect(screen.getByText(/₹95,44,075\.66/i)).toBeInTheDocument();
    expect(screen.getByText(/₹50,44,075\.66/i)).toBeInTheDocument();
  });

  it("shows a clear path to advanced home loan planning", () => {
    render(<HomeLoanSimpleCalculator />);

    expect(
      screen.getByRole("link", { name: /switch to advanced home loan planner/i })
    ).toHaveAttribute("href", "/calculators/home-loan?mode=advanced");
  });
});
