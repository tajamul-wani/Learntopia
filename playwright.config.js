// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Learntopia end-to-end tests.
 * @see https://playwright.dev/docs/test-configuration
 *
 * The app under test talks to the local Firebase Auth + Firestore emulators, not
 * to production: no credentials are needed and no real data is read or written.
 * Start everything with `npm run test:e2e` (see TESTING.md).
 */

// Its own port, so a normal `npm run dev` (which talks to real Firebase) is never
// reused for tests by accident.
const PORT = 5174;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.js',
  fullyParallel: true,
  // Headroom for slow first paints when the dev server runs from a WSL /mnt/c
  // mount under parallel load. The specs still wait on DOM+mount, not on 'load'.
  timeout: 45 * 1000,
  // Fail CI if a `test.only` was left in the source.
  forbidOnly: !!process.env.CI,
  // Retry flaky tests on CI only.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // 'list' prints each test live in the terminal; the html report is still
  // generated but NOT auto-served (open:'never'), so the run never blocks the
  // terminal waiting on the report server. View it later with:
  //   npx playwright show-report
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // Tests can use relative URLs like page.goto('/') against this base.
    baseURL: `http://localhost:${PORT}`,
    // Capture a debug trace when a test is retried.
    trace: 'on-first-retry',
  },

  // Start with Chromium only — fast and simple. Firefox/WebKit can be added later.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Boot the Vite dev server in emulator mode before tests (or reuse one already
  // running on the test port locally). On CI it always starts a fresh server.
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    env: { VITE_USE_EMULATORS: 'true' },
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
