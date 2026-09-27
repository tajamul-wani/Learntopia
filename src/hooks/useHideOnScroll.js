import { useEffect, useRef, useState } from "react";

/**
 * useHideOnScroll — true while a sticky header should be out of the way.
 *
 * On a phone the header is about 58px of permanent tax on a small screen, and
 * the bottom bar is already carrying navigation, so the header does not need to
 * hold its place while someone reads (LT-115). It leaves as they scroll down and
 * comes back the moment they scroll up, which is how they reach the top again.
 *
 * Three rules keep it from feeling twitchy:
 *  - near the top it is always shown, so the brand is the first thing on a page;
 *  - a move has to clear `delta` before it counts, so a thumb resting on the
 *    screen does not flicker the header in and out;
 *  - scrolling up always shows it, however far down the page they are.
 *
 * `enabled` is how the caller limits this to the layout that wants it — the
 * desktop header stays put, because there it costs nothing and holds the nav.
 *
 * `resetKey` must change on navigation. Without it the header stays hidden into
 * the next page, and on a page too short to scroll there is then no way to bring
 * it back: the only thing that shows it again is an upward scroll that page
 * cannot perform. Routing resets the scroll position itself, but a reset that is
 * already at zero fires no scroll event, so this cannot wait to be told.
 */
export default function useHideOnScroll({ enabled = true, offset = 80, delta = 8, resetKey } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  // Every navigation starts with the header in place, whatever the last page
  // was left scrolled to.
  useEffect(() => {
    setHidden(false);
    lastY.current = typeof window === "undefined" ? 0 : window.scrollY;
  }, [resetKey]);

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return undefined;
    }

    lastY.current = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const moved = y - lastY.current;

      // Bounce past the end of the document (iOS) reports a scroll that never
      // happened; ignoring small moves covers it without a platform check.
      if (Math.abs(moved) < delta) return;

      if (y <= offset) setHidden(false);
      else setHidden(moved > 0);

      lastY.current = y;
    };

    // The listener fires far more often than the screen repaints, so the work
    // waits for the next frame rather than running per event.
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled, offset, delta]);

  return hidden;
}
