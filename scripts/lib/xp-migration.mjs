/**
 * Reconstructing an XP ledger for learners who earned XP before it existed.
 *
 * The decisions live here, apart from the Firestore walk, so they can be tested
 * without a database. They matter: this writes the record that decides what a
 * learner can never earn again, and a mistake either loses someone XP or lets
 * them farm it.
 *
 * Kept deliberately simple: reconstruct what we can prove from stored progress,
 * then close the gap with one reconciliation entry rather than inventing
 * history that was never recorded.
 */

export const MODULE_XP = 50;
export const COURSE_COMPLETE_XP = 100;
export const QUIZ_LEVEL_XP = 10;

/** The grant entries a single enrolment proves the learner was paid for. */
export function grantsFromEnrolment(courseId, enrolment = {}) {
  const grants = [];
  const modules = Array.isArray(enrolment.xpAwardedModules) ? enrolment.xpAwardedModules : [];
  for (const index of modules) {
    if (typeof index !== "number" || index < 0) continue;
    grants.push({ key: `course-${courseId}-module-${index}`, type: "module", amount: MODULE_XP });
  }
  if (enrolment.courseXpAwarded === true) {
    grants.push({ key: `course-${courseId}-complete`, type: "course", amount: COURSE_COMPLETE_XP });
  }
  return grants;
}

/**
 * The score levels a learner's best run on a quiz has already been paid for.
 *
 * Their old XP came from a banded table, so the amounts will not match what the
 * levels are worth today. That difference is not corrected here — it is left to
 * the reconciliation entry, because the point is to stop re-earning, not to
 * restate what someone was paid in the past.
 */
export function grantsFromQuizBest(quizId, bestScore = 0) {
  const grants = [];
  for (let level = 1; level <= Math.max(0, Math.floor(bestScore)); level += 1) {
    grants.push({ key: `quiz-${quizId}-score-${level}`, type: "quiz", amount: QUIZ_LEVEL_XP });
  }
  return grants;
}

/**
 * What to write for one learner.
 *
 * @param {number} currentXp   the XP they hold today, which must not change
 * @param {object[]} grants    entries reconstructed from stored progress
 * @returns {{entries: object[], reconciliation: object|null, total: number}}
 */
export function planLedger(currentXp = 0, grants = []) {
  const unique = new Map();
  for (const grant of grants) unique.set(grant.key, grant);
  const entries = [...unique.values()];
  const reconstructed = entries.reduce((sum, g) => sum + g.amount, 0);
  const gap = Math.round((Number(currentXp) || 0) - reconstructed);

  // A positive gap is XP they hold that we cannot attribute — old banded quiz
  // scores, streak bonuses, anything a past version granted. One entry carries
  // it so the ledger sums to their real balance.
  //
  // A negative gap means the reconstruction is worth MORE than they hold, which
  // happens when quiz levels are valued higher today than the band they were
  // paid. Their balance is never lowered; the entry is simply omitted, and the
  // ledger over-states history rather than taking XP away from a child.
  const reconciliation =
    gap > 0 ? { key: "legacy-balance", type: "legacy", amount: gap } : null;

  return {
    entries,
    reconciliation,
    total: reconstructed + (reconciliation ? reconciliation.amount : 0),
  };
}

/**
 * Bringing a learner's two score fields back together.
 *
 * `xp` drives levels and `totalPoints` is what the board shows. They are meant
 * to be one number — the app itself sets totalPoints = xp — but an older
 * version defined totalPoints as "XP plus quiz points", so for anyone with quiz
 * history from that era the two drifted apart. A learner could be shown 790
 * points and levelled from 450.
 *
 * Alignment raises `xp` to meet `totalPoints`, never the other way round: a
 * displayed score is what a child has been told they have, so it is the one
 * that must not move. The difference is added to their legacy-balance entry so
 * the ledger still sums to what they hold.
 *
 * @returns {{xp: number, legacyTopUp: number}|null} null when nothing to do
 */
export function planAlignment({ xp = 0, totalPoints = 0 } = {}) {
  const currentXp = Number(xp) || 0;
  const points = Number(totalPoints) || 0;
  if (points <= currentXp) return null;
  return { xp: points, legacyTopUp: points - currentXp };
}
