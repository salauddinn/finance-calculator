import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeLoanAdvancedCalculator } from "@/features/calculators/home-loan/advanced/home-loan-advanced-calculator";

describe("HomeLoanAdvancedCalculator", () => {
  it("shows updated scenario results and impact explanations", async () => {
    const user = userEvent.setup();

    render(<HomeLoanAdvancedCalculator />);

    await user.selectOptions(screen.getByLabelText(/strategy/i), "keep-tenure-adjust-emi");
    await user.clear(screen.getByLabelText(/prepayment amount/i));
    await user.type(screen.getByLabelText(/prepayment amount/i), "200000");
    await user.click(screen.getByRole("button", { name: /recalculate advanced plan/i }));

    expect(screen.getByText(/final monthly emi/i)).toBeInTheDocument();
    expect(screen.getAllByText(/₹37,983/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/impact summary/i)).toBeInTheDocument();
    expect(screen.getByText(/prepayment of ₹2,00,000/i)).toBeInTheDocument();
    expect(screen.getByText(/what this scenario is telling you/i)).toBeInTheDocument();
  });
});
