// The sticky header sits over the top of the page, so "the top of this" is a
// little below the element's own top edge.
const HEADER_CLEARANCE = 72;

/**
 * Bring the top of `node` into view.
 *
 * Used after something changes the page under the learner — a module panel
 * closing, challenge results appearing, a long step opening. Without it the
 * content grows or shrinks around wherever they happen to be sitting and the
 * page appears to slide on its own; with it there is one deliberate move to a
 * place that makes sense.
 *
 * By default it only acts when the node has actually gone above the header,
 * because scrolling a learner who is already looking at the right thing is the
 * annoyance, not the cure. `force` is for the cases where the layout changed
 * so much that where they were no longer means anything.
 */
export function revealTop(node, { force = false } = {}) {
  if (!node || typeof window === "undefined") return;
  const { top } = node.getBoundingClientRect();
  if (!force && top >= HEADER_CLEARANCE) return;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  window.scrollTo({
    top: Math.max(0, top + window.scrollY - HEADER_CLEARANCE),
    behavior: reduced ? "auto" : "smooth",
  });
}

/**
 * The same, once React has painted the change that prompted it. Reading a
 * position in the handler that caused the change measures the old layout.
 */
export function revealTopAfterPaint(getNode, options) {
  requestAnimationFrame(() => requestAnimationFrame(() => revealTop(getNode(), options)));
}
