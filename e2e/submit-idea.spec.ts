import { test, expect } from "@playwright/test";

test.describe("Idea Submission Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/submit");
  });

  test("should render the submission form with all fields", async ({ page }) => {
    await expect(page.getByLabel("Full Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Your Role")).toBeVisible();
    await expect(page.getByLabel("Company / Organization")).toBeVisible();
    await expect(page.getByLabel("Idea Title")).toBeVisible();
    await expect(page.getByLabel("Describe Your Idea")).toBeVisible();
    await expect(page.getByLabel("Target Audience")).toBeVisible();
    await expect(page.getByLabel("Business Model")).toBeVisible();
    await expect(page.getByLabel("How did you hear about us?")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Submit Your Idea" }),
    ).toBeVisible();
  });

  test("should show validation errors when submitting empty form", async ({ page }) => {
    await page.getByRole("button", { name: "Submit Your Idea" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
  });

  test("should show validation error for short idea title", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Your Role").selectOption("Founder");
    await page.getByLabel("Idea Title").fill("Hi");
    await page.getByLabel("Describe Your Idea").fill(
      "This is a detailed description of my amazing startup idea that will change the world.",
    );

    await page.getByRole("button", { name: "Submit Your Idea" }).click();

    await expect(
      page.getByText("Title must be at least 5 characters"),
    ).toBeVisible();
  });

  test("should show validation error for short idea description", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Your Role").selectOption("Founder");
    await page.getByLabel("Idea Title").fill("Great Startup Idea");
    await page.getByLabel("Describe Your Idea").fill("Too short");

    await page.getByRole("button", { name: "Submit Your Idea" }).click();

    await expect(
      page.getByText(/describe your idea in more detail/i),
    ).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Your Role").selectOption("CTO");
    await page.getByLabel("Idea Title").fill("Great Startup Idea");
    await page.getByLabel("Describe Your Idea").fill(
      "This is a detailed description of my amazing startup idea that will change the world.",
    );

    await page.getByRole("button", { name: "Submit Your Idea" }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test("should submit form successfully with valid data", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Your Role").selectOption("Founder");
    await page.getByLabel("Company / Organization").fill("Acme Corp");
    await page.getByLabel("Idea Title").fill("AI-Powered CRM for Startups");
    await page.getByLabel("Describe Your Idea").fill(
      "A CRM that uses AI to automatically categorize and prioritize leads based on engagement signals, helping small teams close deals faster.",
    );
    await page.getByLabel("Target Audience").fill("Small business owners");
    await page.getByLabel("Business Model").selectOption("SaaS (Subscription)");
    await page.getByLabel("How did you hear about us?").fill("LinkedIn");

    const responsePromise = page.waitForResponse(
      (r) =>
        r.url().includes("/api/submissions") &&
        r.request().method() === "POST",
    );

    await page.getByRole("button", { name: "Submit Your Idea" }).click();

    const response = await responsePromise;
    expect(response.status()).toBe(201);

    await expect(
      page.getByText(/idea has been submitted/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test("should reset form fields after successful submission", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Your Role").selectOption("Developer");
    await page.getByLabel("Idea Title").fill("Reset Test Idea Title");
    await page.getByLabel("Describe Your Idea").fill(
      "This is a test submission to verify the form resets after a successful submit action.",
    );

    const responsePromise = page.waitForResponse(
      (r) =>
        r.url().includes("/api/submissions") &&
        r.request().method() === "POST",
    );

    await page.getByRole("button", { name: "Submit Your Idea" }).click();

    await responsePromise;

    await expect(page.getByLabel("Full Name")).toHaveValue("", {
      timeout: 5000,
    });
    await expect(page.getByLabel("Email")).toHaveValue("");
    await expect(page.getByLabel("Idea Title")).toHaveValue("");
    await expect(page.getByLabel("Describe Your Idea")).toHaveValue("");
  });

  test("should disable submit button while submitting", async ({ page }) => {
    await page.getByLabel("Full Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Your Role").selectOption("Developer");
    await page.getByLabel("Idea Title").fill("Test Loading State");
    await page.getByLabel("Describe Your Idea").fill(
      "Just testing that the submit button is disabled during form submission process.",
    );

    const button = page.getByRole("button", { name: /submit/i });

    await button.click();

    await page.waitForResponse(
      (r) =>
        r.url().includes("/api/submissions") &&
        r.request().method() === "POST",
    );

    await expect(button).toBeEnabled({ timeout: 5000 });
  });
});
