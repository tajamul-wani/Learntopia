<div align="center">

<img src="public/logo.svg" alt="Learntopia" width="96" height="96" />

# Learntopia

**A free e-learning platform for children and teenagers, ages 7 to 16.**  
Interactive courses, timed quizzes, gamified progression, and an AI tutor.

[![Live](https://img.shields.io/badge/Live-learntopia--react.web.app-7c3aed?style=for-the-badge&logo=firebase&logoColor=white)](https://learntopia-react.web.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tested with Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)

---

### [Introduction and use](#introduction-and-use) &nbsp;&bull;&nbsp; [Collaborator tab](#collaborator-tab) &nbsp;&bull;&nbsp; [Security](#security) &nbsp;&bull;&nbsp; [Licence](#licence)

---

</div>

<details open id="introduction-and-use">
<summary><h2>Introduction and use</h2></summary>

### What Learntopia Is
Learntopia is a free e-learning platform designed for children and teenagers aged 7 to 16. It teaches programming, mathematics, finance, and creative skills through bite-sized interactive modules, gamified milestones, timed quizzes, and personalized assistance.

### How It Works and What It Has
- **Interactive Course Modules**: Structured curriculum tracks featuring conceptual reading, visual examples, interactive exercises (multiple choice, true/false, fill in the blank, matching pairs), and hands-on coding activities.
- **Timed Quiz Engine**: Scored multiple-choice assessments with 15-second per-question countdowns, instantaneous score summaries, and per-topic leaderboard rankings.
- **Gamification System**: XP gains, level progression from Rookie Coder to Grandmaster, badge collection, daily login streaks, and global rankings.
- **AI Tutor (Leo)**: Course-aware virtual mentor powered by Google Gemini via a secure Cloudflare Worker proxy to provide age-appropriate hints in real time.
- **Course Certificates**: Verified completion certificates generated directly in the browser with learner display names, verification IDs, and completion dates.
- **Kid-Safe Accounts**: Email/password and Google authentication, 26 built-in avatars, customizable display names (no real names required), and full self-serve account deletion.
- **Bilingual Interface**: Full interface and curriculum localization in both English and Spanish.

### Tech Stack
| Component | Technology | Description |
|---|---|---|
| Frontend Framework | React 18, Vite 7 | Fast Single Page Application with optimized code splitting |
| Routing | React Router 7 | Client-side routing with route guards |
| Styling | Tailwind CSS | Custom dark claymorphism design tokens |
| Typography | Fredoka, Poppins | Font packages bundled via `@fontsource` |
| Animations | GSAP, dotLottie | Smooth UI micro-interactions with SVG fallbacks |
| Backend & Auth | Firebase Auth & Firestore | User authentication and real-time document database |
| Edge Infrastructure | Cloudflare Workers | Serverless proxy for Gemini AI and telemetry triage |
| Test Frameworks | Vitest, Playwright | Unit, component, security rules, and E2E browser tests |

### Local Installation and Setup

#### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+)
- Java Runtime Environment (JRE 11+) for Firebase Local Emulators
- Git

#### 1. Clone the repository
```bash
git clone https://github.com/tajamul-wani/Learntopia.git
cd Learntopia/Learntopia
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment variables
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Populate the required Firebase configuration keys from your Firebase project console.

#### 4. Run the development server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

#### 5. Run with local Firebase emulators (offline mode)
To develop without touching production data, run the emulators:
```bash
npm run emulators
```
This spins up the Auth emulator (port 9099), Firestore emulator (port 8080), and Emulator UI (port 4000).

</details>

<details open id="collaborator-tab">
<summary><h2>Collaborator tab</h2></summary>

### Contribution Workflow
All contributions follow a clean Git branching workflow. Every pull request must be self-contained and accompanied by test coverage.

1. **Branching**: Branch off the latest `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b <type>/<short-description>
   ```
   Allowed types: `feat/`, `fix/`, `chore/`, `test/`, `ci/`, `docs/`.
2. **One Concern**: Keep each branch focused on a single feature or bug fix.
3. **Commit Messages**: Follow standard conventional commits format (`type: brief imperative summary`).
4. **Pre-Commit Verification**: Run the local pre-commit check before opening a PR:
   ```bash
   npm run precommit
   ```

### Verification Commands
Collaborators must ensure all checks pass before submitting a pull request:

```bash
# Run unit and component tests
npm run test:unit

# Run static linting
npm run lint

# Check production build bundle
npm run build

# Validate color palette design tokens
npm run test:palette

# Run Firestore security rules tests in emulator
npm run test:rules:ci

# Run Playwright end-to-end test suite
npm run test:e2e
```

### Design and Code Standards
- **Color Palette**: All user-interface colors must use tokens defined in `tailwind.config.js` (`ground`, `surface`, `ink-hi`, `ink-low`, `violet`, `sky`, `state-success`, `state-danger`). Direct hex codes in components are prohibited and blocked by `test/palette.test.js`.
- **Localization**: User-facing copy must never be hardcoded into JSX. Strings must be defined in `src/i18n/translations.js` (for synchronous render and mount strings) or `src/i18n/content/<lang>.js` (for course and page body copy) and rendered with `t()`.
- **Writing Style**: Use clear, concise technical language. Do not use em dashes or marketing hyperbole.
- **Responsive Layout**: Interfaces must be fully responsive and verified across mobile (320px to 420px), tablet (768px), and desktop (1024px to 1350px) viewports with zero horizontal scrolling or clipped controls.

### Project Structure
```
Learntopia/
├── e2e/                # Playwright end-to-end specs and emulator test fixtures
├── public/             # Static assets, SVG logos, and avatars
├── scripts/            # Build guards, pre-commit scripts, and utilities
├── src/
│   ├── Authentication/ # Login, SignUp, and password recovery views
│   ├── Components/     # Reusable UI components, modals, and profile panels
│   ├── context/        # React Context providers (Auth, Language, Sound, Theme)
│   ├── data/           # Course content, quizzes, and learning track data
│   ├── firebase/       # Firebase client initialization and emulator wiring
│   ├── i18n/           # Translation dictionaries and content packs (en, es)
│   ├── pages/          # Primary application routes
│   └── utils/          # Pure helper utilities, sound triggers, and math
├── test/               # Vitest unit tests, rules tests, and palette guards
├── worker/             # Cloudflare Worker proxy for AI tutor
└── firestore.rules     # Firestore security rules
```

</details>

<details open id="security">
<summary><h2>Security</h2></summary>

### Data Boundary and Access Control
Learntopia is designed with privacy and security as core requirements for young learners:

- **Strict Firestore Rules**: All access is denied by default in `firestore.rules`. Signed-in learners can read and write only their own user profile, active course progress, and quiz history documents.
- **Administrative Separation**: Administrative routes and collections require custom server-set claims (`admin: true`), never client-side email string comparisons.
- **Anti-Cheat Validation**: Database rules prevent manipulation of XP, streaks, and quiz results. XP can only increase, badge increments are capped to one per write, and quiz scores cannot exceed available questions.
- **Public Form Hardening**: The public contact form write is constrained to an exact schema with strict length limits, valid email format validation, and server-generated timestamps.

### Privacy by Design
- **No Real Names Required**: Profiles only store chosen display names and built-in avatars.
- **Private Profile Photos**: Google account profile photos are only rendered locally on the learner's own private dashboard and are excluded from the public leaderboard.
- **Right to Erasure**: Self-serve account deletion securely wipes the user's Firestore profile, progress, quiz submissions, and authentication record in a single transaction.

### Secret Management and Bot Protection
- **No Client Secrets**: Third-party API keys (such as Google Gemini) are isolated in Cloudflare Worker secrets and never exposed in browser bundles.
- **App Check**: Firebase App Check with reCAPTCHA v3 validates genuine browser traffic and mitigates automated bot abuse.
- **Automated Verification**: Security rules are continuously tested in CI against the Firestore emulator on every pull request (`test/firestore.rules.test.js`).

</details>

<details open id="licence">
<summary><h2>Licence</h2></summary>

All rights reserved.

The source code, user interface designs, curriculum content, and brand assets of Learntopia are the proprietary intellectual property of the project owner. Unauthorized reproduction, distribution, reverse engineering, or commercial use without prior written authorization is strictly prohibited.

</details>
