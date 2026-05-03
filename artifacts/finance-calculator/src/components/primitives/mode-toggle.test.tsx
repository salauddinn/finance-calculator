import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ModeToggle } from "./mode-toggle";

describe("ModeToggle", () => {
  it("renders with the default simple mode", () => {
    render(<ModeToggle mode="simple" onChange={vi.fn()} />);
    
    const simpleBtn = screen.getByRole("button", { name: /simple/i });
    const advancedBtn = screen.getByRole("button", { name: /advanced/i });

    expect(simpleBtn).toHaveAttribute("aria-pressed", "true");
    expect(advancedBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange when the inactive mode is clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<ModeToggle mode="simple" onChange={handleChange} />);
    
    await user.click(screen.getByRole("button", { name: /advanced/i }));
    
    expect(handleChange).toHaveBeenCalledWith("advanced");
  });

  it("does not call onChange when the already active mode is clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<ModeToggle mode="simple" onChange={handleChange} />);
    
    await user.click(screen.getByRole("button", { name: /simple/i }));
    
    expect(handleChange).not.toHaveBeenCalled();
  });
});
