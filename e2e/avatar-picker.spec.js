import { test, expect, createAccount, signIn, readDoc } from "./support/emulator.js";

// LT-81 part B: ten gender-neutral Critters avatars, so a learner never has to pick
// a gendered face, and so a learner who skips setup can be given a neutral one.
// The picker is the profile-setup screen a first-time learner lands on.

const PETS = 10;

test.describe("avatar picker", () => {
  test("offers the Critters set and saves the chosen animal, on desktop and phone", async ({ page }, testInfo) => {
    const suffix = `${Date.now()}-${testInfo.workerIndex}`;
    const email = `picker-${suffix}@example.test`;
    const uid = await createAccount(email, { displayName: "Account Name" });

    await signIn(page, { email, password: "e2e-password-123" });
    await expect(page.getByText(/finish setting up your profile/i)).toBeVisible({ timeout: 20000 });

    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      // Below lg the grid lives in a dialog, so the identity card and Save stay
      // at the top of the page; on desktop it sits beside them.
      const onPhone = width < 1024;
      if (onPhone) await page.getByRole("button", { name: /change avatar/i }).click();

      const petsTab = page.getByRole("button", { name: "Critters", exact: true });
      await expect(petsTab, `the Critters tab is missing at ${width}px`).toBeVisible();
      await petsTab.click();

      // Every pet is offered, and each one fits on screen. Only the visible
      // grid counts: below lg the desktop card is still in the DOM, hidden.
      const tiles = page.locator(
        ["Whiskers", "Scout", "Ember", "Bamboo", "Hoots", "Waddles", "Nibbles", "Rumble", "Ribbit", "Snooze"]
          .map((n) => `button[title="${n}"]:visible`)
          .join(", ")
      );
      await expect(tiles).toHaveCount(PETS);
      const box = await page.locator('button[title="Snooze"]:visible').boundingBox();
      expect(box.x + box.width, `a pet tile is cut off at ${width}px`).toBeLessThanOrEqual(width);

      if (onPhone) await page.getByRole("button", { name: /^done$/i }).click();
    }

    // Choosing a pet and a name saves both to the private profile.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.locator('button[title="Ember"]:visible').click();
    await page.locator('input[type="text"]').first().fill("FoxFan");
    await page.getByRole("button", { name: /save/i }).click();

    await expect
      .poll(async () => (await readDoc(`Users/${uid}`))?.avatarId, { timeout: 20000 })
      .toBe("pet-fox");
    const profile = await readDoc(`Users/${uid}`);
    expect(profile.displayName).toBe("FoxFan");
  });
});
