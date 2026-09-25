/**
 * What a course page can honestly say about a course.
 *
 * Every number here is counted from the course itself, so it cannot drift from
 * the content and there is nothing to maintain by hand. This replaces the
 * invented rating and student count the cards used to carry: a learner deciding
 * whether to start deserves real signals, and a made-up 4.9 is not one.
 */

/** Lessons are the readable sections; exercises are the things you do. */
const DOING = new Set(["mcq", "match", "activity"]);

export function courseFacts(course) {
  const modules = Array.isArray(course?.syllabus) ? course.syllabus : [];

  let lessons = 0;
  let exercises = 0;
  for (const module of modules) {
    const sections = Array.isArray(module.contentSections) ? module.contentSections : [];
    for (const section of sections) {
      if (DOING.has(section.type)) exercises += 1;
      else lessons += 1;
    }
    // A module's own exercise set, separate from its reading.
    exercises += Array.isArray(module.exercises) ? module.exercises.length : 0;
  }

  return {
    modules: modules.length,
    lessons,
    exercises,
    xp: modules.reduce((sum, m) => sum + (Number(m.xpReward) || 0), 0),
    duration: course?.duration || "",
    difficulty: course?.difficulty || "",
    badge: course?.badge?.name || "",
  };
}

/**
 * The topics a course covers, taken from its module titles.
 *
 * Derived rather than authored on purpose: a hand-written list is a second copy
 * of the syllabus that quietly goes stale. "Module 1: Hello Python!" becomes
 * "Hello Python!".
 */
export function courseSkills(course, limit = 8) {
  const modules = Array.isArray(course?.syllabus) ? course.syllabus : [];
  const seen = new Set();
  const skills = [];

  for (const module of modules) {
    const title = String(module?.title || "").trim();
    if (!title) continue;
    // Drop a leading "Module 3:" style prefix, in whatever language.
    const topic = title.replace(/^[^:]{0,20}\d+\s*:\s*/, "").trim();
    const key = topic.toLowerCase();
    if (!topic || seen.has(key)) continue;
    seen.add(key);
    skills.push(topic);
    if (skills.length >= limit) break;
  }

  return skills;
}
