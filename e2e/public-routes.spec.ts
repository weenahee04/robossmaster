import { test, expect } from "@playwright/test";

test.describe("Public Routes", () => {
  test("home page loads", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBeLessThan(500);
  });

  test("admin login page is accessible", async ({ page }) => {
    const res = await page.goto("/admin/login");
    expect(res?.status()).toBe(200);
  });

  test("API auth routes are accessible", async ({ request }) => {
    const res = await request.get("/api/auth/csrf");
    expect(res.status()).toBeLessThan(500);
  });

  test("protected admin route redirects to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/admin\/login/);
  });

  test("protected branch route redirects to login", async ({ page }) => {
    await page.goto("/branch/test-branch/dashboard");
    await expect(page).toHaveURL(/login/);
  });

  test("protected investor route redirects to login", async ({ page }) => {
    await page.goto("/investor/dashboard");
    await expect(page).toHaveURL(/login/);
  });
});
