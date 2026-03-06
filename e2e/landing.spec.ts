import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should render hero section with headline", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /25 MVPs/i }),
    ).toBeVisible();
    await expect(page.getByText("Completely Free.", { exact: true })).toBeVisible();
  });

  test("should render the movement badge", async ({ page }) => {
    await expect(page.getByText("The Movement Has Begun")).toBeVisible();
  });

  test("should render week counter stats", async ({ page }) => {
    await expect(page.getByText("Current Week")).toBeVisible();
    await expect(page.getByText("Total Weeks")).toBeVisible();
    await expect(page.getByText("Ideas Received")).toBeVisible();
    await expect(page.getByText("MVPs Built")).toBeVisible();
  });

  test("should render How It Works section with all steps", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /How It Works/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Got an Idea?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Submit It" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "1-Hour Brainstorm" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "We Build It" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "You Own It" })).toBeVisible();
  });

  test("should render About section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Why Am I Doing/i }),
    ).toBeVisible();
    await expect(page.getByText("14+ Years", { exact: true })).toBeVisible();
    await expect(page.getByText("Full-Stack", { exact: true })).toBeVisible();
  });

  test("should render FAQ section with questions", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Frequently Asked/i }),
    ).toBeVisible();
    await expect(
      page.getByText("Is this really free? What's the catch?"),
    ).toBeVisible();
  });

  test("should expand FAQ accordion on click", async ({ page }) => {
    const faqButton = page.getByText("Is this really free? What's the catch?");
    await faqButton.click();
    await expect(
      page.getByText(/100% free. No equity, no fees/i),
    ).toBeVisible();
  });

  test("should render CTA section", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Ready to Turn Your Idea/i }),
    ).toBeVisible();
  });

  test("should have Submit Idea CTA buttons", async ({ page }) => {
    const submitLinks = page.getByRole("link", { name: /Submit.*Idea/i });
    await expect(submitLinks.first()).toBeVisible();
  });
});
