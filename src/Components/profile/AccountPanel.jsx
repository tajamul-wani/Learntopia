import Card from "../ui/Card";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import LanguageSelector from "../LanguageSelector";
import StreakCalendar from "./StreakCalendar";
import BadgesPanel from "./BadgesPanel";
import { useLanguage } from "../../context/LanguageContext";
import { useSound } from "../../context/SoundContext";

/**
 * The first thing you see on your own profile: what you have earned, your
 * learning year, your preferences, and the two ways out.
 *
 * There is no identity card here. The name, picture, email and join date all
 * belong to the editor, and Edit sits in the header beside the name it changes,
 * so repeating any of it here was a card of pure duplication.
 *
 * Sign out is here because this is the account's own page, and because the
 * phone header now hides as the learner scrolls (LT-115).
 */
const AccountPanel = ({ streak, activeDays, achievements, lottieFor, lottieClassFor, onBrowse, onSignOut, onDelete }) => {
  const { t } = useLanguage();
  const { isMuted, toggleMute } = useSound();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Badges live here rather than in a tab of their own: a handful of
          medallions never filled a page, and they belong with the learner. */}
      <Card className="min-w-0 p-5 sm:p-6">
        <BadgesPanel
          achievements={achievements}
          lottieFor={lottieFor}
          lottieClassFor={lottieClassFor}
          onBrowse={onBrowse}
        />
      </Card>

      <Card className="mt-2 min-w-0 p-5 sm:mt-3 sm:p-6">
        <StreakCalendar streak={streak} activeDays={activeDays} />
      </Card>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <Card className="min-w-0 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-ink-hi">{t("profile.preferences")}</h2>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-ink-hi">{t("profile.language")}</span>
            <LanguageSelector />
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-ink-hi">{t("profile.soundEffects")}</span>
            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={!isMuted}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-bold transition-colors ${
                isMuted
                  ? "border-state-danger/30 bg-state-danger/10 text-state-danger"
                  : "border-sky/30 bg-sky/10 text-sky"
              }`}
            >
              <Icon name={isMuted ? "volume-x" : "volume-2"} size={15} />
              {isMuted ? t("profile.soundOff") : t("profile.soundOn")}
            </button>
          </div>
        </Card>

        <Card className="min-w-0 border-state-danger/20 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-ink-hi">{t("profile.leaving")}</h2>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-low">{t("profile.leavingDesc")}</p>

          {/* Full width below 500px, where two buttons side by side leave each
              one too narrow to read comfortably. */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button
              variant="ghost"
              onClick={onSignOut}
              className="w-full justify-center gap-2 font-bold min-[500px]:w-auto"
            >
              <Icon name="logout" size={16} />
              {t("profile.signOut")}
            </Button>
            <Button
              variant="danger"
              onClick={onDelete}
              className="w-full justify-center gap-2 font-bold min-[500px]:w-auto"
            >
              <Icon name="trash-2" size={15} />
              {t("dashboard.deleteProfileBtn")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountPanel;
