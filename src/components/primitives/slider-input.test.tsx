import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SliderInput } from "./slider-input";
import userEvent from "@testing-library/user-event";

describe("SliderInput", () => {
  it("renders correctly with both text and range inputs", () => {
    render(
      <SliderInput
        id="test-slider"
        label="Test Label"
        value="50"
        min="0"
        max="100"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByLabelText("Test Label slider")).toBeInTheDocument();
  });

  it("calls onChange when text input is typed in", async () => {
    const handleChange = vi.fn();
    render(
      <SliderInput
        id="test-slider"
        label="Test Label"
        value="50"
        min="0"
        max="100"
        onChange={handleChange}
      />
    );

    const textInput = screen.getByLabelText("Test Label");
    await userEvent.type(textInput, "0");
    expect(handleChange).toHaveBeenCalled();
  });
});
