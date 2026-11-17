import {
  test,
  expect,
  createAdminAccount,
  createLearner,
  enrollLearner,
  writeDoc,
  signIn,
} from "./support/emulator.js";

// LT-49 phase 1: the admin opens a learner and sees what they are doing, not
// only their points: enrolled courses with module progress and quiz attempts.

async function openLearner(page, testInfo) {
  const learner = await createLearner(testInfo, { points: 120 });
  await enrollLearner(learner.uid, 1, {
    title: "Python for Kids: Build Your First Game!",
    totalModules: 4,
    completedModules: [0, 1],
  });
  await writeDoc(`Users/${learner.uid}/quizAttempts/attempt-1`, {
    quizId: "python",
    quizTitle: "Python Basics Challenge Quiz",
    score: 7,
    totalQuestions: 10,
    xpEarned: 70,
    completedAt: new Date(),
  });

  const email = `admin-detail-${Date.now()}-${testInfo.workerIndex}@example.test`;
  await createAdminAccount(email);
  await signIn(page, { email, password: "e2e-password-123" });
  await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });

  await page.getByRole("button", { name: /^Students/ }).first().click();
  await page.getByPlaceholder(/search by name/i).fill(learner.displayName);
  await page.getByRole("button", { name: "View", exact: true }).first().click();
  return learner;
}

test.describe("admin learner detail", () => {
  test("shows enrolled course progress and quiz attempts", async ({ page }, testInfo) => {
    await openLearner(page, testInfo);

    const dialog = page;
    await expect(dialog.getByText("Python for Kids: Build Your First Game!")).toBeVisible({ timeout: 20000 });
    await expect(dialog.getByText(/^2\/\d+$/)).toBeVisible();
    await expect(dialog.getByText("Python Basics Challenge Quiz")).toBeVisible();
    await expect(dialog.getByText("7/10")).toBeVisible();
  });

  test("the detail fits a phone width", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await openLearner(page, testInfo);
    await expect(page.getByText("7/10")).toBeVisible({ timeout: 20000 });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, "the page scrolls sideways at 400px").toBeLessThanOrEqual(0);
  });
});
