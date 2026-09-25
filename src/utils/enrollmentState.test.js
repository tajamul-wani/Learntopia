import { test, expect, describe } from "vitest";
import {
  enrollmentState,
  canLearn,
  progressPercent,
  primaryAction,
  NOT_ENROLLED,
  LEFT,
  LEARNING,
  COMPLETED,
} from "./enrollmentState";

// The catalog, the course page and the dashboard each used to decide this for
// themselves, and they disagreed: opening a course page enrolled you, and a
// learner who had left could still reach the lessons through the URL.

describe("enrollmentState", () => {
  test("no document means never joined", () => {
    expect(enrollmentState(null)).toBe(NOT_ENROLLED);
    expect(enrollmentState(undefined)).toBe(NOT_ENROLLED);
  });

  test("a learner part-way through is learning", () => {
    expect(enrollmentState({ completedModules: [0] })).toBe(LEARNING);
  });

  test("finishing every module is completed", () => {
    expect(enrollmentState({ completed: true, completedModules: [0, 1] })).toBe(COMPLETED);
  });

  test("leaving is remembered, and outranks completed", () => {
    expect(enrollmentState({ unenrolled: true })).toBe(LEFT);
    expect(enrollmentState({ unenrolled: true, completed: true })).toBe(LEFT);
  });
});

describe("canLearn", () => {
  test("lessons open once joined, and stay open after finishing", () => {
    expect(canLearn({ completedModules: [] })).toBe(true);
    expect(canLearn({ completed: true })).toBe(true);
  });

  // The bug this exists to stop: reaching lessons by URL after leaving.
  test("lessons are closed to someone who never joined or has left", () => {
    expect(canLearn(null)).toBe(false);
    expect(canLearn({ unenrolled: true, completedModules: [0, 1, 2] })).toBe(false);
  });
});

describe("progressPercent", () => {
  test("counts finished modules against the total", () => {
    expect(progressPercent({ completedModules: [0, 1] }, 4)).toBe(50);
  });

  test("falls back to the total stored on the enrolment", () => {
    expect(progressPercent({ completedModules: [0], totalModules: 4 })).toBe(25);
  });

  test("never divides by zero or exceeds a hundred", () => {
    expect(progressPercent({ completedModules: [0] }, 0)).toBe(0);
    expect(progressPercent(null, 4)).toBe(0);
    expect(progressPercent({ completedModules: [0, 1, 2, 3, 4] }, 4)).toBe(100);
  });
});

describe("primaryAction", () => {
  test("a signed-out visitor is only ever offered a look", () => {
    expect(primaryAction(null, { signedIn: false })).toBe("view");
    expect(primaryAction({ completedModules: [0] }, { signedIn: false })).toBe("view");
  });

  test("each state offers exactly one thing to do", () => {
    expect(primaryAction(null)).toBe("enroll");
    expect(primaryAction({ completedModules: [0] })).toBe("continue");
    expect(primaryAction({ completed: true })).toBe("restart");
    expect(primaryAction({ unenrolled: true })).toBe("rejoin");
  });
});
