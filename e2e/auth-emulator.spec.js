import { test, expect, createLearner, signIn } from "./support/emulator.js";

// LT-76: the suite signs in against the Firebase emulators, with no stored
// credentials. These tests prove the setup does what it claims: sign-in really
// works end to end, and nothing a test does can reach the production project.

const PRODUCTION_HOSTS = [
  "firestore.googleapis.com",
  "identitytoolkit.googleapis.com",
  "securetoken.googleapis.com",
  "firebaseinstallations.googleapis.com",
];

test.describe("auth emulator setup", () => {
  test("a fresh learner signs in and sees their own dashboard", async ({ page, learner }) => {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    // The seeded profile is complete, so the app skips the setup screen and the
    // dashboard greets the learner by the name stored in the emulator.
    await expect(page.getByText(learner.displayName).first()).toBeVisible({ timeout: 20000 });
  });

  test("signing in and loading signed-in pages never calls production Firebase", async ({ page }, testInfo) => {
    const productionCalls = [];
    page.on("request", (req) => {
      const host = new URL(req.url()).host;
      if (PRODUCTION_HOSTS.some((h) => host.endsWith(h))) productionCalls.push(req.url());
    });

    const learner = await createLearner(testInfo);
    await signIn(page, learner);
    for (const path of ["/dashboard", "/course/1", "/courses"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    }
    // Give background writes (streak, leaderboard mirror, enrollment) time to fire.
    await page.waitForTimeout(1500);

    expect(productionCalls, "the app reached a production Firebase endpoint during an e2e run").toEqual([]);
  });

  test("a wrong password is rejected by the emulator like real Firebase", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo);
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.locator("#email").fill(learner.email);
    await page.locator("#password").fill("not-the-password");
    await page.locator("#password").press("Enter");

    // Still on the login page: the real auth check ran and failed.
    await page.waitForTimeout(2500);
    await expect(page).toHaveURL(/\/login$/);
  });
});
