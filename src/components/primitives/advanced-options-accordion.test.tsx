import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { AdvancedOptionsAccordion } from "./advanced-options-accordion";

describe("AdvancedOptionsAccordion", () => {
  it("renders children when expanded", async () => {
    const user = userEvent.setup();
    render(
      <AdvancedOptionsAccordion title="Advanced Settings">
        <div data-testid="child">Hidden Stuff</div>
      </AdvancedOptionsAccordion>
    );
    
    // Initially hidden
    let child = screen.queryByTestId("child");
    if (child) {
      expect(child).not.toBeVisible();
    }
    
    // Expand
    const button = screen.getByRole("button", { name: /Advanced Settings/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    
    child = screen.getByTestId("child");
    expect(child).toBeVisible();
  });
});
