import { test, expect } from "./support/test.js";

// LT-109: the home page is the first thing anyone sees, and it used to be the
// least gamified page in a gamified product — and the last place carrying
// invented numbers (2,000 learners, a 4.8 rating, 6 courses when there were 9).
//
// These run signed out, which is who the page is for.
//
// The point of most of this file is that the page cannot claim something the
// content does not support. It does not recompute the figures: `contentFacts`
// cannot be imported here, because it reaches course images through Vite and
// Playwright's loader chokes on a PNG. That counting is already proven by
// src/utils/contentFacts.test.js. What this proves is the other half — that
// the counted figures reach the screen, agree with each other, and that
// nothing invented came back.

const WIDTHS = [320, 390, 430, 620, 768, 1024, 1280, 1600];
const RING_FROM = 570; // below this the ring becomes a travelling row

const open = async (page) => {
  /* App Check fetches reCAPTCHA from google.com when VITE_RECAPTCHA_SITE_KEY
     is set. That is the app's own behaviour, not this page's, and it predates
     this work — these tests only notice it because they dwell long enough for
     it to fire. Stub it so the no-internet guard still means what it says
     about anything new. */
  await page.route(/recaptcha/, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
};

test.describe("the home page states only what the content supports", () => {
  test("all eight figures are real counts, not placeholders", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page);

    const ring = page.getByTestId("content-ring");
    await ring.scrollIntoViewIfNeeded();

    const shown = await ring.evaluate((el) =>
      [...el.querySelectorAll("b")].map((b) => b.textContent.trim())
    );
    expect(shown).toHaveLength(8);
    for (const value of shown) {
      expect(value, `"${value}" is not a plain number`).toMatch(/^\d{1,3}(,\d{3})*$/);
      // A zero would mean the counting broke and the page printed it anyway.
      expect(Number(value.replace(/,/g, "")), `${value} counted zero`).toBeGreaterThan(0);
    }

    // Every course has modules, and every module has lessons, so these can
    // only ever grow in this order. A count that breaks it is a count that
    // stopped being counted.
    const [courses, modules, lessons] = shown.map((v) => Number(v.replace(/,/g, "")));
    expect(modules).toBeGreaterThanOrEqual(courses);
    expect(lessons).toBeGreaterThanOrEqual(modules);
  });

  test("the hero and the ring quote the same numbers", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page);

    const ring = page.getByTestId("content-ring");
    await ring.scrollIntoViewIfNeeded();
    const figures = await ring.evaluate((el) =>
      [...el.querySelectorAll("b")].map((b) => b.textContent.trim())
    );
    const courses = figures[0];
    const xp = figures[5];

    // Two places on one page disagreeing about the catalogue is exactly the
    // drift this issue was raised about.
    const hero = page.locator("section").first();
    await expect(hero).toContainText(courses);
    await expect(hero).toContainText(xp);
  });

  // The four invented avatars, the 4.8 and the "Loved by 2,000+" line were the
  // whole reason this issue exists. A regression here is the page lying again.
  test("nothing invented survives anywhere on the page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page);
    const text = await page.locator("main").innerText();

    expect(text).not.toMatch(/loved by/i);
    expect(text).not.toMatch(/\b2,?000\+/);
    expect(text).not.toMatch(/\b4\.8\b/);
    expect(text).not.toMatch(/happy .*parent/i);
    // A star rating has no feature behind it, so it cannot be honest.
    expect(text).not.toMatch(/\b[0-5]\.\d\s*(\/\s*5|stars?)\b/i);
  });
});

test.describe("the question in the hero", () => {
  test("a right answer pays XP and a wrong one does not", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page);

    await expect(page.getByTestId("try-xp")).toContainText("0");

    // Option B is the right answer to the first Python question.
    await page.getByTestId("try-option-1").click();
    await expect(page.getByTestId("try-verdict")).toBeVisible();
    await expect(page.getByTestId("try-xp")).toContainText("10");
  });

  test("a wrong answer still shows the right one, and pays nothing", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page);

    await page.getByTestId("try-option-0").click();
    await expect(page.getByTestId("try-verdict")).toBeVisible();
    await expect(page.getByTestId("try-xp")).toContainText("0");

    // Every option is settled once answered: no second guess, and the correct
    // one is marked whichever was picked.
    for (const i of [0, 1, 2, 3]) {
      await expect(page.getByTestId(`try-option-${i}`)).toBeDisabled();
    }
  });
});

test.describe("the counted figures at every width", () => {
  test("exactly one of the ring and the row is ever on screen", async ({ page }) => {
    await open(page);
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      const ring = await page.getByTestId("content-ring").boundingBox();
      const row = await page.getByTestId("content-slider").boundingBox();
      const ringUp = !!ring;
      const rowUp = !!row;
      expect(
        ringUp !== rowUp,
        `at ${width}px: ring ${ringUp}, row ${rowUp} — one and only one should show`
      ).toBe(true);
      expect(width >= RING_FROM ? ringUp : rowUp, `wrong one at ${width}px`).toBe(true);
    }
  });

  // The ring is laid out in script, so it is the one thing here that can put a
  // number outside its own panel. It did: an unbounded perspective scale threw
  // every label clean out of the card whenever the cursor flattened the tilt.
  test("no figure escapes its panel, at any cursor position", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await open(page);
    const ring = page.getByTestId("content-ring");
    await ring.scrollIntoViewIfNeeded();

    let worst = -Infinity;
    for (const [fx, fy] of [[0.5, 0.5], [0.02, 0.02], [0.98, 0.98], [0.02, 0.98], [0.98, 0.02]]) {
      await page.mouse.move(Math.round(1280 * fx), Math.round(900 * fy));
      for (let i = 0; i < 6; i += 1) {
        await page.waitForTimeout(120);
        const out = await ring.evaluate((host) => {
          const panel = host.closest("div.relative").getBoundingClientRect();
          let escape = -Infinity;
          for (const node of host.querySelectorAll(":scope > div")) {
            const b = node.getBoundingClientRect();
            escape = Math.max(
              escape,
              panel.left - b.left,
              b.right - panel.right,
              panel.top - b.top,
              b.bottom - panel.bottom
            );
          }
          return escape;
        });
        worst = Math.max(worst, out);
      }
    }
    expect(Math.round(worst), "a figure left the panel").toBeLessThanOrEqual(0);
  });

  test("the page never scrolls sideways", async ({ page }) => {
    await open(page);
    const offenders = [];
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(250);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      if (over > 0) offenders.push(`${width}px by ${over}px`);
    }
    expect(offenders, `the page is wider than the screen at:\n  ${offenders.join("\n  ")}\n`).toEqual([]);
  });
});

test.describe("motion", () => {
  /* Read the track's own transform, not where it lands on screen. A bounding
     rect also moves when the page reflows around it, which made this assert
     motion that was really a scrollbar. */
  const shift = (row) =>
    row.evaluate((el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el.firstElementChild).transform);
      return m.m41;
    });

  test("the row of figures travels on its own", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await open(page);
    const row = page.getByTestId("content-slider");
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const before = await shift(row);
    await page.waitForTimeout(1500);
    const after = await shift(row);

    expect(before - after, "the row is not moving").toBeGreaterThan(5);
  });

  // index.css drops animation under this query, and the canvases check it
  // themselves. A page that ignores it is the accessibility bug, not a
  // missing flourish.
  test.describe("with reduced motion asked for", () => {
    test("nothing moves, and every figure is still there", async ({ page }) => {
      // emulateMedia on the page, not test.use: the context option did not
      // reach this suite, and the test then asserted against a page that had
      // never been told.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width: 390, height: 900 });
      await open(page);

      expect(
        await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
        "the browser was not actually asked for reduced motion"
      ).toBe(true);
      const row = page.getByTestId("content-slider");
      await row.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      const before = await shift(row);
      await page.waitForTimeout(1200);
      expect(Math.abs((await shift(row)) - before), "the row moved despite reduced motion").toBeLessThan(1);

      // Reduced motion must cost nothing in content: all eight figures are
      // still rendered, just still.
      const figures = await row.evaluate((el) => el.querySelectorAll("b").length);
      expect(figures).toBeGreaterThanOrEqual(8);
    });
  });
});
