import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SipCalculator } from "@/features/calculators/sip/sip-calculator";

describe("SipCalculator", () => {
  it("shows the result breakdown and plain-language assumptions", async () => {
    const user = userEvent.setup();

    render(<SipCalculator />);

    await user.clear(screen.getByRole("textbox", { name: /monthly contribution/i }));
    await user.type(screen.getByRole("textbox", { name: /monthly contribution/i }), "10000");
    await user.clear(screen.getByRole("textbox", { name: /expected annual return/i }));
    await user.type(screen.getByRole("textbox", { name: /expected annual return/i }), "12");
    await user.clear(screen.getByRole("textbox", { name: /duration in months/i }));
    await user.type(screen.getByRole("textbox", { name: /duration in months/i }), "24");

    expect(screen.getAllByText(/invested amount/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/estimated returns/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/maturity value/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/we assume you invest the same amount every month/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/what this means for your investing goal/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/if returns stay steady, your money could grow to/i)
    ).toBeInTheDocument();
  });
});
