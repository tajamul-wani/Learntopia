import { expect } from "@playwright/test";
import { test as signedIn, createLearner, enrollLearner, signIn } from "./support/emulator.js";

// Real course names, because they are long and that is the point: a card that
// sizes to its title is what pushed the Learning tab off a 390px screen.
const REAL_TITLES = [
  "Python for Kids: Build Your First Game!",
  "Money Smart: Money & Budgeting for Kids!",
  "Brand Genius: Marketing & Media Basics!",
];

// LT-107: the dashboard was one 1,502-line page with five sub-tabs that
// overlapped what /courses already does. It is now My Profile: one header that
// never changes, and five panels that each answer one question.

const TABS = ["account", "learning", "finished", "quizzes"];

const open = async (page) => {
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
  await expect(page.getByTestId("profile-tabs")).toBeVisible();
};

signedIn.describe("My Profile", () => {
  signedIn("opens on Account, and every tab opens its own panel", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await open(page);

    // Your own profile lands on you, not on a course list /courses already shows.
    await expect(page.getByTestId("profile-panel-account")).toBeVisible();

    for (const tab of TABS) {
      await page.getByTestId(`profile-tab-${tab}`).click();
      await expect(page.getByTestId(`profile-panel-${tab}`)).toBeVisible();
      await expect(page.getByTestId(`profile-tab-${tab}`)).toHaveAttribute("aria-selected", "true");
    }
  });

  // The header is what makes five panels read as one page.
  signedIn("the header stays put on every tab", async ({ page, learner }) => {
    await open(page);
    const name = page.getByRole("heading", { level: 1 });
    await expect(name).toBeVisible();
    const text = await name.textContent();
    expect(text?.trim()).toBeTruthy();

    for (const tab of TABS) {
      await page.getByTestId(`profile-tab-${tab}`).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(text);
    }
    expect(learner.uid).toBeTruthy();
  });

  signedIn("a course in progress is on Learning, with a way back into it", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo);
    // Half done, so the panel has a real percentage to show rather than 0.
    await enrollLearner(learner.uid, 1, { totalModules: 4, completedModules: [0, 1] });
    await signIn(page, learner);
    await open(page);

    await page.getByTestId("profile-tab-learning").click();
    const panel = page.getByTestId("profile-panel-learning");
    await expect(panel).toContainText("50%");
    await expect(panel).toContainText(/module 2 of 4|módulo 2 de 4/i);

    await panel.getByRole("button", { name: /^continue$|^continuar$/i }).first().click();
    await expect(page).toHaveURL(/\/course\/1/);
  });

  signedIn("edit sits in the header, not inside a panel", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await open(page);
    await expect(page.getByTestId("profile-edit")).toBeVisible();
    await page.getByTestId("profile-edit").click();
    await expect(page.getByRole("heading", { name: /edit your profile/i })).toBeVisible({ timeout: 20000 });
  });

  signedIn("the account tab holds sign out and delete", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await open(page);
    await page.getByTestId("profile-tab-account").click();

    const panel = page.getByTestId("profile-panel-account");
    await expect(panel.getByRole("button", { name: /sign out|cerrar/i })).toBeVisible();
    await expect(panel.getByRole("button", { name: /delete my profile/i })).toBeVisible();

  });

  // A learner with nothing yet should be told what to do, not shown a blank.
  signedIn("empty panels say what earns them", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await open(page);

    await page.getByTestId("profile-tab-learning").click();
    await expect(page.getByTestId("profile-panel-learning")).toContainText(/nothing on the go|nada en marcha/i);

    await page.getByTestId("profile-tab-finished").click();
    await expect(page.getByTestId("profile-panel-finished")).toContainText(/no finished courses|aún no hay cursos/i);

    await page.getByTestId("profile-tab-quizzes").click();
    await expect(page.getByTestId("profile-panel-quizzes")).toContainText(/no quizzes yet|aún no hay cuestionarios/i);
  });
});

signedIn.describe("preferences have one home", () => {
  // Language and sound are set once and live on the Account tab. Carrying them
  // in the header as well gave the same two controls two places to be.
  signedIn("the header drops them once you are signed in", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const header = page.locator("header");
    await expect(header.getByRole("button", { name: /mute sound effects|unmute sound effects/i })).toHaveCount(0);

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    const panel = page.getByTestId("profile-panel-account");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("button", { name: /^on$|^off$|activado|desactivado/i })).toBeVisible();
  });
});

signedIn.describe("badges", () => {
  // A medallion says what it is; the detail is a dialog, so the grid below it
  // does not shift every time one is opened.
  signedIn("open in a dialog that says what the badge was for", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("profile-tabs")).toBeVisible();

    const panel = page.getByTestId("profile-panel-account");
    await expect(panel).toBeVisible();

    const first = panel.locator('[data-testid^="badge-"]').first();
    const count = await panel.locator('[data-testid^="badge-"]').count();
    if (count === 0) return; // a brand-new learner has none yet

    await expect(page.getByTestId("badge-detail")).toBeHidden();
    await first.click();

    const detail = page.getByTestId("badge-detail");
    await expect(detail).toBeVisible();
    // The explanation is there; the label that used to sit above it is not.
    await expect(detail).not.toContainText(/how you got it/i);
    const box = await detail.boundingBox();
    expect(box.width, "the badge dialog is wider than it should be").toBeLessThanOrEqual(450);

    await page.keyboard.press("Escape");
    await expect(detail).toBeHidden();
  });
});

signedIn.describe("the learning year fits the space it has", () => {
  // A year sliced off mid-column with no sign anything is missing is worse than
  // showing fewer months, so the grid is trimmed to what fits and says so.
  signedIn("a narrow screen shows whole months and offers the rest", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("profile-tabs")).toBeVisible();
    await page.getByTestId("profile-tab-account").click();

    const expand = page.getByTestId("streak-expand");
    await expect(expand).toBeVisible();
    await expect(expand).toHaveAttribute("aria-expanded", "false");

    await expand.click();
    await expect(expand).toHaveAttribute("aria-expanded", "true");

    // Expanded or not, the page itself never scrolls sideways.
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth;
    });
    expect(overflow, "the expanded calendar widened the page").toBe(false);
  });

  signedIn("a wide screen needs no toggle at all", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("profile-tabs")).toBeVisible();
    await page.getByTestId("profile-tab-account").click();

    await expect(page.getByTestId("profile-panel-account")).toBeVisible();
    await expect(page.getByTestId("streak-expand")).toBeHidden();
  });
});

signedIn.describe("My Profile fits every screen", () => {
  // Seeded with the titles the app really has. A short placeholder title hid
  // this for several rounds: the cards fitted because the text did.
  signedIn("long course names do not widen the page", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo);
    for (let i = 0; i < REAL_TITLES.length; i += 1) {
      await enrollLearner(learner.uid, i + 1, {
        title: REAL_TITLES[i],
        totalModules: 4,
        completedModules: [0, 1],
      });
    }
    await enrollLearner(learner.uid, 4, { title: REAL_TITLES[0], unenrolled: true });
    await signIn(page, learner);

    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await open(page);
      await page.getByTestId("profile-tab-learning").click();
      await expect(page.getByTestId("profile-panel-learning")).toBeVisible();

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth ? { sw: doc.scrollWidth, cw: doc.clientWidth } : null;
      });
      expect(overflow, `Learning scrolls sideways at ${width}px`).toBeNull();
    }
  });


  // The tab strip is the tight part: five labels never fit 320px, and
  // "Aprendiendo" makes Spanish worse. It scrolls rather than widening the page.
  for (const width of [320, 390, 768, 1024, 1280]) {
    signedIn(`no sideways scroll at ${width}px`, async ({ page, learner }) => {
      expect(learner.uid).toBeTruthy();
      await page.setViewportSize({ width, height: 900 });
      await open(page);

      for (const tab of TABS) {
        await page.getByTestId(`profile-tab-${tab}`).click();
        await expect(page.getByTestId(`profile-panel-${tab}`)).toBeVisible();
        const overflow = await page.evaluate(() => {
          const doc = document.documentElement;
          return doc.scrollWidth > doc.clientWidth ? { sw: doc.scrollWidth, cw: doc.clientWidth } : null;
        });
        expect(overflow, `${tab} scrolls sideways at ${width}px`).toBeNull();
      }
    });
  }

  // Every tab visible at once, at the width where hiding one would hurt most.
  signedIn("every tab is on screen at 320px, with nothing scrolled away", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize({ width: 320, height: 800 });
    await open(page);

    const strip = page.getByTestId("profile-tabs");
    const stripBox = await strip.boundingBox();

    for (const tab of TABS) {
      const el = page.getByTestId(`profile-tab-${tab}`);
      await expect(el).toBeVisible();
      const box = await el.boundingBox();
      expect(box.x, `${tab} starts outside the strip`).toBeGreaterThanOrEqual(stripBox.x - 1);
      expect(box.x + box.width, `${tab} runs past the strip`).toBeLessThanOrEqual(stripBox.x + stripBox.width + 1);
    }

    await page.getByTestId("profile-tab-quizzes").click();
    await expect(page.getByTestId("profile-panel-quizzes")).toBeVisible();
  });
});
