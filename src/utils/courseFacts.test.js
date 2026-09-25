import { test, expect, describe } from "vitest";
import { courseFacts, courseSkills } from "./courseFacts";
import { COURSES } from "../data/coursesData";

// These numbers replace an invented 4.9 rating and "1,200 students" on the
// course cards. They are counted from the course, so they cannot be wrong
// unless the content is — which is the whole point of deriving them.

const sample = {
  duration: "4 hours",
  difficulty: "Beginner",
  badge: { name: "Python Pioneer" },
  syllabus: [
    {
      title: "Module 1: Hello Python!",
      xpReward: 50,
      contentSections: [
        { type: "story" },
        { type: "concept" },
        { type: "mcq" },
        { type: "match" },
      ],
      exercises: [{}, {}],
    },
    {
      title: "Module 2: Variables & Data Types",
      xpReward: 50,
      contentSections: [{ type: "tip" }, { type: "activity" }],
    },
  ],
};

describe("courseFacts", () => {
  test("counts modules, reading and doing separately", () => {
    const facts = courseFacts(sample);
    expect(facts.modules).toBe(2);
    expect(facts.lessons, "story, concept and tip are reading").toBe(3);
    expect(facts.exercises, "mcq, match, activity and the two exercises are doing").toBe(5);
  });

  test("adds up the XP actually on offer", () => {
    expect(courseFacts(sample).xp).toBe(100);
  });

  test("carries the honest labels through", () => {
    const facts = courseFacts(sample);
    expect(facts.duration).toBe("4 hours");
    expect(facts.difficulty).toBe("Beginner");
    expect(facts.badge).toBe("Python Pioneer");
  });

  test("an empty or malformed course counts to zero rather than throwing", () => {
    expect(courseFacts(null).modules).toBe(0);
    expect(courseFacts({ syllabus: "nonsense" }).lessons).toBe(0);
    expect(courseFacts({}).xp).toBe(0);
  });
});

describe("courseSkills", () => {
  test("a module title becomes the topic, without its numbering", () => {
    expect(courseSkills(sample)).toEqual(["Hello Python!", "Variables & Data Types"]);
  });

  test("repeats are dropped and the list is capped", () => {
    const repetitive = {
      syllabus: [
        { title: "Module 1: Loops" },
        { title: "Module 2: Loops" },
        { title: "Module 3: Lists" },
      ],
    };
    expect(courseSkills(repetitive)).toEqual(["Loops", "Lists"]);
    expect(courseSkills({ syllabus: Array.from({ length: 30 }, (_, i) => ({ title: `Module ${i}: T${i}` })) }))
      .toHaveLength(8);
  });

  test("handles a course with no syllabus", () => {
    expect(courseSkills(null)).toEqual([]);
    expect(courseSkills({})).toEqual([]);
  });

  // Against the real content, not a fixture: every shipped course must produce
  // something worth showing, or the landing page has an empty section.
  test("every real course yields facts and topics", () => {
    for (const course of COURSES) {
      const facts = courseFacts(course);
      expect(facts.modules, `${course.title} has no modules`).toBeGreaterThan(0);
      expect(facts.xp, `${course.title} offers no XP`).toBeGreaterThan(0);
      expect(courseSkills(course).length, `${course.title} yields no topics`).toBeGreaterThan(0);
    }
  });
});

// The catalog used to carry a 4.9 rating, "1,200 students" and four stock
// photographs of strangers, none of it true. Deriving the facts only helps if
// the invented ones stay gone, so this fails the build if they come back.
describe("course content carries no invented social proof", () => {
  const INVENTED = ["rating", "students", "avatars", "reviews", "reviewCount"];

  test("no course claims a rating, an audience size or stock learners", () => {
    for (const course of COURSES) {
      for (const field of INVENTED) {
        expect(course[field], `${course.title} carries an invented "${field}"`).toBeUndefined();
      }
    }
  });

  test("what the cards show instead is counted, not claimed", () => {
    for (const course of COURSES) {
      const facts = courseFacts(course);
      expect(facts.lessons + facts.exercises, `${course.title} has no content`).toBeGreaterThan(0);
      expect(facts.duration, `${course.title} has no duration`).toBeTruthy();
      expect(facts.difficulty, `${course.title} has no level`).toBeTruthy();
      expect(facts.badge, `${course.title} has no badge to earn`).toBeTruthy();
    }
  });
});
