import { test, expect, enrollLearner } from "./support/emulator.js";

// LT-51 PR2: the tutor is a chat widget, not a panel.
//
// It used to live in a card in the overview sidebar, so it existed on one tab
// only and took a third of the page to say one thing. It is now a launcher in
// the corner of every tab, which is where a learner looks for help.

const COURSE_PATH = "/course/1";

const settle = async (page) => {
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
};

test.describe("tutor launcher", () => {
  test("introduces itself once, then opens the chat", async ({ page, learner }) => {
    await enrollLearner(learner.uid, 1);
    await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
    await settle(page);

    // The bubble types itself in after a beat, so its text arrives late and
    // grows — waiting on the final sentence proves it finished typing rather
    // than rendering all at once.
    const teaser = page.getByTestId("tutor-teaser");
    await expect(teaser).toBeVisible({ timeout: 10000 });
    await expect(teaser).toContainText("Just ask me.", { timeout: 10000 });

    const launcher = page.getByTestId("tutor-launcher");
    await expect(launcher).toBeVisible();
    await launcher.click();
    await expect(page.getByPlaceholder(/ask a question about this course/i)).toBeVisible();
  });

  test("the launcher is on the curriculum tab too, where the card never was", async ({ page, learner }) => {
    await enrollLearner(learner.uid, 1);
    await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
    await settle(page);

    await page.getByRole("button", { name: /course curriculum/i }).click();
    await expect(page.getByRole("heading", { name: /course modules/i })).toBeVisible();

    await expect(page.getByTestId("tutor-launcher")).toBeVisible();
  });

  test("dismissing the bubble keeps it dismissed on the next course view", async ({ page, learner }) => {
    await enrollLearner(learner.uid, 1);
    await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
    await settle(page);

    const teaser = page.getByTestId("tutor-teaser");
    await expect(teaser).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: /hide this message/i }).click();
    await expect(teaser).toBeHidden();

    // Same tab, so the dismissal is remembered — the bot must not re-introduce
    // itself every time a learner comes back to the course.
    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await settle(page);
    await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
    await settle(page);

    await expect(page.getByTestId("tutor-launcher")).toBeVisible();
    await page.waitForTimeout(2500);
    await expect(teaser, "the bot introduced itself again after being dismissed").toBeHidden();
  });

  test("the launcher does not sit under the mobile bottom bar", async ({ page, learner }) => {
    await page.setViewportSize({ width: 390, height: 780 });
    await enrollLearner(learner.uid, 1);
    await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
    await settle(page);

    const launcher = page.getByTestId("tutor-launcher");
    await expect(launcher).toBeVisible();

    const bar = page.getByTestId("bottom-nav");
    const [button, nav] = [await launcher.boundingBox(), await bar.boundingBox()];
    expect(button, "the launcher has no box").toBeTruthy();
    expect(nav, "the bottom bar has no box").toBeTruthy();
    expect(
      button.y + button.height,
      "the launcher overlaps the mobile bottom bar"
    ).toBeLessThanOrEqual(nav.y + 1);
    expect(button.x + button.width, "the launcher hangs off the screen").toBeLessThanOrEqual(390);

    // The attention rings expand past the button, so they are the thing most
    // likely to push a phone into sideways scroll.
    const scrolls = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(scrolls, "the launcher animation made the page scroll sideways").toBe(false);
  });
});
