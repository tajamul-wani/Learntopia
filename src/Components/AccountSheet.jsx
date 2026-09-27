import { useEffect, useRef } from "react";
import Icon from "./ui/Icon";
import Avatar from "./Avatar";
import { useLanguage } from "../context/LanguageContext";

/**
 * The account menu on a phone, raised from the bottom bar's profile tab.
 *
 * It holds the same two things as the desktop menu, so a learner who moves
 * between a laptop and a phone finds the account in one place on both. It opens
 * upward from the bar and dims the page, which is also what keeps it clear of
 * the tutor launcher sitting just above the bar.
 *
 * The bar itself stays lit and reachable under the dimmed area: the sheet is a
 * detour, and tapping another tab should get that tab, not be swallowed by a
 * backdrop.
 */
const AccountSheet = ({ open, onClose, onGoToProfile, onSignOut, displayName, avatarId, photoURL }) => {
  const { t } = useLanguage();
  const panelRef = useRef(null);
  const firstRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    firstRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // Clear of the bar, which keeps its own safe-area padding on a notched phone.
  const aboveBar = "bottom-[calc(4.25rem+env(safe-area-inset-bottom))]";

  return (
    <>
      <div
        className={`fixed inset-x-0 top-0 z-[55] bg-ground-900/70 backdrop-blur-[2px] ${aboveBar}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="menu"
        aria-label={t("nav.account")}
        data-testid="account-sheet"
        // Capped and held to the right, over the tab that raised it. Edge to edge it
        // stretched a two-item menu across a whole tablet, which read as a page
        // rather than a menu. It never renders at or above lg, where the desktop
        // menu takes over.
        className={`fixed inset-x-2.5 z-[56] mb-2.5 ml-auto max-w-[400px] animate-fade-in rounded-2xl border border-white/10 bg-surface p-1.5 shadow-clay ${aboveBar}`}
      >
        <div className="flex items-center gap-2.5 px-2.5 pb-2.5 pt-2">
          <Avatar avatarId={avatarId} photoURL={photoURL} size={38} name={displayName} />
          <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink-hi">{displayName}</span>
        </div>

        <button
          type="button"
          role="menuitem"
          ref={firstRef}
          onClick={onGoToProfile}
          className="flex w-full items-center gap-2.5 rounded-xl bg-surface-2 px-2.5 py-2.5 text-left text-sm font-semibold text-ink-hi transition-colors focus:outline-none focus:ring-2 focus:ring-sky/50"
        >
          <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-violet-500/15 text-violet-300">
            <Icon name="user" size={16} />
          </span>
          <span className="flex-1">{t("nav.dashboard")}</span>
          <Icon name="arrow-right" size={16} className="text-ink-low" />
        </button>

        <div className="mx-2.5 my-1 h-px bg-white/[0.08]" />

        <button
          type="button"
          role="menuitem"
          onClick={onSignOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left text-sm font-semibold text-state-danger transition-colors focus:outline-none focus:ring-2 focus:ring-state-danger/50"
        >
          <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-state-danger/12 text-state-danger">
            <Icon name="logout" size={16} />
          </span>
          {t("nav.logout")}
        </button>
      </div>
    </>
  );
};

export default AccountSheet;
