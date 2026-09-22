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
 * nothing. `apply` writes. Neither mode ever prints a name: the output is
 * document paths and counts, because CI logs are readable by anyone with
 * access to the run.
 *
 * Usage (locally, with GOOGLE_APPLICATION_CREDENTIALS set):
 *   node scripts/scrub-legacy-names.mjs            # report
 *   node scripts/scrub-legacy-names.mjs --apply    # write
 */
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import {
  planPublicEntry,
  planQuizScore,
  isQuizScorePath,
  isOrphan,
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

async function scrubQuizScores(db, pending) {
  // A collection-group query, NOT a walk from QuizLeaderboards: `Quiz.jsx`
  // writes straight into the Scores subcollection, so the parent documents do
  // not exist and `collection("QuizLeaderboards").get()` returns nothing. That
  // is why the first run of this job reported zero rows while the boards
  // visibly had entries.
  const scores = await db.collectionGroup("Scores").get();
  const findings = { bannedField: [], orphan: [], skipped: [] };

  for (const score of scores.docs) {
    if (!isQuizScorePath(score.ref.path)) {
      findings.skipped.push(score.ref.path);
      continue;
    }

    const uid = score.id;
    const [profile, publicRow] = await Promise.all([
      db.collection("Users").doc(uid).get(),
      db.collection("PublicLeaderboard").doc(uid).get(),
    ]);

    if (isOrphan({ userExists: profile.exists, publicExists: publicRow.exists })) {
      findings.orphan.push(score.ref.path);
      continue;
    }

    const banned = planQuizScore(score.data());
    if (banned.length === 0) continue;
    const patch = {};
    for (const field of banned) patch[field] = FieldValue.delete();
    findings.bannedField.push(score.ref.path);
    if (APPLY) await pending.update(score.ref, patch);
  }

  // Deleting whole documents deserves a brake that a field edit does not: at
  // this rate the query is likelier to be wrong than the data.
  const scanned = scores.size - findings.skipped.length;
  const guard = orphanGuard(findings.orphan.length, scanned);
  if (APPLY && !guard.abort) {
    for (const path of findings.orphan) await pending.delete(db.doc(path));
  }

  return { scanned, guard, ...findings };
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
  board.bannedField.forEach((id) => console.log(`    PublicLeaderboard/${id}`));
  console.log(`  rows showing the account name: ${board.accountName.length}`);
  board.accountName.forEach((id) => console.log(`    PublicLeaderboard/${id}`));

  console.log(`\nQuiz scores: ${scores.scanned} rows scanned`);
  console.log(`  rows carrying a banned field: ${scores.bannedField.length}`);
  scores.bannedField.forEach((path) => console.log(`    ${path}`));
  console.log(`  rows whose owner no longer exists: ${scores.orphan.length}`);
  scores.orphan.forEach((path) => console.log(`    ${path}`));
  if (scores.skipped.length > 0) {
    console.log(`  paths outside QuizLeaderboards, left alone: ${scores.skipped.length}`);
    scores.skipped.forEach((path) => console.log(`    ${path}`));
  }

  if (scores.guard.abort) {
    console.log(
      `\nSTOPPED: ${Math.round(scores.guard.ratio * 100)}% of quiz score rows look ownerless, ` +
        `above the ${Math.round(ORPHAN_ABORT_RATIO * 100)}% limit. Nothing was deleted — ` +
        `at that rate the query is likelier to be wrong than the data. Check the paths above first.`
    );
  }

  const total =
    board.bannedField.length +
    board.accountName.length +
    scores.bannedField.length +
    (scores.guard.abort ? 0 : scores.orphan.length);
  console.log(`\n${total} document(s) need cleaning. ${APPLY ? `${written} written.` : "Nothing was written."}`);
  if (!APPLY && total > 0) console.log("Re-run the workflow with mode: apply to clean them.");
}

main().catch((err) => {
  console.error("Scrub failed:", err.message);
  process.exit(1);
});
