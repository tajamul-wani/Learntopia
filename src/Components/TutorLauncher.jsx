import { useEffect, useRef, useState } from "react";
import BotAvatar from "./BotAvatar";
import Icon from "./ui/Icon";
import { useLanguage } from "../context/LanguageContext";
import { useNavChrome } from "../context/NavChromeContext";
import { TUTOR_NAME } from "../config/tutor";

/**
 * TutorLauncher — Leo as a chat widget, not a card.
 *
 * The tutor used to live in a panel in the overview sidebar, which meant it was
 * only reachable from one tab and pushed the course content into a narrow
 * column. Here it sits in the corner of every screen the way a chat widget
 * does: the bot introduces itself once, types its line, and stays as a single
 * button after that.
 *
 * Props:
 *  - onOpen    opens the chat drawer
 *  - courseId  used to remember a dismissal per course, for this tab only
 */

// Long enough to read as typing, short enough not to make anyone wait.
const CHAR_MS = 28;
const APPEAR_MS = 900;

const storageKey = (courseId) => `tutorTeaserSeen:${courseId}`;

const alreadySeen = (courseId) => {
  try {
    return sessionStorage.getItem(storageKey(courseId)) === "1";
  } catch {
    // Private mode and blocked site data both throw here. Showing the bubble
    // again is a far smaller problem than the page failing to render.
    return false;
  }
};

const remember = (courseId) => {
  try {
    sessionStorage.setItem(storageKey(courseId), "1");
  } catch {
    /* nothing to do: the teaser simply shows again next time */
  }
};

const TutorLauncher = ({ onOpen, courseId }) => {
  const { t } = useLanguage();
  // In a module the mobile bottom bar is hidden, so the launcher drops with it
  // rather than floating above an empty strip.
  const { immersive } = useNavChrome();
  const name = TUTOR_NAME;
  const teaser = t("aiTutor.launcherTeaser", { name });

  const [showBubble, setShowBubble] = useState(false);
  const [typed, setTyped] = useState("");
  const timers = useRef([]);

  useEffect(() => {
    if (alreadySeen(courseId)) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clear = () => timers.current.forEach(clearTimeout);

    timers.current.push(
      setTimeout(() => {
        setShowBubble(true);
        if (reduced) {
          setTyped(teaser);
          return;
        }
        // One timer per character rather than an interval, so unmounting
        // mid-sentence cannot leave a tick running against a dead component.
        for (let i = 1; i <= teaser.length; i++) {
          timers.current.push(setTimeout(() => setTyped(teaser.slice(0, i)), i * CHAR_MS));
        }
      }, APPEAR_MS)
    );

    return clear;
  }, [teaser, courseId]);

  const dismiss = (event) => {
    event.stopPropagation();
    setShowBubble(false);
    remember(courseId);
  };

  const open = () => {
    setShowBubble(false);
    remember(courseId);
    onOpen();
  };

  return (
    // Above the mobile bottom nav (z-40) and clear of it; below the drawer
    // (z-60/70) so opening the chat covers the launcher rather than fighting it.
    <div
      className={`fixed right-4 z-50 flex items-center gap-2.5 md:bottom-6 md:right-6 ${
        immersive ? "bottom-[calc(1rem+env(safe-area-inset-bottom))]" : "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]"
      }`}
    >
      {showBubble && (
        <div
          className="flex animate-fade-up items-center gap-2 whitespace-nowrap rounded-2xl rounded-br-md border border-white/10 bg-surface py-2.5 pl-4 pr-2.5 shadow-clay"
          data-testid="tutor-teaser"
        >
          {/* The typed text is decorative duplication for anyone using a screen
              reader — the launcher button beside it already says what this is. */}
          <p aria-hidden="true" className="text-[13px] font-medium leading-none text-ink">
            {typed}
            <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-[3px] animate-pulse bg-sky align-baseline" />
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t("aiTutor.dismissTeaser")}
            className="grid h-5 w-5 flex-none place-items-center rounded-md text-ink-faint transition-colors hover:bg-white/5 hover:text-ink-hi"
          >
            <Icon name="x" size={12} />
          </button>
        </div>
      )}

      {/* The bot has to be noticed without nagging: two slow sonar rings and a
          gentle breath, both dropped by the global reduced-motion rule. */}
      <span className="relative grid h-14 w-14 place-items-center">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-tutor-ping rounded-full border border-sky/50"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-tutor-ping rounded-full border border-sky/35"
          style={{ animationDelay: "1.4s" }}
        />
        <button
          type="button"
          onClick={open}
          aria-label={t("aiTutor.askTutor", { name })}
          data-testid="tutor-launcher"
          className="relative grid h-14 w-14 place-items-center rounded-full border border-sky/30 bg-surface shadow-clay transition-transform duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky active:scale-95"
        >
          <BotAvatar size="sm" className="animate-tutor-breathe" />
          <span className="pointer-events-none absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-ground bg-sky text-ground shadow-clay-sm">
            <Icon name="message-circle" size={10} />
          </span>
        </button>
      </span>
    </div>
  );
};

export default TutorLauncher;
