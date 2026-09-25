import { test, expect, describe } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Every string a learner reads must come from the dictionary.
 *
 * This was found the hard way: the whole course-completion card was written as
 * raw English in JSX — "Keep going!", "Mark as complete", "Dashboard" — so a
 * Spanish learner read it in English and nothing failed. `redesign.spec.js`
 * catches a LEAKED key ("home.ctaBtn" rendering literally); nothing caught the
 * opposite, a string that never reached the dictionary at all.
 */

// English-only by design, with the reason. Anything not listed here must use t().
const ALLOWED = {
  "src/pages/Admin.jsx":
    "admin-only surface, claim-gated, never shown to a learner (LT-49)",
  "src/Components/ui/PageSkeleton.jsx":
    'the "Loading page" label is the handle the whole e2e suite waits on; ' +
    "translating it needs a stable test id first",
};

const SKIP_DIRS = new Set(["data", "i18n", "config", "assets"]);

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return SKIP_DIRS.has(entry) ? [] : walk(full);
    return full.endsWith(".jsx") ? [full] : [];
  });

// A JSX text node, or a prop whose value is shown to or read out to a person.
const TEXT_NODE = />\s*([A-Z][A-Za-z][^<>{}\n]{5,})\s*</g;
const VISIBLE_PROP = /\b(title|label|placeholder|alt|aria-label|actionText|subtitle)\s*=\s*"([^"]{6,})"/g;
// Two or more words: single words are usually a token, an icon name or a unit.
const SENTENCE = /[A-Za-z]{2,}\s+[A-Za-z]{2,}/;

const findEnglish = (source) => {
  const found = [];
  for (const line of source.split("\n")) {
    for (const [, text] of line.matchAll(TEXT_NODE)) {
      if (SENTENCE.test(text)) found.push(text.trim());
    }
    for (const [, prop, value] of line.matchAll(VISIBLE_PROP)) {
      if (SENTENCE.test(value)) found.push(`${prop}="${value.trim()}"`);
    }
  }
  return found;
};

describe("no untranslated UI strings", () => {
  const files = walk("src");

  test("every learner-facing string goes through the dictionary", () => {
    const offenders = [];
    for (const file of files) {
      const rel = file.replaceAll("\\", "/");
      if (ALLOWED[rel]) continue;
      for (const text of findEnglish(readFileSync(file, "utf8"))) {
        offenders.push(`${rel}  ${text}`);
      }
    }
    expect(
      offenders,
      "Hardcoded English in the UI. Move each one into src/i18n/translations.js " +
        "and render it with t(), or add the file to ALLOWED with a reason:\n  " +
        offenders.join("\n  ")
    ).toEqual([]);
  });

  test("the allowlist does not outlive the files it excuses", () => {
    const present = new Set(files.map((f) => f.replaceAll("\\", "/")));
    for (const file of Object.keys(ALLOWED)) {
      expect(present.has(file), `${file} is allowlisted but no longer exists`).toBe(true);
    }
  });

  // A guard that cannot fail is worse than no guard.
  test("it catches a string that skips the dictionary", () => {
    expect(findEnglish('<p className="x">Mark as complete</p>')).toEqual(["Mark as complete"]);
    expect(findEnglish('<input placeholder="Enter your name" />')).toEqual([
      'placeholder="Enter your name"',
    ]);
    expect(findEnglish('<p>{t("ui.rememberMe")}</p>'), "a translated string is fine").toEqual([]);
  });
});
