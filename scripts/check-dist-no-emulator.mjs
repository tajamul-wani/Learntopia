// Fails the build if Firebase emulator wiring made it into the production bundle.
//
// src/firebase/firebase.js only connects to the local emulators behind
// `import.meta.env.DEV && VITE_USE_EMULATORS`. Vite turns DEV into `false` for a
// production build, so that branch should be removed entirely. If a future edit
// breaks the guard, real users would be pointed at their own localhost and could
// not sign in. This runs after `vite build` and stops the deploy instead.

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));

// Strings that only exist in the emulator branch of firebase.js.
const FORBIDDEN = ["demo-learntopia", "127.0.0.1:9099", "demo-api-key", "VITE_USE_EMULATORS"];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|mjs|html)$/.test(entry)) out.push(full);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error("check-dist-no-emulator: dist/ not found. Run `vite build` first.");
  process.exit(1);
}

const files = walk(DIST);
if (files.length === 0) {
  console.error("check-dist-no-emulator: dist/ has no JS or HTML files to check.");
  process.exit(1);
}

const hits = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const needle of FORBIDDEN) {
    if (text.includes(needle)) hits.push(`${relative(DIST, file)}: ${needle}`);
  }
}

if (hits.length) {
  console.error(
    "Firebase emulator code is in the production build. Check the " +
      "import.meta.env.DEV guard in src/firebase/firebase.js.\n  " +
      hits.join("\n  ")
  );
  process.exit(1);
}

console.log(`✓ No emulator code in dist/ (${files.length} files checked)`);
