import { test as base, expect } from "@playwright/test";

// Every spec imports `test` from here, not from @playwright/test.
//
// The suite must never depend on the internet. A third-party request that hangs
// (Google Fonts did, on and off) stalls the page and fails an unrelated test
// after the 45s timeout, differently on every run. So any request to a host
// other than this machine is blocked straight away, and the test fails with the
// exact URL, which makes a new outside dependency obvious the moment it appears.
// The app itself runs against the local dev server and the Firebase emulators.

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

const isExternal = (url) => /^https?:$/.test(url.protocol) && !LOCAL_HOSTS.has(url.hostname);

export const test = base.extend({
  // Runs for every test without being named in it. The callback is `provide`,
  // not Playwright's usual `use`, so the React hooks lint rule doesn't mistake
  // it for React's use() hook.
  externalRequests: [
    async ({ context }, provide) => {
      const blocked = [];
      await context.route(isExternal, (route) => {
        blocked.push(route.request().url());
        return route.abort("blockedbyclient");
      });
      await provide(blocked);
      expect(
        blocked,
        "The app tried to reach the internet during a test. Serve it locally or stub it:\n  " +
          blocked.join("\n  ")
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
