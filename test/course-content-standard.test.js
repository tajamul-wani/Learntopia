import { test, expect, describe } from "vitest";
import { COURSES } from "../src/data/coursesData";
import { contentTranslations } from "../src/i18n/contentTranslations";

/**
 * The shape every course must have — the ones here now, and the ones added
 * later (LT-50).
 *
 * LT-51 asks for content that is "gamified and fun, not heavy theory: lighter
 * reading, more exercises, overview plus some depth" for ages 7 to 16. Left as
 * prose in an issue, that drifts. An audit before this pass found the six
 * courses were two different products: Python carried 1,624 words of reading at
 * 62 words a block, while Marketing, Web Design and Digital Art had one concept
 * and one recap per module — about 160 words for an entire course. Both fail
 * the same brief from opposite ends.
 *
 * These are floors and ceilings, not a formula. A module can be any shape
 * inside them.
 */

const READING = new Set(["story", "concept", "fact", "tip", "example", "recap"]);
const DOING = new Set(["mcq", "match", "activity"]);

// Per module.
const MIN_READING = 3;       // fewer than this is a heading and a quiz, not a lesson
const MAX_READING = 6;       // more than this is a syllabus dump
const MAX_WORDS_PER_BLOCK = 45;  // a wall of text loses a seven-year-old
// An example exists to show code or a worked sum. Capping it at prose length
// would mean cutting working code in half, so it gets its own ceiling.
const MAX_WORDS_PER_EXAMPLE = 95;
const MIN_EXERCISES = 4;
// Per course: doing must outweigh reading, which is the whole point of "gamified".
const MIN_DOING_SHARE = 0.5;

const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const modulesOf = (c) => c.syllabus || [];
const sectionsOf = (m) => m.contentSections || [];

describe("every course meets the content standard", () => {
  test.each(COURSES.map((c) => [c.title, c]))("%s", (_title, course) => {
    const problems = [];
    let reading = 0;
    let doing = 0;

    modulesOf(course).forEach((module, i) => {
      const sections = sectionsOf(module);
      const read = sections.filter((s) => READING.has(s.type));
      const exercises = (module.exercises || []).length + sections.filter((s) => DOING.has(s.type)).length;
      reading += read.length;
      doing += exercises;

      const where = `module ${i + 1} ("${module.title}")`;
      if (read.length < MIN_READING) problems.push(`${where}: only ${read.length} reading blocks, needs ${MIN_READING}`);
      if (read.length > MAX_READING) problems.push(`${where}: ${read.length} reading blocks, at most ${MAX_READING}`);
      if (exercises < MIN_EXERCISES) problems.push(`${where}: only ${exercises} things to do, needs ${MIN_EXERCISES}`);

      for (const s of read) {
        const n = words(s.content);
        const cap = s.type === "example" ? MAX_WORDS_PER_EXAMPLE : MAX_WORDS_PER_BLOCK;
        if (n > cap) problems.push(`${where}: "${s.title}" is ${n} words, at most ${cap}`);
      }
      // A module that never closes the loop leaves a learner unsure what stuck.
      if (!sections.some((s) => s.type === "recap")) problems.push(`${where}: no recap`);
    });

    const share = doing / (reading + doing);
    if (share < MIN_DOING_SHARE) {
      problems.push(`course is ${Math.round(share * 100)}% doing, needs at least ${MIN_DOING_SHARE * 100}%`);
    }

    expect(problems, `\n  ${problems.join("\n  ")}\n`).toEqual([]);
  });
});

/**
 * Course content is translated BY ARRAY INDEX
 * (`courseData.<id>.modules[i].contentSections[j]`, see utils/localizationUtils.js).
 * So adding, removing or reordering a section in English without moving the
 * Spanish one silently puts the wrong Spanish text on the block — no error, no
 * fallback, just the wrong lesson. This catches that.
 */
describe("Spanish course content lines up with English", () => {
  const es = contentTranslations.es?.courseData || {};

  test.each(COURSES.map((c) => [c.title, c]))("%s", (_title, course) => {
    // Both languages are live app-wide, so a course with no Spanish at all is a
    // course half shipped. English fallback hides it — the catalog still renders,
    // just in the wrong language — which is exactly why this has to be asserted
    // rather than left to be noticed.
    const translated = es[course.id];
    expect(translated, `${course.title} has no Spanish content at all`).toBeTruthy();
    if (!translated) return;
    const problems = [];

    modulesOf(course).forEach((module, i) => {
      const esModule = translated.modules?.[i];
      if (!esModule) {
        problems.push(`module ${i + 1} has no Spanish`);
        return;
      }
      const en = sectionsOf(module).length;
      const spanish = (esModule.contentSections || []).length;
      if (en !== spanish) {
        problems.push(`module ${i + 1}: ${en} English sections but ${spanish} Spanish — indexes no longer line up`);
      }
      const enEx = (module.exercises || []).length;
      const esEx = (esModule.exercises || []).length;
      if (enEx !== esEx) problems.push(`module ${i + 1}: ${enEx} English exercises but ${esEx} Spanish`);
    });

    const enModules = modulesOf(course).length;
    const esModules = (translated.modules || []).length;
    if (enModules !== esModules) problems.push(`${enModules} English modules but ${esModules} Spanish`);

    expect(problems, `\n  ${problems.join("\n  ")}\n`).toEqual([]);
  });
});
