import { test, expect, enrollLearner } from "./support/emulator.js";

// Taking a quiz, switching to the curriculum and joining a course all replace
// the page without changing the route, so the router's scroll reset never ran
// for them. A learner clicked a button near the bottom of a long list and the
// new screen opened halfway down, or at its end.

// A short viewport, so these pages genuinely scroll and the test has something
// to prove. At desktop height some of them fit without scrolling at all.
const settle = async (page) => {
  await page.setViewportSize({ width: 1280, height: 560 });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
};
const scrollY = (page) => page.evaluate(() => Math.round(document.scrollingElement.scrollTop));

test.describe("a new screen starts at its top", () => {
  test("starting a quiz from the bottom of the list", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize({ width: 1280, height: 560 });
    await page.goto("/quiz", { waitUntil: "domcontentloaded" });
    await settle(page);

    // Click the LAST quiz, which sits well down the page.
    const start = page.getByRole("button", { name: /^start/i }).last();
    await start.scrollIntoViewIfNeeded();
    expect(await scrollY(page), "the list did not scroll, so this proves nothing").toBeGreaterThan(100);

    await start.click();
    await expect(page.getByText(/question\s*1\s*(of|\/)/i).first()).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(250);
    expect(await scrollY(page), "the quiz opened partway down the page").toBeLessThan(20);
  });

  test("switching to the curriculum from the bottom of the overview", async ({ page, learner }) => {
    await enrollLearner(learner.uid, 1);
    await page.setViewportSize({ width: 1280, height: 560 });
    await page.goto("/course/1", { waitUntil: "domcontentloaded" });
    await settle(page);
    // Wait for the enrolment to resolve before scrolling: it flips the page from
    // preview to course, which legitimately resets the scroll on its own.
    await expect(page.getByRole("button", { name: /course curriculum/i })).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(400);

    await page.evaluate(() => document.scrollingElement.scrollTo(0, 99999));
    await page.waitForTimeout(250);
    expect(await scrollY(page), "the overview did not scroll").toBeGreaterThan(100);

    await page.getByRole("button", { name: /course curriculum/i }).click();
    await expect(page.getByRole("heading", { name: /course modules/i })).toBeVisible();
    await page.waitForTimeout(250);
    expect(await scrollY(page), "the curriculum opened partway down").toBeLessThan(20);
  });

  test("joining a course from the join button at the foot of the preview", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize({ width: 1280, height: 560 });
    await page.goto("/course/2", { waitUntil: "domcontentloaded" });
    await settle(page);

    await page.evaluate(() => document.scrollingElement.scrollTo(0, 99999));
    await page.waitForTimeout(250);
    await page.getByRole("button", { name: /start this course/i }).click();

    await expect(page.getByTestId("course-doorway")).toBeHidden({ timeout: 20000 });
    await expect(page.getByRole("button", { name: /course curriculum/i })).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(250);
    expect(await scrollY(page), "the course opened partway down").toBeLessThan(20);
  });
});
