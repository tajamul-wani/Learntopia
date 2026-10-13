import { describe, it, expect } from "vitest";
import { LANGUAGES, translations } from "../src/i18n/translations";
import englishContent from "../src/i18n/content/en";
import spanishContent from "../src/i18n/content/es";

/**
 * Which file a string lives in is a correctness question, not a size one.
 *
 * `translations.js` ships in the entry chunk and is there before the first
 * paint. The overlay in `i18n/content/<lang>.js` is fetched when a route that
 * renders it opens. Put a string that someone reads early into the overlay and
 * it is not missing — it is *wrong*: `t()` returns the key path, so the reader
 * sees `toasts.profileDeleted` where a sentence should be.
 *
 * That is not hypothetical. Deleting an account reloads the home page and
 * raises that toast from an effect. With `toasts` in the overlay the toast
 * fired first and printed its own key, which is how the account-deletion
 * end-to-end tests caught it.
 *
 * So the split is pinned here. Moving a namespace across it is a deliberate
 * act that has to edit this list and say why.
 */

// Reached only through a lazy route that is itself still loading, so the
// fetch is free: nothing can read these before the route renders.
const DEFERRABLE = ["doc", "terms", "privacy", "courseData", "quizzesData"];

// Read while painting, or by an effect that fires on mount.
const MUST_BE_EAGER = [
  "nav",
  "common",
  "toasts",
  "modals",
  "quiz",
  "contact",
  "thankYou",
  "notFound",
];

const overlays = { en: englishContent, es: spanishContent };

describe("the content overlay holds only what nobody is waiting on", () => {
  it.each(LANGUAGES.map((l) => l.code))("%s defers only route-level bodies", (code) => {
    const early = Object.keys(overlays[code]).filter((ns) => !DEFERRABLE.includes(ns));
    expect(
      early,
      `${code}'s overlay has ${early.length} namespace(s) that are not route-level: ` +
        `${early.join(", ")}. Anything read before its route can render will show ` +
        `the key path instead of the string. Move it to translations.js, or add it ` +
        `to DEFERRABLE here with the reason nothing reads it early.`
    ).toEqual([]);
  });

  it.each(LANGUAGES.map((l) => l.code))("%s keeps the early namespaces eager", (code) => {
    const missing = MUST_BE_EAGER.filter((ns) => !translations[code]?.[ns]);
    expect(
      missing,
      `${code} is missing ${missing.join(", ")} from translations.js, so those ` +
        `strings are not available before the first paint.`
    ).toEqual([]);
  });

  // The one string that actually broke. Named, so a rename cannot quietly
  // drop it back into the overlay.
  it.each(LANGUAGES.map((l) => l.code))(
    "%s can name the post-deletion notice before anything loads",
    (code) => {
      const notice = translations[code]?.toasts?.profileDeleted;
      expect(typeof notice, `${code} has no eager toasts.profileDeleted`).toBe("string");
      expect(notice.length).toBeGreaterThan(5);
      // A dotted single token is what an unresolved key looks like coming out
      // of t(), which is the shape of the bug rather than a translation.
      expect(notice, `${code}'s notice looks like an unresolved key`).not.toMatch(
        /^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)+$/
      );
    }
  );
});
