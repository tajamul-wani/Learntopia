/**
 * The panels of My Profile, in order.
 *
 * Account leads: opening your own profile should land on you, not on a list of
 * courses that /courses already shows. Badges are part of Account rather than a
 * tab of their own — a handful of medallions never filled a page.
 *
 * Kept beside the component rather than inside it: a file that exports both a
 * component and a constant loses fast refresh, and the tests read this order.
 */
export const PROFILE_TABS = [
  { id: "account", labelKey: "profile.tabAccount" },
  { id: "learning", labelKey: "profile.tabLearning" },
  { id: "finished", labelKey: "profile.tabFinished" },
  { id: "quizzes", labelKey: "profile.tabQuizzes" },
];
