import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";

import HomePage from "@/app/page";

describe("HomePage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the centered hero heading, badge, and call-to-action buttons", () => {
    const { container } = render(<HomePage />);

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByText(/india-first finance tools/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /money decisions, made clear/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore calculators/i })
    ).toHaveAttribute("href", "#calculator-categories");
    expect(screen.getByRole("link", { name: /learn more/i })).toHaveAttribute(
      "href",
      "#homepage-stats"
    );
    expect(container.querySelector(".landing-hero")).toHaveClass("motion-fade-up");
  });

  it("shows category cards with pill badges and a glass stat strip", () => {
    const { container } = render(<HomePage />);

    expect(
      screen.getByRole("link", { name: /explore personal loan calculator ↗/i })
    ).toHaveAttribute("href", "/calculators/personal-loan");
    expect(
      screen.getByRole("link", { name: /explore home loan calculator ↗/i })
    ).toHaveAttribute("href", "/calculators/home-loan");
    expect(screen.getAllByText(/loan/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/investment/i)).toBeInTheDocument();
    expect(screen.getByText(/^Savings$/i)).toBeInTheDocument();
    expect(screen.getByText(/^5$/)).toBeInTheDocument();
    expect(screen.getByText(/^Calculators$/)).toBeInTheDocument();
    expect(screen.getByText(/^2$/)).toBeInTheDocument();
    expect(screen.getByText(/^Home Loan Modes$/)).toBeInTheDocument();
    expect(screen.getByText(/^0$/)).toBeInTheDocument();
    expect(screen.getByText(/^Accounts Required$/)).toBeInTheDocument();
    expect(container.querySelector(".landing-stats")).toHaveClass("motion-fade-up");
    expect(container.querySelectorAll(".category-card")[0]).toHaveClass(
      "motion-fade-up",
      "motion-stagger-1"
    );
  });

  it("routes users into the chosen calculator entry point", () => {
    render(<HomePage />);

    const fixedDepositLink = screen.getByRole("link", {
      name: /explore fixed deposit calculator ↗/i
    });

    expect(fixedDepositLink).toHaveAttribute("href", "/calculators/fixed-deposit");
  });

  it("shows a continue link for the last used calculator", async () => {
    window.localStorage.setItem(
      "finance-calculator:preferences",
      JSON.stringify({
        schemaVersion: 1,
        theme: "light",
        calculatorDefaults: {},
        lastUsedCalculator: "sip"
      })
    );

    render(<HomePage />);

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /continue with sip calculator/i })
      ).toHaveAttribute("href", "/calculators/sip");
    });
  });
});
