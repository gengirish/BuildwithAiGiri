import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (r) => r.url().includes("/api/submissions") && r.request().method() === "GET",
    );
    await page.goto("/dashboard");
    await responsePromise;
  });

  test("should render dashboard page header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Dashboard/i }),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/Track and manage idea submissions/i),
    ).toBeVisible();
  });

  test("should render stat cards", async ({ page }) => {
    await expect(page.getByText("Total Submissions")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Pending Review")).toBeVisible();
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByRole("paragraph").filter({ hasText: "Completed" })).toBeVisible();
  });

  test("should render search and filter controls", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/Search by name, email, or idea/i),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("combobox")).toBeVisible();
  });

  test("should show empty state when no submissions exist", async ({ page }) => {
    await expect(
      page.getByText(/No submissions yet/i),
    ).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/Ideas will appear here once someone submits one/i),
    ).toBeVisible();
  });

  test("should call submissions API endpoint", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (r) => r.url().includes("/api/submissions") && r.request().method() === "GET",
    );
    await page.goto("/dashboard");
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test("should have a working refresh button", async ({ page }) => {
    const refreshButton = page.getByRole("button", { name: /Refresh/i });
    await expect(refreshButton).toBeVisible({ timeout: 10000 });

    const responsePromise = page.waitForResponse(
      (r) => r.url().includes("/api/submissions") && r.request().method() === "GET",
    );
    await refreshButton.click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });

  test("should have status filter with all options", async ({ page }) => {
    const select = page.getByRole("combobox");
    await expect(select).toBeVisible({ timeout: 10000 });

    const options = select.locator("option");
    await expect(options).toHaveCount(8);
    await expect(options.nth(0)).toHaveText("All Statuses");
    await expect(options.nth(1)).toHaveText("Pending");
  });

  test("should allow typing in search field", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search by name, email, or idea/i);
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill("test query");
    await expect(searchInput).toHaveValue("test query");
  });
});
