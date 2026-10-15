import Icon from "../ui/Icon";
import LottieIcon from "../ui/LottieIcon";
import streakLottie from "../../assets/lottie/Streak.lottie?url";
import { useLanguage } from "../../context/LanguageContext";

/**
 * The three things the app says about a learner's progress: rank, XP, streak.
 *
 * They were written once, inside ProfileHeader. The navbar HUD needs the same
 * three, and copying them would have left two definitions of what the colours
 * mean here, which would drift the first time either was adjusted.
 *
 * The mapping is the part worth protecting, because it is how a learner reads
 * the HUD at a glance without labels:
 *
 *   violet -> rank      sky -> XP      gold -> streak
 *
 * All three are existing palette tokens and none is used for anything else in
 * this context. A fourth idea here needs a colour, and there isn't one spare.
 */

/** Rank. `compact` is the navbar; the default is the profile header. */
export const LevelPill = ({ level, compact = false, celebrate = false, className = "" }) => {
  const { t } = useLanguage();
  return (
    <span
      data-testid="level-pill"
      className={
        "whitespace-nowrap rounded-full border border-violet-500/40 bg-surface-2 font-bold text-violet-300 shadow-clay-sm " +
        (compact ? "px-2 py-0.5 text-[0.6875rem] " : "px-2.5 py-0.5 text-[0.6875rem] ") +
        // One pop when the rank changes, never a loop. Tailwind's motion-reduce
        // variant drops it for a reader who asked for less movement.
        (celebrate ? "animate-popup-pop ring-2 ring-violet-400/60 motion-reduce:animate-none " : "") +
        className
      }
    >
      {t("profile.levelLabel", { level })}
    </span>
  );
};

/**
 * Progress through the current rank. The width transition is the only motion,
 * and it only runs because the width changed.
 */
export const XpBar = ({ progressPct, className = "", trackClassName = "" }) => (
  <div
    data-testid="xp-bar"
    role="progressbar"
    aria-valuenow={progressPct}
    aria-valuemin={0}
    aria-valuemax={100}
    className={"overflow-hidden rounded-full bg-surface-3 " + trackClassName + " " + className}
  >
    <div
      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky transition-[width] duration-500 motion-reduce:transition-none"
      style={{ width: `${progressPct}%` }}
    />
  </div>
);

/** Total XP. `value` is passed separately so a caller can animate it. */
export const XpChip = ({ xp, value, compact = false, className = "" }) => {
  const { t } = useLanguage();
  return (
    <span
      data-testid="xp-chip"
      className={
        "inline-flex items-center gap-1.5 rounded-full border border-sky/25 bg-sky/[0.10] font-bold tabular-nums text-sky " +
        (compact ? "px-2 py-0.5 text-[0.6875rem] " : "px-3 py-1 text-xs ") +
        className
      }
    >
      <Icon name="zap" size={compact ? 11 : 13} />
      {t("profile.xpTotal", { xp: value ?? xp })}
    </span>
  );
};

/** Days in a row. Absent at zero rather than shown as a nought. */
export const StreakChip = ({ streak, compact = false, className = "" }) => {
  const { t } = useLanguage();
  if (!streak || streak <= 0) return null;
  return (
    <span
      data-testid="streak-chip"
      aria-label={t("profile.streakDays", { count: streak })}
      className={
        "inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/[0.13] font-bold tabular-nums text-gold-400 " +
        (compact ? "py-0.5 pl-1 pr-2 text-[0.6875rem] " : "py-1 pl-1.5 pr-3 text-xs ") +
        className
      }
    >
      <LottieIcon src={streakLottie} size={compact ? 16 : 20} fallbackIcon="flame" />
      {compact ? streak : t("profile.streakDays", { count: streak })}
    </span>
  );
};
