import { test, expect, writeDoc } from "./support/emulator.js";

// LT-51 PR2: a learner's finished and abandoned courses get their own tabs.
//
// They used to sit in the catalog wearing badges, so the list a learner browsed
// was mixed up with the list they had already dealt with. The tabs are history,
// so they only exist for a signed-in learner who actually has one.

const enrolment = (courseId, extra) => ({
  courseId: Number(courseId),
  title: `Course ${courseId}`,
  category: "Programming",
  completed: false,
  completedModules: [],
  totalModules: 4,
  unenrolled: false,
  ...extra,
});

test.describe("course tabs", () => {
  test("a learner's finished and left courses each get their own tab", async ({ page, learner }) => {
    await writeDoc(`Users/${learner.uid}/enrolledCourses/1`, enrolment(1, { completed: true, completedModules: [0, 1, 2, 3] }));
    await writeDoc(`Users/${learner.uid}/enrolledCourses/2`, enrolment(2, { unenrolled: true, completedModules: [0] }));
    await writeDoc(`Users/${learner.uid}/enrolledCourses/3`, enrolment(3));

    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const tablist = page.getByRole("tablist", { name: /your courses/i });
    await expect(tablist).toBeVisible({ timeout: 20000 });

    // The catalog tab carries its own count, so compare the cards against that
    // rather than a number typed in here. Adding a course cannot break it, and
    // it also catches the tab and the grid disagreeing.
    const cards = page.locator("main").getByRole("heading", { level: 3 });
    const allTab = tablist.getByRole("tab", { name: /all courses/i });
    const total = Number((await allTab.innerText()).match(/\d+/)[0]);
    expect(total, "the catalog tab shows no count").toBeGreaterThan(0);
    await expect.poll(async () => cards.count(), { timeout: 10000 }).toBe(total);

    // Completed holds only the finished one.
    await tablist.getByRole("tab", { name: /completed/i }).click();
    await expect.poll(async () => cards.count()).toBe(1);
    await expect(page.getByRole("button", { name: /start again/i })).toBeVisible();

    // Paused holds only the one they left, and offers the way back.
    await tablist.getByRole("tab", { name: /paused/i }).click();
    await expect.poll(async () => cards.count()).toBe(1);
    await expect(page.getByRole("button", { name: /^rejoin$/i })).toBeVisible();

    // And back to the full catalog.
    await allTab.click();
    await expect.poll(async () => cards.count()).toBe(total);
  });

  test("a learner with no history sees no tabs", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    await expect(page.locator("main").getByRole("heading", { level: 3 }).first()).toBeVisible();
    await expect(
      page.getByRole("tablist", { name: /your courses/i }),
      "tabs were shown to a learner with nothing in them"
    ).toBeHidden();
  });
});
