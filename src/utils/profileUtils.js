/**
 * profileUtils.js
 * Safely resolve a user's displayName and avatarId from a profile document.
 *
 * New writes store identity in the dedicated `displayName` / `avatarId` fields.
 * The encoded `fullName` = "Name|avatarId" format is LEGACY — older documents
 * written before the security rules allowed the dedicated fields still carry it,
 * so we keep reading (never writing) that encoding here as a back-compat
 * fallback. Do not reintroduce the encoded write.
 */

export const parseProfileName = (docData, fallbackName = "Learner") => {
  if (!docData) {
    return { displayName: fallbackName, avatarId: null };
  }

  let displayName = docData.displayName || "";
  let avatarId = docData.avatarId || null;

  // Legacy fallback: recover identity from the old "Name|avatarId" encoding.
  const rawFullName = docData.fullName || "";
  if (rawFullName.includes("|")) {
    const parts = rawFullName.split("|");
    if (!displayName) displayName = parts[0] || "";
    if (!avatarId) avatarId = parts[1] || null;
  } else if (!displayName && rawFullName) {
    displayName = rawFullName;
  }

  if (!displayName || displayName === "New User") {
    displayName = fallbackName;
  }

  return { displayName, avatarId };
};

/**
 * Whether the learner has ever chosen their own name and avatar.
 *
 * Reads the raw fields on purpose: parseProfileName falls back to `fullName`,
 * which for a Google sign-in is the account holder's real name, so a profile
 * that never chose anything would look like it had.
 *
 * @param {object|null} docData  the private profile document
 */
export const hasChosenIdentity = (docData) => {
  if (!docData) return false;
  if (docData.identityConfirmedAt) return true;
  const chosenName = typeof docData.displayName === "string" ? docData.displayName.trim() : "";
  return Boolean(chosenName) && Boolean(docData.avatarId);
};
