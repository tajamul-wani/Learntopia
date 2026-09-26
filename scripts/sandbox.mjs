/**
 * Put the sandbox learner into a named state.
 *
 * Some screens can only be reached once per account: the first-time course
 * preview, an empty dashboard, the moment a certificate unlocks. The app moves
 * forward and will not move back, so checking those by hand used to mean
 * creating another real account, or deleting one.
 *
 * This writes those states straight into the local Firebase emulator, which is
 * a separate program on this machine holding its own Auth and Firestore. It is
 * not connected to the real project in any way: the app only talks to it when
 * `import.meta.env.DEV && VITE_USE_EMULATORS === "true"`, the project id is
 * `demo-learntopia` (Firebase refuses to reach real services with a `demo-`
 * id), and `npm run build` fails if any of that wiring reaches dist/.
 *
 * Re-running a state is the reset, so a first-time experience is repeatable as
 * many times as you like.
 *
 * Usage:  npm run sandbox:seed -- <state>
 *
 * The sandbox serves on 5175, following the same rule playwright.config.js uses
 * for 5174: a port of its own, so a normal `npm run dev` on 5173 — which talks
 * to the REAL Firebase project — can never be mistaken for it, and neither has
 * to be stopped to use the other.
 */
import {
  AUTH_EMULATOR,
  PROJECT_ID,
  createAccount,
  writeDoc,
} from "../e2e/support/emulator-api.js";

const EMAIL = "sandbox@learntopia.test";
const PASSWORD = "e2e-password-123";
const NAME = "Sandbox";

const STATES = {
  fresh: "signed in, no courses — the first-time preview and the join doorway",
  learning: "enrolled in Python, two of four modules done",
  nearly: "every module done, the certificate waiting to be claimed",
  completed: "Python finished, so the catalog shows Start again",
  paused: "left Python with progress kept, so Rejoin shows",
  veteran: "lots of XP, a long streak, badges and quiz history",
  wipe: "delete everything and start over",
};

const today = () => new Date().toISOString().slice(0, 10);

/** Removes every document and account, so the next seed starts from nothing. */
async function wipe() {
  const res = await fetch(
    `http://127.0.0.1:8080/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error(`Clearing Firestore failed: ${res.status}`);
  const auth = await fetch(`${AUTH_EMULATOR}/emulator/v1/projects/${PROJECT_ID}/accounts`, {
    method: "DELETE",
    headers: { Authorization: "Bearer owner" },
  });
  if (!auth.ok) throw new Error(`Clearing Auth failed: ${auth.status}`);
}

/** The sandbox account, recreated from scratch so every seed is identical. */
async function freshLearner({ points = 0, streak = 1, badges = ["Newcomer"] } = {}) {
  await wipe();
  const uid = await createAccount(EMAIL, { displayName: NAME });
  await writeDoc(`Users/${uid}`, {
    email: EMAIL,
    fullName: NAME,
    displayName: NAME,
    avatarId: "astro-girl",
    totalPoints: points,
    xp: points,
    badges,
    streak,
    lastLoginDate: today(),
  });
  if (points > 0) {
    await writeDoc(`PublicLeaderboard/${uid}`, {
      uid, displayName: NAME, avatarId: "astro-girl",
      totalPoints: points, xp: points, streak, badges,
    });
  }
  return uid;
}

async function enrol(uid, courseId, { completedModules = [], completed = false, unenrolled = false } = {}) {
  await writeDoc(`Users/${uid}/enrolledCourses/${courseId}`, {
    courseId: Number(courseId),
    title: "Python for Kids: Build Your First Game!",
    category: "Programming",
    completed,
    completedModules,
    totalModules: 4,
    unenrolled,
  });
}

const seeds = {
  fresh: () => freshLearner(),
  learning: async () => enrol(await freshLearner({ points: 100 }), 1, { completedModules: [0, 1] }),
  nearly: async () => enrol(await freshLearner({ points: 200 }), 1, { completedModules: [0, 1, 2, 3] }),
  completed: async () =>
    enrol(await freshLearner({ points: 300, badges: ["Newcomer", "Python Pioneer"] }), 1, {
      completedModules: [0, 1, 2, 3],
      completed: true,
    }),
  paused: async () => enrol(await freshLearner({ points: 100 }), 1, { completedModules: [0], unenrolled: true }),
  veteran: async () => {
    const uid = await freshLearner({
      points: 2400,
      streak: 23,
      badges: ["Newcomer", "Python Pioneer", "Math Wizard", "Quiz Master"],
    });
    await enrol(uid, 1, { completedModules: [0, 1, 2, 3], completed: true });
    await enrol(uid, 7, { completedModules: [0, 1] });
    await writeDoc(`Users/${uid}/Scores/python`, { score: 9, total: 10, quizId: "python" });
    await writeDoc(`Users/${uid}/Scores/math`, { score: 10, total: 10, quizId: "math" });
  },
  wipe,
};

const state = process.argv[2];

if (!state || !seeds[state]) {
  console.log("\nUsage: npm run sandbox:seed -- <state>\n");
  for (const [name, what] of Object.entries(STATES)) console.log(`  ${name.padEnd(10)} ${what}`);
  console.log("");
  process.exit(state ? 1 : 0);
}

try {
  await fetch(`${AUTH_EMULATOR}/`);
} catch {
  console.error("\nThe emulators are not running. Start them first:\n\n  npm run sandbox\n");
  process.exit(1);
}

await seeds[state]();

console.log(`\n  Seeded: ${state} — ${STATES[state]}\n`);
if (state !== "wipe") {
  console.log(`  Sign in at http://localhost:5175/login\n    ${EMAIL}\n    ${PASSWORD}\n`);
} else {
  console.log("  Everything cleared. Seed a state to start again.\n");
}
