import { test, expect } from "./support/test.js";

// LT-77: below md the hamburger and its drawer are replaced by a persistent
// bottom tab bar, so a route change is one thumb tap instead of two.
// Signed-out coverage only — the five-tab signed-in set (with the real avatar on
// the profile tab) needs an account and is covered by the auth-gated specs.

const PHONE = { width: 390, height: 844 };

async function ready(page, route) {
  await page.goto(route, { waitUntil: "domcontentloaded" });
  // Routes are lazy-loaded behind a Suspense skeleton; wait it out.
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
}

test.describe("mobile bottom navigation", () => {
  test.use({ viewport: PHONE });

  test("shows the four signed-out destinations, and the hamburger is gone", async ({ page }) => {
    await ready(page, "/");

    const bar = page.getByTestId("bottom-nav");
    await expect(bar).toBeVisible();
    await expect(bar.getByRole("link")).toHaveCount(4);

    for (const label of [/home/i, /courses/i, /quiz/i, /contact/i]) {
      await expect(bar.getByRole("link", { name: label })).toBeVisible();
    }

    // The drawer toggle no longer exists anywhere in the DOM.
    await expect(page.getByRole("button", { name: /toggle navigation menu/i })).toHaveCount(0);
  });

  test("the header keeps the account action, not a duplicate profile", async ({ page }) => {
    await ready(page, "/");
    // Signed out the header offers the way in (the bottom bar has no profile tab).
    // The footer's "Sign In" is a link, so the button role disambiguates.
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("marks the current route as the active tab", async ({ page }) => {
    await ready(page, "/courses");
    await expect(
      page.getByTestId("bottom-nav").getByRole("link", { name: /courses/i })
    ).toHaveAttribute("aria-current", "page");
  });

  test("changes route in a single tap", async ({ page }) => {
    await ready(page, "/");
    await page.getByTestId("bottom-nav").getByRole("link", { name: /quiz/i }).click();
    await expect(page).toHaveURL(/\/quiz$/);
  });
});

test.describe("desktop navigation is untouched", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("the bottom bar does not appear at md and above", async ({ page }) => {
    await ready(page, "/");
    await expect(page.getByTestId("bottom-nav")).toBeHidden();
    // The existing top nav still carries the destinations.
    await expect(page.getByRole("link", { name: /^courses$/i }).first()).toBeVisible();
  });
});
