import {
  test,
  expect,
  createAdminAccount,
  createLearner,
  enrollLearner,
  writeDoc,
  signIn,
} from "./support/emulator.js";

// LT-49 phase 1: the overview counts what learners have done across the app.

test("the overview totals count enrollments and quiz attempts", async ({ page }, testInfo) => {
  const learner = await createLearner(testInfo, { points: 50 });
  await enrollLearner(learner.uid, 1, { title: "Python for Kids: Build Your First Game!" });
  await writeDoc(`Users/${learner.uid}/quizAttempts/attempt-1`, {
    quizId: "python",
    quizTitle: "Python Basics Challenge Quiz",
    score: 5,
    totalQuestions: 10,
    xpEarned: 50,
    completedAt: new Date(),
  });

  const email = `admin-totals-${Date.now()}-${testInfo.workerIndex}@example.test`;
  await createAdminAccount(email);
  await signIn(page, { email, password: "e2e-password-123" });
  await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });

  // Other specs seed learners too, so assert "at least ours", not an exact count.
  for (const label of ["Enrollments", "Quizzes taken"]) {
    const card = page.locator("div.p-5.shadow-clay", { hasText: label });
    await expect(card).toContainText(/[1-9]\d*/, { timeout: 20000 });
  }
});
