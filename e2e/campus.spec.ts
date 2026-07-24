import { test, expect } from "@playwright/test";

const UTM =
  "utm_source=campus_qr&utm_medium=offline&utm_campaign=iiitdh_immersion_2_jul2026";

const CTAS = [
  {
    name: "Submit your idea",
    href: `https://mvplabs.intelliforge.tech/submit?${UTM}`,
  },
  {
    name: "Explore Upskill",
    href: `https://upskill.intelliforge.tech/?${UTM}`,
  },
  {
    name: "Apply as a mentor",
    href: `https://hrms.intelliforge.tech/mentors?${UTM}`,
  },
];

test.describe("Campus hub (/campus)", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  test.beforeEach(async ({ page }) => {
    await page.goto("/campus");
  });

  test("renders the header and all three tiles", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /An invitation to collaborate/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/We're building AI-native products with founders/),
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: /Have a product idea/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Want hands-on AI skills/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /mentor with us/ })).toBeVisible();
  });

  test("each CTA points at the right destination with UTM params intact", async ({
    page,
  }) => {
    for (const cta of CTAS) {
      const link = page.getByRole("link", { name: cta.name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", cta.href);
    }
  });

  test("CTAs are thumb-sized tap targets at 360px", async ({ page }) => {
    for (const cta of CTAS) {
      const box = await page.getByRole("link", { name: cta.name }).boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(56);
      expect(box!.width).toBeGreaterThan(270);
    }
  });

  test("has no horizontal overflow at 360px", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow).toBe(false);
  });

  test("renders standalone — no MVP Labs navbar or footer", async ({ page }) => {
    await expect(page.getByRole("navigation")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "How It Works" })).toHaveCount(0);
  });

  test("footer contact links are correct", async ({ page }) => {
    await expect(page.getByRole("link", { name: "WhatsApp" })).toHaveAttribute(
      "href",
      "https://wa.me/917416642072?text=Hi%20Girish%2C%20met%20you%20at%20the%20Campus%20Immersion%20Program",
    );
    await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/girish-b-hiremath/",
    );
  });
});
