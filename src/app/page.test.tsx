import { render, screen } from "@testing-library/react";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows the primary finance calculator heading", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /finance calculators for real life decisions/i
      })
    ).toBeInTheDocument();
  });

  it("shows trust messaging and calculator navigation", () => {
    render(<HomePage />);

    expect(
      screen.getByText(/built for transparent assumptions, not hidden surprises/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore personal loan calculator/i })
    ).toHaveAttribute("href", "/calculators/personal-loan");
    expect(
      screen.getByRole("link", { name: /explore home loan calculator/i })
    ).toHaveAttribute("href", "/calculators/home-loan");
  });

  it("routes users into the chosen calculator entry point", () => {
    render(<HomePage />);

    const fixedDepositLink = screen.getByRole("link", {
      name: /explore fixed deposit calculator/i
    });

    expect(fixedDepositLink).toHaveAttribute("href", "/calculators/fixed-deposit");
  });
});
