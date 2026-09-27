import { useLanguage } from "../../context/LanguageContext";
import { PROFILE_TABS } from "./profileTabs";

/**
 * The panels of My Profile.
 *
 * On a phone the four tabs share the width equally, because that is the only
 * way to show all of them without scrolling, and a bar that scrolls hides its
 * own options exactly where a learner is least likely to look for them. From
 * `sm` up there is room, so it goes back to a compact group at its natural
 * width rather than four labels stranded across the page.
 *
 * The count only appears from `sm`, where the bar is a compact row with room
 * for both. Showing it earlier made the labels truncate between 380 and 435px
 * while reading in full below 380 — narrower screens showing MORE text, which
 * is the kind of thing nobody can explain to a user.
 */
const ProfileTabs = ({ active, onChange, counts = {} }) => {
  const { t } = useLanguage();

  return (
    <div
      role="tablist"
      aria-label={t("nav.dashboard")}
      data-testid="profile-tabs"
      className="clay-inset grid grid-cols-4 gap-1 rounded-2xl border border-white/[0.06] p-1.5 sm:flex sm:w-fit sm:gap-1.5"
    >
      {PROFILE_TABS.map((tab) => {
        const isActive = active === tab.id;
        const count = counts[tab.id];
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-testid={`profile-tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-1.5 py-2.5 text-xs font-semibold transition-colors duration-200 sm:px-5 sm:text-[0.8125rem] ${
              isActive
                ? "bg-surface-2 text-ink-hi shadow-clay-sm ring-1 ring-violet-500/30"
                : "text-ink-low hover:text-ink-hi"
            }`}
          >
            <span className="min-w-0 truncate">{t(tab.labelKey)}</span>
            {count > 0 && (
              <span
                className={`hidden flex-none rounded-full px-1.5 py-0.5 text-[0.6875rem] font-bold tabular-nums sm:inline ${
                  isActive ? "bg-violet-500/20 text-violet-300" : "bg-surface-2 text-ink-low"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;
