/**
 * What the legacy-name scrub changes, decided without touching Firestore.
 *
 * Kept apart from the script that walks the database so it can be unit-tested
 * without the Admin SDK: this is the logic that deletes fields from live,
 * world-readable documents, and getting it wrong either leaves a child's name
 * exposed or destroys a name they chose themselves.
 */

/** Fields that must never appear in a world-readable document. */
export const PUBLIC_BANNED = ["fullName", "email", "photoURL"];
export const SCORE_BANNED = ["userFullName", "userName", "email", "photoURL"];

export const nickname = () => `Learner ${Math.floor(1000 + Math.random() * 9000)}`;

/**
 * What to change on one public leaderboard row, if anything.
 *
 * @param {object} entry    the public row
 * @param {object} profile  that learner's private profile
 * @param {() => string} newName  generates the replacement nickname
 * @returns {{delete: string[], displayName?: string}}
 */
export function planPublicEntry(entry = {}, profile = {}, newName = nickname) {
  const plan = { delete: PUBLIC_BANNED.filter((field) => field in entry) };

  const accountName = (profile.fullName || "").trim();
  const chosen = (profile.displayName || "").trim();
  const shown = (entry.displayName || "").trim();
  // Only when the row repeats the account name AND the learner never chose a
  // name of their own: a learner who picked a name that happens to match keeps
  // what they picked.
  if (accountName && !chosen && shown === accountName) plan.displayName = newName();

  return plan;
}

/** Fields to delete from one quiz score row. @returns {string[]} */
export function planQuizScore(score = {}) {
  return SCORE_BANNED.filter((field) => field in score);
}

/**
 * A quiz score lives at QuizLeaderboards/{quizId}/Scores/{uid}. The walk uses a
 * collection-group query, which matches any collection called "Scores"
 * anywhere, so every path is checked before anything is touched.
 */
export function isQuizScorePath(path = "") {
  const parts = path.split("/").filter(Boolean);
  return parts.length === 4 && parts[0] === "QuizLeaderboards" && parts[2] === "Scores";
}

/**
 * Whether a uid belongs to an account that no longer exists.
 *
 * Firebase Auth is the source of truth: a login either exists or it does not.
 * The earlier version inferred it from two missing documents, which is a guess.
 *
 * **Fails closed.** `authKnown` says whether the lookup actually answered. If
 * it did not — a permission the service account lacks, a network error — the
 * uid is treated as alive. The alternative is deleting a real learner's data
 * because a lookup failed, which is not a trade worth making.
 *
 * @param {{authKnown: boolean, authExists: boolean}} lookup
 */
export function isDeadAccount({ authKnown, authExists }) {
  if (authKnown !== true) return false;
  return authExists === false;
}

/** Above this share of rows, the query is likelier wrong than the data. */
export const ORPHAN_ABORT_RATIO = 0.25;

/**
 * Refuse to delete when the orphan count is implausible — a permissions problem
 * or a bad path would otherwise look like "everything is an orphan".
 * @returns {{abort: boolean, ratio: number}}
 */
export function orphanGuard(orphans, scanned) {
  if (scanned <= 0) return { abort: false, ratio: 0 };
  const ratio = orphans / scanned;
  return { abort: ratio > ORPHAN_ABORT_RATIO, ratio };
}

/**
 * A document path with the user id cut short.
 *
 * Actions logs on a public repository are readable by anyone, and these paths
 * end in the id of a child's account. Six characters is enough to match rows
 * across boards and to look one up in the console; the whole id is not ours to
 * publish.
 */
export function maskPath(path = "") {
  const parts = path.split("/");
  const last = parts[parts.length - 1] || "";
  if (last.length <= 8) return path;
  parts[parts.length - 1] = `${last.slice(0, 6)}\u2026`;
  return parts.join("/");
}

/**
 * An administrator is not a learner, so learner documents must not exist for
 * one. The Auth lookup already returns custom claims, so no guessing.
 */
export function isAdminAccount({ authKnown, claims }) {
  return authKnown === true && claims?.admin === true;
}
