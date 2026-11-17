import { test, expect, createAdminAccount, signIn } from "./support/emulator.js";

// LT-49: an admin tab left open does not stay signed in.

const signInAdmin = async (page, testInfo, tag) => {
  const email = `admin-${tag}-${Date.now()}-${testInfo.workerIndex}@example.test`;
  await createAdminAccount(email);
  await signIn(page, { email, password: "e2e-password-123" });
  await expect(page).toHaveURL(/\/admin/, { timeout: 20000 });
};

test.describe("admin session", () => {
  test("an idle admin is signed out", async ({ page }, testInfo) => {
    await page.clock.install();
    await signInAdmin(page, testInfo, "idle");
    await expect(page.getByText(/operations center/i)).toBeVisible({ timeout: 20000 });

    await page.clock.fastForward("16:00");

    await expect(page.getByText(/signed out after 15 minutes/i)).toBeVisible({ timeout: 20000 });
    await expect(page.getByText(/operations center/i)).toBeHidden();
  });
});
