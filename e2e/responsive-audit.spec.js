import { expect } from "@playwright/test";
import { test as signedIn, createLearner, enrollLearner, signIn } from "./support/emulator.js";

// LT-110: the sideways-scroll guard (no-horizontal-overflow.spec.js) answers one
// question — is the page wider than the screen. This answers the two the issue
// also asked for and nothing checked:
//
//   * is anything being cut off silently, with no ellipsis to show for it
//   * is any control too small to hit
//
// It also walks the states that guard never sees: a course preview, a
// curriculum, and a quiz in progress, where the layout is different enough to
// break on its own.
//
// Measured once per route and then resized, for the reason the overflow guard
// learned the hard way: reloading for every width made the dev server slow
// enough to fail on timing rather than on layout.

const WIDTHS = [320, 390, 420, 525, 768, 1024, 1350];

/**
 * 24x24 CSS px is WCAG 2.2 Target Size (Minimum), 2.5.8, level AA. The 44px
 * figure people quote is 2.5.5, which is AAA — worth aiming at, not worth
 * failing a build over, and plenty of this app's controls sit at 34-42px.
 */
const MIN_TARGET = 24;

const AUDIT = (minTarget) => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.opacity !== "0";
  };
  // Decoration cannot hide content that matters and cannot be clicked. The
  // ambient orbs are exactly this: wider than the screen, by design, inside a
  // pointer-events-none layer that clips them.
  const decorative = (el) =>
    el.closest('[aria-hidden="true"]') !== null || getComputedStyle(el).pointerEvents === "none";

  const name = (el) =>
    `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}.${String(el.className || "")
      .split(" ")
      .slice(0, 2)
      .join(".")}`;

  const clipped = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || decorative(el)) continue;
    const s = getComputedStyle(el);
    if (s.overflowX !== "hidden" && s.overflowX !== "clip") continue;
    // An ellipsis or a line clamp is a decision to cut; silence is not.
    if (s.textOverflow === "ellipsis") continue;
    if (s.webkitLineClamp && s.webkitLineClamp !== "none") continue;
    if (el.scrollWidth <= el.clientWidth + 1) continue;
    // What is overflowing matters more than what is doing the clipping. Cards
    // all over this app hold a decorative glow pinned past their own corner
    // (-right-8 -top-8) precisely so overflow-hidden can crop it. That is the
    // clip working, not content being lost.
    const box = el.getBoundingClientRect();
    const spilling = [...el.querySelectorAll("*")].filter((child) => {
      const r = child.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.right > box.right + 1 && !decorative(child);
    });
    if (spilling.length) {
      clipped.push(
        `${name(el)} cuts off ${name(spilling[0])} (content ${el.scrollWidth}px in a ${el.clientWidth}px box)`
      );
    }
  }

  const small = [];
  for (const el of document.querySelectorAll('a[href], button, [role="button"], input, select')) {
    if (!visible(el) || decorative(el)) continue;
    // WCAG 2.5.8 exempts a link inline in a sentence: its target is the text,
    // and padding it out would break the paragraph around it.
    if (el.closest("p, li")) continue;
    if (el.tagName === "A" && getComputedStyle(el).display === "inline") continue;
    const r = el.getBoundingClientRect();
    if (r.width < minTarget || r.height < minTarget) {
      small.push(`${name(el)} is ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }

  return { clipped: [...new Set(clipped)], small: [...new Set(small)] };
};

const settled = (page) =>
  page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

const seeded = async (page, testInfo) => {
  const learner = await createLearner(testInfo);
  await enrollLearner(learner.uid, 1, {
    title: "Python for Kids: Build Your First Game!",
    totalModules: 4,
    completedModules: [0, 1],
  });
  await signIn(page, learner);
  return learner;
};

const ROUTES = [
  ["/", "home"],
  ["/courses", "the catalog"],
  ["/course/2", "a course preview"],
  ["/course/1?tab=syllabus", "a curriculum"],
  ["/quiz", "the quiz list"],
  ["/quiz?quiz=python", "a quiz in progress"],
  ["/leaderboard", "the leaderboard"],
  ["/dashboard", "my profile"],
  ["/contact", "contact"],
  ["/doc", "the docs"],
];

signedIn.describe("nothing is cut off and nothing is too small to hit", () => {
  for (const [path, label] of ROUTES) {
    signedIn(`${label} at every breakpoint`, async ({ page }, testInfo) => {
      await seeded(page, testInfo);

      await page.setViewportSize({ width: WIDTHS[0], height: 900 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

      const clipped = [];
      const small = [];
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await settled(page);
        const res = await page.evaluate(AUDIT, MIN_TARGET);
        for (const item of res.clipped) clipped.push(`${width}px: ${item}`);
        for (const item of res.small) small.push(`${width}px: ${item}`);
      }

      expect(clipped, `${label} cuts content off with nothing to show for it:\n  ${clipped.join("\n  ")}\n`).toEqual([]);
      expect(small, `${label} has controls under ${MIN_TARGET}px:\n  ${small.join("\n  ")}\n`).toEqual([]);
    });
  }
});
