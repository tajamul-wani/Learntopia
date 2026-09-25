import { test, expect, writeDoc, readDoc, docExists } from "./support/emulator.js";

// LT-51 PR1: browse, preview, then join on purpose.
//
// Opening a course page used to enrol whoever was signed in, and a learner who
// had left a course could still reach its lessons through the URL. Both are
// covered here, because both were silent.

const COURSE_ID = "1";

test.describe("course enrollment flow", () => {
  test("opening a course does not enrol anyone", async ({ page, learner }) => {
    await page.goto(`/course/${COURSE_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    // The preview, not the lessons.
    await expect(page.getByRole("button", { name: /start this course/i })).toBeVisible();

    // Nothing was written just because the page was looked at.
    await page.waitForTimeout(1500);
    expect(
      await docExists(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`),
      "looking at a course enrolled the learner"
    ).toBe(false);
  });

  test("joining is one explicit action and opens the lessons", async ({ page, learner }) => {
    await page.goto(`/course/${COURSE_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.getByRole("button", { name: /start this course/i }).click();

    await expect
      .poll(async () => docExists(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`), { timeout: 20000 })
      .toBe(true);

    const enrolment = await readDoc(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`);
    expect(enrolment.completedModules).toEqual([]);
    expect(enrolment.unenrolled).toBe(false);

    // And the preview is replaced by the course itself.
    await expect(page.getByRole("button", { name: /start this course/i })).toBeHidden({ timeout: 20000 });
  });

  // Joining used to be a spinner inside a button — the page just became a
  // different page. Crossing into a course should look like crossing into one.
  test("joining shows the way in, then lands on the course", async ({ page, learner }) => {
    await page.goto(`/course/${COURSE_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.getByRole("button", { name: /start this course/i }).click();

    // The doorway names the course being entered, so it can never be mistaken
    // for a generic loading screen.
    const doorway = page.getByTestId("course-doorway");
    await expect(doorway).toBeVisible({ timeout: 10000 });
    await expect(doorway).toContainText(/Python for Kids/i);

    // It clears itself — nothing here waits on a click.
    await expect(doorway).toBeHidden({ timeout: 15000 });

    // The regression this guards: the doorway used to run on its own timer, so
    // it closed while the enrolment was still being written and dropped the
    // learner back onto a spinning button for a few seconds. It now waits for
    // the course, so the course must already be there the instant it closes —
    // hence a tight timeout here, not a generous one.
    await expect(
      page.getByRole("button", { name: /course curriculum/i }),
      "the doorway closed before the course was ready"
    ).toBeVisible({ timeout: 1000 });
    await expect(
      page.getByRole("button", { name: /start this course/i }),
      "the learner was sent back to the preview after the animation"
    ).toBeHidden();

    expect(
      await docExists(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`),
      "the animation played but the learner was never enrolled"
    ).toBe(true);
  });

  // The other silent bug: leaving a course closed it on the dashboard but the
  // URL still taught you.
  test("a learner who left sees the preview, not the lessons", async ({ page, learner }) => {
    await writeDoc(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`, {
      courseId: 1,
      title: "Python for Kids",
      category: "Programming",
      completed: false,
      completedModules: [0],
      totalModules: 4,
      unenrolled: true,
    });

    await page.goto(`/course/${COURSE_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    await expect(
      page.getByRole("button", { name: /pick up where you left off/i }),
      "a learner who left was let straight back into the lessons"
    ).toBeVisible({ timeout: 20000 });

    // Their progress is still theirs — leaving never deleted it.
    const enrolment = await readDoc(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`);
    expect(enrolment.completedModules).toEqual([0]);
  });

  test("rejoining keeps the progress that was there", async ({ page, learner }) => {
    await writeDoc(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`, {
      courseId: 1,
      title: "Python for Kids",
      category: "Programming",
      completed: false,
      completedModules: [0, 1],
      totalModules: 4,
      unenrolled: true,
    });

    await page.goto(`/course/${COURSE_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await page.getByRole("button", { name: /pick up where you left off/i }).click();

    await expect
      .poll(async () => (await readDoc(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`))?.unenrolled, {
        timeout: 20000,
      })
      .toBe(false);

    const enrolment = await readDoc(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`);
    expect(enrolment.completedModules, "rejoining wiped the learner's progress").toEqual([0, 1]);
  });

  test("the catalog sends a learner to the course instead of enrolling them", async ({ page, learner }) => {
    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    await page.getByRole("button", { name: /view course/i }).first().click();
    await expect(page).toHaveURL(/\/course\/\d+/, { timeout: 20000 });
    await expect(page.getByRole("button", { name: /start this course/i })).toBeVisible();

    const enrolments = await docExists(`Users/${learner.uid}/enrolledCourses/${COURSE_ID}`);
    expect(enrolments, "the catalog enrolled the learner on a click").toBe(false);
  });

  test("the preview fits a phone screen", async ({ page, learner }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/course/${COURSE_ID}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const cta = page.getByRole("button", { name: /start this course/i });
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box.x, "the join button starts off-screen").toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, "the join button is cut off").toBeLessThanOrEqual(390);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "the preview pushed the page sideways").toBeLessThanOrEqual(0);
    expect(learner.uid).toBeTruthy();
  });
});
