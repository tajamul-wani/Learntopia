import { describe, it, expect } from "vitest";
import { contentTotals } from "./contentFacts";
import { COURSES } from "../data/coursesData";
import { quizzes } from "../data/quizData";
import { courseFacts } from "./courseFacts";

// The point of this file is that the home page cannot claim a number the
// content does not support. The old figures drifted within two weeks of
// being written down, so these assertions are about the counting staying
// honest, not about today's values.

describe("contentTotals", () => {
  it("counts the courses and quizzes that actually exist", () => {
    expect(contentTotals.courses).toBe(COURSES.length);
    expect(contentTotals.quizzes).toBe(quizzes.length);
  });

  it("adds up what every course reports about itself", () => {
    const expected = COURSES.reduce(
      (sum, course) => {
        const facts = courseFacts(course);
        return {
          modules: sum.modules + facts.modules,
          lessons: sum.lessons + facts.lessons,
          exercises: sum.exercises + facts.exercises,
          xp: sum.xp + facts.xp,
        };
      },
      { modules: 0, lessons: 0, exercises: 0, xp: 0 }
    );
    expect(contentTotals.modules).toBe(expected.modules);
    expect(contentTotals.lessons).toBe(expected.lessons);
    expect(contentTotals.exercises).toBe(expected.exercises);
    expect(contentTotals.xp).toBe(expected.xp);
  });

  it("counts a hands-on activity only where a course has one", () => {
    let activities = 0;
    for (const course of COURSES) {
      for (const module of course.syllabus || []) {
        for (const section of module.contentSections || []) {
          if (section.type === "activity") activities += 1;
        }
      }
    }
    expect(contentTotals.activities).toBe(activities);
  });

  it("counts every question across every quiz", () => {
    const questions = quizzes.reduce((n, quiz) => n + quiz.questions.length, 0);
    expect(contentTotals.questions).toBe(questions);
  });

  // A zero would mean the counting broke rather than that the library is
  // empty, and the home page would quietly print it.
  it("has nothing at zero", () => {
    for (const [key, value] of Object.entries(contentTotals)) {
      expect(value, `${key} counted zero`).toBeGreaterThan(0);
    }
  });

  it("cannot report more modules than lessons, or fewer courses than modules", () => {
    expect(contentTotals.modules).toBeGreaterThanOrEqual(contentTotals.courses);
    expect(contentTotals.lessons).toBeGreaterThanOrEqual(contentTotals.modules);
  });
});
