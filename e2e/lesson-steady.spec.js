import { expect } from "@playwright/test";
import { test as signedIn, createLearner, enrollLearner, signIn } from "./support/emulator.js";

// Three things about a module's steps, all reported from use:
//
//   * the card must stay put. Moving to the next step used to shift the whole
//     page under the learner's eye.
//   * it must not pad itself out. An earlier fix held the card at the tallest
//     step so far, which kept it steady and left a short step sitting above
//     half a screen of empty card.
//   * the controls under it must stay on one line, down to a small phone.
//
// What holds those together: the card's TOP is anchored and only its bottom
// moves with the content, so the thing being read never shifts.

const openFirstModule = async (page) => {
  await page.goto("/course/1?tab=syllabus", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
  const firstModule = page.getByRole("button", { name: /Module 1/i }).first();
  if (await firstModule.count()) await firstModule.click();
  await expect(page.getByTestId("lesson-card")).toBeVisible({ timeout: 20000 });
};

const seeded = async (page, testInfo) => {
  const learner = await createLearner(testInfo);
  await enrollLearner(learner.uid, 1, {
    title: "Python for Kids: Build Your First Game!",
    totalModules: 4,
    completedModules: [],
  });
  await signIn(page, learner);
};

signedIn("the step card stays put and does not pad itself out", async ({ page }, testInfo) => {
  await seeded(page, testInfo);
  await page.setViewportSize({ width: 1280, height: 900 });
  await openFirstModule(page);

  const card = page.getByTestId("lesson-card");
  const next = page.getByRole("button", { name: /next step|next$/i }).first();

  const tops = [];
  const slack = [];
  for (let i = 0; i < 4; i += 1) {
    await expect(next).toBeEnabled({ timeout: 10000 });
    tops.push(await card.evaluate((el) => Math.round(el.getBoundingClientRect().top)));
    // The gap between the last line of the step and the bottom of the card.
    // p-6/md:p-8 is 32px, so anything much past that is the card standing
    // taller than it has anything to show.
    slack.push(
      await card.evaluate((el) => {
        const body = el.lastElementChild.getBoundingClientRect();
        return Math.round(el.getBoundingClientRect().bottom - body.bottom);
      })
    );
    // dispatchEvent, not click: a real click scrolls the button into view
    // first, and that harness scroll would read as the app moving the page.
    // The only scrolling left here is the app's own.
    await next.dispatchEvent("click");
    await page.waitForTimeout(500);
  }

  for (let i = 1; i < tops.length; i += 1) {
    expect(
      Math.abs(tops[i] - tops[i - 1]),
      `the card moved between steps: ${tops.join(" -> ")}`
    ).toBeLessThanOrEqual(4);
  }

  for (const [i, gap] of slack.entries()) {
    expect(gap, `step ${i + 1} leaves ${gap}px of empty card below its content`).toBeLessThanOrEqual(56);
  }
});

for (const width of [320, 390, 525, 599]) {
  signedIn(`the step controls stay on one line at ${width}px`, async ({ page }, testInfo) => {
    await seeded(page, testInfo);
    await page.setViewportSize({ width, height: 900 });
    await openFirstModule(page);

    const back = page.getByRole("button", { name: /^back$/i }).first();
    await expect(back).toBeVisible();

    const { row, button } = await back.evaluate((el) => ({
      row: Math.round(el.parentElement.getBoundingClientRect().height),
      button: Math.round(el.getBoundingClientRect().height),
    }));

    // A wrapped label makes the button, and so the row, about twice as tall.
    expect(row, `the controls wrapped at ${width}px: row ${row}px against a ${button}px button`).toBeLessThanOrEqual(
      button + 8
    );
  });
}
