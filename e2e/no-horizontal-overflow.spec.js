import { test, expect } from "./support/test.js";
import { test as signedIn } from "./support/emulator.js";

// LT-108: every page scrolled sideways at exactly 768px, on every route, and
// had done for some time. It was found by accident while measuring something
// else — nothing in the suite looked for it.
//
// 768px is Tailwind's md breakpoint. The desktop navbar switched on there but
// needs about 900px, so between those widths it was rendered in a space too
// small for it. The switch moved to lg; this stops the class of bug returning,
// whatever causes it next time.

// Every public route. /doc holds a wide table and /thank-you a large decorative
// circle, so both are exactly the kind of page this is meant to watch.
const ROUTES = [
  "/", "/courses", "/quiz", "/leaderboard", "/contact",
  "/login", "/signUp", "/doc", "/terms", "/privacy", "/thank-you",
];

// Either side of every breakpoint the app actually uses, including the three
// custom screens in tailwind.config.js (420, 525, 1350).
const WIDTHS = [320, 359, 360, 375, 390, 419, 421, 524, 526, 640, 767, 768, 900, 1023, 1024, 1280, 1440];

// Waiting for the skeleton to disappear is not enough: it hides before the lazy
// route has painted, so a measurement taken then sees an empty page and passes
// whatever the route actually does. /thank-you passed locally for exactly that
// reason while CI, landing a few milliseconds later, caught a real overflow.
const settle = async (page) => {
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
  await expect
    .poll(() => page.evaluate(() => (document.querySelector("main")?.innerText || "").trim().length), {
      timeout: 20000,
      message: "the route never painted any content",
    })
    .toBeGreaterThan(20);
};

test.describe("no page scrolls sideways", () => {
  for (const path of ROUTES) {
    test(`${path} at every width`, async ({ page }) => {
      const offenders = [];

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await settle(page);

        const result = await page.evaluate(() => {
          const doc = document.documentElement;
          if (doc.scrollWidth <= doc.clientWidth) return null;
          // The overall number says something is wrong; the per-element pass
          // says WHAT, which is how the navbar was identified.
          // An element inside an ancestor that clips cannot widen the page, and
          // the decorative orbs sit in exactly such a wrapper on every route.
          // Reporting them buried the real cause under three false names.
          // The walk stops at body on purpose: body carries overflow-x: hidden
          // globally, and the root's overflow propagates to the viewport, which
          // is the thing scrollWidth measures. Treating body as a clipper marks
          // every element clipped and reports no cause at all.
          const isClipped = (el) => {
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
              const o = getComputedStyle(p);
              if (o.overflowX !== "visible" || o.overflowY !== "visible") return true;
            }
            return false;
          };
          const widest = [];
          for (const el of document.querySelectorAll("body *")) {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (r.right > doc.clientWidth + 1 && !isClipped(el)) {
              widest.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 2).join(".")} (right ${Math.round(r.right)})`);
            }
          }
          return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, widest: widest.slice(0, 3) };
        });

        if (result) {
          offenders.push(
            `${width}px: scrollWidth ${result.scrollWidth} > ${result.clientWidth} — ${result.widest.join(", ")}`
          );
        }
      }

      expect(offenders, `${path} scrolls sideways:\n  ${offenders.join("\n  ")}\n`).toEqual([]);
    });
  }
});

// The other half of the fix: the phone layout now holds until the desktop nav
// actually fits, so a tablet keeps the bottom bar instead of being handed a
// navbar too wide for it.
test.describe("navigation switches where it fits", () => {
  const bottomBar = (page) => page.getByTestId("bottom-nav");

  for (const width of [390, 768, 900, 1023]) {
    test(`the bottom bar is present at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await settle(page);
      await expect(bottomBar(page)).toBeVisible();
    });
  }

  for (const width of [1024, 1440]) {
    test(`the bottom bar is gone at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await settle(page);
      await expect(bottomBar(page)).toBeHidden();
    });
  }
});

// Signed in, the navbar carries an avatar-and-name pill and a Sign Out button
// where a visitor sees Sign In and Sign Up — roughly 110px wider. The first
// version of this guard ran signed out only and passed at 1024 while a
// signed-in learner's Sign Out button hung off the edge, which the owner found
// by eye. A guard that only covers the narrower case is not a guard.
signedIn.describe("no page scrolls sideways, signed in", () => {
  for (const path of ["/", "/courses", "/leaderboard", "/dashboard"]) {
    signedIn(`${path} at every width`, async ({ page, learner }) => {
      expect(learner.uid).toBeTruthy();
      const offenders = [];

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path, { waitUntil: "domcontentloaded" });
        await settle(page);

        const result = await page.evaluate(() => {
          const doc = document.documentElement;
          if (doc.scrollWidth <= doc.clientWidth) return null;
          return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
        });
        if (result) offenders.push(`${width}px: scrollWidth ${result.scrollWidth} > ${result.clientWidth}`);
      }

      expect(offenders, `${path} scrolls sideways when signed in:\n  ${offenders.join("\n  ")}\n`).toEqual([]);
    });
  }
});
