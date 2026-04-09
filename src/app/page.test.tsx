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
});
