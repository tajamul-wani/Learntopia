import { test, expect, createLearner, signIn, writeDoc, docExists, canSignIn } from "./support/emulator.js";

// LT-84: deleting an account wipes everything the learner owns, and a deleted
// #1 hands the top of the leaderboard to the runner-up.

// Every document a learner can own, seeded so the test proves each one is removed.
async function seedLearnerData(learner) {
  const { uid } = learner;
  await writeDoc(`Users/${uid}/enrolledCourses/1`, {
    courseId: 1,
    title: "Python",
    completed: false,
    completedModules: [0],
    totalModules: 4,
    xpAwardedModules: [0],
  });
  await writeDoc(`Users/${uid}/quizAttempts/attempt-1`, {
    quizId: "python",
    quizTitle: "Python",
    score: 8,
    totalQuestions: 10,
  });
  await writeDoc(`QuizLeaderboards/python/Scores/${uid}`, {
    userId: uid,
    score: 8,
    totalQuestions: 10,
  });
  return [
    `Users/${uid}`,
    `PublicLeaderboard/${uid}`,
    `Users/${uid}/enrolledCourses/1`,
    `Users/${uid}/quizAttempts/attempt-1`,
    `QuizLeaderboards/python/Scores/${uid}`,
  ];
}

async function openDeleteDialog(page) {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
  const openButton = page.getByRole("button", { name: /delete my profile/i });
  await openButton.scrollIntoViewIfNeeded();
  await openButton.click();
  await page.getByPlaceholder('Type "DELETE" to confirm').fill("DELETE");
}

const confirmButton = (page) => page.getByRole("button", { name: /delete profile permanently/i });

test.describe("account deletion (LT-84)", () => {
  // Each test signs in, re-authenticates, deletes a full account and reloads,
  // and the leaderboard test then signs in a second learner. That is several
  // page loads per test, which can pass the default 45s under parallel load.
  test.describe.configure({ timeout: 120 * 1000 });

  test("wipes the profile, progress, quiz history, scores, leaderboard entry and the account", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 250 });
    const paths = await seedLearnerData(learner);
    for (const path of paths) expect(await docExists(path), `${path} should exist before deletion`).toBe(true);

    await signIn(page, learner);
    await openDeleteDialog(page);

    // The confirm button stays disabled until the password is entered.
    await expect(confirmButton(page)).toBeDisabled();
    await page.locator("#delete-password").fill(learner.password);
    await confirmButton(page).click();

    // The app reloads on the home page and confirms the deletion.
    await expect(page).toHaveURL(/\/$/, { timeout: 30000 });
    await expect(page.getByText(/profile removed/i).first()).toBeVisible({ timeout: 20000 });

    for (const path of paths) {
      expect(await docExists(path), `${path} was left behind after deletion`).toBe(false);
    }
    expect(await canSignIn(learner), "the Auth account still exists").toBe(false);
    const cachedProfile = await page.evaluate((uid) => localStorage.getItem(`learntopia_custom_profile_${uid}`), learner.uid);
    expect(cachedProfile).toBeNull();
  });

  test("a wrong password deletes nothing and says so", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 120 });
    const paths = await seedLearnerData(learner);

    await signIn(page, learner);
    await openDeleteDialog(page);
    await page.locator("#delete-password").fill("not-the-password");
    await confirmButton(page).click();

    await expect(page.getByText(/password isn't right/i).first()).toBeVisible({ timeout: 20000 });
    for (const path of paths) {
      expect(await docExists(path), `${path} was deleted despite the wrong password`).toBe(true);
    }
    expect(await canSignIn(learner)).toBe(true);
  });

  test("the delete dialog fits a phone screen, password field and button included", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const learner = await createLearner(testInfo);
    await signIn(page, learner);
    await openDeleteDialog(page);

    const password = page.locator("#delete-password");
    await password.fill(learner.password);
    const button = confirmButton(page);
    await button.scrollIntoViewIfNeeded();

    for (const [name, el] of [["password field", password], ["confirm button", button]]) {
      await expect(el, `${name} is not visible on a phone`).toBeVisible();
      const box = await el.boundingBox();
      expect(box.x, `${name} starts off-screen`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${name} is cut off on the right`).toBeLessThanOrEqual(390);
    }
    await expect(button).toBeEnabled();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "the page scrolls sideways with the dialog open").toBeLessThanOrEqual(0);
  });

  test("when the #1 learner deletes their account, the runner-up becomes #1", async ({ page }, testInfo) => {
    // Far above anything other specs create, so these three are the top of the board.
    const first = await createLearner(testInfo, { points: 900000 });
    const second = await createLearner(testInfo, { points: 800000 });
    await createLearner(testInfo, { points: 700000 });

    await signIn(page, first);
    await openDeleteDialog(page);
    await page.locator("#delete-password").fill(first.password);
    await confirmButton(page).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 30000 });
    await expect(page.getByText(/profile removed/i).first()).toBeVisible({ timeout: 20000 });

    await signIn(page, second);
    await page.goto("/leaderboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const topRow = page.locator(".lb-row:visible").first();
    await expect(topRow).toContainText(second.displayName, { timeout: 20000 });
    await expect(page.getByText(first.displayName)).toHaveCount(0);
  });
});
