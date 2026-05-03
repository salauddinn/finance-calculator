import * as layoutModule from "@/app/layout";
import nextConfig from "../../next.config";

describe("production readiness", () => {
  it("configures static export for GitHub Pages", () => {
    expect(nextConfig.output).toBe("export");
    expect(nextConfig.basePath).toBe("/finance-calculator");
  });

  it("publishes metadata for production sharing cards", () => {
    expect(layoutModule.metadata).toMatchObject({
      description: expect.stringMatching(/loans, sip growth, and fixed deposits/i)
    });
  });
});
