import { test, expect, enrollLearner } from "./support/emulator.js";

// LT-93: the tutor showed raw error text on production ("Set VITE_GEMINI_PROXY_URL
// to the deployed Gemini proxy Worker URL and restart your Vite dev server"),
// because the drawer rendered err.message straight from the service. Learners
// must only ever see a short translated message; the detail belongs in the
// console. The tutor's own request is stubbed here so no test touches the real
// Worker or Gemini.

const COURSE_PATH = "/course/1";
// playwright.config.js points the app's tutor endpoint here, so these stubs
// always apply, locally and in CI, and no request leaves the machine.
const TUTOR_ENDPOINT = "**/__tutor-proxy";
const INTERNALS = /VITE_|import\.meta|Vite dev server|proxy Worker|Gemini proxy|API key/i;

const openTutor = async (page, learner) => {
  // Opening a course page no longer enrols anyone (LT-51), and the tutor lives
  // inside the course, so put the learner in it first.
  await enrollLearner(learner.uid, 1);
  await page.goto(COURSE_PATH, { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
  // The drawer's send button carries the same "Ask Leo" name, so the launcher
  // is addressed by its test id rather than by label.
  await page.getByTestId("tutor-launcher").click();
  await expect(page.getByPlaceholder(/ask a question about this course/i)).toBeVisible();
};

const ask = async (page) => {
  await page.getByPlaceholder(/ask a question about this course/i).fill("What is a variable?");
  await page.getByPlaceholder(/ask a question about this course/i).press("Enter");
};

test.describe("AI tutor", () => {
  test("a failing tutor request shows a friendly message, never internals", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.route(TUTOR_ENDPOINT, (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: '{"error":"upstream"}' })
    );

    await openTutor(page, learner);
    await ask(page);

    const error = page.getByText(/couldn't reach your ai tutor|having a rest/i).first();
    await expect(error).toBeVisible({ timeout: 20000 });
    const shown = await page.locator("body").innerText();
    expect(shown, "the tutor leaked configuration detail to the learner").not.toMatch(INTERNALS);
  });

  test("a successful reply is shown to the learner", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.route(TUTOR_ENDPOINT, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ candidates: [{ content: { parts: [{ text: "A variable is a labelled box." }] } }] }),
      })
    );

    await openTutor(page, learner);
    await ask(page);

    await expect(page.getByText("A variable is a labelled box.")).toBeVisible({ timeout: 20000 });
  });
});
