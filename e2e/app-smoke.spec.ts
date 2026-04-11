import { expect, test } from "@playwright/test";

test("users can open the homepage and move into a calculator flow", async ({
  page
}) => {
  await page.goto("/finance-calculator");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /money decisions, made clear/i
    })
  ).toBeVisible();

  await page.getByRole("link", { name: /explore personal loan calculator/i }).click();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /personal loan calculator/i
    })
  ).toBeVisible();

  await expect(page.getByLabel("Loan amount")).toHaveValue("2500000");
});
