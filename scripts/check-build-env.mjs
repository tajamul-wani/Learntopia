// Fails a CI build when a value the built app needs is missing.
//
// Vite inlines `import.meta.env.VITE_*` at build time. A missing value does not
// break the build: it becomes an empty string, and the feature quietly turns
// itself off in production. That is how the AI tutor shipped disabled, because
// the deploy workflow never wrote VITE_GEMINI_PROXY_URL.
//
// Runs before `vite build`. In CI a missing value fails the build; locally it
// only warns, so a contributor without the full .env can still build and work.

import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const REQUIRED = [
  ["VITE_API_KEY", "Firebase web API key"],
  ["VITE_MESSAGING_SENDER_ID", "Firebase messaging sender id"],
  ["VITE_APP_ID", "Firebase app id"],
  ["VITE_GEMINI_PROXY_URL", "Gemini proxy Worker URL, used by the AI tutor"],
];

const envFile = fileURLToPath(new URL("../.env", import.meta.url));
const fromFile = {};
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (match) fromFile[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

const missing = REQUIRED.filter(([name]) => !(process.env[name] || fromFile[name]));

if (missing.length === 0) {
  console.log(`✓ Build config present (${REQUIRED.length} values checked)`);
} else if (process.env.CI) {
  console.error(
    "Missing build configuration. The build would ship with these features disabled:\n" +
      missing.map(([name, what]) => `  ${name}  (${what})`).join("\n") +
      "\nAdd each as a repository secret and write it into .env in the workflow."
  );
  process.exit(1);
} else {
  console.warn(
    "Warning: building without " +
      missing.map(([name]) => name).join(", ") +
      ". Those features will be off in this build."
  );
}
