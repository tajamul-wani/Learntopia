import { test, expect } from "./support/test.js";

// LT-125: course card meta and buttons on mobile screens (<420px).
//
// Below 420px, squeezing the card metadata ("4 modules · 200 XP") and the
// action button ("View course") onto a single row causes the XP count to
// truncate mid-number and the button text to wrap. The footer stacks vertically
// on narrow screens so metadata remains full-width and the action button sits
// cleanly underneath.

test.describe("course card layout on mobile", () => {
  test("card footer stacks below 420px to prevent meta truncation and button wrap", async ({ page }) => {
    // 375px is standard iPhone SE width (< 420px breakpoint)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const firstCard = page.locator("main").locator(".group").first();
    await expect(firstCard).toBeVisible();

    // Verify metadata text is fully visible (contains "XP")
    const xpSpan = firstCard.locator("span", { hasText: /\d+\s*XP/ }).first();
    await expect(xpSpan).toBeVisible();

    // Verify meta element is not clipped/truncated (scrollWidth <= clientWidth)
    const isTruncated = await xpSpan.evaluate((el) => {
      const container = el.closest(".truncate") || el;
      return container.scrollWidth > container.clientWidth;
    });
    expect(isTruncated, "course card XP meta was truncated on mobile").toBe(false);

    // Verify the action button sits vertically stacked below the metadata
    const button = firstCard.getByRole("button", { name: /view course|continue learning|rejoin|restart/i }).first();
    await expect(button).toBeVisible();

    const metaBox = await xpSpan.boundingBox();
    const buttonBox = await button.boundingBox();
    expect(metaBox).toBeTruthy();
    expect(buttonBox).toBeTruthy();

    // Stacking assertion: button top is below metadata bottom
    expect(
      buttonBox.y,
      "action button should be stacked vertically below the card metadata on narrow screens"
    ).toBeGreaterThanOrEqual(metaBox.y + metaBox.height - 2);

    // Button text should not wrap into a tall, multi-line button
    // Single-line button with py-2 text-xs sits under 42px in height
    expect(buttonBox.height, "action button text wrapped onto multiple lines").toBeLessThanOrEqual(44);
  });

  test("card footer stays side-by-side on desktop (>=420px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/courses", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const firstCard = page.locator("main").locator(".group").first();
    await expect(firstCard).toBeVisible();

    const xpSpan = firstCard.locator("span", { hasText: /\d+\s*XP/ }).first();
    const button = firstCard.getByRole("button", { name: /view course|continue learning|rejoin|restart/i }).first();

    const metaBox = await xpSpan.boundingBox();
    const buttonBox = await button.boundingBox();
    expect(metaBox).toBeTruthy();
    expect(buttonBox).toBeTruthy();

    // On wider screens, button and metadata sit side-by-side in the footer
    expect(
      Math.abs(buttonBox.y - metaBox.y),
      "button and metadata should sit side-by-side on screens >= 420px"
    ).toBeLessThan(35);
  });
});
