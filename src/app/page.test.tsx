import { render, screen } from "@testing-library/react";
import { waitFor } from "@testing-library/react";

import HomePage from "@/app/page";

describe("HomePage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the primary finance calculator heading", () => {
    const { container } = render(<HomePage />);

    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /finance calculators for real life decisions/i
      })
    ).toBeInTheDocument();
    expect(container.querySelector(".landing-hero")).toHaveClass("motion-fade-up");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /pick the calculator that matches your next money decision/i
      })
    ).toBeInTheDocument();
  });

  it("shows trust messaging and calculator navigation", () => {
    const { container } = render(<HomePage />);

    expect(
      screen.getByText(
        /designed for salary earners, first-time investors, and real financial planning/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /explore personal loan calculator/i })
    ).toHaveAttribute("href", "/calculators/personal-loan");
    expect(
      screen.getByRole("link", { name: /explore home loan calculator/i })
    ).toHaveAttribute("href", "/calculators/home-loan");
    expect(
      screen.getAllByText(/understand the monthly commitment before you commit/i)
        .length
    ).toBeGreaterThan(0);
    expect(container.querySelector(".trust-strip")).toHaveClass("motion-fade-up");
    expect(container.querySelectorAll(".category-card")[0]).toHaveClass(
      "motion-fade-up",
      "motion-stagger-1"
    );
  });

  it("routes users into the chosen calculator entry point", () => {
    render(<HomePage />);

    const fixedDepositLink = screen.getByRole("link", {
      name: /explore fixed deposit calculator/i
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
