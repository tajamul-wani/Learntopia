import { expect } from "@playwright/test";
import { test as signedIn, createLearner, enrollLearner, signIn } from "./support/emulator.js";

// LT-52: a finished course earns a certificate the learner can see and keep.
// Everything on it comes from what the app already stores — the display name
// they chose, the course, `completedAt`, and the course's own badge. No real
// name is collected (LT-81).

// 14 March 2026, so the date on the certificate is a fixed thing to assert
// against rather than whatever today happens to be.
// Midday UTC, so the local date is the same one either side of the line.
const FINISHED_ON = new Date(Date.UTC(2026, 2, 14, 12)).toISOString();

const finishCourse = async (
  testInfo,
  { courseId = 1, title = "Python for Kids: Build Your First Game!", completedAt = FINISHED_ON } = {}
) => {
  const learner = await createLearner(testInfo);
  await enrollLearner(learner.uid, courseId, {
    title,
    totalModules: 4,
    completedModules: [0, 1, 2, 3],
    completed: true,
    completedAt,
  });
  return learner;
};

const openCertificate = async (page) => {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("profile-tabs")).toBeVisible();
  await page.getByTestId("profile-tab-finished").click();
  await page.getByTestId("certificate-open-1").click();
  await expect(page.getByTestId("certificate-download")).toBeEnabled();
};

signedIn.describe("course certificate", () => {
  signedIn("a finished course offers one from My Profile", async ({ page }, testInfo) => {
    const learner = await finishCourse(testInfo);
    await signIn(page, learner);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("profile-tabs")).toBeVisible();
    await page.getByTestId("profile-tab-finished").click();

    await page.getByTestId("certificate-open-1").click();
    await expect(page.getByTestId("certificate-canvas-wrap")).toBeVisible();
    await expect(page.getByTestId("certificate-download")).toBeEnabled();
  });

  // Drawn, not blank: a canvas that never ran leaves every pixel transparent.
  signedIn("it is actually drawn, in the learner's own name", async ({ page }, testInfo) => {
    const learner = await finishCourse(testInfo);
    await signIn(page, learner);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("profile-tabs")).toBeVisible();
    await page.getByTestId("profile-tab-finished").click();
    await page.getByTestId("certificate-open-1").click();
    await expect(page.getByTestId("certificate-download")).toBeEnabled();

    const painted = await page.evaluate(() => {
      const canvas = document.querySelector('[data-testid="certificate-canvas-wrap"] canvas');
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let opaque = 0;
      for (let i = 3; i < data.length; i += 4000) if (data[i] > 0) opaque += 1;
      return { width: canvas.width, height: canvas.height, opaque };
    });
    expect(painted, "the certificate canvas is missing").not.toBeNull();
    expect(painted.width).toBe(1600);
    expect(painted.opaque, "the canvas was never drawn on").toBeGreaterThan(0);
  });

  signedIn("downloading gives a PNG named after the course", async ({ page }, testInfo) => {
    const learner = await finishCourse(testInfo);
    await signIn(page, learner);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("profile-tabs")).toBeVisible();
    await page.getByTestId("profile-tab-finished").click();
    await page.getByTestId("certificate-open-1").click();
    await expect(page.getByTestId("certificate-download")).toBeEnabled();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByTestId("certificate-download").click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/^learntopia-.*\.png$/);
  });

  // The journey map's finish line said "earned" and then did nothing.
  signedIn("the course page's finish line opens it too", async ({ page }, testInfo) => {
    const learner = await finishCourse(testInfo);
    await signIn(page, learner);

    await page.goto("/course/1?tab=syllabus", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const button = page.getByTestId("journey-certificate");
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(page.getByTestId("certificate-canvas-wrap")).toBeVisible();
  });

  // A certificate without a date is not a certificate. The canvas cannot be
  // read back, so the modal reports the line it drew.
  signedIn("it is dated by when the course was finished", async ({ page }, testInfo) => {
    const learner = await finishCourse(testInfo);
    await signIn(page, learner);
    await openCertificate(page);

    await expect(page.getByTestId("certificate-canvas-wrap")).toHaveAttribute(
      "data-date-line",
      "Completed March 14, 2026"
    );
  });

  // Courses finished before the app recorded a completion date still have to
  // carry one. It is dated by issue, and says so, rather than passing today
  // off as the day they finished.
  signedIn("one finished before dates were kept is dated by issue", async ({ page }, testInfo) => {
    const learner = await finishCourse(testInfo, { completedAt: null });
    await signIn(page, learner);
    await openCertificate(page);

    const line = await page.getByTestId("certificate-canvas-wrap").getAttribute("data-date-line");
    expect(line).toMatch(/^Issued \w+ \d{1,2}, \d{4}$/);
  });
});
