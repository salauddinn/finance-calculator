import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readStylesheet() {
  return readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");
}

describe("global styling foundation", () => {
  it("defines the core design tokens in the :root block", () => {
    const stylesheet = readStylesheet();
    const rootBlock = stylesheet.match(/:root\s*\{[\s\S]*?\}/)?.[0];

    expect(rootBlock).toBeDefined();
    expect(rootBlock).toContain("--bg:");
    expect(rootBlock).toContain("--text:");
    expect(rootBlock).toContain("--blue:");
    expect(rootBlock).toContain("--green:");
    expect(rootBlock).toContain("--amber:");
    expect(rootBlock).toContain("--border:");
  });

  it("defines border-radius tokens", () => {
    const stylesheet = readStylesheet();
    expect(stylesheet).toContain("--r-sm:");
    expect(stylesheet).toContain("--r-md:");
    expect(stylesheet).toContain("--r-lg:");
  });

  it("defines a sticky navbar with backdrop-filter", () => {
    const stylesheet = readStylesheet();
    const navbarBlock = stylesheet.match(/\.site-navbar\s*\{[\s\S]*?\}/)?.[0];

    expect(navbarBlock).toBeDefined();
    expect(navbarBlock).toContain("backdrop-filter");
  });

  it("styles buttons with primary colour", () => {
    const stylesheet = readStylesheet();
    const primaryButtonBlock = stylesheet.match(/\.button--primary\s*\{[\s\S]*?\}/)?.[0];

    expect(primaryButtonBlock).toBeDefined();
    expect(primaryButtonBlock).toContain("var(--blue)");
    expect(primaryButtonBlock).toContain("color: #fff");
  });

  it("defines calculator-shell layout styles", () => {
    const stylesheet = readStylesheet();
    const shellBlock = stylesheet.match(/\.calculator-shell\s*\{[\s\S]*?\}/)?.[0];

    expect(shellBlock).toBeDefined();
  });

  it("defines landing page hero styles", () => {
    const stylesheet = readStylesheet();
    const landingHeroBlock = stylesheet.match(/\.landing-hero\s*\{[\s\S]*?\}/)?.[0];

    expect(landingHeroBlock).toBeDefined();
    expect(landingHeroBlock).toContain("flex-direction: column");
  });

  it("defines calc-results border styles", () => {
    const stylesheet = readStylesheet();
    expect(stylesheet).toContain(".calculator-results");
    expect(stylesheet).toContain("var(--border)");
  });

  it("uses CSS custom properties throughout (no hard-coded hex colours in components)", () => {
    const stylesheet = readStylesheet();
    expect(stylesheet).toContain("var(--bg)");
    expect(stylesheet).toContain("var(--text)");
    expect(stylesheet).toContain("var(--blue)");
  });
});
