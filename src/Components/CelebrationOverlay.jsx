import { useEffect, useRef, useState } from "react";
import { useGamification } from "../context/GamificationContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import { shouldPlaySound } from "./ui/notificationConfig";
import { localizeBadgeName } from "../utils/badgeI18n";
import LottieIcon from "./ui/LottieIcon";
import Icon from "./ui/Icon";
import useMediaQuery from "../hooks/useMediaQuery";
import trophyLottie from "../assets/lottie/Trophy.lottie?url";
import crownLottie from "../assets/lottie/crown.lottie?url";
import awardLottie from "../assets/lottie/award.lottie?url";
import starLottie from "../assets/lottie/star.lottie?url";
import streakLottie from "../assets/lottie/Streak.lottie?url";
import lighteningLottie from "../assets/lottie/lightening.lottie?url";
import roboticLottie from "../assets/lottie/robotic_memory.lottie?url";
import celebrationLottie from "../assets/lottie/celebration.lottie?url";

// Each celebration carries an `art` token (set in GamificationContext) that picks
// the Lottie played in the overlay. Falls back to the raw celebration type, then
// to the generic badge art, so an unknown moment still shows something sensible.
// `cls` scales up the few animations whose source art sits small in its frame,
// so every moment reads at a similar size in the overlay circle.
const MOMENT_ART = {
  level: { lottie: starLottie, fallback: "star", cls: "scale-[1.9]" },
  star: { lottie: starLottie, fallback: "star", cls: "scale-[1.9]" },
  xp: { lottie: celebrationLottie, fallback: "sparkles" },
  zap: { lottie: lighteningLottie, fallback: "zap" },
  streak: { lottie: streakLottie, fallback: "flame" },
  flame: { lottie: streakLottie, fallback: "flame" },
  course: { lottie: trophyLottie, fallback: "trophy", cls: "scale-125" },
  trophy: { lottie: trophyLottie, fallback: "trophy", cls: "scale-125" },
  crown: { lottie: crownLottie, fallback: "crown" },
  robotic: { lottie: roboticLottie, fallback: "robotic" },
  badge: { lottie: awardLottie, fallback: "award" },
};

const resolveMomentArt = (c) =>
  MOMENT_ART[c.art] || MOMENT_ART[c.type] || MOMENT_ART.badge;

// Auto-fade timing. Fade-in is quick, the moment holds long enough to read the
// Lottie + line, then fades out. Hovering pauses the hold (hover-to-keep).
const HOLD_MS = 4700;
const OUT_MS = 400;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One card, one moment. Remounted per moment (keyed by id in the wrapper) so all
// of its timers/animation state reset cleanly between queued celebrations.
function CelebrationCard({ celebration }) {
  const { closeCelebration } = useGamification();
  const { playLevelUp, playBadgeUnlock } = useSound();
  const { t } = useLanguage();
  const reduce = prefersReducedMotion();
  const isSmall = useMediaQuery("(max-width: 767px)");

  const [entered, setEntered] = useState(false); // drives fade-in
  const [leaving, setLeaving] = useState(false); // drives fade-out
  const hovered = useRef(false);
  const leaveTimer = useRef(null);

  const beginLeave = () => {
    if (leaveTimer.current) return; // already leaving
    setLeaving(true);
    leaveTimer.current = window.setTimeout(closeCelebration, OUT_MS);
  };

  // Success cue — once per moment, guarded so StrictMode's dev remount and any
  // re-render never double-play. Badge moments use the badge cue; everything
  // else (level, xp, streak, course) uses the level-up cue.
  useEffect(() => {
    if (!shouldPlaySound(`cel-${celebration.id}`)) return;
    if (celebration.type === "badge") playBadgeUnlock();
    else playLevelUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fade in on the next frame so the transition actually animates from opacity-0.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Hold, then auto-leave. While hovered the hold clock keeps resetting, so the
  // moment stays up as long as the pointer rests on it, then fades once it moves.
  useEffect(() => {
    let raf;
    let start = Date.now();
    const tick = () => {
      if (hovered.current) {
        start = Date.now();
      } else if (Date.now() - start >= HOLD_MS) {
        beginLeave();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const art = resolveMomentArt(celebration);
  const p = celebration.params || {};
  const kind = celebration.kind;

  // Localized achievement line, composed from the moment's kind + params. Any
  // externally-triggered moment can still pass raw title/message as a fallback.
  const title =
    kind === "level" ? t("gamification.celLevelTitle")
    : kind === "xp" ? t("gamification.celXpTitle", { amount: p.amount })
    : kind === "streakBonus" ? t("gamification.celStreakTitle", { amount: p.amount })
    : kind === "badge" ? t("gamification.celBadgeTitle")
    : kind === "course" ? t("gamification.celCourseTitle")
    : kind === "champion" ? t("gamification.celChampionTitle")
    : celebration.title;
  // Level name and course title have localized sources — resolve them so the
  // whole line translates (falling back to the raw value if a key is missing).
  const levelName = t(`levelNames.level${p.level}`, p.name);
  const courseName = (p.courseId ? t(`courseData.${p.courseId}.title`, p.course) : p.course) || t("gamification.celCourseThe");
  const badgeName = localizeBadgeName(p.name, t); // localized, English identity as fallback
  const message =
    kind === "level" ? t("gamification.celLevelMsg", { level: p.level, name: levelName })
    : kind === "badge" ? t("gamification.celBadgeMsg", { name: badgeName })
    : kind === "course" ? t("gamification.celCourseMsg", { course: courseName })
    : kind === "streakBonus" ? t("gamification.celStreakMsg", { streak: p.streak })
    : kind === "champion" ? t("gamification.celChampionMsg")
    : celebration.message; // xp carries a caller-localized reason

  const show = entered && !leaving;
  const dur = leaving ? "duration-[400ms]" : "duration-[250ms]";

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={beginLeave}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-ground-900/80 backdrop-blur-md transition-opacity ${dur} ${show ? "opacity-100" : "opacity-0"}`}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-violet-500/20 blur-[100px] animate-pulse" />
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-sky/20 blur-[90px] animate-pulse delay-700" />

      {/* Main card — scales in unless reduced motion is requested (then fade only) */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-surface p-6 text-center shadow-clay transition-all ${dur} sm:p-8 ${show ? "opacity-100" : "opacity-0"} ${reduce ? "" : show ? "scale-100" : "scale-95"}`}
      >
        <div className="mx-auto mb-5 flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-full border-2 border-violet-500/50 bg-gradient-to-br from-violet-500/20 to-sky/20 shadow-[0_0_30px_rgba(139,124,246,0.4)] md:mb-6 md:h-24 md:w-24">
          <LottieIcon src={art.lottie} size={isSmall ? 46 : 72} fallbackIcon={art.fallback} loop className={art.cls} />
        </div>

        <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl [text-wrap:balance]">{title}</h3>
        <p className="mx-auto mt-3 max-w-xs text-[15px] leading-relaxed text-ink-low [text-wrap:pretty] sm:max-w-sm sm:text-base">{message}</p>

        {celebration.badge && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300">
            <Icon name={celebration.badge.icon || "award"} size="sm" className="text-amber-300" />
            <span>{t("gamification.earnedBadge", { name: localizeBadgeName(celebration.badge.name, t) })}</span>
          </div>
        )}

        <p className="mt-6 text-xs text-ink-faint">{t("gamification.tapToDismiss")}</p>
      </div>
    </div>
  );
}

// Renders the head of the celebration queue. Keying by id remounts CelebrationCard
// for each moment so its auto-fade lifecycle restarts cleanly between them.
const CelebrationOverlay = () => {
  const { celebration } = useGamification();
  if (!celebration) return null;
  return <CelebrationCard key={celebration.id} celebration={celebration} />;
};

export default CelebrationOverlay;
