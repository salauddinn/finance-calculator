import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FixedDepositCalculator } from "@/features/calculators/fixed-deposit/fixed-deposit-calculator";

describe("FixedDepositCalculator", () => {
  it("shows maturity value and interest earned", () => {
    render(<FixedDepositCalculator />);

    expect(screen.getByText(/maturity value/i)).toBeInTheDocument();
    expect(screen.getByText(/interest earned/i)).toBeInTheDocument();
  });

  it("recalculates immediately when the compounding frequency changes", async () => {
    const user = userEvent.setup();

    render(<FixedDepositCalculator />);

    const maturityBefore = screen.getByTestId("fd-maturity-value").textContent;

    await user.selectOptions(screen.getByLabelText(/compounding frequency/i), "monthly");

    expect(screen.getByTestId("fd-maturity-value").textContent).not.toBe(maturityBefore);
  });
});
