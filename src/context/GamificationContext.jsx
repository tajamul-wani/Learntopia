/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, setDoc, increment, runTransaction, deleteField } from "firebase/firestore";

import { parseProfileName } from "../utils/profileUtils";

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

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

// Streak reward milestones: the popup appears ONLY on the day the streak reaches
// one of these day counts, and the Claim button grants the matching XP. There
// are no milestones after 30; if the streak breaks and climbs again, the user
// hits these milestones (and earns the rewards) again in the new cycle.
const STREAK_MILESTONES = { 7: 20, 15: 40, 30: 80 };
const streakRewardFor = (streak) => STREAK_MILESTONES[Number(streak)] || 0;

const localDayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const GamificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState([]);
  const [streak, setStreak] = useState(1);
  // A QUEUE of celebration moments. Several can fire at once (e.g. a course
  // completion that also crosses a level), so they play one after another
  // instead of a later write clobbering an earlier moment. `celebration` is the
  // head — the moment the auto-fading overlay is currently showing.
  const [celebrationQueue, setCelebrationQueue] = useState([]);
  const celebration = celebrationQueue[0] || null;
  const celIdRef = useRef(0);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Guards the daily streak popup so it is evaluated exactly ONCE per login,
  // from server-confirmed data. Without this, the first (cached) snapshot could
  // flash the modal on load with stale streak data before the real value lands.
  const streakEvaluatedRef = useRef(false);

  // Subscribe by uid (not the whole user object) so we re-subscribe only when
  // the signed-in user actually changes — not on every auth token refresh.
  const uid = currentUser?.uid;

  // ── Single source of truth: a LIVE subscription to the canonical Users doc.
  // Because every device reads the same doc via onSnapshot, XP / points / streak
  // are GLOBAL (identical everywhere the user is signed in) and REAL-TIME
  // (updates pushed instantly, no refresh). All writes are atomic increments, so
  // two devices earning at once can never clobber each other.
  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setXp(0);
      setBadges([]);
      setStreak(1);
      setShowStreakModal(false);
      setLoading(false);
      streakEvaluatedRef.current = false;
      return;
    }

    // New subscription for this user — allow one streak-popup evaluation.
    streakEvaluatedRef.current = false;

    const userRef = doc(db, "Users", uid);
    const unsub = onSnapshot(
      userRef,
      (snap) => {
        const d = snap.exists() ? snap.data() : {};
        setProfile(d);
        setXp(Number(d.xp) || 0);
        setBadges(Array.isArray(d.badges) ? d.badges : []);
        setStreak(Number(d.streak) || 1);
        setLoading(false);

        // Streak-milestone celebration — decided ONCE, from SERVER data only.
        // `fromCache` guards against the stale cached snapshot flashing the modal
        // on load; the once-guard stops it re-triggering on every write. Shows
        // ONLY on the day the streak hits a milestone (7/15/30), once per
        // calendar day (tracked in Firestore so it's consistent across devices).
        // No popup on other days, and none once the streak is past 30.
        if (!snap.metadata.fromCache && !streakEvaluatedRef.current) {
          streakEvaluatedRef.current = true;
          if (streakRewardFor(d.streak) > 0 && d.lastStreakPopupDate !== localDayKey()) {
            setShowStreakModal(true);
          }
        }
      },
      (err) => {
        console.error("Gamification snapshot error:", err);
        setLoading(false);
      }
    );

    return unsub;
  }, [uid]);

  // DEV-ONLY: preview the streak popup on demand (real popups need an exact
  // 7/15/30 streak). Visit e.g. http://localhost:5173/?streakTest=15 to force it.
  // `import.meta.env.DEV` is false in production, so this whole block is stripped
  // from the production bundle and can never fire for real users.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const testStreak = new URLSearchParams(window.location.search).get("streakTest");
    if (testStreak && [7, 15, 30].includes(Number(testStreak))) {
      setStreak(Number(testStreak));
      setShowStreakModal(true);
    }
  }, []);

  // DEV-ONLY: preview the auto-fading celebration overlay without earning anything.
  // Visit e.g. http://localhost:5173/?celTest=course, or ?celTest=all to see every
  // moment play back-to-back (the queue sequences them). Options: level | xp |
  // badge | champion | sharp | perfect | course | streak | all. Purely visual —
  // enqueues moments, never writes XP/badges. Stripped from production builds.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const which = new URLSearchParams(window.location.search).get("celTest");
    if (!which) return;
    const samples = {
      level: { type: "level", art: "level", kind: "level", params: { icon: "crown", level: 4, name: "Logic Legend" } },
      xp: { type: "xp", art: "xp", kind: "xp", params: { amount: 50 }, message: "Completed Module 1!" },
      badge: { type: "badge", art: "badge", kind: "badge", params: { name: "Quiz Ace", icon: "target" }, badge: { name: "Quiz Ace", icon: "target" } },
      champion: { type: "champion", art: "crown", kind: "champion" },
      sharp: { type: "badge", art: "robotic", kind: "badge", params: { name: "Sharp Memory", icon: "robot" }, badge: { name: "Sharp Memory", icon: "robot" } },
      perfect: { type: "badge", art: "zap", kind: "badge", params: { name: "Perfect Score", icon: "zap" }, badge: { name: "Perfect Score", icon: "zap" } },
      course: { type: "course", art: "trophy", kind: "course", params: { course: "Python for Kids: Build Your First Game!" } },
      streak: { type: "xp", art: "streak", kind: "streakBonus", params: { amount: 40, streak: 15 } },
    };
    const order = which === "all"
      ? ["level", "course", "champion", "sharp", "perfect", "xp", "streak"]
      : [which];
    order.forEach((k) => samples[k] && enqueueCelebration(samples[k]));
  }, []);

  const totalPoints = xp; // XP is the single unified score (quizzes + lessons + bonuses)
  const levelInfo = getLevelInfo(xp);

  const { displayName, avatarId } = parseProfileName(profile, currentUser?.displayName || "Learner");

  // Atomically add points to the profile AND mirror to the public leaderboard.
  // Uses increment() so concurrent writes from multiple devices are race-safe,
  // and the onSnapshot listeners reflect the new value everywhere immediately.
  const awardPoints = async (amount, extraProfileFields = {}) => {
    if (!currentUser || !amount || amount <= 0) return;
    const uid = currentUser.uid;
    try {
      await setDoc(
        doc(db, "Users", uid),
        { xp: increment(amount), totalPoints: increment(amount), updatedAt: new Date(), ...extraProfileFields },
        { merge: true }
      );
    } catch (err) {
      console.error("Error awarding points to profile:", err);
    }
    // Public leaderboard mirror (display data only — never email/PII).
    try {
      const publicFields = {
        uid,
        // Display data only. A real name must never reach this collection, and
        // deleteField clears one written by an older version of the app, so a
        // row self-heals the first time its owner earns points.
        displayName,
        avatarId,
        fullName: deleteField(),
        totalPoints: increment(amount),
        xp: increment(amount),
        streak: Number(profile?.streak) || 1,
        badges: (badges || []).map((b) => (typeof b === "string" ? b : b.name || "Badge")),
        updatedAt: new Date(),
      };
      if (profile?.displayName) publicFields.displayName = profile.displayName;
      if (profile?.avatarId) publicFields.avatarId = profile.avatarId;

      await setDoc(
        doc(db, "PublicLeaderboard", uid),
        publicFields,
        { merge: true }
      );
    } catch { /* leaderboard mirror is best-effort */ }
  };

  // `silent` persists XP (and detects level-ups) without firing its own popup.
  // Used when a bigger moment (e.g. course completion) owns the celebration, so
  // the same action never stacks two overlays. A level-up still surfaces because
  // it is a milestone in its own right.
  const addXP = async (amount, reason = "", { silent = false } = {}) => {
    const oldLevel = getLevelInfo(xp);
    const newLevel = getLevelInfo(xp + amount);
    await awardPoints(amount);

    if (newLevel.level > oldLevel.level) {
      setTimeout(() => {
        enqueueCelebration({
          type: "level",
          art: "level",
          kind: "level",
          params: { icon: newLevel.icon, level: newLevel.level, name: newLevel.name },
          xpEarned: amount,
        });
      }, 500);
    } else if (reason && !silent) {
      // `reason` is already localized by the caller (it has the language context).
      enqueueCelebration({ type: "xp", art: "xp", kind: "xp", params: { amount }, message: reason, xpEarned: amount });
    }
  };

  // `silent` persists the badge without its own popup, letting the caller own the
  // celebration (course completion shows one Trophy moment instead of two popups).
  //
  // Runs inside a TRANSACTION so concurrent awards are race-safe. Course
  // completion fires two awards almost at once (the course badge, then Sharp
  // Memory); a plain read-modify-write from React state let the second clobber
  // the first, and the only-grow Firestore rule then rejected the "shrinking"
  // write, silently dropping a badge. The transaction reads the freshest badges
  // from the server each attempt and appends exactly one, so both persist.
  const awardBadge = async (badge, { silent = false } = {}) => {
    if (!currentUser) return;
    const ref = doc(db, "Users", currentUser.uid);
    let added = false;
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        const cur = Array.isArray(snap.data()?.badges) ? snap.data().badges : [];
        if (cur.some((b) => (typeof b === "string" ? b : b.name) === badge.name)) return;
        tx.set(
          ref,
          { badges: [...cur, { ...badge, earnedAt: new Date().toISOString() }], updatedAt: new Date() },
          { merge: true }
        );
        added = true;
      });
    } catch (err) {
      console.error("Error awarding badge:", err);
    }
    // Nothing persisted (already owned, or the write failed) → no celebration.
    if (silent || !added) return;
    enqueueCelebration({
      type: "badge",
      art: badge.art || "badge",
      kind: "badge",
      params: { icon: badge.icon || "award", name: badge.name },
      badge,
    });
  };

  // Permanent "Streak Master" badge for reaching a 30-day login streak. Awarded
  // once (awardBadge dedupes by name) and stored, so it stays on the profile even
  // if the streak later breaks - the user still completed the 30 days. Silent
  // because the streak milestone modal already celebrates the 30-day moment.
  useEffect(() => {
    if (!currentUser || streak < 30) return;
    const hasBadge = badges.some((b) => (typeof b === "string" ? b : b.name) === "Streak Master");
    if (!hasBadge) {
      awardBadge({ name: "Streak Master", icon: "flame", art: "flame" }, { silent: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streak, badges, currentUser]);

  // One clear "moment" for finishing a course: show a single Trophy celebration,
  // then persist the course badge and XP quietly. The celebration is enqueued
  // FIRST so the moment always fires even if a background award write fails. Any
  // level-up from the XP still surfaces on its own (addXP handles that).
  const awardCourseCompletion = async (course, { grantXp = true } = {}) => {
    enqueueCelebration({
      type: "course",
      art: "trophy",
      kind: "course",
      // courseId lets the overlay resolve the LOCALIZED course title at render.
      params: { course: course?.title || "", courseId: course?.id },
    });
    if (course?.badge) await awardBadge(course.badge, { silent: true });
    // Skip the bonus on a replay (the caller gates this via courseXpAwarded).
    if (grantXp) await addXP(100, "", { silent: true });
  };

  // Anti-farming / accuracy awards. Both go through awardBadge, so they are
  // deduped (granted once) and fire the standard badge celebration.
  const awardPerfectScore = () =>
    awardBadge({ name: "Perfect Score", icon: "zap", art: "zap" });
  const awardSharpMemory = () =>
    awardBadge({ name: "Sharp Memory", icon: "robot", art: "robotic" });

  // Claim the daily streak bonus (+20 XP). Guarded to once per calendar day via
  // lastStreakClaimDate stored in Firestore, so it can't be re-claimed on
  // another device or after a refresh. Returns true if the bonus was granted.
  const claimStreakBonus = async () => {
    const todayKey = localDayKey();
    const amount = streakRewardFor(streak);
    if (!currentUser || amount <= 0 || profile?.lastStreakClaimDate === todayKey) {
      setShowStreakModal(false);
      return false;
    }
    await awardPoints(amount, { lastStreakClaimDate: todayKey, lastStreakPopupDate: todayKey });
    enqueueCelebration({
      type: "xp",
      art: "streak",
      kind: "streakBonus",
      params: { amount, streak },
      xpEarned: amount,
    });
    setShowStreakModal(false);
    return true;
  };

  const dismissStreakModal = async () => {
    if (currentUser) {
      try {
        await setDoc(
          doc(db, "Users", currentUser.uid),
          { lastStreakPopupDate: localDayKey() },
          { merge: true }
        );
      } catch { /* best-effort */ }
    }
    setShowStreakModal(false);
  };

  // Push a moment onto the queue, stamping a unique id so the overlay can key
  // (and sound-dedupe) each one. `closeCelebration` drops the head — the
  // auto-fading overlay calls it when a moment finishes, revealing the next.
  const enqueueCelebration = (obj) =>
    setCelebrationQueue((q) => [...q, { ...obj, id: (celIdRef.current += 1) }]);
  const triggerCelebration = (obj) => enqueueCelebration(obj);
  const closeCelebration = () => setCelebrationQueue((q) => q.slice(1));

  return (
    <GamificationContext.Provider
      value={{
        profile,
        displayName: profile?.displayName || null,
        avatarId: profile?.avatarId || null,
        // Real photo (Google account picture) + whether the user wants it shown
        // on their OWN surfaces. Never surfaced on the public leaderboard.
        photoURL: profile?.photoURL || currentUser?.photoURL || null,
        usePhoto: !!profile?.usePhoto,
        xp,
        totalPoints,
        levelInfo,
        badges,
        streak,
        celebration,
        showStreakModal,
        streakBonusXp: streakRewardFor(streak),
        streakMilestones: STREAK_MILESTONES,
        alreadyClaimedStreakToday: profile?.lastStreakClaimDate === localDayKey(),
        claimStreakBonus,
        dismissStreakModal,
        addXP,
        awardBadge,
        awardCourseCompletion,
        awardPerfectScore,
        awardSharpMemory,
        triggerCelebration,
        closeCelebration,
        loading,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};
