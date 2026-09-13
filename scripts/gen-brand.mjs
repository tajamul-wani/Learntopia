// Generates the raster brand assets (favicon.png, apple-touch-icon.png,
// logo.png, og-image.png) from the SVG sources in /public. Run once whenever the
// logo, favicon or OG design changes:
//
//   npm i --no-save sharp     # one-off; keeps package.json unchanged
//   node scripts/gen-brand.mjs
//
// (Run it in WSL — the repo's node_modules is the Linux install.)
//
// The OG card's text is stored as outlines, not <text>, because sharp's SVG
// renderer only sees installed system fonts and would swap Fredoka for a
// fallback.

import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pub = (f) => resolve(root, "public", f);

const favicon = readFileSync(pub("favicon.svg"));
const logo = readFileSync(pub("logo.svg"));
const og = readFileSync(pub("og-image.svg"));

const jobs = [
  // Transparent PNG fallback for browsers that don't take SVG favicons.
  sharp(favicon, { density: 600 }).resize(256, 256).png().toFile(pub("favicon.png")),
  // iOS home-screen icon — flattened onto the dark ground (iOS ignores alpha).
  // The favicon has no background and fills its frame, so pad it: iOS rounds
  // the corners and would otherwise clip the rays.
  sharp(favicon, { density: 600 })
    .resize(136, 136)
    .extend({ top: 22, bottom: 22, left: 22, right: 22, background: "#0A0C12" })
    .flatten({ background: "#0A0C12" })
    .png()
    .toFile(pub("apple-touch-icon.png")),
  // Raster logo for structured data (Google wants a PNG of at least 112px).
  sharp(logo, { density: 300 }).resize(512, 512).png().toFile(pub("logo.png")),
  // Social share card.
  sharp(og, { density: 150 }).resize(1200, 630).png().toFile(pub("og-image.png")),
];

Promise.all(jobs)
  .then(() => console.log("✓ Brand assets written: favicon.png, apple-touch-icon.png, logo.png, og-image.png"))
  .catch((err) => {
    console.error("Failed to generate brand assets:", err);
    process.exit(1);
  });
