import Icon from "../ui/Icon";
import Button from "../ui/Button";
import Avatar from "../Avatar";
import LottieIcon from "../ui/LottieIcon";
import streakLottie from "../../assets/lottie/Streak.lottie?url";
import { useLanguage } from "../../context/LanguageContext";

/**
 * The top of My Profile: who the learner is, and how far they have come.
 *
 * It stays put across every tab (LT-107). Only the panel below the tab row
 * changes, which is what stops four tabs reading as four separate pages.
 *
 * The order is deliberate: name, then the bar, then the chips that describe it.
 * Level and streak sat beside the name and competed with it; under the bar they
 * read as what they are, a description of the progress just above them.
 *
 * Centred on a phone, a row from `sm` up, so the picture and the name always
 * agree on which it is — they did not when the avatar centred and the text did
 * not.
 *
 * At the top level there is no next level to progress towards, so the bar is
 * replaced by the total rather than left sitting at 100% forever.
 */
const ProfileHeader = ({ name, avatarId, photoURL, level, xp, xpInLevel, xpNeeded, progressPct, nextLevel, streak, onEdit }) => {
  const { t } = useLanguage();
  const atTop = !nextLevel;

  return (
    <div className="relative">
      {/* The app's ambient glow, pulled in behind the avatar so the card has a
          focal point rather than being a flat slab. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl sm:left-16"
      />

      <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
        <div className="relative flex-none sm:mt-1">
          <Avatar
            avatarId={avatarId}
            photoURL={photoURL}
            size={88}
            name={name}
            className="h-20 w-20 rounded-full ring-2 ring-violet-500/30 sm:h-[88px] sm:w-[88px]"
          />
          {/* The level rides on the picture, the way a game shows rank. */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-violet-500/40 bg-surface-2 px-2.5 py-0.5 text-[0.6875rem] font-bold text-violet-300 shadow-clay-sm">
            {t("profile.levelLabel", { level })}
          </span>
        </div>

        <div className="w-full min-w-0 flex-1">
          <h1 className="break-words font-display text-[1.75rem]/[1.15] font-semibold text-ink-hi sm:text-[2rem]/[1.15]">
            {name}
          </h1>

          {atTop ? (
            <p className="mt-3 text-sm font-semibold text-ink">{t("profile.atTopLevel", { xp })}</p>
          ) : (
            <>
              <div className="mt-3 flex max-w-md items-baseline justify-between gap-3 text-[0.8125rem] font-semibold text-ink">
                <span className="min-w-0 truncate tabular-nums">
                  {t("profile.xpToLevel", { current: xpInLevel, target: xpNeeded, level: nextLevel })}
                </span>
                <span className="flex-none font-display text-base tabular-nums text-sky">{progressPct}%</span>
              </div>
              <div className="mt-1.5 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-surface-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky transition-[width] duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </>
          )}

          {/* Under the bar, because they describe what it is measuring. */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky/25 bg-sky/[0.10] px-3 py-1 text-xs font-bold text-sky">
              <Icon name="zap" size={13} />
              {t("profile.xpTotal", { xp })}
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/[0.13] py-1 pl-1.5 pr-3 text-xs font-bold text-gold-400">
                <LottieIcon src={streakLottie} size={20} fallbackIcon="flame" />
                {t("profile.streakDays", { count: streak })}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={onEdit}
          data-testid="profile-edit"
          className="w-full flex-none justify-center gap-2 px-6 py-3 text-sm font-bold sm:w-auto sm:self-center"
        >
          <Icon name="edit-3" size={17} />
          {t("profile.editProfile")}
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
