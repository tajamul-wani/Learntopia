import { useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

// How often a learner with the app open stamps their profile. The admin
// dashboard counts someone as online while the stamp is newer than
// ONLINE_WINDOW_MS, which leaves room for one missed beat.
export const HEARTBEAT_MS = 5 * 60 * 1000;
export const ONLINE_WINDOW_MS = 7 * 60 * 1000;

/**
 * Stamps Users/{uid}.lastActive while a learner has the app open and visible.
 * Admins are never stamped: they have no learner profile.
 */
export default function usePresence(uid, enabled) {
  useEffect(() => {
    if (!uid || !enabled) return undefined;

    const beat = () => {
      if (document.visibilityState !== "visible") return;
      // The profile may not exist yet on a first sign-in; that is fine, the
      // next beat lands once it does.
      updateDoc(doc(db, "Users", uid), { lastActive: serverTimestamp() }).catch(() => {});
    };

    beat();
    const id = setInterval(beat, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", beat);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", beat);
    };
  }, [uid, enabled]);
}
