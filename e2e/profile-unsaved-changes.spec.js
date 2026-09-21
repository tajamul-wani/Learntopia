import { test, expect, readDoc } from "./support/emulator.js";

// LT-81: unsaved profile edits must never be lost silently. Leaving the Edit
// Profile page with changes in the form holds the navigation and asks the
// learner to save or discard; the chosen page opens only after that is done.

const NAV_TARGET = /^Courses$/;

async function openEditProfile(page) {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
  await page.getByRole("button", { name: /edit profile/i }).first().click();
  await expect(page.getByRole("heading", { name: /edit your profile/i })).toBeVisible({ timeout: 20000 });
}

const nameField = (page) => page.locator('input[type="text"]').first();

test.describe("edit profile: unsaved changes", () => {
  test("leaving with nothing changed goes straight through", async ({ page, learner }) => {
    await openEditProfile(page);
    await page.getByRole("button", { name: /^cancel$/i }).click();

    await expect(page.getByRole("heading", { name: /edit your profile/i })).toBeHidden();
    await expect(page.getByText(/save your changes\?/i)).toBeHidden();
    expect((await readDoc(`Users/${learner.uid}`)).displayName).toBe(learner.displayName);
  });

  test("discarding keeps the profile as it was and then opens the chosen page", async ({ page, learner }) => {
    await openEditProfile(page);
    await nameField(page).fill("DiscardedName");
    await page.getByRole("link", { name: NAV_TARGET }).first().click();

    // Held: the dialog is up and the learner is still on the profile page.
    await expect(page.getByText(/save your changes\?/i)).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);

    // Closing the dialog means "stay", with the typed name still in the form.
    await page.getByRole("button", { name: /keep editing/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(nameField(page)).toHaveValue("DiscardedName");

    await page.getByRole("link", { name: NAV_TARGET }).first().click();
    await page.getByRole("button", { name: /^discard$/i }).click();

    await expect(page).toHaveURL(/\/courses/, { timeout: 20000 });
    expect(
      (await readDoc(`Users/${learner.uid}`)).displayName,
      "a discarded edit reached the profile"
    ).toBe(learner.displayName);
  });

  test("saving writes the change and then opens the chosen page", async ({ page, learner }) => {
    const newName = `Saved${Date.now()}`.slice(0, 20);
    await openEditProfile(page);
    await nameField(page).fill(newName);
    await page.getByRole("link", { name: NAV_TARGET }).first().click();

    await expect(page.getByText(/save your changes\?/i)).toBeVisible();
    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page).toHaveURL(/\/courses/, { timeout: 20000 });
    await expect
      .poll(async () => (await readDoc(`Users/${learner.uid}`))?.displayName, { timeout: 20000 })
      .toBe(newName);
  });
});
