import { test, expect, describe } from "vitest";
import { courseTint } from "./courseTint";
import { COURSES } from "../data/coursesData";

describe("courseTint", () => {
  test("a course keeps the same tint however it is asked for", () => {
    const first = courseTint({ id: 3 });
    expect(courseTint({ id: 3 })).toBe(first);
    expect(courseTint({ id: "3" }), "a string id is the same course").toBe(first);
  });

  test("the shipped courses do not all land on one colour", () => {
    const used = new Set(COURSES.map((c) => courseTint(c)));
    expect(used.size, "every course well would look identical").toBeGreaterThan(3);
  });

  test("a missing or broken course still gets a usable class", () => {
    expect(courseTint(null)).toMatch(/^bg-/);
    expect(courseTint({})).toMatch(/^bg-/);
    expect(courseTint({ id: "nonsense" })).toMatch(/^bg-/);
  });
});
