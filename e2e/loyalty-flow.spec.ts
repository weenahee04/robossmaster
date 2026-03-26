import { test, expect } from "@playwright/test";

test.describe("Loyalty Customer Flow", () => {
  test("loyalty page loads for a branch slug", async ({ page }) => {
    // This tests the public loyalty page route
    const res = await page.goto("/loyalty/test-branch");
    // Should load (200) or redirect to login — not 500
    expect(res?.status()).toBeLessThan(500);
  });

  test("loyalty login page loads", async ({ page }) => {
    const res = await page.goto("/loyalty/test-branch/login");
    expect(res?.status()).toBeLessThan(500);
  });

  test("API: GET loyalty customers returns 400 without phone", async ({ request }) => {
    const res = await request.get("/api/loyalty/customers");
    expect(res.status()).toBe(400);
  });

  test("API: GET loyalty customers returns 404 for unknown phone", async ({ request }) => {
    const res = await request.get("/api/loyalty/customers?phone=0000000000");
    expect(res.status()).toBe(404);
  });

  test("API: POST loyalty customers returns 400 without phone", async ({ request }) => {
    const res = await request.post("/api/loyalty/customers", {
      data: { name: "No Phone" },
    });
    expect(res.status()).toBe(400);
  });
});
