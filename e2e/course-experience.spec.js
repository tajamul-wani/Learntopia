import { test, expect } from "@playwright/test";

// Signed-in course-experience specs:
//   LT-63  journey-map course view (syllabus as a clay node path)
//   LT-65  distinct glowing-orb tutor avatar (viewBox 0 0 100 100, vs the 48x48 logo)
//   LT-64  matching pairs: stable order on tap + number/colour pair linking
//
// /course/:id redirects logged-out users to /login and records enrollment in
// Firestore, so these need a real (throwaway) Firebase account. Provide it via env
// vars; without them the whole file is SKIPPED so CI stays green:
//     E2E_EMAIL, E2E_PASSWORD
// Run from the app dir, e.g.:
//     E2E_EMAIL='tester@example.com' E2E_PASSWORD='...' npx playwright test course-experience
// Use a fresh/low-progress account: the matching test needs an active (not yet
// completed) module, whose exercises render in the interactive state.

const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;

// Python course — its first module contains a "match" exercise.
const COURSE_PATH = "/course/1";

test.describe("course experience (signed in)", () => {
  test.skip(!EMAIL || !PASSWORD, "set E2E_EMAIL and E2E_PASSWORD to run the signed-in course specs");

  // Sign in through the real login UI once per test.
  test.beforeEach(async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    // Login is lazy-loaded; wait for the Suspense skeleton to clear before typing.
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.locator("#email").fill(EMAIL);
    await page.locator("#password").fill(PASSWORD);
    // Submit via Enter so we don't depend on the button's translated label.
    await page.locator("#password").press("Enter");
    // Firebase resolves auth and Login redirects away from /login on success.
    await expect(page, "login did not succeed — check E2E_EMAIL / E2E_PASSWORD").not.toHaveURL(
      /\/login$/,
      { timeout: 25000 }
    );
  });

  test("journey map renders nodes, certificate and a distinct tutor orb (LT-63, LT-65)", async ({ page }) => {
    await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    // Open the Curriculum (journey) tab.
    await page.getByRole("button", { name: /course curriculum/i }).click();

    // The journey rail renders its module list...
    await expect(page.getByRole("heading", { name: /course modules/i })).toBeVisible();
    // ...ends in a certificate finish-line node...
    await expect(page.getByText(/certificate/i).first()).toBeVisible();
    // ...and the guide message at the foot of the journey is shown.
    await expect(
      page.getByText(/keep going to earn your certificate|made it to the end/i).first()
    ).toBeVisible();

    // LT-65: the tutor avatar is a glowing orb drawn at viewBox "0 0 100 100".
    // The app logo uses "0 0 48 48", so this selector proves a tutor orb rendered
    // and is distinct from the brand logo.
    await expect(page.locator('svg[viewBox="0 0 100 100"]').first()).toBeVisible();
  });

  test("matching keeps a stable order on tap and links the matched pair (LT-64)", async ({ page }) => {
    await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.getByRole("button", { name: /course curriculum/i }).click();

    // The active module opens on the lesson player; step through it to reach the
    // exercises. The advance button reads "Next Step", then "Start Interactive
    // Exercises" on the last step. Loop is bounded and stops once the match block
    // (its "Definitions" column) appears.
    const definitionsLabel = page.getByText("Definitions", { exact: true }).first();
    const advance = page.getByRole("button", { name: /next step|start interactive exercises/i }).first();
    for (let i = 0; i < 15; i++) {
      if (await definitionsLabel.isVisible().catch(() => false)) break;
      if (!(await advance.isVisible().catch(() => false))) break;
      await advance.click();
    }
    await expect(definitionsLabel, "did not reach a matching exercise").toBeVisible();

    // Scope to the match block's two columns via their labels' parent <div>.
    const termButtons = page.getByText("Terms", { exact: true }).first().locator("xpath=..").getByRole("button");
    const defButtons = definitionsLabel.locator("xpath=..").getByRole("button");

    // LT-64 core fix: tapping a term must NOT reshuffle the definitions.
    const orderBefore = await defButtons.allInnerTexts();
    await termButtons.first().click();
    const orderAfter = await defButtons.allInnerTexts();
    expect(orderAfter, "definition order changed when a term was tapped").toEqual(orderBefore);

    // LT-64 pairing: with term #1 selected, matching it to a definition gives that
    // definition term #1's number badge, so the pair reads at a glance.
    await defButtons.first().click();
    await expect(defButtons.first().locator("span").first()).toHaveText("1");
  });
});
