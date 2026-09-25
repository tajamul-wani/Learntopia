/**
 * Leo — the one AI tutor on Learntopia.
 *
 * There used to be six named tutors, one per course, which meant a learner met
 * a stranger every time they started something new and none of them ever built
 * any familiarity. Leo is the same companion everywhere; what changes is what
 * Leo knows, because the course and the current module are passed into the
 * system prompt on every request (see services/geminiService.js).
 */
export const TUTOR_NAME = "Leo";

/** The tutor as the chat drawer and the system prompt want it. */
export const tutorFor = (t) => ({
  name: TUTOR_NAME,
  role: t("aiTutor.role"),
});
