import { test, expect, describe } from "vitest";
import { getLevelInfo, LEVEL_THRESHOLDS } from "./levels";

// Levels are pure arithmetic over XP, and every learner sees them on the
// dashboard. Checking them here costs a millisecond; through the app it costs a
// sign-in, a database and a browser.

describe("getLevelInfo", () => {
  test("a new learner starts at level 1", () => {
    expect(getLevelInfo(0).level).toBe(1);
  });

  test("each threshold is exact, not off by one", () => {
    for (const { level, minXP } of LEVEL_THRESHOLDS) {
      expect(getLevelInfo(minXP).level, `${minXP} XP should be level ${level}`).toBe(level);
      if (minXP > 0) {
        expect(getLevelInfo(minXP - 1).level, `${minXP - 1} XP should still be the level below`).toBe(
          level - 1
        );
      }
    }
  });

  test("progress through a level is reported as a percentage of that level", () => {
    // Level 2 spans 100 to 250, so 175 is halfway.
    const info = getLevelInfo(175);
    expect(info.level).toBe(2);
    expect(info.xpInLevel).toBe(75);
    expect(info.xpNeeded).toBe(150);
    expect(info.progressPct).toBe(50);
  });

  test("the top level has no next level and never exceeds 100%", () => {
    const top = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const info = getLevelInfo(top.minXP * 10);
    expect(info.level).toBe(top.level);
    expect(info.nextLevel).toBe(undefined);
    expect(info.progressPct).toBeLessThanOrEqual(100);
  });
});
