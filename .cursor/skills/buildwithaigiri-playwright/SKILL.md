---
name: buildwithaigiri-playwright
description: Write and run Playwright E2E tests for BuildwithAiGiri. Use when creating new E2E tests, debugging test failures, adding test coverage for new features, or running the test suite. Covers test structure, selector patterns, and form testing.
---

# BuildwithAiGiri Playwright E2E Testing

## Quick Start

```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install chromium

# Run all tests
npx playwright test

# Run with visible browser
npx playwright test --headed

# Run a single file
npx playwright test e2e/landing.spec.ts

# Interactive UI mode
npx playwright test --ui

# View HTML report
npx playwright show-report
```

## Project Structure

```
e2e/
├── landing.spec.ts         # Hero, how it works, about, FAQ
├── submit-idea.spec.ts     # Idea submission form + validation
├── showcase.spec.ts        # Project portfolio page
├── navigation.spec.ts      # Navbar, footer, cross-page links
└── responsive.spec.ts      # Mobile + tablet viewport tests
playwright.config.ts        # Playwright configuration
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
```

## Writing Tests

### Test Template

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/target-page");
  });

  test("should do expected behavior", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Title" })).toBeVisible();
    await page.getByRole("button", { name: "Action" }).click();
    await expect(page.getByText("Success")).toBeVisible();
  });
});
```

### Selector Strategy (priority order)

1. `getByRole("button", { name: "Submit" })` -- accessible role
2. `getByLabel("Email")` -- form labels
3. `getByText("Welcome")` -- visible text
4. `getByPlaceholder("Enter your email")` -- placeholders
5. `locator("[data-testid='hero']")` -- last resort

### Form Submission Test

```typescript
test("should submit idea successfully", async ({ page }) => {
  await page.goto("/submit");

  await page.getByLabel("Full Name").fill("Jane Doe");
  await page.getByLabel("Email").fill("jane@example.com");
  await page.getByLabel("Idea Title").fill("AI-Powered CRM");
  await page.getByLabel("Describe your idea").fill(
    "A CRM that uses AI to automatically categorize and prioritize leads"
  );

  const [response] = await Promise.all([
    page.waitForResponse((r) =>
      r.url().includes("/api/submissions") && r.status() === 200
    ),
    page.getByRole("button", { name: "Submit Your Idea" }).click(),
  ]);

  await expect(page.getByText("Idea submitted")).toBeVisible();
});
```

### Form Validation Test

```typescript
test("should show validation errors for empty required fields", async ({ page }) => {
  await page.goto("/submit");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.locator("p.text-red-400").first()).toBeVisible();
});
```

### Navigation Test

```typescript
test("should navigate between pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Submit Your Idea" }).click();
  await expect(page).toHaveURL(/\/submit/);
});
```

### Responsive Test

```typescript
test("should render correctly on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /25 MVPs/i })).toBeVisible();
});
```

### Cal.com Embed Test

```typescript
test("should load Cal.com booking widget", async ({ page }) => {
  await page.goto("/submit");
  // After successful submission, verify Cal embed appears
  const calFrame = page.locator("iframe[src*='cal.com']");
  await expect(calFrame).toBeVisible({ timeout: 10000 });
});
```

## Adding Tests for New Features

1. Create `e2e/feature-name.spec.ts`
2. Add `data-testid` attributes to components if needed
3. Write tests: happy path, error states, edge cases
4. Run `npx playwright test e2e/feature-name.spec.ts --headed` to verify
5. Check mobile viewport rendering

## npm Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Timeout on navigation | Increase timeout or add `waitForLoadState("networkidle")` |
| Element not found | Check if component is lazy-loaded; use `waitFor()` |
| Flaky toast test | Increase timeout: `toBeVisible({ timeout: 5000 })` |
| CI failures | Ensure `webServer` command starts correctly |
