import { test, expect, enrollLearner } from "./support/emulator.js";

// LT-51 PR2: every number a course shows is counted from the course.
//
// The catalog, the home page and the course header used to carry a 4.9 rating,
// "1,200 students" and four stock photographs of strangers. None of it was
// measured and none of it could ever become true, so a learner choosing a
// course was choosing on fiction. These specs assert the fiction is gone AND
// that something real took its place — a removal on its own would pass just as
// happily against an empty page.

// A rating as it was rendered: one digit, a point, one digit, standing alone.
// It must not catch a duration — "4.5 hours" is a real, counted fact — so a
// number followed by its unit is excluded.
const RATING = /(?<![\d.])[45]\.\d(?![\d.%])(?!\s*(hours?|hrs?|mins?|minutes?))/i;
// An audience size as it was rendered: "1,200 students" / "840 enrolled".
const AUDIENCE = /[\d,]{3,}\s*(students|enrolled|learners)/i;

const settle = async (page) => {
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
};

test.describe("courses show counted facts, not invented ones", () => {
  test("the catalog drops the rating and stock learners for real course size", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await settle(page);

    // The Python card is the anchor: it carried the loudest invented numbers.
    const card = page.locator("div").filter({ hasText: /Python for Kids/ }).last();
    await expect(card).toBeVisible();

    const catalog = await page.locator("main").innerText();
    expect(catalog, "the catalog still shows an invented rating").not.toMatch(RATING);
    expect(catalog, "the catalog still shows an invented audience size").not.toMatch(AUDIENCE);

    // What replaced them is counted from the syllabus.
    await expect(page.getByText(/\d+ modules/).first()).toBeVisible();
    await expect(page.getByText(/\d+ XP/).first()).toBeVisible();

    // The stock photographs of strangers are gone from the DOM, not just hidden.
    expect(
      await page.locator('img[src*="/one"], img[src*="/two"], img[src*="/three"], img[src*="/four"]').count(),
      "stock learner photos are still being rendered"
    ).toBe(0);
  });

  test("the preview tells a learner what is inside before they commit", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.goto("/course/1", { waitUntil: "domcontentloaded" });
    await settle(page);

    // This is the preview, not the lessons.
    await expect(page.getByRole("button", { name: /start this course/i })).toBeVisible();

    // Counted content, so a learner knows how much reading and how much doing.
    await expect(page.getByText(/\d+ lessons · \d+ things to try/)).toBeVisible();

    // Topics come from the module titles, so they match the outline exactly.
    const topics = page.getByRole("heading", { name: /topics you'll cover/i });
    await expect(topics).toBeVisible();
    await expect(page.getByText("Hello Python!", { exact: true }).first()).toBeVisible();

    // The badge is a real reward and is named.
    await expect(page.getByText(/earn the Python Pioneer badge/i)).toBeVisible();

    // One tutor across the whole platform, named once.
    await expect(page.getByText(/Leo is in every lesson/i)).toBeVisible();

    const preview = await page.locator("main").innerText();
    expect(preview, "the preview still shows an invented rating").not.toMatch(RATING);
    expect(preview, "the preview still shows an invented audience size").not.toMatch(AUDIENCE);
  });

  test("the course header counts lessons and XP instead of students", async ({ page, learner }) => {
    await enrollLearner(learner.uid, 1);
    await page.goto("/course/1", { waitUntil: "domcontentloaded" });
    await settle(page);

    // Inside the course now, so the header is the enrolled one.
    await expect(page.getByRole("button", { name: /course curriculum/i })).toBeVisible();

    // The header carries the same counted facts as the preview, now as a meta
    // line rather than tiles. Modules, not lessons: modules are the unit
    // progress is measured in once enrolled,
    // and the lesson count is a before-you-choose signal that lives on the
    // preview alongside the exercise count.
    await expect(page.getByText(/\d+ XP/).first()).toBeVisible();
    await expect(page.getByText(/\d+ modules/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /what it covers/i })).toBeVisible();

    const header = await page.locator("main").innerText();
    expect(header, "the course header still shows an invented audience size").not.toMatch(AUDIENCE);
  });
});
