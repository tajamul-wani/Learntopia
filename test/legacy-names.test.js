import test from "node:test";
import assert from "node:assert/strict";
import { planPublicEntry, planQuizScore } from "../scripts/lib/legacy-names.mjs";

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
