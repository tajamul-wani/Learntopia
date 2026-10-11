/**
 * One pointer position, shared by everything on the home page that reacts
 * to it, and one place that decides whether anything should move at all.
 *
 * Three canvases follow the cursor on that page. Each binding its own
 * listener would mean three handlers firing on every mouse move for the
 * same two numbers, so they read these instead.
 *
 * Values are 0..1 across the viewport, defaulting to a little above centre
 * so a page that is never touched still looks composed rather than
 * pinned to a corner.
 */
export const pointer = { x: 0.5, y: 0.4 };

let listening = false;

/** True when the reader has asked for less motion, re-read on every call. */
export const reducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True for a mouse or trackpad. A finger has no hover to follow. */
export const finePointer = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(pointer: fine)").matches;

/**
 * Starts tracking, once per page. Safe to call from every component that
 * wants the pointer; the second and later calls do nothing.
 */
export function trackPointer() {
  if (listening || typeof window === "undefined") return;
  if (reducedMotion() || !finePointer()) return;
  listening = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    },
    { passive: true }
  );
}

/**
 * Runs `draw` on every frame, but only while `el` is on screen and the tab
 * is visible, and not at all for a reader who asked for less motion — they
 * get the single frame `draw` paints when this is set up.
 *
 * Returns a teardown for the effect that called it.
 */
export function animateWhileVisible(el, draw) {
  draw(typeof performance !== "undefined" ? performance.now() : 0);
  if (!el || reducedMotion()) return () => {};

  let frame = 0;
  let onScreen = false;

  const tick = (now) => {
    draw(now);
    frame = onScreen && !document.hidden ? requestAnimationFrame(tick) : 0;
  };
  const set = (next) => {
    onScreen = next;
    if (onScreen && !document.hidden && !frame) frame = requestAnimationFrame(tick);
    if ((!onScreen || document.hidden) && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const onVisibility = () => set(onScreen);
  document.addEventListener("visibilitychange", onVisibility);

  let observer = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver((entries) => set(entries[0].isIntersecting), {
      threshold: 0.01,
    });
    observer.observe(el);
  } else {
    set(true);
  }

  return () => {
    if (observer) observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    if (frame) cancelAnimationFrame(frame);
  };
}

/**
 * Sizes a canvas to its host in device pixels and returns the context
 * already scaled, so everything after this draws in CSS pixels.
 */
export function fitCanvas(canvas, host) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const box = host.getBoundingClientRect();
  const width = Math.max(1, box.width);
  const height = Math.max(1, box.height);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { width, height, ctx };
}
