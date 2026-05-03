import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SegmentedControl } from "@/components/primitives/segmented-control";

describe("SegmentedControl", () => {
  it("supports keyboard navigation between options", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <SegmentedControl
        ariaLabel="Home loan mode"
        value="simple"
        options={[
          { label: "Simple", value: "simple" },
          { label: "Advanced", value: "advanced" }
        ]}
        onChange={handleChange}
      />
    );

    const simple = screen.getByRole("radio", { name: /simple/i });

    simple.focus();
    await user.keyboard("{ArrowRight}");

    expect(handleChange).toHaveBeenCalledWith("advanced");
  });
});
