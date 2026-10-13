/**
 * English content overlay: bodies of text, fetched when a route that renders
 * them is opened.
 *
 * The line between this file and translations.js is what the reader is
 * waiting on:
 *
 *   - read while painting, or by an effect that fires on mount, so it cannot
 *     wait for a fetch            -> translations.js
 *   - the body copy of one page, reachable only through its own lazy route,
 *     and absent until that route loads anyway -> here
 *
 * `translations.js` already carries the headings and labels of the legal and
 * documentation pages; these namespaces add their long `sections` bodies on
 * top, through the deep merge in LanguageContext.
 *
 * The UI namespaces — nav, common, toasts, modals, quiz, contact, thankYou,
 * notFound — were in here briefly and caused a bug: deleting an account
 * reloads the home page and fires `toasts.profileDeleted` from an effect,
 * which ran before this module arrived and printed the key path at the
 * reader. They are 2.6K gzip and belong in the dictionary that exists before
 * the first paint. Do not move them back.
 *
 * See ./index.js for how this loads.
 */

const content = {
  privacy: {
    footerTitle: "Questions about your privacy?",
    footerPre: "Contact us at",
    footerEmail: "Email Privacy Team",
    footerMid: "or review our",
    footerTerms: "Terms of Service",
    sections: [
      { heading: "1. Introduction", body: ["This Privacy Policy explains how Learntopia (\"we\", \"us\", \"our\") collects, uses, stores, and protects your information when you use our website and services (the \"Service\"). We are committed to handling your data responsibly and to collecting only what is necessary to provide the Service.", "By using Learntopia, you agree to the practices described in this policy."] },
      { heading: "2. Information We Collect", body: ["We collect the following limited categories of information:"], list: ["Account information — your display name and email address, provided when you register or through your Google account if you use Google sign-in.", "Profile photo — only where one is provided by your Google account.", "Learning data — the courses you enrol in, your module and course progress, your quiz attempts and scores, and your daily login streak.", "Technical data — authentication session tokens required to keep you securely signed in."] },
      { heading: "3. How We Collect Information", body: ["We collect information directly from you when you create an account or use features of the Service, and automatically as you make progress through courses and quizzes. If you choose to sign in with Google, we receive basic profile details (name, email, and photo) from Google in accordance with your Google account settings."] },
      { heading: "4. How We Use Your Information", body: ["We use your information solely to operate and improve the Service, specifically to:"], list: ["Create and secure your account and maintain your authenticated session.", "Save and display your course enrolments, progress, and quiz scores on your dashboard.", "Calculate and display daily login streaks and leaderboard rankings.", "Provide the core educational features of the platform.", "Maintain the security, integrity, and reliability of the Service."] },
      { heading: "5. How We Store and Protect Your Data", body: ["Your data is stored using Google Firebase — specifically Firebase Authentication and the Cloud Firestore database. Access is governed by strict server-side security rules which ensure that your profile, progress, and quiz data can be read and written only by you while you are authenticated.", "Leaderboard data (display name and total score only) is stored in a separate collection and is readable by any authenticated user. Your email address, course progress, and quiz history are never exposed through the leaderboard.", "We take reasonable technical measures to protect your information; however, no method of transmission or storage is completely secure."] },
      { heading: "6. Data Sharing and Disclosure", body: ["We respect your privacy and limit disclosure of your data. Specifically:"], list: ["We do not sell, rent, or trade your personal information to anyone.", "We do not use your data for targeted advertising.", "We share data only with the infrastructure provider (Google Firebase) that processes and stores it on our behalf.", "We may disclose information if required to do so by law or to protect the rights, safety, or security of users and the Service."] },
      { heading: "7. Children's Privacy", body: ["Learntopia is intended for children and teenagers, so we take children's privacy especially seriously. We collect only the minimal information required to deliver the learning experience and never request unnecessary personal details. We encourage parents and guardians to supervise their child's use of the Service.", "A parent or guardian may contact us at any time to review, correct, or request deletion of a child's information, and we will act on such requests promptly."] },
      { heading: "8. Cookies and Similar Technologies", body: ["We use only the storage strictly necessary to keep you signed in between visits, such as authentication session data managed by Firebase. We do not use advertising or cross-site tracking cookies."] },
      { heading: "9. Data Retention", body: ["We retain your information for as long as your account remains active or as needed to provide the Service. When you request deletion of your account, we will remove your associated personal data, except where we are required to retain it to comply with a legal obligation."] },
      { heading: "10. Your Rights and Choices", body: ["Depending on your location, you may have rights in relation to your personal data, including the right to:"], list: ["Access the personal information we hold about you.", "Request correction of inaccurate or incomplete information.", "Request deletion of your account and associated data.", "Withdraw consent for optional processing where applicable."] },
      { heading: "11. International Data Transfers", body: ["Because we use Google Firebase, your data may be processed and stored on servers located in other countries. Where data is transferred internationally, it remains subject to appropriate safeguards provided by the infrastructure provider."] },
      { heading: "12. Third-Party Services and Links", body: ["The Service depends on Google Firebase for authentication and storage, and your use of Google sign-in is also governed by Google's own privacy policy. The Service may occasionally reference third-party resources; we are not responsible for the privacy practices of those third parties."] },
      { heading: "13. Changes to This Policy", body: ["We may update this Privacy Policy from time to time. When we make material changes, we will revise the \"Last updated\" date at the top of this page and, where appropriate, provide additional notice. We encourage you to review this page periodically."] },
    ],
  },
  terms: {
    footerTitle: "Questions about these Terms?",
    footerPre: "Contact us at",
    footerEmail: "Email Support",
    footerMid: "or review our",
    footerPrivacy: "Privacy Policy",
    sections: [
      { heading: "1. Introduction and Acceptance", body: ["These Terms of Service (\"Terms\") govern your access to and use of the Learntopia website, courses, quizzes, and related services (collectively, the \"Service\"). By creating an account or otherwise using the Service, you confirm that you have read, understood, and agree to be bound by these Terms and by our Privacy Policy, which is incorporated here by reference.", "If you do not agree with any part of these Terms, you must not access or use the Service."] },
      { heading: "2. Definitions", body: ["For clarity, the following terms are used throughout this document:"], list: ["\"We\", \"us\", and \"our\" refer to the operator of Learntopia.", "\"You\" and \"User\" refer to any person who accesses or uses the Service.", "\"Content\" refers to all courses, modules, exercises, quizzes, text, graphics, and other material made available through the Service.", "\"Account\" refers to the personal profile you create to access features of the Service."] },
      { heading: "3. Eligibility and Parental Consent", body: ["The Service is designed as an educational tool for children and teenagers. If you are a minor, you may use the Service only with the knowledge, involvement, and consent of a parent or legal guardian, who agrees to be responsible for your use of the Service and for compliance with these Terms.", "By using the Service, you represent that you have the legal capacity to enter into these Terms, or that a parent or guardian has provided the necessary consent on your behalf."] },
      { heading: "4. Account Registration and Security", body: ["To access certain features, you must create an Account using a valid email address or a supported third-party sign-in provider (such as Google). You agree to provide accurate and complete information and to keep it up to date.", "You are responsible for safeguarding your login credentials and for all activity that occurs under your Account. You must notify us promptly of any unauthorized use of, or access to, your Account. We are not liable for any loss arising from your failure to keep your credentials secure."] },
      { heading: "5. Acceptable Use", body: ["You agree to use the Service only for lawful, educational purposes. In particular, you agree to:"], list: ["Use the courses, modules, and quizzes for genuine learning and self-assessment.", "Treat other users and the community with respect in any interaction.", "Comply with all applicable laws and these Terms while using the Service.", "Provide truthful information when creating and maintaining your Account."] },
      { heading: "6. Prohibited Activities", body: ["You must not, and must not attempt to:"], list: ["Copy, reproduce, resell, or redistribute any Content without our prior written permission.", "Interfere with, disrupt, or gain unauthorized access to the Service, its servers, or its underlying systems.", "Circumvent, disable, or tamper with any security or progress-tracking feature of the Service.", "Use the Service to transmit harmful, unlawful, or malicious material, or to harass any person.", "Use automated means to access the Service in a way that places unreasonable load on our infrastructure."] },
      { heading: "7. Intellectual Property", body: ["The Service and all Content — including the Learntopia name, logo, design, course materials, and software — are owned by us or our licensors and are protected by intellectual-property laws. Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable licence to access and use the Service and Content for your own personal, non-commercial learning.", "No other rights are granted. All rights not expressly granted to you are reserved by us."] },
      { heading: "8. Educational Disclaimer", body: ["The Content is provided for general educational and informational purposes only. While we strive to keep it accurate and up to date, we make no warranty regarding the completeness or accuracy of any Content, and we do not guarantee any particular learning outcome, score, qualification, or result from using the Service."] },
      { heading: "9. Service Availability and Modifications", body: ["The Service is currently provided free of charge. We may add, modify, suspend, or discontinue any part of the Service at any time, and we may need to make the Service temporarily unavailable for maintenance or updates. We will make reasonable efforts to minimize disruption but are not liable for any unavailability of the Service."] },
      { heading: "10. Third-Party Services", body: ["The Service relies on third-party providers — including Google Firebase for authentication and data storage. Your use of such features may also be subject to the applicable third party's terms and policies. We are not responsible for the practices of third-party services."] },
      { heading: "11. Suspension and Termination", body: ["We may suspend or terminate your access to the Service, with or without notice, if you breach these Terms or misuse the Service. You may stop using the Service and request deletion of your Account at any time. Provisions that by their nature should survive termination — including intellectual-property, disclaimer, and liability provisions — will continue to apply."] },
      { heading: "12. Disclaimer of Warranties", body: ["The Service is provided on an \"as is\" and \"as available\" basis, without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement, to the maximum extent permitted by law."] },
      { heading: "13. Limitation of Liability", body: ["To the maximum extent permitted by applicable law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of data or goodwill, arising out of or related to your use of, or inability to use, the Service."] },
      { heading: "14. Indemnification", body: ["You agree to indemnify and hold us harmless from any claims, damages, or expenses arising out of your misuse of the Service or your breach of these Terms, to the extent permitted by applicable law."] },
      { heading: "15. Governing Law", body: ["These Terms are governed by the laws applicable in the operator's jurisdiction, without regard to conflict-of-law principles. Any dispute arising from these Terms will be handled by the competent courts of that jurisdiction."] },
      { heading: "16. Changes to These Terms", body: ["We may update these Terms from time to time. When we make material changes, we will revise the \"Last updated\" date at the top of this page and, where appropriate, provide additional notice. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms."] },
    ],
  },
  doc: {
    featuresHeading: "Features",
    gettingStartedHeading: "Getting Started",
    coursesHeading: "Gamified Courses & Modules",
    coursesIntro: "Each course is designed for learners aged 7-16 with a gamified, step-by-step lesson experience. Modules must be completed sequentially to unlock the next challenge.",
    tableColFeature: "Feature / Component",
    tableColDesc: "Description & Behavior",
    quizzesHeading: "Quizzes",
    quizzesIntro: "Quizzes are topic-specific assessments available to all users, including guests. Each quiz presents a set of randomized multiple-choice questions with a 15-second countdown per question.",
    dashboardHeading: "Dashboard",
    dashboardIntro: "The personal dashboard is available to authenticated users only. It consolidates all your learning activity into one view.",
    accountHeading: "Account & Security",
    accountIntro: "You can create an account with an email and password, or sign in with Google. Your data is kept private to your account and protected by strong, server-enforced access controls.",
    faqHeading: "FAQ",
    footerTitle: "Something missing or unclear?",
    footerPre: "Reach out via the",
    footerContact: "Contact page",
    footerMid: "or review our",
    footerTerms: "Terms",
    footerAnd: "and",
    footerPrivacy: "Privacy Policy",
    features: [
      { title: "Multi-Language Support", text: "Switch the platform UI between the available languages. Your language preference is stored locally and applied on every visit." },
      { title: "Interactive Courses", text: "Enroll in kid-friendly course tracks. Each module contains a short reading and a comprehension question. You must answer correctly to unlock the next module — progress cannot be faked." },
      { title: "Dynamic Timed Quizzes", text: "Test your knowledge with a 15-second countdown per question. Questions are drawn from a large pool and randomized on every attempt. Instant feedback is shown after each answer." },
      { title: "Web Audio SFX System", text: "Enjoy interactive sound effects for correct/wrong answers, module completion, level-up fanfares, and badge unlocks synthesized 100% free offline in your browser. Easily toggle audio muted/unmuted in the header navigation." },
      { title: "Personal Dashboard", text: "View your enrolled and completed courses, per-course progress bars, quiz high scores, total points earned, and your current daily streak — all consolidated in one place." },
      { title: "Daily Login Streaks", text: "Your streak increments each calendar day you log in. If you miss a day, the streak resets. Streaks are calculated in your local timezone and displayed in the dashboard header and metrics grid." },
      { title: "Global & Per-Quiz Leaderboards", text: "The Leaderboard ranks users by total points and individual quiz scores. The Leaderboard tab and page are visible exclusively to logged-in users to protect community rankings." },
      { title: "Quiz Completion Indicators", text: "Completed quiz cards display a green Done badge and your best score. The Start button becomes a Retake button. Abandoning a quiz mid-way does not count as an attempt — scores are logged only on the results screen." },
      { title: "Guest Quiz Score Preservation", text: "Take a quiz as a guest and finish it, then use the Log In or Sign Up link on the results screen. Your score is automatically saved to your profile on authentication without any data loss." },
      { title: "AI Tutor", text: "Leo is the AI tutor across every course. Each question carries the course and the module you are on, so answers stay on the subject you are studying." },
      { title: "Strict Focus Mode", text: "A custom route blocker detects navigation attempts during active quizzes or module challenges and presents a confirmation dialog to prevent accidental progress loss." },
      { title: "Course Controls", text: "Unenroll from courses directly from your dashboard. Reset a 100%-completed course to start fresh. Resume in-progress courses exactly where you left off." },
      { title: "Searchable Catalog", text: "Filter courses by title or subject using the live search field. An informative empty state is shown when no results match the query." },
      { title: "Private & Secure", text: "Your data — profile, courses, progress, and quiz attempts — is private to your account. Only you can see or change it, and the leaderboard shows just your name and score, never your email or contact details." },
    ],
    steps: [
      { step: "01", title: "Create an account", text: "Click Sign Up in the navigation bar. Register with your email and a password, or continue with Google for a one-click setup. Email/password accounts require a display name." },
      { step: "02", title: "Browse the course catalog", text: "Navigate to Courses to see all available learning tracks. Use the search bar to filter by subject or title. Click on any course card to view the full syllabus and module list." },
      { step: "03", title: "Enroll and start learning", text: "Click Enroll on the course detail page. Modules unlock sequentially — read each lesson, then answer the comprehension question correctly to unlock the next module." },
      { step: "04", title: "Take quizzes", text: "Visit the Quiz Center to test your knowledge. Select a topic, answer all questions within the time limit, and view your score on the results screen. Completed quizzes display a Done badge on the selection card." },
      { step: "05", title: "Track your progress", text: "Open your Dashboard to see enrolled courses, completion percentages, quiz high scores, total points, and your current streak. Check the Leaderboard to compare your score with others." },
    ],
    coursesTable: [
      { concept: "Step-by-Step Lesson Player", behaviour: "Presents module content one card at a time with distinct visual themes (Story, Concept, Fun Fact, Pro Tip, Example, Activity, Recap) and code syntax highlighting." },
      { concept: "Multi-Type Exercise Engine", behaviour: "Tests understanding using 4 interactive formats: Multiple Choice (MCQ), True/False, Fill-in-the-Blank, and Tap-to-Connect Matching Pairs." },
      { concept: "Gamification & Level System", behaviour: "Earn XP by completing course modules (+50 XP each, +100 XP for full course) and quizzes (20–100 XP scaled by score). Level up from Rookie Coder (Level 1) to Grandmaster (Level 5)." },
      { concept: "Badges & Celebrations", behaviour: "Unlocks unique course badges (e.g. Python Pioneer, Math Wizard) with celebratory full-screen overlays upon achievement." },
      { concept: "Course progress", behaviour: "Tracks completed modules in real time with progress bars, saved automatically. Resume anytime from your Student Dashboard." },
      { concept: "Course reset", behaviour: "Reset completed courses anytime via the Start Again button to replay lessons and re-earn practice." },
    ],
    quizMeta: [
      { label: "Timer", value: "15 seconds per question. The timer resets on each new question." },
      { label: "Question pool", value: "Questions are randomized from a large pool on every attempt, so retaking a quiz gives a fresh experience." },
      { label: "Feedback", value: "After submitting an answer, the correct answer is revealed immediately before moving to the next question." },
      { label: "Score logging", value: "Scores are saved only when you complete all questions and reach the results screen. Exiting early logs nothing." },
      { label: "Points", value: "Each correct answer earns 10 points added to your cumulative total." },
      { label: "Leaderboard sync", value: "Your score is synced to the per-quiz leaderboard and your total points are updated in the global leaderboard." },
      { label: "Guest attempts", value: "Guests can take any quiz. On the results screen, links allow login or signup with automatic score transfer." },
      { label: "Retake", value: "Completed quizzes show a Retake button. High scores are tracked — only your best score per quiz is displayed." },
    ],
    dashboardList: [
      "Profile header — displays your display name, avatar initial, total points, and current daily streak.",
      "Metrics grid — shows total points, quiz attempts, courses enrolled, and streak in numeric cards.",
      "Active courses — lists in-progress courses with a live progress bar and a Continue button.",
      "Completed courses — lists all fully completed courses.",
      "Quiz high scores — shows your best score per quiz across all attempts.",
      "Delete Profile — option to permanently delete your account and all learning data anytime.",
    ],
    accountCards: [
      { title: "Strict Account Privacy & Data Isolation", text: "Learntopia uses enterprise-grade encryption and strict account isolation to keep your student profile safe. Your personal learning history, course notes, and account settings can only be accessed by you when signed in." },
      { title: "Smart Auth Guidance", text: "Attempting to log in with an unregistered email automatically presents an interactive option to create a new account, pre-filling your entered email on the registration form. Similarly, registering with an existing email provides a 1-click option to log in without re-typing credentials." },
      { title: "Works Offline", text: "If your internet connection drops while taking a quiz or reading a module, your progress is kept safe on your device and syncs automatically the moment you reconnect — so you never lose your place." },
      { title: "Resilient by Design", text: "If a page ever fails to load because of a shaky connection, Learntopia shows a friendly reload option instead of a blank screen or a crash — a dropped signal never breaks your session." },
      { title: "Your Data Stays Yours", text: "Your profile, courses, progress, and quiz history are tied to your account and can't be viewed or changed by anyone else. Behind the scenes, safeguards keep scores and badges fair and tamper-resistant, so the leaderboard stays honest." },
    ],
    faq: [
      { q: "Do I need an account to use Learntopia?", a: "No. Courses and quizzes can be browsed without an account. However, progress, scores, and streaks are only saved for authenticated users. Guest quiz scores can be retroactively saved by logging in from the results screen." },
      { q: "How does the streak counter work?", a: "Your streak increments by one each calendar day you log in (calculated in your local timezone). Logging in multiple times on the same day counts as one day. Missing a day resets the streak to 1." },
      { q: "Why did my quiz score not appear on the leaderboard?", a: "Scores are only logged when you complete all questions and reach the results screen. Quitting mid-quiz does not save any data. If you are logged in and complete a quiz, the score should appear on the leaderboard within seconds." },
      { q: "What happens if I quit a quiz halfway?", a: "Nothing is saved. There is no partial credit. The quiz card will not show a Done badge. You can restart the quiz from scratch at any time." },
      { q: "How does course completion work?", a: "You must complete every module in sequence. Each module requires a correct answer to the comprehension question before the next one unlocks. The course is marked complete only when every module is done." },
      { q: "Can I reset a completed course?", a: "Yes. Open the course detail page for a 100%-complete course. A Start Again button will appear, allowing you to reset all module progress and begin from the first module." },
      { q: "Is the platform free?", a: "Yes, completely free. No subscription, no paywalled courses, no advertising." },
      { q: "Who can see my leaderboard score?", a: "Any authenticated Learntopia user can see the Global Leaderboard. It shows your display name and total points only. Your email, course progress, and quiz history are never visible to other users." },
    ],
  },
};

export default content;
