// Palette guard.
//
// The design system defines every colour the UI is allowed to use: ground,
// surface/-2/-3, ink/-hi/-low/-faint, violet, sky, and state success/warning/
// danger. Colours kept creeping back in from Tailwind's default palette
// (orange-400 on a streak, a stale bg-[#0d0a18], a sky glow that was actually
// sky-400), each one small enough to miss in review.
//
// This walks the source and fails when an off-palette colour class or a
// hardcoded hex appears in UI code, so the rule is enforced by CI rather than by
// remembering to look.
//
// Run: npm run test:palette

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));

// Tailwind default colour families that are NOT part of the design system.
const OFF_PALETTE = [
  "amber", "orange", "yellow", "pink", "teal", "emerald", "red", "green", "gray", "grey",
  "zinc", "neutral", "stone", "lime", "cyan", "indigo", "purple", "fuchsia",
  "rose", "blue", "slate",
];

// Nothing is allowed everywhere. Amber used to be, while the gold accent had no
// token; it is now `gold` in tailwind.config.js, so raw amber is rejected (LT-79).
const ALLOWED_EVERYWHERE = [];

// Files whose colours are illustration artwork rather than UI chrome: avatars,
// icons and badge medallions legitimately use their own hex values.
const ART_FILES = ["BotAvatar.jsx", "Icon.jsx", "AwardArt.jsx", "Logo.jsx", "avatarData.js"];

// Deliberate, reviewed exceptions. Each needs a reason, not just a filename.
const EXCEPTIONS = {
  // A flame reads as fire only with more than one warm hue.
  "Components/StreakModal.jsx": ["orange", "yellow"],
  // Gold, silver and bronze must stay three distinguishable metals.
  "pages/Leaderboard.jsx": ["yellow", "slate"],
};

const PREFIX = "(?:text|bg|border|ring|from|to|via|shadow|fill|stroke|decoration|accent|outline|divide|placeholder)";

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(jsx?|tsx?)$/.test(entry)) out.push(full);
  }
  return out;
}

function relKey(file) {
  return relative(SRC, file).split(sep).join("/");
}

test("no off-palette Tailwind colour classes in UI code", () => {
  const offenders = [];

  for (const file of walk(SRC)) {
    const key = relKey(file);
    if (ART_FILES.some((f) => key.endsWith(f))) continue;

    const allowed = new Set([...ALLOWED_EVERYWHERE, ...(EXCEPTIONS[key] || [])]);
    const families = OFF_PALETTE.filter((f) => !allowed.has(f));
    if (!families.length) continue;

    const re = new RegExp(`\\b${PREFIX}-(${families.join("|")})-\\d{2,3}\\b`, "g");
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const hit of line.matchAll(re)) {
        offenders.push(`${key}:${i + 1}  ${hit[0]}`);
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    "Off-palette colours found. Use a design token, or add a reviewed exception " +
      "to EXCEPTIONS in this file with a reason:\n  " + offenders.join("\n  ")
  );
});

test("no hardcoded hex colours in UI code", () => {
  const offenders = [];

  for (const file of walk(SRC)) {
    const key = relKey(file);
    if (ART_FILES.some((f) => key.endsWith(f))) continue;

    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      // Only flag hex used as a colour value in markup/classes, not in comments.
      if (/^\s*(\/\/|\*)/.test(line)) return;
      for (const hit of line.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
        offenders.push(`${key}:${i + 1}  ${hit[0]}`);
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    "Hardcoded hex colours found. Use a design token instead:\n  " + offenders.join("\n  ")
  );
});

// Token colours as "r,g,b", for values written inside arbitrary Tailwind values
// such as shadow-[0_0_12px_rgba(...)]. Class names and hex are covered above,
// but glows and borders written as rgba() slipped past both: 22 sites were using
// Tailwind's violet-500 (139,92,246) instead of the app's (139,124,246), and a
// few other near-miss violets and blues.
const TOKEN_RGB = new Set([
  "139,124,246", // violet-500 #8B7CF6
  "123,106,239", // violet-600 #7B6AEF
  "167,155,248", // violet-400 #A79BF8
  "78,197,232",  // sky       #4EC5E8
  "52,211,153",  // success   #34D399
  "246,185,59",  // warning   #F6B93B
  "251,113,133", // danger    #FB7185
  "0,0,0",
  "255,255,255",
  "245,158,11",  // gold-500  #F59E0B
  "251,191,36",  // gold-400  #FBBF24
]);

test("rgba colour values in UI code come from the tokens", () => {
  const offenders = [];

  for (const file of walk(SRC)) {
    const key = relKey(file);
    // Artwork is exempt from hex, but its glow wrappers are still UI chrome, so
    // only the pure-illustration files are skipped here.
    if (["Icon.jsx", "AwardArt.jsx", "Logo.jsx", "avatarData.js"].some((f) => key.endsWith(f))) continue;

    readFileSync(file, "utf8").split(/\n/).forEach((line, i) => {
      for (const hit of line.matchAll(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,/g)) {
        const rgb = `${hit[1]},${hit[2]},${hit[3]}`;
        if (!TOKEN_RGB.has(rgb)) offenders.push(`${key}:${i + 1}  rgba(${rgb})`);
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    "rgba() values that are not design tokens: " + offenders.join(" | ")
  );
});

// Shades that tailwind.config.js actually declares. A shade outside this list
// looks tokenised but silently falls through to Tailwind's default palette -
// which is exactly how text-violet-200 (#DDD6FE, not ours) survived review.
// Keep in sync with the `colors` block in tailwind.config.js.
const DEFINED_SHADES = {
  violet: ["300", "400", "500", "600", "700"],
  ground: ["600", "700", "800", "900"], // plus DEFAULT, which carries no shade
  gold: ["200", "300", "400", "500", "600"],
};

const SHADED = /\b(?:text|bg|border|ring|from|to|via|shadow|fill|stroke|divide|placeholder|accent|outline)-(violet|ground|gold)-(\d{2,3})\b/g;

test("tokenised colour families only use shades the config defines", () => {
  const offenders = [];

  for (const file of walk(SRC)) {
    const key = relKey(file);
    readFileSync(file, "utf8").split(/\n/).forEach((line, i) => {
      for (const hit of line.matchAll(SHADED)) {
        const [full, family, shade] = hit;
        if (!DEFINED_SHADES[family].includes(shade)) {
          offenders.push(key + ":" + (i + 1) + "  " + full);
        }
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    "Shades not defined in tailwind.config.js, so they fall back to Tailwind's " +
      "defaults: " + offenders.join(" | ")
  );
});

// --- self-checks -----------------------------------------------------------
// Each guard above is only meaningful if it actually read files and its patterns
// actually match. A silent zero - no files walked, or a regex that compiles but
// matches nothing - would report green while testing nothing, which is how the
// shade check passed vacuously the first time it was written.

test("the guard actually scans the source tree", () => {
  const files = walk(SRC);
  assert.ok(
    files.length > 20,
    `Expected to walk the source tree, found only ${files.length} files. ` +
      "SRC is probably resolving to the wrong path."
  );
});

test("the guard patterns still match known-good colour usage", () => {
  // violet-500 and rgba(139,124,246) are used heavily and legitimately. If the
  // patterns stop matching them, the patterns are broken, not the codebase.
  let shadeHits = 0;
  let rgbaHits = 0;

  for (const file of walk(SRC)) {
    const text = readFileSync(file, "utf8");
    shadeHits += (text.match(SHADED) || []).length;
    rgbaHits += (text.match(/rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,/g) || []).length;
  }

  assert.ok(shadeHits > 50, `Shade pattern matched ${shadeHits} times; expected many. Pattern is broken.`);
  assert.ok(rgbaHits > 10, `rgba pattern matched ${rgbaHits} times; expected many. Pattern is broken.`);
});

// --- tone keys -------------------------------------------------------------
// Notifications pick their colours by looking a tone name up in TONE_STYLES, and
// ToastStack/NotificationModal fall back to violet when the name is missing. So a
// tone renamed in one place but not the other breaks nothing loudly: the warning
// toast just quietly turns violet. That exact mismatch was a live risk when amber
// became gold, so check every tone a notification asks for actually exists.
test("every notification tone resolves to a defined tone style", () => {
  const cfg = readFileSync(new URL("../src/Components/ui/notificationConfig.js", import.meta.url), "utf8");

  const stylesStart = cfg.indexOf("TONE_STYLES");
  assert.ok(stylesStart > -1, "TONE_STYLES not found in notificationConfig.js");
  const styles = cfg.slice(stylesStart);

  const defined = new Set([...styles.matchAll(/^\s{2}([a-z]+):\s*\{/gm)].map((m) => m[1]));
  const requested = [...cfg.slice(0, stylesStart).matchAll(/tone:\s*"([a-z]+)"/g)].map((m) => m[1]);

  assert.ok(defined.size > 0, "Parsed no tone styles; the pattern is broken.");
  assert.ok(requested.length > 0, "Parsed no requested tones; the pattern is broken.");

  const missing = [...new Set(requested)].filter((tone) => !defined.has(tone));
  assert.deepEqual(
    missing,
    [],
    "Notification tones with no matching TONE_STYLES entry (these silently fall back to violet): " +
      missing.join(", ")
  );
});
