import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

/**
 * Holds a router navigation while the screen has unsaved work.
 *
 * useBlocker only exists inside a data router, and EditProfileView is also
 * rendered outside one during first-time setup, so the hook lives here — in a
 * child that the first-time screen never renders — instead of in the view.
 *
 * Props:
 *  - when       (bool) — there is unsaved work
 *  - onBlocked  (fn)   — called with the blocker once a navigation is held; the
 *                        parent asks the learner and then proceeds or resets it
 */
const UnsavedChangesGuard = ({ when, onBlocked }) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => when && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") onBlocked(blocker);
  }, [blocker, onBlocked]);

  return null;
};

export default UnsavedChangesGuard;
