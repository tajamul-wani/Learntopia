import { test, expect } from "./support/test.js";

// LT-61, updated by LT-51 PR2: the featured-course cards on the Home page send a
// logged-out visitor to login before the course. Logged-out only — no account
// needed here (the signed-in course flow lives in course-experience.spec.js).
//
// The CTA used to say "Enroll now", which was never true: the card opens the
// course, and joining is one explicit action on the course page. It now says
// "View course", matching the catalog, and still carries a returnTo so the
// visitor lands back on the course they picked — having joined nothing.
test.describe("home course gating (LT-61)", () => {
  test("featured cards open the course rather than offering to enrol", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Home is lazy-loaded (Suspense -> PageSkeleton "Loading page"); wait for it to
    // clear so we don't assert against the fallback on a cold WSL Vite server.
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    // At least one featured card renders its CTA...
    await expect(page.getByRole("button", { name: /view course/i }).first()).toBeVisible();
    // ...and nothing on the home page offers to enrol anyone directly.
    await expect(page.getByRole("button", { name: /enroll/i })).toHaveCount(0);
  });

  test("clicking through sends a logged-out visitor to login", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.getByRole("button", { name: /view course/i }).first().click();

    // Gated: we land on the login route, not on the course.
    await expect(page).toHaveURL(/\/login$/);
    // And the login form is actually shown (email field present).
    await expect(page.locator("#email")).toBeVisible();
  });
});
