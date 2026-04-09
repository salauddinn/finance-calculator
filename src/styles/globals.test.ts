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
});
