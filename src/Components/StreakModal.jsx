import { useEffect, useState } from "react";
import { useGamification } from "../context/GamificationContext";
import { useLanguage } from "../context/LanguageContext";
import { useSound } from "../context/SoundContext";
import Button from "./ui/Button";
import Icon from "./ui/Icon";

/**
 * StreakModal — Gamified streak-milestone popup.
 * Appears ONLY on the day the student's streak reaches a milestone (7, 15, 30),
 * once per calendar day, on their first visit that day. It never appears on
 * other days, and never once the streak is past 30. If the streak breaks and
 * climbs again, the milestones (and rewards) come around again.
 *
 * Rewards: 7 days → +20 XP, 15 days → +40 XP, 30 days → +80 XP.
 *
 * UX: auto-closes after ~6s, but PAUSES while the pointer is over the card;
 * clicking outside the card closes it immediately.
 */
const StreakModal = () => {
  const {
    streak,
    showStreakModal,
    dismissStreakModal,
    claimStreakBonus,
    streakBonusXp,
    streakMilestones,
    alreadyClaimedStreakToday,
  } = useGamification();
  const { t } = useLanguage();
  const { playBadgeUnlock } = useSound();

  // Pause the auto-close countdown while the user is hovering the card, so it
  // never vanishes out from under them. Leaving the card restarts the timer.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!showStreakModal || paused) return undefined;
    const timer = setTimeout(() => dismissStreakModal(), 6000);
    return () => clearTimeout(timer);
  }, [showStreakModal, paused, dismissStreakModal]);

  // Defensive: streakBonusXp > 0 only when the streak is exactly a milestone,
  // which is the only time the context turns the modal on.
  if (!showStreakModal || streakBonusXp <= 0) return null;

  const handleClaim = async () => {
    playBadgeUnlock();
    if (alreadyClaimedStreakToday) {
      dismissStreakModal();
    } else {
      await claimStreakBonus();
    }
  };

  // Milestone track: 7 → 15 → 30. Past milestones are completed, the current
  // one is active, later ones are upcoming; the final (30) is the trophy.
  const milestoneDays = Object.keys(streakMilestones || { 7: 20, 15: 40, 30: 80 })
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ground-900/85 p-4 backdrop-blur-md animate-fade-in"
      onClick={dismissStreakModal}
    >
      {/* Glow Effects (non-interactive so backdrop clicks still register) */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-gold-500/25 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-orange-500/20 blur-[100px] animate-pulse delay-500" />

      {/* Main Glassmorphism Card — clicks inside must NOT close the modal. */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gold-500/40 bg-surface p-6 text-center shadow-[0_0_60px_rgba(245,158,11,0.3)] animate-scale-up md:p-8"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Decorative Top Banner Pill */}
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-400">
          <span className="h-2 w-2 rounded-full bg-gold-400 animate-ping" />
          {t("dashboard.dayStreak") || "Daily Streak"}
        </div>

        {/* Hero Flame Avatar */}
        <div className="relative mx-auto mb-5 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-600/40 via-orange-500/40 to-yellow-400/40 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold-500/60 bg-gradient-to-br from-gold-500/20 via-orange-500/20 to-yellow-500/10 shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            <Icon name="flame" size={64} className="animate-bounce text-gold-400" />
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {t("streakModal.title", { count: streak })}
        </h3>
        <p className="mt-2 text-sm text-ink-low md:text-base">
          {t("streakModal.subtitle")}
        </p>

        {/* Milestone Track: 7 → 15 → 30 */}
        <div className="my-6 rounded-2xl border border-white/10 clay-inset p-4">
          <div className="flex items-center justify-between gap-2">
            {milestoneDays.map((day, i) => {
              const isCompleted = day < streak;
              const isActive = day === streak;
              const isFinal = i === milestoneDays.length - 1;
              const reward = (streakMilestones && streakMilestones[day]) || 0;
              return (
                <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-base font-black transition-all duration-300 ${
                      isActive
                        ? "scale-110 border-2 border-gold-400 bg-gradient-to-br from-gold-500 to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.6)]"
                        : isCompleted
                        ? "border border-state-success/50 bg-state-success/20 text-state-success"
                        : isFinal
                        ? "border border-violet-500/40 bg-violet-500/20 text-violet-300"
                        : "border border-white/10 bg-surface-2 shadow-clay-sm text-ink-faint opacity-70"
                    }`}
                  >
                    {isCompleted ? <Icon name="check" size={24} /> : isActive ? <Icon name="flame" size={24} /> : isFinal ? <Icon name="gift" size={24} /> : day}
                  </div>
                  <span className="text-xs font-bold text-ink-hi">{day}d</span>
                  <span className="text-[10px] font-semibold text-state-success/90">
                    +{reward} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bonus XP Badge — reflects the milestone just reached */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border border-state-success/30 bg-state-success/10 px-4 py-2 text-xs font-bold text-state-success">
          <Icon name="zap" size={16} />
          <span>{t("streakModal.streakBonus", { amount: streakBonusXp })}</span>
        </div>

        {/* Motivation Quote */}
        <p className="mb-6 text-xs italic text-ink-low">
          {t("streakModal.motivation")}
        </p>

        {/* Claim CTA — grants the milestone bonus XP (once per day, synced everywhere) */}
        <Button
          onClick={handleClaim}
          className="w-full justify-center bg-gold-500 py-3.5 text-base font-bold text-white shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:bg-gold-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.6)]"
        >
          {alreadyClaimedStreakToday
            ? t("streakModal.keepGoing")
            : t("streakModal.claimBonus", { amount: streakBonusXp })}
        </Button>
      </div>
    </div>
  );
};

export default StreakModal;
