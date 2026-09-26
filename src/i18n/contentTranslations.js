/**
 * Bulk content translations for course + quiz DATA (kept separate from the UI
 * dictionary in translations.js to keep both files manageable).
 *
 * Consumed via LanguageContext, which shallow-merges each language block onto
 * the base UI dictionary. English is intentionally absent: t() and the
 * localization utils fall back to the original English data files.
 *
 * Structure mirrors what src/utils/localizationUtils.js looks up:
 *   quizzesData.<quizId>.title | description | subject
 *   quizzesData.<quizId>.questions[i].questionText | options[j]
 *   courseData.<courseId>.title | desc | category | difficulty
 *   courseData.<courseId>.modules[i].title | desc
 *   courseData.<courseId>.modules[i].contentSections[j].title | content
 *   courseData.<courseId>.modules[i].exercises[k].question | options[] | answer | pairs[]
 *
 * NOTE on quiz/exercise answers: options are translated IN ORDER. The correct
 * answer is re-derived by index in localizationUtils, so it always matches a
 * translated option — never translate answers to a different order.
 *
 * courseData (lesson content) is added in follow-up batches; until then the
 * existing courseData metadata in translations.js remains in effect and lesson
 * bodies fall back to English.
 */

export const contentTranslations = {
  // UI strings that were hardcoded in components, now routed through t().
  // These deep-merge onto the base dictionaries in translations.js.
  en: {
    nav: { quizzes: "Quizzes" },
    notFound: { backHome: "Back to Home" },
    thankYou: { whatsNext: "While you wait", exploreDesc: "Explore free courses and start earning XP.", quizDesc: "Take a quick, timed quiz challenge." },
    common: { sfx: "SFX", off: "Off" },
    quiz: {
      start: "Start",
      notSignedInTitle: "You're not signed in",
      notSignedInMsg: "Your high scores won't be saved to your student profile.",
      quitTitle: "Quit Quiz?",
      quitMsg: "Are you sure you want to leave? Your progress won't be saved and this attempt won't be logged.",
      quitConfirm: "Quit",
    },
    contact: {
      formHeading: "Send a message",
      formSubtitle: "Fill in the details below — we read every message.",
      namePlaceholder: "John Doe",
      emailPlaceholder: "you@example.com",
      subjectPlaceholder: "Subject...",
      agreementPre: "By submitting, you agree to our",
      privacyLink: "Privacy Policy",
      agreementPost: "We only use your email to respond to your message.",
    },
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
        { title: "AI Tutors", text: "Each course is accompanied by a specialized AI tutor with a distinct persona designed to guide learners through the subject matter." },
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
    toasts: {
      // Notification titles (heading shown in the popup)
      titleLogin: "Welcome back!",
      titleSignup: "Welcome to Learntopia!",
      titleLogout: "See you soon!",
      titleProfile: "Profile saved",
      titleQuiz: "Score saved!",
      titleUnenroll: "Course unenrolled",
      titleDelete: "Account removed",
      titleSuccess: "All set!",
      titleError: "Oops",
      titleWarning: "Heads up",
      titleInfo: "Good to know",
      // Notification buttons
      btnLogin: "Go to Dashboard",
      btnSignup: "Start learning",
      btnLogout: "Bye for now",
      btnProfile: "Done",
      btnQuiz: "See leaderboard",
      btnUnenroll: "Okay",
      btnDelete: "Goodbye",
      btnGeneric: "Got it",
      btnRetry: "Try again",
      // Messages
      loginSuccess: "You're in — keep that streak going!",
      loginGoogleSuccess: "Signed in with Google. Keep it going!",
      signupSuccess: "Account ready — explore courses and earn XP!",
      signupGoogleSuccess: "Account ready — explore courses and earn XP!",
      quizScoreSaved: "Score saved to the leaderboard. Nice work!",
      googleFailed: "Google sign-in failed. Try again.",
      googlePopupBlocked: "Popup blocked. Allow popups and try again.",
      googleUnauthorizedDomain: "Site not authorized for Google sign-in yet.",
      googleNotEnabled: "Google sign-in isn't enabled yet.",
      googleNetwork: "Network error. Check your connection.",
      noAccount: "No account found for this email.",
      wrongPassword: "Incorrect password. Try again.",
      invalidEmail: "That email looks incomplete.",
      invalidCredentials: "Invalid email or password.",
      emailInUse: "That email is already registered.",
      weakPassword: "Use at least 6 characters.",
      signupFailed: "Couldn't create your account. Try again.",
      logoutSafe: "Signed out. Come back tomorrow for your streak!",
      logoutFailed: "Failed to log out.",
      loggedOut: "Signed out. Come back tomorrow for your streak!",
      logoutFailedRetry: "Couldn't log you out. Try again.",
      unenrollFailed: "Couldn't unenroll. Try again.",
      noNewXpModule: "Already done — nice work revisiting it!",
      replayModuleNoXp: "Great refresher! No new XP, but keep it sharp.",
      noNewXpQuiz: "So close! Beat your best score to earn more XP.",
      unenrolledFrom: "Moved to Unenrolled — rejoin anytime.",
      rejoined: "Back in \"{title}\" — progress saved.",
      rejoinFailed: "Couldn't rejoin. Try again.",
      deleteConfirmType: "Type DELETE to confirm.",
      profileDeleted: "Profile removed. We'll miss you, Explorer!",
      deleteWrongPassword: "That password isn't right. Nothing was deleted.",
      deleteReauthCancelled: "Google confirmation was cancelled. Nothing was deleted.",
      deleteReauthFailed: "We couldn't confirm it's you. Nothing was deleted.",
      deleteFailed: "Your account wasn't fully deleted. Please try again to finish.",
      accessDenied: "Access denied — admin credentials required.",
      adminNotALearner: "Admin accounts don't take courses or quizzes. Use a learner account for that.",
      notAnAdminSignedIn: "That account isn't an administrator. Signed you in as a learner instead.",
      adminWelcome: "Welcome, Administrator",
      googleAuthFailed: "Google authentication failed.",
      adminLoggedOut: "Logged out of the Admin Center.",
      loadDataFailed: "Failed to load some admin data.",
      provideTitleDesc: "Add a title and description.",
      logSaved: "System log saved.",
      saveLogFailed: "Failed to save the log.",
      noStudentData: "No student data to export.",
      exportedCsv: "Student list exported to CSV.",
      loginToView: "Log in to view course details.",
      saveProgressFailed: "Couldn't save your progress. Try again.",
      courseCompleted: "Course complete! +100 XP earned.",
      markCompleteFailed: "Couldn't mark it complete. Try again.",
      courseReset: "Course reset — fresh start!",
      resetFailed: "Couldn't reset the course. Try again.",
      loginToEnroll: "Log in to enroll.",
      enrollFailed: "Couldn't enroll. Try again.",
      quizProgressSaved: "Progress saved!",
      quizProgressFailed: "Couldn't save progress.",
      timesUp: "Time's up!",
    },
    modals: {
      leaveTitle: "Leave Syllabus?",
      leaveAction: "Leave",
      leaveBody: "Are you sure you want to leave the syllabus?",
      leaveResetPre: "Any ",
      leaveResetBold: "unsubmitted answers",
      leaveResetPost: " for your current module will be reset.",
      leaveSavedPre: "Modules you have ",
      leaveSavedBold: "already completed",
      leaveSavedPost: " are securely saved and will not be lost.",
      resetTitle: "Start Again?",
      resetAction: "Yes, reset course",
      resetBody: "Are you sure you want to reset your progress and start this course from the beginning?",
      resetWarnLabel: "Warning:",
      resetWarnText: " All your current checkmarks and completion timestamps will be permanently wiped out. This action cannot be undone.",
      dashNoProfileTitle: "No active profile",
      dashNoProfileDesc: "Please log in to view your dashboard.",
    },
  },

  // ===================================================================
  // SPANISH
  // ===================================================================
  es: {
    nav: { quizzes: "Cuestionarios" },
    notFound: { backHome: "Volver al Inicio" },
    thankYou: { whatsNext: "Mientras esperas", exploreDesc: "Explora cursos gratis y empieza a ganar XP.", quizDesc: "Acepta un reto de cuestionario rápido y cronometrado." },
    common: { sfx: "SFX", off: "Apagado" },
    quiz: {
      start: "Empezar",
      notSignedInTitle: "No has iniciado sesión",
      notSignedInMsg: "Tus mejores puntuaciones no se guardarán en tu perfil de estudiante.",
      quitTitle: "¿Salir del Cuestionario?",
      quitMsg: "¿Seguro que quieres salir? No se guardará tu progreso y este intento no se registrará.",
      quitConfirm: "Salir",
    },
    contact: {
      formHeading: "Enviar un mensaje",
      formSubtitle: "Completa los datos a continuación — leemos cada mensaje.",
      namePlaceholder: "Juan Pérez",
      emailPlaceholder: "tu@ejemplo.com",
      subjectPlaceholder: "Asunto...",
      agreementPre: "Al enviar, aceptas nuestra",
      privacyLink: "Política de Privacidad",
      agreementPost: "Solo usamos tu correo para responder a tu mensaje.",
    },
    privacy: {
      footerTitle: "¿Preguntas sobre tu privacidad?",
      footerPre: "Contáctanos en",
      footerEmail: "Escribir al Equipo de Privacidad",
      footerMid: "o revisa nuestros",
      footerTerms: "Términos de Servicio",
      sections: [
        { heading: "1. Introducción", body: ["Esta Política de Privacidad explica cómo Learntopia (\"nosotros\", \"nos\", \"nuestro\") recopila, usa, almacena y protege tu información cuando utilizas nuestro sitio web y servicios (el \"Servicio\"). Nos comprometemos a manejar tus datos de forma responsable y a recopilar únicamente lo necesario para ofrecer el Servicio.", "Al usar Learntopia, aceptas las prácticas descritas en esta política."] },
        { heading: "2. Información que Recopilamos", body: ["Recopilamos las siguientes categorías limitadas de información:"], list: ["Información de la cuenta — tu nombre visible y dirección de correo, proporcionados al registrarte o a través de tu cuenta de Google si usas el inicio de sesión con Google.", "Foto de perfil — solo cuando tu cuenta de Google la proporciona.", "Datos de aprendizaje — los cursos en los que te inscribes, tu progreso en módulos y cursos, tus intentos y puntuaciones de cuestionarios, y tu racha diaria de inicio de sesión.", "Datos técnicos — los tokens de sesión de autenticación necesarios para mantenerte conectado de forma segura."] },
        { heading: "3. Cómo Recopilamos la Información", body: ["Recopilamos información directamente de ti cuando creas una cuenta o usas funciones del Servicio, y automáticamente a medida que avanzas en cursos y cuestionarios. Si eliges iniciar sesión con Google, recibimos datos básicos del perfil (nombre, correo y foto) de Google según la configuración de tu cuenta de Google."] },
        { heading: "4. Cómo Usamos tu Información", body: ["Usamos tu información únicamente para operar y mejorar el Servicio, específicamente para:"], list: ["Crear y proteger tu cuenta y mantener tu sesión autenticada.", "Guardar y mostrar tus inscripciones a cursos, progreso y puntuaciones de cuestionarios en tu panel.", "Calcular y mostrar rachas diarias de inicio de sesión y clasificaciones.", "Proporcionar las funciones educativas principales de la plataforma.", "Mantener la seguridad, integridad y fiabilidad del Servicio."] },
        { heading: "5. Cómo Almacenamos y Protegemos tus Datos", body: ["Tus datos se almacenan usando Google Firebase — específicamente Firebase Authentication y la base de datos Cloud Firestore. El acceso se rige por estrictas reglas de seguridad del lado del servidor que garantizan que tu perfil, progreso y datos de cuestionarios solo puedan ser leídos y escritos por ti mientras estás autenticado.", "Los datos de la clasificación (solo nombre visible y puntuación total) se almacenan en una colección separada y pueden ser leídos por cualquier usuario autenticado. Tu correo electrónico, progreso de cursos e historial de cuestionarios nunca se exponen en la clasificación.", "Tomamos medidas técnicas razonables para proteger tu información; sin embargo, ningún método de transmisión o almacenamiento es completamente seguro."] },
        { heading: "6. Compartir y Divulgar Datos", body: ["Respetamos tu privacidad y limitamos la divulgación de tus datos. En concreto:"], list: ["No vendemos, alquilamos ni intercambiamos tu información personal con nadie.", "No usamos tus datos para publicidad dirigida.", "Solo compartimos datos con el proveedor de infraestructura (Google Firebase) que los procesa y almacena en nuestro nombre.", "Podemos divulgar información si la ley lo exige o para proteger los derechos, la seguridad o la integridad de los usuarios y del Servicio."] },
        { heading: "7. Privacidad de los Menores", body: ["Learntopia está dirigido a niños y adolescentes, por lo que nos tomamos muy en serio la privacidad de los menores. Recopilamos únicamente la información mínima necesaria para ofrecer la experiencia de aprendizaje y nunca solicitamos datos personales innecesarios. Animamos a padres y tutores a supervisar el uso del Servicio por parte de sus hijos.", "Un padre o tutor puede contactarnos en cualquier momento para revisar, corregir o solicitar la eliminación de la información de un menor, y actuaremos sobre dichas solicitudes con prontitud."] },
        { heading: "8. Cookies y Tecnologías Similares", body: ["Usamos únicamente el almacenamiento estrictamente necesario para mantenerte conectado entre visitas, como los datos de sesión de autenticación gestionados por Firebase. No usamos cookies de publicidad ni de rastreo entre sitios."] },
        { heading: "9. Retención de Datos", body: ["Conservamos tu información mientras tu cuenta permanezca activa o según sea necesario para ofrecer el Servicio. Cuando solicites la eliminación de tu cuenta, eliminaremos tus datos personales asociados, salvo cuando estemos obligados a conservarlos para cumplir con una obligación legal."] },
        { heading: "10. Tus Derechos y Opciones", body: ["Según tu ubicación, puedes tener derechos sobre tus datos personales, incluido el derecho a:"], list: ["Acceder a la información personal que tenemos sobre ti.", "Solicitar la corrección de información inexacta o incompleta.", "Solicitar la eliminación de tu cuenta y los datos asociados.", "Retirar el consentimiento para el procesamiento opcional cuando corresponda."] },
        { heading: "11. Transferencias Internacionales de Datos", body: ["Debido a que usamos Google Firebase, tus datos pueden procesarse y almacenarse en servidores ubicados en otros países. Cuando los datos se transfieren internacionalmente, siguen sujetos a las salvaguardas adecuadas proporcionadas por el proveedor de infraestructura."] },
        { heading: "12. Servicios y Enlaces de Terceros", body: ["El Servicio depende de Google Firebase para la autenticación y el almacenamiento, y tu uso del inicio de sesión con Google también se rige por la propia política de privacidad de Google. El Servicio puede ocasionalmente hacer referencia a recursos de terceros; no somos responsables de las prácticas de privacidad de dichos terceros."] },
        { heading: "13. Cambios en esta Política", body: ["Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando hagamos cambios importantes, actualizaremos la fecha de \"Última actualización\" en la parte superior de esta página y, cuando corresponda, proporcionaremos un aviso adicional. Te animamos a revisar esta página periódicamente."] },
      ],
    },
    terms: {
      footerTitle: "¿Preguntas sobre estos Términos?",
      footerPre: "Contáctanos en",
      footerEmail: "Escribir a Soporte",
      footerMid: "o revisa nuestra",
      footerPrivacy: "Política de Privacidad",
      sections: [
        { heading: "1. Introducción y Aceptación", body: ["Estos Términos de Servicio (\"Términos\") rigen tu acceso y uso del sitio web, los cursos, los cuestionarios y los servicios relacionados de Learntopia (en conjunto, el \"Servicio\"). Al crear una cuenta o usar el Servicio, confirmas que has leído, entendido y aceptas quedar vinculado por estos Términos y por nuestra Política de Privacidad, que se incorpora aquí como referencia.", "Si no estás de acuerdo con alguna parte de estos Términos, no debes acceder ni usar el Servicio."] },
        { heading: "2. Definiciones", body: ["Para mayor claridad, los siguientes términos se usan a lo largo de este documento:"], list: ["\"Nosotros\", \"nos\" y \"nuestro\" se refieren al operador de Learntopia.", "\"Tú\" y \"Usuario\" se refieren a cualquier persona que acceda o use el Servicio.", "\"Contenido\" se refiere a todos los cursos, módulos, ejercicios, cuestionarios, textos, gráficos y demás material disponible a través del Servicio.", "\"Cuenta\" se refiere al perfil personal que creas para acceder a las funciones del Servicio."] },
        { heading: "3. Elegibilidad y Consentimiento Parental", body: ["El Servicio está diseñado como una herramienta educativa para niños y adolescentes. Si eres menor de edad, solo puedes usar el Servicio con el conocimiento, la participación y el consentimiento de un padre o tutor legal, quien acepta ser responsable de tu uso del Servicio y del cumplimiento de estos Términos.", "Al usar el Servicio, declaras que tienes la capacidad legal para aceptar estos Términos, o que un padre o tutor ha otorgado el consentimiento necesario en tu nombre."] },
        { heading: "4. Registro de Cuenta y Seguridad", body: ["Para acceder a ciertas funciones, debes crear una Cuenta usando una dirección de correo válida o un proveedor de inicio de sesión externo compatible (como Google). Aceptas proporcionar información precisa y completa y mantenerla actualizada.", "Eres responsable de proteger tus credenciales de acceso y de toda actividad que ocurra en tu Cuenta. Debes notificarnos de inmediato cualquier uso o acceso no autorizado a tu Cuenta. No somos responsables de ninguna pérdida derivada de no mantener seguras tus credenciales."] },
        { heading: "5. Uso Aceptable", body: ["Aceptas usar el Servicio únicamente con fines lícitos y educativos. En particular, aceptas:"], list: ["Usar los cursos, módulos y cuestionarios para un aprendizaje y una autoevaluación genuinos.", "Tratar a los demás usuarios y a la comunidad con respeto en cualquier interacción.", "Cumplir con todas las leyes aplicables y con estos Términos mientras usas el Servicio.", "Proporcionar información veraz al crear y mantener tu Cuenta."] },
        { heading: "6. Actividades Prohibidas", body: ["No debes, ni debes intentar:"], list: ["Copiar, reproducir, revender o redistribuir cualquier Contenido sin nuestro permiso previo por escrito.", "Interferir, interrumpir u obtener acceso no autorizado al Servicio, sus servidores o sus sistemas subyacentes.", "Eludir, deshabilitar o manipular cualquier función de seguridad o de seguimiento del progreso del Servicio.", "Usar el Servicio para transmitir material dañino, ilícito o malicioso, o para acosar a cualquier persona.", "Usar medios automatizados para acceder al Servicio de una manera que suponga una carga excesiva para nuestra infraestructura."] },
        { heading: "7. Propiedad Intelectual", body: ["El Servicio y todo el Contenido — incluidos el nombre, el logotipo, el diseño, los materiales de los cursos y el software de Learntopia — son propiedad nuestra o de nuestros licenciantes y están protegidos por las leyes de propiedad intelectual. Sujeto al cumplimiento de estos Términos, te otorgamos una licencia limitada, no exclusiva, intransferible y revocable para acceder y usar el Servicio y el Contenido para tu aprendizaje personal y no comercial.", "No se otorgan otros derechos. Todos los derechos no concedidos expresamente quedan reservados por nosotros."] },
        { heading: "8. Aviso Legal Educativo", body: ["El Contenido se proporciona únicamente con fines educativos e informativos generales. Aunque nos esforzamos por mantenerlo preciso y actualizado, no ofrecemos garantía sobre la exhaustividad o exactitud de ningún Contenido, ni garantizamos ningún resultado, puntuación, titulación o efecto concreto del uso del Servicio."] },
        { heading: "9. Disponibilidad y Modificaciones del Servicio", body: ["El Servicio se ofrece actualmente de forma gratuita. Podemos añadir, modificar, suspender o interrumpir cualquier parte del Servicio en cualquier momento, y es posible que necesitemos dejar el Servicio temporalmente no disponible por mantenimiento o actualizaciones. Haremos esfuerzos razonables para minimizar las interrupciones, pero no somos responsables de la falta de disponibilidad del Servicio."] },
        { heading: "10. Servicios de Terceros", body: ["El Servicio depende de proveedores externos, incluido Google Firebase para la autenticación y el almacenamiento de datos. Tu uso de dichas funciones también puede estar sujeto a los términos y políticas del tercero correspondiente. No somos responsables de las prácticas de los servicios de terceros."] },
        { heading: "11. Suspensión y Terminación", body: ["Podemos suspender o cancelar tu acceso al Servicio, con o sin aviso, si incumples estos Términos o haces un mal uso del Servicio. Puedes dejar de usar el Servicio y solicitar la eliminación de tu Cuenta en cualquier momento. Las disposiciones que por su naturaleza deban sobrevivir a la terminación — incluidas las de propiedad intelectual, aviso legal y responsabilidad — seguirán aplicándose."] },
        { heading: "12. Renuncia de Garantías", body: ["El Servicio se proporciona \"tal cual\" y \"según disponibilidad\", sin garantías de ningún tipo, ya sean expresas o implícitas, incluidas las garantías implícitas de comerciabilidad, idoneidad para un fin particular y no infracción, en la máxima medida permitida por la ley."] },
        { heading: "13. Limitación de Responsabilidad", body: ["En la máxima medida permitida por la ley aplicable, no seremos responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo, ni de ninguna pérdida de datos o reputación, que surja de o esté relacionado con tu uso o incapacidad de usar el Servicio."] },
        { heading: "14. Indemnización", body: ["Aceptas indemnizarnos y eximirnos de responsabilidad ante cualquier reclamación, daño o gasto que surja de tu uso indebido del Servicio o de tu incumplimiento de estos Términos, en la medida permitida por la ley aplicable."] },
        { heading: "15. Ley Aplicable", body: ["Estos Términos se rigen por las leyes aplicables en la jurisdicción del operador, sin tener en cuenta los principios de conflicto de leyes. Cualquier disputa que surja de estos Términos será resuelta por los tribunales competentes de dicha jurisdicción."] },
        { heading: "16. Cambios en estos Términos", body: ["Podemos actualizar estos Términos de vez en cuando. Cuando hagamos cambios importantes, actualizaremos la fecha de \"Última actualización\" en la parte superior de esta página y, cuando corresponda, proporcionaremos un aviso adicional. Tu uso continuado del Servicio después de que los cambios entren en vigor constituye la aceptación de los Términos revisados."] },
      ],
    },
    doc: {
      featuresHeading: "Funciones",
      gettingStartedHeading: "Primeros Pasos",
      coursesHeading: "Cursos y Módulos Gamificados",
      coursesIntro: "Cada curso está diseñado para estudiantes de 7 a 16 años con una experiencia de lecciones gamificada y paso a paso. Los módulos deben completarse en orden para desbloquear el siguiente desafío.",
      tableColFeature: "Función / Componente",
      tableColDesc: "Descripción y Comportamiento",
      quizzesHeading: "Cuestionarios",
      quizzesIntro: "Los cuestionarios son evaluaciones sobre temas específicos, disponibles para todos los usuarios, incluidos los invitados. Cada cuestionario presenta un conjunto de preguntas de opción múltiple aleatorias con una cuenta regresiva de 15 segundos por pregunta.",
      dashboardHeading: "Panel",
      dashboardIntro: "El panel personal está disponible solo para usuarios autenticados. Reúne toda tu actividad de aprendizaje en una sola vista.",
      accountHeading: "Cuenta y Seguridad",
      accountIntro: "Puedes crear una cuenta con un correo y una contraseña, o iniciar sesión con Google. Tus datos se mantienen privados en tu cuenta y protegidos por sólidos controles de acceso aplicados en el servidor.",
      faqHeading: "Preguntas Frecuentes",
      footerTitle: "¿Falta algo o no queda claro?",
      footerPre: "Escríbenos a través de la",
      footerContact: "página de Contacto",
      footerMid: "o revisa nuestros",
      footerTerms: "Términos",
      footerAnd: "y la",
      footerPrivacy: "Política de Privacidad",
      features: [
        { title: "Soporte Multilingüe", text: "Cambia la interfaz de la plataforma entre los idiomas disponibles. Tu preferencia de idioma se guarda localmente y se aplica en cada visita." },
        { title: "Cursos Interactivos", text: "Inscríbete en itinerarios de cursos pensados para niños. Cada módulo contiene una lectura breve y una pregunta de comprensión. Debes responder correctamente para desbloquear el siguiente módulo — el progreso no se puede falsear." },
        { title: "Cuestionarios Cronometrados Dinámicos", text: "Pon a prueba tus conocimientos con una cuenta regresiva de 15 segundos por pregunta. Las preguntas se extraen de un gran conjunto y se aleatorizan en cada intento. Se muestra retroalimentación instantánea tras cada respuesta." },
        { title: "Sistema de Efectos de Sonido (Web Audio)", text: "Disfruta de efectos de sonido interactivos para respuestas correctas/incorrectas, finalización de módulos, fanfarrias de subida de nivel y desbloqueo de insignias, sintetizados 100% gratis y sin conexión en tu navegador. Activa o silencia el audio fácilmente desde la barra de navegación." },
        { title: "Panel Personal", text: "Consulta tus cursos inscritos y completados, barras de progreso por curso, tus mejores puntuaciones de cuestionarios, el total de puntos ganados y tu racha diaria actual, todo reunido en un solo lugar." },
        { title: "Rachas de Inicio de Sesión Diarias", text: "Tu racha aumenta cada día natural que inicias sesión. Si te saltas un día, la racha se reinicia. Las rachas se calculan según tu zona horaria local y se muestran en la cabecera del panel y en la cuadrícula de métricas." },
        { title: "Clasificaciones Globales y por Cuestionario", text: "La clasificación ordena a los usuarios por puntos totales y por puntuaciones de cuestionarios individuales. La pestaña y la página de clasificación son visibles exclusivamente para usuarios que han iniciado sesión, para proteger las clasificaciones de la comunidad." },
        { title: "Indicadores de Finalización de Cuestionarios", text: "Las tarjetas de cuestionarios completados muestran una insignia verde de Hecho y tu mejor puntuación. El botón Empezar se convierte en Repetir. Abandonar un cuestionario a mitad no cuenta como intento — las puntuaciones solo se registran en la pantalla de resultados." },
        { title: "Conservación de Puntuación de Invitados", text: "Haz un cuestionario como invitado y termínalo, luego usa el enlace de Iniciar Sesión o Registrarse en la pantalla de resultados. Tu puntuación se guarda automáticamente en tu perfil al autenticarte, sin pérdida de datos." },
        { title: "Tutores con IA", text: "Cada curso viene acompañado de un tutor con IA especializado y con una personalidad propia, diseñado para guiar a los estudiantes a través de la materia." },
        { title: "Modo de Concentración Estricto", text: "Un bloqueador de rutas personalizado detecta los intentos de navegación durante cuestionarios o desafíos de módulo activos y muestra un diálogo de confirmación para evitar la pérdida accidental de progreso." },
        { title: "Controles del Curso", text: "Cancela tu inscripción a cursos directamente desde tu panel. Reinicia un curso completado al 100% para empezar de nuevo. Retoma los cursos en curso justo donde los dejaste." },
        { title: "Catálogo con Búsqueda", text: "Filtra los cursos por título o materia usando el campo de búsqueda en vivo. Se muestra un estado vacío informativo cuando ningún resultado coincide con la búsqueda." },
        { title: "Privado y Seguro", text: "Tus datos — perfil, cursos, progreso e intentos de cuestionarios — son privados de tu cuenta. Solo tú puedes verlos o cambiarlos, y la clasificación muestra únicamente tu nombre y puntuación, nunca tu correo ni tus datos de contacto." },
      ],
      steps: [
        { step: "01", title: "Crea una cuenta", text: "Haz clic en Registrarse en la barra de navegación. Regístrate con tu correo y una contraseña, o continúa con Google para una configuración con un solo clic. Las cuentas de correo/contraseña requieren un nombre visible." },
        { step: "02", title: "Explora el catálogo de cursos", text: "Ve a Cursos para ver todos los itinerarios de aprendizaje disponibles. Usa la barra de búsqueda para filtrar por materia o título. Haz clic en cualquier tarjeta de curso para ver el temario completo y la lista de módulos." },
        { step: "03", title: "Inscríbete y empieza a aprender", text: "Haz clic en Inscribirse en la página de detalle del curso. Los módulos se desbloquean en orden — lee cada lección y luego responde correctamente la pregunta de comprensión para desbloquear el siguiente módulo." },
        { step: "04", title: "Haz cuestionarios", text: "Visita el Centro de Cuestionarios para poner a prueba tus conocimientos. Elige un tema, responde todas las preguntas dentro del tiempo límite y consulta tu puntuación en la pantalla de resultados. Los cuestionarios completados muestran una insignia de Hecho en la tarjeta de selección." },
        { step: "05", title: "Sigue tu progreso", text: "Abre tu Panel para ver los cursos inscritos, los porcentajes de finalización, tus mejores puntuaciones de cuestionarios, el total de puntos y tu racha actual. Consulta la Clasificación para comparar tu puntuación con la de otros." },
      ],
      coursesTable: [
        { concept: "Reproductor de Lecciones Paso a Paso", behaviour: "Presenta el contenido del módulo de una tarjeta a la vez con temas visuales distintos (Historia, Concepto, Dato Curioso, Consejo Pro, Ejemplo, Actividad, Resumen) y resaltado de sintaxis de código." },
        { concept: "Motor de Ejercicios Multitipo", behaviour: "Evalúa la comprensión mediante 4 formatos interactivos: Opción Múltiple (MCQ), Verdadero/Falso, Rellenar el Espacio y Emparejar Pares." },
        { concept: "Gamificación y Sistema de Niveles", behaviour: "Gana XP completando módulos de cursos (+50 XP cada uno, +100 XP por curso completo) y cuestionarios (20–100 XP según tu puntuación). Sube de nivel desde Programador Novato (Nivel 1) hasta Gran Maestro (Nivel 5)." },
        { concept: "Insignias y Celebraciones", behaviour: "Desbloquea insignias únicas de cada curso (p. ej. Pionero de Python, Mago de las Matemáticas) con superposiciones a pantalla completa al conseguirlas." },
        { concept: "Progreso del curso", behaviour: "Registra los módulos completados en tiempo real con barras de progreso, guardadas automáticamente. Retoma cuando quieras desde tu Panel de Estudiante." },
        { concept: "Reinicio del curso", behaviour: "Reinicia los cursos completados cuando quieras con el botón Empezar de Nuevo para repetir las lecciones y volver a practicar." },
      ],
      quizMeta: [
        { label: "Temporizador", value: "15 segundos por pregunta. El temporizador se reinicia en cada nueva pregunta." },
        { label: "Conjunto de preguntas", value: "Las preguntas se aleatorizan de un gran conjunto en cada intento, así que repetir un cuestionario ofrece una experiencia nueva." },
        { label: "Retroalimentación", value: "Después de enviar una respuesta, la respuesta correcta se revela de inmediato antes de pasar a la siguiente pregunta." },
        { label: "Registro de puntuación", value: "Las puntuaciones solo se guardan cuando completas todas las preguntas y llegas a la pantalla de resultados. Salir antes no registra nada." },
        { label: "Puntos", value: "Cada respuesta correcta otorga 10 puntos que se suman a tu total acumulado." },
        { label: "Sincronización con la clasificación", value: "Tu puntuación se sincroniza con la clasificación de cada cuestionario y tus puntos totales se actualizan en la clasificación global." },
        { label: "Intentos de invitados", value: "Los invitados pueden hacer cualquier cuestionario. En la pantalla de resultados, los enlaces permiten iniciar sesión o registrarse con transferencia automática de la puntuación." },
        { label: "Repetir", value: "Los cuestionarios completados muestran un botón de Repetir. Se registran las mejores puntuaciones — solo se muestra tu mejor puntuación por cuestionario." },
      ],
      dashboardList: [
        "Cabecera de perfil — muestra tu nombre visible, la inicial del avatar, los puntos totales y tu racha diaria actual.",
        "Cuadrícula de métricas — muestra puntos totales, intentos de cuestionarios, cursos inscritos y racha en tarjetas numéricas.",
        "Cursos activos — lista los cursos en curso con una barra de progreso en vivo y un botón de Continuar.",
        "Cursos completados — lista todos los cursos completados por completo.",
        "Mejores puntuaciones de cuestionarios — muestra tu mejor puntuación por cuestionario entre todos los intentos.",
        "Eliminar perfil — opción para eliminar permanentemente tu cuenta y todos los datos de aprendizaje en cualquier momento.",
      ],
      accountCards: [
        { title: "Privacidad Estricta de la Cuenta y Aislamiento de Datos", text: "Learntopia usa cifrado de nivel empresarial y un estricto aislamiento de cuentas para mantener seguro tu perfil de estudiante. Tu historial de aprendizaje personal, tus notas de cursos y la configuración de tu cuenta solo pueden ser consultados por ti cuando has iniciado sesión." },
        { title: "Guía de Autenticación Inteligente", text: "Al intentar iniciar sesión con un correo no registrado, se muestra automáticamente una opción interactiva para crear una cuenta nueva, rellenando previamente el correo que introdujiste en el formulario de registro. Del mismo modo, registrarse con un correo existente ofrece una opción de 1 clic para iniciar sesión sin volver a escribir las credenciales." },
        { title: "Funciona Sin Conexión", text: "Si tu conexión a internet se corta mientras haces un cuestionario o lees un módulo, tu progreso se mantiene a salvo en tu dispositivo y se sincroniza automáticamente en cuanto te reconectas, para que nunca pierdas tu lugar." },
        { title: "Resistente por Diseño", text: "Si alguna vez una página no carga por una conexión inestable, Learntopia muestra una opción amigable para recargar en lugar de una pantalla en blanco o un error — una señal perdida nunca interrumpe tu sesión." },
        { title: "Tus Datos Siguen Siendo Tuyos", text: "Tu perfil, cursos, progreso e historial de cuestionarios están vinculados a tu cuenta y nadie más puede verlos ni modificarlos. Entre bastidores, las salvaguardas mantienen las puntuaciones e insignias justas y a prueba de manipulaciones, para que la clasificación siga siendo honesta." },
      ],
      faq: [
        { q: "¿Necesito una cuenta para usar Learntopia?", a: "No. Los cursos y cuestionarios se pueden explorar sin una cuenta. Sin embargo, el progreso, las puntuaciones y las rachas solo se guardan para usuarios autenticados. Las puntuaciones de cuestionarios de invitados pueden guardarse de forma retroactiva iniciando sesión desde la pantalla de resultados." },
        { q: "¿Cómo funciona el contador de rachas?", a: "Tu racha aumenta en uno cada día natural que inicias sesión (calculado según tu zona horaria local). Iniciar sesión varias veces el mismo día cuenta como un día. Saltarte un día reinicia la racha a 1." },
        { q: "¿Por qué no apareció mi puntuación en la clasificación?", a: "Las puntuaciones solo se registran cuando completas todas las preguntas y llegas a la pantalla de resultados. Salir a mitad del cuestionario no guarda ningún dato. Si has iniciado sesión y completas un cuestionario, la puntuación debería aparecer en la clasificación en segundos." },
        { q: "¿Qué pasa si salgo de un cuestionario a la mitad?", a: "No se guarda nada. No hay crédito parcial. La tarjeta del cuestionario no mostrará una insignia de Hecho. Puedes reiniciar el cuestionario desde cero en cualquier momento." },
        { q: "¿Cómo funciona la finalización de un curso?", a: "Debes completar cada módulo en orden. Cada módulo requiere una respuesta correcta a la pregunta de comprensión antes de que se desbloquee el siguiente. El curso se marca como completado solo cuando todos los módulos están hechos." },
        { q: "¿Puedo reiniciar un curso completado?", a: "Sí. Abre la página de detalle de un curso completado al 100%. Aparecerá un botón de Empezar de Nuevo que te permite reiniciar todo el progreso de los módulos y comenzar desde el primero." },
        { q: "¿La plataforma es gratuita?", a: "Sí, completamente gratuita. Sin suscripción, sin cursos de pago, sin publicidad." },
        { q: "¿Quién puede ver mi puntuación en la clasificación?", a: "Cualquier usuario autenticado de Learntopia puede ver la Clasificación Global. Muestra únicamente tu nombre visible y tus puntos totales. Tu correo, el progreso de los cursos y el historial de cuestionarios nunca son visibles para otros usuarios." },
      ],
    },
    toasts: {
      // Títulos de las notificaciones
      titleLogin: "¡Bienvenido de nuevo!",
      titleSignup: "¡Bienvenido a Learntopia!",
      titleLogout: "¡Hasta pronto!",
      titleProfile: "Perfil guardado",
      titleQuiz: "¡Puntuación guardada!",
      titleUnenroll: "Curso cancelado",
      titleDelete: "Cuenta eliminada",
      titleSuccess: "¡Listo!",
      titleError: "Ups",
      titleWarning: "Atención",
      titleInfo: "Buena info",
      // Botones de las notificaciones
      btnLogin: "Ir al panel",
      btnSignup: "Empezar a aprender",
      btnLogout: "Hasta luego",
      btnProfile: "Hecho",
      btnQuiz: "Ver clasificación",
      btnUnenroll: "De acuerdo",
      btnDelete: "Adiós",
      btnGeneric: "Entendido",
      btnRetry: "Reintentar",
      // Mensajes
      loginSuccess: "¡Sesión iniciada! Sigue con tu racha.",
      loginGoogleSuccess: "¡Sesión iniciada con Google! Sigue así.",
      signupSuccess: "¡Cuenta lista! Explora cursos y gana XP.",
      signupGoogleSuccess: "¡Cuenta lista! Explora cursos y gana XP.",
      quizScoreSaved: "Puntuación guardada. ¡Bien hecho!",
      googleFailed: "Error con Google. Inténtalo de nuevo.",
      googlePopupBlocked: "Ventana bloqueada. Permite las emergentes e inténtalo.",
      googleUnauthorizedDomain: "Sitio no autorizado para Google aún.",
      googleNotEnabled: "Google aún no está habilitado.",
      googleNetwork: "Error de red. Comprueba tu conexión.",
      noAccount: "No hay cuenta para este correo.",
      wrongPassword: "Contraseña incorrecta. Inténtalo de nuevo.",
      invalidEmail: "Ese correo parece incompleto.",
      invalidCredentials: "Correo o contraseña no válidos.",
      emailInUse: "Ese correo ya está registrado.",
      weakPassword: "Usa al menos 6 caracteres.",
      signupFailed: "No pudimos crear tu cuenta. Inténtalo.",
      logoutSafe: "Sesión cerrada. ¡Vuelve mañana por tu racha!",
      logoutFailed: "Error al cerrar sesión.",
      loggedOut: "Sesión cerrada. ¡Vuelve mañana por tu racha!",
      logoutFailedRetry: "No pudimos cerrar sesión. Inténtalo.",
      unenrollFailed: "No se pudo cancelar. Inténtalo de nuevo.",
      noNewXpModule: "¡Ya hecho — bien por repasarlo!",
      replayModuleNoXp: "¡Buen repaso! Sin XP nuevo, pero sigue afilado.",
      noNewXpQuiz: "¡Casi! Supera tu mejor puntuación para ganar más XP.",
      unenrolledFrom: "Movido a Cancelados — vuelve cuando quieras.",
      rejoined: "De vuelta en \"{title}\" — progreso guardado.",
      rejoinFailed: "No se pudo volver a unir. Inténtalo.",
      deleteConfirmType: "Escribe DELETE para confirmar.",
      profileDeleted: "Perfil eliminado. ¡Te extrañaremos, Explorador!",
      deleteWrongPassword: "Esa contraseña no es correcta. No se eliminó nada.",
      deleteReauthCancelled: "Se canceló la confirmación con Google. No se eliminó nada.",
      deleteReauthFailed: "No pudimos confirmar que eres tú. No se eliminó nada.",
      deleteFailed: "Tu cuenta no se eliminó por completo. Inténtalo de nuevo para terminar.",
      accessDenied: "Acceso denegado — se requiere admin.",
      adminNotALearner: "Las cuentas de administrador no hacen cursos ni cuestionarios. Usa una cuenta de estudiante para eso.",
      notAnAdminSignedIn: "Esa cuenta no es de administrador. Te conectamos como estudiante.",
      adminWelcome: "Bienvenido, Administrador",
      googleAuthFailed: "Error de autenticación con Google.",
      adminLoggedOut: "Sesión cerrada del Centro de Administración.",
      loadDataFailed: "Error al cargar datos de administración.",
      provideTitleDesc: "Añade un título y una descripción.",
      logSaved: "Registro guardado.",
      saveLogFailed: "Error al guardar el registro.",
      noStudentData: "No hay datos para exportar.",
      exportedCsv: "Lista de estudiantes exportada a CSV.",
      loginToView: "Inicia sesión para ver el curso.",
      saveProgressFailed: "No pudimos guardar tu progreso. Inténtalo.",
      courseCompleted: "¡Curso completado! +100 XP.",
      markCompleteFailed: "No se pudo marcar como completado. Inténtalo.",
      courseReset: "¡Curso reiniciado — nuevo comienzo!",
      resetFailed: "No se pudo reiniciar el curso. Inténtalo.",
      loginToEnroll: "Inicia sesión para inscribirte.",
      enrollFailed: "No se pudo inscribir. Inténtalo de nuevo.",
      quizProgressSaved: "¡Progreso guardado!",
      quizProgressFailed: "Error al guardar el progreso.",
      timesUp: "¡Se acabó el tiempo!",
    },
    modals: {
      leaveTitle: "¿Salir del Temario?",
      leaveAction: "Salir",
      leaveBody: "¿Seguro que quieres salir del temario?",
      leaveResetPre: "Cualquier ",
      leaveResetBold: "respuesta sin enviar",
      leaveResetPost: " de tu módulo actual se reiniciará.",
      leaveSavedPre: "Los módulos que ya has ",
      leaveSavedBold: "completado",
      leaveSavedPost: " están guardados de forma segura y no se perderán.",
      resetTitle: "¿Empezar de Nuevo?",
      resetAction: "Sí, reiniciar el curso",
      resetBody: "¿Seguro que quieres reiniciar tu progreso y empezar este curso desde el principio?",
      resetWarnLabel: "Advertencia:",
      resetWarnText: " Todas tus marcas actuales y las fechas de finalización se borrarán permanentemente. Esta acción no se puede deshacer.",
      dashNoProfileTitle: "Sin perfil activo",
      dashNoProfileDesc: "Inicia sesión para ver tu panel.",
    },
    quizzesData: {
      python: {
        title: "Python para Niños",
        subject: "Programación",
        description: "¡Pon a prueba tus conocimientos de Python básico, variables y bucles!",
        questions: [
          { questionText: "¿Qué es Python?", options: ["Un tipo de serpiente", "Un lenguaje de computadora", "Un videojuego", "Una calculadora"] },
          { questionText: "¿Qué comando hace que la computadora muestre texto?", options: ["show()", "speak()", "print()", "display()"] },
          { questionText: "Python es famoso por ser:", options: ["Muy difícil de leer", "Solo para científicos", "Fácil de leer para humanos", "Solo para computadoras viejas"] },
          { questionText: "¿Qué es una variable?", options: ["Una caja etiquetada para guardar datos", "Un tipo de error", "Un problema de matemáticas", "Una impresora"] },
          { questionText: "¿Cómo llamamos al texto como 'Hola' en programación?", options: ["Entero", "Cadena (String)", "Número", "Texto de robot"] },
          { questionText: "Si score = 4 + 6, ¿qué hay dentro de la variable score?", options: ["46", "4 + 6", "10", "Error"] },
          { questionText: "¿Qué permiten hacer las 'sentencias if' a un programa?", options: ["Fallar", "Tomar decisiones", "Mostrar texto", "Guardar variables"] },
          { questionText: "En código, ¿qué significa el símbolo '>'?", options: ["Igual a", "Menor que", "Mayor que", "Más"] },
          { questionText: "¿Cuál de estas es una sentencia if correcta?", options: ["if score is 10 then win", "if score > 10:", "score if 10", "if (10) score"] },
          { questionText: "¿Qué comando permite al usuario escribir una respuesta?", options: ["print()", "type()", "input()", "read()"] },
          { questionText: "¿Por qué usamos un bucle en un juego?", options: ["Para hacerlo colorido", "Para dejar que el jugador adivine varias veces", "Para detener el juego", "Para hacerlo más difícil"] },
          { questionText: "Si el secreto es 5 y adivinas 8, el programa debería decir:", options: ["¡Muy bajo!", "¡Muy alto!", "¡Ganaste!", "Error"] },
          { questionText: "¿En qué programa de TV se inspiró el nombre de Python?", options: ["Python Rangers", "Monty Python's Flying Circus", "The Daily Python", "Snake TV"] },
          { questionText: "¿Qué tipo de dato es un número entero como 5?", options: ["Cadena (String)", "Entero (Integer)", "Decimal (Float)", "Booleano"] },
          { questionText: "Si Mario golpea a un Goomba, ¿qué tipo de sentencia maneja que pierda una vida?", options: ["Una sentencia print", "Una sentencia if", "Un bucle", "Una cadena"] }
        ]
      },
      math: {
        title: "Magia Matemática",
        subject: "Matemáticas",
        description: "Pon a prueba tus habilidades en secuencias, geometría y acertijos lógicos.",
        questions: [
          { questionText: "¿Cuál es el siguiente número en: 5, 10, 15, 20...?", options: ["22", "25", "30", "100"] },
          { questionText: "¿Cuál es el siguiente número en: 1, 3, 5, 7...?", options: ["8", "9", "10", "11"] },
          { questionText: "¿Cómo llamamos a una lista de números que sigue una regla?", options: ["Un desorden", "Una secuencia", "Una variable", "Un bucle"] },
          { questionText: "¿Cuántos lados tiene un hexágono?", options: ["4", "5", "6", "8"] },
          { questionText: "¿Cómo llamamos a un cuadrado en 3D?", options: ["Esfera", "Cubo", "Pirámide", "Cilindro"] },
          { questionText: "¿Qué tipo de ángulo mide exactamente 90 grados?", options: ["Ángulo lindo", "Ángulo recto", "Ángulo incorrecto", "Ángulo izquierdo"] },
          { questionText: "Si A es más alto que B, y B es más alto que C. ¿Quién es el más alto?", options: ["A", "B", "C", "Son iguales"] },
          { questionText: "Tengo 4 patas pero no puedo caminar. ¿Qué soy?", options: ["Un perro", "Una silla", "Un pájaro", "Una serpiente"] },
          { questionText: "¿Qué es el razonamiento deductivo?", options: ["Adivinar al azar", "Usar pistas para eliminar respuestas incorrectas", "Sumar números", "Dibujar formas"] },
          { questionText: "¿Qué es un algoritmo?", options: ["Un error matemático", "Un tipo de dinosaurio", "Una lista de instrucciones paso a paso", "Una figura 3D"] },
          { questionText: "¿Por qué importa el orden de los pasos en un algoritmo?", options: ["No importa", "Para que la computadora no se confunda y falle", "Porque se ve bonito", "Para ahorrar electricidad"] },
          { questionText: "¿Cuál es la mejor forma de resolver un problema enorme y difícil?", options: ["Dividirlo en pasos pequeños y sencillos", "Empezar por la parte más difícil e ir hacia atrás", "Hacerlo entero de cabeza y de una vez", "Saltar al resultado y comprobarlo después"] },
          { questionText: "La secuencia de Fibonacci se encuentra en:", options: ["Solo en libros de texto", "Semillas de girasol y galaxias", "Solo en computadoras", "En ningún lugar"] },
          { questionText: "Si tienes un triángulo, ¿cuántos ángulos tiene?", options: ["2", "3", "4", "5"] },
          { questionText: "¿Qué empresa usa algoritmos para encontrar sitios web para ti?", options: ["Nintendo", "Google", "McDonald's", "Ford"] }
        ]
      },
      finance: {
        title: "Dinero Inteligente",
        subject: "Finanzas",
        description: "Presupuestos, inversiones y la historia del dinero.",
        questions: [
          { questionText: "¿Qué es el trueque?", options: ["Usar tarjetas de crédito", "Intercambiar bienes directamente", "Invertir en acciones", "Ahorrar en un banco"] },
          { questionText: "¿Por qué se inventó el dinero?", options: ["Porque las monedas brillan", "Para facilitar el comercio", "Para hacer las carteras pesadas", "Porque las gallinas se escaparon"] },
          { questionText: "El dinero solo funciona si...", options: ["Está hecho de oro", "Está impreso en papel verde", "Todos acuerdan que tiene valor", "Tiene la cara de un presidente"] },
          { questionText: "El dinero que ENTRA a tu bolsillo se llama:", options: ["Gasto", "Ingreso", "Impuesto", "Deuda"] },
          { questionText: "El dinero que SALE (cuando compras algo) se llama:", options: ["Gasto", "Ingreso", "Ganancia", "Dividendo"] },
          { questionText: "Un buen presupuesto asegura que...", options: ["Gastes todo", "Tus gastos sean mayores que tus ingresos", "Tus gastos sean menores que tus ingresos", "Compres juguetes cada día"] },
          { questionText: "Cuando un banco te paga por guardar dinero con ellos, se llama:", options: ["Impuestos", "Interés", "Multas", "Préstamos"] },
          { questionText: "¿Qué es el interés compuesto?", options: ["Ganar interés sobre el interés", "Perder dinero", "Pagar al banco", "Interés simple"] },
          { questionText: "El interés compuesto funciona mejor cuando...", options: ["Sacas tu dinero de inmediato", "Dejas tu dinero en el banco por mucho tiempo", "Lo gastas todo", "Lo escondes bajo la cama"] },
          { questionText: "Cuando compras una acción, ¿qué estás comprando?", options: ["Un trozo de papel", "Una pequeña parte de una empresa", "Un préstamo al gobierno", "Un producto"] },
          { questionText: "El objetivo de invertir es...", options: ["Hacer crecer tu dinero", "Perder dinero", "Mantenerlo exactamente igual", "Pagar impuestos"] },
          { questionText: "¿Es arriesgado invertir?", options: ["No, está garantizado", "Sí, las empresas pueden perder valor", "Solo para personas mayores", "No, siempre ganas"] },
          { questionText: "La regla de oro para crear riqueza es:", options: ["Siempre gastar menos de lo que ganas", "Gastar todo lo que tienes", "Pedir prestado lo máximo posible", "Nunca usar un banco"] },
          { questionText: "¿Qué es un presupuesto?", options: ["Un tipo de animal", "Un plan para tu dinero", "Un tipo de cuenta bancaria", "Un préstamo"] },
          { questionText: "Si compras acciones de Disney, eres dueño de:", options: ["Toda la empresa", "Una pequeña parte de Disney", "Todas sus películas", "Nada"] }
        ]
      },
      marketing: {
        title: "Creadores del Futuro",
        subject: "Marketing",
        description: "Marca, narrativa y seguridad digital para creadores.",
        questions: [
          { questionText: "¿Qué es una marca?", options: ["Solo un logo", "El sentimiento y la reputación de una empresa", "El edificio donde trabajan", "El nombre del director"] },
          { questionText: "¿Por qué las empresas usan colores específicos?", options: ["Porque son baratos", "Para provocar emociones específicas", "Porque es al azar", "Para esconder la suciedad"] },
          { questionText: "¿Cuál de estos es parte de la identidad de una marca?", options: ["Logos, colores y tipografías", "Salarios de empleados", "Las sillas de oficina", "Declaraciones de impuestos"] },
          { questionText: "En marketing, ¿quién debe ser el Héroe de la historia?", options: ["El director", "El producto", "El cliente", "El competidor"] },
          { questionText: "¿Por qué usamos la narrativa en marketing?", options: ["Para dormir a la gente", "Para crear una conexión emocional", "Para llenar espacio", "Para confundir a la gente"] },
          { questionText: "Una buena historia debe enganchar al espectador en los primeros...", options: ["3 segundos", "3 minutos", "1 hora", "3 días"] },
          { questionText: "¿Qué es tu huella digital?", options: ["Tu talla de zapato", "El rastro de datos que dejas en línea", "La tinta de tu impresora", "La pantalla de tu computadora"] },
          { questionText: "¿Cuál de los siguientes es información personal (PII) que NUNCA debes compartir?", options: ["Tu película favorita", "Tu dirección de casa", "Un dibujo", "Una reseña de un juego"] },
          { questionText: "¿Se pueden borrar fácilmente las cosas para siempre de internet?", options: ["Sí, al instante", "No, la gente puede tomar capturas y guardarlas", "Sí, pidiéndolo amablemente", "Sí, si apagas la computadora"] },
          { questionText: "¿Qué significa CTA?", options: ["Llamada a la acción (Call To Action)", "Alineación central del texto", "Costo de publicidad", "Clic para añadir"] },
          { questionText: "¿Cuál es un ejemplo de un CTA?", options: ["'Vendemos zapatos.'", "'¡Suscríbete para más videos!'", "'Las manzanas son rojas.'", "'Hola.'"] },
          { questionText: "Antes de lanzar una campaña, necesitas conocer tu...", options: ["Color favorito", "Público objetivo", "Talla de zapato", "Pedido de almuerzo"] },
          { questionText: "¿Qué colores usa McDonald's para hacerte sentir feliz y con hambre?", options: ["Azul y verde", "Rojo y amarillo", "Negro y blanco", "Morado y naranja"] },
          { questionText: "En una historia de marketing, el producto debe actuar como el:", options: ["Héroe", "Villano", "Guía", "Fondo"] },
          { questionText: "¿Cuál es la mejor forma de practicar la ciudadanía digital?", options: ["Ser grosero en los comentarios", "Respetar a los demás y dar crédito", "Robar arte", "Compartir contraseñas"] }
        ]
      },
      web: {
        title: "Maravillas Web",
        subject: "Ciencia",
        description: "Pon a prueba tus habilidades de HTML, CSS y diseño.",
        questions: [
          { questionText: "¿Qué proporciona HTML a una página web?", options: ["Colores", "Animaciones", "La estructura básica (esqueleto)", "La base de datos"] },
          { questionText: "¿Qué etiqueta se usa para el encabezado más grande?", options: ["<p>", "<h1>", "<h6>", "<div>"] },
          { questionText: "¿Qué etiqueta se usa para un párrafo de texto?", options: ["<text>", "<p>", "<para>", "<h>"] },
          { questionText: "¿Qué hace CSS?", options: ["Construye la estructura", "Da estilo a la página con colores y diseños", "Guarda contraseñas", "Ejecuta el servidor"] },
          { questionText: "¿Cómo harías el texto rojo en CSS?", options: ["text: red;", "color: red;", "font-color: red;", "make-red;"] },
          { questionText: "¿Puede CSS cambiar la tipografía de tu texto?", options: ["Sí", "No", "Solo los martes", "Solo si es azul"] },
          { questionText: "En el modelo de caja de CSS, ¿cómo se llama el espacio DENTRO del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] },
          { questionText: "¿Cómo se llama el espacio FUERA del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] },
          { questionText: "¿Las imágenes circulares son en realidad cajas en CSS?", options: ["Sí, todo es una caja", "No, los círculos son círculos", "No, son triángulos", "Solo si son rojas"] },
          { questionText: "¿Qué es un servidor?", options: ["Un camarero", "Una computadora que se mantiene en línea para alojar tus archivos", "Un tipo de CSS", "Una computadora rota"] },
          { questionText: "¿Qué obtienes para que la gente visite tu sitio?", options: ["Una URL", "Una memoria USB", "Una contraseña", "Un libro"] },
          { questionText: "¿Qué significa 'Desplegar' (Deploying)?", options: ["Borrar tu código", "Poner tu código en un servidor en vivo para que el mundo lo vea", "Escribir HTML", "Jugar un juego"] },
          { questionText: "¿Qué es el DOM?", options: ["Modelo de Objetos del Documento", "Matemática Directa de Objetos", "Creador de Esquemas Digitales", "Perro en la Luna"] },
          { questionText: "¿Por qué es importante el HTML semántico?", options: ["Hace el sitio colorido", "Ayuda a usuarios ciegos y a los buscadores", "Hace el código más corto", "No es importante"] },
          { questionText: "¿Qué capa del modelo de caja contiene el texto real?", options: ["Margen (Margin)", "Borde (Border)", "Relleno (Padding)", "Contenido (Content)"] }
        ]
      },
      art: {
        title: "Arte Digital",
        subject: "Artes",
        description: "Capas, teoría del color y herramientas de dibujo.",
        questions: [
          { questionText: "¿A qué se parecen las capas en el arte digital?", options: ["Rocas pesadas", "Láminas de vidrio transparentes apiladas una sobre otra", "Una sola hoja de papel", "Un pincel"] },
          { questionText: "¿Por qué los artistas usan capas?", options: ["Para hacer el archivo pesado", "Para colorear sin arruinar el boceto (no destructivo)", "Para romper la computadora", "Para dibujar más lento"] },
          { questionText: "Si borras en la Capa 2, ¿se borra la Capa 1?", options: ["Sí", "No", "Solo si es roja", "Siempre"] },
          { questionText: "Los colores opuestos en la rueda cromática se llaman:", options: ["Análogos", "Complementarios", "Primarios", "Aburridos"] },
          { questionText: "¿Cuál es un ejemplo de colores complementarios?", options: ["Rojo y rosa", "Azul y naranja", "Verde y verde", "Negro y blanco"] },
          { questionText: "¿Qué crean los colores complementarios?", options: ["Aburrimiento", "Máximo contraste y emoción", "Un desastre gris", "Invisibilidad"] },
          { questionText: "¿Qué es la regla de los tercios?", options: ["Dividir el lienzo en una cuadrícula de 3x3", "Dibujar 3 círculos", "Usar solo 3 colores", "Tardar 3 horas en dibujar"] },
          { questionText: "¿Dónde debes colocar tu sujeto principal para una composición cinematográfica?", options: ["En el centro exacto", "Fuera del lienzo", "En las intersecciones de la cuadrícula", "Siempre en la esquina inferior"] },
          { questionText: "¿El centro exacto es siempre el mejor lugar para un personaje?", options: ["Sí", "No, la regla de los tercios suele ser mejor", "Siempre", "Solo los lunes"] },
          { questionText: "¿Qué es el renderizado?", options: ["Añadir luz y sombra para que parezca 3D", "Borrar el dibujo", "Añadir una firma", "Guardar el archivo"] },
          { questionText: "La parte del objeto que mira al sol recibe un:", options: ["Sombra", "Brillo (Highlight)", "Contorno", "Firma"] },
          { questionText: "La parte que da la espalda a la luz recibe una:", options: ["Brillo (Highlight)", "Sombra", "Color brillante", "Punto blanco"] },
          { questionText: "Al dibujar un personaje, ¿qué debes dibujar primero?", options: ["Ojos detallados", "Formas 3D básicas como esferas y cilindros", "El fondo", "El cabello"] },
          { questionText: "¿Qué significa 'valor' en la teoría del color?", options: ["Cuánto cuesta una pintura", "Qué tan claro u oscuro es un color", "Cuántos colores usas", "Qué tan grande es el pincel"] },
          { questionText: "¿Dónde ocurre la 'Oclusión Ambiental'?", options: ["A la luz directa del sol", "En hendiduras profundas donde la luz no llega", "En el cielo", "En el brillo"] }
        ]
      }
    ,
      computer: {
        title: "Computadora con Confianza",
        subject: "Informática",
        description: "Sistemas operativos, atajos, cómo llega la web hasta ti y correos que sí se leen.",
        questions: [
          { questionText: "¿De qué se encarga un sistema operativo?", options: ["Guardar tus fotos a salvo", "Hacer funcionar todos los demás programas", "Conectarte a internet", "Ajustar el brillo de la pantalla"] },
          { questionText: "¿Qué sistema operativo usan casi todos los servidores de las webs?", options: ["Windows", "macOS", "Linux", "Android"] },
          { questionText: "¿Por qué un Mac y un iPhone se sienten parecidos?", options: ["Se fabrican en una sola planta", "Sus sistemas comparten las mismas raíces", "Los dos necesitan internet constante", "Salieron el mismo año"] },
          { questionText: "¿Qué hace Ctrl+Z?", options: ["Guarda tu archivo", "Deshace lo último que hiciste", "Cierra la ventana", "Selecciona todo"] },
          { questionText: "¿Qué tecla sustituye a Ctrl en un Mac?", options: ["Alt", "Shift", "Cmd", "Fn"] },
          { questionText: "¿Qué atajo busca una palabra en la página que lees?", options: ["Ctrl+F", "Ctrl+S", "Ctrl+A", "Ctrl+V"] },
          { questionText: "Borras un párrafo sin querer. ¿Cuál es la solución más rápida?", options: ["Cerrar sin guardar", "Pulsar Ctrl+Z", "Reescribirlo de memoria", "Reiniciar la computadora"] },
          { questionText: "¿Qué ocurre cuando escribes una dirección web y pulsas enter?", options: ["Tu navegador la pide a un servidor", "La página se construye en tu computadora", "Tu proveedor elige un sitio por ti", "El navegador busca en tus archivos"] },
          { questionText: "¿Qué te dice el candado de la barra de direcciones?", options: ["Que el sitio es honesto", "Que la conexión va cifrada", "Que la página carga más rápido", "Que el sitio no tiene anuncios"] },
          { questionText: "En https://ejemplo.com/fotos, ¿qué parte elige la página?", options: ["https", "ejemplo.com", "/fotos", "El candado"] },
          { questionText: "Ninguna web carga. ¿Dónde está el problema, seguramente?", options: ["En esa web concreta", "En tu propia conexión", "En la barra de direcciones", "En tu teclado"] },
          { questionText: "¿Por qué importa un asunto claro?", options: ["Hace que el correo llegue antes", "La gente decide por él si lo abre", "El correo no se envía sin asunto", "Evita que acabe en spam"] },
          { questionText: "¿Qué hace poner a alguien en Cc?", options: ["Lo oculta de los demás", "Lo mantiene al tanto, a la vista", "Le envía el correo primero", "Le impide responder"] },
          { questionText: "Un correo pide tu contraseña o cerrarán tu cuenta. ¿Qué haces?", options: ["Responder rápido para no perder nada", "Enseñárselo a un adulto y no enviar nada", "Enviarla si el logo parece correcto", "Reenviarlo a todos tus amigos"] },
          { questionText: "¿Cuál de estos es un archivo enviado junto a un correo?", options: ["Un asunto", "Un adjunto", "Una firma", "Un destinatario"] }
        ]
      },
      nutrition: {
        title: "Científico de la Comida",
        subject: "Salud",
        description: "Calorías, los tres grandes macros, los micros diminutos y por qué nadie necesita lo mismo.",
        questions: [
          { questionText: "¿Qué mide una caloría?", options: ["Cuánto azúcar lleva un alimento", "Cuánta energía te da un alimento", "Cuánto pesa una ración", "Cuánto tarda en digerirse"] },
          { questionText: "¿Más o menos cuánta energía diaria usa tu cerebro?", options: ["Alrededor del dos por ciento", "Alrededor del veinte por ciento", "Más o menos la mitad", "Casi nada"] },
          { questionText: "¿En qué se va casi toda la energía que usas cada día?", options: ["Deporte y ejercicio", "Vivir y crecer", "Digerir la comida", "Cargar el teléfono"] },
          { questionText: "¿Qué significa macro en macronutriente?", options: ["Grande", "Raro", "Dulce", "Cocinado"] },
          { questionText: "¿Qué macronutriente construye y repara músculo sobre todo?", options: ["Carbohidrato", "Proteína", "Grasa", "Fibra"] },
          { questionText: "¿Qué macronutriente da la energía más rápida?", options: ["Carbohidrato", "Proteína", "Grasa", "Calcio"] },
          { questionText: "¿Qué hace la grasa en tu cuerpo?", options: ["Nada útil", "Energía lenta y protección", "Solo dar sabor a la comida", "Sustituir a la proteína"] },
          { questionText: "¿Cuántos de los tres macronutrientes necesita un cuerpo sano?", options: ["Solo uno", "Dos de ellos", "Los tres", "Ninguno"] },
          { questionText: "¿Qué te dan las vitaminas y los minerales?", options: ["Energía para correr", "Herramientas para tareas como formar hueso", "Peso corporal extra", "Agua para hidratarte"] },
          { questionText: "¿Qué mineral transporta oxígeno en tu sangre?", options: ["Calcio", "Hierro", "Sodio", "Zinc"] },
          { questionText: "¿Qué vitamina puede fabricar tu piel con el sol?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina K"] },
          { questionText: "¿Por qué enfermaban los marineros pese a tener comida de sobra?", options: ["Tomaban poca proteína", "Les faltaba vitamina C", "Bebían demasiada agua", "Solo comían de noche"] },
          { questionText: "¿Qué mineral forma sobre todo huesos y dientes?", options: ["Hierro", "Calcio", "Vitamina C", "Proteína"] },
          { questionText: "¿Qué cambia la energía que alguien necesita al día?", options: ["Solo su peso", "Su tamaño, edad y actividad", "Solo el deporte que hace", "La estación del año"] },
          { questionText: "¿Quién debería responder una duda sobre tu propia alimentación?", options: ["Un médico", "Un buscador", "Un vídeo de redes", "Quien publique más"] }
        ]
      },
      ai: {
        title: "La IA Explicada",
        subject: "Alfabetización en IA",
        description: "Cómo aprende la IA, por qué se equivoca con seguridad, por dónde entra la injusticia y cómo usarla bien.",
        questions: [
          { questionText: "¿Cómo aprende sobre todo la IA moderna a distinguir cosas?", options: ["Una persona escribe una regla por caso", "Encuentra patrones en muchos ejemplos", "Busca la respuesta en internet", "Pregunta a un humano cada vez"] },
          { questionText: "¿En qué se apoyaban los programas antiguos?", options: ["Reglas escritas por una persona", "Patrones hallados en fotos", "Preguntas hechas a los usuarios", "Adivinar al azar cada vez"] },
          { questionText: "¿Entiende un modelo de imágenes a un gato como tú?", options: ["Sí, exactamente igual", "No, solo reconoce patrones", "Sí, si ha visto suficientes", "Solo los animales que ha conocido"] },
          { questionText: "¿Por qué puede una IA inventarse un libro que no existe?", options: ["Su biblioteca está anticuada", "Predice palabras probables, no consulta", "Alguien borró el registro real", "Quiere engañarte a propósito"] },
          { questionText: "¿Cómo suena la IA cuando su respuesta es incorrecta?", options: ["Claramente insegura", "Igual de segura que siempre", "Se niega a responder", "Te avisa antes de responder"] },
          { questionText: "¿En qué es más débil la IA?", options: ["Explicar una idea otra vez", "Fechas y fuentes exactas", "Sugerir un punto de partida", "Reformular algo de forma simple"] },
          { questionText: "Una IA te da un dato para los deberes. ¿Y ahora?", options: ["Úsalo, sonaba seguro", "Compruébalo en otra fuente", "Pregúntale lo mismo otra vez", "Úsalo solo si es corto"] },
          { questionText: "¿Por qué dibuja una IA siempre al mismo tipo de persona en un oficio?", options: ["Ha decidido quién encaja", "Sus ejemplos mostraban sobre todo a esa persona", "Copia a otra IA", "Los demás son más difíciles de dibujar"] },
          { questionText: "¿De dónde suele venir el sesgo de un sistema de IA?", options: ["De los ejemplos con los que aprendió", "De las opiniones de la computadora", "Del país donde se usa", "De la hora a la que funciona"] },
          { questionText: "¿Cuál es una forma rápida de detectar esa injusticia?", options: ["Preguntar quién falta en la foto", "Hacer la pregunta una sola vez", "Mirar lo rápido que respondió", "Contar las palabras que usó"] },
          { questionText: "¿Qué hace que el sesgo de la IA sea mayor problema que la opinión de una persona?", options: ["Las máquinas no se corrigen", "Se repite a enorme velocidad y escala", "Solo afecta a las imágenes", "Nadie puede notarlo"] },
          { questionText: "¿Cuál es la mejor forma de usar la IA para los deberes?", options: ["Pedirle toda la respuesta", "Pedirle que explique la parte confusa", "Copiarla cambiando palabras", "Usarla cuando estés cansado"] },
          { questionText: "¿Qué pregunta te deja a ti el trabajo de pensar?", options: ["Escríbeme el trabajo sobre volcanes", "Explícame por qué sube el magma", "Dame la respuesta final", "Resuélveme este problema"] },
          { questionText: "¿Qué no debería entrar nunca en un chat de IA?", options: ["Una duda sobre tus deberes", "Tu dirección y tus contraseñas", "Una palabra que no entiendes", "Un tema que te da curiosidad"] },
          { questionText: "¿Por qué importa hacer tú el trabajo de pensar?", options: ["Es más rápido que usar la IA", "El esfuerzo es lo que te enseña", "Los profesores siempre lo notan", "La IA no se permite en clase"] }
        ]
      }},
    courseData: {
      "1": {
        title: "Python para Niños: ¡Crea tu Primer Juego!",
        desc: "Aprende a programar creando juegos reales. Perfecto para principiantes de 7 a 16 años. ¡Sumérgete en los fundamentos de Python y la mecánica de los juegos!",
        category: "Programación",
        difficulty: "Principiante",
        learningObjectives: [
          "Comprender los conceptos clave de programación",
          "Escribir scripts utilizando la sintaxis de Python",
          "Usar bucles, variables y lógica",
          "Construir un juego de texto totalmente jugable"
        ],
        prerequisites: ["Una computadora con acceso a internet", "Habilidades básicas de mecanografía"],
        modules: [
          {
            title: "Módulo 1: ¡Hola Python!",
            desc: "Aprende qué es Python y escribe tus primeras líneas de código.",
            contentSections: [
              { title: "Conoce a Alex el Inventor", content: "Alex tiene 11 años y le encantan los videojuegos. Un día pensó: ¿y si pudiera CREAR uno en vez de solo jugarlo? Su profesora le dijo que sí, que solo necesitaba Python. Esta también es tu historia." },
              { title: "¿Qué es Python?", content: "Python es un lenguaje para decirle a las computadoras qué hacer. Imagina un amigo robot que solo entiende Python. ¿Quieres que dibuje, baile o resuelva sumas? Escríbelo en Python. Se lee casi como el inglés." },
              { title: "¡Dato Curioso!", content: "¡Python no recibió su nombre por la serpiente! Fue nombrado por un divertido programa de comedia británico llamado 'Monty Python's Flying Circus'. El creador, Guido van Rossum, lo estaba viendo mientras programaba Python y pensó que el nombre era divertido." },
              { title: "Tu Primer Comando: print()", content: "print() muestra texto en la pantalla:\n\nprint('Hello World!')\n\nLa computadora escribe: Hello World!\n\nPuedes imprimir lo que quieras. Fíjate en las comillas: le dicen a Python que eso es texto, no un comando." },
              { title: "Consejo Pro: ¡No Olvides las Comillas!", content: "Un error muy común de los principiantes es olvidar las comillas alrededor del texto. Si escribes print(Hello) sin comillas, Python se confundirá y mostrará un error. ¡Envuelve siempre tu texto en comillas simples ('Hello') o dobles (\"Hello\") — ambas funcionan!" },
              { title: "¡Inténtalo Tú Mismo!", content: "Si tienes Python, ábrelo y escribe estas líneas una a una:\n\nprint('Hello World!')\nprint('My name is [TU NOMBRE]!')\nprint('Python is awesome!')\n\nAcabas de hacer hablar a una computadora." },
              { title: "Resumen del Módulo 1", content: "• Python es un lenguaje para dar instrucciones a las computadoras\n• Se llama así por un programa de humor, no por la serpiente\n• print() muestra texto en pantalla\n• El texto va entre comillas\n• Acabas de escribir código real" }
            ],
            exercises: [
              { question: "¿Qué es Python?", options: [ "Una app de dibujo para crear arte de videojuegos", "Un lenguaje de programación para hablar con las computadoras", "Un tipo de computadora que ejecuta juegos", "Una web donde se descargan videojuegos" ] },
              { question: "Python recibió su nombre por la serpiente." },
              { question: "El comando ___ muestra texto en la pantalla en Python." },
              { question: "¿Por qué necesitamos comillas alrededor del texto en print()?", options: ["Para que se vea bonito", "Para que Python sepa que es texto, no un comando", "Las comillas son opcionales", "Para agrandar el texto"] },
              { question: "Relaciona los términos de Python con sus significados:", pairs: [ { term: "Python", definition: "Un lenguaje de programación" }, { term: "print()", definition: "Muestra texto en la pantalla" }, { term: "Comillas", definition: "Envuelven el texto en el código" } ] }
            ]
          },
          {
            title: "Módulo 2: Variables y Tipos de Datos",
            desc: "Almacena números y texto en la memoria como un profesional.",
            contentSections: [
              { title: "Alex Necesita un Marcador", content: "El juego de Alex avanza, pero hay un problema: ¿cómo recuerda la computadora la puntuación del jugador? Cuando un jugador consigue 10 puntos, ¿a dónde va ese número? Alex necesita una forma de GUARDAR información. ¡Eso es exactamente lo que hacen las variables!" },
              { title: "¿Qué es una Variable?", content: "Una variable es una caja con etiqueta. Pon 10 en una caja llamada score y score vale 10.\n\nscore = 10\nplayer_name = 'Alex'\n\nEl = no significa igual. Significa pon este valor en esta caja." },
              { title: "Diferentes Tipos de Datos", content: "La computadora necesita saber QUÉ TIPO de cosa hay en cada caja:\n\nint — números enteros: 5, 42\nstr — texto entre comillas: 'Alex'\nfloat — decimales: 3.14\nbool — True o False\n\nPython deduce el tipo por ti." },
              { title: "Variables en Acción", content: "Así usa Alex las variables:\n\nscore = 0\nscore = score + 10\nprint('Score:', score)\n\nMuestra: Score: 10. Python mira el valor anterior, le suma 10 y guarda el nuevo en la caja." },
              { title: "¡Tu Cerebro Está Lleno de Variables!", content: "Tu cerebro hace lo mismo. Guarda una caja llamada mi_nombre con tu nombre, otra mi_edad y otra con tu color favorito. Simplemente nunca las llamaste variables." },
              { title: "Nombra Estas Cajas", content: "Escribe un buen nombre de variable para cada una: la mejor puntuación, cuántas vidas quedan, si la partida terminó. Luego revísalos: sin espacios, nunca empezando por número, y score no es lo mismo que Score." },
              { title: "Resumen del Módulo 2", content: "• Las variables son cajas con etiqueta que guardan datos\n• El = mete un valor en la caja\n• int, str, float y bool son los tipos principales\n• score = score + 10 actualiza una caja\n• Score y score son cajas distintas" }
            ],
            exercises: [
              { question: "¿Qué es una variable en programación?", options: ["Un tipo de mensaje de error", "Una caja etiquetada para guardar datos", "Una fórmula matemática", "Un comando de Python"] },
              { question: "Relaciona cada tipo de dato con su ejemplo:", pairs: [ { term: "Entero", definition: "El número 42" }, { term: "Cadena", definition: "El texto 'Hello'" }, { term: "Decimal", definition: "El número 3.14" }, { term: "Booleano", definition: "True o False" } ] },
              { question: "Si score = 4 + 6, el valor guardado en score es ___." },
              { question: "En Python, los nombres de variable 'Score' y 'score' son exactamente lo mismo." },
              { question: "¿Cuál de estos es un BUEN nombre de variable?", options: ["1player", "my score", "player_score", "p"] }
            ]
          },
          {
            title: "Módulo 3: Condicionales (if) y Lógica",
            desc: "Haz tu código inteligente con decisiones y condiciones.",
            contentSections: [
              { title: "El Juego de Alex Necesita un Cerebro", content: "El juego de Alex guarda la puntuación pero no reacciona. Aciertas y no pasa nada. El juego tiene que tomar una decisión, y para eso existe el if." },
              { title: "Tomar Decisiones con 'if'", content: "Un if ejecuta código solo cuando algo es verdad:\n\nif score > 100:\n    print('You win!')\n\nLa línea indentada solo se ejecuta si la puntuación pasa de 100. Si no, Python la salta." },
              { title: "Añadir 'else' y 'elif'", content: "else recoge todo lo que el if no cogió. elif comprueba otra condición antes:\n\nif score > 100:\n    print('Amazing!')\nelif score > 50:\n    print('Close!')\nelse:\n    print('Keep going!')" },
              { title: "¡Los Condicionales Están POR TODAS PARTES!", content: "Todas las apps que usas funcionan con esto. ¿Contraseña incorrecta? Un if. ¿Aviso de batería baja? Un if. ¿Pantalla de fin de partida? Un if comprobando si tus vidas llegaron a cero." },
              { title: "Operadores de Comparación", content: "Para escribir condiciones, necesitas operadores de comparación:\n\n>  significa 'mayor que'        (10 > 5 es True)\n<  significa 'menor que'        (3 < 7 es True)\n== significa 'igual a'          (5 == 5 es True)\n!= significa 'distinto de'      (5 != 3 es True)\n>= significa 'mayor o igual'    (10 >= 10 es True)\n<= significa 'menor o igual'    (4 <= 9 es True)\n\nFíjate: comprobar la igualdad usa == (doble igual), NO = (un solo igual). ¡El = simple es para asignar variables!" },
              { title: "Encuentra el Error", content: "Una de estas líneas no funcionará:\n\nif score > 10\n    print('Win')\n\nBusca qué falta al final de la primera línea. Python lo necesita para saber que empieza un bloque." },
              { title: "Resumen del Módulo 3", content: "• if ejecuta código solo cuando algo es verdad\n• else recoge todo lo que el if no cogió\n• elif comprueba otra condición\n• Los dos puntos y la indentación son obligatorios\n• Todas las apps están llenas de esto" }
            ],
            exercises: [
              { question: "¿Qué permiten hacer los condicionales (if) a un programa?", options: ["Colapsar la computadora", "Tomar decisiones según condiciones", "Solo imprimir texto", "Guardar variables"] },
              { question: "Cada línea de condicional (if) en Python debe terminar con dos puntos (:)." },
              { question: "Relaciona cada operador de comparación con su significado:", pairs: [ { term: ">", definition: "Mayor que" }, { term: "==", definition: "Igual a" }, { term: "!=", definition: "Distinto de" }, { term: "<", definition: "Menor que" } ] },
              { question: "La palabra clave ___ es la abreviatura de 'else if' en Python." },
              { question: "Si score es 75, ¿qué imprimirá este código?\nif score > 100:\n    print('Winner!')\nelif score > 50:\n    print('Almost there!')\nelse:\n    print('Keep going!')", options: ["Winner!", "Almost there!", "Keep going!", "Nada"] }
            ]
          },
          {
            title: "Módulo 4: ¡Crea un Juego de Adivinanzas!",
            desc: "¡Combina todo para crear tu primer juego real desde cero!",
            contentSections: [
              { title: "El Gran Momento de Alex", content: "Alex ya tiene variables, condicionales y un plan: un juego de adivinar. La computadora elige un número, tú adivinas y te dice mayor o menor. Todo lo de los tres módulos, en un juego." },
              { title: "¿Qué Son los Bucles?", content: "Un bucle repite código para que no lo escribas veinte veces:\n\nwhile guess != answer:\n    guess = int(input('Guess: '))\n\nSigue preguntando hasta acertar. != significa distinto de." },
              { title: "Obtener la Entrada del Usuario", content: "input() espera a que el jugador escriba y te lo devuelve como texto:\n\nname = input('Your name: ')\n\nSiempre texto. Para hacer cuentas con él, envuélvelo en int(): int(input('Guess: '))" },
              { title: "El Código Completo del Juego", content: "import random\n\nanswer = random.randint(1, 100)\nguess = 0\n\nwhile guess != answer:\n    guess = int(input('Guess: '))\n    if guess < answer:\n        print('Higher!')\n    elif guess > answer:\n        print('Lower!')\n\nprint('You got it!')" },
              { title: "Números Aleatorios en los Juegos", content: "import random te da random.randint(1, 100): un número distinto cada vez. Sin él la respuesta sería la misma en cada partida y nadie jugaría dos veces." },
              { title: "¡Mejora tu Juego!", content: "Añade un contador de intentos. Crea tries = 0, súmale 1 dentro del bucle y muéstralo al final. Luego prueba a limitar al jugador a seis intentos." },
              { title: "¡Resumen Final del Curso!", content: "• Las variables guardan tus datos\n• if, elif y else toman decisiones\n• Los bucles repiten el trabajo por ti\n• input() lee lo que escribe el jugador\n• random elige un número nuevo cada partida\n• Has creado un juego real y jugable" }
            ],
            exercises: [
              { question: "El comando ___ permite al jugador escribir una respuesta durante un juego." },
              { question: "¿Por qué usamos un bucle 'while' en el juego de adivinanzas?", options: [ "Para que la computadora elija un número nuevo cada turno", "Para dejar que el jugador adivine varias veces hasta acertar", "Para mostrarle al jugador todas las respuestas al empezar", "Para terminar el juego en cuanto falle el primer intento" ] },
              { question: "Si el número secreto es 5 y el jugador adivina 8, ¿qué debería decir el juego?", options: ["¡Muy bajo!", "¡Muy alto!", "¡Ganaste!", "¡Error!"] },
              { question: "La función input() siempre devuelve un número, así que nunca necesitas int()." },
              { question: "Relaciona cada concepto de Python con lo que hace en el juego:", pairs: [ { term: "bucle while", definition: "Se repite hasta que el jugador acierta" }, { term: "input()", definition: "Obtiene el intento del jugador" }, { term: "random.randint()", definition: "Elige el número secreto" }, { term: "if/elif/else", definition: "Comprueba si el intento es muy alto o bajo" } ] }
            ]
          }
        ]
      },
      "2": {
        title: "Magia Matemática: Acertijos y Lógica",
        desc: "Desarrolla el pensamiento crítico resolviendo acertijos, identificando patrones y dominando la lógica.",
        category: "Matemáticas",
        difficulty: "Todos los Niveles",
        learningObjectives: [
          "Dominar aritmética rápida y trucos mentales",
          "Resolver problemas de palabras de la vida real",
          "Entender patrones, lógica y secuencias"
        ],
        prerequisites: ["Matemáticas básicas de primaria", "Papel y lápiz para practicar"],
        modules: [
          {
            title: "Módulo 1: Patrones Numéricos",
            desc: "¡Descubre patrones secretos para predecir el futuro!",
            contentSections: [
              { title: "El Secreto del Descifrador", content: "El cofre estaba cerrado con un código: 2, 4, 6, 8, __. Los guardias no sabían qué hacer. Maya sonrió: suma 2 cada vez. Escribió 10 y se abrió. Los patrones son reglas disfrazadas." },
              { title: "La Magia de las Secuencias", content: "Una secuencia sigue una sola regla. Encuentra la regla y podrás predecir el siguiente número:\n\n+5: 5, 10, 15, 20...\n×2: 2, 4, 8, 16...\n-3: 20, 17, 14, 11..." },
              { title: "¡A la Naturaleza le Encanta Fibonacci!", content: "La secuencia de Fibonacci empieza así: 1, 1, 2, 3, 5, 8, 13... ¡donde cada número es la suma de los dos anteriores! ¡Los girasoles, las piñas, las conchas de mar e incluso los remolinos de las tormentas siguen exactamente esta secuencia!" },
              { title: "Encontrar la Regla Secreta", content: "Mira esta secuencia: 3, 6, 12, 24, __\n\n¿Cómo pasamos de 3 a 6? Multiplicamos por 2 (o sumamos 3).\n¿Cómo pasamos de 6 a 12? ¡Multiplicamos por 2! (Sumar 3 daría 9, así que la regla DEBE ser ×2).\nPor lo tanto, ¡24 × 2 = 48! ¡El número secreto es 48!" },
              { title: "Consejo Pro: Fíjate en las Diferencias", content: "Si te atascas con un patrón, resta los números adyacentes (6 - 3 = 3, 12 - 6 = 6). ¡Si las diferencias crecen, comprueba la multiplicación!" },
              { title: "Desafío del Detective de Patrones", content: "¿Puedes resolver estas dos secuencias secretas de cabeza?\n\n1) 1, 4, 9, 16, 25, __ (Pista: 1×1, 2×2, 3×3...)\n2) 100, 90, 80, 70, __ (Pista: Va bajando de...)\n\n¡Respuestas: 36 y 60!" },
              { title: "Resumen del Módulo 1", content: "Ideas clave:\n• Una secuencia sigue una regla fija (+, -, ×, ÷)\n• Comprueba tu regla en TODOS los números para asegurarte de que funciona\n• ¡Fibonacci (1,1,2,3,5,8...) está por todas partes en la naturaleza!\n• ¡Los patrones nos permiten predecir números futuros con un 100% de precisión!" }
            ],
            exercises: [
              { question: "¿Cuál es el siguiente número en: 5, 10, 15, 20...?", options: ["22", "25", "30", "100"] },
              { question: "En la secuencia 2, 4, 8, 16, el siguiente número es ___.", answer: "32" },
              { question: "La secuencia de Fibonacci (1, 1, 2, 3, 5, 8...) aparece en las semillas de girasol y las piñas." },
              { question: "Relaciona cada secuencia con su regla:", pairs: [ { term: "3, 6, 9, 12", definition: "Sumar 3" }, { term: "2, 4, 8, 16", definition: "Multiplicar por 2" }, { term: "50, 40, 30", definition: "Restar 10" } ] },
              { question: "¿Cómo llamamos a una lista de números que sigue una regla matemática?", options: ["Un desorden", "Una secuencia", "Una variable", "Un bucle"] }
            ]
          },
          {
            title: "Módulo 2: Geometría 2D y 3D",
            desc: "Explora formas en el espacio plano y en mundos 3D.",
            contentSections: [
              { title: "Diseñar Mundos de Minecraft", content: "¿Alguna vez te has preguntado cómo se construyen los juegos 3D como Minecraft o Roblox? Los desarrolladores empiezan con formas planas 2D — cuadrados y triángulos — y las extruyen en bloques 3D (cubos y pirámides). ¡La geometría es el motor secreto detrás de cada gráfico 3D que ves!" },
              { title: "Plano (2D) vs Sólido (3D)", content: "• Las formas 2D tienen Altura y Anchura (planas en el papel): Cuadrado, Círculo, Triángulo, Hexágono (6 lados).\n• Las formas 3D añaden Profundidad (sólidas en la mano): Cubo, Esfera, Pirámide, Cilindro." },
              { title: "Ángulos y Ángulos Rectos", content: "Un ángulo se forma donde se encuentran dos líneas. La esquina de un cuadrado es un ángulo de 90°, llamado Ángulo Recto. Mira a tu alrededor: ¡las puertas, los libros y las pantallas están llenos de ángulos rectos!" },
              { title: "Contar Lados y Vértices", content: "• Triángulo: 3 lados, 3 esquinas (vértices)\n• Cuadrado / Rectángulo: 4 lados, 4 vértices\n• Hexágono: 6 lados, 6 vértices\n• Octágono (señal de Stop): 8 lados, 8 vértices" },
              { title: "Secreto del Cubo", content: "¡Un cubo 3D tiene 6 caras cuadradas planas, 8 esquinas (vértices) y 12 aristas rectas!" },
              { title: "Caza de Formas", content: "Encuentra cinco cuerpos 3D en tu casa: una lata, una caja, una pelota, un cono, una pirámide. Para cada uno, di qué forma 2D verías si lo cortaras por la mitad." },
              { title: "Resumen del Módulo 2", content: "• 2D = plano (largo y ancho), 3D = sólido (largo, ancho y profundidad)\n• Los hexágonos tienen 6 lados, los octágonos tienen 8\n• Los ángulos de 90° son Ángulos Rectos\n• ¡Los cubos tienen 6 caras, 8 vértices y 12 aristas!" }
            ],
            exercises: [
              { question: "¿Cuántos lados tiene un hexágono?", options: ["4", "5", "6", "8"] },
              { question: "Un cuadrado en 3D se llama ___.", answer: "cubo" },
              { question: "Un ángulo recto mide exactamente 90 grados." },
              { question: "Relaciona la forma con su número de lados:", pairs: [ { term: "Triángulo", definition: "3 lados" }, { term: "Pentágono", definition: "5 lados" }, { term: "Hexágono", definition: "6 lados" }, { term: "Octágono", definition: "8 lados" } ] },
              { question: "¿Cuántas caras tiene un cubo estándar?", options: ["4", "6", "8", "12"] }
            ]
          },
          {
            title: "Módulo 3: Acertijos de Lógica",
            desc: "Resuelve misterios usando la deducción.",
            contentSections: [
              { title: "La Detective Maya y la Llave Perdida", content: "La llave dorada había desaparecido. Maya conocía tres hechos: 1) No está en el cofre rojo. 2) No está en una caja de madera. 3) El cofre azul es de metal. ¡Combinando las pistas, demostró que la llave DEBE estar en el cofre azul de metal! ¡Eso es la deducción!" },
              { title: "¿Qué es la Lógica Deductiva?", content: "La deducción significa eliminar las posibilidades incorrectas hasta que solo queda la verdad. ¡Si la afirmación A es Verdadera, entonces la afirmación B DEBE ser Verdadera!" },
              { title: "Resolver Acertijos de Orden", content: "Pista 1: Liam es más alto que Sam.\nPista 2: Sam es más alto que Zoe.\nConclusión: Liam > Sam > Zoe. ¡Por lo tanto, Liam es el más alto y Zoe la más baja!" },
              { title: "¡Dibuja una Cuadrícula!", content: "Cuando resuelvas acertijos de lógica con personas y objetos, haz una cuadrícula con marcas de verificación y X para descartar las opciones imposibles." },
              { title: "Engaña a un Amigo", content: "Inventa un acertijo donde la respuesta obvia sea la equivocada. Pruébalo con alguien. Si responde rápido y falla, tu despiste funcionó." },
              { title: "Resumen del Módulo 3", content: "• La lógica usa hechos para llegar a conclusiones 100% seguras\n• La deducción elimina las opciones incorrectas paso a paso\n• ¡Las pistas de orden ayudan a ordenar los objetos de mayor a menor!" }
            ],
            exercises: [
              { question: "Si A es más alto que B, y B es más alto que C, ¿quién es el más alto?", options: ["A", "B", "C", "Son iguales"] },
              { question: "La lógica deductiva significa adivinar al azar sin pruebas." },
              { question: "Usar pistas para eliminar respuestas incorrectas se llama razonamiento ___.", answer: "deductivo" },
              { question: "Tengo 4 patas pero no puedo caminar. ¿Qué soy?", options: ["Un perro", "Una silla", "Un pájaro", "Una serpiente"] },
              { question: "Relaciona la pista lógica con su resultado:", pairs: [ { term: "El gato no está en la Caja A ni B", definition: "Debe estar en la Caja C" }, { term: "Tom > Mark > Leo", definition: "Tom es el más alto" }, { term: "Todos los cuadrados son formas", definition: "Un cuadrado es una forma" } ] }
            ]
          },
          {
            title: "Módulo 4: Algoritmos y Resolución de Problemas",
            desc: "Aprende a resolver problemas enormes paso a paso.",
            contentSections: [
              { title: "El Sándwich de Mantequilla de Maní del Robot", content: "Dile a un robot que ponga mantequilla en el pan y puede aplastar el bote cerrado contra la barra. Tienes que decir: abre el bote, coge el cuchillo, saca, unta. Ese orden exacto es un algoritmo." },
              { title: "¿Qué es un Algoritmo?", content: "Un algoritmo es una lista de instrucciones precisa y ordenada para resolver un problema o completar una tarea." },
              { title: "Descomposición: Dividir Tareas Grandes", content: "Cuando se enfrentan a un problema enorme (como construir un cohete o crear un juego), los expertos usan la Descomposición: ¡dividir 1 problema enorme en 10 pasos pequeños y fáciles!" },
              { title: "Programa a un Humano", content: "Escribe los pasos para que alguien dibuje un cuadrado sin decir la palabra cuadrado. Léelos tal cual. Cada punto donde se equivoque es un paso que te dejaste." },
              { title: "Resumen del Módulo 4", content: "• Los algoritmos son recetas paso a paso\n• El orden importa: fuera de orden = fallo\n• ¡La descomposición divide las tareas grandes en pasos simples!" }
            ],
            exercises: [
              { question: "¿Qué es un algoritmo?", options: ["Un error matemático", "Un tipo de dinosaurio", "Una lista de instrucciones paso a paso", "Una figura 3D"] },
              { question: "En un algoritmo, cambiar el orden de los pasos no importa." },
              { question: "Dividir un problema grande en pasos pequeños se llama ___.", answer: "descomposición" },
              { question: "Relaciona los términos de algoritmos con su significado:", pairs: [ { term: "Algoritmo", definition: "Instrucciones paso a paso" }, { term: "Descomposición", definition: "Dividir tareas en partes pequeñas" }, { term: "Depuración", definition: "Corregir un error en los pasos" } ] },
              { question: "¿Cuál es la mejor forma de resolver un acertijo matemático enorme y difícil?", options: ["Dividirlo en pasos pequeños y sencillos", "Empezar por la parte más difícil e ir hacia atrás", "Hacerlo entero de cabeza y de una vez", "Saltar al resultado y comprobarlo después"] }
            ]
          }
        ]
      },
      "3": {
        title: "Dinero Inteligente: Niños y Efectivo",
        desc: "Desarrolla la educación financiera desde pequeño. Aprende sobre presupuestos, interés compuesto, banca e inversión inteligente.",
        category: "Finanzas",
        difficulty: "Principiante",
        learningObjectives: [
          "Comprender la historia del dinero",
          "Crear un presupuesto personal",
          "Entender el interés compuesto",
          "Aprender los conceptos básicos de inversión"
        ],
        prerequisites: ["Habilidades matemáticas básicas (porcentajes, suma)"],
        modules: [
          {
            title: "Módulo 1: ¿Qué es el Dinero?",
            desc: "Aprende por qué se inventó el dinero y cómo funcionaba el trueque.",
            contentSections: [
              { title: "Cambiar Gallinas por Espadas", content: "Sam tenía una gallina y quería una espada, así que tenía que encontrar un herrero que quisiera una gallina. Si el herrero quería manzanas, no había trato. El dinero existe porque eso casi nunca coincidía." },
              { title: "Antes del Dinero: El Trueque", content: "El trueque es intercambiar bienes o servicios directamente sin dinero. El dinero resolvió el trueque porque sirve como medio de intercambio universal." },
              { title: "Dato Curioso: ¡Conchas y Sal como Dinero!", content: "¡Antes del papel moneda, la gente usaba conchas de cauri, piedras gigantes e incluso sal como dinero! ¡De hecho, la palabra 'salario' viene de la palabra latina para sal ('sal')!" },
              { title: "Pon Precio a Tres Cosas", content: "Elige tres cosas de tu cuarto. Escribe por qué cambiarías cada una si no existiera el dinero. Fíjate en lo difícil que es encontrar un trato justo: ese es el problema que resolvió el dinero." },
              { title: "Resumen del Módulo 1", content: "• Trueque = intercambiar objetos directamente\n• Dinero = medio de intercambio universal\n• ¡El dinero solo funciona porque todos aceptan que tiene valor!" }
            ],
            exercises: [
              { question: "¿Qué es el trueque?", options: ["Usar tarjetas de crédito", "Intercambiar bienes directamente sin dinero", "Invertir en acciones", "Ahorrar en un banco"] },
              { question: "El dinero solo funciona si todos aceptan que tiene valor." },
              { question: "La palabra salario viene de la palabra latina para ___.", answer: "sal" },
              { question: "Relaciona los términos de dinero con sus definiciones:", pairs: [ { term: "Trueque", definition: "Intercambiar bienes directamente" }, { term: "Moneda", definition: "Dinero usado en un país" }, { term: "Medio de Intercambio", definition: "Algo usado para comprar bienes" } ] },
              { question: "¿Por qué se inventó el dinero?", options: ["Porque las monedas brillan", "Para hacer el comercio más fácil que el trueque", "Para hacer las carteras pesadas", "Porque las gallinas se escaparon"] }
            ]
          },
          {
            title: "Módulo 2: Presupuestos y Ahorro",
            desc: "Dile a tu dinero a dónde ir en lugar de preguntarte a dónde se fue.",
            contentSections: [
              { title: "Ingresos vs Gastos", content: "• Ingresos = Dinero que ENTRA (paga semanal, regalos de cumpleaños, tareas).\n• Gastos = Dinero que SALE (comprar juguetes, snacks, juegos).\n• Presupuesto = ¡Un plan para asegurar que los Gastos sean MENORES que los Ingresos!" },
              { title: "La Regla 50/30/20", content: "Una forma famosa de hacer un presupuesto:\n• 50% para Necesidades (comida, material escolar)\n• 30% para Deseos (juegos, juguetes)\n• 20% para Ahorros (¡metas futuras!)" },
              { title: "Haz un Presupuesto Pequeño", content: "Imagina que recibes 10 a la semana. Anota cuánto va a gastar, cuánto a ahorrar y cuánto a dar. Los tres tienen que sumar 10 exactos. Eso es un presupuesto." },
              { title: "Resumen del Módulo 2", content: "• Los ingresos son dinero que entra; los gastos son dinero que sale\n• ¡Gasta siempre menos de lo que ganas para acumular riqueza!" }
            ],
            exercises: [
              { question: "El dinero que ENTRA a tu bolsillo se llama:", options: ["Gasto", "Ingreso", "Impuesto", "Deuda"] },
              { question: "Un buen presupuesto significa que tus gastos son mayores que tus ingresos." },
              { question: "El dinero que SALE cuando compras algo se llama un ___.", answer: "gasto" },
              { question: "Relaciona las categorías del presupuesto:", pairs: [ { term: "Ingreso", definition: "Paga ganada" }, { term: "Necesidad", definition: "Material escolar" }, { term: "Deseo", definition: "Aspecto para un videojuego" }, { term: "Ahorro", definition: "Dinero en el banco para el futuro" } ] },
              { question: "¿Cuál es la Regla de Oro del dinero?", options: ["Gasta todo tu dinero", "Gasta menos de lo que ganas", "Nunca ahorres", "Compra todo en oferta"] }
            ]
          },
          {
            title: "Módulo 3: La Magia del Interés Compuesto",
            desc: "El multiplicador mágico que convierte pequeños ahorros en fortunas.",
            contentSections: [
              { title: "Interés sobre Interés", content: "Cuando depositas dinero en un banco, el banco te paga 'Interés'. ¡El interés compuesto significa que ganas interés sobre tu dinero Y sobre el interés que ya has ganado! ¡Se multiplica con el tiempo como una bola de nieve rodando montaña abajo!" },
              { title: "La Cita de Albert Einstein", content: "Albert Einstein llamó célebremente al interés compuesto 'la 8ª maravilla del mundo. ¡Quien lo entiende, lo gana... quien no, lo paga!'" },
              { title: "Duplícalo Tú Mismo", content: "Empieza con 100. Súmale un 10% y anota el total. Súmale otro 10% al nuevo total, y otra vez, cinco veces. Compara tu resultado con 150 y mira cuánto lo pasaste." },
              { title: "Resumen del Módulo 3", content: "• Interés = bonificación pagada por el banco por ahorrar\n• Interés compuesto = interés sobre el interés\n• ¡El tiempo es el multiplicador secreto!" }
            ],
            exercises: [
              { question: "Cuando un banco te paga dinero extra por mantener tus ahorros con ellos, se llama:", options: ["Impuestos", "Interés", "Multas", "Préstamos"] },
              { question: "El interés compuesto significa que ganas interés además del interés anterior." },
              { question: "El interés compuesto funciona mejor cuando dejas tu dinero ahorrado durante ___ tiempo.", answer: "mucho" },
              { question: "Relaciona los conceptos de interés:", pairs: [ { term: "Interés Simple", definition: "Interés solo sobre el dinero inicial" }, { term: "Interés Compuesto", definition: "Interés sobre el interés con el tiempo" }, { term: "Depósito Bancario", definition: "Poner dinero en una cuenta" } ] },
              { question: "¿Quién llamó al interés compuesto la 8ª maravilla del mundo?", options: ["Isaac Newton", "Albert Einstein", "Steve Jobs", "Elon Musk"] }
            ]
          },
          {
            title: "Módulo 4: Inversión y Acciones",
            desc: "Haz que tu dinero trabaje para que tú no tengas que hacerlo.",
            contentSections: [
              { title: "¿Qué es una Acción?", content: "Cuando una empresa (como Apple o Disney) quiere expandirse, divide la propiedad en millones de pequeñas partes llamadas 'Acciones'. ¡Cuando compras una acción, te conviertes en un micro-propietario de esa empresa!" },
              { title: "Diversificación: ¡No pongas todos los huevos en 1 cesta!", content: "Si compras acciones de solo 1 empresa y quiebra, pierdes dinero. ¡Si inviertes en 10 empresas diferentes, estás a salvo si una tiene un mal día!" },
              { title: "Elige una Acción de Mentira", content: "Escoge una empresa que uses de verdad. Escribe una razón por la que podría valer más dentro de cinco años y otra por la que podría valer menos. Eso es lo que hacen los inversores." },
              { title: "Resumen del Módulo 4", content: "• Acción = pequeña parte de propiedad de una empresa\n• La inversión hace crecer el dinero con el tiempo\n• ¡Diversifica para reducir el riesgo!" }
            ],
            exercises: [
              { question: "Cuando compras una acción, ¿qué estás comprando en realidad?", options: [ "Una promesa de que la empresa te devolverá el dinero", "Una pequeña parte de la propiedad de una empresa real", "Un descuento en todo lo que vende esa empresa", "Un boleto que te deja votar por el director" ] },
              { question: "Invertir no tiene ningún riesgo y siempre garantiza ganancias." },
              { question: "Repartir tus inversiones entre varias empresas se llama ___.", answer: "diversificación" },
              { question: "Relaciona los términos de inversión:", pairs: [ { term: "Acción", definition: "Parte de la propiedad de una empresa" }, { term: "Dividendo", definition: "Ganancia de la empresa repartida a los inversores" }, { term: "Cartera", definition: "Conjunto de todas tus inversiones" } ] },
              { question: "¿Cuál es el objetivo principal de invertir?", options: ["Perder dinero", "Hacer crecer tu dinero con el tiempo", "Guardar el dinero bajo el colchón", "Pagar comisiones"] }
            ]
          }
        ]
      },
      "4": {
        title: "Creadores del Futuro: Marketing Digital",
        desc: "Domina la marca, la narración, la creación de contenido y la seguridad en línea.",
        category: "Marketing",
        difficulty: "Intermedio",
        learningObjectives: [
          "Construir una identidad de marca sólida",
          "Estructurar narrativas atractivas",
          "Entender la ciudadanía digital",
          "Diseñar una campaña simulada"
        ],
        prerequisites: ["Familiaridad con redes sociales"],
        modules: [
          {
            title: "Módulo 1: Marca e Identidad",
            desc: "Aprende cómo las empresas construyen personalidades reconocibles.",
            contentSections: [
              { title: "Los Dos Carteles de Sam", content: "Sam hizo dos carteles para la misma venta de pasteles del colegio. Uno en rosa redondeado, otro en negro afilado. Mismas palabras, mismos pasteles. Todos dijeron que el rosa parecía más simpático. Los pasteles no habían cambiado." },
              { title: "Una Marca Es un Sentimiento", content: "Una marca no es el logo. Es lo que la gente espera antes de haber probado nada. Los colores, las tipografías y el tono fijan esa expectativa, y la fijan en un segundo." },
              { title: "Por Qué los Bancos Son Azules", content: "Mira logos que conoces:\n\nRojo — apetito y urgencia (McDonald's, Netflix)\nAzul — confianza y calma (Samsung, PayPal)\nVerde — naturaleza y crecimiento (Spotify, Starbucks)\n\nCasi ningún banco usa rojo intenso. Casi ninguna bebida energética usa azul suave. No lo adivinan: eligen primero el sentimiento." },
              { title: "Elige Primero el Sentimiento", content: "Antes de elegir un color, escribe una palabra sobre cómo quieres que se sienta la gente: segura, emocionada, deportiva, elegante. Elige el color para esa palabra. Hacerlo al revés es por lo que los diseños salen aleatorios." },
              { title: "Ponle Nombre al Sentimiento", content: "Busca tres logos en cosas que tengas cerca. Para cada uno escribe la primera palabra que se te ocurra y luego su color principal. Busca el patrón entre ambos. Verás las mismas parejas una y otra vez." },
              { title: "Resumen del Módulo 1", content: "• Una marca es un sentimiento, no un logo\n• El color y la tipografía lo fijan en un segundo\n• El rojo urge, el azul tranquiliza, el verde crece\n• Elige el sentimiento antes que el color" }
            ],
            exercises: [
              { question: "¿Qué es una marca?", options: [ "La lista de productos que vende hoy una empresa", "El sentimiento, la personalidad y la reputación de una empresa", "El nombre legal con el que se registra la empresa", "La combinación de colores impresa en sus envases" ] },
              { question: "Las empresas eligen los colores al azar sin pensar en las emociones." },
              { question: "El color azul se usa a menudo en los logos para generar ___.", answer: "confianza" },
              { question: "Relaciona los elementos de marca:", pairs: [ { term: "Logo", definition: "Símbolo visual de la marca" }, { term: "Eslogan", definition: "Frase pegadiza (p. ej. Just Do It)" }, { term: "Paleta", definition: "Conjunto específico de colores de la marca" } ] },
              { question: "¿Cuál de estos forma parte de una identidad de marca?", options: ["Logos, colores y tipografía", "Muebles de oficina", "La talla de zapato de los empleados", "Formularios de impuestos"] }
            ]
          },
          {
            title: "Módulo 2: La Narración en el Marketing",
            desc: "Engancha a tu audiencia con grandes historias.",
            contentSections: [
              { title: "Nadie Leyó la Publicación de Sam", content: "Sam escribió sobre la venta de pasteles: cuánto costó organizarla, quién estaba en el comité, cuántas reuniones hubo. La leyeron tres personas. Ninguna fue." },
              { title: "El Cliente Es el Héroe", content: "Quien lee es el héroe de la historia. Lo tuyo es el guía que le ayuda a ganar. La medalla se la lleva Luke, no Yoda. Escribe sobre lo que consigue, no sobre ti." },
              { title: "La Misma Venta, Reescrita", content: "Antes: «Nuestro comité pasó seis semanas organizando esto.»\n\nDespués: «Llévate un brownie calentito por 50 céntimos en el recreo, y tu dinero compra libros para la biblioteca.»\n\nLa segunda no habla de Sam. Dice qué consigues y para qué sirve. Esa versión llenó la mesa." },
              { title: "Cuenta tus Nosotros", content: "Lee lo que escribiste y cuenta cuántas veces dices nosotros, nuestro o yo, y cuántas dices tú. Si gana el primer número, reescríbelo. Esta comprobación arregla casi cualquier publicación floja." },
              { title: "Dale la Vuelta a una Frase", content: "Busca un anuncio o un cartel cerca de ti. Copia una frase. Ahora reescríbela para que empiece por Tú y diga qué consigue quien lee. Léelas las dos en voz alta." },
              { title: "Resumen del Módulo 2", content: "• Quien lee es el héroe, lo tuyo es el guía\n• Di qué consigue, no qué hiciste tú\n• Cuenta tus nosotros frente a tus tú\n• La primera línea decide si leen el resto" }
            ],
            exercises: [
              { question: "En la narración de marca, ¿quién es el Héroe?", options: ["El director", "El producto", "El cliente", "El competidor"] },
              { question: "Los vídeos en línea necesitan un buen gancho en los primeros 3 segundos." },
              { question: "En la narración de marketing, tu producto actúa como el ___ para ayudar al héroe a ganar.", answer: "guía" },
              { question: "Relaciona los componentes de la historia:", pairs: [ { term: "Héroe", definition: "El Cliente" }, { term: "Guía", definition: "Tu Producto/Servicio" }, { term: "Gancho", definition: "Los primeros 3 segundos que captan la atención" } ] },
              { question: "¿Por qué los especialistas en marketing usan la narración?", options: ["Para aburrir a la gente", "Para crear una conexión emocional", "Para rellenar espacio en blanco", "Para confundir a los lectores"] }
            ]
          },
          {
            title: "Módulo 3: Ciudadanía Digital y Seguridad",
            desc: "Protege tu huella digital.",
            contentSections: [
              { title: "La Foto Que Sam Borró", content: "Sam publicó una foto del cartel pegado en la verja del colegio. El nombre del centro se leía. Sam la borró una hora después. Dos amigos ya le habían hecho captura." },
              { title: "Borrar No Es Deshacer", content: "Tu huella digital es todo lo que dejas en línea. Borrar quita tu copia, no la de los demás. Las capturas, los reenvíos y las copias de seguridad sobreviven. Da por hecho que lo que publicas es permanente." },
              { title: "Qué No Enseñar", content: "Cosas que te identifican en la vida real:\n\nTu dirección o carteles de calles\nEl nombre, el escudo o el uniforme del colegio\nTu teléfono, aunque salga en una foto\nTu horario o tu ruta diaria\n\nCasi todo esto se comparte sin querer, en el fondo de una foto, no escrito a propósito." },
              { title: "Mira el Fondo", content: "Antes de publicar una foto, mira más allá de ti: números de portal, paradas de autobús, el logo del colegio en una sudadera. El sujeto suele ser seguro. El fondo es lo que te delata." },
              { title: "Revisa una Foto", content: "Abre una foto del móvil que podrías haber publicado. Anota todo lo que podría decirle a un desconocido dónde vives o dónde estudias. Decide si aun así la publicarías." },
              { title: "Resumen del Módulo 3", content: "• Tu huella es todo lo que dejas en línea\n• Borrar tu copia no borra la suya\n• Dirección, colegio y horario te identifican\n• Casi todas las filtraciones vienen del fondo" }
            ],
            exercises: [
              { question: "¿Qué es tu Huella Digital?", options: [ "El espacio que ocupan tus fotos en el móvil", "El rastro permanente de datos que dejas en línea", "La velocidad a la que va tu conexión a internet", "La cantidad de apps instaladas en tu teléfono" ] },
              { question: "Cualquier cosa que publiques en línea se puede borrar fácilmente para siempre." },
              { question: "PII significa Información Personal ___.", answer: "identificable" },
              { question: "Relaciona los términos de seguridad:", pairs: [ { term: "PII (Info personal)", definition: "Dirección, teléfono, nombre completo" }, { term: "Seguro de Compartir", definition: "Dibujos, reseñas, aficiones" }, { term: "Huella Digital", definition: "Rastro del historial en línea" } ] },
              { question: "¿Cuál de los siguientes NUNCA debe publicarse públicamente en línea?", options: ["Película favorita", "Dirección de casa", "Dibujo de un gato", "Reseña de un libro"] }
            ]
          },
          {
            title: "Módulo 4: Campañas de Marketing y CTA",
            desc: "Lanza tu gran idea con una llamada a la acción clara.",
            contentSections: [
              { title: "Gustó a Todos y No Vino Nadie", content: "El cartel nuevo de Sam quedó genial y se lo dijeron. La mesa siguió vacía. El cartel nunca decía dónde era la venta, a qué hora empezaba ni qué había que hacer. Que guste no es aparecer." },
              { title: "Diles el Siguiente Paso", content: "Una llamada a la acción es una instrucción clara: qué hacer, dónde y cuándo. Sin ella la gente te da la razón y sigue andando. Que esté bien no es lo mismo que esté claro." },
              { title: "Vago Frente a Concreto", content: "Vago: «¡Apoya la venta de pasteles!»\n\nConcreto: «Ven al salón de actos el viernes a las 12:45. Trae 50 céntimos.»\n\nLa segunda da un lugar, una hora y una cantidad. Cada una de esas cosas quita una excusa para no ir. La mejor llamada a la acción es la más fácil de obedecer." },
              { title: "Una Acción, No Cuatro", content: "Síguenos, suscríbete, díselo a un amigo y ven son cuatro tareas, así que casi nadie hace ninguna. Elige la única que de verdad importa y pide solo esa." },
              { title: "Arregla una Floja", content: "Busca un anuncio que acabe con algo vago como Más información. Reescríbelo con un lugar, una hora y una acción. Léeselo a alguien y pregúntale qué se supone que tiene que hacer." },
              { title: "Resumen del Módulo 4", content: "• Una llamada a la acción es una instrucción clara\n• Da un lugar, una hora y una cantidad\n• Lo concreto gana a lo entusiasta\n• Pide una cosa, no cuatro" }
            ],
            exercises: [
              { question: "¿Qué significa CTA?", options: ["Llamada a la Acción (Call To Action)", "Alineación central del texto", "Costo de publicidad", "Clic para añadir"] },
              { question: "'¡Suscríbete para más vídeos!' es un ejemplo de una CTA." },
              { question: "El grupo específico de personas para el que diseñas una campaña se llama el ___ objetivo.", answer: "público" },
              { question: "Relaciona los términos de campaña:", pairs: [ { term: "CTA", definition: "Llamada a la Acción" }, { term: "Público Objetivo", definition: "Espectadores/compradores previstos" }, { term: "Campaña", definition: "Estrategia de marketing organizada" } ] },
              { question: "¿Cuál es una Llamada a la Acción eficaz?", options: ["'Existimos.'", "'¡Suscríbete hoy para recibir consejos gratis!'", "'Los colores son bonitos.'", "'Adiós.'"] }
            ]
          }
        ]
      },
      "5": {
        title: "Maravillas Web: HTML y CSS",
        desc: "Domina los lenguajes de marcado y estilo que dan vida a internet.",
        category: "Ciencia",
        difficulty: "Principiante",
        learningObjectives: [
          "Escribir marcado semántico en HTML5",
          "Estilizar páginas con CSS moderno",
          "Entender el modelo de caja en CSS",
          "Publicar tu sitio web"
        ],
        prerequisites: ["Una computadora con navegador web"],
        modules: [
          {
            title: "Módulo 1: Estructura HTML",
            desc: "El esqueleto de cada sitio web.",
            contentSections: [
              { title: "El Borrón Gris de Maya", content: "Maya escribió sus trucos de skate en un archivo y lo abrió en el navegador. Salió un borrón gris. Sin títulos, sin enlaces: el navegador no tenía ni idea de qué era cada cosa." },
              { title: "Las Etiquetas le Dicen al Navegador Qué Es Cada Cosa", content: "Una etiqueta HTML es un rótulo. Envuelves tu texto en ella y el navegador por fin sabe: esto es un título, eso es un párrafo. Van en pareja: <p> abre, </p> cierra." },
              { title: "La Página de Maya, Arreglada", content: "Maya envuelve sus palabras en etiquetas:\n\n<h1>Los Trucos de Maya</h1>\n<p>Mi mejor truco es un kickflip.</p>\n<a href=\"tricks.html\">Verlos todos</a>\n\nAhora el navegador sabe qué hacer: un título grande en negrita, un párrafo normal y un enlace azul que puedes pulsar. Las mismas palabras, una página completamente distinta." },
              { title: "La Primera Web Todavía Funciona", content: "El primer sitio web del mundo se publicó en 1991. Solo texto y enlaces, sin colores ni imágenes. Sigue en línea hoy y carga perfectamente en cualquier navegador moderno." },
              { title: "Constrúyelo: Te Toca", content: "Crea un archivo llamado me.html. Pon tu nombre en un <h1>, algo que te encante en un <p> y un enlace a cualquier sitio en un <a>. Ábrelo en tu navegador y míralo funcionar." },
              { title: "Resumen del Módulo 1", content: "• Una etiqueta dice QUÉ es tu contenido\n• Van en pareja: <p> abre, </p> cierra\n• <h1> es el título principal, <p> un párrafo, <a> un enlace\n• El navegador solo sabe lo que tus etiquetas le dicen" }
            ],
            exercises: [
              { question: "¿Qué proporciona HTML a una página web?", options: ["Colores y estilos", "La estructura básica (esqueleto)", "Almacenamiento en base de datos", "El backend del servidor"] },
              { question: "Los nombres de las etiquetas HTML van entre corchetes angulares como <p>." },
              { question: "La etiqueta usada para el texto de párrafo en HTML es ___.", answer: "<p>" },
              { question: "Relaciona las etiquetas HTML con su propósito:", pairs: [ { term: "<h1>", definition: "Encabezado principal" }, { term: "<p>", definition: "Texto de párrafo" }, { term: "<a>", definition: "Hipervínculo" }, { term: "<img>", definition: "Etiqueta de imagen" } ] },
              { question: "¿Qué etiqueta produce el encabezado más grande?", options: ["<p>", "<h1>", "<h6>", "<div>"] }
            ]
          },
          {
            title: "Módulo 2: Estilo con CSS",
            desc: "Añade colores, fuentes y belleza.",
            contentSections: [
              { title: "La Página de Maya Se Ve Aburrida", content: "La página de Maya ya funciona, pero es texto negro sobre blanco con una fuente antigua. Su amiga le pregunta si es una ficha del colegio. Maya quiere que se vea SUYA." },
              { title: "CSS Viste al Esqueleto", content: "HTML dice qué son las cosas. CSS dice cómo se ven. Eliges un elemento y le pones propiedades: un color, un tamaño, un fondo. Cada una es propiedad: valor;" },
              { title: "Tres Líneas Que Lo Cambian Todo", content: "Maya añade un bloque de estilo:\n\nh1 {\n  color: hotpink;\n  font-size: 40px;\n}\n\nTodos los <h1> de la página se vuelven rosa fuerte y crecen. Escribió tres líneas y cambió todos los títulos a la vez: de eso trata CSS." },
              { title: "El Punto y Coma Pilla a Todo el Mundo", content: "Cada línea de CSS termina en punto y coma. Si olvidas uno, el navegador ignora esa línea y la siguiente sin avisar. Nada se rompe, nada te avisa: tu estilo simplemente no aparece." },
              { title: "Hazla Tuya", content: "Abre tu me.html y añade un bloque de estilo. Dale a tu <h1> un color que te guste y a tu <p> un font-size de 18px. Recarga la página. Cambia el color tres veces y míralo actualizarse." },
              { title: "Resumen del Módulo 2", content: "• HTML es QUÉ son las cosas, CSS es cómo SE VEN\n• Las reglas son propiedad: valor;\n• Una regla da estilo a todos los elementos que coinciden\n• Un punto y coma que falta mata la línea en silencio" }
            ],
            exercises: [
              { question: "¿Qué hace CSS?", options: ["Construye las etiquetas HTML básicas", "Da estilo a las páginas con colores y fuentes", "Guarda las cuentas de usuario", "Alimenta las bases de datos"] },
              { question: "Los nombres de las propiedades CSS terminan con dos puntos (:)." },
              { question: "En CSS, para poner el texto en rojo escribes color: ___;", answer: "red" },
              { question: "Relaciona las propiedades CSS:", pairs: [ { term: "color", definition: "Color del texto" }, { term: "font-size", definition: "Tamaño del texto" }, { term: "background-color", definition: "Color de fondo" } ] },
              { question: "¿Cómo cambias el color del texto en CSS?", options: ["text: red;", "color: red;", "font-color: red;", "paint: red;"] }
            ]
          },
          {
            title: "Módulo 3: El Modelo de Caja de CSS",
            desc: "Domina el espaciado: Contenido, Relleno, Borde, Margen.",
            contentSections: [
              { title: "Todo Está Apretujado", content: "El texto de Maya toca el borde de su caja y sus párrafos están pegados entre sí. Se ve apretado. Necesita espacio, pero el espacio por dentro y el de por fuera son dos cosas distintas." },
              { title: "Cada Elemento Es una Caja", content: "En CSS todo es un rectángulo con cuatro capas: el contenido, el relleno a su alrededor dentro del borde, el borde en sí, y el margen por fuera empujando a los demás." },
              { title: "Relleno Frente a Margen", content: "Piensa en una foto enmarcada:\n\n.card {\n  padding: 20px;\n  border: 2px solid black;\n  margin: 30px;\n}\n\nEl relleno es el paspartú entre la foto y el marco. El margen es la pared entre este marco y el siguiente. El relleno agranda la caja; el margen separa las cajas." },
              { title: "Usa el Inspector", content: "Haz clic derecho en cualquier página y elige Inspeccionar. El navegador dibuja el modelo de caja en colores: verde para el relleno, naranja para el margen. Cada sitio que te gusta usa esas mismas cuatro capas." },
              { title: "Encuentra las Capas", content: "Abre cualquier web, haz clic derecho en un botón y elige Inspeccionar. Busca su padding y su margin en el panel. Cambia el número del padding y mira crecer el botón real de la página." },
              { title: "Resumen del Módulo 3", content: "• Cada elemento es una caja de cuatro capas\n• El relleno es espacio DENTRO del borde\n• El margen es espacio FUERA, que empuja a los demás\n• Inspeccionar te muestra las capas en cualquier sitio" }
            ],
            exercises: [
              { question: "En el Modelo de Caja de CSS, ¿qué es el espacio DENTRO del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] },
              { question: "El margen (margin) crea espacio FUERA del borde del elemento." },
              { question: "El espacio dentro de un elemento, entre el contenido y el borde, se llama ___ (en inglés).", answer: "padding" },
              { question: "Relaciona las capas del Modelo de Caja:", pairs: [ { term: "Contenido", definition: "Texto o imagen dentro" }, { term: "Relleno (Padding)", definition: "Espacio dentro del borde" }, { term: "Borde", definition: "Línea que rodea el relleno" }, { term: "Margen (Margin)", definition: "Espacio fuera del borde" } ] },
              { question: "¿Cómo se llama el espacio FUERA del borde?", options: ["Margen (Margin)", "Relleno (Padding)", "Contenido (Content)", "Contorno (Outline)"] }
            ]
          },
          {
            title: "Módulo 4: Despliegue y Alojamiento Web",
            desc: "Comparte tu sitio con el mundo.",
            contentSections: [
              { title: "Solo Funciona en el Portátil de Maya", content: "Maya le enseña la página a una amiga girando el portátil. Para enviársela le manda el archivo, y se abre sin nada de estilo. Una web que nadie puede visitar no es del todo una web." },
              { title: "Un Servidor Es una Computadora Que Nunca Duerme", content: "Tu archivo vive en tu portátil, que se apaga y cambia de dirección. Un alojamiento es una computadora que sigue encendida, guarda tus archivos y responde a quien los pida, de día y de noche." },
              { title: "De Carpeta a Dirección", content: "Maya arrastra su carpeta a un alojamiento gratuito. Contiene:\n\nindex.html\nstyle.css\n\nMinutos después tiene una dirección real que puede mandar a cualquiera. El servidor busca index.html primero: por eso la página de inicio casi siempre se llama así." },
              { title: "Toda Web Son Solo Archivos", content: "Los sitios más grandes que usas siguen siendo carpetas de archivos en algún servidor. Tienen más archivos y máquinas más rápidas, pero el navegador los pide igual que pide los tuyos." },
              { title: "Publica la Tuya", content: "Renombra tu me.html a index.html. Ponlo en una carpeta junto a tu archivo CSS. Sube la carpeta a cualquier alojamiento gratuito y manda la dirección a alguien. Tu sitio ya está en internet." },
              { title: "Resumen del Módulo 4", content: "• Tu portátil no puede alojar un sitio: se apaga\n• Un alojamiento sigue encendido y responde peticiones\n• La página de inicio se llama index.html\n• Toda web son archivos en un servidor" }
            ],
            exercises: [
              { question: "¿Qué es un servidor web?", options: [ "Un programa que convierte el HTML en diseño", "Una computadora que permanece en línea 24/7 alojando archivos", "La carpeta de tu portátil donde viven los archivos", "Una pestaña que mantiene abierta una página web" ] },
              { question: "Desplegar un sitio web significa ponerlo en un servidor para que el mundo pueda visitarlo." },
              { question: "La dirección web que la gente escribe para visitar tu sitio se llama ___.", answer: "url" },
              { question: "Relaciona los términos de alojamiento:", pairs: [ { term: "Servidor", definition: "Computadora en línea 24/7" }, { term: "URL", definition: "Dirección web" }, { term: "Desplegar", definition: "Publicar el código en vivo" } ] },
              { question: "¿Qué escriben los visitantes para acceder a tu sitio web?", options: ["Una URL", "Una memoria USB", "Una contraseña", "Un archivo de texto"] }
            ]
          }
        ]
      },
      "6": {
        title: "Arte Digital: Dibuja en tu Pantalla",
        desc: "Da rienda suelta a tu creatividad con técnicas de arte digital.",
        category: "Artes",
        difficulty: "Todos los Niveles",
        learningObjectives: [
          "Navegar en software de lienzo digital",
          "Aplicar teoría de color avanzada",
          "Estructurar poses dinámicas de personajes",
          "Renderizar y pulir ilustraciones"
        ],
        prerequisites: ["Una tableta de dibujo digital"],
        modules: [
          {
            title: "Módulo 1: Capas y Arte No Destructivo",
            desc: "Dibuja sin miedo a arruinar tu trabajo.",
            contentSections: [
              { title: "Rhea Borra Dos Horas", content: "Rhea pasó dos horas con un boceto de dragón y empezó a colorear. Un golpe de goma y el ala desapareció: boceto y color a la vez. Lo había dibujado todo en una sola capa." },
              { title: "Las Capas Son Láminas de Vidrio", content: "Una capa es una lámina transparente sobre tu lienzo. Boceta en la de abajo, entinta en la siguiente, colorea encima. Borra la de arriba y todo lo de debajo queda intacto." },
              { title: "Las Tres Láminas de Rhea", content: "Rhea rehace el dragón:\n\nCapa 3 — color\nCapa 2 — líneas limpias\nCapa 1 — boceto\n\nOculta la Capa 1 y las líneas del boceto desaparecen de la vista sin borrarse. Puede volver a mostrarlas cuando quiera. Eso es trabajar de forma no destructiva." },
              { title: "Ponles Nombre Sobre la Marcha", content: "Todas las apps llaman a las capas Capa 1, Capa 2, Capa 3. Con diez dibujadas no recordarás cuál es cuál. Renómbralas en cuanto las crees: boceto, líneas, piel, sombras." },
              { title: "Compruébalo Tú Misma", content: "Crea dos capas. Garabatea en la de abajo y luego encima en la de arriba. Borra del todo el garabato de arriba. Mira cómo el de abajo sobrevive intacto." },
              { title: "Resumen del Módulo 1", content: "• Una capa es una lámina transparente sobre el lienzo\n• Borrar una capa nunca toca las de debajo\n• Ocultar una capa no es borrarla\n• Nombra las capas según las creas" }
            ],
            exercises: [
              { question: "¿A qué se parecen las capas del arte digital?", options: ["Rocas pesadas", "Láminas de vidrio transparentes apiladas", "Una sola hoja de papel", "Un pincel"] },
              { question: "Borrar en la Capa 2 elimina tu dibujo en la Capa 1." },
              { question: "Dibujar en capas separadas evita arruinar tu boceto; a esto se le llama arte no ___.", answer: "destructivo" },
              { question: "Relaciona los tipos de capa:", pairs: [ { term: "Capa de Boceto", definition: "Guía inicial en bruto" }, { term: "Capa de Entintado", definition: "Contorno limpio" }, { term: "Capa de Color", definition: "Rellenos bajo el entintado" } ] },
              { question: "¿Por qué usan capas los artistas digitales?", options: ["Para ir más lento", "Para colorear sin destruir el boceto", "Para bloquear el software", "Para desperdiciar espacio"] }
            ]
          },
          {
            title: "Módulo 2: Teoría del Color y Paletas",
            desc: "¡Elige colores que resalten!",
            contentSections: [
              { title: "Todo Se Ve Embarrado", content: "Rhea eligió doce colores que le gustaban para su dragón. Juntos se volvieron un lodo marrón. Su amiga usó tres y quedó mejor. Que te guste un color no significa que encaje ahí." },
              { title: "Los Opuestos Hacen Que Resalte", content: "En la rueda de color, las parejas opuestas son complementarias: azul y naranja, rojo y verde, amarillo y morado. Uno al lado del otro, cada uno hace que el otro se vea más vivo." },
              { title: "Por Qué Funcionan los Atardeceres", content: "Mira casi cualquier cartel de cine con un atardecer. Cielo naranja, sombras azules. Los carteles de superproducciones usan tanto esa pareja que tiene apodo: naranja y turquesa. Rhea pinta su dragón azul sobre un cielo naranja y de pronto destaca." },
              { title: "Tres Colores, No Doce", content: "Elige un color principal, su opuesto para el contraste y uno neutro. Con tres basta para un dibujo entero. Más colores no significan más interesante: casi siempre significan más embarrado." },
              { title: "Cambia el Fondo", content: "Coge cualquier dibujo tuyo. Rellena el fondo con el color opuesto a tu sujeto en la rueda. Luego prueba con el mismo color que el sujeto. Mira los dos y fíjate a cuál va tu ojo." },
              { title: "Resumen del Módulo 2", content: "• Los colores opuestos en la rueda son complementarios\n• Juntos hacen que cada uno se vea más vivo\n• Azul y naranja es la pareja más usada en el cine\n• Tres colores ganan a doce" }
            ],
            exercises: [
              { question: "Los colores opuestos en la rueda de color se llaman:", options: ["Análogos", "Complementarios", "Primarios", "Monocromáticos"] },
              { question: "El azul y el naranja son colores complementarios." },
              { question: "Los colores complementarios crean el máximo ___ visual.", answer: "contraste" },
              { question: "Relaciona los pares de colores complementarios:", pairs: [ { term: "Azul", definition: "Naranja" }, { term: "Rojo", definition: "Verde" }, { term: "Amarillo", definition: "Morado" } ] },
              { question: "¿Qué efecto crean los colores complementarios cuando se colocan uno al lado del otro?", options: ["Aburrimiento", "Máximo contraste y emoción", "Un borrón gris", "Invisibilidad"] }
            ]
          },
          {
            title: "Módulo 3: Composición y Regla de los Tercios",
            desc: "Organiza los elementos como un director profesional.",
            contentSections: [
              { title: "En el Centro y Aburrido", content: "Rhea puso el dragón justo en el centro del lienzo, como siempre. Parece una foto de pasaporte de un dragón. Correcta, simétrica y completamente quieta." },
              { title: "Divide el Lienzo en Nueve", content: "Traza dos líneas horizontales y dos verticales, como un tres en raya. Pon tu sujeto donde se cruzan en vez de en el centro. El dibujo deja de parecer congelado." },
              { title: "Tu Móvil Ya Lo Hace", content: "Abre la cámara del móvil y activa la cuadrícula en los ajustes. Salen las mismas nueve casillas. Los fotógrafos alinean el horizonte con la línea de abajo y las caras en un cruce. Rhea mueve su dragón al cruce superior izquierdo y le deja espacio para volar." },
              { title: "Más Antiguo Que las Cámaras", content: "La idea se escribió para pintores de paisajes en 1797, mucho antes de que existiera la fotografía. Pintores, fotógrafos, directores de cine y artistas de videojuegos la siguen usando." },
              { title: "Mueve Una Sola Cosa", content: "Coge un dibujo con el sujeto en el centro. Activa la cuadrícula de tu app y mueve el sujeto a un cruce. Deja espacio vacío hacia donde mira. Compara los dos." },
              { title: "Resumen del Módulo 3", content: "• Divide el lienzo en nueve casillas\n• Pon el sujeto en un cruce, no en el centro\n• Deja espacio hacia donde mira\n• Tu cámara tiene esa misma cuadrícula" }
            ],
            exercises: [
              { question: "¿Qué cuadrícula usa la Regla de los Tercios?", options: ["Cuadrícula 2x2", "Cuadrícula 3x3", "Cuadrícula 10x10", "Sin cuadrícula"] },
              { question: "Colocar un personaje justo en el centro es siempre la opción más cinematográfica." },
              { question: "En la Regla de los Tercios, coloca tu sujeto en las ___ de la cuadrícula.", answer: "intersecciones" },
              { question: "Relaciona los términos de composición:", pairs: [ { term: "Regla de los Tercios", definition: "Cuadrícula de alineación 3x3" }, { term: "Punto Focal", definition: "Lugar principal donde miran los ojos" }, { term: "Lienzo", definition: "Área de dibujo digital" } ] },
              { question: "¿Dónde debes colocar tu sujeto usando la Regla de los Tercios?", options: ["Siempre en el centro exacto", "Fuera del lienzo", "En las intersecciones de las líneas de la cuadrícula", "Solo en la esquina inferior izquierda"] }
            ]
          },
          {
            title: "Módulo 4: Renderizado e Iluminación",
            desc: "Haz que los dibujos planos parezcan 3D con luz y sombra.",
            contentSections: [
              { title: "El Dragón Plano", content: "El dragón de Rhea ya tiene color y composición y sigue pareciendo una pegatina. No pesa. Nada le dice a tu ojo si el cuerpo es redondo o plano, porque todo tiene el mismo brillo." },
              { title: "Decide Dónde Está la Luz", content: "Elige un punto del que venga la luz y mantenlo. Las superficies que miran hacia ella reciben brillo. Las que miran al lado contrario reciben sombra. Esa diferencia es lo que hace que una forma parezca sólida." },
              { title: "Luz Desde Arriba a la Izquierda", content: "Rhea pone la luz arriba a la izquierda:\n\nArriba a la izquierda de cada escama — lo más claro\nEn medio — el color base\nAbajo a la derecha — sombra\n\nAñade una sombra en el suelo bajo el dragón y deja de flotar. Con tres tonos y una sombra en el suelo ya se lee como sólido." },
              { title: "Entrecierra los Ojos", content: "Entrecierra los ojos hasta que el dibujo se vuelva borroso. Los colores desaparecen y solo quedan claros y oscuros. Si todo se funde en una papilla gris, tus sombras son demasiado suaves para leerse de lejos." },
              { title: "Una Bola, Tres Tonos", content: "Dibuja un círculo. Elige una dirección de luz. Rellénalo con un color base, añade una zona más clara hacia la luz y otra más oscura al lado opuesto. Añade una sombra en el suelo. Acabas de dibujar una esfera." },
              { title: "Resumen del Módulo 4", content: "• Elige una dirección de luz y mantenla\n• Hacia la luz es brillo, al lado contrario es sombra\n• Una sombra en el suelo evita que las cosas floten\n• Entrecierra los ojos para comprobar tus oscuros" }
            ],
            exercises: [
              { question: "¿Qué es el renderizado en el arte digital?", options: ["Añadir luz y sombra para dar profundidad 3D", "Borrar el boceto", "Añadir una firma", "Guardar como JPEG"] },
              { question: "El lado de un objeto que mira hacia el sol recibe una sombra." },
              { question: "El punto luminoso donde la luz incide directamente sobre un objeto se llama ___.", answer: "brillo" },
              { question: "Relaciona los términos de iluminación:", pairs: [ { term: "Fuente de Luz", definition: "De dónde viene la luz (sol/lámpara)" }, { term: "Brillo", definition: "El punto más luminoso del objeto" }, { term: "Sombra", definition: "Zona oscura alejada de la luz" } ] },
              { question: "¿Qué zona recibe un Brillo?", options: [ "El lado que da la espalda a la fuente de luz", "El lado que mira directamente hacia la luz", "La parte más cercana a la sombra del suelo", "El contorno dibujado alrededor de la figura" ] }
            ]
          }
        ]
      },
        "7": {
          title: "Computadora con Confianza: Domina la Máquina",
          desc: "Entiende la computadora que usas cada día: su sistema operativo, los atajos que te ahorran horas, cómo llega internet hasta ti y cómo escribir correos que sí se leen.",
          category: "Informática",
          difficulty: "Principiante",
          learningObjectives: [
            "Reconocer los principales sistemas operativos y qué hacen",
            "Usar los atajos que más tiempo ahorran",
            "Explicar cómo viaja una página desde un servidor hasta tu pantalla",
            "Escribir un correo que la gente sí lee"
          ],
          prerequisites: ["Una computadora o tablet que puedas usar"],
          modules: [
            {
              title: "Módulo 1: El Jefe de la Máquina",
              desc: "Qué es un sistema operativo y por qué el tuyo se ve así.",
              contentSections: [
                { title: "El Portátil Prestado de Zara", content: "Zara tomó prestado el portátil de su primo y nada estaba donde esperaba. Los botones estaban al otro lado. Cerrar una ventana no cerraba el programa. La misma clase de máquina, reglas completamente distintas." },
                { title: "El Sistema Operativo Manda en Todo", content: "Un sistema operativo es el programa que manda sobre los demás. Abre tus apps, recuerda tus archivos y dibuja todo lo que ves. Cada app tiene que pedirle permiso." },
                { title: "Los Que Vas a Encontrar", content: "Windows — la mayoría de portátiles y PCs\\nmacOS — computadoras de Apple\\nLinux — casi todos los servidores detrás de las webs\\nAndroid e iOS — teléfonos y tablets\\n\\nAndroid está construido sobre Linux e iOS comparte raíces con macOS: por eso un Mac y un iPhone se sienten parientes." },
                { title: "Ya Usas Varios", content: "Un teléfono, un portátil, una consola y una tele inteligente llevan cada uno su propio sistema operativo. Casi todo el mundo usa tres o cuatro al día sin nombrar ninguno." },
                { title: "Descubre Cuál Tienes", content: "En Windows pulsa la tecla Windows y escribe Acerca de. En un Mac abre el menú de la manzana y luego Acerca de este Mac. En el móvil entra en Ajustes y busca Acerca de. Anota el nombre y la versión." },
                { title: "Resumen del Módulo 1", content: "• El sistema operativo manda sobre todos los demás programas\\n• Windows, macOS y Linux llevan computadoras; Android e iOS, teléfonos\\n• Android se apoya en Linux; iOS es pariente de macOS\\n• Usas varios sistemas operativos cada día" }
              ],
              exercises: [
                { question: "¿De qué se encarga un sistema operativo?", options: ["Solo de guardar tus fotos a salvo", "De hacer funcionar todos los demás programas", "De conectar el aparato a internet", "De subir o bajar el brillo de la pantalla"] },
                { question: "Un teléfono lleva un sistema operativo, igual que un portátil." },
                { question: "Casi todos los servidores que alojan webs usan el sistema operativo ___.", answer: "Linux" },
                { question: "Relaciona cada sistema operativo con dónde se encuentra:", pairs: [ { term: "Windows", definition: "La mayoría de portátiles y PCs" }, { term: "macOS", definition: "Computadoras de Apple" }, { term: "Android", definition: "La mayoría de teléfonos y tablets" }, { term: "Linux", definition: "Servidores detrás de las webs" } ] },
                { question: "¿Por qué un Mac y un iPhone se sienten parecidos?", options: ["Se fabrican en la misma planta", "Sus sistemas operativos comparten las mismas raíces", "Los dos necesitan internet todo el tiempo", "Salieron a la venta el mismo año"] }
              ]
            },
            {
              title: "Módulo 2: Atajos Que Te Regalan Tiempo",
              desc: "Las pocas teclas que sustituyen cien viajes del ratón.",
              contentSections: [
                { title: "Cuarenta Minutos Arrastrando", content: "Zara movió cincuenta fotos a una carpeta de una en una, arrastrándolas. Su primo hizo las cincuenta siguientes en menos de un minuto. No trabajó más duro: se sabía tres teclas." },
                { title: "Un Atajo Es la Misma Orden, Más Rápida", content: "Los menús y los atajos hacen exactamente lo mismo. El menú es más fácil de encontrar; el atajo es más rápido cuando ya lo sabes. Aprender cinco vale más que aprender cincuenta." },
                { title: "Los Cinco Que Valen la Pena", content: "Ctrl+C copiar, Ctrl+V pegar\\nCtrl+Z deshacer, Ctrl+Y rehacer\\nCtrl+A seleccionar todo\\nCtrl+S guardar\\nCtrl+F buscar en esta página\\n\\nEn un Mac cambia Ctrl por Cmd. Ctrl+Z es la tecla más indulgente de cualquier teclado." },
                { title: "Deshacer Llega Más Atrás de lo Que Crees", content: "Deshacer no es un solo paso. Púlsalo otra vez y otra y casi todos los programas seguirán caminando hacia atrás. Borrar algo sin querer casi nunca es definitivo." },
                { title: "Compite Contigo Mismo", content: "Abre cualquier documento. Selecciona todo el texto y cópialo usando solo los menús, contando los segundos. Hazlo otra vez con Ctrl+A y Ctrl+C. Prueba Ctrl+F para buscar una palabra en esta página." },
                { title: "Resumen del Módulo 2", content: "• Un atajo y un menú ejecutan la misma orden\\n• Copiar, pegar, deshacer, seleccionar todo, guardar y buscar cubren casi todo\\n• Mac usa Cmd donde Windows usa Ctrl\\n• Deshacer sigue yendo atrás, así que los errores rara vez son definitivos" }
              ],
              exercises: [
                { question: "¿Qué hace Ctrl+Z?", options: ["Guarda el archivo en el que trabajas", "Deshace lo último que hiciste", "Cierra la ventana de inmediato", "Selecciona todo lo de la página"] },
                { question: "En un Mac normalmente pulsas Cmd donde Windows usa Ctrl." },
                { question: "El atajo para buscar una palabra en la página actual es Ctrl+___.", answer: "F" },
                { question: "Relaciona cada atajo con lo que hace:", pairs: [ { term: "Ctrl+C", definition: "Copiar" }, { term: "Ctrl+V", definition: "Pegar" }, { term: "Ctrl+A", definition: "Seleccionar todo" }, { term: "Ctrl+S", definition: "Guardar" } ] },
                { question: "Borras un párrafo sin querer. ¿Cuál es la solución más rápida?", options: ["Cerrar sin guardar y empezar de nuevo", "Pulsar Ctrl+Z para deshacerlo", "Volver a escribirlo de memoria", "Reiniciar la computadora entera"] }
              ]
            },
            {
              title: "Módulo 3: Cómo Llega una Página Hasta Ti",
              desc: "Qué pasa entre escribir una dirección y ver la página.",
              contentSections: [
                { title: "Los Deberes Que Desaparecieron", content: "La página de Zara no cargaba, así que culpó a la web. Su primo hizo una sola pregunta: ¿carga alguna otra cosa? Ninguna. La web estaba bien. Se le había caído el wifi." },
                { title: "Tu Navegador Pide, un Servidor Responde", content: "Escribir una dirección envía una petición por internet a una computadora que guarda la página. Esa computadora devuelve los archivos y tu navegador los dibuja. Cada página que abres es ese viaje de ida y vuelta." },
                { title: "Leer una Dirección Web", content: "https://www.ejemplo.com/fotos\\n\\nhttps — la conexión va cifrada\\nwww.ejemplo.com — a qué computadora preguntar\\n/fotos — qué página de ella\\n\\nEl candado significa que nadie por el camino puede leer lo que envías. No promete que el sitio sea honesto." },
                { title: "Averigua Dónde Falló", content: "Cuando una página no carga, prueba con otra web. Si fallan todas, es tu conexión. Si falla solo una, es esa web. Una pestaña más te lo dice antes de reiniciar nada." },
                { title: "Desarma una Dirección", content: "Mira la barra de direcciones ahora mismo. Encuentra el https, el nombre del sitio y la parte después de la barra. Abre otra web y compara las dos. Fíjate en qué parte cambia al navegar." },
                { title: "Resumen del Módulo 3", content: "• Tu navegador pide una página y un servidor la envía\\n• https significa que la conexión va cifrada\\n• La parte después de la barra elige la página\\n• Si fallan todas las webs, el problema es tu conexión" }
              ],
              exercises: [
                { question: "¿Qué ocurre cuando escribes una dirección web y pulsas enter?", options: ["Tu navegador pide la página a un servidor", "La página se construye en tu propia computadora", "Tu proveedor de internet elige un sitio por ti", "El navegador busca en los archivos de tu aparato"] },
                { question: "El candado significa que la conexión va cifrada, no que el sitio sea de fiar." },
                { question: "En https://ejemplo.com/fotos, la parte que elige qué página mostrar es ___.", answer: "/fotos" },
                { question: "Relaciona cada parte de una dirección web con su función:", pairs: [ { term: "https", definition: "La conexión va cifrada" }, { term: "ejemplo.com", definition: "A qué computadora preguntar" }, { term: "/fotos", definition: "Qué página de esa computadora" }, { term: "Navegador", definition: "Dibuja la página para ti" } ] },
                { question: "Una web no carga pero todas las demás funcionan. ¿Qué es lo más probable?", options: ["Tu wifi ha dejado de funcionar", "Algo va mal en esa web concreta", "Hay que reiniciar la computadora", "Hay que reinstalar el navegador hoy"] }
              ]
            },
            {
              title: "Módulo 4: Correos Que Sí Se Leen",
              desc: "Cómo funciona el correo y cómo escribir uno que reciba respuesta.",
              contentSections: [
                { title: "Sin Asunto, Sin Respuesta", content: "Zara escribió a su profesora con el asunto vacío y una palabra en el cuerpo: pregunta. Pasaron tres días sin respuesta. La profesora tenía más de doscientos correos sin leer y ningún motivo para abrir ese." },
                { title: "El Asunto Hace el Trabajo", content: "Casi todo el mundo decide si abre un correo solo por el asunto. Uno bueno dice de qué va y qué necesitas. Los asuntos vagos se saltan, no se rechazan." },
                { title: "El Mismo Correo, Dos Veces", content: "Asunto: pregunta\\nCuerpo: Tengo una pregunta\\n\\nAsunto: Trabajo de ciencias — ¿puedo entregarlo el viernes?\\nCuerpo: Hola profesora Díaz, estuve enferma el martes y me perdí los apuntes. ¿Podría entregar el informe el viernes? Gracias, Zara\\n\\nEl segundo se responde en cuatro segundos." },
                { title: "Mira la Dirección Antes Que las Palabras", content: "Un correo que parece oficial puede venir de cualquiera. Lee la dirección real, no el nombre que se muestra. Cualquier cosa que pida una contraseña o un código merece enseñársela a un adulto antes de responder." },
                { title: "Reescribe un Asunto Flojo", content: "Escribe un asunto para: pedir entrar en el equipo de fútbol, preguntar por una sudadera perdida, dar las gracias por una ayuda. Cada uno debe decir el tema y qué quieres en menos de diez palabras." },
                { title: "Resumen del Módulo 4", content: "• La gente decide por el asunto si lo abre\\n• Di el tema y qué necesitas\\n• Cc copia a alguien; todos ven a quién\\n• Lee la dirección real y nunca envíes una contraseña" }
              ],
              exercises: [
                { question: "¿Por qué importa tanto un asunto claro?", options: ["Hace que el correo llegue más rápido", "La gente decide por él si lo abre", "El correo no se envía sin asunto", "Evita que el mensaje acabe en spam"] },
                { question: "Todos los que están en Para y en Cc pueden ver quién más recibió el correo." },
                { question: "Para copiar a alguien en un correo sin que sea el destinatario principal, ponlo en ___.", answer: "Cc" },
                { question: "Relaciona cada campo del correo con su función:", pairs: [ { term: "Para", definition: "A quién va dirigido" }, { term: "Cc", definition: "Alguien a quien se mantiene al tanto" }, { term: "Asunto", definition: "De qué trata" }, { term: "Adjunto", definition: "Un archivo enviado con él" } ] },
                { question: "Un correo dice que tu cuenta se cerrará si no envías tu contraseña. ¿Qué haces?", options: ["Responder rápido para no perder nada", "Enseñárselo a un adulto y no enviar nada", "Enviarla solo si el logo parece correcto", "Reenviarlo a todos como aviso"] }
              ]
            }
          ]
        },
        "8": {
          title: "Científico de la Comida: Qué Hace tu Cuerpo con Ella",
          desc: "Descubre qué es de verdad una caloría, qué hacen dentro de ti los carbohidratos, las proteínas y las grasas, y por qué un futbolista y un bebé necesitan cantidades completamente distintas.",
          category: "Salud",
          difficulty: "Principiante",
          learningObjectives: [
            "Explicar qué mide una caloría",
            "Describir qué hacen los carbohidratos, las proteínas y las grasas",
            "Decir por qué las vitaminas y los minerales importan en cantidades diminutas",
            "Explicar por qué cada persona necesita cantidades distintas de comida"
          ],
          prerequisites: ["Curiosidad por lo que hay en tu plato"],
          modules: [
            {
              title: "Módulo 1: Qué Es de Verdad una Caloría",
              desc: "Una unidad de energía, no un marcador que ganas o pierdes.",
              contentSections: [
                { title: "Theo Lee la Caja", content: "Theo le dio la vuelta a la caja de cereales y encontró un número: 380 calorías. Había oído decir que las calorías eran malas. Pero los cereales no son malos. Quería saber qué significaba ese número." },
                { title: "Una Caloría Mide Energía", content: "Una caloría es una unidad, como un centímetro o un litro. Mide cuánta energía puede darle un alimento a tu cuerpo. Más calorías es más energía, igual que un depósito más grande lleva más combustible." },
                { title: "En Qué la Gasta tu Cuerpo", content: "Correr y jugar al fútbol: la parte en la que todos piensan\\nRespirar, bombear sangre, mantenerte caliente\\nCrecer y formar músculo\\nPensar, todo el día, en clase\\n\\nCasi toda la energía que usas se va en seguir vivo y crecer, no en hacer deporte." },
                { title: "Tu Cerebro Tiene Hambre", content: "Tu cerebro es alrededor del dos por ciento de tu peso pero usa cerca del veinte por ciento de tu energía. Estar quieto concentrándote cuesta combustible de verdad." },
                { title: "Busca el Número", content: "Encuentra tres paquetes en tu cocina. Anota las calorías por cada 100 gramos. Ordénalos y pregúntate cuál te sorprendió y por qué." },
                { title: "Resumen del Módulo 1", content: "• Una caloría es una unidad de energía, como el centímetro lo es de longitud\\n• No es una nota buena ni mala\\n• Casi toda tu energía se va en vivir y crecer\\n• Solo tu cerebro usa cerca de una quinta parte" }
              ],
              exercises: [
                { question: "¿Qué mide una caloría?", options: ["Cuánto azúcar lleva un alimento", "Cuánta energía puede darte un alimento", "Cuánto pesa una ración de comida", "Cuánto tarda un alimento en digerirse"] },
                { question: "Casi toda la energía que usas cada día se va en hacer deporte." },
                { question: "Una caloría es una unidad de ___.", answer: "energía" },
                { question: "Relaciona cada tarea con para qué necesita energía:", pairs: [ { term: "Respirar", definition: "Mantener tu cuerpo en marcha" }, { term: "Crecer", definition: "Formar hueso y músculo nuevos" }, { term: "Pensar", definition: "Alimentar tu cerebro" }, { term: "Correr", definition: "Mover los músculos con fuerza" } ] },
                { question: "¿Más o menos cuánta energía usa tu cerebro?", options: ["Alrededor del dos por ciento", "Alrededor del veinte por ciento", "Más o menos la mitad", "Casi nada" ] }
              ]
            },
            {
              title: "Módulo 2: Los Tres Grandes",
              desc: "Carbohidratos, proteínas y grasas, y para qué sirve cada uno.",
              contentSections: [
                { title: "La Tarde Floja de Theo", content: "Theo desayunó tostada con mermelada y se sintió genial, y se quedó sin fuerzas en la segunda clase. Su amigo tomó huevos con tostada y seguía entero. La misma cantidad de comida, tardes muy distintas." },
                { title: "Tres Clases de Combustible", content: "Los macronutrientes son las tres cosas que tu cuerpo necesita en gran cantidad. El carbohidrato es energía rápida, la proteína es material de construcción, la grasa es energía duradera y protección. Macro solo significa grande." },
                { title: "Qué Hace Cada Uno", content: "Carbohidratos — pan, arroz, fruta. Energía rápida para ahora.\\nProteínas — huevos, legumbres, pescado, lentejas. Construye y repara músculo.\\nGrasas — frutos secos, aceite de oliva, queso. Energía lenta, protege tus órganos, ayuda a tu cerebro.\\n\\nUna comida con los tres te aguanta mucho más que una de solo carbohidratos." },
                { title: "Ningún Macro Es el Malo", content: "La gente se turna para culpar a la grasa, luego a los carbohidratos, luego a otra cosa. Tu cuerpo necesita los tres. Un cuerpo sin grasa o sin carbohidratos no funciona mejor: funciona peor." },
                { title: "Clasifica tu Comida", content: "Piensa en lo último que comiste. Escribe cada parte bajo carbohidrato, proteína o grasa. Algunos alimentos caen en dos columnas. Fíjate si alguna columna quedó vacía." },
                { title: "Resumen del Módulo 2", content: "• Macro significa grande: los tres que más necesitas\\n• El carbohidrato es energía rápida\\n• La proteína te construye y repara\\n• La grasa es energía lenta y protección\\n• Necesitas los tres, no dos de ellos" }
              ],
              exercises: [
                { question: "¿Qué macronutriente se usa sobre todo para construir y reparar músculo?", options: ["Carbohidrato", "Proteína", "Grasa", "Agua"] },
                { question: "Un cuerpo sano necesita carbohidratos, proteínas y grasas, no solo dos de ellos." },
                { question: "La palabra macro en macronutriente significa ___.", answer: "grande" },
                { question: "Relaciona cada macronutriente con su función principal:", pairs: [ { term: "Carbohidrato", definition: "Energía rápida" }, { term: "Proteína", definition: "Construir y reparar" }, { term: "Grasa", definition: "Energía lenta y protección" }, { term: "Los tres", definition: "Una comida que aguanta" } ] },
                { question: "¿Por qué Theo se quedó sin energía antes que su amigo?", options: ["Comió muchísimo menos de la cuenta", "Su desayuno era casi todo carbohidrato", "Tomó demasiada proteína de golpe", "No bebió agua con el desayuno"] }
              ]
            },
            {
              title: "Módulo 3: Cantidades Diminutas, Tareas Enormes",
              desc: "Vitaminas y minerales, y por qué la cantidad no mide la importancia.",
              contentSections: [
                { title: "Los Marineros Que Comían Limas", content: "Los viajes largos por mar dejaban a los marineros agotados y con las encías sangrando. Tenían comida de sobra y energía de sobra. Lo que les faltaba no pesaba casi nada: vitamina C. Las limas lo arreglaron." },
                { title: "Los Micronutrientes Son Herramientas, No Combustible", content: "Las vitaminas y los minerales no te dan energía alguna. Tu cuerpo los usa para hacer tareas: formar hueso, transportar oxígeno, curar heridas. Micro significa pequeño, y solo necesitas cantidades diminutas." },
                { title: "Algunos y Qué Hacen", content: "Hierro — transporta oxígeno en tu sangre\\nCalcio — forma huesos y dientes\\nVitamina C — cura heridas y ayuda a absorber hierro\\nVitamina D — deja que tu cuerpo use el calcio\\n\\nLa vitamina C ayuda a absorber hierro, así que las legumbres con tomate ganan a las legumbres solas." },
                { title: "Una la Fabrica el Sol", content: "La vitamina D es la rara: tu piel la fabrica con la luz del sol. Es la única vitamina que tu cuerpo puede producir solo, por eso baja en los inviernos largos y oscuros." },
                { title: "Cuenta Colores", content: "Cuenta cuántos colores distintos de fruta y verdura comiste ayer. Colores distintos suelen significar micronutrientes distintos. Propón añadir un color nuevo mañana." },
                { title: "Resumen del Módulo 3", content: "• Los micronutrientes no dan energía; permiten hacer tareas\\n• El hierro transporta oxígeno, el calcio forma hueso\\n• La vitamina C ayuda a absorber hierro\\n• Tu piel fabrica vitamina D con el sol" }
              ],
              exercises: [
                { question: "¿Qué le dan a tu cuerpo las vitaminas y los minerales?", options: ["Energía para correr y jugar", "Herramientas para tareas como formar hueso", "Peso extra para crecer más", "Agua para mantenerte hidratado"] },
                { question: "La vitamina D es la única vitamina que tu propia piel puede fabricar, usando el sol." },
                { question: "El mineral que transporta oxígeno por tu sangre es el ___.", answer: "hierro" },
                { question: "Relaciona cada micronutriente con su tarea:", pairs: [ { term: "Hierro", definition: "Transporta oxígeno en tu sangre" }, { term: "Calcio", definition: "Forma huesos y dientes" }, { term: "Vitamina C", definition: "Cura heridas y ayuda a absorber hierro" }, { term: "Vitamina D", definition: "Deja que tu cuerpo use el calcio" } ] },
                { question: "¿Por qué aparece micro en la palabra micronutriente?", options: ["Solo se encuentran en alimentos pequeños", "Los necesitas en cantidades diminutas", "Se descubrieron los últimos", "Son los menos importantes"] }
              ]
            },
            {
              title: "Módulo 4: Por Qué Nadie Necesita lo Mismo",
              desc: "La edad, el tamaño y cómo pasas el día cambian la respuesta.",
              contentSections: [
                { title: "Tres Platos en una Mesa", content: "La familia de Theo se sentó junta: su hermana bebé, su tío que corre maratones y su abuela. Tres platos muy distintos, y cada uno era el correcto para quien se lo comía." },
                { title: "Tu Cuerpo Marca la Cantidad", content: "Cuánta energía necesita alguien depende de su tamaño, su edad y de cómo pasa el día. Un cuerpo más grande cuesta más de mantener. Un cuerpo que crece, todavía más." },
                { title: "Misma Familia, Necesidades Distintas", content: "Un maratoniano pasa horas moviéndose, así que necesita mucha.\\nUn bebé es pequeño pero crece deprisa, así que necesita bastante para su tamaño.\\nUna persona mayor que se mueve menos necesita menos.\\n\\nNinguna es mejor que otra. Son respuestas a preguntas distintas." },
                { title: "No Hay un Número Correcto para un Niño", content: "Los cuerpos que crecen necesitan mucho, y el apetito cambia de una semana a otra, y eso es normal. Nadie de tu edad debería contar ni limitar. Si alguna vez te preguntas por tu propia alimentación, eso lo responde un médico, no internet." },
                { title: "Adivina Quién Necesita Más", content: "Para cada pareja, di quién necesita seguramente más energía al día y por qué: alguien que nada a diario o alguien en reposo con una pierna rota; un adolescente en pleno estirón o un adulto más pequeño. Di tu razón en voz alta." },
                { title: "Resumen del Módulo 4", content: "• El tamaño, la edad y la actividad cambian la energía que alguien necesita\\n• Los cuerpos que crecen necesitan mucho para su tamaño\\n• Necesidades distintas no son mejores ni peores\\n• No hay un número correcto para un niño: eso lo responde un médico" }
              ],
              exercises: [
                { question: "¿Qué cambia la energía que una persona necesita al día?", options: ["Solo cuánto pesa", "Su tamaño, su edad y lo activa que es", "Solo los deportes que practica", "La época del año en que estemos"] },
                { question: "Un bebé necesita bastante energía para su tamaño, porque crece deprisa." },
                { question: "Si tienes una duda sobre tu propia alimentación, la persona a la que preguntar es un ___.", answer: "médico" },
                { question: "Relaciona cada persona con por qué cambian sus necesidades:", pairs: [ { term: "Maratoniano", definition: "Horas de movimiento intenso" }, { term: "Bebé", definition: "Pequeño, pero crece deprisa" }, { term: "Persona mayor", definition: "Normalmente se mueve menos" }, { term: "Adolescente", definition: "Crece deprisa y es activo" } ] },
                { question: "Dos personas comen cantidades muy distintas. ¿Qué te dice eso?", options: ["Una de las dos come mal", "Sus cuerpos necesitan cantidades distintas", "El plato más grande siempre es mejor", "Deberían intercambiarse las comidas"] }
              ]
            }
          ]
        },
        "9": {
          title: "La IA Explicada: Cómo Aprende y Dónde Falla",
          desc: "Entiende cómo la IA aprende de ejemplos, por qué suena segura aunque se equivoque, cómo recoge injusticias y cómo usarla sin entregarle tu forma de pensar.",
          category: "Alfabetización en IA",
          difficulty: "Principiante",
          learningObjectives: [
            "Explicar cómo una máquina aprende a partir de ejemplos",
            "Decir por qué la IA puede equivocarse con total seguridad",
            "Reconocer por dónde se cuela la injusticia en un sistema",
            "Usar la IA como ayudante sin que piense por ti"
          ],
          prerequisites: ["No hace falta experiencia"],
          modules: [
            {
              title: "Módulo 1: Aprender con Ejemplos",
              desc: "Cómo pasaron las máquinas de reglas fijas a detectar patrones.",
              contentSections: [
                { title: "Nia Intenta Escribir las Reglas", content: "Nia intentó escribir instrucciones para distinguir un gato de un perro. Cuatro patas, pelo, bigotes, cola. Todas las reglas que escribía valían para los dos. Al cabo de una hora no tenía ninguna que funcionara." },
                { title: "Enséñaselo, No Se lo Cuentes", content: "Los programas antiguos seguían reglas escritas por una persona. La IA moderna ve en cambio miles de ejemplos y deduce el patrón ella sola. Nadie le explica qué es un bigote." },
                { title: "Tres Épocas, la Misma Pregunta", content: "Reglas — una persona escribe: si ladra, es un perro. Falla con un perro callado.\\nAprendizaje — le enseñas muchas fotos etiquetadas. Encuentra el patrón.\\nGeneración — con suficientes ejemplos, también puede crear texto o imágenes nuevas.\\n\\nCada paso necesitó más ejemplos y más potencia, no una regla más lista." },
                { title: "Nunca Ha Visto un Gato", content: "Un modelo de imágenes no tiene ni idea de cómo se siente el pelo ni de que los gatos ronronean. Solo ha visto números que describen píxeles. Reconoce el patrón sin entender al animal." },
                { title: "Prueba a Escribir las Reglas", content: "Escribe instrucciones para distinguir una taza de un cuenco, tan precisas que sirvan a alguien que nunca ha visto ninguno. Pruébalas con cinco objetos reales. Cuenta cuántas fallan." },
                { title: "Resumen del Módulo 1", content: "• Los programas antiguos seguían reglas escritas por personas\\n• La IA moderna aprende el patrón de muchos ejemplos\\n• Más ejemplos y potencia, no reglas más listas\\n• Reconocer un patrón no es entenderlo" }
              ],
              exercises: [
                { question: "¿Cómo aprende sobre todo la IA moderna a distinguir cosas?", options: ["Una persona escribe reglas para cada caso", "Encuentra patrones en muchos ejemplos", "Busca la respuesta en internet", "Le pregunta a un humano cada vez"] },
                { question: "Un modelo de imágenes entiende qué es un gato igual que lo entiende una persona." },
                { question: "En vez de darle reglas, a la IA moderna se le dan muchos ___ para aprender.", answer: "ejemplos" },
                { question: "Relaciona cada enfoque con lo que hace:", pairs: [ { term: "Reglas", definition: "Una persona escribe cada instrucción" }, { term: "Aprendizaje", definition: "Encuentra patrones en ejemplos" }, { term: "Generación", definition: "Crea texto o imágenes nuevas" }, { term: "Ejemplos", definition: "Aquello de lo que aprende" } ] },
                { question: "¿Por qué fallaban siempre las reglas de Nia?", options: ["No escribió suficientes", "Casi todas valían para los dos animales", "Su computadora era muy lenta", "Gatos y perros son idénticos"] }
              ]
            },
            {
              title: "Módulo 2: Segura y Equivocada",
              desc: "Por qué la IA se inventa cosas y nunca suena dudosa.",
              contentSections: [
                { title: "El Libro Que No Existía", content: "Nia pidió a una IA libros sobre volcanes. Le dio cinco títulos con autores y años. Su bibliotecaria encontró cuatro. El quinto no existía ni había existido nunca, pero parecía tan real como los demás." },
                { title: "Predice, No Consulta", content: "Un modelo de lenguaje adivina qué palabras suelen venir después. No está buscando en una biblioteca. Un título inventado encaja perfectamente con el patrón de los títulos reales, así que sale igual de convincente." },
                { title: "Dónde Es Más Débil", content: "Números y fechas exactas\\nQuién dijo o escribió qué\\nCualquier cosa muy reciente\\nEnlaces y referencias\\n\\nSon los detalles que un patrón no puede aportar. Produce algo con la forma correcta, no algo comprobado." },
                { title: "La Seguridad No Es una Prueba", content: "La IA escribe una respuesta equivocada con la misma voz tranquila y ordenada que una correcta. No hay ningún titubeo que te avise. Todo lo que importe se comprueba en otro sitio, siempre." },
                { title: "Píllala en un Fallo", content: "Pregúntale a una IA por algo que conozcas bien: un lugar de tu zona, tu deporte favorito, una afición familiar. Busca el detalle que falla un poco. Fíjate en lo segura que suena mientras lo dice." },
                { title: "Resumen del Módulo 2", content: "• Un modelo de lenguaje predice palabras probables, no consulta\\n• Los datos inventados parecen exactamente reales\\n• Números, fechas, fuentes y lo reciente son lo más débil\\n• Sonar segura no es lo mismo que acertar" }
              ],
              exercises: [
                { question: "¿Por qué puede una IA inventarse un libro que no existe?", options: ["Su biblioteca está desactualizada", "Predice palabras probables en vez de consultar", "Alguien borró el registro real", "Intenta engañarte a propósito"] },
                { question: "La IA suele sonar menos segura cuando su respuesta es incorrecta." },
                { question: "Un modelo de lenguaje funciona prediciendo qué ___ vienen después.", answer: "palabras" },
                { question: "Relaciona cada cosa con cuánta comprobación necesita:", pairs: [ { term: "Una fecha exacta", definition: "Compruébala en otro sitio" }, { term: "Una fuente o enlace", definition: "Compruébala en otro sitio" }, { term: "Explicar una idea", definition: "Terreno normalmente más seguro" }, { term: "Noticias muy recientes", definition: "Compruébalas en otro sitio" } ] },
                { question: "Una IA te da un dato para tus deberes. ¿Cuál es el paso sensato?", options: ["Usarlo, sonaba seguro", "Comprobarlo en otra fuente", "Preguntarle lo mismo otra vez", "Usarlo solo si es corto"] }
              ]
            },
            {
              title: "Módulo 3: Por Dónde Se Cuela la Injusticia",
              desc: "Un sistema aprende lo que contienen los ejemplos, incluida la parte injusta.",
              contentSections: [
                { title: "El Dibujo Que Salía Siempre Igual", content: "Nia pidió a una IA que dibujara a un científico diez veces. En todas salió un hombre mayor con bata blanca. Su profesora de ciencias es una mujer joven. La máquina no estaba siendo cruel: repetía lo que le habían enseñado." },
                { title: "Los Ejemplos Llevan el Sesgo", content: "Un modelo solo puede aprender de lo que le dan. Si los ejemplos muestran demasiado a un solo tipo de persona, el resultado también. La injusticia entró con los datos, no de una opinión." },
                { title: "Dónde Se Nota", content: "Imágenes que siempre muestran al mismo tipo de persona en un oficio\\nHerramientas de voz que se atascan con ciertos acentos\\nTraducciones que adivinan un género que nunca se dijo\\n\\nCada una es un patrón de los ejemplos, devuelto mucho más rápido y a mucha mayor escala." },
                { title: "Pregunta Quién Falta", content: "Cuando la IA describe a un grupo de personas, pregunta quién no está en la foto. El hueco suele ser un hueco en los ejemplos, y se ve mucho mejor desde fuera que desde dentro." },
                { title: "Haz la Prueba Tú", content: "Pide a una herramienta de imágenes un enfermero, un cocinero y un piloto varias veces cada uno. Haz recuento. Compáralo con quienes hacen esos trabajos donde vives de verdad." },
                { title: "Resumen del Módulo 3", content: "• Un modelo aprende solo de los ejemplos que recibe\\n• Ejemplos injustos dan resultados injustos\\n• Repite patrones, no tiene opiniones\\n• Preguntar quién falta es la comprobación más rápida" }
              ],
              exercises: [
                { question: "¿Por qué una IA puede dibujar siempre al mismo tipo de persona para un oficio?", options: ["Ha decidido quién encaja ahí", "Sus ejemplos mostraban sobre todo a esa persona", "Está copiando a otra IA", "Dibujar a otras personas es más difícil"] },
                { question: "El sesgo en la IA suele venir de los ejemplos con los que aprendió." },
                { question: "Cuando la IA muestra a un grupo de personas, una buena pregunta es quién ___.", answer: "falta" },
                { question: "Relaciona cada ejemplo con el hueco que hay detrás:", pairs: [ { term: "Siempre el mismo científico", definition: "Ejemplos de imagen poco variados" }, { term: "Se atasca con un acento", definition: "Ejemplos de voz poco variados" }, { term: "Adivina un género", definition: "Patrones en textos antiguos" }, { term: "Quién falta", definition: "La pregunta que lo detecta" } ] },
                { question: "¿Qué hace que esta injusticia sea mayor problema que la opinión de una persona?", options: ["Las máquinas no se pueden corregir", "Se repite a enorme velocidad y escala", "Solo afecta a las imágenes", "Nadie puede llegar a notarla"] }
              ]
            },
            {
              title: "Módulo 4: Usarla Sin Dejarle tu Cabeza",
              desc: "Dónde ayuda de verdad la IA y dónde usarla te cuesta el aprendizaje.",
              contentSections: [
                { title: "Dos Formas de Entregar un Trabajo", content: "Nia le pidió a una IA que escribiera su trabajo y lo entregó. Su amigo le pidió que le explicara la parte confusa y luego escribió el suyo. Los dos entregaron. Solo uno supo responder una pregunta sobre él después." },
                { title: "Una Ayudante, No un Sustituto", content: "La IA es buena explicando algo de otra manera, sugiriendo un punto de partida o revisando la ortografía. Es mala sustituyendo el pensamiento, porque pensar es justo la parte que te cambia." },
                { title: "Buena Pregunta, Mala Pregunta", content: "Mala: escríbeme el trabajo sobre volcanes\\nBuena: explícame por qué sube el magma, como si tuviera doce años\\n\\nMala: resuélveme este problema de mates\\nBuena: me da 42 y la solución es 36, ¿dónde me equivoqué?\\n\\nLas buenas te dejan el trabajo a ti y usan la IA para la parte atascada." },
                { title: "Nunca le Des Cosas Privadas", content: "Tu nombre completo, tu dirección, tu colegio, tus contraseñas y fotos de otras personas no van en un chat. Trata lo que escribes como algo que leerías en voz alta sin problema." },
                { title: "Convierte una Mala Pregunta en Buena", content: "Coge algo que te costara esta semana. Escribe la versión perezosa de la pregunta y luego reescríbela para que la IA explique y el trabajo siga siendo tuyo. Fíjate cuál te enseña más." },
                { title: "Resumen del Módulo 4", content: "• La IA explica y sugiere bien; piensa por ti mal\\n• Pídele que explique, no que sustituya el trabajo\\n• El esfuerzo es la parte que te enseña\\n• Los datos privados no entran en un chat" }
              ],
              exercises: [
                { question: "¿Cuál es la mejor forma de usar la IA para los deberes?", options: ["Pedirle que escriba toda la respuesta", "Pedirle que explique la parte confusa", "Copiarla y cambiar algunas palabras", "Usarla solo cuando estés cansado"] },
                { question: "Tu dirección, tu colegio y tus contraseñas nunca deberían escribirse en un chat de IA." },
                { question: "La IA es una buena ___, pero un mal sustituto de tu propio pensamiento.", answer: "ayudante" },
                { question: "Relaciona cada uso con si te ayuda a aprender:", pairs: [ { term: "Explícamelo otra vez", definition: "Te ayuda a aprender" }, { term: "Escríbelo por mí", definition: "Te salta el aprendizaje" }, { term: "Dónde me equivoqué", definition: "Te ayuda a aprender" }, { term: "Dame la respuesta", definition: "Te salta el aprendizaje" } ] },
                { question: "¿Por qué el amigo de Nia supo responder sobre su trabajo y ella no?", options: ["Escribe mejor por naturaleza", "Hizo el trabajo de pensar él mismo", "Su trabajo era más largo", "Eligió un tema más fácil"] }
              ]
            }
          ]
        }
    }
  },

  // ===================================================================
  // FRENCH
  // ===================================================================
  fr: {
    thankYou: { whatsNext: "En attendant", exploreDesc: "Explorez des cours gratuits et commencez à gagner des XP.", quizDesc: "Relevez un défi de quiz rapide et chronométré." },
    quizzesData: {
      python: {
        title: "Python pour les Enfants",
        subject: "Programmation",
        description: "Teste tes connaissances sur les bases de Python, les variables et les boucles !",
        questions: [
          { questionText: "Qu'est-ce que Python ?", options: ["Un type de serpent", "Un langage informatique", "Un jeu vidéo", "Une calculatrice"] },
          { questionText: "Quelle commande fait afficher du texte par l'ordinateur ?", options: ["show()", "speak()", "print()", "display()"] },
          { questionText: "Python est célèbre pour être :", options: ["Très difficile à lire", "Réservé aux scientifiques", "Facile à lire pour les humains", "Seulement pour les vieux ordinateurs"] },
          { questionText: "Qu'est-ce qu'une variable ?", options: ["Une boîte étiquetée pour stocker des données", "Un type d'erreur", "Un problème de maths", "Une imprimante"] },
          { questionText: "Comment appelle-t-on un texte comme 'Bonjour' en programmation ?", options: ["Entier", "Chaîne (String)", "Nombre", "Texte de robot"] },
          { questionText: "Si score = 4 + 6, que contient la variable score ?", options: ["46", "4 + 6", "10", "Erreur"] },
          { questionText: "Que permettent de faire les 'instructions if' à un programme ?", options: ["Planter", "Prendre des décisions", "Afficher du texte", "Stocker des variables"] },
          { questionText: "En code, que signifie le symbole '>' ?", options: ["Égal à", "Inférieur à", "Supérieur à", "Plus"] },
          { questionText: "Laquelle est une instruction if correcte ?", options: ["if score is 10 then win", "if score > 10:", "score if 10", "if (10) score"] },
          { questionText: "Quelle commande permet à l'utilisateur de saisir une réponse ?", options: ["print()", "type()", "input()", "read()"] },
          { questionText: "Pourquoi utilise-t-on une boucle dans un jeu ?", options: ["Pour le rendre coloré", "Pour laisser le joueur deviner plusieurs fois", "Pour arrêter le jeu", "Pour le rendre plus difficile"] },
          { questionText: "Si le secret est 5 et que tu devines 8, le programme devrait dire :", options: ["Trop bas !", "Trop haut !", "Tu as gagné !", "Erreur"] },
          { questionText: "Quelle émission de télé a inspiré le nom de Python ?", options: ["Python Rangers", "Monty Python's Flying Circus", "The Daily Python", "Snake TV"] },
          { questionText: "Quel type de donnée est un nombre entier comme 5 ?", options: ["Chaîne (String)", "Entier (Integer)", "Décimal (Float)", "Booléen"] },
          { questionText: "Si Mario touche un Goomba, quel type d'instruction gère la perte d'une vie ?", options: ["Une instruction print", "Une instruction if", "Une boucle", "Une chaîne"] }
        ]
      },
      math: {
        title: "Magie des Maths",
        subject: "Mathématiques",
        description: "Teste tes compétences en séquences, géométrie et énigmes logiques.",
        questions: [
          { questionText: "Quel est le nombre suivant dans : 5, 10, 15, 20... ?", options: ["22", "25", "30", "100"] },
          { questionText: "Quel est le nombre suivant dans : 1, 3, 5, 7... ?", options: ["8", "9", "10", "11"] },
          { questionText: "Comment appelle-t-on une liste de nombres qui suit une règle ?", options: ["Un désordre", "Une séquence", "Une variable", "Une boucle"] },
          { questionText: "Combien de côtés a un hexagone ?", options: ["4", "5", "6", "8"] },
          { questionText: "Comment appelle-t-on un carré en 3D ?", options: ["Sphère", "Cube", "Pyramide", "Cylindre"] },
          { questionText: "Quel type d'angle mesure exactement 90 degrés ?", options: ["Angle mignon", "Angle droit", "Angle faux", "Angle gauche"] },
          { questionText: "Si A est plus grand que B, et B plus grand que C. Qui est le plus grand ?", options: ["A", "B", "C", "Ils sont égaux"] },
          { questionText: "J'ai 4 pieds mais je ne peux pas marcher. Que suis-je ?", options: ["Un chien", "Une chaise", "Un oiseau", "Un serpent"] },
          { questionText: "Qu'est-ce que le raisonnement déductif ?", options: ["Deviner au hasard", "Utiliser des indices pour éliminer les mauvaises réponses", "Additionner des nombres", "Dessiner des formes"] },
          { questionText: "Qu'est-ce qu'un algorithme ?", options: ["Une erreur mathématique", "Un type de dinosaure", "Une liste d'instructions étape par étape", "Une forme 3D"] },
          { questionText: "Pourquoi l'ordre des étapes est-il important dans un algorithme ?", options: ["Ça n'a pas d'importance", "Pour que l'ordinateur ne s'embrouille pas et n'échoue pas", "Parce que c'est joli", "Pour économiser de l'électricité"] },
          { questionText: "Quelle est la meilleure façon de résoudre un problème énorme et difficile ?", options: ["Pleurer", "Le diviser en petites étapes faciles", "Deviner", "Abandonner"] },
          { questionText: "La suite de Fibonacci se trouve dans :", options: ["Seulement les manuels", "Les graines de tournesol et les galaxies", "Seulement les ordinateurs", "Nulle part"] },
          { questionText: "Si tu as un triangle, combien d'angles a-t-il ?", options: ["2", "3", "4", "5"] },
          { questionText: "Quelle entreprise utilise des algorithmes pour te trouver des sites web ?", options: ["Nintendo", "Google", "McDonald's", "Ford"] }
        ]
      },
      finance: {
        title: "Argent Malin",
        subject: "Finance",
        description: "Budget, investissement et histoire de l'argent.",
        questions: [
          { questionText: "Qu'est-ce que le troc ?", options: ["Utiliser des cartes de crédit", "Échanger des biens directement", "Investir en bourse", "Épargner à la banque"] },
          { questionText: "Pourquoi l'argent a-t-il été inventé ?", options: ["Parce que les pièces brillent", "Pour faciliter les échanges", "Pour alourdir les portefeuilles", "Parce que les poules se sont enfuies"] },
          { questionText: "L'argent ne fonctionne que si...", options: ["Il est fait d'or", "Il est imprimé sur du papier vert", "Tout le monde s'accorde sur sa valeur", "Il a le visage d'un président"] },
          { questionText: "L'argent qui ENTRE dans ta poche s'appelle :", options: ["Dépense", "Revenu", "Impôt", "Dette"] },
          { questionText: "L'argent qui SORT (quand tu achètes) s'appelle :", options: ["Dépense", "Revenu", "Bénéfice", "Dividende"] },
          { questionText: "Un bon budget garantit que...", options: ["Tu dépenses tout", "Tes dépenses sont supérieures à tes revenus", "Tes dépenses sont inférieures à tes revenus", "Tu achètes des jouets tous les jours"] },
          { questionText: "Quand une banque te paie pour garder ton argent, cela s'appelle :", options: ["Impôts", "Intérêt", "Amendes", "Prêts"] },
          { questionText: "Qu'est-ce que l'intérêt composé ?", options: ["Gagner des intérêts sur les intérêts", "Perdre de l'argent", "Payer la banque", "Intérêt simple"] },
          { questionText: "L'intérêt composé fonctionne le mieux quand tu...", options: ["Retires ton argent immédiatement", "Laisses ton argent à la banque longtemps", "Dépenses tout", "Le caches sous le lit"] },
          { questionText: "Quand tu achètes une action, qu'achètes-tu ?", options: ["Un bout de papier", "Une petite part d'une entreprise", "Un prêt au gouvernement", "Un produit"] },
          { questionText: "Le but d'investir est de...", options: ["Faire fructifier ton argent", "Perdre de l'argent", "Le garder exactement pareil", "Payer des impôts"] },
          { questionText: "Investir est-il risqué ?", options: ["Non, c'est garanti", "Oui, les entreprises peuvent perdre de la valeur", "Seulement pour les personnes âgées", "Non, tu gagnes toujours"] },
          { questionText: "La règle d'or pour bâtir sa richesse est :", options: ["Toujours dépenser moins que ce que tu gagnes", "Dépenser tout ce que tu as", "Emprunter le plus possible", "Ne jamais utiliser de banque"] },
          { questionText: "Qu'est-ce qu'un budget ?", options: ["Un type d'animal", "Un plan pour ton argent", "Un type de compte bancaire", "Un prêt"] },
          { questionText: "Si tu achètes des actions Disney, tu possèdes :", options: ["Toute l'entreprise", "Une petite part de Disney", "Tous leurs films", "Rien"] }
        ]
      },
      marketing: {
        title: "Créateurs du Futur",
        subject: "Marketing",
        description: "Image de marque, storytelling et sécurité numérique pour les créateurs.",
        questions: [
          { questionText: "Qu'est-ce qu'une marque ?", options: ["Juste un logo", "Le ressenti et la réputation d'une entreprise", "Le bâtiment où ils travaillent", "Le nom du PDG"] },
          { questionText: "Pourquoi les entreprises utilisent-elles des couleurs spécifiques ?", options: ["Parce qu'elles sont bon marché", "Pour déclencher des émotions précises", "Parce que c'est aléatoire", "Pour cacher la saleté"] },
          { questionText: "Lequel fait partie de l'identité d'une marque ?", options: ["Logos, couleurs et polices", "Salaires des employés", "Les chaises de bureau", "Les déclarations d'impôts"] },
          { questionText: "En marketing, qui doit être le Héros de l'histoire ?", options: ["Le PDG", "Le produit", "Le client", "Le concurrent"] },
          { questionText: "Pourquoi utilise-t-on le storytelling en marketing ?", options: ["Pour endormir les gens", "Pour créer un lien émotionnel", "Pour remplir de l'espace", "Pour embrouiller les gens"] },
          { questionText: "Une bonne histoire doit accrocher le spectateur dans les premières...", options: ["3 secondes", "3 minutes", "1 heure", "3 jours"] },
          { questionText: "Qu'est-ce que ton empreinte numérique ?", options: ["Ta pointure", "La trace de données que tu laisses en ligne", "L'encre de ton imprimante", "L'écran de ton ordinateur"] },
          { questionText: "Lequel est une donnée personnelle (PII) à ne JAMAIS partager ?", options: ["Ton film préféré", "Ton adresse de domicile", "Un dessin", "Un avis sur un jeu"] },
          { questionText: "Peut-on facilement supprimer des choses pour toujours d'internet ?", options: ["Oui, instantanément", "Non, les gens peuvent faire des captures et les garder", "Oui, en demandant gentiment", "Oui, en éteignant l'ordinateur"] },
          { questionText: "Que signifie CTA ?", options: ["Appel à l'action (Call To Action)", "Alignement central du texte", "Coût de la publicité", "Cliquer pour ajouter"] },
          { questionText: "Quel est un exemple de CTA ?", options: ["'Nous vendons des chaussures.'", "'Abonne-toi pour plus de vidéos !'", "'Les pommes sont rouges.'", "'Bonjour.'"] },
          { questionText: "Avant de lancer une campagne, tu dois connaître ton...", options: ["Couleur préférée", "Public cible", "Pointure", "Commande du déjeuner"] },
          { questionText: "Quelles couleurs McDonald's utilise-t-il pour te rendre heureux et affamé ?", options: ["Bleu et vert", "Rouge et jaune", "Noir et blanc", "Violet et orange"] },
          { questionText: "Dans une histoire de marketing, le produit doit jouer le rôle de :", options: ["Héros", "Méchant", "Guide", "Arrière-plan"] },
          { questionText: "Quelle est la meilleure façon de pratiquer la citoyenneté numérique ?", options: ["Être impoli dans les commentaires", "Respecter les autres et créditer les sources", "Voler des œuvres d'art", "Partager des mots de passe"] }
        ]
      },
      web: {
        title: "Merveilles du Web",
        subject: "Science",
        description: "Teste tes compétences en HTML, CSS et mise en page.",
        questions: [
          { questionText: "Que fournit le HTML à une page web ?", options: ["Les couleurs", "Les animations", "La structure de base (squelette)", "La base de données"] },
          { questionText: "Quelle balise est utilisée pour le plus grand titre ?", options: ["<p>", "<h1>", "<h6>", "<div>"] },
          { questionText: "Quelle balise est utilisée pour un paragraphe de texte ?", options: ["<text>", "<p>", "<para>", "<h>"] },
          { questionText: "Que fait le CSS ?", options: ["Construit la structure", "Met en forme la page avec couleurs et mises en page", "Stocke les mots de passe", "Fait tourner le serveur"] },
          { questionText: "Comment rendre le texte rouge en CSS ?", options: ["text: red;", "color: red;", "font-color: red;", "make-red;"] },
          { questionText: "Le CSS peut-il changer la police de ton texte ?", options: ["Oui", "Non", "Seulement le mardi", "Seulement si c'est bleu"] },
          { questionText: "Dans le modèle de boîte CSS, comment s'appelle l'espace À L'INTÉRIEUR de la bordure ?", options: ["Marge (Margin)", "Remplissage (Padding)", "Contenu (Content)", "Contour (Outline)"] },
          { questionText: "Comment s'appelle l'espace À L'EXTÉRIEUR de la bordure ?", options: ["Marge (Margin)", "Remplissage (Padding)", "Contenu (Content)", "Contour (Outline)"] },
          { questionText: "Les images rondes sont-elles en réalité des boîtes en CSS ?", options: ["Oui, tout est une boîte", "Non, les cercles sont des cercles", "Non, ce sont des triangles", "Seulement si elles sont rouges"] },
          { questionText: "Qu'est-ce qu'un serveur ?", options: ["Un serveur de restaurant", "Un ordinateur qui reste en ligne pour héberger tes fichiers", "Un type de CSS", "Un ordinateur cassé"] },
          { questionText: "Que faut-il obtenir pour que les gens visitent ton site ?", options: ["Une URL", "Une clé USB", "Un mot de passe", "Un livre"] },
          { questionText: "Que signifie 'Déployer' (Deploying) ?", options: ["Supprimer ton code", "Mettre ton code sur un serveur en ligne pour que le monde le voie", "Écrire du HTML", "Jouer à un jeu"] },
          { questionText: "Qu'est-ce que le DOM ?", options: ["Document Object Model", "Direct Object Math", "Digital Outline Maker", "Dog On Moon"] },
          { questionText: "Pourquoi le HTML sémantique est-il important ?", options: ["Il rend le site coloré", "Il aide les utilisateurs aveugles et les moteurs de recherche", "Il raccourcit le code", "Ce n'est pas important"] },
          { questionText: "Quelle couche du modèle de boîte contient le texte réel ?", options: ["Marge (Margin)", "Bordure (Border)", "Remplissage (Padding)", "Contenu (Content)"] }
        ]
      },
      art: {
        title: "Art Numérique",
        subject: "Arts",
        description: "Calques, théorie des couleurs et outils de dessin.",
        questions: [
          { questionText: "À quoi ressemblent les calques en art numérique ?", options: ["Des rochers lourds", "Des feuilles de verre transparentes empilées", "Une seule feuille de papier", "Un pinceau"] },
          { questionText: "Pourquoi les artistes utilisent-ils des calques ?", options: ["Pour alourdir le fichier", "Pour colorier sans abîmer le croquis (non destructif)", "Pour casser l'ordinateur", "Pour dessiner plus lentement"] },
          { questionText: "Si tu effaces sur le Calque 2, cela efface-t-il le Calque 1 ?", options: ["Oui", "Non", "Seulement si c'est rouge", "Toujours"] },
          { questionText: "Les couleurs opposées sur la roue chromatique s'appellent :", options: ["Analogues", "Complémentaires", "Primaires", "Ennuyeuses"] },
          { questionText: "Quel est un exemple de couleurs complémentaires ?", options: ["Rouge et rose", "Bleu et orange", "Vert et vert", "Noir et blanc"] },
          { questionText: "Que créent les couleurs complémentaires ?", options: ["De l'ennui", "Un contraste et une intensité maximum", "Un fouillis gris", "L'invisibilité"] },
          { questionText: "Qu'est-ce que la règle des tiers ?", options: ["Diviser la toile en une grille de 3x3", "Dessiner 3 cercles", "Utiliser seulement 3 couleurs", "Prendre 3 heures pour dessiner"] },
          { questionText: "Où placer ton sujet principal pour une composition cinématographique ?", options: ["En plein centre", "Hors de la toile", "Aux intersections de la grille", "Toujours dans le coin inférieur"] },
          { questionText: "Le centre exact est-il toujours le meilleur endroit pour un personnage ?", options: ["Oui", "Non, la règle des tiers est souvent meilleure", "Toujours", "Seulement le lundi"] },
          { questionText: "Qu'est-ce que le rendu (rendering) ?", options: ["Ajouter lumière et ombre pour un effet 3D", "Effacer le dessin", "Ajouter une signature", "Enregistrer le fichier"] },
          { questionText: "La partie de l'objet face au soleil reçoit un :", options: ["Ombre", "Reflet (Highlight)", "Contour", "Signature"] },
          { questionText: "La partie opposée à la lumière reçoit une :", options: ["Reflet (Highlight)", "Ombre", "Couleur vive", "Point blanc"] },
          { questionText: "En dessinant un personnage, que faut-il dessiner en premier ?", options: ["Des yeux détaillés", "Des formes 3D de base comme des sphères et cylindres", "L'arrière-plan", "Les cheveux"] },
          { questionText: "Que signifie 'valeur' en théorie des couleurs ?", options: ["Le prix d'une peinture", "À quel point une couleur est claire ou foncée", "Combien de couleurs tu utilises", "La taille du pinceau"] },
          { questionText: "Où se produit l'『occlusion ambiante』 ?", options: ["En plein soleil", "Dans les creux profonds où la lumière n'atteint pas", "Dans le ciel", "Sur le reflet"] }
        ]
      }
    }
  },

  // ===================================================================
  // GERMAN
  // ===================================================================
  de: {
    thankYou: { whatsNext: "In der Zwischenzeit", exploreDesc: "Entdecke kostenlose Kurse und sammle XP.", quizDesc: "Stell dich einer kurzen Quiz-Challenge auf Zeit." },
    quizzesData: {
      python: {
        title: "Python für Kinder",
        subject: "Programmierung",
        description: "Teste dein Wissen über Python-Grundlagen, Variablen und Schleifen!",
        questions: [
          { questionText: "Was ist Python?", options: ["Eine Schlangenart", "Eine Computersprache", "Ein Videospiel", "Ein Taschenrechner"] },
          { questionText: "Welcher Befehl lässt den Computer Text anzeigen?", options: ["show()", "speak()", "print()", "display()"] },
          { questionText: "Python ist bekannt dafür, dass es:", options: ["Sehr schwer zu lesen ist", "Nur für Wissenschaftler ist", "Leicht für Menschen zu lesen ist", "Nur für alte Computer ist"] },
          { questionText: "Was ist eine Variable?", options: ["Eine beschriftete Box zum Speichern von Daten", "Eine Art Fehler", "Eine Matheaufgabe", "Ein Drucker"] },
          { questionText: "Wie nennt man Text wie 'Hallo' in der Programmierung?", options: ["Ganzzahl", "Zeichenkette (String)", "Zahl", "Robotertext"] },
          { questionText: "Wenn score = 4 + 6, was steht in der Variable score?", options: ["46", "4 + 6", "10", "Fehler"] },
          { questionText: "Was ermöglichen 'if-Anweisungen' einem Programm?", options: ["Abstürzen", "Entscheidungen treffen", "Text anzeigen", "Variablen speichern"] },
          { questionText: "Was bedeutet das Symbol '>' im Code?", options: ["Gleich", "Kleiner als", "Größer als", "Plus"] },
          { questionText: "Welche davon ist eine korrekte if-Anweisung?", options: ["if score is 10 then win", "if score > 10:", "score if 10", "if (10) score"] },
          { questionText: "Welcher Befehl lässt den Nutzer eine Antwort eingeben?", options: ["print()", "type()", "input()", "read()"] },
          { questionText: "Warum benutzen wir eine Schleife in einem Spiel?", options: ["Um es bunt zu machen", "Damit der Spieler mehrmals raten kann", "Um das Spiel zu stoppen", "Um es schwerer zu machen"] },
          { questionText: "Wenn das Geheimnis 5 ist und du 8 rätst, sollte das Programm sagen:", options: ["Zu niedrig!", "Zu hoch!", "Gewonnen!", "Fehler"] },
          { questionText: "Nach welcher TV-Show wurde Python benannt?", options: ["Python Rangers", "Monty Python's Flying Circus", "The Daily Python", "Snake TV"] },
          { questionText: "Welcher Datentyp ist eine ganze Zahl wie 5?", options: ["Zeichenkette (String)", "Ganzzahl (Integer)", "Kommazahl (Float)", "Boolescher Wert"] },
          { questionText: "Wenn Mario einen Goomba trifft, welche Anweisung behandelt den Verlust eines Lebens?", options: ["Eine print-Anweisung", "Eine if-Anweisung", "Eine Schleife", "Eine Zeichenkette"] }
        ]
      },
      math: {
        title: "Mathe-Magie",
        subject: "Mathematik",
        description: "Teste deine Fähigkeiten in Zahlenfolgen, Geometrie und Logikrätseln.",
        questions: [
          { questionText: "Was ist die nächste Zahl in: 5, 10, 15, 20...?", options: ["22", "25", "30", "100"] },
          { questionText: "Was ist die nächste Zahl in: 1, 3, 5, 7...?", options: ["8", "9", "10", "11"] },
          { questionText: "Wie nennt man eine Liste von Zahlen, die einer Regel folgt?", options: ["Ein Durcheinander", "Eine Folge (Sequenz)", "Eine Variable", "Eine Schleife"] },
          { questionText: "Wie viele Seiten hat ein Sechseck?", options: ["4", "5", "6", "8"] },
          { questionText: "Wie nennt man ein 3D-Quadrat?", options: ["Kugel", "Würfel", "Pyramide", "Zylinder"] },
          { questionText: "Welcher Winkel ist genau 90 Grad?", options: ["Süßer Winkel", "Rechter Winkel", "Falscher Winkel", "Linker Winkel"] },
          { questionText: "Wenn A größer als B ist und B größer als C. Wer ist am größten?", options: ["A", "B", "C", "Sie sind gleich"] },
          { questionText: "Ich habe 4 Beine, kann aber nicht laufen. Was bin ich?", options: ["Ein Hund", "Ein Stuhl", "Ein Vogel", "Eine Schlange"] },
          { questionText: "Was ist deduktives Denken?", options: ["Wildes Raten", "Hinweise nutzen, um falsche Antworten auszuschließen", "Zahlen addieren", "Formen zeichnen"] },
          { questionText: "Was ist ein Algorithmus?", options: ["Ein Mathefehler", "Eine Dinosaurierart", "Eine Schritt-für-Schritt-Liste von Anweisungen", "Eine 3D-Form"] },
          { questionText: "Warum ist die Reihenfolge der Schritte in einem Algorithmus wichtig?", options: ["Ist sie nicht", "Damit der Computer nicht durcheinanderkommt und versagt", "Weil es hübsch aussieht", "Um Strom zu sparen"] },
          { questionText: "Was ist der beste Weg, ein riesiges, schweres Problem zu lösen?", options: ["Weinen", "Es in winzige, einfache Schritte zerlegen", "Raten", "Aufgeben"] },
          { questionText: "Die Fibonacci-Folge findet man in:", options: ["Nur in Lehrbüchern", "Sonnenblumenkernen und Galaxien", "Nur in Computern", "Nirgendwo"] },
          { questionText: "Wenn du ein Dreieck hast, wie viele Winkel hat es?", options: ["2", "3", "4", "5"] },
          { questionText: "Welches Unternehmen nutzt Algorithmen, um Webseiten für dich zu finden?", options: ["Nintendo", "Google", "McDonald's", "Ford"] }
        ]
      },
      finance: {
        title: "Clever mit Geld",
        subject: "Finanzen",
        description: "Budgetierung, Investieren und die Geschichte des Geldes.",
        questions: [
          { questionText: "Was ist Tauschhandel?", options: ["Kreditkarten benutzen", "Waren direkt tauschen", "In Aktien investieren", "Bei einer Bank sparen"] },
          { questionText: "Warum wurde Geld erfunden?", options: ["Weil Münzen glänzen", "Um den Handel zu erleichtern", "Um Geldbörsen schwer zu machen", "Weil die Hühner weggelaufen sind"] },
          { questionText: "Geld funktioniert nur, wenn...", options: ["Es aus Gold ist", "Es auf grünem Papier gedruckt ist", "Alle sich einig sind, dass es Wert hat", "Es das Gesicht eines Präsidenten hat"] },
          { questionText: "Geld, das in deine Tasche HEREINKOMMT, nennt man:", options: ["Ausgabe", "Einkommen", "Steuer", "Schulden"] },
          { questionText: "Geld, das HINAUSGEHT (wenn du etwas kaufst), nennt man:", options: ["Ausgabe", "Einkommen", "Gewinn", "Dividende"] },
          { questionText: "Ein gutes Budget stellt sicher, dass...", options: ["Du alles ausgibst", "Deine Ausgaben höher als dein Einkommen sind", "Deine Ausgaben niedriger als dein Einkommen sind", "Du jeden Tag Spielzeug kaufst"] },
          { questionText: "Wenn eine Bank dich dafür bezahlt, dass du Geld bei ihr lässt, nennt man das:", options: ["Steuern", "Zinsen", "Bußgelder", "Kredite"] },
          { questionText: "Was ist Zinseszins?", options: ["Zinsen auf Zinsen verdienen", "Geld verlieren", "Die Bank bezahlen", "Einfacher Zins"] },
          { questionText: "Zinseszins funktioniert am besten, wenn du...", options: ["Dein Geld sofort abhebst", "Dein Geld lange in der Bank lässt", "Alles ausgibst", "Es unter dem Bett versteckst"] },
          { questionText: "Wenn du eine Aktie kaufst, was kaufst du?", options: ["Ein Stück Papier", "Einen winzigen Teil eines Unternehmens", "Einen Kredit an den Staat", "Ein Produkt"] },
          { questionText: "Das Ziel des Investierens ist es,...", options: ["Dein Geld wachsen zu lassen", "Geld zu verlieren", "Es genau gleich zu halten", "Steuern zu zahlen"] },
          { questionText: "Ist Investieren riskant?", options: ["Nein, es ist garantiert", "Ja, Unternehmen können an Wert verlieren", "Nur für alte Leute", "Nein, du gewinnst immer"] },
          { questionText: "Die goldene Regel zum Vermögensaufbau lautet:", options: ["Immer weniger ausgeben, als du verdienst", "Alles ausgeben, was du hast", "So viel wie möglich leihen", "Nie eine Bank benutzen"] },
          { questionText: "Was ist ein Budget?", options: ["Eine Tierart", "Ein Plan für dein Geld", "Eine Art Bankkonto", "Ein Kredit"] },
          { questionText: "Wenn du Disney-Aktien kaufst, besitzt du:", options: ["Das ganze Unternehmen", "Einen winzigen Teil von Disney", "Alle ihre Filme", "Nichts"] }
        ]
      },
      marketing: {
        title: "Zukünftige Kreative",
        subject: "Marketing",
        description: "Markenbildung, Storytelling und digitale Sicherheit für Kreative.",
        questions: [
          { questionText: "Was ist eine Marke?", options: ["Nur ein Logo", "Das Gefühl und der Ruf eines Unternehmens", "Das Gebäude, in dem sie arbeiten", "Der Name des Chefs"] },
          { questionText: "Warum verwenden Unternehmen bestimmte Farben?", options: ["Weil sie billig sind", "Um bestimmte Emotionen auszulösen", "Weil es zufällig ist", "Um Schmutz zu verstecken"] },
          { questionText: "Welches davon gehört zur Identität einer Marke?", options: ["Logos, Farben und Schriftarten", "Gehälter der Mitarbeiter", "Die Bürostühle", "Steuererklärungen"] },
          { questionText: "Wer sollte im Marketing der Held der Geschichte sein?", options: ["Der Chef", "Das Produkt", "Der Kunde", "Der Konkurrent"] },
          { questionText: "Warum nutzen wir Storytelling im Marketing?", options: ["Um Leute einzuschläfern", "Um eine emotionale Verbindung aufzubauen", "Um Platz zu füllen", "Um Leute zu verwirren"] },
          { questionText: "Eine gute Geschichte muss den Zuschauer in den ersten... fesseln", options: ["3 Sekunden", "3 Minuten", "1 Stunde", "3 Tagen"] },
          { questionText: "Was ist dein digitaler Fußabdruck?", options: ["Deine Schuhgröße", "Die Datenspur, die du online hinterlässt", "Deine Druckertinte", "Dein Computerbildschirm"] },
          { questionText: "Welches davon ist eine persönliche Info (PII), die man NIEMALS teilen sollte?", options: ["Dein Lieblingsfilm", "Deine Wohnadresse", "Eine Zeichnung", "Eine Spielrezension"] },
          { questionText: "Kann man Dinge leicht für immer aus dem Internet löschen?", options: ["Ja, sofort", "Nein, Leute können Screenshots machen und speichern", "Ja, durch höfliches Fragen", "Ja, wenn man den Computer ausschaltet"] },
          { questionText: "Wofür steht CTA?", options: ["Handlungsaufruf (Call To Action)", "Zentrale Textausrichtung", "Werbekosten", "Klicken zum Hinzufügen"] },
          { questionText: "Was ist ein Beispiel für einen CTA?", options: ["'Wir verkaufen Schuhe.'", "'Abonniere für mehr Videos!'", "'Äpfel sind rot.'", "'Hallo.'"] },
          { questionText: "Bevor du eine Kampagne startest, musst du deine... kennen", options: ["Lieblingsfarbe", "Zielgruppe", "Schuhgröße", "Mittagsbestellung"] },
          { questionText: "Welche Farben nutzt McDonald's, um dich glücklich und hungrig zu machen?", options: ["Blau und Grün", "Rot und Gelb", "Schwarz und Weiß", "Lila und Orange"] },
          { questionText: "In einer Marketing-Geschichte sollte das Produkt die Rolle des... spielen", options: ["Helden", "Bösewichts", "Ratgebers", "Hintergrunds"] },
          { questionText: "Was ist der beste Weg, digitale Bürgerschaft zu praktizieren?", options: ["Unhöflich in Kommentaren sein", "Andere respektieren und Quellen nennen", "Kunst stehlen", "Passwörter teilen"] }
        ]
      },
      web: {
        title: "Web-Wunder",
        subject: "Wissenschaft",
        description: "Teste deine HTML-, CSS- und Layout-Fähigkeiten.",
        questions: [
          { questionText: "Was liefert HTML für eine Webseite?", options: ["Farben", "Animationen", "Die Grundstruktur (Skelett)", "Die Datenbank"] },
          { questionText: "Welches Tag wird für die größte Überschrift verwendet?", options: ["<p>", "<h1>", "<h6>", "<div>"] },
          { questionText: "Welches Tag wird für einen Textabsatz verwendet?", options: ["<text>", "<p>", "<para>", "<h>"] },
          { questionText: "Was macht CSS?", options: ["Baut die Struktur", "Gestaltet die Webseite mit Farben und Layouts", "Speichert Passwörter", "Betreibt den Server"] },
          { questionText: "Wie würdest du Text in CSS rot machen?", options: ["text: red;", "color: red;", "font-color: red;", "make-red;"] },
          { questionText: "Kann CSS die Schriftart deines Textes ändern?", options: ["Ja", "Nein", "Nur dienstags", "Nur wenn er blau ist"] },
          { questionText: "Wie heißt im CSS-Boxmodell der Raum INNERHALB des Rahmens?", options: ["Außenabstand (Margin)", "Innenabstand (Padding)", "Inhalt (Content)", "Umriss (Outline)"] },
          { questionText: "Wie heißt der Raum AUSSERHALB des Rahmens?", options: ["Außenabstand (Margin)", "Innenabstand (Padding)", "Inhalt (Content)", "Umriss (Outline)"] },
          { questionText: "Sind runde Bilder in CSS eigentlich Boxen?", options: ["Ja, alles ist eine Box", "Nein, Kreise sind Kreise", "Nein, es sind Dreiecke", "Nur wenn sie rot sind"] },
          { questionText: "Was ist ein Server?", options: ["Ein Kellner", "Ein Computer, der online bleibt, um deine Dateien zu hosten", "Eine Art CSS", "Ein kaputter Computer"] },
          { questionText: "Was brauchst du, damit Leute deine Seite besuchen können?", options: ["Eine URL", "Einen USB-Stick", "Ein Passwort", "Ein Buch"] },
          { questionText: "Was bedeutet 'Deployen' (Deploying)?", options: ["Deinen Code löschen", "Deinen Code auf einen Live-Server stellen, damit die Welt ihn sieht", "HTML schreiben", "Ein Spiel spielen"] },
          { questionText: "Was ist das DOM?", options: ["Document Object Model", "Direct Object Math", "Digital Outline Maker", "Dog On Moon"] },
          { questionText: "Warum ist semantisches HTML wichtig?", options: ["Es macht die Seite bunt", "Es hilft blinden Nutzern und Suchmaschinen", "Es macht den Code kürzer", "Es ist nicht wichtig"] },
          { questionText: "Welche Schicht des Boxmodells enthält den eigentlichen Text?", options: ["Außenabstand (Margin)", "Rahmen (Border)", "Innenabstand (Padding)", "Inhalt (Content)"] }
        ]
      },
      art: {
        title: "Digitale Kunst",
        subject: "Kunst",
        description: "Ebenen, Farbtheorie und Zeichenwerkzeuge.",
        questions: [
          { questionText: "Womit sind Ebenen in der digitalen Kunst vergleichbar?", options: ["Schwere Steine", "Klare Glasscheiben, übereinander gestapelt", "Ein einzelnes Blatt Papier", "Ein Pinsel"] },
          { questionText: "Warum benutzen Künstler Ebenen?", options: ["Um die Datei schwer zu machen", "Um zu colorieren, ohne die Skizze zu ruinieren (nicht-destruktiv)", "Um den Computer kaputt zu machen", "Um langsamer zu zeichnen"] },
          { questionText: "Wenn du auf Ebene 2 radierst, löscht das Ebene 1?", options: ["Ja", "Nein", "Nur wenn sie rot ist", "Immer"] },
          { questionText: "Farben, die sich auf dem Farbkreis gegenüberliegen, nennt man:", options: ["Analog", "Komplementär", "Primär", "Langweilig"] },
          { questionText: "Was ist ein Beispiel für Komplementärfarben?", options: ["Rot und Rosa", "Blau und Orange", "Grün und Grün", "Schwarz und Weiß"] },
          { questionText: "Was erzeugen Komplementärfarben?", options: ["Langeweile", "Maximalen Kontrast und Spannung", "Ein graues Chaos", "Unsichtbarkeit"] },
          { questionText: "Was ist die Drittel-Regel?", options: ["Die Leinwand in ein 3x3-Raster teilen", "3 Kreise zeichnen", "Nur 3 Farben benutzen", "3 Stunden zum Zeichnen brauchen"] },
          { questionText: "Wo solltest du dein Hauptmotiv für eine filmische Komposition platzieren?", options: ["Genau in der Mitte", "Außerhalb der Leinwand", "An den Rasterschnittpunkten", "Immer in der unteren Ecke"] },
          { questionText: "Ist die exakte Mitte immer der beste Platz für eine Figur?", options: ["Ja", "Nein, die Drittel-Regel ist meist besser", "Immer", "Nur montags"] },
          { questionText: "Was ist Rendering?", options: ["Licht und Schatten hinzufügen, damit es 3D aussieht", "Die Zeichnung löschen", "Eine Signatur hinzufügen", "Die Datei speichern"] },
          { questionText: "Der Teil des Objekts, der zur Sonne zeigt, bekommt ein:", options: ["Schatten", "Glanzlicht (Highlight)", "Umriss", "Signatur"] },
          { questionText: "Der Teil, der vom Licht abgewandt ist, bekommt einen:", options: ["Glanzlicht (Highlight)", "Schatten", "Helle Farbe", "Weißen Punkt"] },
          { questionText: "Was solltest du beim Zeichnen einer Figur zuerst zeichnen?", options: ["Detaillierte Augen", "Grundlegende 3D-Formen wie Kugeln und Zylinder", "Den Hintergrund", "Die Haare"] },
          { questionText: "Was bedeutet 'Wert' (Value) in der Farbtheorie?", options: ["Wie viel ein Gemälde kostet", "Wie hell oder dunkel eine Farbe ist", "Wie viele Farben du benutzt", "Wie groß der Pinsel ist"] },
          { questionText: "Wo tritt 'Ambient Occlusion' auf?", options: ["Im direkten Sonnenlicht", "In tiefen Spalten, wo das Licht nicht hinkommt", "Am Himmel", "Auf dem Glanzlicht"] }
        ]
      }
    }
  },

  // ===================================================================
  // ARABIC (RTL)
  // ===================================================================
  ar: {
    thankYou: { whatsNext: "بينما تنتظر", exploreDesc: "استكشف الدورات المجانية وابدأ بكسب نقاط الخبرة.", quizDesc: "خُض تحدي اختبار سريع ومحدد بوقت." },
    quizzesData: {
      python: {
        title: "بايثون للأطفال",
        subject: "البرمجة",
        description: "اختبر معرفتك بأساسيات بايثون والمتغيرات والحلقات!",
        questions: [
          { questionText: "ما هي لغة بايثون؟", options: ["نوع من الثعابين", "لغة حاسوب", "لعبة فيديو", "آلة حاسبة"] },
          { questionText: "أي أمر يجعل الحاسوب يعرض نصًا؟", options: ["show()", "speak()", "print()", "display()"] },
          { questionText: "بايثون مشهورة بأنها:", options: ["صعبة القراءة جدًا", "للعلماء فقط", "سهلة القراءة للبشر", "لأجهزة الحاسوب القديمة فقط"] },
          { questionText: "ما هو المتغير؟", options: ["صندوق موسوم لتخزين البيانات", "نوع من الأخطاء", "مسألة رياضية", "طابعة"] },
          { questionText: "ماذا نسمّي نصًا مثل 'مرحبا' في البرمجة؟", options: ["عدد صحيح", "سلسلة نصية (String)", "رقم", "نص الروبوت"] },
          { questionText: "إذا كان score = 4 + 6، فماذا يوجد داخل المتغير score؟", options: ["46", "4 + 6", "10", "خطأ"] },
          { questionText: "ماذا تتيح 'جمل if' للبرنامج أن يفعل؟", options: ["الانهيار", "اتخاذ القرارات", "طباعة النص", "تخزين المتغيرات"] },
          { questionText: "في الكود، ماذا يعني الرمز '>'؟", options: ["يساوي", "أصغر من", "أكبر من", "زائد"] },
          { questionText: "أي من هذه جملة if صحيحة؟", options: ["if score is 10 then win", "if score > 10:", "score if 10", "if (10) score"] },
          { questionText: "أي أمر يسمح للمستخدم بكتابة إجابة؟", options: ["print()", "type()", "input()", "read()"] },
          { questionText: "لماذا نستخدم الحلقة (loop) في لعبة؟", options: ["لجعلها ملونة", "للسماح للاعب بالتخمين عدة مرات", "لإيقاف اللعبة", "لجعلها أصعب"] },
          { questionText: "إذا كان الرقم السري 5 وخمّنت 8، يجب أن يقول البرنامج:", options: ["منخفض جدًا!", "مرتفع جدًا!", "لقد فزت!", "خطأ"] },
          { questionText: "على اسم أي برنامج تلفزيوني سُمّيت بايثون؟", options: ["Python Rangers", "Monty Python's Flying Circus", "The Daily Python", "Snake TV"] },
          { questionText: "ما نوع البيانات لرقم صحيح مثل 5؟", options: ["سلسلة نصية (String)", "عدد صحيح (Integer)", "عدد عشري (Float)", "قيمة منطقية"] },
          { questionText: "إذا اصطدم ماريو بعدو، أي نوع من الجمل يتعامل مع خسارته حياة؟", options: ["جملة print", "جملة if", "حلقة", "سلسلة نصية"] }
        ]
      },
      math: {
        title: "سحر الرياضيات",
        subject: "الرياضيات",
        description: "اختبر مهاراتك في المتتاليات والهندسة وألغاز المنطق.",
        questions: [
          { questionText: "ما الرقم التالي في: 5، 10، 15، 20...؟", options: ["22", "25", "30", "100"] },
          { questionText: "ما الرقم التالي في: 1، 3، 5، 7...؟", options: ["8", "9", "10", "11"] },
          { questionText: "ماذا نسمّي قائمة أرقام تتبع قاعدة؟", options: ["فوضى", "متتالية", "متغير", "حلقة"] },
          { questionText: "كم عدد أضلاع الشكل السداسي؟", options: ["4", "5", "6", "8"] },
          { questionText: "ماذا نسمّي المربع في ثلاثة أبعاد؟", options: ["كرة", "مكعب", "هرم", "أسطوانة"] },
          { questionText: "أي زاوية تساوي 90 درجة تمامًا؟", options: ["زاوية لطيفة", "زاوية قائمة", "زاوية خاطئة", "زاوية يسرى"] },
          { questionText: "إذا كان A أطول من B، وB أطول من C. من الأطول؟", options: ["A", "B", "C", "متساوون"] },
          { questionText: "لديّ 4 أرجل لكنني لا أستطيع المشي. ما أنا؟", options: ["كلب", "كرسي", "طائر", "ثعبان"] },
          { questionText: "ما هو الاستدلال الاستنتاجي؟", options: ["التخمين العشوائي", "استخدام الأدلة لاستبعاد الإجابات الخاطئة", "جمع الأرقام", "رسم الأشكال"] },
          { questionText: "ما هي الخوارزمية؟", options: ["خطأ رياضي", "نوع من الديناصورات", "قائمة تعليمات خطوة بخطوة", "شكل ثلاثي الأبعاد"] },
          { questionText: "لماذا يهمّ ترتيب الخطوات في الخوارزمية؟", options: ["لا يهمّ", "حتى لا يرتبك الحاسوب ويفشل", "لأنه يبدو جميلًا", "لتوفير الكهرباء"] },
          { questionText: "ما أفضل طريقة لحل مشكلة ضخمة وصعبة؟", options: ["البكاء", "تقسيمها إلى خطوات صغيرة وسهلة", "التخمين", "الاستسلام"] },
          { questionText: "توجد متتالية فيبوناتشي في:", options: ["الكتب المدرسية فقط", "بذور دوّار الشمس والمجرّات", "أجهزة الحاسوب فقط", "لا مكان"] },
          { questionText: "إذا كان لديك مثلث، كم عدد زواياه؟", options: ["2", "3", "4", "5"] },
          { questionText: "أي شركة تستخدم الخوارزميات لإيجاد المواقع لك؟", options: ["نينتندو", "جوجل", "ماكدونالدز", "فورد"] }
        ]
      },
      finance: {
        title: "ذكاء المال",
        subject: "المال والأعمال",
        description: "الميزانية والاستثمار وتاريخ المال.",
        questions: [
          { questionText: "ما هي المقايضة؟", options: ["استخدام بطاقات الائتمان", "تبادل السلع مباشرة", "الاستثمار في الأسهم", "الادخار في البنك"] },
          { questionText: "لماذا اختُرع المال؟", options: ["لأن العملات لامعة", "لتسهيل التجارة", "لجعل المحافظ ثقيلة", "لأن الدجاج هرب"] },
          { questionText: "لا يعمل المال إلا إذا...", options: ["كان مصنوعًا من الذهب", "طُبع على ورق أخضر", "اتفق الجميع على أن له قيمة", "حمل وجه رئيس"] },
          { questionText: "المال الذي يدخل إلى جيبك يُسمّى:", options: ["مصروف", "دخل", "ضريبة", "دَيْن"] },
          { questionText: "المال الذي يخرج (عندما تشتري شيئًا) يُسمّى:", options: ["مصروف", "دخل", "ربح", "توزيعات أرباح"] },
          { questionText: "الميزانية الجيدة تضمن أن...", options: ["تنفق كل شيء", "تكون مصروفاتك أعلى من دخلك", "تكون مصروفاتك أقل من دخلك", "تشتري ألعابًا كل يوم"] },
          { questionText: "عندما يدفع لك البنك مقابل حفظ أموالك لديه، يُسمّى ذلك:", options: ["ضرائب", "فائدة", "غرامات", "قروض"] },
          { questionText: "ما هي الفائدة المركبة؟", options: ["كسب فائدة على الفائدة", "خسارة المال", "الدفع للبنك", "فائدة بسيطة"] },
          { questionText: "تعمل الفائدة المركبة بشكل أفضل عندما...", options: ["تسحب أموالك فورًا", "تترك أموالك في البنك لفترة طويلة", "تنفقها كلها", "تخبئها تحت السرير"] },
          { questionText: "عندما تشتري سهمًا، ماذا تشتري؟", options: ["قطعة ورق", "جزءًا صغيرًا من شركة", "قرضًا للحكومة", "منتجًا"] },
          { questionText: "الهدف من الاستثمار هو...", options: ["تنمية أموالك", "خسارة المال", "إبقاؤها كما هي تمامًا", "دفع الضرائب"] },
          { questionText: "هل الاستثمار محفوف بالمخاطر؟", options: ["لا، إنه مضمون", "نعم، قد تفقد الشركات قيمتها", "لكبار السن فقط", "لا، تربح دائمًا"] },
          { questionText: "القاعدة الذهبية لبناء الثروة هي:", options: ["أنفق دائمًا أقل مما تكسب", "أنفق كل ما لديك", "اقترض أكبر قدر ممكن", "لا تستخدم البنك أبدًا"] },
          { questionText: "ما هي الميزانية؟", options: ["نوع من الحيوانات", "خطة لأموالك", "نوع من الحسابات البنكية", "قرض"] },
          { questionText: "إذا اشتريت أسهم ديزني، فأنت تملك:", options: ["الشركة بأكملها", "جزءًا صغيرًا من ديزني", "كل أفلامهم", "لا شيء"] }
        ]
      },
      marketing: {
        title: "صنّاع المستقبل",
        subject: "التسويق",
        description: "العلامة التجارية ورواية القصص والأمان الرقمي للمبدعين.",
        questions: [
          { questionText: "ما هي العلامة التجارية؟", options: ["مجرد شعار", "شعور وسمعة الشركة", "المبنى الذي يعملون فيه", "اسم المدير التنفيذي"] },
          { questionText: "لماذا تستخدم الشركات ألوانًا محددة؟", options: ["لأنها رخيصة", "لإثارة مشاعر محددة", "لأنه أمر عشوائي", "لإخفاء الأوساخ"] },
          { questionText: "أي مما يلي جزء من هوية العلامة التجارية؟", options: ["الشعارات والألوان والخطوط", "رواتب الموظفين", "كراسي المكتب", "الإقرارات الضريبية"] },
          { questionText: "في التسويق، من يجب أن يكون بطل القصة؟", options: ["المدير التنفيذي", "المنتج", "العميل", "المنافس"] },
          { questionText: "لماذا نستخدم رواية القصص في التسويق؟", options: ["لتنويم الناس", "لبناء رابط عاطفي", "لملء الفراغ", "لإرباك الناس"] },
          { questionText: "يجب أن تجذب القصة الجيدة المشاهد في أول...", options: ["3 ثوانٍ", "3 دقائق", "ساعة واحدة", "3 أيام"] },
          { questionText: "ما هي بصمتك الرقمية؟", options: ["مقاس حذائك", "أثر البيانات الذي تتركه على الإنترنت", "حبر طابعتك", "شاشة حاسوبك"] },
          { questionText: "أي مما يلي معلومة شخصية (PII) يجب ألا تشاركها أبدًا؟", options: ["فيلمك المفضل", "عنوان منزلك", "رسمة", "مراجعة لعبة"] },
          { questionText: "هل يمكن حذف الأشياء بسهولة إلى الأبد من الإنترنت؟", options: ["نعم، فورًا", "لا، يمكن للناس التقاط صورة وحفظها", "نعم، بالطلب بلطف", "نعم، بإطفاء الحاسوب"] },
          { questionText: "ماذا يعني CTA؟", options: ["دعوة لاتخاذ إجراء (Call To Action)", "محاذاة النص للوسط", "تكلفة الإعلان", "انقر للإضافة"] },
          { questionText: "ما مثال على CTA؟", options: ["'نبيع الأحذية.'", "'اشترك للمزيد من الفيديوهات!'", "'التفاح أحمر.'", "'مرحبا.'"] },
          { questionText: "قبل إطلاق حملة، تحتاج إلى معرفة...", options: ["لونك المفضل", "جمهورك المستهدف", "مقاس حذائك", "طلب غدائك"] },
          { questionText: "ما الألوان التي يستخدمها ماكدونالدز ليجعلك سعيدًا وجائعًا؟", options: ["الأزرق والأخضر", "الأحمر والأصفر", "الأسود والأبيض", "البنفسجي والبرتقالي"] },
          { questionText: "في قصة تسويقية، يجب أن يقوم المنتج بدور:", options: ["البطل", "الشرير", "المرشد", "الخلفية"] },
          { questionText: "ما أفضل طريقة لممارسة المواطنة الرقمية؟", options: ["أن تكون فظًا في التعليقات", "احترام الآخرين ونسب الفضل لأصحابه", "سرقة الأعمال الفنية", "مشاركة كلمات المرور"] }
        ]
      },
      web: {
        title: "عجائب الويب",
        subject: "العلوم",
        description: "اختبر مهاراتك في HTML وCSS والتخطيط.",
        questions: [
          { questionText: "ماذا يوفّر HTML لصفحة الويب؟", options: ["الألوان", "الرسوم المتحركة", "البنية الأساسية (الهيكل)", "قاعدة البيانات"] },
          { questionText: "أي وسم يُستخدم لأكبر عنوان؟", options: ["<p>", "<h1>", "<h6>", "<div>"] },
          { questionText: "أي وسم يُستخدم لفقرة نصية؟", options: ["<text>", "<p>", "<para>", "<h>"] },
          { questionText: "ماذا يفعل CSS؟", options: ["يبني البنية", "ينسّق الصفحة بالألوان والتخطيطات", "يخزّن كلمات المرور", "يشغّل الخادم"] },
          { questionText: "كيف تجعل النص أحمر في CSS؟", options: ["text: red;", "color: red;", "font-color: red;", "make-red;"] },
          { questionText: "هل يستطيع CSS تغيير خط نصك؟", options: ["نعم", "لا", "أيام الثلاثاء فقط", "فقط إذا كان أزرق"] },
          { questionText: "في نموذج الصندوق في CSS، ماذا يُسمّى الفراغ داخل الحدود؟", options: ["الهامش (Margin)", "الحشو (Padding)", "المحتوى (Content)", "المخطط (Outline)"] },
          { questionText: "ماذا يُسمّى الفراغ خارج الحدود؟", options: ["الهامش (Margin)", "الحشو (Padding)", "المحتوى (Content)", "المخطط (Outline)"] },
          { questionText: "هل الصور الدائرية هي في الحقيقة صناديق في CSS؟", options: ["نعم، كل شيء صندوق", "لا، الدوائر دوائر", "لا، إنها مثلثات", "فقط إذا كانت حمراء"] },
          { questionText: "ما هو الخادم (Server)؟", options: ["نادل", "حاسوب يبقى متصلاً لاستضافة ملفاتك", "نوع من CSS", "حاسوب معطّل"] },
          { questionText: "ماذا تحصل عليه ليتمكن الناس من زيارة موقعك؟", options: ["رابط (URL)", "ذاكرة USB", "كلمة مرور", "كتاب"] },
          { questionText: "ماذا يعني 'النشر' (Deploying)؟", options: ["حذف الكود", "وضع الكود على خادم مباشر ليراه العالم", "كتابة HTML", "لعب لعبة"] },
          { questionText: "ما هو DOM؟", options: ["Document Object Model", "Direct Object Math", "Digital Outline Maker", "Dog On Moon"] },
          { questionText: "لماذا HTML الدلالي (Semantic) مهم؟", options: ["يجعل الموقع ملونًا", "يساعد المستخدمين المكفوفين ومحركات البحث", "يجعل الكود أقصر", "ليس مهمًا"] },
          { questionText: "أي طبقة من نموذج الصندوق تحتوي على النص الفعلي؟", options: ["الهامش (Margin)", "الحدود (Border)", "الحشو (Padding)", "المحتوى (Content)"] }
        ]
      },
      art: {
        title: "الفن الرقمي",
        subject: "الفنون",
        description: "الطبقات ونظرية الألوان وأدوات الرسم.",
        questions: [
          { questionText: "بماذا تشبه الطبقات في الفن الرقمي؟", options: ["صخور ثقيلة", "ألواح زجاجية شفافة مكدّسة فوق بعضها", "ورقة واحدة", "فرشاة"] },
          { questionText: "لماذا يستخدم الفنانون الطبقات؟", options: ["لجعل الملف ثقيلًا", "للتلوين دون إفساد الرسم التخطيطي (بدون تدمير)", "لتعطيل الحاسوب", "للرسم ببطء"] },
          { questionText: "إذا مسحت على الطبقة 2، هل تُمسح الطبقة 1؟", options: ["نعم", "لا", "فقط إذا كانت حمراء", "دائمًا"] },
          { questionText: "الألوان المتقابلة على عجلة الألوان تُسمّى:", options: ["متناظرة", "متكاملة", "أساسية", "مملة"] },
          { questionText: "ما مثال على الألوان المتكاملة؟", options: ["الأحمر والوردي", "الأزرق والبرتقالي", "الأخضر والأخضر", "الأسود والأبيض"] },
          { questionText: "ماذا تُنشئ الألوان المتكاملة؟", options: ["الملل", "أقصى تباين وإثارة", "فوضى رمادية", "الاختفاء"] },
          { questionText: "ما هي قاعدة الأثلاث؟", options: ["تقسيم اللوحة إلى شبكة 3×3", "رسم 3 دوائر", "استخدام 3 ألوان فقط", "قضاء 3 ساعات في الرسم"] },
          { questionText: "أين يجب أن تضع موضوعك الرئيسي لتكوين سينمائي؟", options: ["في المنتصف تمامًا", "خارج اللوحة", "عند تقاطعات الشبكة", "دائمًا في الزاوية السفلية"] },
          { questionText: "هل المنتصف تمامًا هو دائمًا أفضل مكان للشخصية؟", options: ["نعم", "لا، قاعدة الأثلاث عادةً أفضل", "دائمًا", "أيام الإثنين فقط"] },
          { questionText: "ما هو التصيير (Rendering)؟", options: ["إضافة الضوء والظل ليبدو ثلاثي الأبعاد", "مسح الرسم", "إضافة توقيع", "حفظ الملف"] },
          { questionText: "الجزء من الجسم المواجه للشمس يحصل على:", options: ["ظل", "إضاءة ساطعة (Highlight)", "مخطط خارجي", "توقيع"] },
          { questionText: "الجزء المعاكس للضوء يحصل على:", options: ["إضاءة ساطعة (Highlight)", "ظل", "لون زاهٍ", "بقعة بيضاء"] },
          { questionText: "عند رسم شخصية، ماذا يجب أن ترسم أولًا؟", options: ["عيون مفصّلة", "أشكال ثلاثية الأبعاد أساسية مثل الكرات والأسطوانات", "الخلفية", "الشعر"] },
          { questionText: "ماذا تعني 'القيمة' (Value) في نظرية الألوان؟", options: ["كم تكلّف اللوحة", "مدى فتح أو غمق اللون", "كم لونًا تستخدم", "حجم الفرشاة"] },
          { questionText: "أين يحدث 'الانسداد المحيط' (Ambient Occlusion)؟", options: ["في ضوء الشمس المباشر", "في الشقوق العميقة حيث لا يصل الضوء", "في السماء", "على الإضاءة الساطعة"] }
        ]
      }
    }
  }
};
