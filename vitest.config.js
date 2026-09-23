import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Unit and component tests. Everything that can be answered without a browser
// or a database lives here; flows a person performs live in e2e/ (Playwright),
// and what the database will accept lives in test/firestore.rules.test.js,
// which still runs on node --test inside the emulator.
export default defineConfig({
  plugins: [react()],
  test: {
    // node by default: most of what belongs here is plain logic, and jsdom
    // breaks filesystem tests (import.meta.url stops being a file:// URL).
    // A component test opts in with `// @vitest-environment jsdom` on its
    // first line.
    environment: "node",
    globals: true,
    setupFiles: ["./test/setup.js"],
    // The rules suite is deliberately excluded: it needs the Firestore
    // emulator and is run by npm run test:rules:ci.
    include: ["test/**/*.test.js", "src/**/*.test.{js,jsx}"],
    exclude: ["test/firestore.rules.test.js", "node_modules/**", "e2e/**"],
  },
});
