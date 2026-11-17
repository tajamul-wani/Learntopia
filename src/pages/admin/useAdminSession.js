import { useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../../context/ToastContext";

export const IDLE_MS = 15 * 60 * 1000;
export const MAX_SESSION_MS = 8 * 60 * 60 * 1000;

/**
 * An admin tab left open is not an open door: the session ends after 15
 * minutes without input, and after 8 hours since the last sign-in whatever
 * the activity, so a stolen or forgotten session cannot live on.
 */
export default function useAdminSession() {
  const { currentUser, isAdmin, logOut } = useAuth();
  // logOut is a new function every render; the timers must not restart for it.
  const logOutRef = useRef(logOut);
  useEffect(() => {
    logOutRef.current = logOut;
  });

  useEffect(() => {
    if (!isAdmin || !currentUser) return undefined;
    let cancelled = false;

    const end = async (message) => {
      if (cancelled) return;
      cancelled = true;
      try {
        await logOutRef.current();
      } finally {
        toast.info(message, { autoClose: 6000 });
      }
    };

    let idle;
    const arm = () => {
      clearTimeout(idle);
      idle = setTimeout(() => end("Signed out after 15 minutes without activity."), IDLE_MS);
    };
    const events = ["pointerdown", "keydown", "scroll"];
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    arm();

    currentUser.getIdTokenResult().then((r) => {
      const signedInAt = Date.parse(r.authTime);
      if (Number.isFinite(signedInAt) && Date.now() - signedInAt > MAX_SESSION_MS) {
        end("Signed out: please sign in again.");
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(idle);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [isAdmin, currentUser]);
}
