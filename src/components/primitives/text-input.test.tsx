import { render, screen } from "@testing-library/react";

import { TextInput } from "@/components/primitives/text-input";

describe("TextInput", () => {
  it("renders a labeled input with supporting text", () => {
    render(
      <TextInput
        id="principal"
        label="Loan amount"
        hint="Enter the principal in rupees."
      />
    );

    expect(screen.getByLabelText(/loan amount/i)).toBeInTheDocument();
    expect(screen.getByText(/enter the principal in rupees/i)).toBeInTheDocument();
  });
});
