/**
 * scripts/scrub-legacy-names.mjs
 *
 * One-off maintenance: remove real names left in world-readable collections by
 * versions of the app that copied them from the Google account.
 *
 * Two kinds of leak:
 *  1. A field the rules no longer allow at all — `fullName` on a public
 *     leaderboard row, `userFullName` on a quiz score.
 *  2. A `displayName` that is really the account name: the public row repeats
 *     the private profile's `fullName`, and that learner never chose a name.
 *
 * Runs in two modes. `report` (the default) reads and counts, changing
 * nothing. `apply` writes. Neither mode ever prints a name, and user ids are
 * cut short in every path it prints: Actions logs on a public repository are
 * readable by anyone, and a full id belongs to a child's account.
 *
 * Usage (locally, with GOOGLE_APPLICATION_CREDENTIALS set):
 *   node scripts/scrub-legacy-names.mjs            # report
 *   node scripts/scrub-legacy-names.mjs --apply    # write
 */
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";
import {
  planPublicEntry,
  planQuizScore,
  isQuizScorePath,
  isDeadAccount,
  isAdminAccount,
  maskPath,
  orphanGuard,
  ORPHAN_ABORT_RATIO,
} from "./lib/legacy-names.mjs";

const APPLY = process.argv.includes("--apply");
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "learntopia-react";

// Firestore caps a batch at 500 writes.
const BATCH_LIMIT = 400;

function init() {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyFile) {
    const credentials = JSON.parse(readFileSync(keyFile, "utf8"));
    return initializeApp({ credential: cert(credentials), projectId: PROJECT_ID });
  }
  return initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}

/**
 * Asks Firebase Auth whether each uid still has a login, in batches of 100.
 *
 * Returns `{ known }` false for every uid in a batch the lookup could not
 * answer — a missing IAM role, for instance. Callers must treat "not known" as
 * alive: a failed lookup must never read as "this account is gone".
 */
function accountLookup() {
  const cache = new Map();
  let reportedFailure = false;

  return {
    async load(uids) {
      const missing = uids.filter((uid) => !cache.has(uid));
      for (let i = 0; i < missing.length; i += 100) {
        const chunk = missing.slice(i, i + 100);
        try {
          const res = await getAuth().getUsers(chunk.map((uid) => ({ uid })));
          const byUid = new Map(res.users.map((u) => [u.uid, u.customClaims || {}]));
          for (const uid of chunk) {
            cache.set(uid, { known: true, exists: byUid.has(uid), claims: byUid.get(uid) || {} });
          }
        } catch (err) {
          if (!reportedFailure) {
            console.log(
              `\nCould not read Firebase Auth: ${err.message}\n` +
                "Every account is being treated as alive, so nothing will be removed for a " +
                "missing login. Grant the service account the Firebase Authentication Admin " +
                "role and run again if you want that pass to work."
            );
            reportedFailure = true;
          }
          for (const uid of chunk) cache.set(uid, { known: false, exists: false });
        }
      }
    },
    get(uid) {
      const hit = cache.get(uid) || { known: false, exists: false, claims: {} };
      return { authKnown: hit.known, authExists: hit.exists, claims: hit.claims };
    },
    get failed() {
      return reportedFailure;
    },
  };
}

/** Queue of pending writes, flushed in batches. */
function writer(db) {
  let batch = db.batch();
  let queued = 0;
  let written = 0;
  return {
    async update(ref, data) {
      batch.update(ref, data);
      await this.tick();
    },
    async delete(ref) {
      batch.delete(ref);
      await this.tick();
    },
    async tick() {
      queued += 1;
      written += 1;
      if (queued >= BATCH_LIMIT) {
        await batch.commit();
        batch = db.batch();
        queued = 0;
      }
    },
    async flush() {
      if (queued > 0) await batch.commit();
      return written;
    },
  };
}

async function scrubPublicLeaderboard(db, pending) {
  const snap = await db.collection("PublicLeaderboard").get();
  const findings = { bannedField: [], accountName: [] };

  for (const entry of snap.docs) {
    const profile = await db.collection("Users").doc(entry.id).get();
    const plan = planPublicEntry(entry.data(), profile.exists ? profile.data() : {});

    const patch = {};
    for (const field of plan.delete) patch[field] = FieldValue.delete();
    if (plan.delete.length > 0) findings.bannedField.push(entry.id);
    if (plan.displayName) {
      patch.displayName = plan.displayName;
      findings.accountName.push(entry.id);
    }

    if (Object.keys(patch).length > 0 && APPLY) {
      await pending.update(entry.ref, patch);
    }
  }
  return { scanned: snap.size, ...findings };
}

/**
 * Everything a dead account leaves behind, removed as a whole: the profile and
 * its subcollections, the public row, and every quiz score. Nothing is removed
 * unless Firebase Auth confirmed the login is gone.
 */
async function removeDeadAccount(db, uid, scorePaths, { apply }) {
  const paths = [`Users/${uid}`, `PublicLeaderboard/${uid}`, ...scorePaths];
  if (!apply) return paths;

  // recursiveDelete takes the profile's subcollections (enrolledCourses,
  // quizAttempts) with it; a plain delete would leave them stranded.
  await db.recursiveDelete(db.collection("Users").doc(uid));
  await db.collection("PublicLeaderboard").doc(uid).delete();
  for (const path of scorePaths) await db.doc(path).delete();
  return paths;
}

async function scrubQuizScores(db, pending) {
  // A collection-group query, NOT a walk from QuizLeaderboards: `Quiz.jsx`
  // writes straight into the Scores subcollection, so the parent documents do
  // not exist and `collection("QuizLeaderboards").get()` returns nothing. That
  // is why the first run of this job reported zero rows while the boards
  // visibly had entries.
  const scores = await db.collectionGroup("Scores").get();
  const findings = {
    bannedField: [],
    skipped: [],
    deadAccounts: [],
    removed: [],
    adminAccounts: [],
    adminRows: [],
  };

  const rows = scores.docs.filter((d) => {
    if (isQuizScorePath(d.ref.path)) return true;
    findings.skipped.push(d.ref.path);
    return false;
  });

  // One Auth round trip for the whole board, not one per row.
  const accounts = accountLookup();
  await accounts.load([...new Set(rows.map((d) => d.id))]);

  const byDeadUid = new Map();
  const byAdminUid = new Map();
  for (const score of rows) {
    const uid = score.id;
    const account = accounts.get(uid);

    if (isDeadAccount(account)) {
      byDeadUid.set(uid, [...(byDeadUid.get(uid) || []), score.ref.path]);
      continue;
    }
    // An administrator is not a learner: their scores do not belong on a board
    // other learners read, and they show up there as an account nobody can
    // account for.
    if (isAdminAccount(account)) {
      byAdminUid.set(uid, [...(byAdminUid.get(uid) || []), score.ref.path]);
      continue;
    }

    const banned = planQuizScore(score.data());
    if (banned.length === 0) continue;
    const patch = {};
    for (const field of banned) patch[field] = FieldValue.delete();
    findings.bannedField.push(score.ref.path);
    if (APPLY) await pending.update(score.ref, patch);
  }

  // Removing everything an account owned deserves a brake that clearing a
  // field does not: at this rate the lookup is likelier wrong than the data.
  const scanned = rows.length;
  const guard = orphanGuard(byDeadUid.size, new Set(rows.map((d) => d.id)).size);
  for (const [uid, paths] of byDeadUid) {
    const removable = await removeDeadAccount(db, uid, paths, { apply: APPLY && !guard.abort });
    findings.deadAccounts.push(uid);
    findings.removed.push(...removable);
  }

  // An admin keeps their account; only the learner documents go.
  for (const [uid, paths] of byAdminUid) {
    findings.adminAccounts.push(uid);
    findings.adminRows.push(...paths);
    if (APPLY) {
      for (const path of paths) await pending.delete(db.doc(path));
      const publicRef = db.collection("PublicLeaderboard").doc(uid);
      if ((await publicRef.get()).exists) {
        findings.adminRows.push(`PublicLeaderboard/${uid}`);
        await pending.delete(publicRef);
      }
    }
  }

  return { scanned, guard, authUnavailable: accounts.failed, ...findings };
}

async function main() {
  init();
  const db = getFirestore();
  const pending = writer(db);

  console.log(`mode: ${APPLY ? "APPLY (writing)" : "REPORT (read only)"}`);
  console.log(`project: ${PROJECT_ID}\n`);

  const board = await scrubPublicLeaderboard(db, pending);
  const scores = await scrubQuizScores(db, pending);
  const written = await pending.flush();

  console.log(`PublicLeaderboard: ${board.scanned} rows scanned`);
  console.log(`  rows carrying a banned field: ${board.bannedField.length}`);
  board.bannedField.forEach((id) => console.log(`    ${maskPath(`PublicLeaderboard/${id}`)}`));
  console.log(`  rows showing the account name: ${board.accountName.length}`);
  board.accountName.forEach((id) => console.log(`    ${maskPath(`PublicLeaderboard/${id}`)}`));

  console.log(`\nQuiz scores: ${scores.scanned} rows scanned`);
  console.log(`  rows carrying a banned field: ${scores.bannedField.length}`);
  scores.bannedField.forEach((path) => console.log(`    ${maskPath(path)}`));
  console.log(`  accounts with no login left: ${scores.deadAccounts.length}`);
  if (scores.removed.length > 0) {
    console.log(`  documents that belong to them: ${scores.removed.length}`);
    scores.removed.forEach((path) => console.log(`    ${maskPath(path)}`));
    console.log("    (a profile also takes its enrolledCourses and quizAttempts with it)");
  }
  console.log(`  learner rows owned by an admin account: ${scores.adminRows.length}`);
  scores.adminRows.forEach((path) => console.log(`    ${maskPath(path)}`));
  if (scores.skipped.length > 0) {
    console.log(`  paths outside QuizLeaderboards, left alone: ${scores.skipped.length}`);
    scores.skipped.forEach((path) => console.log(`    ${maskPath(path)}`));
  }

  if (scores.guard.abort) {
    console.log(
      `\nSTOPPED: ${Math.round(scores.guard.ratio * 100)}% of the learners on these boards have ` +
        `no login left, above the ${Math.round(ORPHAN_ABORT_RATIO * 100)}% limit. Nothing was ` +
        `removed — at that rate the lookup is likelier to be wrong than the data. Check the ` +
        `paths above first.`
    );
  }

  const total =
    board.bannedField.length +
    board.accountName.length +
    scores.bannedField.length +
    scores.adminRows.length +
    (scores.guard.abort ? 0 : scores.removed.length);
  console.log(`\n${total} document(s) need cleaning. ${APPLY ? `${written} written.` : "Nothing was written."}`);
  if (!APPLY && total > 0) console.log("Re-run the workflow with mode: apply to clean them.");
}

main().catch((err) => {
  console.error("Scrub failed:", err.message);
  process.exit(1);
});
