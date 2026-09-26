import { useEffect, useRef } from "react";

/**
 * Put the viewport back at the top of the page.
 *
 * The router already does this on a route change (see layout/RootLayout.jsx),
 * but several of the biggest moments in this app are NOT route changes: taking
 * a quiz, switching to the curriculum and joining a course all swap what the
 * page renders while the URL stays put. Without this the learner keeps the
 * scroll position of the thing they just clicked, which is usually near the
 * bottom of a long list, and the new screen opens halfway down or at its end.
 *
 * "instant" is deliberate: the stylesheet sets scroll-behavior: smooth, and
 * animating the jump means the new screen visibly slides past on the way.
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

/**
 * Scroll to the top whenever `value` changes, skipping the first render so a
 * page that mounts already scrolled somewhere on purpose is left alone.
 */
export function useScrollToTopOn(value) {
  const previous = useRef(value);
  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    scrollToTop();
  }, [value]);
}
