import { test, expect } from "@playwright/test";

test.describe("Admin Login Flow", () => {
  test("shows login page", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/admin\/login/);
    await expect(page.locator("input[type='email'], input[name='email']")).toBeVisible();
    await expect(page.locator("input[type='password'], input[name='password']")).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");
    await page.fill("input[type='email'], input[name='email']", "wrong@test.com");
    await page.fill("input[type='password'], input[name='password']", "wrongpass");
    await page.click("button[type='submit']");

    // Should stay on login page or show error
    await expect(page).toHaveURL(/admin\/login/);
  });

  test("redirects unauthenticated user from /admin/dashboard to /admin/login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/admin\/login/);
  });
});
