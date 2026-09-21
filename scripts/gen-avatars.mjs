/**
 * scripts/gen-avatars.mjs
 * Pre-renders the 16 fixed avatars to static SVG files in public/avatars/.
 * Serving them as cached static assets (loaded on demand) keeps the DiceBear
 * library AND the avatar data out of the JS bundle entirely — only the 1–2
 * avatars actually on screen are ever fetched, and they cache after first load.
 *
 * Run after changing the avatar STYLE, seeds, or backgrounds:
 *   npm run gen:avatars
 *
 * It only writes the 16 character avatars. The 10 Critters (pet-*.svg) are
 * hand-drawn and checked in; this script never touches or removes them.
 *
 * DiceBear stays a devDependency (used only here, never imported by src/).
 */
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import { writeFileSync, mkdirSync } from "node:fs";

// One knob restyles every avatar. Kid-friendly alternatives from
// @dicebear/collection: bigSmile, funEmoji, bottts, thumbs, micah, personas.
const STYLE = adventurer;

// Hair is the reliable gender cue in Adventurer (the style is otherwise
// neutral). We pin the girl set to LONG hair and the boy set to SHORT hair so
// each avatar clearly matches its picker tab, while the seed still varies the
// exact style, hair color, and face across the set.
const LONG_HAIR = Array.from({ length: 26 }, (_, i) => `long${String(i + 1).padStart(2, "0")}`);
const SHORT_HAIR = Array.from({ length: 19 }, (_, i) => `short${String(i + 1).padStart(2, "0")}`);

// Per-set options layered on top of the seed. Earrings are a secondary feminine
// cue (only sometimes, for variety); the boy set never gets them.
const FEMININE_OPTS = { hair: LONG_HAIR, hairProbability: 100, earringsProbability: 50 };
const MASCULINE_OPTS = { hair: SHORT_HAIR, hairProbability: 100, earringsProbability: 0 };

// [id, backgroundColor]. IDs are unchanged from the original set so existing
// users keep their avatar; each ID doubles as the deterministic DiceBear seed.
const FEMININE = [
  ["astro-girl", "c7d2fe"],
  ["pixel-princess", "fbcfe8"],
  ["skater-girl", "e9d5ff"],
  ["wizard-girl", "ddd6fe"],
  ["music-girl", "bae6fd"],
  ["coder-girl", "a7f3d0"],
  ["artist-girl", "fed7aa"],
  ["science-girl", "fde68a"],
];
const MASCULINE = [
  ["ninja-boy", "cbd5e1"],
  ["gamer-boy", "bfdbfe"],
  ["robot-boy", "c7d2fe"],
  ["skater-boy", "d9f99d"],
  ["explorer-boy", "fecaca"],
  ["rocket-boy", "fda4af"],
  ["sport-boy", "99f6e4"],
  ["dino-boy", "bbf7d0"],
];

const svg = (seed, bg, opts) =>
  createAvatar(STYLE, {
    seed,
    size: 96,
    radius: 50,
    backgroundColor: [bg],
    backgroundType: ["solid"],
    ...opts,
  }).toString();

const outDir = new URL("../public/avatars/", import.meta.url);
mkdirSync(outDir, { recursive: true });

for (const [id, bg] of FEMININE) {
  writeFileSync(new URL(`${id}.svg`, outDir), svg(id, bg, FEMININE_OPTS));
}
for (const [id, bg] of MASCULINE) {
  writeFileSync(new URL(`${id}.svg`, outDir), svg(id, bg, MASCULINE_OPTS));
}
console.log("Wrote " + (FEMININE.length + MASCULINE.length) + " avatars to public/avatars/");
