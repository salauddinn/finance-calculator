import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ThemeProvider } from "@/features/preferences/theme/theme-provider";

describe("ThemeProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to the dark theme when no saved preference exists", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
        <div>Theme content</div>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
  });

  it("restores the stored dark theme preference on load", async () => {
    window.localStorage.setItem(
      "finance-calculator:preferences",
      JSON.stringify({
        schemaVersion: 1,
        theme: "dark",
        calculatorDefaults: {}
      })
    );

    render(
      <ThemeProvider>
        <ThemeToggle />
        <div>Theme content</div>
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });
  });

  it("toggles theme and persists the new value", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
        <div>Theme content</div>
      </ThemeProvider>
    );

    const toggle = screen.getByRole("button", { name: /switch to light mode/i });

    await user.click(toggle);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
    });

    expect(
      JSON.parse(window.localStorage.getItem("finance-calculator:preferences") ?? "{}")
    ).toMatchObject({
      schemaVersion: 1,
      theme: "light"
    });

    expect(screen.getByRole("button", { name: /switch to dark mode/i })).toBeInTheDocument();
  });
});
