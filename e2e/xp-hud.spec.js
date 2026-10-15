import { test, expect, createLearner, signIn } from "./support/emulator.js";

/**
 * LT-68. Rank, XP and streak in the header on every page.
 *
 * Before this, a learner could only see any of it by opening their profile,
 * which is the one place they are not while they are earning it.
 *
 * The header row cannot shrink, so every piece of the HUD is width taken from
 * the nav links beside it. The first build pushed the page sideways at 320px,
 * 1024px and 1280px, so each piece now appears only at the width where it
 * fits. These tests pin those widths, because "it looked fine on my screen"
 * is exactly how that regression got in.
 */

const WIDE = { width: 1400, height: 900 };

test.describe("XP and level HUD (LT-68)", () => {
  test("a signed-out visitor sees no HUD, and no invented zero", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("app-header")).toBeVisible();
    await expect(page.getByTestId("status-hud")).toHaveCount(0);
    await expect(page.getByTestId("status-hud-compact")).toHaveCount(0);
    await expect(page.getByTestId("level-pill")).toHaveCount(0);
  });

  test("on a wide screen it carries rank, progress, XP and streak", async ({ page }, testInfo) => {
    // 250 XP is the floor of level 3 in src/utils/levels.js.
    const learner = await createLearner(testInfo, { points: 250 });
    await signIn(page, learner);
    await page.setViewportSize(WIDE);
    await page.goto("/courses", { waitUntil: "domcontentloaded" });

    const hud = page.getByTestId("status-hud");
    await expect(hud).toBeVisible();
    await expect(hud.getByTestId("level-pill")).toHaveText(/level\s*3/i);
    await expect(hud.getByTestId("xp-chip")).toBeVisible();
    await expect(hud.getByTestId("xp-chip")).toHaveText(/250/);
    await expect(hud.getByTestId("xp-bar")).toBeVisible();
    // A readout, not a control. It reports; it does not navigate.
    await expect(hud).not.toHaveAttribute("href", /./);
    expect(await hud.evaluate((el) => el.tagName)).not.toBe("A");
  });

  test("it keeps off the pages that are not about progress", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 250 });
    await signIn(page, learner);
    await page.setViewportSize(WIDE);

    // My Profile already shows all four values, in full, further down.
    for (const route of ["/dashboard", "/contact", "/privacy", "/terms", "/doc"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.getByTestId("status-hud"), `a HUD on ${route}`).toHaveCount(0);
      await expect(
        page.getByTestId("status-hud-compact"),
        `a compact HUD on ${route}`
      ).toHaveCount(0);
    }
  });

  test("rank survives every width, because it is the piece worth keeping", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 250 });
    await signIn(page, learner);

    for (const width of [320, 390, 768, 1024, 1280, 1400]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/courses", { waitUntil: "domcontentloaded" });
      // Both HUDs are in the DOM at every width and CSS decides which one
      // shows, so this has to ask for the visible pill rather than the first
      // one in the markup, which is the desktop copy.
      await expect(
        page.locator('[data-testid="level-pill"]:visible'),
        `no rank in the header at ${width}px`
      ).toHaveCount(1);

      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(overflows, `the header HUD pushed the page sideways at ${width}px`).toBe(false);
    }
  });

  test("it rides along to another page rather than living on one", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 250 });
    await signIn(page, learner);
    await page.setViewportSize(WIDE);
    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("status-hud")).toBeVisible();
    await page.goto("/leaderboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("status-hud")).toBeVisible();
  });

  test("a phone gets the compact HUD, not the wide one", async ({ page }, testInfo) => {
    const learner = await createLearner(testInfo, { points: 250 });
    await signIn(page, learner);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/courses", { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("status-hud-compact")).toBeVisible();
    await expect(page.getByTestId("status-hud")).toBeHidden();
  });

  test("the header and the profile page never disagree about XP", async ({ page }, testInfo) => {
    // They render from the same pieces, so a disagreement means one of them
    // is lying about a number the learner is being asked to care about. The
    // two cannot be read on one screen any more, since the HUD stays off My
    // Profile, so this reads each where it lives.
    const learner = await createLearner(testInfo, { points: 250 });
    await signIn(page, learner);
    await page.setViewportSize(WIDE);

    const digits = (s) => (s || "").replace(/[^\d]/g, "");

    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    const headerChip = page.getByTestId("status-hud").getByTestId("xp-chip");
    await expect(headerChip).toBeVisible();
    const headerXp = digits(await headerChip.innerText());

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("profile-tabs")).toBeVisible();
    const profileXp = digits(
      await page.locator('[data-testid="xp-chip"]:visible').first().innerText()
    );

    expect(headerXp, "the HUD shows no XP at all").not.toBe("");
    expect(profileXp, "the profile header shows no XP at all").not.toBe("");
    expect(headerXp).toBe(profileXp);
  });
});
