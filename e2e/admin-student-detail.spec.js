import {
  test,
  expect,
  createAdminAccount,
  createLearner,
  enrollLearner,
  writeDoc,
  signIn,
} from "./support/emulator.js";

// LT-49: the admin opens a learner on a page of their own and sees what they
// are doing, not only their points: progress, quiz attempts, XP over time and
// an activity log. All of it is read from data the app already stores.

async function openLearner(page, testInfo, { lastActive } = {}) {
  const learner = await createLearner(testInfo, { points: 120 });
  await writeDoc(`Users/${learner.uid}`, {
    email: learner.email,
    fullName: learner.displayName,
    totalPoints: 120,
    xp: 120,
    streak: 1,
    badges: ["Newcomer"],
    activeDays: [new Date().toISOString().slice(0, 10)],
    ...(lastActive ? { lastActive } : {}),
  });
  await enrollLearner(learner.uid, 1, {
    title: "Python for Kids: Build Your First Game!",
    totalModules: 4,
    completedModules: [0, 1],
  });
  const at = Date.now() - 60 * 60 * 1000;
  await writeDoc(`Users/${learner.uid}/xpLedger/course-1-module-0`, { type: "module", amount: 50, grantedAt: new Date(at) });
  await writeDoc(`Users/${learner.uid}/xpLedger/course-1-module-1`, { type: "module", amount: 50, grantedAt: new Date(at + 600000) });
  await writeDoc(`Users/${learner.uid}/quizAttempts/attempt-1`, {
    quizId: "python",
    quizTitle: "Python Basics Challenge Quiz",
    score: 7,
    totalQuestions: 10,
    xpEarned: 70,
    completedAt: new Date(at + 1200000),
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

test.describe("admin learner page", () => {
  test("opens on its own page, not a popup, with progress, quizzes, graphs and a log", async ({ page }, testInfo) => {
    const learner = await openLearner(page, testInfo);

    await expect(page).toHaveURL(new RegExp(`/admin/users/${learner.uid}$`), { timeout: 20000 });
    await expect(page.getByText("Python for Kids: Build Your First Game!")).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/^2\/\d+$/)).toBeVisible();
    await expect(page.getByRole("img", { name: /cumulative xp/i })).toBeVisible();
    await expect(page.getByRole("img", { name: /quiz scores/i })).toBeVisible();
    await expect(page.getByText("Quiz Python Basics Challenge Quiz: 7/10")).toBeVisible();
    await expect(page.getByText("Earned 50 XP (module)").first()).toBeVisible();
  });

  test("shows a recently active learner as online", async ({ page }, testInfo) => {
    await openLearner(page, testInfo, { lastActive: new Date() });
    await expect(page.getByTestId("presence")).toHaveText(/online now/i, { timeout: 20000 });
  });

  test("shows a long-gone learner as last active, not online", async ({ page }, testInfo) => {
    await openLearner(page, testInfo, { lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000) });
    await expect(page.getByTestId("presence")).toHaveText(/last active 3 h ago/i, { timeout: 20000 });
  });

  test("the page fits a phone width", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await openLearner(page, testInfo);
    await expect(page.getByText("Quiz Python Basics Challenge Quiz: 7/10")).toBeVisible({ timeout: 20000 });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, "the page scrolls sideways at 400px").toBeLessThanOrEqual(0);
  });
});
