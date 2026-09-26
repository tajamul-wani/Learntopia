/**
 * Talking to the local Firebase emulators over REST.
 *
 * Kept free of Playwright on purpose: the sandbox seeder (scripts/sandbox.mjs)
 * imports this too, so a learner state the owner clicks through by hand and a
 * learner state a test asserts against are built by exactly the same code and
 * cannot drift apart.
 *
 * Everything here uses the emulator's "owner" bearer token, which only the
 * emulator accepts, so these writes bypass firestore.rules. That is the point
 * for setup; the app itself always goes through the rules.
 */

export const PROJECT_ID = "demo-learntopia";
export const AUTH_EMULATOR = "http://127.0.0.1:9099";
export const FIRESTORE_EMULATOR = "http://127.0.0.1:8080";

const PASSWORD = "e2e-password-123";

export async function createAccount(email, { displayName } = {}) {
  const res = await fetch(
    `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: PASSWORD, displayName, returnSecureToken: true }),
    }
  );
  if (!res.ok) throw new Error(`Auth emulator sign-up failed: ${res.status} ${await res.text()}`);
  const { localId } = await res.json();
  return localId;
}

/**
 * An account carrying the admin custom claim, as the real project sets it
 * server-side. The emulator accepts the owner bearer token for this.
 */
export async function createAdminAccount(email) {
  const uid = await createAccount(email);
  const res = await fetch(
    `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/projects/demo-learntopia/accounts:update`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer owner" },
      body: JSON.stringify({ localId: uid, customAttributes: JSON.stringify({ admin: true }) }),
    }
  );
  if (!res.ok) throw new Error(`Setting the admin claim failed: ${res.status} ${await res.text()}`);
  return uid;
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

export async function writeDoc(path, data) {
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

/** True if the document exists in the Firestore emulator (reads past the rules). */
export async function docExists(path) {
  const res = await fetch(
    `${FIRESTORE_EMULATOR}/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`,
    { headers: { Authorization: "Bearer owner" } }
  );
  if (res.status === 404) return false;
  if (!res.ok) throw new Error(`Firestore emulator read of ${path} failed: ${res.status} ${await res.text()}`);
  return true;
}

/** Reads a document straight from the emulator, past the rules. Null if absent. */
export async function readDoc(path) {
  const res = await fetch(
    `${FIRESTORE_EMULATOR}/v1/projects/${PROJECT_ID}/databases/(default)/documents/${path}`,
    { headers: { Authorization: "Bearer owner" } }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore emulator read of ${path} failed: ${res.status}`);
  const body = await res.json();
  return Object.fromEntries(
    Object.entries(body.fields || {}).map(([k, v]) => [k, decodeValue(v)])
  );
}

/**
 * Firestore's REST shape back into plain JavaScript. Numbers matter: REST sends
 * integerValue as a STRING, so a test comparing a score to 30 was failing
 * against "30" while the app had written a perfectly good number.
 */
function decodeValue(value = {}) {
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return Number(value.doubleValue);
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields || {}).map(([k, v]) => [k, decodeValue(v)])
    );
  }
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue);
  return Object.values(value)[0];
}

/** True if the email + password still sign in, i.e. the Auth account exists. */
export async function canSignIn({ email, password }) {
  const res = await fetch(
    `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-api-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  return res.ok;
}

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Creates a learner with a finished profile. Returns { uid, email, password, displayName }.
 * `points` > 0 also gives them a public leaderboard entry with that score.
 */
export async function createLearner(testInfo, { points = 0 } = {}) {
  const suffix = `${Date.now()}-${testInfo.workerIndex}-${Math.random().toString(36).slice(2, 8)}`;
  const email = `learner-${suffix}@example.test`;
  const displayName = `Tester${suffix.replace(/\D/g, "").slice(-6)}`;
  const uid = await createAccount(email);

  await writeDoc(`Users/${uid}`, {
    email,
    fullName: displayName,
    displayName,
    avatarId: "astro-girl",
    totalPoints: points,
    xp: points,
    badges: ["Newcomer"],
    streak: 1,
    lastLoginDate: todayString(),
  });

  if (points > 0) {
    await writeDoc(`PublicLeaderboard/${uid}`, {
      uid,
      displayName,
      avatarId: "astro-girl",
      totalPoints: points,
      xp: points,
      streak: 1,
      badges: ["Newcomer"],
    });
  }

  return { uid, email, password: PASSWORD, displayName };
}

/**
 * Puts a learner inside a course.
 *
 * Opening a course page no longer enrols anyone (LT-51), so a spec that wants
 * the lessons has to say so. Seeding the document is deterministic and skips
 * the preview, which those specs are not testing.
 */
export async function enrollLearner(uid, courseId, { totalModules = 4, completedModules = [] } = {}) {
  await writeDoc(`Users/${uid}/enrolledCourses/${courseId}`, {
    courseId: Number(courseId),
    title: "Course",
    category: "Programming",
    completed: false,
    completedModules,
    totalModules,
    unenrolled: false,
  });
}
