/**
 * Names shown on the public leaderboard.
 *
 * Learntopia is used by children, so an account's real name must never appear
 * where other users can see it. A Google sign-in hands us the account holder's
 * real name, and that used to be copied straight onto the leaderboard. It now
 * stays in the private profile, and the board shows either the name the learner
 * chose or a generated nickname until they choose one.
 */

/** "Learner 4821". Four digits keep collisions rare without looking like an id. */
export const generatePublicNickname = () => `Learner ${Math.floor(1000 + Math.random() * 9000)}`;

/**
 * The name to publish for a learner.
 * @param {object|null} profile  their private profile document
 * @returns {string} their chosen display name, or a generated nickname
 */
export const publicNameFor = (profile) => {
  const chosen = typeof profile?.displayName === "string" ? profile.displayName.trim() : "";
  return chosen || generatePublicNickname();
};
