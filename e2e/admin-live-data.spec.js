import {
  test,
  expect,
  createAdminAccount,
  createLearner,
  writeDoc,
  signIn,
} from "./support/emulator.js";

// LT-49: the online filter, live updates and the dashboard on a phone.

const signInAdmin = async (page, testInfo, tag) => {
  const email = `admin-${tag}-${Date.now()}-${testInfo.workerIndex}@example.test`;
  await createAdminAccount(email);
  await signIn(page, { email, password: "e2e-password-123" });
  await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });
};

test.describe("presence", () => {
  test("the online count and filter only include recent learners", async ({ page }, testInfo) => {
    const here = await createLearner(testInfo, { points: 10 });
    const gone = await createLearner(testInfo, { points: 10 });
    const base = (l) => ({ email: l.email, fullName: l.displayName, totalPoints: 10, xp: 10, streak: 1, badges: [] });
    await writeDoc(`Users/${here.uid}`, { ...base(here), lastActive: new Date() });
    await writeDoc(`Users/${gone.uid}`, { ...base(gone), lastActive: new Date(Date.now() - 60 * 60 * 1000) });

    await signInAdmin(page, testInfo, "presence");
    await page.getByRole("button", { name: /^Students/ }).first().click();
    await page.getByRole("button", { name: /^Online now \(/ }).click();

    await expect(page.getByText(here.displayName)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(gone.displayName)).toBeHidden();
  });
});

test.describe("live data", () => {
  test("a new contact message appears without a refresh", async ({ page }, testInfo) => {
    await signInAdmin(page, testInfo, "live");
    const nav = page.locator("aside").getByRole("button", { name: /^Messages/ });
    const before = Number((await nav.innerText()).match(/\d+/)?.[0] ?? 0);

    await writeDoc(`ContactMessages/live-${Date.now()}`, {
      name: "Live Tester",
      email: "live@example.test",
      subject: "Arrived while open",
      message: "This should show up on its own.",
      submittedAt: new Date(),
    });

    await expect(nav).toContainText(String(before + 1), { timeout: 20000 });
  });
});

test.describe("dashboard on a phone", () => {
  test("overview and students fit 400px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 400, height: 800 });
    const learner = await createLearner(testInfo, { points: 10 });
    await writeDoc(`Users/${learner.uid}`, {
      email: learner.email,
      fullName: "A Learner With A Rather Long Display Name Indeed",
      totalPoints: 10,
      xp: 10,
      streak: 1,
      badges: [],
      lastActive: new Date(),
    });
    await signInAdmin(page, testInfo, "phone");

    const overflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

    await expect(page.getByText(/learners active per day/i)).toBeVisible({ timeout: 20000 });
    expect(await overflow(), "overview scrolls sideways at 400px").toBeLessThanOrEqual(0);

    await page.getByRole("button", { name: /^Students/ }).first().click();
    await expect(page.getByRole("button", { name: /^Online now \(/ })).toBeVisible();
    expect(await overflow(), "students scrolls sideways at 400px").toBeLessThanOrEqual(0);
  });
});
