import { render, screen } from "@testing-library/react";

import CalculatorEntryPage from "@/app/calculators/[slug]/page";

describe("CalculatorEntryPage", () => {
  it("renders a single-column calculator hero without the old how-to sidebar", async () => {
    const result = await CalculatorEntryPage({
      params: Promise.resolve({ slug: "personal-loan" })
    });

    render(result);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /personal loan calculator/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/^Calculator entry$/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/how to use this page/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to all calculators/i })
    ).toHaveAttribute("href", "/");
  });
});
