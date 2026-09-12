import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "../context/ToastContext";
import Icon from "./ui/Icon";
import Button from "./ui/Button";
import Logo from "./ui/Logo";
import LanguageSelector from "./LanguageSelector";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../context/GamificationContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import Avatar from "./Avatar";

import { parseProfileName } from "../utils/profileUtils";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logOut } = useAuth();
  const { profile, photoURL, usePhoto } = useGamification();
  const { isMuted, toggleMute } = useSound();
  const { t } = useLanguage();

  const { displayName: navDisplayName, avatarId: navAvatarId } = parseProfileName(
    profile,
    currentUser?.displayName || t("nav.dashboard")
  );
  const currentDisplayName = navDisplayName || t("nav.dashboard");
  const currentAvatarId = navAvatarId;

  const NAV_ITEMS = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/courses", label: t("nav.courses") },
    { to: "/quiz", label: t("nav.quiz") },
    { to: "/leaderboard", label: t("nav.leaderboard") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const navItems = NAV_ITEMS.filter((item) => item.to !== "/leaderboard" || currentUser);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.logout(t("toasts.loggedOut"));
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(t("toasts.logoutFailedRetry"));
    }
  };

  return (
    <header className="sticky top-0 z-50 select-none border-b border-white/[0.08] bg-ground-900/95 shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
      <nav className="container-page relative flex items-center justify-between py-3.5">
        {/* Zone 1 (Left): Brand Logo */}
        <NavLink to="/" className="flex items-center">
          <Logo />
        </NavLink>

        {/* Zone 2 (Center): Flex-Centered Desktop Links */}
        <ul className="hidden flex-1 items-center justify-center gap-5 lg:gap-8 px-4 md:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-li text-sm font-semibold whitespace-nowrap transition-colors duration-200 ${
                    isActive ? "text-sky drop-shadow-[0_0_12px_rgba(78,197,232,0.4)]" : "text-ink-low hover:text-ink-hi"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Zone 3 (Right): Balanced Controls & Auth Capsule */}
        <div className="hidden items-center gap-2.5 shrink-0 md:flex">
          {/* Controls Capsule: Language + Sound SFX */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-surface-2 p-1 shadow-clay-sm">
            {/* Language Selector Dropdown */}
            <LanguageSelector />

            {/* Global Sound Toggle Button */}
            <button
              onClick={toggleMute}
              className={`h-[34px] flex items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-all duration-200 ${
                isMuted
                  ? "border-state-danger/30 bg-state-danger/10 text-state-danger hover:bg-state-danger/20"
                  : "border-sky/25 bg-sky/10 text-sky hover:border-sky/50 hover:bg-sky/20 hover:shadow-glow"
              }`}
              title={isMuted ? "Sound Effects: Muted (Click to Enable)" : "Sound Effects: Active (Click to Mute)"}
              aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            >
              <Icon name={isMuted ? "volume-x" : "volume-2"} size={14} />
              <span className="text-[11px] font-bold uppercase tracking-wider">{isMuted ? t("common.off") : t("common.sfx")}</span>
            </button>
          </div>

          {/* User Auth or Student Dashboard Profile Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => navigate("/dashboard")}
                title="View your student profile & dashboard"
                className="group h-[34px] flex items-center gap-2 rounded-full border border-white/10 bg-surface-2 shadow-clay-sm px-3.5 cursor-pointer transition-all duration-200 hover:border-sky/50 hover:bg-sky/10 hover:shadow-glow"
              >
                <Avatar
                  avatarId={currentAvatarId}
                  photoURL={usePhoto ? photoURL : null}
                  size={22}
                  name={currentDisplayName}
                />
                <span className="text-xs font-bold text-ink-hi group-hover:text-sky transition-colors max-w-[120px] truncate">
                  {currentDisplayName}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="h-[34px] px-2.5 text-xs text-ink-low hover:text-state-danger">
                {t("nav.logout")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="h-[34px] flex items-center justify-center rounded-full border border-white/10 bg-surface-2 shadow-clay-sm px-4 text-xs font-bold text-ink-hi whitespace-nowrap transition-all duration-200 hover:border-white/20 hover:bg-surface-3"
              >
                {t("nav.login")}
              </button>
              <button
                type="button"
                onClick={() => navigate("/signUp")}
                className="h-[34px] flex items-center justify-center rounded-full bg-violet-600 px-5 text-xs font-extrabold text-white whitespace-nowrap shadow-clay-btn transition-all duration-200 hover:bg-violet-500"
              >
                {t("nav.signUp")}
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls & hamburger button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />

          <button
            onClick={toggleMute}
            className={`grid h-9 w-9 place-items-center rounded-full border transition-colors ${
              isMuted
                ? "border-state-danger/30 bg-state-danger/10 text-state-danger"
                : "border-sky/30 bg-sky/10 text-sky"
            }`}
            title={isMuted ? "Sound: Muted" : "Sound: Enabled"}
            aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
          >
            <Icon name={isMuted ? "volume-x" : "volume-2"} size={17} />
          </button>

          {/* The profile itself lives in the bottom bar, so the top bar carries
              the account action: sign out when signed in, sign in when not. */}
          {currentUser ? (
            <button
              type="button"
              onClick={handleLogout}
              aria-label={t("nav.logout")}
              title={t("nav.logout")}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-surface-2 text-ink-low shadow-clay-sm transition-colors hover:border-state-danger/30 hover:bg-state-danger/10 hover:text-state-danger"
            >
              <Icon name="logout" size={17} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="h-9 rounded-full border border-white/10 bg-surface-2 px-3.5 text-xs font-bold text-ink-hi shadow-clay-sm transition-colors hover:bg-surface-3"
            >
              {t("nav.login")}
            </button>
          )}
        </div>
      </nav>

    </header>
  );
};

export default Navbar;
