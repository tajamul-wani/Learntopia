import { test, expect, describe } from "vitest";
import { parseProfileName, hasChosenIdentity } from "./profileUtils";

// These decide what name a learner is shown under and whether they are asked to
// choose one. Both used to be checked only through a browser and a database.

describe("parseProfileName", () => {
  test("prefers the chosen name and avatar", () => {
    expect(parseProfileName({ displayName: "PixelPilot", avatarId: "pet-owl" })).toEqual({
      displayName: "PixelPilot",
      avatarId: "pet-owl",
    });
  });

  test("recovers identity from the legacy Name|avatarId encoding", () => {
    expect(parseProfileName({ fullName: "PixelPilot|pet-fox" })).toEqual({
      displayName: "PixelPilot",
      avatarId: "pet-fox",
    });
  });

  test("falls back to the account name when nothing was chosen", () => {
    expect(parseProfileName({ fullName: "Real Name" }).displayName).toBe("Real Name");
  });

  test("treats the placeholder account name as no name at all", () => {
    expect(parseProfileName({ fullName: "New User" }, "Learner").displayName).toBe("Learner");
  });

  test("handles a missing profile", () => {
    expect(parseProfileName(null, "Learner")).toEqual({ displayName: "Learner", avatarId: null });
  });
});

describe("hasChosenIdentity", () => {
  test("a recorded confirmation settles it", () => {
    expect(hasChosenIdentity({ identityConfirmedAt: new Date() })).toBe(true);
  });

  test("a chosen name and avatar count as chosen", () => {
    expect(hasChosenIdentity({ displayName: "PixelPilot", avatarId: "pet-owl" })).toBe(true);
  });

  // The whole point of the LT-81 fix: reading the RAW fields, because
  // parseProfileName falls back to fullName and would make a Google account's
  // real name look like a name the learner picked.
  test("an account name is not a chosen identity", () => {
    expect(hasChosenIdentity({ fullName: "Real Name", avatarId: "astro-girl" })).toBe(false);
  });

  test("a blank name is not a chosen identity", () => {
    expect(hasChosenIdentity({ displayName: "   ", avatarId: "pet-owl" })).toBe(false);
  });

  test("a name without an avatar is not enough", () => {
    expect(hasChosenIdentity({ displayName: "PixelPilot" })).toBe(false);
  });

  test("handles a missing profile", () => {
    expect(hasChosenIdentity(null)).toBe(false);
  });
});
