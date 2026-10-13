import { describe, it, expect } from "vitest";
import { LANGUAGES, translations } from "../src/i18n/translations";
import { contentTranslations } from "../src/i18n/contentTranslations";

/**
 * The dictionaries and the switcher have to agree.
 *
 * Nothing checked this, and they drifted a long way: `translations.js` and
 * `contentTranslations.js` each carried French, German and Arabic while
 * `LANGUAGES` offered only English and Spanish. No user could reach them, and
 * every visitor downloaded them — 39K gzip in the entry chunk of every page
 * load. They were also 61% complete, so shipping them would have rendered
 * roughly half the interface in English while claiming otherwise.
 *
 * Two directions, both failures:
 *
 *  - a dictionary nobody can select is dead weight a reader pays for;
 *  - a language in the switcher with no dictionary falls back to English
 *    silently, which looks like a translation and is not one.
 */

const codes = (dict) => Object.keys(dict).sort();
const offered = LANGUAGES.map((l) => l.code).sort();

const keys = (value, prefix = "") =>
  Object.entries(value).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );

describe("the languages offered are exactly the languages translated", () => {
  it("every offered language has a UI dictionary, and every dictionary is offered", () => {
    expect(codes(translations)).toEqual(offered);
  });

  it("the same holds for course content", () => {
    expect(codes(contentTranslations)).toEqual(offered);
  });

  it("every offered language carries every English UI string", () => {
    const english = keys(translations.en);
    for (const code of offered) {
      if (code === "en") continue;
      const have = new Set(keys(translations[code]));
      const missing = english.filter((k) => !have.has(k));
      expect(
        missing,
        `${code} is missing ${missing.length} strings and would silently show English:\n  ` +
          missing.slice(0, 12).join("\n  ")
      ).toEqual([]);
    }
  });

  it("carries no string English has since dropped", () => {
    const english = new Set(keys(translations.en));
    for (const code of offered) {
      if (code === "en") continue;
      const stale = keys(translations[code]).filter((k) => !english.has(k));
      expect(stale, `${code} has ${stale.length} keys English no longer has`).toEqual([]);
    }
  });

  it("every language declares a text direction", () => {
    for (const language of LANGUAGES) {
      expect(["ltr", "rtl"], `${language.code} has no usable dir`).toContain(language.dir);
    }
  });
});
