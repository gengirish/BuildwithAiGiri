import { test, expect } from "@playwright/test";

test.describe("Project Showcase", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/showcase");
  });

  test("should render showcase page header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Project Showcase/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Every week, a new MVP joins the portfolio/i),
    ).toBeVisible();
  });

  test("should show empty state when no projects exist", async ({ page }) => {
    await expect(
      page.getByText(/The Journey Begins Soon/i),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByRole("link", { name: /Submit Your Idea/i }),
    ).toBeVisible();
  });

  test("should call projects API endpoint", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (r) => r.url().includes("/api/projects"),
    );
    await page.goto("/showcase");
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });
});
