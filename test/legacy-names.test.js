import { test, expect } from "vitest";
import {
  planPublicEntry,
  planQuizScore,
  isQuizScorePath,
  isDeadAccount,
  isAdminAccount,
  orphanGuard,
} from "../scripts/lib/legacy-names.mjs";

// LT-81 part D: the scrub deletes fields from live, world-readable documents.
// These cover the decision itself — what gets removed and what is left alone —
// because getting it wrong either leaks a child's name or destroys a name they
// chose themselves.

const NICK = () => "Learner 4821";

test("deletes a legacy real name from a public row", () => {
  const plan = planPublicEntry({ uid: "u1", fullName: "Real Name", totalPoints: 10 }, {}, NICK);
  expect(plan.delete).toEqual(["fullName"]);
});

test("deletes an email or photo that reached a public row", () => {
  const plan = planPublicEntry(
    { uid: "u1", email: "kid@example.com", photoURL: "https://lh3.example/a" },
    {},
    NICK
  );
  expect(plan.delete).toEqual(["email", "photoURL"]);
});

test("replaces a public name that is really the account name", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "Real Name" },
    { fullName: "Real Name" },
    NICK
  );
  expect(plan.displayName).toBe("Learner 4821");
});

test("keeps a name the learner chose, even when it matches their account name", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "Real Name" },
    { fullName: "Real Name", displayName: "Real Name" },
    NICK
  );
  expect(plan.displayName).toBe(undefined);
});

test("leaves a chosen nickname alone", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "PixelPilot" },
    { fullName: "Real Name", displayName: "PixelPilot" },
    NICK
  );
  expect(plan.delete).toEqual([]);
  expect(plan.displayName).toBe(undefined);
});

test("leaves a clean row untouched", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "Learner 1234", avatarId: "pet-fox", totalPoints: 30 },
    { fullName: "Real Name" },
    NICK
  );
  expect(plan.delete).toEqual([]);
  expect(plan.displayName).toBe(undefined);
});

test("deletes a legacy name from a quiz score", () => {
  expect(planQuizScore({ userId: "u1", userFullName: "Real Name", score: 8 })).toEqual([
    "userFullName",
  ]);
});

test("leaves a clean quiz score untouched", () => {
  expect(planQuizScore({ userId: "u1", displayName: "PixelPilot", score: 8 })).toEqual([]);
});

// LT-98: the first run of this job reported zero quiz score rows because
// QuizLeaderboards/{quizId} documents do not exist — the app writes straight
// into the Scores subcollection. The walk is a collection-group query now,
// which matches any collection called "Scores", so paths are checked.

test("accepts a real quiz score path", () => {
  expect(isQuizScorePath("QuizLeaderboards/python/Scores/uid123")).toBe(true);
});

test("rejects a Scores collection somewhere else", () => {
  expect(isQuizScorePath("SomethingElse/abc/Scores/uid123")).toBe(false);
  expect(isQuizScorePath("QuizLeaderboards/python/Attempts/uid123")).toBe(false);
  expect(isQuizScorePath("QuizLeaderboards/python/Scores/uid123/extra/doc")).toBe(false);
  expect(isQuizScorePath("")).toBe(false);
});

// Deleting a whole document is a different risk from clearing a field, so the
// owner test is deliberately conservative and the count is capped.

test("an account is dead only when Auth says the login is gone", () => {
  expect(isDeadAccount({ authKnown: true, authExists: false })).toBe(true);
  expect(isDeadAccount({ authKnown: true, authExists: true })).toBe(false);
});

// The lookup decides whether someone's data is destroyed, so a lookup that
// could not answer must never read as "this account is gone".
test("a lookup that could not answer leaves the account alone", () => {
  expect(isDeadAccount({ authKnown: false, authExists: false })).toBe(false);
  expect(isDeadAccount({ authKnown: false, authExists: true })).toBe(false);
  expect(isDeadAccount({})).toBe(false);
  expect(isDeadAccount({ authKnown: undefined, authExists: false })).toBe(false);
});

test("a plausible number of dead accounts is allowed through", () => {
  expect(orphanGuard(1, 20).abort).toBe(false);
  expect(orphanGuard(5, 20).abort).toBe(false);
});

test("an implausible number of dead accounts stops the run", () => {
  expect(orphanGuard(6, 20).abort).toBe(true);
  expect(orphanGuard(20, 20).abort).toBe(true);
});

test("an empty collection never triggers the brake", () => {
  expect(orphanGuard(0, 0)).toEqual({ abort: false, ratio: 0 });
});

// LT-103: an administrator is not a learner. Their quiz scores were landing on
// boards that other learners read, showing up as an account nobody could
// account for.

test("an admin claim is recognised from the Auth lookup", () => {
  expect(isAdminAccount({ authKnown: true, claims: { admin: true } })).toBe(true);
});

test("a learner is not an admin", () => {
  expect(isAdminAccount({ authKnown: true, claims: {} })).toBe(false);
  expect(isAdminAccount({ authKnown: true })).toBe(false);
  expect(isAdminAccount({ authKnown: true, claims: { admin: "yes" } })).toBe(false);
});

test("a lookup that could not answer is never treated as an admin", () => {
  expect(isAdminAccount({ authKnown: false, claims: { admin: true } })).toBe(false);
  expect(isAdminAccount({})).toBe(false);
});
