import { expect } from "@playwright/test";
import { test as signedIn } from "./support/emulator.js";
import { test } from "./support/test.js";

// LT-115: the top bar and the bottom bar were both full navigations with no
// stated job. The account actions now live in one menu, the phone header steps
// out of the way while a learner reads, and Leaderboard stays a destination in
// its own right rather than being filed under the profile.
//
// The signed-in tests must ask for the `learner` fixture by name. It is lazy:
// destructuring only `page` leaves the browser signed out, and every assertion
// about the account menu then fails against a header that never rendered it.

const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 390, height: 844 };

// Scrolling a page that has not finished growing is scrolling nothing: the
// browser clamps to whatever height exists at that instant, the header never
// passes its threshold, and the test reports a bug that is not there. Wait for
// real room to scroll before asking anything to move.
const scrollable = (page) =>
  expect
    .poll(
      () => page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight),
      { timeout: 20000, message: "the page never grew tall enough to scroll" }
    )
    .toBeGreaterThan(600);

signedIn.describe("the account menu is the one home for account actions", () => {
  signedIn("opens on click, and holds My Profile and Sign Out", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(DESKTOP);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const button = page.getByTestId("account-menu-button");
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("account-menu")).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByTestId("account-menu").getByRole("menuitem")).toHaveCount(2);
  });

  signedIn("My Profile goes to the learner's own page", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(DESKTOP);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("account-menu-button").click();
    await page.getByTestId("account-menu").getByRole("menuitem").first().click();

    await expect(page).toHaveURL(/\/dashboard/);
  });

  // A hover-only menu cannot be reached this way at all, which is why the menu
  // is driven from the keyboard first and hover is only an addition.
  signedIn("opens from the keyboard and closes on Escape", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(DESKTOP);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const button = page.getByTestId("account-menu-button");
    await button.focus();
    await page.keyboard.press("ArrowDown");

    const menu = page.getByTestId("account-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem").first()).toBeFocused();

    await page.keyboard.press("ArrowDown");
    await expect(menu.getByRole("menuitem").nth(1)).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
  });

  signedIn("closes when a click lands outside it", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(DESKTOP);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("account-menu-button").click();
    await expect(page.getByTestId("account-menu")).toBeVisible();

    await page.locator("main").click({ position: { x: 20, y: 20 } });
    await expect(page.getByTestId("account-menu")).toBeHidden();
  });

  // The profile pill and a Sign Out button side by side is what made this row
  // too wide between 1024 and 1280 (LT-108).
  signedIn("the header carries no second account control", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(DESKTOP);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("header").getByRole("button", { name: /sign out/i })).toHaveCount(0);
  });
});

signedIn.describe("on a phone the account opens from the bottom bar", () => {
  signedIn("the header offers no sign out, because it hides as you read", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(PHONE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("header").getByRole("button", { name: /sign out/i })).toHaveCount(0);
    await expect(page.getByTestId("account-menu-button")).toBeHidden();
  });

  signedIn("the profile tab raises the same two choices the desktop menu holds", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(PHONE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const tab = page.getByTestId("account-tab");
    await expect(tab).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByTestId("account-sheet")).toBeHidden();

    await tab.click();
    await expect(page.getByTestId("account-sheet")).toBeVisible();
    await expect(page.getByTestId("account-sheet").getByRole("menuitem")).toHaveCount(2);
  });

  signedIn("choosing the profile goes to the page", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(PHONE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("account-tab").click();
    await page.getByTestId("account-sheet").getByRole("menuitem").first().click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId("account-sheet")).toBeHidden();
  });

  signedIn("sign out is in the sheet, not the header", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(PHONE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("account-tab").click();
    await expect(
      page.getByTestId("account-sheet").getByRole("menuitem", { name: /sign out|cerrar/i })
    ).toBeVisible();
  });

  // A two-item menu stretched across a tablet reads as a page, not a menu.
  signedIn("it stays a menu on a tablet instead of spanning the width", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("account-tab").click();
    const sheet = page.getByTestId("account-sheet");
    await expect(sheet).toBeVisible();

    const box = await sheet.boundingBox();
    expect(box.width, "the account sheet spans the viewport").toBeLessThanOrEqual(400);
    // Held under the tab that raised it, at the right-hand end of the bar.
    expect(box.x + box.width).toBeGreaterThan(900 - 60);
  });

  signedIn("Escape closes it without going anywhere", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(PHONE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("account-tab").click();
    await expect(page.getByTestId("account-sheet")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("account-sheet")).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
  });

  // The sheet is a detour: the other tabs stay reachable underneath it rather
  // than being swallowed by a backdrop.
  signedIn("the rest of the bar still works while it is open", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(PHONE);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByTestId("account-tab").click();
    await page.getByTestId("bottom-nav").getByRole("link", { name: /courses|cursos/i }).click();
    await expect(page).toHaveURL(/\/courses/);
    // And it does not follow them there. Asserting only the navigation let a
    // sheet that stayed raised over the next page pass as working.
    await expect(page.getByTestId("account-sheet")).toBeHidden();
  });
});

test.describe("the phone header steps out of the way", () => {
  test("it leaves on the way down and returns on the way up", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/doc", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await scrollable(page);

    const header = page.getByTestId("app-header");
    await expect(header).toHaveAttribute("data-hidden", "false");

    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(header).toHaveAttribute("data-hidden", "true");

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(header).toHaveAttribute("data-hidden", "false");

    // Back at the top it is always shown, whatever the last direction was.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute("data-hidden", "false");
  });

  // Hiding the header is only safe if every navigation brings it back. Left
  // hidden into a page too short to scroll, the one gesture that shows it again
  // is one that page cannot perform, and the header is simply gone.
  test("a new page always starts with the header in place", async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto("/doc", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await scrollable(page);

    const header = page.getByTestId("app-header");
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(header).toHaveAttribute("data-hidden", "true");

    // A short page: nothing here can be scrolled up.
    await page.getByTestId("bottom-nav").getByRole("link").first().click();
    await expect(header).toHaveAttribute("data-hidden", "false");
    await expect(header).toBeInViewport();
  });

  test("the desktop header holds its place, because it holds the nav", async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto("/doc", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });
    await scrollable(page);

    const header = page.getByTestId("app-header");
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(header).toHaveAttribute("data-hidden", "false");
    await expect(header).toBeInViewport();
  });
});

signedIn.describe("Leaderboard stays a destination, not a menu entry", () => {
  signedIn("it is in the desktop row and in the bottom bar", async ({ page, learner }) => {
    expect(learner.uid).toBeTruthy();
    await page.setViewportSize(DESKTOP);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.locator("header").getByRole("link", { name: /leaderboard|clasificaci/i })
    ).toBeVisible();

    await page.setViewportSize(PHONE);
    await expect(
      page.getByTestId("bottom-nav").getByRole("link", { name: /leaderboard|clasificaci/i })
    ).toBeVisible();
  });
});
