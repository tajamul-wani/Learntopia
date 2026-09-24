import { test, expect, describe } from "vitest";
import {
  moduleGrant,
  courseGrant,
  quizLevelGrant,
  quizLevelsToClaim,
  streakGrant,
  GRANT_AMOUNTS,
  QUIZ_LEVEL_XP,
} from "./xpGrants";

// The grant key IS the anti-farming rule, so these check the two things that
// matter: a key is stable for the same work, and the levels claimed on a retake
// are only the ones above the previous best.

describe("grant keys", () => {
  test("the same module always produces the same key", () => {
    expect(moduleGrant(1, 2).key).toBe("course-1-module-2");
    expect(moduleGrant(1, 2)).toEqual(moduleGrant(1, 2));
  });

  test("different work produces different keys", () => {
    expect(moduleGrant(1, 2).key).not.toBe(moduleGrant(1, 3).key);
    expect(moduleGrant(1, 2).key).not.toBe(moduleGrant(2, 2).key);
    expect(courseGrant(1).key).not.toBe(moduleGrant(1, 1).key);
  });

  test("every grant amount matches its type in the table", () => {
    expect(moduleGrant(1, 0).amount).toBe(GRANT_AMOUNTS.module);
    expect(courseGrant(1).amount).toBe(GRANT_AMOUNTS.course);
    expect(quizLevelGrant("python", 3).amount).toBe(GRANT_AMOUNTS.quiz);
    expect(streakGrant(7, "2026-09-24").amount).toBe(GRANT_AMOUNTS.streak7);
  });

  test("a streak milestone can come round again on another day", () => {
    expect(streakGrant(7, "2026-09-24").key).not.toBe(streakGrant(7, "2026-11-02").key);
  });
});

describe("quiz score levels", () => {
  test("a first attempt claims every level up to the score", () => {
    expect(quizLevelsToClaim(7, 0)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(quizLevelsToClaim(7, 0).length * QUIZ_LEVEL_XP).toBe(70);
  });

  // The owner's rule: seven out of ten is seventy, and a retake pays only for
  // answers above the previous best.
  test("a retake matching the previous best claims nothing", () => {
    expect(quizLevelsToClaim(7, 7)).toEqual([]);
  });

  test("a worse retake claims nothing", () => {
    expect(quizLevelsToClaim(3, 7)).toEqual([]);
  });

  test("a better retake claims only the levels above the best", () => {
    expect(quizLevelsToClaim(9, 7)).toEqual([8, 9]);
    expect(quizLevelsToClaim(9, 7).length * QUIZ_LEVEL_XP).toBe(20);
  });

  test("a perfect run is worth ten a question", () => {
    expect(quizLevelsToClaim(15, 0).length * QUIZ_LEVEL_XP).toBe(150);
  });

  test("a zero score claims nothing", () => {
    expect(quizLevelsToClaim(0, 0)).toEqual([]);
  });
});
