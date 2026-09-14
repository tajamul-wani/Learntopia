import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
const APIkey = import.meta.env.VITE_API_KEY;
const MDid = import.meta.env.VITE_MESSAGING_SENDER_ID;
const AppID = import.meta.env.VITE_APP_ID;

// --- Local emulators (end-to-end tests only) ---------------------------------
// Playwright runs the app against the Auth and Firestore emulators so signed-in
// specs need no real account and never touch production data. Both halves of the
// guard are required: import.meta.env.DEV is replaced with `false` in a
// production build, so this whole branch is dead code there and is removed, even
// if VITE_USE_EMULATORS were set by mistake. `npm run build` checks that none of
// it reaches dist/ (scripts/check-dist-no-emulator.mjs).
//
// The "demo-" project id is emulator-only: the SDK will not reach real Firebase
// services with it, which is a second safety net. This is not an auth bypass;
// the app still runs its normal sign-in flow, just against a local backend.
const USE_EMULATORS = import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS === "true";

const firebaseConfig = USE_EMULATORS
  ? {
      apiKey: "demo-api-key",
      authDomain: "demo-learntopia.firebaseapp.com",
      projectId: "demo-learntopia",
      appId: "demo-learntopia-web",
    }
  : {
      apiKey: APIkey,
      authDomain: "learntopia-react.firebaseapp.com",
      projectId: "learntopia-react",
      storageBucket: "learntopia-react.firebasestorage.app",
      messagingSenderId: MDid,
      appId: AppID,
    };

const app = initializeApp(firebaseConfig);

// --- Firebase App Check (reCAPTCHA v3) — DORMANT until a site key is set ------
// App Check verifies that requests come from YOUR real app (not a bot or a
// script replaying the public config), blocking direct abuse of Firestore.
// It stays OFF unless VITE_RECAPTCHA_SITE_KEY is provided, so nothing changes
// for local dev or a key-less deploy. App Check is loaded dynamically so it
// never enters the bundle when unused. It is also skipped against the
// emulators, which have no attestation to check.
//
// To activate (owner account, later): register the site for reCAPTCHA v3 and
// enable App Check in the Firebase console, then set VITE_RECAPTCHA_SITE_KEY
// (locally + as a GitHub secret). Enable enforcement in the console only after
// confirming real traffic passes (start in monitor mode).
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (RECAPTCHA_SITE_KEY && !USE_EMULATORS) {
  import("firebase/app-check")
    .then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true,
      });
    })
    .catch((err) => {
      // App Check must never break the app; a failure just means no attestation.
      console.error("App Check init failed (non-fatal):", err);
    });
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Connected synchronously, before anything else can read auth state or query
// Firestore, so no request can race to the real backend first.
if (USE_EMULATORS) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

export default app;
