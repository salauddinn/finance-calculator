import { render, screen } from "@testing-library/react";

import * as layoutModule from "@/app/layout";

const RootLayout = layoutModule.default;

describe("RootLayout", () => {
  it("wraps the app in the document shell", () => {
    const result = RootLayout({
      children: <div>Calculator content</div>
    });

    expect(result.type).toBe("html");
    expect(result.props.lang).toBe("en");
    expect(result.props.className).toBeDefined();
    expect(result.props.className).toContain("font-inter");
    expect(result.props.children.type).toBe("body");
    expect(result.props.children.props.className).toBe("app-body");
  });

  it("publishes global metadata and a skip link for keyboard navigation", () => {
    const result = RootLayout({
      children: <div>Calculator content</div>
    });

    expect(layoutModule.metadata).toMatchObject({
      title: "Finance Calculator India"
    });

    const bodyChildren = result.props.children.props.children;
    const skipLink = bodyChildren[0];

    expect(skipLink.props.href).toBe("#main-content");
    expect(skipLink.props.children).toMatch(/skip to main content/i);
  });

  it("renders the shared navbar inside the theme provider", () => {
    const result = RootLayout({
      children: <div>Calculator content</div>
    });

    const provider = result.props.children.props.children[1];

    render(provider);

    expect(screen.getByRole("link", { name: /fincalc/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /calculators/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
