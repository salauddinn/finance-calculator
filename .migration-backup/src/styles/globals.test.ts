import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readStylesheet() {
  return readFileSync(resolve(process.cwd(), "src/styles/globals.css"), "utf8");
}

describe("global styling foundation", () => {
  it("defines the Midnight Ocean tokens in the default root block", () => {
    const stylesheet = readStylesheet();
    const rootBlock = stylesheet.match(/:root\s*{[\s\S]*?}/)?.[0];

    expect(rootBlock).toBeDefined();
    expect(rootBlock).toContain("color-scheme: dark;");
    expect(rootBlock).toContain("--color-background: #0b1224;");
    expect(rootBlock).toContain("--color-text: #f0f4f8;");
    expect(rootBlock).toContain("--color-primary: #64B5F6;");
    expect(rootBlock).toContain("--glass-blur: blur(16px);");
    expect(rootBlock).toContain("--glass-blur-heavy: blur(24px);");
    expect(rootBlock).toContain("--aurora-blue-1: rgba(100, 181, 246, 0.10);");
    expect(rootBlock).toContain("--aurora-blue-2: rgba(21, 101, 192, 0.08);");
    expect(rootBlock).not.toContain("#ebe6de");
    expect(rootBlock).not.toContain("#f7f3ed");
    expect(stylesheet).not.toContain(':root[data-theme="dark"]');
  });

  it("uses aurora token layers in the body background", () => {
    const stylesheet = readStylesheet();
    const bodyBlocks = Array.from(stylesheet.matchAll(/body\s*{[\s\S]*?}/g), (match) => match[0]);
    const bodyBlock = bodyBlocks.find((block) => block.includes("position: relative;"));

    expect(bodyBlock).toBeDefined();
    expect(bodyBlock).toContain("var(--aurora-blue-1)");
    expect(bodyBlock).toContain("var(--aurora-blue-2)");
  });

  it("defines a glass navbar and no longer uses a floating fixed toggle", () => {
    const stylesheet = readStylesheet();
    const navbarBlock = stylesheet.match(/\.site-navbar\s*{[\s\S]*?}/)?.[0];
    const themeToggleBlock = stylesheet.match(/\.theme-toggle\s*{[\s\S]*?}/)?.[0];

    expect(navbarBlock).toBeDefined();
    expect(navbarBlock).toContain("backdrop-filter");
    expect(navbarBlock).toContain("position: sticky");
    expect(themeToggleBlock).toBeDefined();
    expect(themeToggleBlock).not.toContain("position: fixed");
  });

  it("styles buttons and segmented controls for the dark glass theme", () => {
    const stylesheet = readStylesheet();
    const primaryButtonBlock = stylesheet.match(/\.button--primary\s*{[\s\S]*?}/)?.[0];
    const primaryButtonHoverBlock = stylesheet.match(/\.button--primary:hover\s*{[\s\S]*?}/)?.[0];
    const secondaryButtonBlock = stylesheet.match(/\.button--secondary\s*{[\s\S]*?}/)?.[0];
    const segmentedControlBlock = stylesheet.match(/\.segmented-control\s*{[\s\S]*?}/)?.[0];
    const segmentedActiveBlock =
      stylesheet.match(/\.segmented-control__option--active span\s*{[\s\S]*?}/)?.[0];

    expect(primaryButtonBlock).toContain("background: var(--color-primary);");
    expect(primaryButtonBlock).toContain("color: #ffffff;");
    expect(primaryButtonHoverBlock).toContain("var(--color-primary-glow)");
    expect(secondaryButtonBlock).toContain("border-color: var(--color-border);");
    expect(secondaryButtonBlock).toContain("color: var(--color-text);");
    expect(segmentedControlBlock).toContain("backdrop-filter: var(--glass-blur);");
    expect(segmentedActiveBlock).toContain("background: var(--color-primary);");
    expect(segmentedActiveBlock).toContain("color: #ffffff;");
  });

  it("styles result cards and panels with glass blur and blue-tinted highlights", () => {
    const stylesheet = readStylesheet();
    const summaryCardBlock = stylesheet.match(/\.result-summary-card\s*{[\s\S]*?}/)?.[0];
    const positiveCardBlock = stylesheet.match(/\.result-summary-card--positive\s*{[\s\S]*?}/)?.[0];
    const cautionCardBlock = stylesheet.match(/\.result-summary-card--caution\s*{[\s\S]*?}/)?.[0];
    const valueBlock = stylesheet.match(/\.result-summary-card__value\s*{[\s\S]*?}/)?.[0];
    const insightPanelBlock = stylesheet.match(/\.result-insight-panel\s*{[\s\S]*?}/)?.[0];

    expect(summaryCardBlock).toContain("background: var(--color-surface-strong);");
    expect(positiveCardBlock).toContain("var(--color-glass-border-hover)");
    expect(cautionCardBlock).toContain("rgba(255, 183, 77, 0.28)");
    expect(valueBlock).toContain("color: var(--color-text);");
    expect(insightPanelBlock).toContain("backdrop-filter: var(--glass-blur);");
    expect(insightPanelBlock).toContain("linear-gradient(180deg, rgba(100, 181, 246, 0.12), transparent)");
  });

  it("styles calculator entry pages as centered glass layouts", () => {
    const stylesheet = readStylesheet();
    const entryHeroBlock = stylesheet.match(/\.calculator-entry__hero\s*{[\s\S]*?}/)?.[0];
    const entryPanelBlock = stylesheet.match(/\.calculator-entry__panel\s*{[\s\S]*?}/)?.[0];
    const shellBlock = stylesheet.match(/\.calculator-shell\s*{[\s\S]*?}/)?.[0];
    const formBlock = stylesheet.match(/\.calculator-shell__form,\s*[\s\S]*?}/)?.[0];
    const resultsBlock = stylesheet.match(/\.calculator-results\s*{[\s\S]*?}/)?.[0];

    expect(entryHeroBlock).toContain("grid-template-columns: 1fr;");
    expect(entryHeroBlock).toContain("justify-items: center;");
    expect(entryPanelBlock).toContain("backdrop-filter: var(--glass-blur);");
    expect(shellBlock).toContain("display: flex;");
    expect(shellBlock).toContain("flex-direction: column;");
    expect(formBlock).toContain("background: var(--color-surface-strong);");
    expect(formBlock).toContain("backdrop-filter: var(--glass-blur);");
    expect(resultsBlock).toContain("background: var(--color-surface-strong);");
    expect(resultsBlock).toContain("backdrop-filter: var(--glass-blur);");
  });

  it("provides opaque fallbacks when backdrop-filter is unavailable", () => {
    const stylesheet = readStylesheet();
    const fallbackBlock =
      stylesheet.match(/@supports not \(backdrop-filter: blur\(1px\)\)\s*{[\s\S]*?}\s*}/)?.[0];

    expect(fallbackBlock).toBeDefined();
    expect(fallbackBlock).toContain(".site-navbar__inner");
    expect(fallbackBlock).toContain(".landing-hero");
    expect(fallbackBlock).toContain(".calculator-panel");
    expect(fallbackBlock).toContain(".calculator-results");
    expect(fallbackBlock).toContain("background: var(--color-background);");
  });

  it("disables hover transforms and transitions for reduced motion", () => {
    const stylesheet = readStylesheet();
    const reducedMotionBlock =
      stylesheet.match(/@media \(prefers-reduced-motion: reduce\)\s*{[\s\S]*?}\s*}/)?.[0];

    expect(reducedMotionBlock).toBeDefined();
    expect(reducedMotionBlock).toContain(".motion-fade-up");
    expect(reducedMotionBlock).toContain("animation: none;");
    expect(reducedMotionBlock).toContain(".category-card");
    expect(reducedMotionBlock).toContain(".button");
    expect(reducedMotionBlock).toContain(".theme-toggle");
    expect(reducedMotionBlock).toContain(".site-navbar__inner");
    expect(reducedMotionBlock).toContain("transition: none;");
    expect(reducedMotionBlock).toContain("transform: none;");
  });
});
