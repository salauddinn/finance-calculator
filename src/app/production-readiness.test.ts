import * as layoutModule from "@/app/layout";
import nextConfig from "../../next.config";

describe("production readiness", () => {
  it("sets deploy-time security headers", async () => {
    expect(typeof nextConfig.headers).toBe("function");

    const headers = await nextConfig.headers?.();

    expect(headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/:path*",
          headers: expect.arrayContaining([
            expect.objectContaining({
              key: "X-Frame-Options",
              value: "DENY"
            }),
            expect.objectContaining({
              key: "X-Content-Type-Options",
              value: "nosniff"
            }),
            expect.objectContaining({
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin"
            })
          ])
        })
      ])
    );
  });

  it("publishes metadata for production sharing cards", () => {
    expect(layoutModule.metadata).toMatchObject({
      description: expect.stringMatching(/loans, sip growth, and fixed deposits/i)
    });
  });
});
