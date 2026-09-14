import { test, expect } from "./support/emulator.js";

// Signed-in course-experience specs:
//   LT-63  journey-map course view (syllabus as a clay node path)
//   LT-65  distinct glowing-orb tutor avatar (viewBox 0 0 100 100, vs the logo)
//   LT-64  matching pairs: stable order on tap + number/colour pair linking
//
// /course/:id is for signed-in learners, so each test gets the `learner` fixture:
// a brand-new account in the Auth emulator, signed in through the real login
// form. A new account has no course progress, so the first module is always the
// active one and its exercises render interactively.

// Python course — its first module contains a "match" exercise.
const COURSE_PATH = "/course/1";

test.describe("course experience (signed in)", () => {
  test("journey map renders nodes, certificate and a distinct tutor orb (LT-63, LT-65)", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
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

    // LT-65: the tutor avatar is a glowing orb drawn at viewBox "0 0 100 100",
    // which no brand asset uses, so this proves a tutor orb rendered.
    await expect(page.locator('svg[viewBox="0 0 100 100"]').first()).toBeVisible();
  });

  test("matching keeps a stable order on tap and links the matched pair (LT-64)", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
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
      // The lesson player holds "Next" disabled briefly after each step.
      await expect(advance).toBeEnabled({ timeout: 5000 });
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
