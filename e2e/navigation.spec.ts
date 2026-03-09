import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate from landing to submit page via CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Submit Your Idea$/i }).first().click();
    await expect(page).toHaveURL(/\/submit/);
    await expect(
      page.getByRole("heading", { name: /Submit Your/i }),
    ).toBeVisible();
  });

  test("should navigate from landing to showcase via navbar", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Showcase" })
      .click();
    await expect(page).toHaveURL(/\/showcase/);
    await expect(
      page.getByRole("heading", { name: /Project Showcase/i }),
    ).toBeVisible();
  });

  test("should navigate back to home from submit page", async ({ page }) => {
    await page.goto("/submit");
    await page.getByRole("link", { name: /Back to Home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("should navigate back to home from showcase page", async ({ page }) => {
    await page.goto("/showcase");
    await page.getByRole("link", { name: /Back to Home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("should render navbar brand link", async ({ page }) => {
    await page.goto("/submit");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: /BuildwithAi/i })
      .click();
    await expect(page).toHaveURL("/");
  });

  test("should render footer with all sections", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByText("Quick Links")).toBeVisible();
    await expect(footer.getByRole("heading", { name: "The Movement" })).toBeVisible();
    await expect(footer.getByText("Connect")).toBeVisible();
  });

  test("should navigate from landing to dashboard via navbar", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "Dashboard" })
      .click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { name: /Dashboard/i }),
    ).toBeVisible({ timeout: 15000 });
  });

  test("should open mobile menu on small viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByLabel("Toggle menu").click();
    await expect(
      page.locator(".md\\:hidden").getByRole("link", { name: "Showcase" }),
    ).toBeVisible();
    await expect(
      page.locator(".md\\:hidden").getByRole("link", { name: "Dashboard" }),
    ).toBeVisible();
  });
});
