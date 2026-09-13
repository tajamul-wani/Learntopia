<div align="center">

<img src="public/logo.svg" alt="Learntopia" width="112" height="112" />

# Learntopia

**An interactive e-learning platform for children and teenagers.**  
Structured courses, timed quizzes, real-time progress tracking, and a global leaderboard — all in one place.

[![Live Demo](https://img.shields.io/badge/Live-learntopia--react.web.app-7c3aed?style=for-the-badge&logo=firebase&logoColor=white)](https://learntopia-react.web.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Learntopia is a full-stack e-learning web application that allows students to enrol in topic-specific course tracks, complete structured modules, and test their knowledge with randomized timed quizzes. Progress, scores, and streaks are stored securely in Firestore and visualised on a personal dashboard and a public leaderboard.

The platform is designed to be fast, accessible, and mobile-friendly, with authentication via Firebase (email/password and Google OAuth) and continuous deployment to Firebase Hosting.

---

## Features

| Feature | Description |
|---|---|
| **Custom Avatars & Profile Photos** | Custom display name and 16 pre-generated static SVG avatars (DiceBear "Adventurer", served as cached files — the library never ships to the client). A Girls/Boys/All filter in the picker, with each avatar's hair pinned long or short so the face matches its tab. Authenticated users can optionally toggle their Google account photo on private surfaces (Dashboard, Navbar) with automatic fallback to the avatar. Real photos are strictly excluded from the public leaderboard for COPPA/child-privacy safety (enforced in code, Firestore rules, and tests). |
| **Hybrid Notifications** | Zero-dependency, i18n notification system: corner toasts (auto-dismiss, hover-pause, progress bar) for routine feedback, and a centered clay modal for big moments (sign-up welcome, profile deletion). Each carries a tone accent bar and a soft tone-colored glow so it stands out, with a green success animation on positive confirmations (sign-in, sign-out, profile saved). One shared config drives each type's tone, icon, localized copy, and a distinct sound played once per trigger. |
| **Profile Setup & Editing** | First-time users complete a **required** full-screen profile step (display name + avatar). Editing later opens a **dedicated Edit Profile view** (not a popup) reached from the dashboard — a two-column layout with the account email shown read-only. Both flows share one component. |
| **Instant Branded Startup Splash** | Fast startup performance with an inline branded splash screen in `index.html` and `AppLoader` that paints on the very first frame to eliminate white/blank screens during initial script loading and auth resolution. |
| **Multi-Language (i18n)** | Global localization switcher. **English 🇺🇸 and Spanish 🇪🇸 are live and fully translated** (UI, all courses, quizzes, docs, legal pages). Additional languages are staged in the data and stay hidden from the switcher until each is complete end-to-end (a partial translation is worse UX than none). |
| **Gamified Course Overhaul** | Step-by-step interactive courses designed for kids aged 7-14 with rich learning cards (Story, Concept, Fun Fact, Pro Tip, Example, Activity, Recap). |
| **Web Audio SFX System** | Native Web Audio API sound synthesizer ($0 cost, 0 dependencies) with a persistent mute toggle. Distinct cues for clicks, correct/incorrect answers, module completion, level-ups, badge unlocks, streak milestones, and account actions (login, logout, profile saved/deleted), each played once per trigger. |
| **LessonPlayer Engine** | Paginated step-by-step lesson player with visual theme cards, progress dots, and code syntax blocks. |
| **Multi-Type Exercise Engine** | Comprehension challenges featuring Multiple Choice, True/False, Fill-in-the-Blank, and Tap-to-Connect Matching Pairs. |
| **XP, Levels & Animated Badges** | Earn XP per module (+50) and course (+100), leveling from Rookie Coder to Grandmaster. Achievements appear as animated badge medallions (dotLottie, each with a detailed SVG fallback): Newcomer (retires at Level 3), First Quiz, Quiz Ace, First Course, Scholar, Rising Star, and Code Wizard, plus stored awards — Champion (leaderboard #1), Streak Master (30-day streak), Perfect Score (100% on a quiz), and Sharp Memory (barely any mistakes across quizzes or a full course). Milestone moments (level-up, badge earned, reaching #1) trigger a global, full-screen celebration that plays the matching animation with a success sound and then auto-fades (click or hover to control it; queued in sequence when several land at once, and honoring reduced-motion); the player's WASM is self-hosted, and every animation degrades to its SVG if it cannot load. |
| **XP Anti-Farming** | XP is earned once, not repeated. A module grants its XP only on first completion, and a quiz retake awards XP only for beating the previous best; either way the user gets a clear "no new XP" message instead of silent nothing. Firestore rules bound a quiz score by its question count and reject impossible course-accuracy counters, so scores can't be inflated from the client. |
| **Course Catalog** | Searchable catalog of multi-module course tracks with enrollment, per-module progress, and course completion tracking. |
| **Timed Quizzes** | 15-second per-question randomized quizzes with instant feedback, score logging, and per-quiz leaderboards. |
| **Quiz Completion Indicators** | Done badge and best score on completed quiz cards; Start button becomes Retake. Incomplete attempts are never logged. |
| **Personal Dashboard** | Student hub with a profile header (avatar, level badge, animated achievement medallions, real level-XP progress bar), 4 metric cards (XP, streak, enrolled, completed), 3-tier course cards, sub-navigation views (Overview, Enrolled Courses, Completed, Quiz History, plus an Unenrolled tab that appears when you leave a course), a Continue-Learning spotlight, and a Daily Streak weekly tracker. Restrained core-color design (violet + sky accents, gold for rewards and streaks; status colors only for status) and fully responsive. |
| **Daily Streaks & Milestone Rewards** | Consecutive daily login counter tracked with `Date.UTC` integer arithmetic (DST-safe), global and real-time across devices. Milestone popups at **7 / 15 / 30 days** grant bonus XP (**+20 / +40 / +80**), shown once per day from server-confirmed data. Resets on a missed day. |
| **Global Leaderboard** | Public leaderboard ranking all users by total points and quiz scores. Access restricted exclusively to authenticated users. |
| **Guest Score Preservation** | Guest quiz scores are automatically saved to the user profile when signing in or registering from the results screen. |
| **Google Gemini AI Tutor** | Interactive slide-out AI assistant powered by Google Gemini (`AIChatDrawer.jsx`). Each course features a persona-driven AI tutor (*Robo-Py, Count AI-Cula, CoinBot, PixelBot, MarketBot, ArtBot*) rendering distinct glowing-orb vector SVG avatars (`BotAvatar.jsx`), kept distinct from the bulb brand logo so a course tutor is never mistaken for the app itself, providing kid-friendly, course-contextual responses and hints in real-time. Calls go through a **Cloudflare Worker proxy** (`worker/`) that holds the Gemini API key server-side, so it never ships in the client bundle; the app only knows the proxy URL. |
| **Strict Focus Mode** | Route-level navigation blocker prevents accidental loss of quiz or module progress. |
| **Thumb-Reach Mobile Navigation** | Below `md` the hamburger and its drawer are replaced by a persistent bottom tab bar, so changing route is one thumb tap instead of two into the hardest-to-reach corner. Signed out it carries Home, Courses, Quiz and Contact; signing in swaps Contact (still in the footer) for Leaderboard and a profile tab showing the user's own avatar. It hides while a module or quiz is in progress, so it never invites the navigation Strict Focus Mode exists to block. Desktop navigation is unchanged. |
| **Journey-Map Course View** | The syllabus renders as a winding path of clay nodes — done / current / locked — ending in a certificate node, with the course's AI tutor as a guide at the finish. Fully responsive: on phones the connecting rail is hidden, node markers shrink, and lesson cards expand to full width. |
| **Gated Enrollment** | Featured course cards use an **Enroll now** call to action that sends logged-out visitors to login first (carrying a `returnTo`), so after signing in they land on the course they picked and are enrolled on arrival. Logged-in visitors go straight through. |
| **Course Controls** | Resume or reset courses from the dashboard. Unenrolling is non-destructive — progress and XP are kept and the course moves to an Unenrolled tab, where it (and the catalog, flagged "Rejoin") can restore it anytime. |
| **Google OAuth** | One-tap sign-in with Google alongside standard email/password authentication. |
| **Smart Auth Guidance** | Interactive account guidance modals and seamless email pre-filling when transitioning between `/login` and `/signUp`. |
| **Firestore Security Rules** | Server-side rules enforce per-user data isolation, anti-cheat (monotonic points/XP), and a PII-free public leaderboard. Covered by an automated **rules-test suite** run in the emulator on every PR (the **Firestore Rules Tests** GitHub Action). |
| **Bot Protection (App Check)** | Firebase App Check with **reCAPTCHA v3** attests that requests come from the real app, blocking bots/scripts that replay the public config against Firestore. Wired in dormant (activates via `VITE_RECAPTCHA_SITE_KEY`); live in production. |
| **Error Monitoring (Sentry)** | Production crashes are reported to Sentry with stack traces and breadcrumbs. Loaded via dynamic import and gated to production + a DSN, so it no-ops otherwise (activates via `VITE_SENTRY_DSN`). |
| **Automatic Error Triage (Sentry → Linear)** | A new Sentry issue automatically files a Linear task — **Backlog**, priority **High**, label **Bug** — carrying the error message, level, environment, culprit, top stack frames and browser/OS/URL, plus a link back to Sentry. Handled by a Cloudflare Worker (`worker-sentry-linear/`) that verifies Sentry's webhook signature and de-duplicates on the Sentry issue id, so a recurring error never spams the backlog. |
| **SEO & Meta** | Canonical links, Open Graph, JSON-LD schema, geographic meta, and custom favicon/meta image on every page. |
| **Fully Responsive** | Mobile, tablet, and desktop layouts. Dynamic viewport height and custom overscroll colours for native-feel scrolling. |
| **Contact Form** | Redesigned contact page with Firestore-backed submissions (`ContactMessages` collection). No third-party form services — messages are owned entirely and reviewable in the Firebase Console. |
| **Thank You Page** | Dedicated `/thank-you` page after contact form submission with personalised greeting, animated check icon, and quick-nav cards to Courses and Quizzes. |
| **Mobile Docs & Navigation** | Mobile jump pill bar on documentation page (`/doc`), responsive scrollable tables (`overflow-x-auto`), and flex-col layout conversions for seamless small-screen reading. |
| **Delete Profile Control** | Destructive profile deletion feature in Student Dashboard with a warning modal, confirmation safety check ("DELETE"), full Firestore record wiping, and Firebase Auth account deletion. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS + custom design tokens |
| Routing | React Router DOM v7 |
| Animation | GSAP + @gsap/react |
| Backend | Firebase Authentication + Cloud Firestore |
| Hosting | Firebase Hosting (CI/CD on push to `main`) |
| AI Tutor | Google Gemini via a Cloudflare Worker proxy (key server-side — see `worker/`) |
| Error triage | Sentry → Linear via a Cloudflare Worker webhook (see `worker-sentry-linear/`) |
| Notifications | Hybrid toasts + centered modal (`ToastContext`) |
| Animation (icons) | dotLottie player (self-hosted WASM) with SVG fallback |
| Testing | Playwright (end-to-end) + Firestore rules tests (emulator) + a palette guard (`npm run test:palette`) that fails the build on off-palette colours — all run in CI on every PR |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20 (Vite 7 requirement)
- npm ≥ 9
- A Firebase project with Authentication and Firestore enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tajamul-wani/Learntopia.git
cd Learntopia

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Firebase config values in .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build to /dist
npm run preview    # Preview production build locally
npm run lint       # ESLint check
npm run test:e2e       # Playwright end-to-end tests (auto-starts the dev server)
npm run test:e2e:ui    # Playwright interactive UI mode (watch + debug)
npm run test:rules:ci  # Firestore rules tests in the local emulator (needs Java)
npm run test:palette   # Palette guard: fails on off-palette colours in src/ and the brand SVGs
```

### Firestore rules tests

The Firestore security rules are covered by an automated test suite
(`test/firestore.rules.test.js`) that runs against the real `firestore.rules`
file inside the local Firestore emulator — no Firebase login or secrets needed.
It verifies the anti-cheat, PII, privacy, and admin-only guarantees, and runs on
every pull request via the **Firestore Rules Tests** GitHub Action.

```bash
npm run test:rules:ci   # starts the emulator, runs the tests, shuts it down
```

Running locally requires a Java runtime (the emulator is a Java process); CI
installs it automatically.

### Brand assets

The logo is a glowing faceted bulb with paper-cut rays, on a transparent
background. The SVGs in `public/` are the sources:

| File | Used for |
| --- | --- |
| `logo.svg` | Navbar, footer and this README |
| `favicon.svg` | Browser tab and the startup splash (the same bulb, with heavier strokes so it stays crisp at 16px) |
| `og-image.svg` | Social share card: the bulb lighting an open book, with its text stored as outlines |

Every colour in them is a design token, and `npm run test:palette` fails if one
is not. After changing an SVG, regenerate the PNGs (`favicon.png`,
`apple-touch-icon.png`, `logo.png`, `og-image.png`) in WSL:

```bash
npm i --no-save sharp     # one-off; keeps package.json unchanged
node scripts/gen-brand.mjs
```

---

## Project Structure

```
src/
├── Authentication/       # Login and SignUp pages with Firebase auth logic
├── Components/
│   ├── Dashboard.jsx     # Personal student dashboard
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   └── ui/               # Reusable design-system components (Button, Card, Icon, Badge, …)
├── context/
│   └── AuthContext.jsx   # Global auth state, streak tracking, Firestore profile sync
├── data/
│   ├── coursesData.js    # Course and module definitions
│   └── quizData.js       # Quiz topic and question pools
├── pages/
│   ├── Home.jsx
│   ├── Courses.jsx
│   ├── CourseDetails.jsx
│   ├── Quiz.jsx          # Quiz engine with timer, scoring, and leaderboard sync
│   ├── Leaderboard.jsx   # Global and per-quiz leaderboards
│   ├── Doc.jsx           # Platform documentation
│   ├── Privacy.jsx       # Privacy Policy
│   ├── Terms.jsx         # Terms of Service
│   ├── Contact.jsx       # Contact form → saves to Firestore ContactMessages
│   └── ThankYou.jsx      # Post-submission thank you page with animated check icon
├── App.jsx               # Route definitions
└── main.jsx

e2e/                      # Playwright end-to-end specs (one file per feature area)
public/                   # Brand SVG sources (logo, favicon, OG card) and generated PNGs
scripts/gen-brand.mjs     # Rasterises the brand SVGs to PNG
test/                     # Firestore security-rules tests (emulator) and the palette guard
worker/                   # Cloudflare Worker — Gemini API proxy (key server-side)
worker-sentry-linear/     # Cloudflare Worker — files Sentry errors as Linear issues
```

---

## Environment Variables

Create a `.env` file in the project root. **Never commit this file** — it is listed in `.gitignore`. An `.env.example` template is provided.

```env
# Firebase — from Firebase Console → Project settings → SDK setup and configuration.
# (authDomain, projectId, and storageBucket are non-secret and set in src/firebase/firebase.js.)
VITE_API_KEY=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=

# AI Tutor — URL of the deployed Gemini proxy Worker (see worker/README.md).
# The Gemini key lives ONLY in the Worker's secret, never in the client.
VITE_GEMINI_PROXY_URL=

# Optional hardening — leave blank to disable. Each feature no-ops when unset,
# so the app runs identically with or without these.
VITE_SENTRY_DSN=              # Sentry error monitoring (public-safe DSN)
VITE_RECAPTCHA_SITE_KEY=      # Firebase App Check reCAPTCHA v3 site key
```

All variables use the `VITE_` prefix so Vite exposes them to the client build.

These values are **public-safe**: the Firebase web API key is protected by Firestore rules and authorized domains (not secrecy); the Sentry DSN can only send crash events; the reCAPTCHA site key is meant to be embedded; and `VITE_GEMINI_PROXY_URL` is just an endpoint. When an optional key is blank the corresponding feature stays dormant.

> ⚠️ **Security note:** any `VITE_`-prefixed value is embedded in the public JavaScript bundle, so **no real secret may be a `VITE_` variable.** The billable **Gemini API key is never shipped to the client** — it lives as a secret in the Gemini proxy Worker (`worker/`), and the app only holds the Worker's public URL. See `worker/README.md` to deploy it.

---

## Deployment

Learntopia is deployed to **Firebase Hosting** with automatic continuous deployment triggered on every push to `main`.

```bash
# Manual deploy (if needed)
firebase deploy --only hosting
```
---

## Contributing

This project is developed and maintained by **Tajamul Wani**

---

## License

All rights reserved. The content, code, and design of Learntopia are the intellectual property of the project owner. Unauthorised reproduction or redistribution is prohibited.
