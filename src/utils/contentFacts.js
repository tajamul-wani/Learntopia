import { COURSES } from "../data/coursesData";
import { quizzes } from "../data/quizData";
import { courseFacts } from "./courseFacts";

/**
 * What the whole library honestly adds up to.
 *
 * `courseFacts` answers this for one course; this answers it for all of
 * them, so the home page can state what is inside without anybody typing a
 * number into a component. Every figure is counted from the content at
 * module load, which means adding a course moves them on its own.
 *
 * This exists because the numbers it replaces had already drifted. The home
 * page claimed 6 courses and 3 quizzes while the app shipped 9 of each, and
 * the figures beside them — 2,000 learners and a 4.8 rating — were never
 * counted from anything at all.
 */
export const contentTotals = (() => {
  let modules = 0;
  let lessons = 0;
  let exercises = 0;
  let activities = 0;
  let xp = 0;

  for (const course of COURSES) {
    const facts = courseFacts(course);
    modules += facts.modules;
    lessons += facts.lessons;
    exercises += facts.exercises;
    xp += facts.xp;
    // Activities are the hands-on sections, counted here rather than in
    // courseFacts because a single course page has no reason to say it.
    for (const module of course.syllabus || []) {
      for (const section of module.contentSections || []) {
        if (section.type === "activity") activities += 1;
      }
    }
  }

  return {
    courses: COURSES.length,
    modules,
    lessons,
    exercises,
    activities,
    xp,
    quizzes: quizzes.length,
    questions: quizzes.reduce((sum, quiz) => sum + (quiz.questions?.length || 0), 0),
  };
})();
