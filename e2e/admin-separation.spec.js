import { test, expect, createAdminAccount, signIn, docExists } from "./support/emulator.js";

// LT-99: the owner keeps two Google accounts, one admin and one learner. An
// administrator is not a learner: no XP, no streak popup, no celebration, and
// above all no row on the world-readable leaderboard. GamificationProvider
// wraps the whole app and had no admin check, so all of that was reachable.

test.describe("admin and learner accounts stay separate", () => {
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
});
