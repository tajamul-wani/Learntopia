/**
 * Account deletion: removes everything a learner owns, then the account.
 *
 * What gets deleted:
 *   Users/{uid}                              private profile
 *   PublicLeaderboard/{uid}                  public leaderboard entry
 *   Users/{uid}/enrolledCourses/*            course progress
 *   Users/{uid}/quizAttempts/*               quiz history
 *   Users/{uid}/data/*                       private gamification state
 *   QuizLeaderboards/{quizId}/Scores/{uid}   per-quiz scores, every quiz
 *   the Firebase Auth account
 *   this browser's cached copy of the profile and Firestore data
 *
 * Order matters and matches firestore.rules:
 *   1. Re-authenticate. Firebase refuses to delete an account without a recent
 *      sign-in; doing this first means we never wipe the data and then fail to
 *      delete the account.
 *   2. Delete the profile and the public entry in one batch. The rules only
 *      allow the profile delete if the public entry goes with it.
 *   3. Delete the remaining owned documents, which the rules only allow once
 *      the profile is gone.
 *   4. Delete the Auth account.
 *
 * Leaderboard rank and the Champion medal are computed live from
 * PublicLeaderboard ordered by points, so once the entry is gone the next
 * learner moves up with no extra step.
 *
 * Every failure throws. Nothing is swallowed, so the UI can tell the user.
 */
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import {
  clearIndexedDbPersistence,
  collection,
  deleteDoc,
  doc,
  getDocs,
  terminate,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { quizzes } from "../data/quizData";

export { markAccountDeleted } from "./accountDeletedNotice";

/** "password" when the account signs in with email + password, otherwise "google". */
export const getReauthMethod = (user) =>
  user?.providerData?.some((p) => p.providerId === "password") ? "password" : "google";

/** Throws AccountDeletionError with a `step` so the UI can explain what failed. */
export class AccountDeletionError extends Error {
  constructor(step, cause) {
    super(`Account deletion failed at "${step}": ${cause?.code || cause?.message || cause}`);
    this.name = "AccountDeletionError";
    this.step = step;
    this.code = cause?.code;
    this.cause = cause;
  }
}

const reauthenticate = async (user, password) => {
  if (getReauthMethod(user) === "password") {
    const credential = EmailAuthProvider.credential(user.email, password || "");
    await reauthenticateWithCredential(user, credential);
  } else {
    await reauthenticateWithPopup(user, new GoogleAuthProvider());
  }
};

const deleteOwnedDocuments = async (uid) => {
  const [enrollments, attempts, privateData] = await Promise.all([
    getDocs(collection(db, "Users", uid, "enrolledCourses")),
    getDocs(collection(db, "Users", uid, "quizAttempts")),
    getDocs(collection(db, "Users", uid, "data")),
  ]);

  const refs = [
    ...enrollments.docs.map((d) => d.ref),
    ...attempts.docs.map((d) => d.ref),
    ...privateData.docs.map((d) => d.ref),
    // Deleting a score that doesn't exist is a no-op, so every quiz is covered
    // without first reading each leaderboard.
    ...quizzes.map((q) => doc(db, "QuizLeaderboards", q.id, "Scores", uid)),
  ];

  // Separate writes rather than one batch: each rule check reads the profile's
  // existence, and a batch has a small cap on those reads.
  const results = await Promise.allSettled(refs.map((ref) => deleteDoc(ref)));
  const failed = results.find((r) => r.status === "rejected");
  if (failed) throw failed.reason;
};

const clearLocalData = async (uid) => {
  try {
    localStorage.removeItem(`learntopia_custom_profile_${uid}`);
  } catch {
    // Storage can be unavailable (private mode); nothing to clear then.
  }
  // Remove this device's offline copy of the deleted user's Firestore data.
  // The Firestore instance can't be used after this, so the caller reloads.
  await terminate(db);
  await clearIndexedDbPersistence(db);
};

/**
 * Deletes the signed-in user's data and account.
 * @param {import("firebase/auth").User} user
 * @param {{ password?: string }} options  password is required for email accounts
 */
export const deleteAccountAndData = async (user, { password } = {}) => {
  if (!user) throw new AccountDeletionError("auth", new Error("not signed in"));
  const { uid } = user;

  try {
    await reauthenticate(user, password);
  } catch (err) {
    throw new AccountDeletionError("reauth", err);
  }

  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, "PublicLeaderboard", uid));
    batch.delete(doc(db, "Users", uid));
    await batch.commit();
  } catch (err) {
    throw new AccountDeletionError("profile", err);
  }

  try {
    await deleteOwnedDocuments(uid);
  } catch (err) {
    throw new AccountDeletionError("data", err);
  }

  try {
    await deleteUser(user);
  } catch (err) {
    throw new AccountDeletionError("account", err);
  }

  try {
    await clearLocalData(uid);
  } catch (err) {
    // The account and server data are already gone; a leftover local cache is
    // not worth failing over, but it is reported.
    console.error("Account deleted, but clearing local data failed:", err);
  }
};
