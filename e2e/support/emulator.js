import { test as base, expect } from "./test.js";

// Helpers for specs that need a signed-in learner.
//
// Every e2e run talks to the local Firebase emulators, never to production (see
// src/firebase/firebase.js and playwright.config.js). Each test gets its own
// brand-new account, so no test depends on progress left behind by another and
// there are no credentials to store anywhere.
//
// Sign-in goes through the real login form. The profile document is written
// straight into the Firestore emulator so the test starts past the one-time
// profile setup screen; that write uses the emulator's "owner" token, which
// only the emulator accepts.

export * from "./emulator-api.js";
import { createLearner } from "./emulator-api.js";

export async function signIn(page, { email, password }) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  // Login is lazy-loaded; wait for the Suspense skeleton to clear before typing.
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  // Submit via Enter so we don't depend on the button's translated label.
  await page.locator("#password").press("Enter");
  await expect(page, "sign-in against the Auth emulator did not succeed").not.toHaveURL(/\/login$/, {
    timeout: 25000,
  });
}

/**
 * `test` with a `learner` fixture: a fresh account, already signed in on `page`.
 */
export const test = base.extend({
  // The fixture callback is named `provide`, not Playwright's usual `use`, so the
  // React hooks lint rule doesn't mistake it for React's use() hook.
  learner: async ({ page }, provide, testInfo) => {
    const learner = await createLearner(testInfo);
    await signIn(page, learner);
    await provide(learner);
  },
});

export { expect };
