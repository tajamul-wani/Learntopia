import { test, expect, createAccount, createLearner, signIn, writeDoc, readDoc } from "./support/emulator.js";

// LT-81: the public leaderboard must never carry an account's real name. A
// Google sign-in hands the app the account holder's name, and it used to be
// copied straight onto the board. It now stays in the private profile, and the
// board shows the chosen display name or a generated nickname.

const REAL_NAME = "Tajamul Real Name";

test.describe("leaderboard privacy", () => {
  test("a new account publishes a nickname, never the account name", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `google-style-${suffix}@example.test`;
    // An account carrying a real name, as a Google sign-in would.
    const uid = await createAccount(email, { displayName: REAL_NAME });

    await signIn(page, { email, password: "e2e-password-123" });
    // A first-time learner is asked to choose a name and avatar; the public row
    // is written in the background while that screen is up.
    await expect(page.getByText(/finish setting up your profile/i)).toBeVisible({ timeout: 20000 });

    await expect
      .poll(async () => (await readDoc(`PublicLeaderboard/${uid}`))?.displayName, { timeout: 20000 })
      .toMatch(/^Learner \d{4}$/);

    const entry = await readDoc(`PublicLeaderboard/${uid}`);
    expect(entry.fullName, "the account name reached the public board").toBeUndefined();
    expect(JSON.stringify(entry)).not.toContain(REAL_NAME);

    // The private profile is where the account name is allowed to live.
    const profile = await readDoc(`Users/${uid}`);
    expect(profile.fullName).toBe(REAL_NAME);
  });

  test("the board renders a nickname for a row with no chosen name", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 30 });
    // A row as an older version of the app wrote it: a real name, no displayName.
    await writeDoc(`PublicLeaderboard/${learner.uid}`, {
      uid: learner.uid,
      fullName: REAL_NAME,
      totalPoints: 30,
      streak: 1,
      badges: ["Newcomer"],
    });

    await signIn(page, learner);
    await page.goto("/leaderboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await expect(page.locator(".lb-row:visible").first()).toBeVisible({ timeout: 20000 });

    const shown = await page.locator("body").innerText();
    expect(shown, "a legacy real name was rendered on the board").not.toContain(REAL_NAME);
  });
});
