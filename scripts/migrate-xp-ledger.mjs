/**
 * scripts/migrate-xp-ledger.mjs
 *
 * One-off: build an XP ledger for learners who earned XP before the ledger
 * existed (LT-83).
 *
 * Without this, a learner who finished a module last week can replay it and
 * claim its grant, because nothing records that they were already paid. The
 * migration writes those entries from stored progress, and closes whatever
 * cannot be attributed with a single reconciliation entry so every ledger sums
 * to the XP the learner already holds. Nobody loses XP; nobody can re-earn it.
 *
 * Two modes, as with the scrub. `report` (the default) reads and counts and
 * writes nothing. `apply` writes. Ids are cut short in the output because
 * Actions logs on a public repository are readable by anyone.
 *
 * Usage (locally, with GOOGLE_APPLICATION_CREDENTIALS set):
 *   node scripts/migrate-xp-ledger.mjs            # report
 *   node scripts/migrate-xp-ledger.mjs --apply    # write
 */
import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";
import { grantsFromEnrolment, grantsFromQuizBest, planLedger } from "./lib/xp-migration.mjs";
import { maskPath } from "./lib/legacy-names.mjs";

const APPLY = process.argv.includes("--apply");
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "learntopia-react";
const BATCH_LIMIT = 400;

function init() {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyFile) {
    const credentials = JSON.parse(readFileSync(keyFile, "utf8"));
    return initializeApp({ credential: cert(credentials), projectId: PROJECT_ID });
  }
  return initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}

/** Everything one learner has already been paid for, from what is stored. */
async function reconstruct(db, uid) {
  const grants = [];

  const enrolments = await db.collection("Users").doc(uid).collection("enrolledCourses").get();
  for (const doc of enrolments.docs) {
    grants.push(...grantsFromEnrolment(doc.data().courseId ?? doc.id, doc.data()));
  }

  // A quiz board row holds the learner's best run, which is exactly what the
  // score levels represent.
  const boards = await db.collectionGroup("Scores").get();
  for (const score of boards.docs) {
    if (score.id !== uid) continue;
    const parts = score.ref.path.split("/");
    if (parts.length !== 4 || parts[0] !== "QuizLeaderboards") continue;
    grants.push(...grantsFromQuizBest(parts[1], Number(score.data().rawScore) || 0));
  }

  return grants;
}

async function main() {
  init();
  const db = getFirestore();

  console.log(`mode: ${APPLY ? "APPLY (writing)" : "REPORT (read only)"}`);
  console.log(`project: ${PROJECT_ID}\n`);

  const users = await db.collection("Users").get();
  let batch = db.batch();
  let queued = 0;
  let written = 0;
  let learnersWithLedger = 0;
  let learnersDone = 0;

  for (const user of users.docs) {
    const uid = user.id;
    const currentXp = Number(user.data().xp) || 0;

    const existing = await db.collection("Users").doc(uid).collection("xpLedger").get();
    if (!existing.empty) {
      learnersWithLedger += 1;
      continue;
    }

    const plan = planLedger(currentXp, await reconstruct(db, uid));
    const all = plan.reconciliation ? [...plan.entries, plan.reconciliation] : plan.entries;
    if (all.length === 0) continue;

    learnersDone += 1;
    console.log(`${maskPath(`Users/${uid}`)}: ${currentXp} XP held`);
    console.log(`  reconstructed entries: ${plan.entries.length}`);
    if (plan.reconciliation) console.log(`  unattributed, carried as one entry: ${plan.reconciliation.amount}`);
    if (plan.total !== currentXp) {
      console.log(`  NOTE: ledger totals ${plan.total}, above the ${currentXp} held — old quiz bands paid less than today's levels. Balance unchanged.`);
    }

    if (!APPLY) continue;

    for (const entry of all) {
      batch.set(db.collection("Users").doc(uid).collection("xpLedger").doc(entry.key), {
        type: entry.type,
        amount: entry.amount,
        grantedAt: new Date(),
      });
      queued += 1;
      written += 1;
      if (queued >= BATCH_LIMIT) {
        await batch.commit();
        batch = db.batch();
        queued = 0;
      }
    }
  }

  if (APPLY && queued > 0) await batch.commit();

  console.log(`\n${users.size} learner(s) scanned`);
  console.log(`  already had a ledger, skipped: ${learnersWithLedger}`);
  console.log(`  needing a ledger: ${learnersDone}`);
  console.log(APPLY ? `  entries written: ${written}` : "  Nothing was written.");
  if (!APPLY && learnersDone > 0) console.log("\nRe-run the workflow with mode: apply to build them.");
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
