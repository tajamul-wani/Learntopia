import { test, expect, createAccount, signIn, writeDoc, readDoc } from "./support/emulator.js";

// LT-81 part C: an account whose name and avatar came from Google, or from a
// version of the app that never asked, is prompted once to choose an identity.
// Skipping gives them a gender-neutral Critter and keeps their real name off
// the public board. Either answer is recorded, so the prompt never returns.

const REAL_NAME = "Tajamul Real Name";

/** A profile as an older version of the app wrote it: a real name, no choice. */
async function seedGoogleStyleProfile(uid, email) {
  await writeDoc(`Users/${uid}`, {
    email,
    fullName: REAL_NAME,
    avatarId: "astro-girl",
    totalPoints: 20,
    badges: ["Newcomer"],
    streak: 1,
  });
  await writeDoc(`PublicLeaderboard/${uid}`, {
    uid,
    fullName: REAL_NAME,
    totalPoints: 20,
    streak: 1,
    badges: ["Newcomer"],
  });
}

test.describe("identity prompt", () => {
  test("a learner who never chose is asked once, and skipping gives them a Critter", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `legacy-${suffix}@example.test`;
    const uid = await createAccount(email, { displayName: REAL_NAME });
    await seedGoogleStyleProfile(uid, email);

    await signIn(page, { email, password: "e2e-password-123" });
    await expect(page.getByText(/pick your look/i)).toBeVisible({ timeout: 20000 });

    await page.getByRole("button", { name: /skip for now/i }).click();
    await expect(page.getByText(/pick your look/i)).toBeHidden({ timeout: 20000 });

    await expect
      .poll(async () => (await readDoc(`Users/${uid}`))?.identityConfirmedAt, { timeout: 20000 })
      .toBeTruthy();

    const profile = await readDoc(`Users/${uid}`);
    expect(profile.avatarId, "skipping left a gendered avatar in place").toMatch(/^pet-/);
    // The account name is allowed to stay on the private profile.
    expect(profile.fullName).toBe(REAL_NAME);

    const entry = await readDoc(`PublicLeaderboard/${uid}`);
    expect(entry.displayName).toMatch(/^Learner \d{4}$/);
    expect(entry.avatarId).toBe(profile.avatarId);
    expect(JSON.stringify(entry), "a real name survived on the public board").not.toContain(REAL_NAME);

    // Asked once: a fresh load of the app does not ask again.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await expect(page.getByText(/pick your look/i)).toBeHidden();
  });

  test("a learner who already chose is never asked", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `chosen-${suffix}@example.test`;
    const uid = await createAccount(email, { displayName: REAL_NAME });
    await writeDoc(`Users/${uid}`, {
      email,
      fullName: "PixelPilot",
      displayName: "PixelPilot",
      avatarId: "pet-owl",
      totalPoints: 0,
      badges: ["Newcomer"],
      streak: 1,
    });

    await signIn(page, { email, password: "e2e-password-123" });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await expect(page.getByText(/pick your look/i)).toBeHidden();
  });

  test("the prompt fits a phone screen", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `phone-${suffix}@example.test`;
    const uid = await createAccount(email, { displayName: REAL_NAME });
    await seedGoogleStyleProfile(uid, email);

    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, { email, password: "e2e-password-123" });
    await expect(page.getByText(/pick your look/i)).toBeVisible({ timeout: 20000 });

    // Both answers are reachable, and neither is pushed off the screen.
    for (const name of [/skip for now/i, /choose mine/i]) {
      const button = page.getByRole("button", { name });
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      expect(box.x, `a prompt button starts off-screen at 390px`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `a prompt button is cut off at 390px`).toBeLessThanOrEqual(390);
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "the prompt pushed the page sideways at 390px").toBeLessThanOrEqual(0);
  });

  test("choosing opens the profile editor", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `chooser-${suffix}@example.test`;
    const uid = await createAccount(email, { displayName: REAL_NAME });
    await seedGoogleStyleProfile(uid, email);

    await signIn(page, { email, password: "e2e-password-123" });
    await expect(page.getByText(/pick your look/i)).toBeVisible({ timeout: 20000 });
    await page.getByRole("button", { name: /choose mine/i }).click();

    await expect(page.getByRole("heading", { name: /edit your profile/i })).toBeVisible({ timeout: 20000 });
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
