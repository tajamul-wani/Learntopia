// Account deletion ends with a full page load (the Firestore instance is shut
// down to clear its offline cache), so the "profile deleted" confirmation is
// carried across it in sessionStorage. Kept apart from accountDeletion.js so
// the app shell can read the flag without loading the deletion code.

const DELETED_FLAG = "ltp_account_deleted";

export const markAccountDeleted = () => {
  try {
    sessionStorage.setItem(DELETED_FLAG, "1");
  } catch {
    // No session storage: the user simply won't see the confirmation.
  }
};

/** True once, right after a deletion reload. */
export const consumeAccountDeletedFlag = () => {
  try {
    const set = sessionStorage.getItem(DELETED_FLAG) === "1";
    sessionStorage.removeItem(DELETED_FLAG);
    return set;
  } catch {
    return false;
  }
};
