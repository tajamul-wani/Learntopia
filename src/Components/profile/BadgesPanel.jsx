import { useState } from "react";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Modal from "../ui/Modal";
import EmptyState from "../ui/EmptyState";
import LottieIcon from "../ui/LottieIcon";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Every badge the learner has actually earned.
 *
 * Clicking one opens what it was for and when, the way a profile badge works
 * elsewhere: the grid stays scannable and the detail is there on demand rather
 * than crammed under every medallion.
 *
 * Two honest limits are stated in the UI rather than papered over. There is no
 * date for a derived badge, because those are recomputed from progress on every
 * render and were never recorded at a moment in time. And there is no "6 of 14":
 * the app has no catalogue of unearned badges to count against, so the total
 * would have to be invented.
 */
const BadgesPanel = ({ achievements, lottieFor, lottieClassFor, onBrowse }) => {
  const { t, currentLang } = useLanguage();
  const [openId, setOpenId] = useState(null);

  if (!achievements.length) {
    return (
      <EmptyState
        icon="award"
        title={t("profile.badgesEmpty")}
        description={t("profile.badgesEmptyDesc")}
        action={<Button onClick={onBrowse}>{t("profile.browseCourses")}</Button>}
      />
    );
  }

  const openIndex = achievements.findIndex((b) => b.id === openId);
  const open = openIndex >= 0 ? achievements[openIndex] : null;
  const earnedDate = open?.earnedAt
    ? new Date(open.earnedAt).toLocaleDateString(currentLang, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display text-base font-semibold text-ink-hi sm:text-lg">
        {t("profile.badgesEarned", { count: achievements.length })}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-4 sm:gap-x-5">
        {achievements.map((badge) => {
          const isOpen = badge.id === openId;
          return (
            <button
              key={badge.id}
              type="button"
              data-testid={`badge-${badge.id}`}
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : badge.id)}
              className="flex w-20 flex-col items-center gap-2 rounded-xl text-center transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky/50 sm:w-24"
            >
              <span
                className={`grid h-14 w-14 place-items-center overflow-hidden rounded-full border-2 bg-violet-500/[0.12] transition-colors sm:h-16 sm:w-16 ${
                  isOpen ? "border-violet-400 bg-violet-500/20" : "border-violet-500/35"
                }`}
              >
                <LottieIcon
                  src={lottieFor(badge.icon)}
                  size={40}
                  fallbackIcon={badge.icon}
                  className={lottieClassFor(badge.icon)}
                />
              </span>
              <span className="text-pretty text-[0.625rem] font-bold leading-tight text-ink-hi sm:text-[0.6875rem]">
                {badge.label}
              </span>
            </button>
          );
        })}
      </div>

      <Modal
        isOpen={Boolean(open)}
        onClose={() => setOpenId(null)}
        title={open?.label || ""}
        showFooter={false}
        widthClass="max-w-[450px]"
      >
        {open && (
          <div data-testid="badge-detail" className="flex flex-col items-center gap-4 text-center">
            <span className="grid h-28 w-28 place-items-center overflow-hidden rounded-full border-2 border-violet-500/40 bg-violet-500/[0.12]">
              <LottieIcon
                src={lottieFor(open.icon)}
                size={76}
                fallbackIcon={open.icon}
                className={lottieClassFor(open.icon)}
              />
            </span>

            {/* What it was for, said plainly. A label above it only repeated
                what the sentence already makes obvious. */}
            <p className="text-pretty text-base leading-relaxed text-ink">{open.desc}</p>

            <dl className="grid w-full gap-2 text-left">
              {earnedDate && (
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-surface-2 px-3.5 py-2.5">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-gold-500/[0.14] text-gold-400">
                    <Icon name="clock" size={15} />
                  </span>
                  <span className="min-w-0">
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-ink-low">
                      {t("profile.badgeEarnedLabel")}
                    </dt>
                    <dd className="mt-0.5 text-[0.8125rem] font-semibold text-ink-hi">{earnedDate}</dd>
                  </span>
                </div>
              )}

              {/* Where it sits in their collection — real context, counted from
                  what they have, not a total the app cannot know. */}
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-surface-2 px-3.5 py-2.5">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-violet-500/[0.14] text-violet-300">
                  <Icon name="award" size={15} />
                </span>
                <span className="min-w-0">
                  <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-ink-low">
                    {t("profile.badgeCollectionLabel")}
                  </dt>
                  <dd className="mt-0.5 text-[0.8125rem] font-semibold text-ink-hi">
                    {t("profile.badgeCollection", { position: openIndex + 1, total: achievements.length })}
                  </dd>
                </span>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BadgesPanel;
