import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useBlocker } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";
import { quizzes } from "../data/quizData";
import { getLocalizedQuiz } from "../utils/localizationUtils";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import { useGamification } from "../context/GamificationContext";
import { toast } from "../context/ToastContext";
import { useNavChrome } from "../context/NavChromeContext";
import Card from "../Components/ui/Card";
import Button from "../Components/ui/Button";
import Badge from "../Components/ui/Badge";
import SectionHeading from "../Components/ui/SectionHeading";
import Alert from "../Components/ui/Alert";
import Icon from "../Components/ui/Icon";
import Modal from "../Components/ui/Modal";
import { Skeleton } from "../Components/ui/Skeleton";

const Quiz = () => {
  const { playClick, playCorrect, playIncorrect, playLevelUp, playTimerTick, playTimerUrgent } = useSound();
  const { t } = useLanguage();
  const { addXP, awardPerfectScore, awardSharpMemory } = useGamification();

  // Localize quiz metadata + questions/options for the active language.
  const localizedQuizzes = useMemo(() => quizzes.map((q) => getLocalizedQuiz(q, t)), [t]);

  // Core game state
  const [screen, setScreen] = useState("selection"); // 'selection' | 'active' | 'results'
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  const [showQuitModal, setShowQuitModal] = useState(false);

  // Compute exact score dynamically from userAnswers map (no stale closure bug)
  const score = activeQuiz
    ? activeQuiz.questions.reduce((acc, q, idx) => {
        return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
      }, 0)
    : 0;

  // Block navigation when a quiz is active
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      screen === "active" && currentLocation.pathname !== nextLocation.pathname
  );

  // Tuck the mobile bottom bar away while a quiz is running, so the UI stops offering
  // the navigation Strict Focus Mode exists to block.
  const { setImmersive } = useNavChrome();
  useEffect(() => {
    setImmersive(screen === "active");
    return () => setImmersive(false);
  }, [screen, setImmersive]);

  // Timer (15s per question)
  const [timeLeft, setTimeLeft] = useState(15);

  // Firebase / user state
  const { currentUser } = useAuth();
  const [highScores, setHighScores] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [loadingScores, setLoadingScores] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // Scaled XP based on quiz score percentage
  const getScaledXP = (correctCount, totalQuestions) => {
    if (correctCount === 0) return 0;
    const pct = (correctCount / totalQuestions) * 100;
    if (pct === 100) return 100;
    if (pct >= 80) return 80;
    if (pct >= 60) return 60;
    if (pct >= 40) return 40;
    return 20;
  };

  // Save score to Firestore with fail-safe merge and incremental retake XP
  const saveScore = async (finalScore) => {
    if (!currentUser || !activeQuiz) return;
    setIsSaving(true);
    try {
      const totalQ = activeQuiz.questions.length;
      const previousBest = highScores[activeQuiz.id] || 0;

      const prevMaxXP = getScaledXP(previousBest, totalQ);
      const newMaxXP = getScaledXP(finalScore, totalQ);

      // Incremental XP is awarded ONLY for new correct answers exceeding previous best score!
      const incrementalXP = Math.max(0, newMaxXP - prevMaxXP);
      setXpEarned(incrementalXP);

      const attempt = {
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        score: finalScore,
        totalQuestions: totalQ,
        xpEarned: incrementalXP,
        completedAt: new Date(),
      };

      await addDoc(
        collection(db, "Users", currentUser.uid, "quizAttempts"),
        attempt
      );

      // Perfect Score badge for a full-mark quiz (deduped in awardBadge).
      if (finalScore === totalQ) awardPerfectScore();

      // Sharp Memory: near-perfect (at most one mistake) on two or more quizzes.
      const bestByQuiz = { ...highScores, [activeQuiz.id]: Math.max(highScores[activeQuiz.id] || 0, finalScore) };
      const sharpCount = Object.entries(bestByQuiz).filter(([qid, best]) => {
        const q = quizzes.find((x) => x.id === qid);
        const totalForQuiz = q?.questions?.length || 0;
        return totalForQuiz > 0 && best >= totalForQuiz - 1;
      }).length;
      if (sharpCount >= 2) awardSharpMemory();

      if (incrementalXP > 0) {
        // Award ONLY the new incremental XP through GamificationContext
        await addXP(incrementalXP, t("gamification.celReasonQuiz", { title: activeQuiz.title }));

        // Sync to global QuizLeaderboard with the overall best score
        const globalScoreRef = doc(db, "QuizLeaderboards", activeQuiz.id, "Scores", currentUser.uid);
        await setDoc(globalScoreRef, {
          score: newMaxXP,
          rawScore: Math.max(previousBest, finalScore),
          userFullName: currentUser.displayName || "User",
          userId: currentUser.uid,
          completedAt: new Date()
        }, { merge: true });

        setHighScores((prev) => ({
          ...prev,
          [activeQuiz.id]: Math.max(previousBest, finalScore),
        }));
      } else {
        // Retake scored equal to or less than previous best score — 0 XP awarded.
        toast.info(t("toasts.noNewXpQuiz"));
        setHighScores((prev) => ({
          ...prev,
          [activeQuiz.id]: Math.max(previousBest, finalScore),
        }));
      }
    } catch (err) {
      console.error("Error saving score:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle option selection
  const handleAnswerSelect = useCallback(
    (option) => {
      if (isAnswerSubmitted) return;

      const currentQuestion = activeQuiz.questions[currentQuestionIdx];
      const isCorrect = option === currentQuestion.correctAnswer;

      setSelectedAnswer(option);
      setIsAnswerSubmitted(true);
      setUserAnswers((prev) => ({ ...prev, [currentQuestionIdx]: option }));

      if (isCorrect) {
        playCorrect();
      } else {
        playIncorrect();
      }
    },
    [isAnswerSubmitted, activeQuiz, currentQuestionIdx, playCorrect, playIncorrect]
  );

  const startQuiz = (quiz) => {
    playClick();
    const QUESTIONS_PER_QUIZ = 10;
    const shuffledQuestions = [...quiz.questions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_QUIZ);
    
    const sessionQuiz = {
      ...quiz,
      questions: selectedQuestions
    };

    setActiveQuiz(sessionQuiz);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScreen("active");
  };

  const handleNext = () => {
    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < activeQuiz.questions.length) {
      playClick();
      setCurrentQuestionIdx(nextIdx);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      playLevelUp();
      const finalScore = activeQuiz.questions.reduce((acc, q, idx) => {
        return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
      }, 0);
      setScreen("results");
      if (currentUser) {
        saveScore(finalScore);
      }
    }
  };

  const getGradingFeedback = () => {
    const pct = (score / activeQuiz.questions.length) * 100;
    if (pct === 100) return { title: t("quiz.gradeMasteryTitle"), msg: t("quiz.gradeMasteryMsg") };
    if (pct >= 80) return { title: t("quiz.gradeGreatTitle"), msg: t("quiz.gradeGreatMsg") };
    if (pct >= 60) return { title: t("quiz.gradeGoodTitle"), msg: t("quiz.gradeGoodMsg") };
    return { title: t("quiz.gradeKeepTitle"), msg: t("quiz.gradeKeepMsg") };
  };

  // Listen for auth state & fetch high scores
  useEffect(() => {
    if (currentUser) {
      setLoadingScores(true);
      const fetchScores = async () => {
        try {
          const q = collection(db, "Users", currentUser.uid, "quizAttempts");
          const snapshot = await getDocs(q);
          const scores = {};
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.quizId) {
              scores[data.quizId] = Math.max(scores[data.quizId] || 0, data.score);
            }
          });
          setHighScores(scores);
        } catch (err) {
          console.error("Error fetching high scores:", err);
        } finally {
          setLoadingScores(false);
        }
      };
      fetchScores();
    } else {
      setHighScores({});
    }
  }, [currentUser]);

  // Timer countdown
  useEffect(() => {
    if (screen !== "active" || isAnswerSubmitted || !activeQuiz) return;

    setTimeLeft(15);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswerSelect(null, true); // timeout
          return 0;
        }

        const nextVal = prev - 1;
        if (nextVal <= 5) {
          if (nextVal <= 3) {
            playTimerUrgent();
          } else {
            playTimerTick();
          }
        }
        return nextVal;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, currentQuestionIdx, isAnswerSubmitted, activeQuiz, handleAnswerSelect, playTimerTick, playTimerUrgent]);

  const urgent = timeLeft <= 5;

  return (
    <div className="container-page flex min-h-[80vh] flex-col items-center justify-center py-14 text-ink-hi">
      {/* SCREEN 1 — Selection */}
      {screen === "selection" && (
        <div className="w-full max-w-5xl animate-fade-in">
          <SectionHeading
            centered
            className="mb-10"
            title={t("quiz.title")}
            description={t("quiz.subtitle")}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {localizedQuizzes.map((quiz) => {
              const attempted = !loadingScores && highScores[quiz.id] !== undefined;
              return (
                <Card
                  key={quiz.id}
                  hoverable
                  className={`relative flex flex-col p-6 transition-all ${attempted ? "border-state-success/25" : ""}`}
                >
                  {/* Attempted badge — top-right corner */}
                  {attempted && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-state-success/30 bg-state-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-state-success">
                      <Icon name="check-circle" size={10} /> {t("quiz.done")}
                    </div>
                  )}

                  <Badge variant="sky" className="self-start">{quiz.subject}</Badge>
                  <h3 className="mt-4 text-lg font-bold text-ink-hi">{quiz.title}</h3>
                  <p className="mt-1.5 flex-grow text-sm leading-relaxed text-ink-low">{quiz.description}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <div className="text-xs">
                      {loadingScores ? (
                        <Skeleton className="h-4 w-24" />
                      ) : attempted ? (
                        <span className="flex items-center gap-1.5 font-semibold text-state-success">
                          <Icon name="trophy" size={14} /> {t("quiz.best", { score: highScores[quiz.id], total: Math.min(quiz.questions.length, 10) })}
                        </span>
                      ) : (
                        <span className="text-ink-low">{t("quiz.notAttempted")}</span>
                      )}
                    </div>
                    {attempted ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => startQuiz(quiz)}
                        className="flex items-center gap-1.5 !border-state-success/30 !text-state-success hover:!bg-state-success/10"
                      >
                        <Icon name="refresh-cw" size={12} /> {t("quiz.retake")}
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => startQuiz(quiz)}>{t("quiz.start")}</Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* SCREEN 2 — Active */}
      {screen === "active" && activeQuiz && (
        <Card key={currentQuestionIdx} className="w-full max-w-2xl animate-fade-in p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky">{activeQuiz.title}</p>
              <h2 className="mt-1 text-base font-bold text-ink">
                {t("quiz.questionProgress", { current: currentQuestionIdx + 1, total: activeQuiz.questions.length })}
              </h2>
            </div>
              <span
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold tabular-nums ${
                  urgent
                    ? "animate-pulse border-state-danger/40 bg-state-danger/15 text-state-danger"
                    : "border-sky/30 bg-sky/10 text-sky"
                }`}
              >
                <Icon name="clock" size={14} /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
          </div>

          {/* Timer bar */}
          <div className="mb-8 h-1.5 overflow-hidden rounded-full clay-inset">
            <div
              className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
                urgent ? "bg-state-danger" : "bg-gradient-to-r from-violet-500 to-sky"
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>

          <h3 className="mb-7 text-xl font-bold leading-snug text-ink-hi md:text-2xl">
            {activeQuiz.questions[currentQuestionIdx].questionText}
          </h3>

          <div className="grid gap-3">
            {activeQuiz.questions[currentQuestionIdx].options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === activeQuiz.questions[currentQuestionIdx].correctAnswer;

              let style = "border-white/10 bg-surface-2 shadow-clay-sm hover:border-violet-500 hover:bg-surface";
              if (isAnswerSubmitted) {
                if (isCorrectAnswer) style = "border-state-success bg-state-success/15 text-state-success";
                else if (isSelected) style = "border-state-danger bg-state-danger/15 text-state-danger";
                else style = "border-white/[0.05] opacity-60";
              } else if (isSelected) {
                style = "border-violet-500 bg-surface shadow-clay-sm";
              }

              return (
                <button
                  key={option}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleAnswerSelect(option)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200 md:text-base ${style}`}
                >
                  <span>{option}</span>
                  {isAnswerSubmitted && isCorrectAnswer && (
                    <span className="flex items-center gap-1 text-xs font-bold uppercase text-state-success"><Icon name="check" size={14} /> {t("exerciseEngine.correctTitle")}</span>
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <span className="flex items-center gap-1 text-xs font-bold uppercase text-state-danger"><Icon name="x" size={14} /> {t("exerciseEngine.incorrectTitle")}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="danger" onClick={() => setShowQuitModal(true)}>
              {t("quiz.quitBtn")}
            </Button>
            {isAnswerSubmitted ? (
              <Button onClick={handleNext}>
                {currentQuestionIdx + 1 === activeQuiz.questions.length ? t("quiz.submitQuiz") : t("quiz.nextQuestion")}
                <Icon name="arrow" size={16} />
              </Button>
            ) : (
              <div />
            )}
          </div>
        </Card>
      )}

      {/* SCREEN 3 — Results */}
      {screen === "results" && activeQuiz && (
        <Card className="w-full max-w-lg animate-fade-up p-8 text-center">
          <h2 className="text-2xl font-bold text-ink-hi md:text-3xl">{getGradingFeedback().title}</h2>
          <p className="mt-1.5 text-sm text-ink-low">{getGradingFeedback().msg}</p>

          <div className="mx-auto my-7 grid h-36 w-36 place-items-center rounded-full border-4 border-violet-600 bg-surface-2 shadow-clay-sm">
            <div>
              <span className="text-4xl font-extrabold text-ink-hi">{score}</span>
              <span className="text-xl text-ink-low"> / {activeQuiz.questions.length}</span>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-sky">
                {Math.round((score / activeQuiz.questions.length) * 100)}%
              </p>
            </div>
          </div>

          {!currentUser ? (
            <div className="mb-7 text-left">
              <Alert variant="warning" title={t("quiz.notSignedInTitle")}>
                {t("quiz.notSignedInMsg")}
                <div className="mt-2 flex gap-4">
                  <Link
                    to="/login"
                    state={{
                      returnTo: "/quiz",
                      pendingQuizResult: {
                        quizId: activeQuiz.id,
                        quizTitle: activeQuiz.title,
                        score: score,
                        totalQuestions: activeQuiz.questions.length,
                      }
                    }}
                    className="font-semibold text-sky underline"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/signUp"
                    state={{
                      returnTo: "/quiz",
                      pendingQuizResult: {
                        quizId: activeQuiz.id,
                        quizTitle: activeQuiz.title,
                        score: score,
                        totalQuestions: activeQuiz.questions.length,
                      }
                    }}
                    className="font-semibold text-sky underline"
                  >
                    {t("nav.signUp")}
                  </Link>
                </div>
              </Alert>
            </div>
          ) : (
            <div className="mb-7">
              {isSaving ? (
                <p className="animate-pulse text-sm text-ink-low">{t("quiz.savingScore")}</p>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-state-success">
                    <Icon name="check-circle" size={16} /> {t("quiz.resultsTitle")}
                  </p>
                  {xpEarned > 0 && (
                    <p className="flex items-center justify-center gap-1 text-xs font-bold text-violet-400">{t("quiz.xpEarned", { xp: xpEarned })} <Icon name="zap" size={14} /></p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => startQuiz(activeQuiz)}>{t("quiz.tryAgain")}</Button>
            <Button onClick={() => setScreen("selection")}>{t("quiz.backToQuizzes")}</Button>
          </div>
        </Card>
      )}

      {/* Modals */}
      <Modal
        isOpen={showQuitModal || blocker?.state === "blocked"}
        onClose={() => {
          if (blocker?.state === "blocked") blocker.reset();
          setShowQuitModal(false);
        }}
        title={t("quiz.quitTitle")}
        icon="alert-triangle"
        actionText={t("quiz.quitConfirm")}
        actionVariant="danger"
        isDestructive={true}
        onAction={() => {
          if (blocker?.state === "blocked") {
            blocker.proceed();
          } else {
            setScreen("selection");
            setActiveQuiz(null);
          }
          setShowQuitModal(false);
        }}
      >
        <p>{t("quiz.quitMsg")}</p>
      </Modal>

    </div>
  );
};

export default Quiz;
