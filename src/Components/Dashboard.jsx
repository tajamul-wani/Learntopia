import { db } from "../firebase/firebase";
import { getDoc, doc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { deleteAccountAndData, getReauthMethod, markAccountDeleted } from "../services/accountDeletion";
import { leave as leaveCourse, enroll as rejoinCourse } from "../services/enrollment";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../context/GamificationContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Icon from "./ui/Icon";
import Modal from "./ui/Modal";
import EmptyState from "./ui/EmptyState";
import { Skeleton } from "./ui/Skeleton";
import { getLocalizedQuiz } from "../utils/localizationUtils";
import Avatar from "./Avatar";
import LottieIcon from "./ui/LottieIcon";
import { AwardIcon } from "./ui/AwardArt";
import streakLottie from "../assets/lottie/Streak.lottie?url";
import lighteningLottie from "../assets/lottie/lightening.lottie?url";
import bookLottie from "../assets/lottie/Open_Book.lottie?url";
import awardLottie from "../assets/lottie/award.lottie?url";
import coolUserLottie from "../assets/lottie/cool_user.lottie?url";
import targetLottie from "../assets/lottie/Target.lottie?url";
import capLottie from "../assets/lottie/graduation_cap.lottie?url";
import starLottie from "../assets/lottie/star.lottie?url";
import wizardLottie from "../assets/lottie/Wizard.lottie?url";
import trophyLottie from "../assets/lottie/Trophy.lottie?url";
import crownLottie from "../assets/lottie/crown.lottie?url";
import roboticLottie from "../assets/lottie/robotic_memory.lottie?url";
import EditProfileView from "./EditProfileView";
import { parseProfileName } from "../utils/profileUtils";
import { localizeBadgeName, localizeBadgeDesc } from "../utils/badgeI18n";
import useMediaQuery from "../hooks/useMediaQuery";
import { COURSES } from "../data/coursesData";

const PREVIEW_LIMIT = 3;

// Profile badge medallion -> animated Lottie. Every earned badge plays its
// matching animation to make the profile feel premium; LottieIcon falls back to
// the detailed AwardArt SVG (same icon name) if a file is missing, still loading,
// or the player fails to run.
const ACH_LOTTIE = {
  sparkles: coolUserLottie,
  target: targetLottie,
  award: awardLottie,
  "book-open": bookLottie,
  "graduation-cap": capLottie,
  flame: streakLottie,
  star: starLottie,
  code: wizardLottie,
  trophy: trophyLottie,
  crown: crownLottie,
  zap: lighteningLottie,
  robotic: roboticLottie,
  medal: awardLottie,
};

// A few source files carry extra internal padding and render smaller than the
// rest; nudge just those up so every medallion looks the same visual size.
const ACH_LOTTIE_CLASS = {
  target: "scale-[1.45]",
  star: "scale-[1.85]",
  trophy: "scale-[1.3] sm:scale-[1.5]",
  zap: "scale-[0.85]",
};

// Tooltip descriptions for server-awarded (stored) badges, keyed by badge name.
const BADGE_DESC = {
  "Streak Master": "Reached a 30-day login streak",
  Champion: "Ranked #1 on the leaderboard",
  "Sharp Memory": "Barely any mistakes across your quizzes or a full course",
  "Perfect Score": "Scored 100% on a quiz",
};

// Canonical art per stored badge name. Resolving by name (not the stored art)
// keeps one art per badge and repairs any legacy badge saved with an older art.
const BADGE_ART = {
  Champion: "crown",
  "Streak Master": "flame",
  "Sharp Memory": "robotic",
  "Perfect Score": "zap",
};


// Ids owned by the derived achievements above. A stored badge with any of these
// ids (e.g. legacy "Newcomer" data) is dropped so it can't duplicate a derived
// medallion in any language.
const DERIVED_IDS = new Set([
  "newcomer",
  "first-quiz",
  "quiz-ace",
  "first-course",
  "scholar",
  "rising-star",
  "code-wizard",
  // Champion is dynamic (only the CURRENT #1). Listing it here stops a stale
  // stored "Champion" badge from a former #1 being folded into the grid.
  "champion",
]);

// Shared tone styles for section-header icon chips (core palette only).
const HEAD_TONE = {
  violet: "border-violet-500/25 bg-violet-500/10 text-violet-400",
  sky: "border-sky/25 bg-sky/10 text-sky",
};

// One consistent header cluster (icon chip + title + optional subtext) used by
// every dashboard section and sub-tab, so the icon size, title size, and the
// title/subtext hierarchy read identically across Overview, Enrolled, Completed
// and Quiz History on all screen sizes. Icon and chip are a fixed size on
// purpose (no per-device scaling) so nothing looks uneven between tabs.
const SectionHead = ({ icon, tone = "violet", title, desc, trailing }) => (
  <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:gap-3 sm:text-left min-w-0">
    {/* Icon chip is desktop-only; on small screens the header is just the title
       and subtext (per design request). Empty-state icons are separate and stay. */}
    <span className={`hidden h-11 w-11 flex-none items-center justify-center rounded-xl border sm:flex ${HEAD_TONE[tone]}`}>
      <Icon name={icon} size={22} />
    </span>
    <div className="min-w-0">
      <h2 className="flex items-center justify-center gap-2 text-base font-extrabold leading-tight text-ink-hi sm:justify-start sm:text-lg">
        {title}
        {trailing}
      </h2>
      {desc && <p className="mt-0.5 text-xs text-ink-low">{desc}</p>}
    </div>
  </div>
);

// Helper to look up official course thumbnail image from coursesData
const getCourseImage = (courseId) => {
  const match = COURSES.find((c) => c.id === Number(courseId));
  return match?.image || null;
};

// Helper to get course category
const getCourseCategory = (courseId) => {
  const match = COURSES.find((c) => c.id === Number(courseId));
  return match?.category || "General";
};

// Smooth Animated Number Counter component
const AnimatedNumber = ({ value, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    if (target === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 800; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * target);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logOut } = useAuth();
  const {
    xp, levelInfo, badges: gamificationBadges, streak,
    profile, photoURL, usePhoto,
  } = useGamification();
  const { playWarningAlert, playClick } = useSound();
  const { t, tRaw } = useLanguage();
  // On small screens the icon-top cards get noticeably larger icons (SVG + chip),
  // so they read as the focal point. Desktop keeps the compact sizing.
  const isSmall = useMediaQuery("(max-width: 639px)");

  // ── state ─────────────────────────────────────────────────────────────────
  // Whether THIS user is currently the overall #1 (drives the dynamic Champion
  // medallion). Champion is not a stored badge — it reflects live standing only.
  const [isChampion, setIsChampion] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Sub-Tab: "overview" | "courses" | "completed" | "quizzes"
  const [activeTab, setActiveTab] = useState("overview");

  // Modals & Actions
  const [courseToUnenroll, setCourseToUnenroll] = useState(null);
  const [unenrollLoading, setUnenrollLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // The identity prompt sends a learner here with ?edit=profile, so "Choose
  // now" lands on the editor itself rather than the dashboard.
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get("edit") !== "profile") return;
    setEditingProfile(true);
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  // Destructive profile deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync userDetails with profile from GamificationContext
  useEffect(() => {
    if (profile) setUserDetails((prev) => ({ ...prev, ...profile }));
  }, [profile]);

  // Admin redirect
  useEffect(() => {
    if (isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, navigate]);

  // Live Champion status: is this user CURRENTLY the overall #1? Mirrors the
  // leaderboard's rule (top of PublicLeaderboard by totalPoints, score > 0, and a
  // board of at least two). Re-checked whenever the user's own XP changes.
  useEffect(() => {
    if (!currentUser) { setIsChampion(false); return undefined; }
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "PublicLeaderboard"), orderBy("totalPoints", "desc"), limit(2))
        );
        const top = snap.docs[0];
        const champ =
          snap.docs.length >= 2 &&
          top?.id === currentUser.uid &&
          (Number(top.data().totalPoints) || 0) > 0;
        if (!cancelled) setIsChampion(champ);
      } catch {
        if (!cancelled) setIsChampion(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentUser, xp]);

  // Fetch Firestore data
  useEffect(() => {
    if (!currentUser) {
      setUserDetails(null);
      setEnrolledCourses([]);
      setQuizScores([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const userRef = doc(db, "Users", currentUser.uid);
        const coursesRef = collection(db, "Users", currentUser.uid, "enrolledCourses");
        const quizRef = collection(db, "Users", currentUser.uid, "quizAttempts");

        const [userSnap, coursesSnap, quizSnap] = await Promise.all([
          getDoc(userRef), getDocs(coursesRef), getDocs(quizRef),
        ]);

        const courses = [];
        coursesSnap.forEach((d) => courses.push({ id: d.id, ...d.data() }));
        setEnrolledCourses(courses);

        const best = {};
        quizSnap.forEach((d) => {
          const data = d.data();
          const key = data.quizId || data.quizTitle;
          if (key && (!best[key] || (data.score || 0) > best[key].score)) {
            best[key] = {
              quizId: data.quizId || null,
              title: data.quizTitle || data.title || key,
              score: data.score || 0,
            };
          }
        });
        setQuizScores(Object.values(best));

        setUserDetails(
          userSnap.exists()
            ? userSnap.data()
            : { email: currentUser.email, fullName: currentUser.displayName }
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, isAdmin]);

  // Handlers
  const handleLogout = async () => {
    try {
      await logOut();
      toast.logout(t("toasts.logoutSafe"));
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error(t("toasts.logoutFailed"));
    }
  };

  const handleUnenrollConfirm = async () => {
    if (!courseToUnenroll || !currentUser) return;
    setUnenrollLoading(true);
    try {
      // Leaving is soft: the document stays, flagged, so XP and completed
      // modules survive. One shared service owns this and the rejoin below,
      // because three copies of these writes is what let a course page enrol
      // someone just for looking at it.
      await leaveCourse(currentUser.uid, courseToUnenroll.courseId);
      setEnrolledCourses((prev) =>
        prev.map((c) => (c.courseId === courseToUnenroll.courseId ? { ...c, unenrolled: true } : c))
      );
      toast.unenroll(t("toasts.unenrolledFrom", { title: courseToUnenroll.title }));
      setCourseToUnenroll(null);
    } catch (err) {
      console.error("Error unenrolling:", err);
      toast.error(t("toasts.unenrollFailed"));
    } finally {
      setUnenrollLoading(false);
    }
  };

  // Rejoin a previously unenrolled course — clears the flag; progress and XP are
  // intact (nothing was deleted). Completed modules never re-award XP.
  const handleRejoin = async (course) => {
    if (!currentUser) return;
    try {
      await rejoinCourse(currentUser.uid, { id: course.courseId, title: course.title, category: course.category });
      setEnrolledCourses((prev) =>
        prev.map((c) => (c.courseId === course.courseId ? { ...c, unenrolled: false } : c))
      );
      // If that was the last unenrolled course, the tab disappears — move to Enrolled.
      if (unenrolledCourses.length <= 1) setActiveTab("courses");
      toast.success(t("toasts.rejoined", { title: course.title }));
    } catch (err) {
      console.error("Error rejoining:", err);
      toast.error(t("toasts.rejoinFailed"));
    }
  };

  const handleDeleteProfile = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      toast.error(t("toasts.deleteConfirmType"));
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteAccountAndData(currentUser, { password: deletePassword });
      // The offline Firestore cache was cleared, which needs a fresh page load.
      // The confirmation is shown once the home page has loaded.
      markAccountDeleted();
      window.location.replace("/");
    } catch (err) {
      console.error("Profile deletion error:", err);
      if (err.step === "reauth") {
        const wrongPassword = ["auth/wrong-password", "auth/invalid-credential", "auth/missing-password"];
        toast.error(
          wrongPassword.includes(err.code)
            ? t("toasts.deleteWrongPassword")
            : err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request"
              ? t("toasts.deleteReauthCancelled")
              : t("toasts.deleteReauthFailed")
        );
      } else {
        toast.error(t("toasts.deleteFailed"));
      }
      setDeleteLoading(false);
    }
  };

  // Derived datasets
  const activeCourses = useMemo(() => enrolledCourses.filter((c) => !c.completed && !c.unenrolled), [enrolledCourses]);
  const completedCourses = useMemo(() => enrolledCourses.filter((c) => c.completed && !c.unenrolled), [enrolledCourses]);
  const unenrolledCourses = useMemo(() => enrolledCourses.filter((c) => c.unenrolled), [enrolledCourses]);
  const previewCourses = useMemo(() => activeCourses.slice(0, PREVIEW_LIMIT), [activeCourses]);
  const previewCompleted = useMemo(() => completedCourses.slice(0, PREVIEW_LIMIT), [completedCourses]);
  const previewQuizzes = useMemo(() => quizScores.slice(0, PREVIEW_LIMIT), [quizScores]);
  const spotlightCourse = useMemo(() => activeCourses[0] || null, [activeCourses]);

  const { displayName: parsedDisplayName, avatarId: parsedAvatarId } = parseProfileName(
    userDetails || profile,
    currentUser?.displayName || "Learner"
  );

  const studentName = parsedDisplayName || userDetails?.fullName || currentUser?.displayName || "Learner";

  // Days of week for the streak tracker — fills only days within the current streak.
  const daysOfWeek = tRaw("dashboard.weekdays") || ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  // Achievements — GitHub-style medallions derived from real data (earned only).
  const achievements = useMemo(() => {
    const list = [];
    const seen = new Set();
    // Dedup by a stable, language-independent id (NOT the translated label), so
    // switching language can never surface a duplicate badge. `desc` becomes the
    // medallion's title tooltip explaining how the badge was earned.
    const add = (id, icon, label, tone, desc) => {
      if (seen.has(id)) return;
      seen.add(id);
      list.push({ id, icon, label, tone, desc: desc || label });
    };
    // Newcomer is a starter badge; it retires at Level 3 when Rising Star takes
    // its place, so the profile never shows both.
    if (levelInfo.level < 3) {
      add("newcomer", "sparkles", t("dashboard.achNewcomer"), "violet", t("dashboard.achNewcomerDesc", "Welcome to Learntopia"));
    }
    if (quizScores.length === 1) add("first-quiz", "target", t("dashboard.achFirstQuiz"), "sky", t("dashboard.achFirstQuizDesc", "Completed your first quiz"));
    if (quizScores.length >= 3) add("quiz-ace", "award", t("dashboard.achQuizAce"), "sky", t("dashboard.achQuizAceDesc", "Completed three or more quizzes"));
    if (completedCourses.length >= 1) add("first-course", "book-open", t("dashboard.achFirstCourse"), "sky", t("dashboard.achFirstCourseDesc", "Completed your first course"));
    if (completedCourses.length >= 3) add("scholar", "graduation-cap", t("dashboard.achScholar"), "sky", t("dashboard.achScholarDesc", "Completed three or more courses"));
    // The everyday streak is NOT a badge (it has its own metric + widget). The
    // 30-day milestone IS a permanent award, granted server-side as "Streak
    // Master" and folded in with the other stored badges below.
    if (levelInfo.level >= 3) add("rising-star", "star", t("dashboard.achRisingStar"), "violet", t("dashboard.achRisingStarDesc", "Reached Level 3"));
    if (levelInfo.level >= 5) add("code-wizard", "code", t("dashboard.achCodeWizard"), "violet", t("dashboard.achCodeWizardDesc", "Reached Level 5"));
    // Champion is DYNAMIC — shown only while the user is the current overall #1,
    // never from stored data (see DERIVED_IDS). A former champion loses it.
    if (isChampion) add("champion", "crown", t("dashboard.achChampion"), "violet", t("dashboard.achChampionDesc", "Currently #1 on the leaderboard"));
    // Fold in any server-awarded badges not already represented. A stored badge
    // whose id matches a derived achievement (e.g. legacy "Newcomer" data) is
    // skipped so it can never double up, in any language. Use the badge's own art
    // token (Champion -> crown, Streak Master -> zap) so the medallion matches.
    gamificationBadges.forEach((b) => {
      const name = typeof b === "string" ? b : b.name || "Badge";
      const id = name.toLowerCase().trim().replace(/\s+/g, "-");
      if (DERIVED_IDS.has(id)) return; // never let stored data duplicate a derived achievement
      const icon = BADGE_ART[name] || (typeof b === "object" && b.art) || "trophy";
      // Localize the label + tooltip when the badge is mapped; otherwise keep the
      // raw stored name so an unknown badge never renders a bare i18n key path.
      const label = localizeBadgeName(name, t);
      const desc = localizeBadgeDesc(name, t, BADGE_DESC[name]);
      add(id, icon, label, "violet", desc);
    });
    return list;
  }, [quizScores, completedCourses, levelInfo, gamificationBadges, isChampion, t]);

  const ACH_TONE = {
    violet: "border-violet-500/45 bg-violet-500/[0.12] text-violet-300 shadow-[0_0_14px_rgba(139,124,246,0.16)]",
    sky: "border-sky/45 bg-sky/[0.12] text-sky shadow-[0_0_14px_rgba(78,197,232,0.16)]",
    gold: "border-gold-500/45 bg-gold-500/[0.12] text-gold-300 shadow-[0_0_14px_rgba(251,191,36,0.15)]",
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="container-page py-10 md:py-14 space-y-6">
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-5">
            <Skeleton className="h-20 w-20 flex-none rounded-full" />
            {/* min-w-0 lets this column shrink inside the flex row, and the
                bars are capped rather than fixed: a fixed w-72 pushed the page
                39px sideways at 390px for as long as the skeleton was up. */}
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-6 w-full max-w-48" />
              <Skeleton className="h-4 w-full max-w-72" />
              <Skeleton className="mt-2 h-2.5 w-full max-w-sm" />
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-52 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Unauthenticated
  if (!currentUser) {
    return (
      <div className="container-page py-12">
        <Card className="mx-auto w-full max-w-md p-8">
          <EmptyState
            icon="user"
            title={t("modals.dashNoProfileTitle")}
            description={t("modals.dashNoProfileDesc")}
            action={<Button onClick={() => navigate("/login")}>{t("nav.login")}</Button>}
          />
        </Card>
      </div>
    );
  }

  // Dedicated Edit Profile view — opened from the "Edit Profile" button at the
  // top of the dashboard. It replaces the dashboard body (with a Back link) and
  // is NOT one of the content sub-tabs.
  if (editingProfile) {
    return (
      <EditProfileView
        onBack={() => setEditingProfile(false)}
        initialName={parsedDisplayName || ""}
        initialAvatar={parsedAvatarId || null}
        initialUsePhoto={usePhoto}
      />
    );
  }

  // Pro Metric Capsule Config — core palette only (violet primary, sky secondary).
  // Cooler icon chips use a soft gradient with an inner highlight for depth.
  const METRICS = [
    {
      iconName: "zap",
      label: t("dashboard.totalXp"),
      rawValue: xp,
      suffix: " XP",
      accent: "text-violet-400",
      iconBg: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    },
    {
      iconName: "flame",
      lottie: streakLottie,
      label: t("dashboard.dayStreak"),
      rawValue: streak,
      suffix: ` ${streak === 1 ? t("dashboard.day") : t("dashboard.days")}`,
      accent: "text-gold-400",
      iconBg: "bg-gold-500/15 border-gold-500/40 text-gold-300",
    },
    {
      iconName: "book-open",
      label: t("dashboard.enrolled"),
      rawValue: activeCourses.length + completedCourses.length,
      suffix: "",
      accent: "text-sky",
      iconBg: "bg-sky/15 border-sky/30 text-sky",
      onClickTab: "courses",
    },
    {
      iconName: "award",
      label: t("dashboard.completed"),
      rawValue: completedCourses.length,
      suffix: "",
      accent: "text-sky",
      iconBg: "bg-sky/15 border-sky/30 text-sky",
      onClickTab: "completed",
    },
  ];

  // Visual Course Card renderer (3-tier clean layout)
  const renderCourseCard = (c) => {
    const done = c.completedModules ? c.completedModules.length : 0;
    const total = c.totalModules || 4;
    const pct = Math.round((done / total) * 100);
    const localizedTitle = t(`courseData.${c.courseId}.title`, c.title);
    const img = getCourseImage(c.courseId);
    const category = getCourseCategory(c.courseId);

    return (
      <div
        key={c.courseId}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-clay p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/35 hover:bg-surface-2"
      >
        {/* Tier 1: Category Tag + Unenroll Button */}
        <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3 mb-3">
          <span className="inline-block rounded-md bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 border border-violet-500/20">
            {category}
          </span>

          <button
            type="button"
            onClick={() => setCourseToUnenroll(c)}
            className="flex-none inline-flex items-center gap-1 rounded-lg border border-white/[0.1] px-2 py-1 text-[11px] font-semibold text-ink-faint transition-colors hover:border-state-danger/30 hover:bg-state-danger/10 hover:text-state-danger"
            title={t("dashboard.unenroll")}
            aria-label={`Unenroll from ${localizedTitle}`}
          >
            <Icon name="x-circle" size={13} />
            {t("dashboard.unenroll")}
          </button>
        </div>

        {/* Tier 2: Thumbnail Image + Full 2-Line Title + Step Progress */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 mb-4 min-w-0">
          {img ? (
            <img
              src={img}
              alt=""
              className="h-14 w-14 sm:h-12 sm:w-12 flex-none rounded-xl border border-white/10 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-14 w-14 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-xl bg-violet-600 text-white font-black text-lg shadow-clay-sm">
              {category.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1 w-full">
            <h3 className="line-clamp-2 text-balance text-sm font-bold leading-snug text-ink-hi group-hover:text-violet-300 transition-colors text-center sm:text-left">
              {localizedTitle}
            </h3>
            <p className="mt-1 text-xs text-ink-low font-medium text-center sm:text-left">
              {t("dashboard.stepCounter", { current: done, total })}
              <span className="mx-1.5 text-ink-faint">·</span>
              <span className="font-bold text-violet-400">{pct}%</span>
            </p>
          </div>
        </div>

        {/* Tier 3: Full-width Progress Bar + Full-width Continue Button */}
        <div className="space-y-3 border-t border-white/[0.06] pt-3">
          <div className="h-2 w-full overflow-hidden rounded-full clay-inset">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 via-violet-500 to-sky transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <Button
            size="md"
            fullWidth
            onClick={() => navigate(`/course/${c.courseId}`)}
            className="font-bold"
          >
            <span className="inline-flex items-center gap-1.5">{t("courses.continueLearning")} <Icon name="zap" size="sm" /></span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container-page py-10 text-ink-hi md:py-14">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* ── Incomplete Profile Warning Banner ────────────────────────────── */}
        {(!parsedDisplayName || !parsedAvatarId) && (
          <div className="animate-fade-up flex flex-col gap-3 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-4 sm:flex-row sm:items-center sm:justify-between shadow-clay-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gold-500/20 text-gold-300">
                <Icon name="sparkles" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gold-200">{t("profileSetup.setupBannerTitle")}</p>
                <p className="mt-0.5 text-xs text-gold-200/80">{t("profileSetup.setupBannerDesc")}</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setEditingProfile(true)}
              className="flex-none bg-gold-400 text-ground-900 font-bold border-none hover:bg-gold-300"
            >
              {t("profileSetup.setupBannerBtn")}
            </Button>
          </div>
        )}

        {/* ── ROW 1 — Profile Header: identity, achievements & level progress ── */}
        <Card className="animate-fade-up relative overflow-hidden border-violet-500/15 p-5 sm:p-8">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between text-center sm:text-left">

            {/* Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 min-w-0">
              <div className="relative flex-none">
                <Avatar
                  avatarId={parsedAvatarId}
                  photoURL={usePhoto ? photoURL : null}
                  size={92}
                  name={studentName}
                  className="rounded-2xl border-2 border-violet-500/35 shadow-glow"
                />
              </div>

              <div className="min-w-0 flex-1">
                {/* Name & Level Badge */}
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3">
                  <h1 className="truncate text-3xl font-extrabold sm:text-4xl text-ink-hi tracking-tight">
                    {studentName}
                  </h1>
                  <span className="inline-flex flex-none items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-bold text-violet-300 shadow-sm">
                    <Icon name={levelInfo.icon} size="xs" /> {t("dashboard.level")} {levelInfo.level} · {t(`levelNames.level${levelInfo.level}`)}
                  </span>
                </div>

                {/* Achievement / badge medallions (earned only) */}
                <div className="mt-4">
                  <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-ink-low/70 sm:text-left">
                    {t("dashboard.badges")}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                    {achievements.map((a) => (
                      <div key={a.id} className="flex min-w-14 flex-col items-center gap-1.5 px-1" title={`${a.label} — ${a.desc}`}>
                        <span className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-clay-sm ${ACH_TONE[a.tone]}`}>
                          <LottieIcon src={ACH_LOTTIE[a.icon]} size={isSmall ? 40 : 40} fallbackIcon={a.icon} className={ACH_LOTTIE_CLASS[a.icon]} />
                        </span>
                        <span className="whitespace-nowrap text-center text-[9px] font-bold leading-tight text-ink-low">{a.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons — compact; wrap/center on mobile */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 flex-none">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingProfile(true)}
                className="text-xs border-white/10 hover:bg-white/10 whitespace-nowrap"
              >
                <Icon name="edit-3" size={14} /> {t("profileSetup.editBtn")}
              </Button>
              <Button variant="danger" size="sm" onClick={handleLogout} className="text-xs whitespace-nowrap">
                <Icon name="logout" size={14} /> {t("dashboard.logout")}
              </Button>
            </div>
          </div>

          {/* Real Level XP progress bar */}
          <div className="relative z-10 mt-5 border-t border-white/[0.08] pt-4">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="text-xs font-semibold text-ink-hi">
                {t("dashboard.level")} {levelInfo.level} · {t(`levelNames.level${levelInfo.level}`)}
              </span>
              <span className="text-xs tabular-nums text-ink-low">
                {levelInfo.nextLevel
                  ? t("dashboard.levelProgress", {
                      current: levelInfo.xpInLevel,
                      needed: levelInfo.xpNeeded,
                      next: levelInfo.level + 1,
                    })
                  : t("dashboard.levelProgressMax")}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full clay-inset">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-700 via-violet-500 to-sky transition-[width] duration-700 ease-out"
                style={{ width: `${levelInfo.progressPct}%` }}
              />
            </div>
          </div>
        </Card>

        {/* ── ROW 2 — Pro 4 Metric Capsules (Positioned directly under Header) ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {METRICS.map((m, i) => (
            <Card
              key={m.label}
              onClick={() => {
                if (m.onClickTab) {
                  playClick();
                  setActiveTab(m.onClickTab);
                }
              }}
              className={`animate-fade-up p-3 sm:p-5 text-center flex flex-col items-center justify-center transition-all duration-200 ${m.onClickTab ? "cursor-pointer hover:bg-surface-2 hover:border-violet-500/30 hover:-translate-y-0.5" : ""}`}
              style={{ animationDelay: `${0.04 + i * 0.04}s` }}
            >
              <div className={`mb-1.5 sm:mb-2 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border shadow-clay-sm ${m.iconBg}`}>
                {m.lottie ? (
                  <LottieIcon src={m.lottie} size={isSmall ? 26 : 26} fallbackIcon={m.iconName} className={m.lottieClass} />
                ) : (
                  <AwardIcon name={m.iconName} size={isSmall ? 26 : 26} />
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-ink-low">{m.label}</span>
              <p className={`mt-1 sm:mt-1.5 text-xl sm:text-3xl font-black tabular-nums ${m.accent}`}>
                <AnimatedNumber value={m.rawValue} suffix={m.suffix} />
              </p>
            </Card>
          ))}
        </div>

        {/* ── DASHBOARD SUB-NAVIGATION BAR (Mobile 2-Col Grid) ─────────────────── */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center border-b border-white/[0.08] pb-3">
          {[
            { id: "overview", label: t("dashboard.tabOverview") },
            { id: "courses", label: `${t("dashboard.tabEnrolled")} (${activeCourses.length})` },
            { id: "completed", label: `${t("dashboard.tabCompleted")} (${completedCourses.length})` },
            { id: "quizzes", label: `${t("dashboard.tabQuizHistory")} (${quizScores.length})` },
            ...(unenrolledCourses.length > 0
              ? [{ id: "unenrolled", label: `${t("dashboard.tabUnenrolled")} (${unenrolledCourses.length})` }]
              : []),
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playClick();
                  setActiveTab(tab.id);
                }}
                className={`w-full sm:w-auto rounded-xl px-2.5 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold transition-all duration-200 text-center ${
                  isActive
                    ? "bg-violet-600 text-white shadow-glow border border-violet-400/30"
                    : "bg-surface-2 text-ink-low hover:bg-surface-3 hover:text-ink-hi border border-white/10 shadow-clay-sm"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SUB-TAB CONTENT VIEWS
            ══════════════════════════════════════════════════════════════════ */}

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Spotlight & Daily Goal Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left 2 Cols: Continue Learning Spotlight */}
              <div className="lg:col-span-2">
                <Card className="h-full border-white/10 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 border-b border-white/[0.08] pb-3">
                      <SectionHead icon="zap" tone="sky" title={t("dashboard.spotlightTitle")} />
                      <span className="flex-none rounded-full bg-sky/10 px-2.5 py-0.5 text-[11px] font-bold text-sky border border-sky/20">
                        {t("dashboard.activeFocus")}
                      </span>
                    </div>

                    {spotlightCourse ? (
                      <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                        {getCourseImage(spotlightCourse.courseId) ? (
                          <img
                            src={getCourseImage(spotlightCourse.courseId)}
                            alt=""
                            className="h-24 w-24 flex-none rounded-2xl border border-white/10 object-cover shadow-md"
                          />
                        ) : (
                          <div className="flex h-24 w-24 flex-none items-center justify-center rounded-2xl border border-white/10 bg-violet-600 text-white shadow-clay-sm">
                            <Icon name="zap" size={32} />
                          </div>
                        )}

                        <div className="flex-1 space-y-1.5 w-full">
                          <span className="inline-block rounded-md bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-300 border border-violet-500/20">
                            {getCourseCategory(spotlightCourse.courseId)}
                          </span>
                          <h3 className="text-lg font-extrabold text-ink-hi leading-snug text-center sm:text-left">
                            {t(`courseData.${spotlightCourse.courseId}.title`, spotlightCourse.title)}
                          </h3>
                          <p className="text-xs text-ink-low font-medium text-center sm:text-left">
                            {t("dashboard.stepCounter", {
                              current: spotlightCourse.completedModules ? spotlightCourse.completedModules.length : 0,
                              total: spotlightCourse.totalModules || 4,
                            })}
                            <span className="mx-1.5 text-ink-faint">·</span>
                            <span className="font-bold text-sky">
                              {Math.round(
                                ((spotlightCourse.completedModules ? spotlightCourse.completedModules.length : 0) /
                                  (spotlightCourse.totalModules || 4)) *
                                  100
                              )}% {t("dashboard.completedWord")}
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-xs text-ink-low">{t("dashboard.noCoursesDesc")}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.06] pt-4 gap-3">
                    {spotlightCourse ? (
                      <>
                        <div className="flex-1 w-full sm:max-w-xs sm:mr-4">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-sky to-violet-500 transition-[width] duration-700 ease-out"
                              style={{
                                width: `${Math.round(
                                  ((spotlightCourse.completedModules ? spotlightCourse.completedModules.length : 0) /
                                    (spotlightCourse.totalModules || 4)) *
                                    100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate(`/course/${spotlightCourse.courseId}`)}
                          className="w-full sm:w-auto font-bold shadow-glow text-sm px-6 py-2.5"
                        >
                          {t("dashboard.resumeModule")}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => navigate("/courses")} className="w-full sm:w-auto font-bold shadow-glow">
                        {t("dashboard.exploreBtn")} →
                      </Button>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right 1 Col: Daily Streak Widget (weekly tracker fills only real streak days) */}
              <div>
                <Card className="h-full border-white/10 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                      <h2 className="flex items-center gap-2.5 text-sm font-extrabold text-gold-300">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/[0.12] shadow-[0_0_14px_rgba(251,191,36,0.15)]">
                          <LottieIcon src={streakLottie} size={26} fallbackIcon="flame" />
                        </span>
                        {t("dashboard.streakTitle")}
                      </h2>
                      <span className="text-xs font-extrabold text-gold-300">
                        {streak} {streak === 1 ? t("dashboard.day") : t("dashboard.days")}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-ink-low">
                        {t("dashboard.weeklyActivity")}
                      </p>
                      <div className="flex items-stretch justify-between gap-1.5">
                        {daysOfWeek.map((day, idx) => {
                          const isOn =
                            streak > 0 && idx <= currentDayIndex && idx > currentDayIndex - Math.min(streak, 7);
                          const isToday = idx === currentDayIndex;
                          return (
                            <div
                              key={idx}
                              className={`flex flex-1 items-center justify-center rounded-xl py-2.5 text-[10px] font-extrabold tracking-tight transition-all ${
                                isOn
                                  ? "border border-gold-500/40 bg-gold-500/20 text-gold-300 shadow-clay-sm"
                                  : "border border-white/10 bg-surface-2 text-ink-faint opacity-50"
                              } ${isToday ? "outline outline-2 outline-gold-400/55 outline-offset-2" : ""}`}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 flex items-start gap-1.5 text-[11px] text-ink-low italic border-t border-white/[0.06] pt-3">
                    <Icon name="lightbulb" size={13} className="mt-px flex-none text-gold-300/80" />
                    {t("dashboard.streakTip")}
                  </p>
                </Card>
              </div>
            </div>

            {/* Enrolled Courses Grid (Max 3 Preview) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3">
                <SectionHead
                  icon="book-open"
                  tone="violet"
                  title={t("dashboard.activeCourses")}
                  trailing={
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-violet-300">
                      {activeCourses.length}
                    </span>
                  }
                />

                {activeCourses.length > PREVIEW_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("courses")}
                    className="text-xs font-bold text-sky hover:text-sky/80 transition-colors"
                  >
                    {t("dashboard.viewAllCourses", { count: activeCourses.length })}
                  </button>
                )}
              </div>

              {activeCourses.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {previewCourses.map((c) => renderCourseCard(c))}
                </div>
              ) : (
                <Card className="p-8 text-center border-white/10">
                  <EmptyState
                    icon="book-open"
                    title={t("dashboard.noCoursesTitle")}
                    description={t("dashboard.noCoursesDesc")}
                    action={
                      <Button onClick={() => navigate("/courses")} className="mt-2 font-bold shadow-glow">
                        {t("dashboard.exploreBtn")} →
                      </Button>
                    }
                  />
                </Card>
              )}
            </div>

            {/* Completed Courses & Quiz History Split Grid (Max 3 Preview Each) */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Completed Courses Showcase */}
              <Card className="p-5 sm:p-6 border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 border-b border-white/[0.08] pb-3.5">
                  <SectionHead
                    icon="check-circle"
                    tone="sky"
                    title={t("dashboard.completedCourses")}
                    trailing={
                      <span className="rounded-full bg-sky/10 px-2.5 py-0.5 text-xs font-bold text-sky">
                        {completedCourses.length}
                      </span>
                    }
                  />

                  {completedCourses.length > PREVIEW_LIMIT && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("completed")}
                      className="text-xs font-bold text-sky hover:text-sky transition-colors"
                    >
                      {t("dashboard.viewAllCompletedCourses", { count: completedCourses.length })}
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  {completedCourses.length > 0 ? (
                    <div className="space-y-3">
                      {previewCompleted.map((c) => {
                        const localizedTitle = t(`courseData.${c.courseId}.title`, c.title);
                        return (
                          <div
                            key={c.courseId}
                            className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 rounded-xl border border-sky/25 bg-sky/[0.05] p-3.5"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Icon name="trophy" size={20} className="text-sky" />
                              <p className="min-w-0 text-sm font-bold text-ink-hi text-center sm:text-left">{localizedTitle}</p>
                            </div>
                            <span className="flex-none rounded-full border border-sky/30 bg-sky/20 px-3 py-1 text-xs font-bold text-sky">
                              {t("courses.courseCompleted")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-surface-2 p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 shadow-glow">
                        <Icon name="trophy" size={24} className="text-violet-400" />
                      </div>
                      <h3 className="text-base font-extrabold text-ink-hi text-balance max-w-[340px] mx-auto leading-snug">
                        {t("dashboard.motivationalCompletedTitle")}
                      </h3>
                      <Button
                        size="sm"
                        onClick={() => navigate("/courses")}
                        className="mt-4 font-bold shadow-glow"
                      >
                        {t("dashboard.exploreBtn")} →
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Quiz High Scores Hub */}
              <Card className="p-5 sm:p-6 border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 border-b border-white/[0.08] pb-3.5">
                  <SectionHead icon="trophy" tone="violet" title={t("dashboard.quizHistory")} />

                  {quizScores.length > PREVIEW_LIMIT ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab("quizzes")}
                      className="text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      {t("dashboard.viewAllQuizzes", { count: quizScores.length })}
                    </button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => navigate("/quiz")}
                      className="font-bold shadow-glow"
                    >
                      {t("dashboard.takeNewQuizBtn")}
                    </Button>
                  )}
                </div>

                <div className="mt-4">
                  {quizScores.length > 0 ? (
                    <div className="space-y-2.5">
                      {previewQuizzes.map((q) => {
                        const localizedTitle = q.quizId
                          ? getLocalizedQuiz({ id: q.quizId, title: q.title }, t)?.title || q.title
                          : q.title;
                        return (
                          <div
                            key={q.quizId || q.title}
                            className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 rounded-xl border border-white/10 bg-surface-2 shadow-clay-sm p-3.5 transition-colors hover:bg-surface-3"
                          >
                            <span className="min-w-0 text-sm font-semibold text-ink-hi text-center sm:text-left">{localizedTitle}</span>
                            <span className="flex-none rounded-lg border border-violet-500/30 bg-violet-500/15 px-2.5 py-1 text-xs font-extrabold text-violet-300">
                              {q.score} <span className="text-[10px] font-normal text-violet-400/80">best</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-xs text-ink-low">{t("dashboard.noQuizDesc")}</p>
                      <Button
                        size="sm"
                        onClick={() => navigate("/quiz")}
                        className="mt-3 font-bold"
                      >
                        {t("dashboard.takeNewQuizBtn")}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ── TAB 2: ALL ENROLLED COURSES ─────────────────────────────────── */}
        {activeTab === "courses" && (
          <Card className="p-5 sm:p-8 animate-fade-in border-violet-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 border-b border-white/[0.08] pb-4 mb-6">
              <SectionHead
                icon="book-open"
                tone="sky"
                title={`${t("dashboard.allEnrolledTitle")} (${activeCourses.length})`}
                desc={t("dashboard.allEnrolledDesc")}
              />
              <Button onClick={() => navigate("/courses")} size="md" className="w-full sm:w-auto font-bold flex-none">
                {t("dashboard.exploreBtn")} →
              </Button>
            </div>

            {activeCourses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeCourses.map((c) => renderCourseCard(c))}
              </div>
            ) : (
              <EmptyState
                icon="book-open"
                title={t("dashboard.noCoursesTitle")}
                description={t("dashboard.noCoursesDesc")}
                action={
                  <Button onClick={() => navigate("/courses")} className="mt-2 font-bold shadow-glow">
                    {t("dashboard.exploreBtn")} →
                  </Button>
                }
              />
            )}
          </Card>
        )}

        {/* ── TAB 3: ALL COMPLETED COURSES & CERTIFICATES ────────────────── */}
        {activeTab === "completed" && (
          <Card className="p-5 sm:p-8 animate-fade-in border-sky/20">
            <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 border-b border-white/[0.08] pb-4 mb-6">
              <SectionHead
                icon="check-circle"
                tone="sky"
                title={`${t("dashboard.allCompletedTitle")} (${completedCourses.length})`}
                desc={t("dashboard.allCompletedDesc")}
              />
              <Button onClick={() => navigate("/courses")} size="md" className="w-full sm:w-auto font-bold flex-none">
                {t("dashboard.exploreBtn")} →
              </Button>
            </div>

            {completedCourses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {completedCourses.map((c) => {
                  const localizedTitle = t(`courseData.${c.courseId}.title`, c.title);
                  const img = getCourseImage(c.courseId);
                  return (
                    <div
                      key={c.courseId}
                      className="flex flex-col justify-between rounded-2xl border border-sky/25 bg-sky/[0.05] p-5 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                        {img ? (
                          <img src={img} alt="" className="h-14 w-14 rounded-xl object-cover border border-white/10 shadow-sm flex-none" />
                        ) : (
                          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-sky/20 text-sky">
                            <Icon name="trophy" size={24} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 w-full">
                          <span className="inline-block rounded-full bg-sky/20 px-2.5 py-0.5 text-[10px] font-bold text-sky border border-sky/30 uppercase tracking-wider">
                            100% {t("dashboard.completedWord")}
                          </span>
                          <h3 className="mt-1.5 font-bold text-sm sm:text-base text-ink-hi text-center sm:text-left">{localizedTitle}</h3>
                          <p className="text-xs text-ink-low mt-0.5 text-center sm:text-left">{t("dashboard.certificateUnlocked")}</p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-sky/20 pt-3 flex justify-center sm:justify-end">
                        <Button
                          size="md"
                          variant="ghost"
                          onClick={() => navigate(`/course/${c.courseId}`)}
                          className="w-full sm:w-auto border-sky/30 text-sky hover:bg-sky/20 font-bold"
                        >
                          {t("dashboard.reviewCourse")} →
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-surface-2 p-8 text-center max-w-lg mx-auto">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 shadow-glow">
                  <Icon name="trophy" size={28} className="text-violet-400" />
                </div>
                <h3 className="text-base font-extrabold text-ink-hi text-balance max-w-[340px] mx-auto leading-snug">
                  {t("dashboard.motivationalCompletedTitle")}
                </h3>
                <Button
                  onClick={() => navigate("/courses")}
                  className="mt-5 font-bold shadow-glow"
                >
                  {t("dashboard.exploreBtn")} →
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* ── TAB 4: ALL QUIZ ATTEMPTS & HIGH SCORES ──────────────────────── */}
        {activeTab === "quizzes" && (
          <Card className="p-5 sm:p-8 animate-fade-in border-violet-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 border-b border-white/[0.08] pb-4 mb-6">
              <SectionHead
                icon="trophy"
                tone="violet"
                title={`${t("dashboard.allQuizzesTitle")} (${quizScores.length})`}
                desc={t("dashboard.allQuizzesDesc")}
              />
              <Button onClick={() => navigate("/quiz")} size="md" className="w-full sm:w-auto font-bold flex-none">
                {t("dashboard.takeNewQuizBtn")}
              </Button>
            </div>

            {quizScores.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {quizScores.map((q) => {
                  const localizedTitle = q.quizId
                    ? getLocalizedQuiz({ id: q.quizId, title: q.title }, t)?.title || q.title
                    : q.title;
                  return (
                    <div
                      key={q.quizId || q.title}
                      className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3 rounded-xl border border-white/10 bg-surface-2 shadow-clay-sm p-4 hover:bg-surface-3 transition-colors"
                    >
                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-sm sm:text-base text-ink-hi">{localizedTitle}</h3>
                        <p className="text-xs text-ink-low mt-0.5">{t("dashboard.highScoreRecord")}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-none w-full sm:w-auto justify-center">
                        <span className="rounded-lg border border-violet-500/30 bg-violet-500/20 px-3 py-1 text-sm font-extrabold text-violet-300">
                          {q.score} XP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center max-w-md mx-auto">
                <p className="text-sm text-ink-low mb-3">{t("dashboard.noQuizDesc")}</p>
                <Button
                  onClick={() => navigate("/quiz")}
                  className="font-bold shadow-glow"
                >
                  {t("dashboard.takeNewQuizBtn")}
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* ── TAB 5: UNENROLLED COURSES (soft-unenroll, rejoinable) ───────── */}
        {activeTab === "unenrolled" && (
          <Card className="p-5 sm:p-8 animate-fade-in border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 border-b border-white/[0.08] pb-4 mb-6">
              <SectionHead
                icon="x-circle"
                tone="violet"
                title={`${t("dashboard.tabUnenrolled")} (${unenrolledCourses.length})`}
                desc={t("dashboard.unenrolledDesc")}
              />
            </div>

            {unenrolledCourses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {unenrolledCourses.map((c) => {
                  const localizedTitle = t(`courseData.${c.courseId}.title`, c.title);
                  const img = getCourseImage(c.courseId);
                  const done = c.completedModules ? c.completedModules.length : 0;
                  const total = c.totalModules || 4;
                  const pct = Math.round((done / total) * 100);
                  return (
                    <div key={c.courseId} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-surface shadow-clay p-5">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                        {img ? (
                          <img src={img} alt="" className="h-14 w-14 flex-none rounded-xl border border-white/10 object-cover shadow-sm" />
                        ) : (
                          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-xl bg-violet-500/15 text-lg font-black text-violet-300">
                            {getCourseCategory(c.courseId).charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1 w-full">
                          <h3 className="text-sm sm:text-base font-bold text-ink-hi text-center sm:text-left">{localizedTitle}</h3>
                          <p className="mt-0.5 text-xs text-ink-low text-center sm:text-left">
                            {t("dashboard.stepCounter", { current: done, total })}
                            <span className="mx-1.5 text-ink-faint">·</span>
                            <span className="font-bold text-violet-400">{pct}%</span>
                          </p>
                          <p className="mt-1 text-[11px] text-ink-faint text-center sm:text-left">{t("dashboard.unenrolledHint")}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center border-t border-white/[0.06] pt-3 sm:justify-end">
                        <Button size="md" onClick={() => handleRejoin(c)} className="w-full font-bold sm:w-auto">
                          <Icon name="refresh-cw" size={14} /> {t("dashboard.rejoin")}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon="book-open" title={t("dashboard.unenrolledEmptyTitle")} description={t("dashboard.unenrolledEmptyDesc")} />
            )}
          </Card>
        )}

        {/* ── ROW 6 — Account Control Danger Zone ─────────────────────────── */}
        <Card
          className="animate-fade-up border-state-danger/20 bg-state-danger/[0.02] p-6"
          style={{ animationDelay: "0.32s" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-state-danger">
                <Icon name="alert-triangle" size={16} />
                {t("dashboard.dangerZoneTitle")}
              </h3>
              <p className="mt-1 max-w-xl text-xs text-ink-low leading-relaxed">
                {t("dashboard.dangerZoneDesc")}
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                playWarningAlert();
                setShowDeleteModal(true);
              }}
              className="flex-none self-start sm:self-center font-bold"
            >
              <Icon name="trash-2" size={14} />
              {t("dashboard.deleteProfileBtn")}
            </Button>
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          UNENROLL & DELETE MODALS
          ══════════════════════════════════════════════════════════════════ */}

      {/* Unenroll Modal */}
      {courseToUnenroll && (
        <Modal
          isOpen={!!courseToUnenroll}
          onClose={() => setCourseToUnenroll(null)}
          title={t("dashboard.unenrollModalTitle")}
          onAction={handleUnenrollConfirm}
          actionText={t("dashboard.unenrollBtn")}
          actionVariant="danger"
          loading={unenrollLoading}
        >
          <p className="text-sm text-ink-low">
            {t("dashboard.unenrollModalText", { title: courseToUnenroll.title })}
          </p>
        </Modal>
      )}

      {/* Delete Profile Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            if (!deleteLoading) {
              setShowDeleteModal(false);
              setDeleteConfirmText("");
              setDeletePassword("");
            }
          }}
          title={t("dashboard.deleteModalTitle")}
          icon="alert-octagon"
          isDestructive
          onAction={handleDeleteProfile}
          actionText={t("dashboard.deleteConfirmBtn")}
          actionVariant="danger"
          loading={deleteLoading}
          actionDisabled={
            deleteConfirmText.trim().toUpperCase() !== "DELETE" ||
            (getReauthMethod(currentUser) === "password" && !deletePassword)
          }
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-state-danger/25 bg-state-danger/[0.08] p-4 text-xs leading-relaxed text-state-danger">
              <p className="mb-1 font-bold text-state-danger">{t("dashboard.deleteWarningTitle")}</p>
              <p>{t("dashboard.deleteWarningText")}</p>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-semibold uppercase tracking-wider text-ink-hi">
                {t("dashboard.deleteListHeading")}
              </p>
              <ul className="space-y-1.5 pl-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="flex items-center gap-2 text-state-danger">
                    <Icon name="x-circle" size={14} className="flex-none text-state-danger" />
                    {t(`dashboard.deleteList${n}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/[0.06] pt-3">
              <label className="mb-1.5 block text-xs font-semibold text-ink-hi">
                {t("dashboard.deleteConfirmLabel", { keyword: "" })}
                {" "}
                <span className="font-mono font-bold text-state-danger">DELETE</span>
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t("dashboard.deleteConfirmPlaceholder")}
                disabled={deleteLoading}
                aria-label={t("dashboard.deleteConfirmPlaceholder")}
                className="w-full rounded-lg border border-state-danger/25 bg-surface-2 px-3 py-2 text-xs font-mono text-ink-hi placeholder:text-ink-faint focus:border-state-danger focus:outline-none"
              />
            </div>

            {/* Firebase only deletes an account after a recent sign-in, so the
                user confirms who they are before anything is removed. */}
            {getReauthMethod(currentUser) === "password" ? (
              <div>
                <label htmlFor="delete-password" className="mb-1.5 block text-xs font-semibold text-ink-hi">
                  {t("dashboard.deletePasswordLabel")}
                </label>
                <input
                  id="delete-password"
                  type="password"
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder={t("dashboard.deletePasswordPlaceholder")}
                  disabled={deleteLoading}
                  className="w-full rounded-lg border border-state-danger/25 bg-surface-2 px-3 py-2 text-xs text-ink-hi placeholder:text-ink-faint focus:border-state-danger focus:outline-none"
                />
              </div>
            ) : (
              <p className="text-xs text-ink-low">{t("dashboard.deleteGoogleHint")}</p>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Dashboard;
