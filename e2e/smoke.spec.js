import { test, expect } from './support/test.js';

// First end-to-end smoke test — no login needed.
// It proves three things at once: the app boots, the correct page is served,
// and the React UI actually mounts (not just static HTML).
test.describe('home page', () => {
  test('loads and renders the app', async ({ page }) => {
    // baseURL (from playwright.config.js) + '/'  ->  http://localhost:5174/
    // domcontentloaded (not the default 'load') so a slow image/font can't stall
    // the test — the assertions below auto-wait for React to actually render.
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // The right page was served.
    await expect(page).toHaveTitle(/Learntopia/i);

    // The hero <h1> is rendered by React, so seeing it proves the app mounted
    // and ran — not just that a blank HTML shell loaded. We don't assert exact
    // text so the test survives copy/translation changes.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
