/**
 * Levels: pure arithmetic over XP.
 *
 * Kept out of GamificationContext on purpose. That module boots Firebase the
 * moment it is imported, so a test of this maths had to start App Check and a
 * Firestore client to check that 175 XP is halfway through level 2.
 */
export const LEVEL_THRESHOLDS = [
  { level: 1, name: "Rookie Coder", minXP: 0, icon: "sparkles" },
  { level: 2, name: "Code Explorer", minXP: 100, icon: "search" },
  { level: 3, name: "Byte Master", minXP: 250, icon: "zap" },
  { level: 4, name: "Logic Legend", minXP: 500, icon: "crown" },
  { level: 5, name: "Grandmaster", minXP: 1000, icon: "trophy" },
];

export const getLevelInfo = (xp) => {
  let currentLevel = LEVEL_THRESHOLDS[0];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXP) {
      currentLevel = LEVEL_THRESHOLDS[i];
      break;
    }
  }
  const nextLevel = LEVEL_THRESHOLDS.find((l) => l.level === currentLevel.level + 1);
  const xpInLevel = xp - currentLevel.minXP;
  const xpNeeded = nextLevel ? nextLevel.minXP - currentLevel.minXP : 100;
  const progressPct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return { ...currentLevel, nextLevel, xpInLevel, xpNeeded, progressPct };
};
