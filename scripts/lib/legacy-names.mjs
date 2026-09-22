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
