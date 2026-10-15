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
  // Headroom for a slow first paint while several workers pull the dev server's
  // unbundled modules at once. The specs still wait on DOM+mount, not on 'load'.
  //
  // This originally said the headroom was for a WSL /mnt/c mount. The repo
  // moved to WSL-native storage on 2026-09-19, so that reason is gone; the
  // value stays because the dev server, not the disk, is what makes a cold
  // page load slow here.
  timeout: 45 * 1000,
  // Fail CI if a `test.only` was left in the source.
  forbidOnly: !!process.env.CI,
  // Retry flaky tests on CI only.
  retries: process.env.CI ? 2 : 0,
  expect: {
    // Playwright's default is 5s. The suite had outgrown it: 93 assertions
    // carried an explicit timeout and 139 did not, which is what a default
    // that is too low looks like after enough people have patched around it
    // one assertion at a time.
    //
    // The page that kept failing is the clearest case. Reaching
    // `profile-tabs` on /dashboard means loading a lazy chunk, restoring the
    // Firebase Auth session, and three Firestore reads, before anything is
    // painted. That is a legitimate chain, not a stall, and 5s is tight for
    // it on a dev server.
    //
    // The test timeout is 45s, so a genuinely broken assertion still fails
    // with room to spare.
    timeout: 15 * 1000,
  },
  // CI ran the whole suite on one worker, on a runner with four cores, and so
  // paid for a serial run on every pull request. Two is the smallest change
  // that stops that.
  //
  // Not three. Measurements on this machine (14 cores, 174 tests) could not
  // separate two workers from three: 9m34s against 8.4-9.0m, with the same
  // configuration varying by half a minute between runs. The one clean-looking
  // result, 6m10s at three workers, came from a quiet machine and did not
  // reproduce. So there is no evidence that three beats two, and `ubuntu-latest`
  // has four cores to share between the browsers, the dev server and two
  // emulators. Raise it only if CI runs show headroom.
  //
  // Six workers were slower than three, and slower again when the suite was
  // served a prebuilt bundle instead of the dev server, so the ceiling is not
  // the dev server. Whatever limits this suite is per-test cost, not page
  // loads. See LT-120.
  workers: process.env.CI ? 2 : 3,
  // 'list' prints each test live in the terminal; the html report is still
  // generated but NOT auto-served (open:'never'), so the run never blocks the
  // terminal waiting on the report server. View it later with:
  //   npx playwright show-report
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    // Tests can use relative URLs like page.goto('/') against this base.
    baseURL: `http://localhost:${PORT}`,
    // 'on-first-retry' traces the RETRY, and a flaky test passes on retry, so
    // it preserves a recording of everything working. That is why three
    // intermittent failures were seen and none could be diagnosed.
    // 'retain-on-first-failure' records the first attempt and keeps it when
    // that attempt failed, which is the run worth looking at.
    trace: 'retain-on-first-failure',
    // Same reason: the frame at the moment of failure, not after the retry.
    screenshot: 'only-on-failure',
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
    env: {
      VITE_USE_EMULATORS: 'true',
      // A fixed, local tutor endpoint so the AI tutor behaves the same on every
      // machine and in CI, where there is no .env. The specs stub this URL, so
      // no request ever leaves the machine.
      VITE_GEMINI_PROXY_URL: `http://localhost:${PORT}/__tutor-proxy`,
    },
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
