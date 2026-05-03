import { render, screen } from "@testing-library/react";

import { ResultSummaryCard } from "@/components/primitives/result-summary-card";

describe("ResultSummaryCard", () => {
  it("renders a highlighted result value and label", () => {
    render(
      <ResultSummaryCard
        label="Monthly EMI"
        value="₹42,350"
        tone="positive"
      />
    );

    expect(screen.getByText(/monthly emi/i)).toBeInTheDocument();
    expect(screen.getByText("₹42,350")).toBeInTheDocument();
    expect(screen.getByTestId("result-summary-card")).toHaveClass(
      "result-summary-card--positive"
    );
  });
});
