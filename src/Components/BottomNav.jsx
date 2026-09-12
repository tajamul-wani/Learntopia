import { NavLink } from "react-router-dom";
import Icon from "./ui/Icon";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../context/GamificationContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavChrome } from "../context/NavChromeContext";
import { parseProfileName } from "../utils/profileUtils";

/**
 * Mobile bottom tab bar (below md).
 *
 * Replaces the hamburger + drawer: every destination is one thumb tap inside the
 * natural reach arc, and the current route stays visible instead of being hidden
 * behind a menu. Desktop keeps the existing top nav, so this renders only under md.
 *
 * A bar holds five tabs before labels truncate. Signed out there are four
 * destinations; signing in adds Leaderboard and the profile, so Contact steps out
 * of the bar (it stays in the footer on every page) — a signed-in learner opens
 * their dashboard constantly and Contact rarely.
 */
const BottomNav = () => {
  const { currentUser } = useAuth();
  const { profile, photoURL, usePhoto } = useGamification();
  const { t } = useLanguage();
  const { immersive } = useNavChrome();

  // Out of the way while a module or quiz is running.
  if (immersive) return null;

  // Same wiring as Navbar, so the avatar has a single source of truth.
  const { displayName, avatarId } = parseProfileName(
    profile,
    currentUser?.displayName || t("nav.dashboard")
  );

  const tabs = currentUser
    ? [
        { to: "/", label: t("nav.home"), icon: "home", end: true },
        { to: "/courses", label: t("nav.courses"), icon: "book" },
        { to: "/quiz", label: t("nav.quiz"), icon: "target" },
        { to: "/leaderboard", label: t("nav.leaderboard"), icon: "trophy" },
        { to: "/dashboard", label: t("nav.dashboard"), avatar: true },
      ]
    : [
        { to: "/", label: t("nav.home"), icon: "home", end: true },
        { to: "/courses", label: t("nav.courses"), icon: "book" },
        { to: "/quiz", label: t("nav.quiz"), icon: "target" },
        { to: "/contact", label: t("nav.contact"), icon: "mail" },
      ];

  return (
    <nav
      aria-label="Primary"
      data-testid="bottom-nav"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-1 border-t border-white/[0.08] bg-ground-900/95 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-14px_26px_-18px_rgba(0,0,0,0.9)] md:hidden"
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 font-display text-[10px] font-semibold transition-colors duration-200 ${
              isActive ? "bg-sky/[0.09] text-sky" : "text-ink-low"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {tab.avatar ? (
                <Avatar
                  avatarId={avatarId}
                  photoURL={usePhoto ? photoURL : null}
                  size={21}
                  name={displayName}
                  className={isActive ? "rounded-full ring-2 ring-sky" : ""}
                />
              ) : (
                <Icon
                  name={tab.icon}
                  size={21}
                  className={isActive ? "drop-shadow-[0_0_7px_rgba(78,197,232,0.45)]" : ""}
                />
              )}
              <span className="max-w-full truncate">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
