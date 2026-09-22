import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { parseProfileName, hasChosenIdentity } from "../utils/profileUtils";
import { generatePublicNickname, publicNameFor } from "../utils/publicName";
import { randomPetAvatarId } from "../data/avatarData";
import AppLoader from "../Components/ui/AppLoader";

/**
 * AuthContext.jsx
 * Provides authentication state, admin authority checking, and
 * profile customization management.
 */
const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // True when a signed-in student has NO custom displayName or avatarId yet.
  // App reads this to gate first-time users into the required EditProfileView.
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  // True for a learner who has never chosen a name and avatar of their own:
  // their identity still comes from the Google account, or from a version of
  // the app that never asked. They are prompted once, then never again.
  const [needsIdentityChoice, setNeedsIdentityChoice] = useState(false);

  /**
   * Google Sign In flow.
   */
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    // Always offer the account picker. Google's default is to reuse whichever
    // account is already signed in on this browser, and signing out of the app
    // cannot sign anyone out of Google — so without this, someone with two
    // accounts (an admin one and a learner one) can never reach the second.
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const tokenResult = await user.getIdTokenResult();
      if (tokenResult.claims.admin === true) {
        return user;
      }

      // Check if user document already exists in Firestore for student users
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const _t = new Date();
        const todayStr = `${_t.getFullYear()}-${String(_t.getMonth() + 1).padStart(2, "0")}-${String(_t.getDate()).padStart(2, "0")}`;
        await setDoc(userRef, {
          email: user.email,
          fullName: user.displayName || "New User",
          totalPoints: 0,
          badges: ["Newcomer"],
          streak: 1,
          lastLoginDate: todayStr,
        });
        // Brand-new user → needs profile setup
        setNeedsProfileSetup(true);
      } else {
        // Existing user — check if they already completed profile setup
        const data = userSnap.data();
        const { displayName, avatarId } = parseProfileName(data);
        setNeedsProfileSetup(!displayName || !avatarId);
        setNeedsIdentityChoice(!hasChosenIdentity(data));
      }
      return user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  /**
   * Save the user's chosen display name and avatar to both their private
   * profile and the public leaderboard entry with fallback handling.
   */
  const completeProfileSetup = async (displayName, avatarId, options = {}) => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const cleanName = displayName.trim();
    // Whether to show the user's real photo (Google account picture) on their
    // OWN private surfaces (Dashboard/Navbar). This never touches the public
    // leaderboard — a child's real face is not shown to other users.
    const usePhoto = !!options.usePhoto;

    // 1. Instant local storage backup
    try {
      localStorage.setItem(
        `learntopia_custom_profile_${uid}`,
        JSON.stringify({ displayName: cleanName, avatarId })
      );
    } catch (e) {
      console.warn("localStorage write error:", e);
    }

    const userRef = doc(db, "Users", uid);
    let existing = {};
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        existing = userSnap.data();
      }
    } catch (e) {
      console.warn("Error reading user snap before setup:", e);
    }

    // 2. Primary write. Identity is stored in the dedicated displayName/avatarId
    // fields (the rules allow them); fullName just holds the plain display name.
    // photoURL is the Google account picture (private surfaces only); only write
    // it when it's actually a string so the strict rules accept the profile.
    const photo = currentUser.photoURL || existing.photoURL || null;
    const profileWrite = {
      email: existing.email || currentUser.email || "",
      fullName: cleanName,
      displayName: cleanName,
      avatarId: avatarId,
      totalPoints: existing.totalPoints || 0,
      streak: existing.streak || 1,
      badges: existing.badges || ["Newcomer"],
      usePhoto,
      identityConfirmedAt: new Date(),
      updatedAt: new Date(),
    };
    if (photo) profileWrite.photoURL = photo;
    try {
      await setDoc(userRef, profileWrite, { merge: true });
    } catch (err) {
      console.warn("Primary profile write failed, retrying minimal write:", err);
      await setDoc(
        userRef,
        {
          email: existing.email || currentUser.email || "",
          fullName: cleanName,
          totalPoints: existing.totalPoints || 0,
          streak: existing.streak || 1,
          badges: existing.badges || ["Newcomer"],
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    // 3. Mirror write for PublicLeaderboard
    try {
      const publicRef = doc(db, "PublicLeaderboard", uid);
      await setDoc(
        publicRef,
        {
          uid,
          displayName: cleanName,
          avatarId: avatarId,
          // Clears a real name written by an older version of the app.
          fullName: deleteField(),
          totalPoints: existing.totalPoints || 0,
          streak: existing.streak || 1,
          badges: (existing.badges || ["Newcomer"]).map((b) => (typeof b === "string" ? b : b.name || "Badge")),
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch {
      try {
        const publicRef = doc(db, "PublicLeaderboard", uid);
        await setDoc(
          publicRef,
          {
            uid,
            displayName: cleanName,
            fullName: deleteField(),
            totalPoints: existing.totalPoints || 0,
            streak: existing.streak || 1,
            badges: (existing.badges || ["Newcomer"]).map((b) => (typeof b === "string" ? b : b.name || "Badge")),
            updatedAt: new Date(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn("Leaderboard mirror notice:", e);
      }
    }

    setNeedsProfileSetup(false);
    setNeedsIdentityChoice(false);
  };

  /**
   * The learner declined to choose. Their account name stays private, the
   * public row gets a generated nickname rather than anything from Google, and
   * the avatar becomes a gender-neutral Critter so no child is left wearing a
   * gendered face they never picked.
   */
  const skipIdentityChoice = async () => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const avatarId = randomPetAvatarId();

    const userRef = doc(db, "Users", uid);
    let existing = {};
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) existing = snap.data();
    } catch (e) {
      console.warn("Error reading profile before skip:", e);
    }

    try {
      await updateDoc(userRef, {
        avatarId,
        identityConfirmedAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (e) {
      console.warn("Identity skip write notice:", e);
      return;
    }

    try {
      await setDoc(
        doc(db, "PublicLeaderboard", uid),
        {
          uid,
          displayName: publicNameFor(existing),
          avatarId,
          // Clears a real name written by an older version of the app.
          fullName: deleteField(),
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn("Leaderboard mirror notice:", e);
    }

    setNeedsIdentityChoice(false);
  };

  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setIsAdmin(false);
        setNeedsProfileSetup(false);
        setNeedsIdentityChoice(false);
        setLoading(false);
        return;
      }

      // Admin authority comes solely from the server-set custom claim — no email
      // appears in the client bundle.
      let admin = false;
      try {
        const tokenResult = await user.getIdTokenResult();
        admin = tokenResult.claims.admin === true;
      } catch (err) {
        console.error("Error reading auth claims:", err);
      }
      setIsAdmin(admin);
      // Unblock initial app load immediately (~10ms) so cold start is instant.
      setLoading(false);

      // SECURITY GUARD: Never create or update student profile or leaderboard for the Administrator
      if (admin) return;

      // Run profile initialization and daily streak checks asynchronously in background
      (async () => {
        try {
          const userRef = doc(db, "Users", user.uid);
          const userSnap = await getDoc(userRef);

          const today = new Date();
          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

          if (!userSnap.exists()) {
            // Initialize private student profile
            await setDoc(userRef, {
              email: user.email || "",
              fullName: user.displayName || "New User",
              totalPoints: 0,
              badges: ["Newcomer"],
              streak: 1,
              lastLoginDate: todayStr,
            });

            // The account name (a real name for Google sign-ins) stays in the
            // private profile above. The board gets a nickname until the learner
            // picks a display name of their own.
            const publicRef = doc(db, "PublicLeaderboard", user.uid);
            await setDoc(publicRef, {
              uid: user.uid,
              displayName: generatePublicNickname(),
              totalPoints: 0,
              streak: 1,
              badges: ["Newcomer"],
              updatedAt: new Date()
            }, { merge: true });

            // New profile → needs setup
            setNeedsProfileSetup(true);
            setNeedsIdentityChoice(false);
          } else {
            const data = userSnap.data();

            const { displayName: parsedName, avatarId: parsedAvatar } = parseProfileName(data);
            setNeedsProfileSetup(!parsedName || !parsedAvatar);
            setNeedsIdentityChoice(!hasChosenIdentity(data));

            const lastDateStr = data.lastLoginDate;

            // Only update if the user hasn't been credited for today yet
            if (lastDateStr !== todayStr) {
              let newStreak;

              if (lastDateStr) {
                const [ly, lm, ld] = lastDateStr.split("-").map(Number);
                const [ty, tm, td] = todayStr.split("-").map(Number);
                const lastMidnight = Date.UTC(ly, lm - 1, ld);
                const todayMidnight = Date.UTC(ty, tm - 1, td);
                const diffDays = (todayMidnight - lastMidnight) / (1000 * 60 * 60 * 24);
                newStreak = diffDays === 1 ? (data.streak || 0) + 1 : 1;
              } else {
                newStreak = 1;
              }

              await updateDoc(userRef, {
                streak: newStreak,
                lastLoginDate: todayStr,
              });

              const publicRef = doc(db, "PublicLeaderboard", user.uid);
              await setDoc(publicRef, {
                streak: newStreak,
                updatedAt: new Date(),
              }, { merge: true });
            }
          }
        } catch (err) {
          console.error("Error updating background streak:", err);
        }
      })();
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    needsProfileSetup,
    needsIdentityChoice,
    googleSignIn,
    logOut,
    completeProfileSetup,
    skipIdentityChoice,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show the branded loader (not a blank screen) while auth resolves, so
          there's no empty frame between the HTML splash and the real app. */}
      {loading ? <AppLoader /> : children}
    </AuthContext.Provider>
  );
}
