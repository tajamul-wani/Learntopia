import { test, expect } from "@playwright/test";

// Guards the ownership/SEO rework:
//   - The repo moved to the tajamul-wani account, so credit links must point there.
//   - canonical/og/twitter/JSON-LD pointed at learntopia-edu.web.app, which 404s.
//     A canonical aimed at a dead domain actively harms indexing, so this locks the
//     metadata to the domain CI actually deploys (learntopia-react.web.app).
test.describe("brand and SEO metadata", () => {
  test("canonical, og and twitter URLs use the deployed domain", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /learntopia-react\.web\.app/
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      /learntopia-react\.web\.app/
    );
    await expect(page.locator('meta[name="twitter:url"]')).toHaveAttribute(
      "content",
      /learntopia-react\.web\.app/
    );

    // The dead domain must not creep back in anywhere in the head (meta tags or
    // the JSON-LD block).
    const head = await page.locator("head").innerHTML();
    expect(head, "stale learntopia-edu domain is back in the metadata").not.toContain(
      "learntopia-edu"
    );
  });

  // LT-78: the robot mark was replaced by the bulb-and-book logo. Every file the
  // head and the README point at must exist and be the right type, otherwise a
  // browser tab, a home-screen icon or a share preview silently shows nothing.
  test("favicon, logo and share image files are served", async ({ page, request }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute("href", "/favicon.svg");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og-image\.png$/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain("/logo.png");

    const assets = {
      "/favicon.svg": /image\/svg\+xml/,
      "/favicon.png": /image\/png/,
      "/apple-touch-icon.png": /image\/png/,
      "/logo.svg": /image\/svg\+xml/,
      "/logo.png": /image\/png/,
      "/og-image.png": /image\/png/,
    };
    for (const [path, type] of Object.entries(assets)) {
      const res = await request.get(path);
      expect(res.status(), `${path} is missing`).toBe(200);
      expect(res.headers()["content-type"], `${path} has the wrong type`).toMatch(type);
    }
  });

  for (const [label, viewport] of [
    ["desktop", { width: 1280, height: 800 }],
    ["phone", { width: 390, height: 844 }],
  ]) {
    test(`navbar and footer logos render on ${label}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/", { waitUntil: "domcontentloaded" });

      for (const logo of [
        page.locator('header img[src="/logo.svg"]'),
        page.locator('footer img[src="/logo.svg"]'),
      ]) {
        await logo.scrollIntoViewIfNeeded();
        await expect(logo).toBeVisible();
        await expect(logo).toHaveAttribute("alt", "Learntopia");
        // naturalWidth is 0 when the file failed to load or decode.
        await expect.poll(() => logo.evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
        const box = await logo.boundingBox();
        expect(box.width, "logo is too small to read").toBeGreaterThanOrEqual(40);
        expect(box.x + box.width, "logo overflows the viewport").toBeLessThanOrEqual(viewport.width);
      }

      // The footer always shows the "Learntopia" name next to the logo; the
      // navbar drops it on phones to make room for its controls.
      const footerWordmark = page.locator("footer").getByText("Learntopia", { exact: true }).first();
      await expect(footerWordmark).toBeVisible();
      const headerWordmark = page.locator("header").getByText("Learntopia", { exact: true }).first();
      if (label === "phone") await expect(headerWordmark).toBeHidden();
      else await expect(headerWordmark).toBeVisible();
    });
  }

  test("footer credits link to the owner's GitHub account", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // "Built by Tajamul Wani"
    await expect(page.getByRole("link", { name: /tajamul wani/i })).toHaveAttribute(
      "href",
      "https://github.com/tajamul-wani"
    );
    // The GitHub icon link next to it.
    await expect(page.getByRole("link", { name: /^github$/i })).toHaveAttribute(
      "href",
      "https://github.com/tajamul-wani"
    );
  });
});
