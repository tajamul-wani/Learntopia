// Firestore Security Rules tests.
//
// These run against the REAL firestore.rules file inside the local Firestore
// emulator — no Firebase login, no real project, no secrets required. They lock
// in the security guarantees that broke silently three times during
// development (the points cap, the missing leaderboard `xp` key, the missing
// attempt `xpEarned` key) so a future rules edit that reopens a hole fails CI
// before it can be merged.
//
// Run locally:   npm run test:rules        (needs the emulator running)
// Run in CI:     firebase emulators:exec --only firestore "npm run test:rules"
//
// Uses Node's built-in test runner (node --test) — zero extra test framework.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { test, before, after, beforeEach, describe } from "node:test";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  writeBatch,
} from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rulesPath = join(__dirname, "..", "firestore.rules");

let testEnv;

// A valid baseline profile the rules will accept on create.
const validProfile = () => ({
  email: "kid@example.com",
  fullName: "Test Kid",
  totalPoints: 0,
  streak: 1,
  badges: [],
  xp: 0,
});

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-learntopia",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync(rulesPath, "utf8"),
    },
  });
});

after(async () => {
  if (testEnv) await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

// Signed-in contexts.
const alice = () => testEnv.authenticatedContext("alice").firestore();
const bob = () => testEnv.authenticatedContext("bob").firestore();
const admin = () =>
  testEnv.authenticatedContext("owner", { admin: true }).firestore();
const anon = () => testEnv.unauthenticatedContext().firestore();

// Seed a document bypassing rules (for update/read setup).
const seed = (path, data) =>
  testEnv.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), path), data);
  });

describe("XP ledger (LT-83)", () => {
  // XP used to be whatever a client wrote, checked only for never decreasing.
  // A learner could open the console on the live site and type any number. XP
  // now rises only alongside a ledger entry created in the same write, so these
  // tests are the actual protection: if they pass, the score means something.

  const grant = (type = "module", amount = 50) => ({ type, amount, grantedAt: new Date() });

  /** The legitimate shape: the entry and the increase, together. */
  const claim = async (db, uid, key, amount, type = "module") => {
    const batch = writeBatch(db);
    batch.set(doc(db, `Users/${uid}/xpLedger/${key}`), grant(type, amount));
    batch.set(
      doc(db, `Users/${uid}`),
      { ...validProfile(), xp: amount, totalPoints: amount, lastGrantKey: key },
      { merge: true }
    );
    return batch.commit();
  };

  beforeEach(async () => {
    await seed("Users/alice", validProfile());
  });

  test("a grant and the XP it pays for go through together", async () => {
    await assertSucceeds(claim(alice(), "alice", "course-1-module-0", 50));
  });

  test("XP cannot rise without a grant", async () => {
    await assertFails(
      updateDoc(doc(alice(), "Users/alice"), { xp: 500, totalPoints: 500 })
    );
  });

  test("XP cannot rise by more than the grant is worth", async () => {
    const db = alice();
    const batch = writeBatch(db);
    batch.set(doc(db, "Users/alice/xpLedger/course-1-module-0"), grant("module", 50));
    batch.set(
      doc(db, "Users/alice"),
      { ...validProfile(), xp: 5000, totalPoints: 5000, lastGrantKey: "course-1-module-0" },
      { merge: true }
    );
    await assertFails(batch.commit());
  });

  test("a grant cannot be worth more than its type allows", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/xpLedger/course-1-module-0"), grant("module", 5000))
    );
  });

  test("an unknown grant type is refused", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/xpLedger/whatever"), grant("jackpot", 50))
    );
  });

  // The heart of it: the same work can never pay twice, however the learner
  // gets back to it — replaying a module, resetting a course, deleting the
  // enrolment and rejoining.
  test("the same grant cannot be claimed twice", async () => {
    await claim(alice(), "alice", "course-1-module-0", 50);
    await assertFails(claim(alice(), "alice", "course-1-module-0", 50));
  });

  test("a ledger entry cannot be edited", async () => {
    await claim(alice(), "alice", "course-1-module-0", 50);
    await assertFails(
      updateDoc(doc(alice(), "Users/alice/xpLedger/course-1-module-0"), { amount: 9999 })
    );
  });

  test("a ledger entry cannot be deleted while the profile exists", async () => {
    await claim(alice(), "alice", "course-1-module-0", 50);
    await assertFails(deleteDoc(doc(alice(), "Users/alice/xpLedger/course-1-module-0")));
  });

  test("nobody can claim a grant for someone else", async () => {
    await seed("Users/bob", validProfile());
    await assertFails(claim(alice(), "bob", "course-1-module-0", 50));
  });

  test("a quiz level is worth ten, and only ten", async () => {
    await assertSucceeds(claim(alice(), "alice", "quiz-python-score-3", 10, "quiz"));
    await seed("Users/carol", validProfile());
    await assertFails(claim(testEnv.authenticatedContext("carol").firestore(), "carol", "quiz-python-score-4", 40, "quiz"));
  });

  test("the public board cannot hold more than the profile", async () => {
    await seed("Users/alice", { ...validProfile(), xp: 50, totalPoints: 50 });
    await assertFails(
      setDoc(doc(alice(), "PublicLeaderboard/alice"), {
        uid: "alice",
        displayName: "Alice",
        totalPoints: 99999,
        xp: 99999,
        streak: 1,
        badges: [],
        updatedAt: new Date(),
      })
    );
  });

  test("the public board may mirror the profile exactly", async () => {
    await seed("Users/alice", { ...validProfile(), xp: 50, totalPoints: 50 });
    await assertSucceeds(
      setDoc(doc(alice(), "PublicLeaderboard/alice"), {
        uid: "alice",
        displayName: "Alice",
        totalPoints: 50,
        xp: 50,
        streak: 1,
        badges: [],
        updatedAt: new Date(),
      })
    );
  });
});

describe("Users/{uid} profile", () => {
  test("owner can create a valid profile", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice"), validProfile())
    );
  });

  test("owner can set custom displayName and avatarId", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice"), {
        ...validProfile(),
        displayName: "CyberCoder",
        avatarId: "astro-girl",
      })
    );
  });

  test("owner can set photoURL and usePhoto on the private profile", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice"), {
        ...validProfile(),
        photoURL: "https://lh3.googleusercontent.com/a/abc123",
        usePhoto: true,
      })
    );
  });

  test("rejects a non-boolean usePhoto", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice"), {
        ...validProfile(),
        usePhoto: "yes",
      })
    );
  });

  // LT-81 part C: the one-time identity prompt records that the learner was
  // asked, so it never comes back. The rules have to admit that field, and
  // only as a timestamp.
  test("owner can record identityConfirmedAt on the private profile", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice"), {
        ...validProfile(),
        avatarId: "pet-fox",
        identityConfirmedAt: new Date(),
      })
    );
  });

  test("rejects a non-timestamp identityConfirmedAt", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice"), {
        ...validProfile(),
        identityConfirmedAt: "2026-09-21",
      })
    );
  });

  test("cannot create a profile for someone else", async () => {
    await assertFails(setDoc(doc(alice(), "Users/bob"), validProfile()));
  });

  test("rejects a profile with an unknown extra field", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice"), { ...validProfile(), isAdmin: true })
    );
  });

  test("owner can read own profile", async () => {
    await seed("Users/alice", validProfile());
    await assertSucceeds(getDoc(doc(alice(), "Users/alice")));
  });

  test("a user cannot read another user's profile", async () => {
    await seed("Users/alice", validProfile());
    await assertFails(getDoc(doc(bob(), "Users/alice")));
  });

  test("admin can read any profile", async () => {
    await seed("Users/alice", validProfile());
    await assertSucceeds(getDoc(doc(admin(), "Users/alice")));
  });

  // LT-83: XP rises only alongside the ledger entry that pays for it. A bare
  // increase, which this test used to assert was allowed, is now refused — see
  // the XP ledger suite for the full set.
  test("owner can increase totalPoints and xp with a matching grant", async () => {
    await seed("Users/alice", { ...validProfile(), totalPoints: 100, xp: 100 });
    const db = alice();
    const batch = writeBatch(db);
    batch.set(doc(db, "Users/alice/xpLedger/course-1-module-3"), {
      type: "module",
      amount: 50,
      grantedAt: new Date(),
    });
    batch.set(
      doc(db, "Users/alice"),
      { totalPoints: 150, xp: 150, lastGrantKey: "course-1-module-3" },
      { merge: true }
    );
    await assertSucceeds(batch.commit());
  });

  test("ANTI-CHEAT: a bare XP increase with no grant is refused", async () => {
    await seed("Users/alice", { ...validProfile(), totalPoints: 100, xp: 100 });
    await assertFails(
      updateDoc(doc(alice(), "Users/alice"), { totalPoints: 150, xp: 150 })
    );
  });

  test("ANTI-CHEAT: cannot lower own totalPoints", async () => {
    await seed("Users/alice", { ...validProfile(), totalPoints: 100, xp: 100 });
    await assertFails(
      updateDoc(doc(alice(), "Users/alice"), { totalPoints: 50 })
    );
  });

  test("ANTI-CHEAT: cannot lower own xp", async () => {
    await seed("Users/alice", { ...validProfile(), totalPoints: 100, xp: 100 });
    await assertFails(updateDoc(doc(alice(), "Users/alice"), { xp: 10 }));
  });

  test("ANTI-CHEAT: cannot remove an already-earned badge", async () => {
    await seed("Users/alice", { ...validProfile(), badges: ["first-quiz"] });
    await assertFails(updateDoc(doc(alice(), "Users/alice"), { badges: [] }));
  });

  test("owner can add one new badge", async () => {
    await seed("Users/alice", { ...validProfile(), badges: ["first-quiz"] });
    await assertSucceeds(
      updateDoc(doc(alice(), "Users/alice"), { badges: ["first-quiz", "scholar"] })
    );
  });

  test("ANTI-CHEAT: cannot add more than one badge in a single write", async () => {
    await seed("Users/alice", { ...validProfile(), badges: ["first-quiz"] });
    await assertFails(
      updateDoc(doc(alice(), "Users/alice"), { badges: ["first-quiz", "scholar", "champion"] })
    );
  });

  test("a profile cannot be deleted while its public leaderboard entry remains", async () => {
    await seed("Users/alice", validProfile());
    await seed("PublicLeaderboard/alice", { uid: "alice", totalPoints: 10 });
    await assertFails(deleteDoc(doc(alice(), "Users/alice")));
  });

  test("a user cannot delete another user's profile", async () => {
    await seed("Users/alice", validProfile());
    await assertFails(deleteDoc(doc(bob(), "Users/alice")));
  });
});

describe("Users/{uid}/quizAttempts (append-only)", () => {
  const validAttempt = () => ({
    quizId: "python-basics",
    quizTitle: "Python Basics",
    score: 8,
    totalQuestions: 10,
    xpEarned: 80,
    completedAt: new Date(),
  });

  test("owner can add a valid attempt (with xpEarned)", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice/quizAttempts/a1"), validAttempt())
    );
  });

  test("rejects an attempt with a negative score", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/quizAttempts/a1"), {
        ...validAttempt(),
        score: -5,
      })
    );
  });

  test("rejects an attempt carrying an unknown field", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/quizAttempts/a1"), {
        ...validAttempt(),
        cheat: true,
      })
    );
  });

  test("ANTI-FARMING: rejects a score higher than totalQuestions", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/quizAttempts/a1"), {
        ...validAttempt(),
        score: 12,
        totalQuestions: 10,
      })
    );
  });

  test("attempts are immutable once written", async () => {
    await seed("Users/alice", validProfile());
    await seed("Users/alice/quizAttempts/a1", validAttempt());
    await assertFails(
      updateDoc(doc(alice(), "Users/alice/quizAttempts/a1"), { score: 10 })
    );
    await assertFails(
      deleteDoc(doc(alice(), "Users/alice/quizAttempts/a1"))
    );
  });

  test("cannot write an attempt into another user's history", async () => {
    await assertFails(
      setDoc(doc(bob(), "Users/alice/quizAttempts/a1"), validAttempt())
    );
  });
});

describe("Users/{uid}/enrolledCourses", () => {
  test("can enroll (not completed)", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"), {
        completed: false,
        completedModules: [],
        totalModules: 5,
      })
    );
  });

  test("cannot flag completed before finishing all modules", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"), {
        completed: true,
        completedModules: ["m1", "m2"],
        totalModules: 5,
      })
    );
  });

  test("can flag completed once every module is done", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"), {
        completed: true,
        completedModules: ["m1", "m2", "m3", "m4", "m5"],
        totalModules: 5,
      })
    );
  });

  test("accepts course-accuracy counters when correct <= answered", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"), {
        completed: false,
        completedModules: ["m1"],
        totalModules: 5,
        correctTotal: 4,
        answeredTotal: 4,
      })
    );
  });

  test("ANTI-FARMING: rejects accuracy counters with more correct than answered", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"), {
        completed: false,
        completedModules: ["m1"],
        totalModules: 5,
        correctTotal: 9,
        answeredTotal: 4,
      })
    );
  });

  test("accepts a soft-unenroll flag", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"), {
        completed: false,
        completedModules: ["m1"],
        totalModules: 5,
        unenrolled: true,
      })
    );
  });

  test("rejects a non-boolean unenrolled flag", async () => {
    await assertFails(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"), {
        completed: false,
        completedModules: [],
        totalModules: 5,
        unenrolled: "yes",
      })
    );
  });

  test("accepts growing the XP-awarded module list", async () => {
    await seed("Users/alice/enrolledCourses/c1", {
      completed: false, completedModules: [0], totalModules: 5, xpAwardedModules: [0],
    });
    await assertSucceeds(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"),
        { completedModules: [0, 1], xpAwardedModules: [0, 1] }, { merge: true })
    );
  });

  test("ANTI-FARMING: rejects shrinking the XP-awarded module list", async () => {
    await seed("Users/alice/enrolledCourses/c1", {
      completed: true, completedModules: [0, 1, 2, 3, 4], totalModules: 5, xpAwardedModules: [0, 1, 2, 3, 4],
    });
    // A restart that tries to wipe the XP markers so modules pay out again.
    await assertFails(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"),
        { completed: false, completedModules: [], xpAwardedModules: [] }, { merge: true })
    );
  });

  test("ANTI-FARMING: rejects flipping courseXpAwarded back to false", async () => {
    await seed("Users/alice/enrolledCourses/c1", {
      completed: true, completedModules: [0, 1, 2, 3, 4], totalModules: 5, courseXpAwarded: true,
    });
    await assertFails(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"),
        { courseXpAwarded: false }, { merge: true })
    );
  });

  test("ANTI-FARMING: rejects lowering the accuracy counters", async () => {
    await seed("Users/alice/enrolledCourses/c1", {
      completed: false, completedModules: [0], totalModules: 5, correctTotal: 8, answeredTotal: 10,
    });
    await assertFails(
      setDoc(doc(alice(), "Users/alice/enrolledCourses/c1"),
        { correctTotal: 0, answeredTotal: 0 }, { merge: true })
    );
  });
});

describe("QuizLeaderboards/{quizId}/Scores/{uid}", () => {
  // Display data only, and bounded the same way a quiz attempt is. Before this
  // was validated, any client could post any score to any board, or write a
  // real name into a collection every signed-in user can read.
  const validScore = (over = {}) => ({
    userId: "alice",
    displayName: "Tester",
    avatarId: "astro-girl",
    score: 80,
    rawScore: 8,
    totalQuestions: 10,
    completedAt: new Date(),
    ...over,
  });
  const scorePath = "QuizLeaderboards/python/Scores/alice";

  test("owner can post a valid score", async () => {
    await assertSucceeds(setDoc(doc(alice(), scorePath), validScore()));
  });

  test("any signed-in user can read the board", async () => {
    await seed(scorePath, validScore());
    await assertSucceeds(getDoc(doc(bob(), scorePath)));
  });

  test("an unauthenticated visitor cannot read the board", async () => {
    await seed(scorePath, validScore());
    await assertFails(getDoc(doc(anon(), scorePath)));
  });

  test("ANTI-CHEAT: rejects more correct answers than the quiz has questions", async () => {
    await assertFails(setDoc(doc(alice(), scorePath), validScore({ rawScore: 99 })));
  });

  test("ANTI-CHEAT: rejects a negative or impossible score", async () => {
    await assertFails(setDoc(doc(alice(), scorePath), validScore({ score: -10 })));
    await assertFails(setDoc(doc(alice(), scorePath), validScore({ totalQuestions: 0 })));
  });

  test("ANTI-CHEAT: a score may improve but never drop", async () => {
    await seed(scorePath, validScore());
    await assertSucceeds(setDoc(doc(alice(), scorePath), validScore({ score: 100, rawScore: 10 })));
    await assertFails(setDoc(doc(alice(), scorePath), validScore({ score: 10, rawScore: 1 })));
  });

  test("PRIVACY: cannot write a real name, email or photo onto the board", async () => {
    for (const extra of [{ userFullName: "Real Name" }, { email: "kid@example.com" }, { photoURL: "https://x/y.jpg" }]) {
      await assertFails(setDoc(doc(alice(), scorePath), validScore(extra)));
    }
  });

  test("cannot claim someone else's row or mislabel the owner", async () => {
    await assertFails(setDoc(doc(bob(), scorePath), validScore()));
    await assertFails(setDoc(doc(alice(), scorePath), validScore({ userId: "bob" })));
  });
});

describe("PublicLeaderboard/{uid}", () => {
  // The board mirrors the profile, so a profile with the same total has to
  // exist for an entry to be valid at all (LT-83).
  beforeEach(async () => {
    await seed("Users/alice", { ...validProfile(), totalPoints: 100, xp: 100 });
  });

  const validEntry = () => ({
    uid: "alice",
    displayName: "Tester",
    totalPoints: 100,
    streak: 3,
    badges: ["first-quiz"],
    xp: 100,
    updatedAt: new Date(),
  });

  test("any signed-in user can read the leaderboard", async () => {
    await seed("PublicLeaderboard/alice", validEntry());
    await assertSucceeds(getDoc(doc(bob(), "PublicLeaderboard/alice")));
  });

  test("owner can write their own valid entry (incl. xp)", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "PublicLeaderboard/alice"), validEntry())
    );
  });

  test("PRIVACY: cannot write a real name onto the public board", async () => {
    // fullName carried the account's real name (a child's, for Google sign-ins)
    // into a collection every signed-in user can read.
    await assertFails(
      setDoc(doc(alice(), "PublicLeaderboard/alice"), { ...validEntry(), fullName: "Real Kid Name" })
    );
  });

  test("PRIVACY: a legacy real name can be cleared but not kept", async () => {
    await seed("PublicLeaderboard/alice", { ...validEntry(), fullName: "Real Kid Name" });
    // Rewriting the row without the field is how the app self-heals.
    await assertSucceeds(setDoc(doc(alice(), "PublicLeaderboard/alice"), validEntry()));
  });

  test("cannot leak email into public entry", async () => {
    await assertFails(
      setDoc(doc(alice(), "PublicLeaderboard/alice"), {
        ...validEntry(),
        email: "kid@example.com",
      })
    );
  });

  test("allows custom displayName and avatarId in public leaderboard entry", async () => {
    await assertSucceeds(
      setDoc(doc(alice(), "PublicLeaderboard/alice"), {
        ...validEntry(),
        displayName: "CyberCoder",
        avatarId: "astro-girl",
      })
    );
  });

  test("PRIVACY: cannot write a real photoURL into the public leaderboard", async () => {
    await assertFails(
      setDoc(doc(alice(), "PublicLeaderboard/alice"), {
        ...validEntry(),
        photoURL: "https://lh3.googleusercontent.com/a/abc123",
      })
    );
  });

  test("cannot write into another user's leaderboard entry", async () => {
    await assertFails(
      setDoc(doc(bob(), "PublicLeaderboard/alice"), validEntry())
    );
  });

  test("unauthenticated visitor cannot read the leaderboard", async () => {
    await seed("PublicLeaderboard/alice", validEntry());
    await assertFails(getDoc(doc(anon(), "PublicLeaderboard/alice")));
  });
});

describe("ContactMessages", () => {
  const validMessage = () => ({
    name: "Parent",
    email: "parent@example.com",
    subject: "Hello",
    message: "This is a message that is definitely long enough.",
    submittedAt: new Date(),
  });

  test("anyone (even unauthenticated) can submit a valid contact message", async () => {
    await assertSucceeds(
      addDoc(collection(anon(), "ContactMessages"), validMessage())
    );
  });

  test("rejects a message that is too short", async () => {
    await assertFails(
      addDoc(collection(anon(), "ContactMessages"), {
        ...validMessage(),
        message: "hi",
      })
    );
  });

  test("non-admin cannot read contact messages", async () => {
    await seed("ContactMessages/m1", validMessage());
    await assertFails(getDoc(doc(alice(), "ContactMessages/m1")));
  });

  test("admin can read contact messages", async () => {
    await seed("ContactMessages/m1", validMessage());
    await assertSucceeds(getDoc(doc(admin(), "ContactMessages/m1")));
  });
});

describe("BugReports (admin-only)", () => {
  test("non-admin cannot read or create bug reports", async () => {
    await assertFails(getDoc(doc(alice(), "BugReports/b1")));
    await assertFails(
      setDoc(doc(alice(), "BugReports/b1"), { note: "x" })
    );
  });

  test("admin can create a bug report", async () => {
    await assertSucceeds(
      setDoc(doc(admin(), "BugReports/b1"), { note: "something to fix" })
    );
  });
});

describe("Account deletion (wipes everything the user owns)", () => {
  // Everything a learner owns, as the app writes it.
  const seedLearner = async (uid) => {
    await seed(`Users/${uid}`, { ...validProfile(), email: `${uid}@example.com` });
    await seed(`PublicLeaderboard/${uid}`, { uid, displayName: uid, totalPoints: 300, xp: 300 });
    await seed(`Users/${uid}/enrolledCourses/1`, { courseId: 1, completed: false, completedModules: [0], totalModules: 4, xpAwardedModules: [0] });
    await seed(`Users/${uid}/quizAttempts/a1`, { quizId: "python", quizTitle: "Python", score: 8, totalQuestions: 10, completedAt: new Date() });
    await seed(`QuizLeaderboards/python/Scores/${uid}`, { uid, score: 8 });
  };
  const ownedSubDocs = (uid) => [
    `Users/${uid}/enrolledCourses/1`,
    `Users/${uid}/quizAttempts/a1`,
    `QuizLeaderboards/python/Scores/${uid}`,
  ];

  test("owner deletes the profile and public entry together in one batch", async () => {
    await seedLearner("alice");
    const db = alice();
    const batch = writeBatch(db);
    batch.delete(doc(db, "PublicLeaderboard/alice"));
    batch.delete(doc(db, "Users/alice"));
    await assertSucceeds(batch.commit());
  });

  test("the public entry alone cannot be deleted while the profile exists", async () => {
    await seedLearner("alice");
    await assertFails(deleteDoc(doc(alice(), "PublicLeaderboard/alice")));
  });

  test("ANTI-FARMING: enrollments, attempts and quiz scores are not deletable while the profile exists", async () => {
    await seedLearner("alice");
    for (const path of ownedSubDocs("alice")) {
      await assertFails(deleteDoc(doc(alice(), path)));
    }
  });

  test("once the profile is gone, the owner can delete every remaining document", async () => {
    await seedLearner("alice");
    const db = alice();
    const batch = writeBatch(db);
    batch.delete(doc(db, "PublicLeaderboard/alice"));
    batch.delete(doc(db, "Users/alice"));
    await batch.commit();
    for (const path of ownedSubDocs("alice")) {
      await assertSucceeds(deleteDoc(doc(db, path)));
    }
  });

  test("another user can never delete someone's data, even after their profile is gone", async () => {
    await seedLearner("alice");
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      // One Firestore instance per context: calling ctx.firestore() twice throws.
      const adminDb = ctx.firestore();
      await deleteDoc(doc(adminDb, "PublicLeaderboard/alice"));
      await deleteDoc(doc(adminDb, "Users/alice"));
    });
    for (const path of ownedSubDocs("alice")) {
      await assertFails(deleteDoc(doc(bob(), path)));
    }
  });
});

describe("Default deny", () => {
  test("an unlisted collection is fully locked", async () => {
    await assertFails(getDoc(doc(alice(), "SecretStuff/x")));
    await assertFails(setDoc(doc(alice(), "SecretStuff/x"), { a: 1 }));
  });
});
