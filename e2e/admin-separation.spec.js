import {
  test,
  expect,
  createAdminAccount,
  createLearner,
  signIn,
  docExists,
} from "./support/emulator.js";

// LT-99: the owner keeps two Google accounts, one admin and one learner. An
// administrator is not a learner: no XP, no streak popup, no celebration, and
// above all no row on the world-readable leaderboard. GamificationProvider
// wraps the whole app and had no admin check, so all of that was reachable.

test.describe("admin and learner accounts stay separate", () => {
  // LT-101: signing in at the admin door with a learner account used to sign
  // the person out and drop them on a red error. The portal still refuses to
  // open, but the learner keeps their session and lands in the learner app.
  test("a learner account at the admin door is sent to the learner app", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 10 });
    await signIn(page, learner);

    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    // The portal shows its own sign-in screen rather than any admin data.
    await expect(page.getByText(/admin/i).first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/contact messages|bug reports/i)).toBeHidden();

    // The learner's own session survives: the learner app is still theirs.
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("an admin lands in the admin shell with no learner surfaces", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `admin-${suffix}@example.test`;
    const uid = await createAdminAccount(email);

    await signIn(page, { email, password: "e2e-password-123" });

    await expect(page, "an admin did not land in the admin shell").toHaveURL(/\/admin/, {
      timeout: 20000,
    });

    // None of the learner moments belong here.
    await expect(page.getByText(/pick your look/i)).toBeHidden();
    await expect(page.getByText(/finish setting up your profile/i)).toBeHidden();
    // No learner profile is created for an admin either, so nothing downstream
    // (XP, streak, badges) has anything to attach to.
    expect(await docExists(`Users/${uid}`), "an admin got a learner profile").toBe(false);

    // Visiting the learner dashboard directly still puts them back.
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });

    // The decisive one: nothing learner-shaped was ever written for this uid.
    expect(
      await docExists(`PublicLeaderboard/${uid}`),
      "the admin account reached the public leaderboard"
    ).toBe(false);
  });

  // LT-103: an admin taking a quiz used to write an attempt and a row onto a
  // public board. The gamification guard stopped the XP; nothing stopped the
  // writes themselves.
  test("an admin taking a quiz writes nothing a learner would own", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `admin-quiz-${suffix}@example.test`;
    const uid = await createAdminAccount(email);

    await signIn(page, { email, password: "e2e-password-123" });
    await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });

    // Walk into a quiz the way a curious admin would.
    await page.goto("/quiz", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const start = page.getByRole("button", { name: /start|play|begin/i }).first();
    if (await start.isVisible().catch(() => false)) {
      await start.click();
      // Answer whatever is on screen; the timer finishes the quiz either way.
      for (let i = 0; i < 12; i += 1) {
        const option = page.locator("button", { hasText: /^[A-D][).]|\w/ }).nth(1);
        if (await option.isVisible().catch(() => false)) await option.click().catch(() => {});
        await page.waitForTimeout(400);
      }
    }

    // Whatever happened on screen, nothing learner-shaped exists for this uid.
    expect(await docExists(`Users/${uid}`), "an admin got a learner profile").toBe(false);
    expect(
      await docExists(`PublicLeaderboard/${uid}`),
      "an admin reached the public leaderboard"
    ).toBe(false);
    for (const quiz of ["python", "math", "web", "finance", "art", "marketing", "frontend"]) {
      expect(
        await docExists(`QuizLeaderboards/${quiz}/Scores/${uid}`),
        `an admin wrote a score onto the ${quiz} board`
      ).toBe(false);
    }
  });
});
