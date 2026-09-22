import { test, expect, createLearner, signIn, writeDoc } from "./support/emulator.js";

// LT-80: per-quiz leaderboard rows carry display data only. They used to be
// written with the account's real name (userFullName) and with no validation at
// all, in a collection every signed-in user can read. These tests cover what a
// learner sees; the rules tests cover what the database will accept.

const QUIZ_ID = "python";
const QUIZ_TAB = /python for kids/i;

test.describe("per-quiz leaderboard", () => {
  test("shows the chosen display name and score, on desktop and phone", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 40 });
    await writeDoc(`QuizLeaderboards/${QUIZ_ID}/Scores/${learner.uid}`, {
      userId: learner.uid,
      displayName: learner.displayName,
      avatarId: "astro-girl",
      score: 90,
      rawScore: 9,
      totalQuestions: 10,
    });

    await signIn(page, learner);

    for (const [label, viewport] of [
      ["desktop", { width: 1280, height: 800 }],
      ["phone", { width: 390, height: 844 }],
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/leaderboard", { waitUntil: "domcontentloaded" });
      await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

      // The filter is a dropdown on phones and tabs from md up.
      if (viewport.width < 768) {
        await page.locator("select").first().selectOption(QUIZ_ID);
      } else {
        await page.getByRole("button", { name: QUIZ_TAB }).first().click();
      }

      const row = page.locator(".lb-row:visible").filter({ hasText: learner.displayName }).first();
      await expect(row, `the learner's row is missing on ${label}`).toBeVisible({ timeout: 20000 });
      await expect(row).toContainText("9");

      // The page must not fall back to any account name field.
      const shown = await page.locator("body").innerText();
      expect(shown, "the board rendered something other than the chosen name").not.toMatch(/learner-\d|@example\.test/i);
    }
  });

  // LT-96: a score row stores the name the learner had when they took the quiz.
  // Anyone who played before choosing one is frozen as "Learner", and renaming
  // later never touches that row, so the same learner read differently on the
  // quiz tab and on Overall Points.
  test("shows the learner's current name, not the one frozen into the score row", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 40 });
    await writeDoc(`QuizLeaderboards/${QUIZ_ID}/Scores/${learner.uid}`, {
      userId: learner.uid,
      displayName: "Learner",
      avatarId: "",
      score: 70,
      rawScore: 7,
      totalQuestions: 10,
    });

    await signIn(page, learner);
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/leaderboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.getByRole("button", { name: QUIZ_TAB }).first().click();

    // The board is shared with every other test writing a python score, so find
    // this learner's row by name rather than by rank. The row was seeded with
    // "Learner", so its presence under the chosen name is the join working.
    const row = page.locator(".lb-row:visible").filter({ hasText: learner.displayName });
    await expect(row.first(), "the quiz board kept the name frozen into the score row").toBeVisible({
      timeout: 20000,
    });
    await expect(row.first()).toContainText("7");
  });

  // LT-97: the board is live, so a snapshot can land mid-animation. gsap.from
  // left the killed row stuck part-way transparent, which read as a cut-off
  // list. Every row must settle fully visible.
  test("every row settles fully visible, on desktop and phone", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 40 });
    await writeDoc(`QuizLeaderboards/${QUIZ_ID}/Scores/${learner.uid}`, {
      userId: learner.uid,
      displayName: learner.displayName,
      avatarId: "astro-girl",
      score: 60,
      rawScore: 6,
      totalQuestions: 10,
    });

    await signIn(page, learner);

    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/leaderboard", { waitUntil: "domcontentloaded" });
      await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
      await expect(page.locator(".lb-row:visible").first()).toBeVisible({ timeout: 20000 });

      const rows = page.locator(".lb-row:visible");
      const count = await rows.count();
      expect(count, `no rows rendered at ${width}px`).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        const row = rows.nth(i);
        await expect
          .poll(async () => Number(await row.evaluate((el) => getComputedStyle(el).opacity)), {
            message: `row ${i + 1} never reached full opacity at ${width}px`,
            timeout: 5000,
          })
          .toBe(1);

        const box = await row.boundingBox();
        expect(box.x + box.width, `row ${i + 1} is cut off at ${width}px`).toBeLessThanOrEqual(width);
      }

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `the board pushed the page sideways at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
});
