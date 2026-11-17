import { test, expect, createLearner, readDoc, signIn } from "./support/emulator.js";

// LT-49: a learner with the app open stamps lastActive, which is what the
// admin dashboard reads to show who is online.

test.describe("presence", () => {
  test("a learner with the app open stamps lastActive", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 10 });
    await signIn(page, learner);
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });

    await expect
      .poll(async () => (await readDoc(`Users/${learner.uid}`))?.lastActive ?? null, { timeout: 30000 })
      .not.toBeNull();
  });
});
