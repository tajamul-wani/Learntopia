import { test as base, expect } from "@playwright/test";

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

export const PROJECT_ID = "demo-learntopia";
export const AUTH_EMULATOR = "http://127.0.0.1:9099";
export const FIRESTORE_EMULATOR = "http://127.0.0.1:8080";

const PASSWORD = "e2e-password-123";

async function createAccount(email) {
  const res = await fetch(
    `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: PASSWORD, returnSecureToken: true }),
    }
  );
  if (!res.ok) throw new Error(`Auth emulator sign-up failed: ${res.status} ${await res.text()}`);
  const { localId } = await res.json();
  return localId;
}

// Firestore REST wants typed values: { stringValue }, { integerValue }, ...
function toFirestoreFields(data) {
  const encode = (v) => {
    if (Array.isArray(v)) return { arrayValue: { values: v.map(encode) } };
    if (typeof v === "number") return { integerValue: String(v) };
    if (typeof v === "boolean") return { booleanValue: v };
    return { stringValue: String(v) };
  };
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, encode(v)]));
}

async function writeDoc(path, data) {
  const res = await fetch(
    `${FIRESTORE_EMULATOR}/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: "Bearer owner" },
      body: JSON.stringify({ fields: toFirestoreFields(data) }),
    }
  );
  if (!res.ok) throw new Error(`Firestore emulator write to ${path} failed: ${res.status} ${await res.text()}`);
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Creates a learner with a finished profile. Returns { uid, email, password, displayName }.
 */
export async function createLearner(testInfo) {
  const suffix = `${Date.now()}-${testInfo.workerIndex}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `learner-${suffix}@example.test`;
  const displayName = `Tester${suffix.replace(/\D/g, "").slice(-6)}`;
  const uid = await createAccount(email);

  await writeDoc(`Users/${uid}`, {
    email,
    fullName: displayName,
    displayName,
    avatarId: "astro-girl",
    totalPoints: 0,
    xp: 0,
    badges: ["Newcomer"],
    streak: 1,
    lastLoginDate: todayString(),
  });

  return { uid, email, password: PASSWORD, displayName };
}

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
