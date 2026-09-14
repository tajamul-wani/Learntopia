import { AUTH_EMULATOR, FIRESTORE_EMULATOR } from "./support/emulator.js";

// The e2e suite runs the app against the local Firebase emulators. If they are
// not up, every Firebase call in the app fails in confusing ways, so stop early
// with the command that starts them.
export default async function globalSetup() {
  const targets = [
    ["Auth emulator", AUTH_EMULATOR],
    ["Firestore emulator", FIRESTORE_EMULATOR],
  ];
  for (const [name, url] of targets) {
    try {
      await fetch(url);
    } catch {
      throw new Error(
        `${name} is not reachable at ${url}.\n` +
          "Run the suite with `npm run test:e2e` (starts the emulators for you), or start them " +
          "in another terminal with `npm run emulators` and then use `npx playwright test`."
      );
    }
  }
}
