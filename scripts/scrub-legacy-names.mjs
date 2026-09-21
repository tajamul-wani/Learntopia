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
import { planPublicEntry, planQuizScore } from "./lib/legacy-names.mjs";

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
  const boards = await db.collection("QuizLeaderboards").get();
  const findings = { bannedField: [] };
  let scanned = 0;

  for (const board of boards.docs) {
    const scores = await board.ref.collection("Scores").get();
    scanned += scores.size;
    for (const score of scores.docs) {
      const banned = planQuizScore(score.data());
      if (banned.length === 0) continue;
      const patch = {};
      for (const field of banned) patch[field] = FieldValue.delete();
      findings.bannedField.push(`${board.id}/${score.id}`);
      if (APPLY) await pending.update(score.ref, patch);
    }
  }
  return { scanned, ...findings };
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
  scores.bannedField.forEach((path) => console.log(`    QuizLeaderboards/${path}/Scores`));

  const total = board.bannedField.length + board.accountName.length + scores.bannedField.length;
  console.log(`\n${total} document(s) need cleaning. ${APPLY ? `${written} written.` : "Nothing was written."}`);
  if (!APPLY && total > 0) console.log("Re-run the workflow with mode: apply to clean them.");
}

main().catch((err) => {
  console.error("Scrub failed:", err.message);
  process.exit(1);
});
