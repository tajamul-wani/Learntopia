/**
 * Joining, leaving and rejoining a course.
 *
 * One place, because these writes used to live in three: the catalog created
 * enrolments, the course page created them again just by being opened, and the
 * dashboard wrote its own leave and rejoin. They drifted apart, and two bugs
 * came out of it — a learner was enrolled simply for looking at a course, and
 * the enrolment could land after progress had loaded and overwrite it.
 *
 * Leaving is deliberately soft: the document stays, flagged, so a learner who
 * comes back finds their modules and XP exactly as they left them.
 */
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const enrolmentRef = (uid, courseId) =>
  doc(db, "Users", uid, "enrolledCourses", courseId.toString());

/** @returns {Promise<object|null>} the enrolment document, or null */
export async function getEnrollment(uid, courseId) {
  if (!uid || courseId == null) return null;
  const snap = await getDoc(enrolmentRef(uid, courseId));
  return snap.exists() ? snap.data() : null;
}

/**
 * Join a course, or rejoin one previously left.
 *
 * Reads before writing: a learner who left has progress on file, and a blind
 * create would wipe it. Only the flag moves in that case.
 *
 * @returns {Promise<object>} the enrolment as it now stands
 */
export async function enroll(uid, course) {
  const ref = enrolmentRef(uid, course.id);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    await setDoc(ref, { unenrolled: false, rejoinedAt: new Date() }, { merge: true });
    return { ...existing.data(), unenrolled: false };
  }

  const fresh = {
    courseId: course.id,
    title: course.title,
    category: course.category,
    enrolledAt: new Date(),
    unenrolled: false,
    completed: false,
    completedModules: [],
    totalModules: course.syllabus ? course.syllabus.length : 0,
  };
  await setDoc(ref, fresh);
  return fresh;
}

/**
 * Leave a course without losing anything. The lessons close; the progress,
 * the XP already earned and the ledger entries behind it all stay.
 */
export async function leave(uid, courseId) {
  await setDoc(
    enrolmentRef(uid, courseId),
    { unenrolled: true, unenrolledAt: new Date() },
    { merge: true }
  );
}

/**
 * Start a finished course again: the modules reopen from the beginning while
 * the XP markers stay, so replaying teaches without paying twice.
 */
export async function restart(uid, courseId) {
  await setDoc(
    enrolmentRef(uid, courseId),
    { completedModules: [], completed: false, unenrolled: false, restartedAt: new Date() },
    { merge: true }
  );
}
