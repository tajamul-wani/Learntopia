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
