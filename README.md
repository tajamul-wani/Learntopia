<div align="center">

<img src="public/logo.svg" alt="Learntopia" width="112" height="112" />

# Learntopia

**A free e-learning platform for children and teenagers, ages 7 to 16.**
Interactive courses, timed quizzes, XP and badges, and a global leaderboard.

[![Live](https://img.shields.io/badge/Live-learntopia--react.web.app-7c3aed?style=for-the-badge&logo=firebase&logoColor=white)](https://learntopia-react.web.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)

</div>

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [Security and privacy](#security-and-privacy)
- [Brand assets](#brand-assets)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Learntopia teaches coding, maths, money and creative skills to learners aged 7
to 16. Courses are split into short modules with lessons and exercises, quizzes
are timed and scored, and progress earns XP, levels and badges. Everything is
free, with no ads.

Visitors can browse courses and take quizzes as guests. Signing in saves
progress, unlocks the dashboard and the leaderboard, and lets a learner pick a
display name and avatar.

The app is a React single-page app on Firebase: Authentication for sign-in,
Firestore for data, Hosting for delivery, and two Cloudflare Workers for jobs
that must not run in the browser. It is built to work on phones first and is
translated into English and Spanish.

---

## Features

### Learning

- **Course catalog** with search: multi-module tracks, per-module progress and
  completion tracking.
- **Lesson player**: paginated steps with themed cards (story, concept, fun
  fact, tip, example, activity, recap), progress dots and code blocks.
- **Exercises**: multiple choice, true/false, fill in the blank, and
  tap-to-connect matching pairs, with colour-linked pairs that stay in place.
- **Journey map**: the syllabus as a path of nodes (done, current, locked)
  ending in a certificate node.
- **Timed quizzes**: 15 seconds per question, randomised, with instant feedback
  and per-quiz leaderboards.
- **AI tutor**: a per-course assistant powered by Google Gemini, with a
  kid-safe prompt. The API key stays in a Cloudflare Worker, never in the app.

### Progress and motivation

- **XP and levels**: XP per module and per course, from Rookie Coder to
  Grandmaster.
- **Badges**: animated medallions for milestones, each with a vector fallback.
- **Daily streaks**: a UTC-based counter with bonus XP at 7, 15 and 30 days.
- **Celebrations**: a full-screen moment for a level-up, badge or reaching the
  top of the leaderboard, queued when several land at once and reduced for
  users who prefer less motion.
- **Anti-farming**: a module grants XP once, and a quiz retake only rewards
  beating your best score. Security rules cap scores by question count.
- **Dashboard**: profile header, XP, streak and course metrics, course tabs
  (enrolled, completed, unenrolled), quiz history and a continue-learning
  spotlight.
- **Leaderboards**: a global board by total points and one per quiz, both for
  signed-in users.

### Accounts

- **Sign-in**: email and password, or Google.
- **Profile setup**: first-time users choose a display name and one of 26
  built-in avatars, in two sets: 10 hand-drawn Critters and 16 characters. Real
  profile photos are never shown on the leaderboard.
- **Account deletion**: after confirming their password (or Google sign-in), a
  learner's profile, course progress, quiz history, leaderboard entries and
  login are all deleted, and the local cache is cleared.
- **Guest scores** taken before signing in are saved to the new account.

### Interface

- **Dark clay design system** built on design tokens. A palette guard fails CI
  if a colour outside the system appears.
- **English and Spanish** across the interface, courses, quizzes and legal
  pages. Only fully translated languages appear in the switcher.
- **Phone-first navigation**: a bottom tab bar below the `md` breakpoint,
  which hides during a lesson or quiz so progress is not lost by a stray tap.
- **Focus mode**: leaving a quiz or module asks for confirmation.
- **Instant splash**: an inline splash screen paints on the first frame, before
  the app's JavaScript runs.
- **Sound effects**: generated in the browser with the Web Audio API, with a
  persistent mute toggle. No audio files, no dependencies.
- **Notifications**: corner toasts for routine feedback and a centred modal for
  big moments, from one shared config.

### Operations

- **Error monitoring**: production crashes go to Sentry, with no reporting in
  development.
- **Automatic triage**: a new Sentry issue files a Linear task (Backlog, high
  priority, Bug) through a Cloudflare Worker that verifies Sentry's signature
  and de-duplicates by issue id.
- **SEO**: canonical links, Open Graph and Twitter cards, JSON-LD, and
  generated social images.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18, Vite 7, React Router 7 |
| Styling | Tailwind CSS with custom design tokens |
| Fonts | Fredoka and Poppins, bundled via `@fontsource` |
| Animation | GSAP, dotLottie player with self-hosted runtime and SVG fallbacks |
| Backend | Firebase Authentication and Cloud Firestore |
| Hosting | Firebase Hosting, deployed by GitHub Actions on merge to `main` |
| AI tutor | Google Gemini behind a Cloudflare Worker proxy (`worker/`) |
| Error triage | Sentry to Linear through a Cloudflare Worker (`worker-sentry-linear/`) |
| Testing | Playwright end-to-end, Firestore rules tests, and a palette guard |

---

## Getting started

### Prerequisites

- **Node.js 22**, the version in `.nvmrc` and in CI. With nvm: `nvm use`.
- **npm 9 or newer.**
- **A Java 17 runtime**, only for the tests: Google ships the Firebase
  emulators as Java programs. No part of this project is written in Java.
- **A Firebase project** with Authentication and Firestore enabled, if you want
  to run against your own backend. The tests do not need one.

`npm install` warns that two packages' install scripts were not run (`esbuild`,
`protobufjs`). That is deliberate: neither is needed, and running less
third-party code during install is safer.

### Install and run

```bash
git clone https://github.com/tajamul-wani/Learntopia.git
cd Learntopia
nvm use                 # Node 22, from .nvmrc
npm install

cp .env.example .env    # then fill in your Firebase values
npm run dev             # http://localhost:5173
```

### Scripts

```bash
npm run dev            # dev server with hot reload
npm run build          # production build into dist/
npm run preview        # serve the production build locally
npm run lint           # ESLint
npm run test:e2e       # Playwright suite against the emulators
npm run test:e2e:ui    # Playwright watch mode (run npm run emulators first)
npm run emulators      # Auth + Firestore emulators, for iterating on tests
npm run test:rules:ci  # Firestore rules tests in the emulator
npm run test:palette   # fails on colours outside the design system
npm run gen:avatars    # regenerate the 16 character avatar SVGs
```

---

## Testing

Three layers run in CI on every pull request, and a PR merges only when all of
them pass.

| Layer | What it covers |
|---|---|
| **End-to-end** (`e2e/`, Playwright) | Drives the real app in a browser: public pages, sign-in, courses, account deletion, navigation, brand assets and fonts |
| **Security rules** (`test/firestore.rules.test.js`) | Runs the real `firestore.rules` in the Firestore emulator: per-user isolation, anti-cheat, account deletion, admin-only data |
| **Static** (`npm run lint`, `npm run build`, `npm run test:palette`) | Lint errors, build breakage, and colours outside the design system |

**No credentials, and no internet.** The app under test talks to the local
Firebase Auth and Firestore emulators under the emulator-only
`demo-learntopia` project, so tests never read or write production data. Each
signed-in test creates a fresh account and signs in through the normal login
form; the app has no test mode or auth bypass. Every spec imports `test` from
`e2e/support/test.js`, which blocks requests to any host other than the local
machine and fails the test with the URL, so a new third-party dependency is
obvious immediately.

```bash
npm run test:e2e        # starts the emulators, runs everything, stops them

# iterating on one spec
npm run emulators         # terminal 1
npx playwright test --ui  # terminal 2
```

Locally the suite runs three tests at a time; CI runs one. Override with
`npx playwright test --workers=N`. Run one suite at a time: two runs share the
same ports and will interrupt each other.

The emulator connection in `src/firebase/firebase.js` exists only in
development builds, and `npm run build` fails if any of it reaches `dist/`.

---

## Project structure

```
src/
├── Authentication/     Login and SignUp pages
├── Components/         App components, plus ui/ design-system primitives
├── assets/             Images, course art and Lottie animations
├── context/            Auth, gamification, language, sound, toast, nav chrome
├── data/               Courses, quizzes and avatar definitions
├── firebase/           Firebase setup, including the emulator switch
├── hooks/              Shared React hooks
├── i18n/               English and Spanish strings, UI and course content
├── layout/             Root and admin layouts
├── lib/                Monitoring and DOM guards
├── pages/              Routed pages (home, courses, quiz, dashboard, docs, legal)
├── services/           Gemini client, account deletion
├── utils/              Profile, localisation, badges, sound helpers
├── App.jsx             Routes
└── main.jsx            Entry point

e2e/                    Playwright specs, with shared setup in support/
test/                   Firestore rules tests and the palette guard
scripts/                Brand and avatar generation, build checks
public/                 Brand SVG sources and generated PNGs
worker/                 Cloudflare Worker: Gemini proxy
worker-sentry-linear/   Cloudflare Worker: Sentry to Linear triage
```

---

## Environment variables

Create `.env` in the project root. It is listed in `.gitignore` and must never
be committed. `.env.example` is the template.

```env
# Firebase: Console > Project settings > SDK setup and configuration
VITE_API_KEY=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=

# AI tutor: URL of the deployed Gemini proxy Worker (see worker/README.md)
VITE_GEMINI_PROXY_URL=

# Optional. Each feature stays off while its value is blank.
VITE_SENTRY_DSN=              # Sentry error monitoring
VITE_RECAPTCHA_SITE_KEY=      # Firebase App Check (reCAPTCHA v3)
```

Every `VITE_` value is embedded in the JavaScript that users download, so **no
real secret may be a `VITE_` variable.** The values above are safe to publish:
the Firebase web API key identifies the project and is protected by security
rules and authorised domains, the Sentry DSN can only submit crash reports, the
reCAPTCHA site key is designed to be public, and the Worker URL is a public
endpoint.

Billable and privileged keys live outside the app: the **Gemini API key** and
the **Linear API key** are stored as Cloudflare Worker secrets, and CI reads
Firebase values from GitHub Actions secrets.

---

## Deployment

GitHub Actions handles every deploy. No manual step is needed.

| Trigger | What happens |
|---|---|
| Pull request | Rules tests, Playwright suite and a preview deploy on its own URL |
| Merge to `main` | Production deploy to Firebase Hosting, plus `firebase deploy --only firestore:rules` so rule changes go live with the code |

Manual deploy, if ever needed, requires Firebase project access:

```bash
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

---

## Security and privacy

Learntopia is used by children, so data access is deliberately narrow.

- **Security rules are the boundary.** `firestore.rules` denies everything by
  default. A signed-in user can read and write only their own profile, course
  progress and quiz history. Admin access comes from a server-set claim, never
  from an email address in the client.
- **Anti-cheat in the database.** XP and points can only increase, badges can
  only be added one per write, a quiz score cannot exceed its question count,
  and a course cannot be marked complete before its modules are.
- **Deleting an account deletes the data**: profile, progress, quiz history,
  every leaderboard entry and the login itself. Progress records can only be
  deleted as part of that flow, so they cannot be wiped to re-earn XP.
- **Photos stay private.** A Google profile photo is shown only to the learner
  on their own screens, never on the leaderboard.
- **App Check** (reCAPTCHA v3) is wired in and activates when
  `VITE_RECAPTCHA_SITE_KEY` is set, so Firebase can tell requests from the real
  app apart from scripted ones.
- **Secrets never reach the client.** Billable keys live in Cloudflare Worker
  secrets; CI injects Firebase config from GitHub Actions secrets; `.env` is
  git-ignored.
- **Rules are tested, not assumed.** The rules suite runs on every pull
  request, so a change that reopens a hole fails before merge.

---

## Brand assets

The logo is a glowing faceted bulb with paper-cut rays on a transparent
background. The SVGs in `public/` are the sources:

| File | Used for |
|---|---|
| `logo.svg` | Navbar, footer and this README |
| `favicon.svg` | Browser tab and the startup splash, with heavier strokes so it stays clear at 16px |
| `og-image.svg` | Social share card, with text stored as outlines |

Every colour in them is a design token, and `npm run test:palette` fails
otherwise. After editing an SVG, regenerate the PNGs:

```bash
npm i --no-save sharp
node scripts/gen-brand.mjs
```

---

## Contributing

The project is maintained by **Tajamul Wani**. Pull requests follow one rule
above all: a change ships with the tests that prove it.

1. Branch from an up-to-date `main`, named `feat/`, `fix/`, `chore/`,
   `design/`, `docs/`, `test/` or `ci/` plus a short description.
2. Keep one concern per branch and per pull request.
3. Add or update tests in the same branch: a Playwright spec for behaviour,
   rules tests for anything touching Firestore access.
4. Update the README in the same branch when the change affects setup, testing
   or how the app behaves.
5. Run everything before opening the PR:
   ```bash
   npm run lint && npm run build && npm run test:palette
   npm run test:rules:ci
   npm run test:e2e
   ```
6. Write commits that can be reverted on their own: group by what would be
   undone together, not by file. Use `type: imperative summary`.
7. Keep to the design system. New colours need discussion first, and the
   palette guard enforces the rest.
8. Every pull request must be green in CI before it merges.

---

## License

All rights reserved. The content, code and design of Learntopia are the
intellectual property of the project owner. Reproduction or redistribution
without permission is prohibited.
