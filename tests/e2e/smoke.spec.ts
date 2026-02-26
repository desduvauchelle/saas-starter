/**
 * E2E smoke test — verifies the landing page loads correctly.
 */

import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Build your SaaS");
  });

  test("navigates to login from CTA", async ({ page }) => {
    await page.goto("/");
    const signIn = page.locator("text=Sign In").first();
    await signIn.click();
    await expect(page).toHaveURL(/login/);
  });

  test("shows features section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("text=Authentication")).toBeVisible();
  });
});

test.describe("Public Pages", () => {
  test("loads privacy page", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy Policy");
  });

  test("loads terms page", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1")).toContainText("Terms of Service");
  });

  test("loads contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toContainText("Contact Us");
  });

  test("loads blog index", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator("h1")).toBeVisible();
  });
});
