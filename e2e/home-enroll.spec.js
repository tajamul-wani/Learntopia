import { test, expect } from "@playwright/test";

// LT-61: the featured-course cards on the Home page gate enrollment behind login.
// Logged-out only — no account needed here, so this always runs (the signed-in
// course flow lives in course-experience.spec.js).
//
// Before this change the card CTA said "Start" and dropped visitors straight into
// the course (which then bounced them to login). Now it says "Enroll now" and
// routes a logged-out visitor to /login first, carrying a returnTo so they enroll
// on arrival back at the course.
test.describe("home enrollment gating (LT-61)", () => {
  test("featured cards show an 'Enroll now' CTA", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Home is lazy-loaded (Suspense -> PageSkeleton "Loading page"); wait for it to
    // clear so we don't assert against the fallback on a cold WSL Vite server.
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    // At least one featured card renders its Enroll now button.
    await expect(page.getByRole("button", { name: /enroll now/i }).first()).toBeVisible();
  });

  test("clicking Enroll now sends a logged-out visitor to login", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.getByRole("button", { name: /enroll now/i }).first().click();

    // Gated: we land on the login route, not on the course.
    await expect(page).toHaveURL(/\/login$/);
    // And the login form is actually shown (email field present).
    await expect(page.locator("#email")).toBeVisible();
  });
});
