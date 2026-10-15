import { useEffect, useRef, useState } from "react";

/**
 * Counts from the previous value to the new one when it changes.
 *
 * XP is the one number in the app a learner is actually watching, and a
 * number that snaps from 250 to 275 reads as a redraw rather than as a
 * reward. Nothing moves until the value changes, so this never animates on
 * a page the learner has only just opened.
 *
 * The first real value is NOT animated. A profile arrives asynchronously, so
 * the value goes 0 -> 250 on every page load, and animating that would count
 * the learner's total up from zero each time they opened a page, as though
 * they had just earned all of it. It also made the header briefly disagree
 * with the profile page, which an end-to-end test caught as a flake.
 *
 * A reader who has asked for less motion gets the new value immediately.
 */
export default function useCountUp(value, duration = 600) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const primed = useRef(false);

  useEffect(() => {
    const target = Number(value) || 0;
    const start = Number(from.current) || 0;
    from.current = target;

    if (start === target) {
      setShown(target);
      return undefined;
    }

    // Arriving, not earning: show it and start watching from here.
    if (!primed.current) {
      primed.current = true;
      setShown(target);
      return undefined;
    }

    const quiet =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (quiet) {
      setShown(target);
      return undefined;
    }

    let frame = 0;
    const began = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - began) / duration);
      // Ease out, so it arrives rather than stops.
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(start + (target - start) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return shown;
}
