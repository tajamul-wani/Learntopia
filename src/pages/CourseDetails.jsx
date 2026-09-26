import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, useBlocker } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../context/GamificationContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import { toast } from "../context/ToastContext";
import { useNavChrome } from "../context/NavChromeContext";
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, deleteField, increment, arrayUnion } from "firebase/firestore";
import { COURSES } from "../data/coursesData";
import { getLocalizedCourse } from "../utils/localizationUtils";
import { moduleGrant } from "../utils/xpGrants";
import { canLearn, primaryAction } from "../utils/enrollmentState";
import { courseSkills } from "../utils/courseFacts";
import { useScrollToTopOn } from "../hooks/useScrollToTop";
import { enroll, restart as restartCourse } from "../services/enrollment";
import CoursePreview from "../Components/CoursePreview";
import Card from "../Components/ui/Card";
import Button from "../Components/ui/Button";
import Icon from "../Components/ui/Icon";
import ImageWithSkeleton from "../Components/ui/ImageWithSkeleton";
import { Skeleton } from "../Components/ui/Skeleton";
import Modal from "../Components/ui/Modal";
import LessonPlayer from "../Components/LessonPlayer";
import ExerciseEngine from "../Components/ExerciseEngine";
import AIChatDrawer from "../Components/AIChatDrawer";
import BotAvatar from "../Components/BotAvatar";
import TutorLauncher from "../Components/TutorLauncher";
import CourseEnterOverlay from "../Components/CourseEnterOverlay";
import CourseFacts from "../Components/CourseFacts";
import { courseTint } from "../utils/courseTint";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, isAdmin } = useAuth();
  const { grantXp, awardCourseCompletion, awardSharpMemory } = useGamification();
  const { playClick } = useSound();
  const { t } = useLanguage();

  const course = useMemo(() => {
    const c = COURSES.find((item) => item.id.toString() === id);
    return c ? getLocalizedCourse(c, t) : null;
  }, [id, t]);

  const topics = useMemo(() => courseSkills(course), [course]);

  const [completedModules, setCompletedModules] = useState([]);
  // Modules that have EVER paid out XP, and whether the +100 completion bonus was
  // ever granted. These persist across a course restart (unlike completedModules,
  // which resets), so replaying a course lets the user re-learn without re-earning.
  const [xpAwardedModules, setXpAwardedModules] = useState([]);
  const [courseXpAwarded, setCourseXpAwarded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  // Held true from the moment someone joins until the doorway animation ends,
  // so the preview never flickers into the course behind the overlay.
  const [entering, setEntering] = useState(false);
  // The enrolment document, or null. Opening this page used to CREATE one,
  // which enrolled anyone who so much as looked at a course — and could land
  // after progress had loaded and overwrite it.
  const [enrolment, setEnrolment] = useState(null);
  const [joining, setJoining] = useState(false);
  
  const [activeTab, setActiveTab] = useState("overview");

  // Switching tabs and crossing from the preview into the course both replace
  // the whole page without changing the route. Keyed on both so either one
  // starts the new view at its top rather than wherever the button was.
  useScrollToTopOn(`${activeTab}:${canLearn(enrolment)}`);

  // Track answers for the current active module's exercises: { exerciseIndex: selectedOption }
  // Track whether user has completed the lesson phase for the active module
  const [lessonPhase, setLessonPhase] = useState(true);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  const handleBackToCourses = () => {
    playClick();
    navigate("/courses");
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      activeTab === "syllabus" && currentLocation.pathname !== nextLocation.pathname
  );

  // Tuck the mobile bottom bar away while a module is open, so the UI stops offering
  // the navigation Strict Focus Mode exists to block.
  const { setImmersive } = useNavChrome();
  useEffect(() => {
    setImmersive(activeTab === "syllabus");
    return () => setImmersive(false);
  }, [activeTab, setImmersive]);

  const handleTabSwitch = (tab) => {
    playClick();
    if (activeTab === "syllabus" && tab !== "syllabus") {
      setPendingTab(tab);
      setShowLeaveModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    const c = COURSES.find((c) => c.id.toString() === id);
    if (!c) {
      navigate("/courses", { replace: true });
      return;
    }

    // Read only. Joining a course is now something a learner does on purpose,
    // through the preview's one button.
    const load = async () => {
      const total = c.syllabus.length;
      if (!currentUser) {
        setLoadingData(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "Users", currentUser.uid, "enrolledCourses", c.id.toString()));
        const data = snap.exists() ? snap.data() : null;
        setEnrolment(data);
        if (data) {
          const done = Array.isArray(data.completedModules) ? data.completedModules : [];
          setCompletedModules(done);
          setXpAwardedModules(Array.isArray(data.xpAwardedModules) ? data.xpAwardedModules : []);
          setCourseXpAwarded(!!data.courseXpAwarded);
          setIsCompleted(!!data.completed);
          setExpandedIndex(done.length < total ? done.length : total - 1);
        } else {
          setExpandedIndex(0);
        }
      } catch (err) {
        console.error("Error loading course progress:", err);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [currentUser, authLoading, isAdmin, id, navigate, t]);

  const total = course?.syllabus?.length || 0;
  const progressPct = total ? Math.round((completedModules.length / total) * 100) : 0;
  const currentIndex = completedModules.length;
  const allDone = completedModules.length >= total && total > 0;

  const courseRef = () => {
    if (!currentUser?.uid || !course?.id) return null;
    return doc(db, "Users", currentUser.uid, "enrolledCourses", course.id.toString());
  };

  // First-try accuracy per module (from ExerciseEngine), used to accumulate a
  // course-wide accuracy for the Sharp Memory award. Keyed by module index.
  const moduleFirstStatsRef = useRef({});
  const recordFirstAttempt = (moduleIndex, correct, totalForModule) => {
    moduleFirstStatsRef.current[moduleIndex] = { correct, total: totalForModule };
  };

  const checkAnswersAndComplete = async (moduleIndex) => {
    if (saving) return;
    if (isAdmin) {
      toast.info(t("toasts.adminNotALearner"));
      return;
    }
    const ref = courseRef();
    if (!ref) return;

    // Can't re-submit a module already done in the current run.
    if (completedModules.includes(moduleIndex)) {
      toast.info(t("toasts.noNewXpModule"));
      return;
    }

    // Anti-farming: a module pays XP (and counts first-try accuracy) exactly ONCE,
    // ever. `xpAwardedModules` persists across a course restart, so replaying an
    // already-earned module still tracks progress but grants no new XP — the user
    // gets an encouraging nudge instead.
    const earnXp = !xpAwardedModules.includes(moduleIndex);

    // ExerciseEngine has already validated all answers are correct
    setSaving(true);
    const newCompleted = [...completedModules, moduleIndex];
    const stat = moduleFirstStatsRef.current[moduleIndex] || { correct: 0, total: 0 };
    try {
      await setDoc(
        ref,
        {
          completedModules: newCompleted,
          totalModules: total,
          progressUpdatedAt: new Date(),
          // First-try accuracy + the XP-awarded marker only move on the paid run.
          ...(earnXp
            ? {
                correctTotal: increment(stat.correct),
                answeredTotal: increment(stat.total),
                xpAwardedModules: arrayUnion(moduleIndex),
              }
            : {}),
        },
        { merge: true }
      );
      setCompletedModules(newCompleted);
      if (earnXp) setXpAwardedModules((prev) => [...prev, moduleIndex]);
      setLessonPhase(true);
      setExpandedIndex(newCompleted.length < total ? newCompleted.length : moduleIndex);

      if (earnXp) {
        // The amount lives with the grant now, so the client cannot choose it.
        grantXp(moduleGrant(course.id, moduleIndex), t("gamification.celReasonModule", { n: moduleIndex + 1 }));
      } else {
        toast.info(t("toasts.replayModuleNoXp"));
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    } finally {
      setSaving(false);
    }
  };

  const markCourseComplete = async () => {
    if (!allDone || saving) return;
    if (isAdmin) {
      toast.info(t("toasts.adminNotALearner"));
      return;
    }
    const ref = courseRef();
    if (!ref) return;
    // The +100 completion bonus pays out once, ever. Replaying a finished course
    // (after a restart) still shows the Trophy moment, just without new XP.
    const withXp = !courseXpAwarded;
    setSaving(true);
    try {
      await setDoc(
        ref,
        {
          completed: true,
          completedAt: new Date(),
          completedModules: course?.syllabus ? course.syllabus.map((_, i) => i) : [],
          totalModules: total,
          ...(withXp ? { courseXpAwarded: true } : {}),
        },
        { merge: true }
      );
      setIsCompleted(true);
      if (withXp) setCourseXpAwarded(true);

      // One Trophy moment for finishing the course; badge + XP persist quietly.
      // On a replay we still celebrate but skip the XP grant.
      await awardCourseCompletion(course, { withXp });

      // Sharp Memory: 90%+ first-try accuracy across the whole course. Read the
      // accumulated totals back from the doc so it holds across devices/sessions.
      try {
        const snap = await getDoc(ref);
        const d = snap.exists() ? snap.data() : {};
        const answered = Number(d.answeredTotal) || 0;
        const correct = Number(d.correctTotal) || 0;
        if (answered > 0 && correct / answered >= 0.9) {
          await awardSharpMemory();
        }
      } catch { /* award is best-effort */ }
    } catch (err) {
      console.error("Error completing course:", err);
    } finally {
      setSaving(false);
    }
  };

  const resetCourse = async () => {
    if (saving) return;
    if (isAdmin) {
      toast.info(t("toasts.adminNotALearner"));
      return;
    }
    const ref = courseRef();
    if (!ref) return;
    setSaving(true);
    try {
      await setDoc(
        ref,
        {
          completed: false,
          completedAt: deleteField(),
          completedModules: [],
          totalModules: total,
          progressUpdatedAt: new Date(),
        },
        { merge: true }
      );
      setCompletedModules([]);
      setIsCompleted(false);
      setExpandedIndex(0);
      setShowResetModal(false);
    } catch (err) {
      console.error("Error resetting course:", err);
    } finally {
      setSaving(false);
    }
  };

  /** Join, rejoin, or replay — whichever the preview offered. */
  const finishEntering = useCallback(() => setEntering(false), []);

  const handleStart = async () => {
    if (!currentUser) {
      navigate("/login", { state: { returnTo: `/course/${id}` } });
      return;
    }
    if (isAdmin) {
      toast.info(t("toasts.adminNotALearner"));
      return;
    }
    setJoining(true);
    setEntering(true);
    try {
      const action = primaryAction(enrolment);
      if (action === "restart") {
        await restartCourse(currentUser.uid, course.id);
        setCompletedModules([]);
        setIsCompleted(false);
        setEnrolment((prev) => ({ ...prev, completedModules: [], completed: false, unenrolled: false }));
      } else {
        const next = await enroll(currentUser.uid, course);
        setEnrolment(next);
        setCompletedModules(Array.isArray(next.completedModules) ? next.completedModules : []);
        setIsCompleted(!!next.completed);
      }
      setExpandedIndex(0);
      // Joining, rejoining and restarting are all decisions to start learning.
      // Landing back on the overview they just read puts the modules a click
      // away for no reason, so the curriculum is what they walk into. Someone
      // opening a course they are already in still arrives on the overview.
      setActiveTab("syllabus");
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error(t("toasts.loadDataFailed"));
      // The join failed, so there is no course to walk into.
      setEntering(false);
    } finally {
      setJoining(false);
    }
  };

  if (authLoading || loadingData || !course) {
    return (
      <div className="container-page py-16 text-ink-hi md:py-20">
        <Card className="mx-auto w-full max-w-4xl p-8">
          <Skeleton className="mb-6 h-32 w-full rounded-2xl" />
          <Skeleton className="mb-3 h-6 w-1/2" />
          <Skeleton className="mb-6 h-3 w-3/4" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </Card>
      </div>
    );
  }

  // Not joined, or joined and left: the lessons stay closed and the preview
  // does the asking. Reaching this URL directly used to open the whole course.
  // The doorway outlives the branch below: it is the second child of the
  // fragment either way, so React updates it in place instead of tearing it
  // down and restarting the animation the moment the course becomes available.
  // `ready` is the truth it waits on — the write has landed and the course can
  // actually be shown.
  const doorway = entering ? (
    <CourseEnterOverlay
      course={course}
      ready={!joining && canLearn(enrolment)}
      onDone={finishEntering}
    />
  ) : null;

  if (!canLearn(enrolment)) {
    return (
      <>
        <CoursePreview
          course={course}
          enrolment={enrolment}
          action={primaryAction(enrolment, { signedIn: !!currentUser })}
          onAction={handleStart}
          busy={joining}
        />
        {doorway}
      </>
    );
  }

  return (
    <>
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-4xl animate-fade-up">
        
        {/* Back Navigation */}
        <button 
          onClick={() => navigate("/courses")}
          className="group mb-8 flex items-center gap-2 text-sm font-bold text-ink-low transition-colors hover:text-sky"
        >
          <Icon name="arrow-left" size={16} className="transition-transform group-hover:-translate-x-1" />
          {t("courseDetails.backToCourses")}
        </button>

        {/* Shown while deciding, dropped once they are working: on the
            curriculum the course is chosen and this is all answered. */}
        {activeTab !== "syllabus" && (
        <div className="mb-10 flex flex-col items-center gap-8 md:flex-row md:items-start md:text-left text-center">
          <div className={`relative flex h-48 w-full max-w-[260px] sm:w-64 flex-none items-center justify-center overflow-hidden rounded-3xl border border-white/[0.06] p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.45)] ${courseTint(course)}`}>
            <ImageWithSkeleton
              src={course.image}
              alt=""
              imgClassName="max-h-full max-w-full object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-[1.05]"
            />
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <span className="inline-block rounded-full border border-white/10 bg-surface-2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky shadow-clay-sm">
                {course.category}
              </span>
            </div>
            
            <h1 className="mt-4 text-3xl/[1.25] font-extrabold tracking-tight text-ink-hi md:text-4xl/[1.2] lg:text-5xl/[1.15]">{course.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-ink-low md:text-lg">{course.desc}</p>

            {/* In the text column, so it starts where the title and description
                do. It lives here rather than full width because a meta line
                fits the column that four tiles did not. */}
            <CourseFacts course={course} className="mt-6 justify-center md:justify-start" />
          </div>
        </div>
        )}


        {/* On the curriculum, this one line is all the orientation needed. */}
        {activeTab === "syllabus" && (
          <h1 className="mb-5 text-2xl/[1.3] font-extrabold tracking-tight text-ink-hi sm:text-3xl/[1.25]">
            {course.title}
          </h1>
        )}

        {/* Progress bar */}
        <Card className="mb-10 p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-ink-hi">{t("dashboard.enrolled")}</span>
            <span className="font-bold tabular-nums text-sky">
              {completedModules.length} / {total} {t("courses.modules").toLowerCase()} · {progressPct}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full clay-inset">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-sky transition-[width] duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${progressPct}%` }}
            >
               {progressPct > 0 && (
                 <div className="absolute inset-0 w-full h-full bg-white/20 animate-pulse" />
               )}
            </div>
          </div>
        </Card>

        {/* Tabs Navigation */}
        <div className="mb-8 flex items-center justify-between border-b border-white/[0.08] pb-[1px]">
          <div className="flex gap-2">
            <button 
              onClick={() => handleTabSwitch("overview")}
              className={`whitespace-nowrap px-4 py-3 text-sm font-bold transition-all relative sm:px-5 ${
                activeTab === "overview"
                  ? "text-ink-hi" 
                  : "text-ink-low hover:text-ink-hi hover:bg-white/[0.02] rounded-t-lg"
              }`}
            >
              {t("courseDetails.overview")}
              {activeTab === "overview" && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-violet-500 rounded-t-full shadow-[0_0_10px_rgba(139,124,246,0.5)]" />
              )}
            </button>
            <button 
              onClick={() => handleTabSwitch("syllabus")}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-bold transition-all relative sm:px-5 ${
                activeTab === "syllabus"
                  ? "text-ink-hi" 
                  : "text-ink-low hover:text-ink-hi hover:bg-white/[0.02] rounded-t-lg"
              }`}
            >
              {t("courseDetails.curriculum")}
              {activeTab === "syllabus" && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-violet-500 rounded-t-full shadow-[0_0_10px_rgba(139,124,246,0.5)]" />
              )}
              {completedModules.length > 0 && !isCompleted && activeTab !== "syllabus" && (
                 <span className="flex h-2 w-2 rounded-full bg-sky animate-pulse" />
              )}
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="mb-1 hidden gap-2 whitespace-nowrap border-violet-500/30 text-xs font-semibold text-violet-300 hover:bg-violet-500/10 hover:text-white sm:inline-flex"
            onClick={handleBackToCourses}
          >
            <Icon name="arrow-left" size={14} />
            {t("courseDetails.backToCourses")}
          </Button>
        </div>

        {/* Tab Content: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="animate-fade-in">
            <div className="space-y-10">
              <section>
                <h3 className="mb-5 text-2xl font-bold leading-snug text-ink-hi">{t("courseDetails.takeaways")}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {course.learningObjectives?.map((obj, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-surface p-5 shadow-clay transition-colors hover:bg-surface-2 lg:gap-4 lg:p-6">
                      <Icon name="check-circle" size={20} className="mt-0.5 flex-none text-sky lg:h-6 lg:w-6" />
                      <span className="text-[0.9375rem] font-medium leading-relaxed text-ink-low lg:text-[1.0625rem]">{obj}</span>
                    </div>
                  ))}
                </div>
              </section>

              {topics.length > 0 && (
                <section>
                  <h3 className="mb-5 text-2xl font-bold leading-snug text-ink-hi">{t("courseDetails.topics")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-[0.8125rem] font-semibold text-violet-300 tablets:px-3.5 tablets:text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="mb-5 text-2xl font-bold leading-snug text-ink-hi">{t("courseDetails.prerequisites")}</h3>
                <ul className="space-y-3 rounded-2xl border border-white/10 bg-surface p-6 shadow-clay">
                  {course.prerequisites?.map((req, i) => (
                    <li key={i} className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink-low">
                      <div className="h-1.5 w-1.5 flex-none rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,124,246,0.8)]" />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

          </div>
        )}

        {/* Tab Content: SYLLABUS */}
        {activeTab === "syllabus" && (
          <div className="space-y-5 animate-fade-in">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold leading-snug text-ink-hi">{t("courseDetails.courseModules")}</h3>
                <p className="mt-1 text-sm text-ink-low">{t("courseDetails.moduleUnlockHint")}</p>
              </div>
            </div>
            
            <div className="relative">
              {/* Connecting spine of the journey (first node center to certificate). */}
              <div aria-hidden="true" className="pointer-events-none absolute bottom-8 left-8 top-8 hidden w-px -translate-x-1/2 bg-white/10 sm:block" />
              <div className="relative flex flex-col gap-5">
            {course.syllabus.map((module, moduleIndex) => {
              const done = moduleIndex < currentIndex || isCompleted;
              const active = moduleIndex === currentIndex && !isCompleted;
              const locked = moduleIndex > currentIndex && !isCompleted;
              const open = expandedIndex === moduleIndex && !locked;

              return (
                <div key={moduleIndex} className="flex items-start gap-3 sm:gap-4">
                  {/* Node on the spine */}
                  <div className="relative flex-none">
                    {active && (
                      <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-2xl bg-violet-500/25 [animation-duration:2s] sm:rounded-[20px]" />
                    )}
                    <div
                      className={`relative grid h-11 w-11 place-items-center rounded-2xl font-display text-base font-bold shadow-clay-sm sm:h-16 sm:w-16 sm:rounded-[20px] sm:text-lg ${
                        done
                          ? "bg-state-success text-ground"
                          : active
                          ? "bg-violet-600 text-white"
                          : "bg-surface-2 text-ink-low"
                      }`}
                    >
                      {done ? <Icon name="check" size={20} className="h-5 w-5 sm:h-6 sm:w-6" /> : locked ? <Icon name="lock" size={16} className="h-4 w-4 sm:h-[18px] sm:w-[18px]" /> : moduleIndex + 1}
                    </div>
                  </div>

                  {/* Module content */}
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => {
                        if (open) setExpandedIndex(-1);
                        else {
                          setExpandedIndex(moduleIndex);
                          if (active) setLessonPhase(true);
                        }
                      }}
                      className={`flex w-full items-start justify-between gap-3 pt-1.5 text-left ${locked ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="min-w-0">
                        <h3 className={`text-lg font-bold leading-snug ${locked ? "text-ink-low" : "text-ink-hi"}`}>{module.title}</h3>
                        <p className="mt-1 line-clamp-1 text-sm text-ink-low">
                          {locked ? t("courseDetails.completePreviousToUnlock") : module.desc}
                        </p>
                        {done && !open && (
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-extrabold text-state-success shadow-clay-sm">
                            <Icon name="check" size={12} /> Done
                          </span>
                        )}
                        {active && !open && (
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-clay-btn">
                            <Icon name="play" size={13} /> Continue
                          </span>
                        )}
                      </div>
                      {!locked && (
                        <Icon
                          name="chevron-down"
                          size={20}
                          className={`mt-1.5 flex-none text-ink-low transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>

                    {/* Expanded body — same lesson/exercise flow, now inside the journey node */}
                    {open && (
                      <div className="mt-4 -ml-14 rounded-2xl border border-white/10 bg-surface p-4 shadow-clay sm:ml-0 sm:p-5 md:p-6">
                        {active && lessonPhase && module.contentSections?.length > 0 && (
                          <div className="mb-8">
                            <LessonPlayer
                              sections={module.contentSections}
                              moduleName={module.title}
                              onComplete={() => setLessonPhase(false)}
                            />
                          </div>
                        )}

                        {done && (
                          <div className="mb-8 space-y-4">
                            <div className="mb-2 flex items-center gap-2">
                              <Icon name="book-open" size={18} className="text-violet-400" />
                              <span className="text-sm font-bold text-ink-low">Lesson content ({module.contentSections?.length || 0} steps completed)</span>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {module.contentSections?.map((section, idx) => (
                                <div key={idx} className="flex items-start gap-2 rounded-xl border border-white/10 bg-surface-2 px-4 py-3 text-sm text-ink-low shadow-clay-sm">
                                  <Icon name="check-circle" size={14} className="mt-0.5 flex-none text-state-success" />
                                  <span className="min-w-0 break-words">{section.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!active || !lessonPhase || !module.contentSections?.length) && (
                          <ExerciseEngine
                            exercises={module.exercises || []}
                            isCompleted={done}
                            saving={saving}
                            onFirstAttempt={(correct, totalForModule) => recordFirstAttempt(moduleIndex, correct, totalForModule)}
                            onAllCorrect={() => checkAnswersAndComplete(moduleIndex)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

                {/* Leo, cheering them on toward the finish line */}
                <div className="flex items-end gap-3">
                  <div className="flex-none">
                    <BotAvatar size="sm" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md border border-white/10 bg-surface px-4 py-2.5 text-sm font-semibold text-ink shadow-clay-sm">
                    {isCompleted
                      ? t("courseDetails.journeyDone")
                      : t("courseDetails.journeyProgress", { done: completedModules.length, total })}
                  </div>
                </div>

                {/* Certificate — the finish line */}
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`grid h-11 w-11 flex-none place-items-center rounded-2xl shadow-clay-sm sm:h-16 sm:w-16 sm:rounded-[20px] ${isCompleted ? "bg-state-warning text-ground" : "bg-surface-2 text-ink-low"}`}>
                    <Icon name="graduation-cap" size={22} />
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 sm:pt-2.5">
                    <h3 className={`text-lg font-bold leading-snug ${isCompleted ? "text-ink-hi" : "text-ink-low"}`}>{t("courseDetails.certificate")}</h3>
                    <p className="mt-1 text-sm text-ink-low">
                      {isCompleted ? t("courseDetails.certificateEarned") : t("courseDetails.certificateLocked")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nothing to claim until every module is done, so until then there
                is no button to explain or grey out — the journey above already
                says what is left. Finishing the last module is what makes this
                appear, which is the whole reward moment. */}
            {allDone && !isCompleted && (
              <div className="mt-8 flex animate-scale-up flex-col items-center gap-4 rounded-2xl border border-state-success/25 bg-state-success/[0.06] px-5 py-6 text-center shadow-clay-sm sm:px-8">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-state-success/15 text-state-success">
                  <Icon name="trophy" size={24} />
                </span>
                <p className="text-base font-bold text-ink-hi sm:text-lg">
                  {t("courseDetails.certificateReady")}
                </p>
                <Button
                  onClick={markCourseComplete}
                  loading={saving}
                  className="w-full gap-2 shadow-[0_0_18px_rgba(139,124,246,0.35)] sm:w-auto"
                >
                  <Icon name="award" size={17} />
                  {t("courseDetails.markComplete")}
                </Button>
              </div>
            )}

            {isCompleted && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => setShowResetModal(true)}
                  className="w-full gap-2 sm:w-auto"
                >
                  <Icon name="refresh-cw" size={16} />
                  {t("courses.restart")}
                </Button>
              </div>
            )}

          </div>
        )}
      </div>

      <Modal
        isOpen={showLeaveModal || blocker?.state === "blocked"}
        onClose={() => {
          if (blocker?.state === "blocked") blocker.reset();
          setShowLeaveModal(false);
          setPendingTab(null);
        }}
        title={t("modals.leaveTitle")}
        icon="alert-triangle"
        actionText={t("modals.leaveAction")}
        actionVariant="danger"
        isDestructive={true}
        onAction={() => {
          if (blocker?.state === "blocked") {
            blocker.proceed();
          } else if (pendingTab) {
            setActiveTab(pendingTab);
          }
          setShowLeaveModal(false);
          setPendingTab(null);
        }}
      >
        <p className="mb-4 text-ink-hi">{t("modals.leaveBody")}</p>
        <div className="rounded-xl border border-white/10 bg-surface-2 p-4 text-sm shadow-clay-sm">
          <ul className="list-disc pl-5 space-y-1 text-ink-low">
            <li>{t("modals.leaveResetPre")}<strong className="text-white">{t("modals.leaveResetBold")}</strong>{t("modals.leaveResetPost")}</li>
            <li>{t("modals.leaveSavedPre")}<strong className="text-state-success">{t("modals.leaveSavedBold")}</strong>{t("modals.leaveSavedPost")}</li>
          </ul>
        </div>
      </Modal>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title={t("modals.resetTitle")}
        icon="refresh-cw"
        actionText={t("modals.resetAction")}
        actionVariant="primary"
        onAction={resetCourse}
        loading={saving}
      >
        <p className="mb-4 text-ink-hi">{t("modals.resetBody")}</p>
        <div className="rounded-xl border border-state-warning/20 bg-state-warning/10 p-4 text-sm">
          <div className="flex items-start gap-3 text-state-warning">
            <Icon name="alert-triangle" size={18} className="mt-0.5 flex-none" />
            <div className="leading-relaxed">
              <span className="font-bold">{t("modals.resetWarnLabel")}</span>{t("modals.resetWarnText")}
            </div>
          </div>
        </div>
      </Modal>

      <TutorLauncher
        courseId={course.id}
        onOpen={() => setShowAIDrawer(true)}
      />

      <AIChatDrawer
        isOpen={showAIDrawer}
        onClose={() => setShowAIDrawer(false)}
        course={course}
        currentModule={course?.syllabus?.[expandedIndex]}
      />

    </div>
    {doorway}
    </>
  );
};

export default CourseDetails;
