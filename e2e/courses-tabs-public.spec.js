import { test, expect } from "./support/test.js";

// LT-51 PR2: the course tabs are a signed-in learner's own history.
//
// Completing or leaving a course both require an account, so a visitor has no
// history to tab through and must never be shown an empty set of tabs. This
// spec runs without the signed-in fixture on purpose — that is the whole point.

test("a signed-out visitor browses the catalog with no tabs", async ({ page }) => {
  await page.goto("/courses", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

  // The catalog itself still works for them.
  await expect(page.locator("main").getByRole("heading", { level: 3 }).first()).toBeVisible();
  await expect(page.getByRole("tablist", { name: /your courses/i })).toBeHidden();
});
