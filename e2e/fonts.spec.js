import { test, expect } from "@playwright/test";

// LT-90: Fredoka and Poppins are bundled with the app instead of loaded from
// Google Fonts, so the page never waits on a third-party server to start.
// The shared test base already fails any request that leaves this machine; these
// tests also check the fonts really arrive from our own server and are applied,
// so the design can't silently fall back to a system font.

const loadedFaces = (page) =>
  page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((f) => f.status === "loaded")
      .map((f) => `${f.family.replace(/["']/g, "")} ${f.weight}`);
  });

for (const [label, viewport] of [
  ["desktop", { width: 1280, height: 800 }],
  ["phone", { width: 390, height: 844 }],
]) {
  test(`brand fonts are served by the app and applied on ${label}`, async ({ page }) => {
    await page.setViewportSize(viewport);

    const fontFiles = [];
    page.on("response", (res) => {
      if (/\.woff2?(\?|$)/.test(res.url())) fontFiles.push({ url: res.url(), status: res.status() });
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 20000 });

    // No Google Fonts stylesheet or preconnect left in the page.
    await expect(page.locator('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]')).toHaveCount(0);

    const faces = await loadedFaces(page);
    expect(faces.some((f) => f.startsWith("Poppins")), `Poppins not loaded; loaded faces: ${faces.join(", ")}`).toBe(true);
    expect(faces.some((f) => f.startsWith("Fredoka")), `Fredoka not loaded; loaded faces: ${faces.join(", ")}`).toBe(true);

    // Every font file came from our own server and loaded.
    expect(fontFiles.length, "no font files were downloaded").toBeGreaterThan(0);
    for (const file of fontFiles) {
      expect(new URL(file.url).hostname, `font served from elsewhere: ${file.url}`).toMatch(/^(localhost|127\.0\.0\.1)$/);
      expect(file.status, `font failed to load: ${file.url}`).toBeLessThan(400);
    }

    // Same families as before: `font-display` elements (the logo wordmark, step
    // numbers) use Fredoka; everything else, headings included, uses Poppins.
    const families = await page.evaluate(() => ({
      display: getComputedStyle(document.querySelector(".font-display")).fontFamily,
      heading: getComputedStyle(document.querySelector("h1")).fontFamily,
      body: getComputedStyle(document.body).fontFamily,
    }));
    expect(families.display).toContain("Fredoka");
    expect(families.heading).toContain("Poppins");
    expect(families.body).toContain("Poppins");
  });
}
