import test from "node:test";
import assert from "node:assert/strict";
import {
  planPublicEntry,
  planQuizScore,
  isQuizScorePath,
  isDeadAccount,
  orphanGuard,
} from "../scripts/lib/legacy-names.mjs";

// LT-81 part D: the scrub deletes fields from live, world-readable documents.
// These cover the decision itself — what gets removed and what is left alone —
// because getting it wrong either leaks a child's name or destroys a name they
// chose themselves.

const NICK = () => "Learner 4821";

test("deletes a legacy real name from a public row", () => {
  const plan = planPublicEntry({ uid: "u1", fullName: "Real Name", totalPoints: 10 }, {}, NICK);
  assert.deepEqual(plan.delete, ["fullName"]);
});

test("deletes an email or photo that reached a public row", () => {
  const plan = planPublicEntry(
    { uid: "u1", email: "kid@example.com", photoURL: "https://lh3.example/a" },
    {},
    NICK
  );
  assert.deepEqual(plan.delete, ["email", "photoURL"]);
});

test("replaces a public name that is really the account name", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "Real Name" },
    { fullName: "Real Name" },
    NICK
  );
  assert.equal(plan.displayName, "Learner 4821");
});

test("keeps a name the learner chose, even when it matches their account name", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "Real Name" },
    { fullName: "Real Name", displayName: "Real Name" },
    NICK
  );
  assert.equal(plan.displayName, undefined);
});

test("leaves a chosen nickname alone", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "PixelPilot" },
    { fullName: "Real Name", displayName: "PixelPilot" },
    NICK
  );
  assert.deepEqual(plan.delete, []);
  assert.equal(plan.displayName, undefined);
});

test("leaves a clean row untouched", () => {
  const plan = planPublicEntry(
    { uid: "u1", displayName: "Learner 1234", avatarId: "pet-fox", totalPoints: 30 },
    { fullName: "Real Name" },
    NICK
  );
  assert.deepEqual(plan.delete, []);
  assert.equal(plan.displayName, undefined);
});

test("deletes a legacy name from a quiz score", () => {
  assert.deepEqual(planQuizScore({ userId: "u1", userFullName: "Real Name", score: 8 }), [
    "userFullName",
  ]);
});

test("leaves a clean quiz score untouched", () => {
  assert.deepEqual(planQuizScore({ userId: "u1", displayName: "PixelPilot", score: 8 }), []);
});

// LT-98: the first run of this job reported zero quiz score rows because
// QuizLeaderboards/{quizId} documents do not exist — the app writes straight
// into the Scores subcollection. The walk is a collection-group query now,
// which matches any collection called "Scores", so paths are checked.

test("accepts a real quiz score path", () => {
  assert.equal(isQuizScorePath("QuizLeaderboards/python/Scores/uid123"), true);
});

test("rejects a Scores collection somewhere else", () => {
  assert.equal(isQuizScorePath("SomethingElse/abc/Scores/uid123"), false);
  assert.equal(isQuizScorePath("QuizLeaderboards/python/Attempts/uid123"), false);
  assert.equal(isQuizScorePath("QuizLeaderboards/python/Scores/uid123/extra/doc"), false);
  assert.equal(isQuizScorePath(""), false);
});

// Deleting a whole document is a different risk from clearing a field, so the
// owner test is deliberately conservative and the count is capped.

test("an account is dead only when Auth says the login is gone", () => {
  assert.equal(isDeadAccount({ authKnown: true, authExists: false }), true);
  assert.equal(isDeadAccount({ authKnown: true, authExists: true }), false);
});

// The lookup decides whether someone's data is destroyed, so a lookup that
// could not answer must never read as "this account is gone".
test("a lookup that could not answer leaves the account alone", () => {
  assert.equal(isDeadAccount({ authKnown: false, authExists: false }), false);
  assert.equal(isDeadAccount({ authKnown: false, authExists: true }), false);
  assert.equal(isDeadAccount({}), false);
  assert.equal(isDeadAccount({ authKnown: undefined, authExists: false }), false);
});

test("a plausible number of dead accounts is allowed through", () => {
  assert.equal(orphanGuard(1, 20).abort, false);
  assert.equal(orphanGuard(5, 20).abort, false);
});

test("an implausible number of dead accounts stops the run", () => {
  assert.equal(orphanGuard(6, 20).abort, true);
  assert.equal(orphanGuard(20, 20).abort, true);
});

test("an empty collection never triggers the brake", () => {
  assert.deepEqual(orphanGuard(0, 0), { abort: false, ratio: 0 });
});
