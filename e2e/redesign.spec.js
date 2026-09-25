import { test, expect } from "./support/test.js";

// Regression net for the V2 clay redesign. Two things it guarantees on the
// public pages:
//   1. No page crashes (uncaught exceptions).
//   2. No leaked i18n keys — the exact class of bug we hit during the redesign
//      (e.g. "courseData.1.short", "home.ctaBtn" rendering raw instead of text).
// It walks the routes a logged-out visitor can reach; auth-gated pages
// (dashboard, course detail) are covered by later, sign-in-flow specs.

// A leaked key looks like `namespace.something` from one of our dictionaries.
const KEY_LEAK =
  /\b(home|hero|quiz|thankYou|nav|common|courses|courseDetails|dashboard|profileSetup|toasts|gamification|courseData|contact|footer|leaderboard|profile|aiTutor|exerciseEngine|lessonPlayer|notFound)\.[a-zA-Z][a-zA-Z0-9]/;

const PUBLIC_ROUTES = ["/", "/courses", "/quiz", "/contact", "/login", "/signUp"];

for (const route of PUBLIC_ROUTES) {
  test(`${route} renders without crashes or raw i18n keys`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    // domcontentloaded (not 'load') so slow images/fonts on a WSL /mnt/c dev
    // server can't stall the test; then wait for the app shell to actually mount.
    await page.goto(route, { waitUntil: "domcontentloaded" });
    // The app logo is in the navbar on every page — a reliable "React mounted"
    // signal that also replaces the initial loading splash.
    await expect(page.getByRole("img", { name: /learntopia/i }).first()).toBeVisible();
    // Pages are lazy-loaded behind a Suspense skeleton, and a cold WSL /mnt/c Vite
    // server can take seconds to transform a route chunk. Poll until the route has
    // actually rendered — reading innerText once races the loader and can catch
    // just the navbar wordmark.
    await expect
      .poll(async () => (await page.locator("body").innerText()).trim().length, {
        message: `no content rendered on ${route}`,
        timeout: 20000,
      })
      .toBeGreaterThan(20);

    const text = await page.locator("body").innerText();

    // No raw translation keys on screen.
    expect(text, `raw i18n key leaked on ${route}`).not.toMatch(KEY_LEAK);
    // No uncaught runtime errors.
    expect(errors, `uncaught error on ${route}: ${errors.join(" | ")}`).toHaveLength(0);
  });
}

test.describe("home page", () => {
  test("hero, featured courses and CTAs render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Wait for the lazy Home chunk to finish loading (skeleton clears).
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    // Hero headline.
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Hero has its own "Start free" CTA (it appears in the hero and a lower CTA
    // band, so scope to the first).
    await expect(page.getByRole("button", { name: /start free/i }).first()).toBeVisible();
    // Featured course cards open the course (gated; see home-enroll.spec.js).
    await expect(page.getByRole("button", { name: /view course/i }).first()).toBeVisible();
    // Browse-all CTA links onward.
    await expect(page.getByRole("button", { name: /browse all courses/i })).toBeVisible();
    // The app logo mark is present in the navbar.
    await expect(page.getByRole("img", { name: /learntopia/i }).first()).toBeVisible();
  });
});
