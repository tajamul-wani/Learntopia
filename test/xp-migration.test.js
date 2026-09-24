import { test, expect, describe } from "vitest";
import {
  grantsFromEnrolment,
  grantsFromQuizBest,
  planLedger,
  planAlignment,
  MODULE_XP,
  COURSE_COMPLETE_XP,
  QUIZ_LEVEL_XP,
} from "../scripts/lib/xp-migration.mjs";

// This writes the record that decides what a learner can never earn again. Get
// it wrong in one direction and someone loses XP they earned; in the other, and
// they can farm a course they already finished.

describe("reconstructing from stored progress", () => {
  test("a paid module becomes its grant", () => {
    expect(grantsFromEnrolment(1, { xpAwardedModules: [0, 2] })).toEqual([
      { key: "course-1-module-0", type: "module", amount: MODULE_XP },
      { key: "course-1-module-2", type: "module", amount: MODULE_XP },
    ]);
  });

  test("a completed course adds its bonus", () => {
    const grants = grantsFromEnrolment(3, { xpAwardedModules: [0], courseXpAwarded: true });
    expect(grants).toContainEqual({
      key: "course-3-complete",
      type: "course",
      amount: COURSE_COMPLETE_XP,
    });
  });

  test("an enrolment with no paid modules proves nothing", () => {
    expect(grantsFromEnrolment(1, {})).toEqual([]);
    expect(grantsFromEnrolment(1, { xpAwardedModules: [], courseXpAwarded: false })).toEqual([]);
  });

  test("rubbish in the stored list is ignored rather than trusted", () => {
    expect(grantsFromEnrolment(1, { xpAwardedModules: [0, -1, "two", null] })).toEqual([
      { key: "course-1-module-0", type: "module", amount: MODULE_XP },
    ]);
  });

  test("a best quiz score claims every level up to it", () => {
    expect(grantsFromQuizBest("python", 3)).toEqual([
      { key: "quiz-python-score-1", type: "quiz", amount: QUIZ_LEVEL_XP },
      { key: "quiz-python-score-2", type: "quiz", amount: QUIZ_LEVEL_XP },
      { key: "quiz-python-score-3", type: "quiz", amount: QUIZ_LEVEL_XP },
    ]);
  });

  test("never having scored claims nothing", () => {
    expect(grantsFromQuizBest("python", 0)).toEqual([]);
  });
});

describe("planning a learner's ledger", () => {
  test("the ledger always sums to the XP they already hold", () => {
    const grants = [...grantsFromEnrolment(1, { xpAwardedModules: [0, 1] })];
    const plan = planLedger(250, grants);
    expect(plan.total).toBe(250);
    expect(plan.reconciliation).toEqual({ key: "legacy-balance", type: "legacy", amount: 150 });
  });

  test("nothing is invented when the reconstruction already matches", () => {
    const grants = grantsFromEnrolment(1, { xpAwardedModules: [0, 1] });
    const plan = planLedger(100, grants);
    expect(plan.reconciliation).toBe(null);
    expect(plan.total).toBe(100);
  });

  // Old quiz XP came from a banded table, so today's levels can be worth more
  // than the learner was actually paid. Their balance is never lowered.
  test("a learner is never left owing XP", () => {
    const grants = grantsFromQuizBest("python", 10); // worth 100 today
    const plan = planLedger(60, grants); // they were paid 60 under the old bands
    expect(plan.reconciliation).toBe(null);
    expect(plan.total).toBeGreaterThan(60);
  });

  test("a duplicate grant is only ever written once", () => {
    const plan = planLedger(100, [
      { key: "course-1-module-0", type: "module", amount: 50 },
      { key: "course-1-module-0", type: "module", amount: 50 },
    ]);
    expect(plan.entries).toHaveLength(1);
  });

  test("a learner with no XP and no history gets an empty ledger", () => {
    const plan = planLedger(0, []);
    expect(plan.entries).toEqual([]);
    expect(plan.reconciliation).toBe(null);
    expect(plan.total).toBe(0);
  });
});

// One number, not two. `xp` levels a learner up and `totalPoints` is what the
// board shows; an older version defined the second as "XP plus quiz points", so
// they drifted for anyone with quiz history. A learner was shown 790 points and
// levelled from 450.

describe("aligning the two score fields", () => {
  test("xp is raised to meet the score the learner is shown", () => {
    expect(planAlignment({ xp: 450, totalPoints: 790 })).toEqual({ xp: 790, legacyTopUp: 340 });
  });

  test("a displayed score is never lowered to meet xp", () => {
    expect(planAlignment({ xp: 800, totalPoints: 600 })).toBe(null);
  });

  test("fields that already agree need nothing", () => {
    expect(planAlignment({ xp: 560, totalPoints: 560 })).toBe(null);
  });

  test("a learner with no score at all needs nothing", () => {
    expect(planAlignment({})).toBe(null);
    expect(planAlignment({ xp: 0, totalPoints: 0 })).toBe(null);
  });

  test("missing or malformed fields are treated as zero, not trusted", () => {
    expect(planAlignment({ totalPoints: 100 })).toEqual({ xp: 100, legacyTopUp: 100 });
    expect(planAlignment({ xp: "nonsense", totalPoints: 50 })).toEqual({ xp: 50, legacyTopUp: 50 });
  });
});
