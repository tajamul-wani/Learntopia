/**
 * What a learner may do with a course, decided from their enrolment document.
 *
 * Kept pure and in one place because the answer used to be worked out
 * separately in the catalog, the course page and the dashboard, and they
 * disagreed: opening a course page enrolled you, and someone who had left a
 * course could still reach its lessons through the URL.
 */

/** No document at all — the learner has never joined this course. */
export const NOT_ENROLLED = "not-enrolled";
/** They joined and left; their progress is kept and can be picked back up. */
export const LEFT = "left";
/** Joined, still going. */
export const LEARNING = "learning";
/** Every module finished. */
export const COMPLETED = "completed";

export function enrollmentState(enrolment) {
  if (!enrolment) return NOT_ENROLLED;
  if (enrolment.unenrolled === true) return LEFT;
  if (enrolment.completed === true) return COMPLETED;
  return LEARNING;
}

/**
 * Whether the lessons open. A learner who left keeps their progress but not
 * their access, so the course page offers to rejoin instead of teaching them.
 */
export const canLearn = (enrolment) => {
  const state = enrollmentState(enrolment);
  return state === LEARNING || state === COMPLETED;
};

/** How far through, as a percentage, for the card and the course header. */
export function progressPercent(enrolment, totalModules = 0) {
  const total = Number(totalModules) || Number(enrolment?.totalModules) || 0;
  if (total <= 0) return 0;
  const done = Array.isArray(enrolment?.completedModules) ? enrolment.completedModules.length : 0;
  return Math.min(100, Math.round((done / total) * 100));
}

/**
 * The single action a card or preview offers, so every surface agrees on the
 * wording and on what the button actually does.
 * @returns {"view"|"enroll"|"rejoin"|"continue"|"restart"}
 */
export function primaryAction(enrolment, { signedIn = true } = {}) {
  if (!signedIn) return "view";
  switch (enrollmentState(enrolment)) {
    case LEARNING:
      return "continue";
    case COMPLETED:
      return "restart";
    case LEFT:
      return "rejoin";
    default:
      return "enroll";
  }
}
