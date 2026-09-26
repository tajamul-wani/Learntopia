import { useEffect, useState } from "react";
import Icon from "./ui/Icon";
import ImageWithSkeleton from "./ui/ImageWithSkeleton";
import { courseTint } from "../utils/courseTint";
import { useLanguage } from "../context/LanguageContext";
import { useSound } from "../context/SoundContext";
import { TUTOR_NAME } from "../config/tutor";

/**
 * The doorway between the preview and the course.
 *
 * Joining used to be a spinner inside a button: the page simply became a
 * different page and nothing told a learner they had crossed into the course.
 *
 * The important rule here is that the doorway closes when the COURSE is ready,
 * never on a timer of its own. A fixed-length animation meant a learner watched
 * it finish, got dropped back onto a spinning button, and only then landed in
 * the course. So the last beat is held until `ready`, and the first two beats
 * set a floor so a fast join does not flash past.
 *
 * Props:
 *  - course  the course being entered
 *  - ready   true once the enrolment has landed and the course can be shown
 *  - onDone  called when the doorway should close
 */

const BEATS = ["joining", "unlocking", "ready"];
const BEAT_MS = 550;
// How long "Leo is ready" is held before handing over, so the last beat is seen.
const HANDOVER_MS = 360;
// A join that never resolves must not trap anyone behind a full-screen overlay.
const MAX_WAIT_MS = 12000;

const CourseEnterOverlay = ({ course, ready = false, onDone }) => {
  const { t } = useLanguage();
  const { playCourseEnter } = useSound();
  // How far the timed beats have got. The final beat is not one of these — it
  // belongs to `ready`, because claiming the course is open while it is still
  // being written would be the same lie the old spinner told.
  const [tick, setTick] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  // Read once during the first render, not in an effect: with reduced motion no
  // timer ever fires, so a ref set in an effect would never reach the renderer
  // and the doorway would hang.
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    // Once, as the doorway opens. The mute toggle is respected inside playSound,
    // so nothing here has to check it.
    playCourseEnter();
    const timers = [setTimeout(() => setGaveUp(true), MAX_WAIT_MS)];
    if (!reduced) {
      BEATS.slice(0, -1).forEach((_, i) => timers.push(setTimeout(() => setTick(i), i * BEAT_MS)));
    }
    return () => timers.forEach(clearTimeout);
    // playCourseEnter is stable from the provider; the sound must fire once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const beatsDone = reduced || tick >= BEATS.length - 2;
  const done = (ready && beatsDone) || gaveUp;

  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(onDone, reduced ? 0 : HANDOVER_MS);
    return () => clearTimeout(t);
  }, [done, onDone, reduced]);

  // Hold on the last honest beat while the write is still in flight.
  const beat = done ? BEATS.length - 1 : Math.min(tick, BEATS.length - 2);
  // The bar stops short of full until the course is genuinely there, so it
  // never sits at 100% while a learner is still waiting.
  const pct = done ? 100 : 55 + beat * 20;

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-ground/95 px-6 backdrop-blur-md animate-fade-in"
      role="status"
      aria-live="polite"
      data-testid="course-doorway"
    >
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto grid h-28 w-28 place-items-center">
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-tutor-ping rounded-full border border-sky/50"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-tutor-ping rounded-full border border-violet-500/40"
            style={{ animationDelay: "1.4s" }}
          />
          {/* The course being entered, not the tutor: this moment is about the
              course, and every course looks different here. */}
          <span
            className={`grid h-24 w-24 animate-tutor-breathe place-items-center rounded-3xl border border-white/[0.06] p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.45)] ${courseTint(course)}`}
          >
            <ImageWithSkeleton
              src={course?.image}
              alt=""
              imgClassName="max-h-full w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
          </span>
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-[0.14em] text-sky">
          {t(`courseEnter.${BEATS[beat]}`, { name: TUTOR_NAME })}
        </p>
        <h2 className="mt-2.5 text-xl/snug font-extrabold text-ink-hi sm:text-2xl/snug">
          {course?.title}
        </h2>

        <div className="mx-auto mt-6 h-1.5 w-56 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-violet-500 to-sky transition-[width] duration-500 ease-out ${
              done ? "" : "animate-pulse"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-ink-low">
          <Icon name="zap" size={15} className="text-violet-400" />
          {t("courseEnter.footer")}
        </p>
      </div>
    </div>
  );
};

export default CourseEnterOverlay;
