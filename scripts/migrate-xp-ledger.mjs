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
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";
import {
  grantsFromEnrolment,
  grantsFromQuizBest,
  planLedger,
  planAlignment,
} from "./lib/xp-migration.mjs";
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

/**
 * The uids carrying the admin claim.
 *
 * An administrator is not a learner and must not be counted as one. If Auth
 * cannot be read the set comes back empty, which means nobody is treated as an
 * admin — the safe direction, since the alternative is removing a real
 * learner's profile on the strength of a failed lookup.
 */
async function adminUids(uids) {
  const admins = new Set();
  for (let i = 0; i < uids.length; i += 100) {
    const chunk = uids.slice(i, i + 100);
    try {
      const res = await getAuth().getUsers(chunk.map((uid) => ({ uid })));
      for (const user of res.users) {
        if (user.customClaims?.admin === true) admins.add(user.uid);
      }
    } catch (err) {
      console.log(
        `\nCould not read Firebase Auth: ${err.message}\n` +
          "No account is being treated as an administrator, so nothing will be " +
          "removed on that basis."
      );
      return new Set();
    }
  }
  return admins;
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
  const admins = await adminUids(users.docs.map((d) => d.id));

  let batch = db.batch();
  let queued = 0;
  let written = 0;
  let learnersWithLedger = 0;
  let learnersDone = 0;
  let aligned = 0;
  const adminProfiles = [];

  for (const user of users.docs) {
    const uid = user.id;

    // An administrator is not a learner: their profile document is the last
    // learner-shaped thing that account owns, and while it exists they are
    // counted among the learners here while the dashboard and the leaderboard
    // correctly show fewer.
    if (admins.has(uid)) {
      adminProfiles.push(`Users/${uid}`);
      if (APPLY) await db.recursiveDelete(db.collection("Users").doc(uid));
      continue;
    }

    // One number, not two. `xp` levels a learner up, `totalPoints` is what the
    // board shows, and an older version let them drift apart. Raise xp to meet
    // the score the learner has been shown; never lower what they see.
    const alignment = planAlignment(user.data());
    if (alignment) {
      aligned += 1;
      console.log(
        `${maskPath(`Users/${uid}`)}: shown ${alignment.xp}, levelled from ` +
          `${Number(user.data().xp) || 0} — raising xp to match`
      );
      if (APPLY) {
        await db.collection("Users").doc(uid).update({ xp: alignment.xp });
        const legacyRef = db.collection("Users").doc(uid).collection("xpLedger").doc("legacy-balance");
        const legacy = await legacyRef.get();
        await legacyRef.set({
          type: "legacy",
          amount: (legacy.exists ? Number(legacy.data().amount) || 0 : 0) + alignment.legacyTopUp,
          grantedAt: new Date(),
        });
      }
    }

    const currentXp = alignment ? alignment.xp : Number(user.data().xp) || 0;

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

  console.log(`\n${users.size - adminProfiles.length} learner(s) scanned`);
  if (adminProfiles.length > 0) {
    console.log(`  admin account(s) skipped, profile removed: ${adminProfiles.length}`);
    adminProfiles.forEach((path) => console.log(`    ${maskPath(path)}`));
  }
  console.log(`  score fields brought together: ${aligned}`);
  console.log(`  already had a ledger, skipped: ${learnersWithLedger}`);
  console.log(`  needing a ledger: ${learnersDone}`);
  console.log(APPLY ? `  entries written: ${written}` : "  Nothing was written.");
  if (!APPLY && learnersDone > 0) console.log("\nRe-run the workflow with mode: apply to build them.");
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
