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
import ProfileHeader from "./profile/ProfileHeader";
import ProfileTabs from "./profile/ProfileTabs";
import LearningPanel from "./profile/LearningPanel";
import FinishedPanel from "./profile/FinishedPanel";
import QuizzesPanel from "./profile/QuizzesPanel";
import AccountPanel from "./profile/AccountPanel";
import { parseProfileName } from "../utils/profileUtils";
import { localizeBadgeName, localizeBadgeDesc } from "../utils/badgeI18n";


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

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logOut } = useAuth();
  const {
    xp, levelInfo, badges: gamificationBadges, streak,
    profile, photoURL, usePhoto,
  } = useGamification();
  const { playWarningAlert } = useSound();
  const { t } = useLanguage();

  // ── state ─────────────────────────────────────────────────────────────────
  // Whether THIS user is currently the overall #1 (drives the dynamic Champion
  // medallion). Champion is not a stored badge — it reflects live standing only.
  const [isChampion, setIsChampion] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // "account" | "learning" | "finished" | "quizzes"
  const [activeTab, setActiveTab] = useState("account");

  // Modals & Actions
  const [courseToUnenroll, setCourseToUnenroll] = useState(null);
  // The course just paused, so the panel can move the learner to where it went.
  const [justPausedId, setJustPausedId] = useState(null);
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
      setJustPausedId(courseToUnenroll.courseId);
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
      setActiveTab("learning");
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

  // The course closest to done, so Finished can point forward. Null when there
  // is nothing in progress, in which case that card is simply not drawn.
  const nearestFinish = useMemo(() => {
    let best = null;
    for (const course of activeCourses) {
      const done = Array.isArray(course.completedModules) ? course.completedModules.length : 0;
      const total = Number(course.totalModules) || 0;
      if (total <= 0) continue;
      const percent = Math.min(100, Math.round((done / total) * 100));
      if (!best || percent > best.percent) best = { course, title: course.title, percent };
    }
    return best;
  }, [activeCourses]);

  const { displayName: parsedDisplayName, avatarId: parsedAvatarId } = parseProfileName(
    userDetails || profile,
    currentUser?.displayName || "Learner"
  );

  const studentName = parsedDisplayName || userDetails?.fullName || currentUser?.displayName || "Learner";

  // Days of week for the streak tracker — fills only days within the current streak.

  // Achievements — GitHub-style medallions derived from real data (earned only).
  const achievements = useMemo(() => {
    const list = [];
    const seen = new Set();
    // Dedup by a stable, language-independent id (NOT the translated label), so
    // switching language can never surface a duplicate badge. `desc` becomes the
    // medallion's title tooltip explaining how the badge was earned.
    // `earnedAt` exists only for badges the server awarded and stored. The
    // derived ones are recomputed from progress on every render, so there is no
    // moment to record; the panel says so rather than inventing a date.
    const add = (id, icon, label, tone, desc, earnedAt = null) => {
      if (seen.has(id)) return;
      seen.add(id);
      list.push({ id, icon, label, tone, desc: desc || label, earnedAt });
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
      add(id, icon, label, "violet", desc, typeof b === "object" ? b.earnedAt || null : null);
    });
    return list;
  }, [quizScores, completedCourses, levelInfo, gamificationBadges, isChampion, t]);


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


  return (
    <div className="container-page py-8 text-ink-hi md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:gap-8">

        {/* The learner has not chosen a name or a picture yet, so the
            leaderboard has nothing to show for them. */}
        {(!parsedDisplayName || !parsedAvatarId) && (
          <Card className="flex flex-col gap-3 border-gold-500/25 bg-gold-500/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-gold-500/[0.14] text-gold-400">
                <Icon name="alert-triangle" size={17} />
              </span>
              <p className="min-w-0 text-[0.8125rem] leading-relaxed text-ink">
                {t("dashboard.incompleteProfileDesc")}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setEditingProfile(true)}
              className="flex-none self-start font-bold sm:self-center"
            >
              {t("profile.editProfile")}
            </Button>
          </Card>
        )}

        {/* One header for every tab: who they are and how far they have come.
            It sits on its own clay card so it reads as a thing, not as text
            floating above the tabs. */}
        <Card className="p-5 sm:p-6">
          <ProfileHeader
            name={studentName}
            avatarId={parsedAvatarId}
            photoURL={usePhoto ? photoURL : null}
            level={levelInfo.level}
            xp={xp}
            xpInLevel={levelInfo.xpInLevel}
            xpNeeded={levelInfo.xpNeeded}
            progressPct={levelInfo.progressPct}
            nextLevel={levelInfo.nextLevel?.level}
              streak={streak}
              onEdit={() => setEditingProfile(true)}
            />
        </Card>

        <ProfileTabs
          active={activeTab}
          onChange={setActiveTab}
          counts={{
            account: achievements.length,
            learning: activeCourses.length + unenrolledCourses.length,
            finished: completedCourses.length,
            quizzes: quizScores.length,
          }}
        />

        <div data-testid={`profile-panel-${activeTab}`} className="animate-fade-in">
          {activeTab === "learning" && (
            <LearningPanel
              active={activeCourses}
              paused={unenrolledCourses}
              justPausedId={justPausedId}
              onOpen={(course) => navigate(`/course/${course.courseId}?tab=syllabus`)}
              onPause={(course) => setCourseToUnenroll(course)}
              onRejoin={handleRejoin}
              onBrowse={() => navigate("/courses")}
            />
          )}

          {activeTab === "finished" && (
            <FinishedPanel
              finished={completedCourses}
              nearest={nearestFinish}
              onOpen={(course) => navigate(`/course/${course.courseId}`)}
              onBrowse={() => navigate("/courses")}
            />
          )}

          {activeTab === "quizzes" && (
            <QuizzesPanel
              quizzes={quizScores}
              onTake={(quizId) => navigate(quizId ? `/quiz?quiz=${quizId}` : "/quiz")}
            />
          )}

          {activeTab === "account" && (
            <AccountPanel
              streak={streak}
              activeDays={userDetails?.activeDays}
              achievements={achievements}
              lottieFor={(icon) => ACH_LOTTIE[icon]}
              lottieClassFor={(icon) => ACH_LOTTIE_CLASS[icon]}
              onBrowse={() => navigate("/courses")}
              onSignOut={handleLogout}
              onDelete={() => {
                playWarningAlert();
                setShowDeleteModal(true);
              }}
            />
          )}
        </div>
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
