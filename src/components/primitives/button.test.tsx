import { render, screen } from "@testing-library/react";

import { Button } from "@/components/primitives/button";

describe("Button", () => {
  it("renders an accessible primary action button", () => {
    render(<Button>Calculate now</Button>);

    const button = screen.getByRole("button", { name: /calculate now/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("button", "button--primary");
  });
});
