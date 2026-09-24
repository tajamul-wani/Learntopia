/**
 * Every way XP is earned, as a grant that can be claimed exactly once.
 *
 * A grant has a deterministic key and a fixed amount. The key is the whole
 * anti-farming rule: `course-1-module-2` can be created once and never again,
 * so replaying a module, deleting an enrolment and rejoining, or calling
 * Firestore directly cannot pay twice. Security rules enforce the same table,
 * so this file and firestore.rules must agree — the rules tests check that.
 */

export const MODULE_XP = 50;
export const COURSE_COMPLETE_XP = 100;
/** Each correct answer beyond the previous best score on a quiz. */
export const QUIZ_LEVEL_XP = 10;

export const GRANT_AMOUNTS = {
  module: MODULE_XP,
  course: COURSE_COMPLETE_XP,
  quiz: QUIZ_LEVEL_XP,
  streak7: 20,
  streak15: 40,
  streak30: 80,
};

export const moduleGrant = (courseId, moduleIndex) => ({
  key: `course-${courseId}-module-${moduleIndex}`,
  type: "module",
  amount: MODULE_XP,
});

export const courseGrant = (courseId) => ({
  key: `course-${courseId}-complete`,
  type: "course",
  amount: COURSE_COMPLETE_XP,
});

/**
 * One grant per score LEVEL reached on a quiz, so XP always equals the best
 * score times ten. Scoring 7 claims levels 1 to 7; a retake scoring 9 claims 8
 * and 9; a retake scoring 5 claims nothing, because those levels are taken.
 */
export const quizLevelGrant = (quizId, level) => ({
  key: `quiz-${quizId}-score-${level}`,
  type: "quiz",
  amount: QUIZ_LEVEL_XP,
});

/**
 * The levels a score claims, given what the learner has already banked.
 * @returns {number[]} empty when the score does not beat the previous best
 */
export const quizLevelsToClaim = (score, previousBest = 0) => {
  const from = Math.max(0, previousBest) + 1;
  const to = Math.max(0, score);
  const levels = [];
  for (let level = from; level <= to; level += 1) levels.push(level);
  return levels;
};

/** Streak milestones repeat when a streak breaks and climbs again, so the day is part of the key. */
export const streakGrant = (days, dayKey) => ({
  key: `streak-${days}-${dayKey}`,
  type: `streak${days}`,
  amount: GRANT_AMOUNTS[`streak${days}`],
});
