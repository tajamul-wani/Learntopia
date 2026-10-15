import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGamification } from "../../context/GamificationContext";
import { useLanguage } from "../../context/LanguageContext";
import useCountUp from "../../hooks/useCountUp";
import { LevelPill, XpBar, XpChip, StreakChip } from "./StatusPieces";

/**
 * Rank, XP and streak, in the header, on every page.
 *
 * Until now a learner could only see any of this by going to their profile,
 * which is the one place they are not while they are earning it. The point of
 * the HUD is that the number moves while they are looking at the thing that
 * moved it.
 *
 * It is at rest by default. The bar animates because its width changed and
 * the total counts up because it changed; nothing loops. A constant pulse was
 * considered and rejected: this sits beside lesson text that children are
 * reading, and permanent motion next to reading is a cost paid on every page
 * for a flourish seen once.
 *
 * Signed out, it renders nothing at all. An empty HUD showing zero would be
 * inventing a learner who does not exist, and the same applies while the
 * profile is still arriving: a learner with 910 XP briefly had a header
 * saying 0 XP on every page load, which is a wrong number rather than a
 * missing one. It waits instead.
 *
 * It is a readout, not a control. The first version was a link to My Profile,
 * which made the header move you somewhere when you touched it, did nothing
 * at all on My Profile itself, and turned a display into a control that then
 * had to satisfy the 24px minimum for a tap target. Nothing asked for the
 * navigation; removing it took all three problems with it.
 *
 * It also appears only where progress is in play. Being in the layout header
 * meant it rendered on the privacy policy and the contact form, and on My
 * Profile it sat directly above a larger copy of the same four values.
 *
 * On a phone the header hides as you scroll down and returns as you scroll up
 * (LT-115, which reclaimed those 58px deliberately). The HUD rides with it.
 */

// Learning surfaces. A page not listed here gets no HUD, so anything added
// later is silent by default rather than inheriting a game HUD by accident.
const ON = ["/", "/courses", "/course", "/quiz", "/leaderboard"];

const earnsHere = (pathname) =>
  ON.some((route) => (route === "/" ? pathname === "/" : pathname.startsWith(route)));
const StatusHud = ({ variant = "full", className = "" }) => {
  const { currentUser } = useAuth();
  const { xp, levelInfo, streak, loading } = useGamification();
  const { t } = useLanguage();
  const { pathname } = useLocation();

  const level = levelInfo?.level ?? 1;
  const shownXp = useCountUp(xp ?? 0);

  // One pop when the rank actually goes up, then back to rest.
  const previous = useRef(level);
  const [celebrate, setCelebrate] = useState(false);
  useEffect(() => {
    if (level > previous.current) {
      setCelebrate(true);
      const stop = setTimeout(() => setCelebrate(false), 1400);
      previous.current = level;
      return () => clearTimeout(stop);
    }
    previous.current = level;
    return undefined;
  }, [level]);

  if (!currentUser || loading || !earnsHere(pathname)) return null;

  const compact = variant === "compact";

  return (
    <div
      data-testid={compact ? "status-hud-compact" : "status-hud"}
      role="group"
      aria-label={t("profile.xpTotal", { xp: xp ?? 0 })}
      className={"flex items-center " + (compact ? "gap-1.5 " : "gap-2 ") + className}
    >
      {/* Each piece appears at the width where it fits and not before. The
          header row cannot shrink, so anything added here is width taken from
          the nav links beside it: the first attempt pushed the page sideways
          at 320px, 1024px and 1280px, which the responsive audit caught.
          Rank is the one that always shows, because it is the smallest and
          the most glanceable. */}
      <LevelPill level={level} compact celebrate={celebrate} />
      {!compact && levelInfo?.nextLevel && (
        <XpBar
          progressPct={levelInfo.progressPct ?? 0}
          trackClassName="hidden h-1.5 w-14 lgScreen:block"
        />
      )}
      <XpChip
        xp={xp ?? 0}
        value={shownXp}
        compact
        className={compact ? "hidden mediumPhone:inline-flex" : "hidden lgScreen:inline-flex"}
      />
      <StreakChip
        streak={streak}
        compact
        className={compact ? "hidden tablets:inline-flex" : ""}
      />
    </div>
  );
};

export default StatusHud;
