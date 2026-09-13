import { useState, useRef } from "react";
import Icon from "./ui/Icon";
import Button from "./ui/Button";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

/**
 * ExerciseEngine — Renders different exercise types with validation & feedback.
 * 
 * Props:
 *  - exercises: Array of exercise objects (with type field)
 *  - onAllCorrect: Callback when all exercises are answered correctly
 *  - onFirstAttempt: Callback fired ONCE on the first submit with
 *      (correctCount, totalQ) — used to record how accurately the learner did
 *      before any retries, which feeds the course-accuracy / Sharp Memory award.
 *  - isCompleted: Whether this module is already completed (review mode)
 *  - saving: Whether we're currently saving progress
 */
// Per-pair accent: a matched term and its definition share this colour + number
// so the pairing reads at a glance (cycled if there are more pairs than colours).
const MATCH_ACCENTS = [
  { badge: "bg-violet-600 text-white", tile: "border-violet-500/50 bg-violet-500/[0.12] text-violet-300" },
  { badge: "bg-sky text-ground", tile: "border-sky/50 bg-sky/[0.12] text-sky" },
  { badge: "bg-state-success text-ground", tile: "border-state-success/50 bg-state-success/[0.12] text-state-success" },
  { badge: "bg-state-warning text-ground", tile: "border-state-warning/50 bg-state-warning/[0.12] text-state-warning" },
];

const ExerciseEngine = ({ exercises = [], onAllCorrect, onFirstAttempt, isCompleted = false, saving = false }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState({});
  const [matchState, setMatchState] = useState({}); // Track match exercise state
  const { playClick, playIncorrect, playModuleComplete } = useSound();
  const { t } = useLanguage();

  // Fire onFirstAttempt only once per mount, so a retry never overwrites the
  // learner's genuine first-try accuracy for this module.
  const firstAttemptFiredRef = useRef(false);

  // Cache each match question's shuffled right column so re-renders (tapping a
  // term) never re-randomize the positions.
  const shuffledDefsRef = useRef({});

  const totalQ = exercises.length;

  const handleSelectMCQ = (qIndex, option) => {
    if (submitted || saving || isCompleted) return;
    playClick();
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
    setShowFeedback(prev => ({ ...prev, [qIndex]: false }));
  };

  const handleTrueFalse = (qIndex, value) => {
    if (submitted || saving || isCompleted) return;
    playClick();
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
    setShowFeedback(prev => ({ ...prev, [qIndex]: false }));
  };

  const handleFillBlank = (qIndex, text) => {
    if (submitted || saving || isCompleted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: text }));
    setShowFeedback(prev => ({ ...prev, [qIndex]: false }));
  };

  const handleMatchSelect = (qIndex, side, value) => {
    if (submitted || saving || isCompleted) return;

    setMatchState(prev => {
      const state = prev[qIndex] || { left: null, right: null, matched: [] };
      const newState = { ...state };

      if (side === "left") {
        // Check if this left item is already matched
        if (state.matched.some(m => m.left === value)) return prev;
        newState.left = value;
      } else {
        // Check if this right item is already matched
        if (state.matched.some(m => m.right === value)) return prev;
        newState.right = value;
      }

      // If both sides selected, create a match
      if (newState.left !== null && newState.right !== null) {
        newState.matched = [...state.matched, { left: newState.left, right: newState.right }];
        newState.left = null;
        newState.right = null;

        // Update answers when all pairs matched
        const exercise = exercises[qIndex];
        if (newState.matched.length === exercise.pairs.length) {
          setAnswers(prev => ({ ...prev, [qIndex]: newState.matched }));
        }
      }

      return { ...prev, [qIndex]: newState };
    });

    setShowFeedback(prev => ({ ...prev, [qIndex]: false }));
  };

  const resetMatch = (qIndex) => {
    setMatchState(prev => ({ ...prev, [qIndex]: { left: null, right: null, matched: [] } }));
    setAnswers(prev => {
      const next = { ...prev };
      delete next[qIndex];
      return next;
    });
  };

  const checkIsCorrect = (qIndex) => {
    const exercise = exercises[qIndex];
    const ans = answers[qIndex];

    if (ans === undefined || ans === null || ans === "") return false;

    switch (exercise.type) {
      case "true-false":
        return ans === exercise.answer;
      case "fill-blank":
        return ans.trim().toLowerCase() === exercise.answer.trim().toLowerCase();
      case "match": {
        if (!Array.isArray(ans)) return false;
        return exercise.pairs.every(pair =>
          ans.some(m => m.left === pair.term && m.right === pair.definition)
        );
      }
      case "mcq":
      default:
        return ans === exercise.answer;
    }
  };

  const handleSubmitAll = () => {
    setSubmitted(true);

    const feedback = {};
    let allCorrect = true;
    let correct = 0;
    exercises.forEach((_, i) => {
      const isRight = checkIsCorrect(i);
      feedback[i] = true;
      if (isRight) correct += 1;
      else allCorrect = false;
    });
    setShowFeedback(feedback);

    // Record first-try accuracy once (before any retry).
    if (!firstAttemptFiredRef.current) {
      firstAttemptFiredRef.current = true;
      onFirstAttempt?.(correct, totalQ);
    }

    if (allCorrect) {
      playModuleComplete();
      onAllCorrect?.();
    } else {
      playIncorrect();
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setShowFeedback({});
    setAnswers({});
    setMatchState({});
  };

  const allAnswered = exercises.every((_, i) => {
    const ans = answers[i];
    if (ans === undefined || ans === null || ans === "") return false;
    const ex = exercises[i];
    if (ex.type === "match") return Array.isArray(ans) && ans.length === ex.pairs.length;
    return true;
  });

  const allCorrect = submitted && exercises.every((_, i) => checkIsCorrect(i));
  const correctCount = exercises.filter((_, i) => checkIsCorrect(i)).length;

  // Render individual exercise based on type
  const renderExercise = (exercise, qIndex) => {
    const userAns = answers[qIndex];
    const hasFeedback = showFeedback[qIndex];
    const isCorrect = hasFeedback ? checkIsCorrect(qIndex) : null;
    const isDone = isCompleted;

    switch (exercise.type) {
      case "true-false":
        return renderTrueFalse(exercise, qIndex, userAns, hasFeedback, isCorrect, isDone);
      case "fill-blank":
        return renderFillBlank(exercise, qIndex, userAns, hasFeedback, isCorrect, isDone);
      case "match":
        return renderMatch(exercise, qIndex, hasFeedback, isCorrect, isDone);
      case "mcq":
      default:
        return renderMCQ(exercise, qIndex, userAns, hasFeedback, isCorrect, isDone);
    }
  };

  const renderMCQ = (exercise, qIndex, userAns, hasFeedback, isCorrect, isDone) => {
    const displayAns = isDone ? exercise.answer : userAns;

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {exercise.options.map((option) => {
          const isOptionCorrect = option === exercise.answer;
          const isSelected = displayAns === option;

          let style = "border-white/10 bg-surface-2 shadow-clay-sm hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-surface-3";

          if (isDone) {
            if (isOptionCorrect) style = "border-state-success bg-state-success/15 text-state-success shadow-[0_0_10px_rgba(52,211,153,0.1)]";
            else style = "border-white/[0.03] opacity-40";
          } else if (hasFeedback) {
            if (isSelected && isOptionCorrect) style = "border-state-success bg-state-success/20 text-state-success shadow-[0_0_10px_rgba(52,211,153,0.2)]";
            else if (isSelected && !isOptionCorrect) style = "border-state-danger bg-state-danger/20 text-state-danger shadow-[0_0_10px_rgba(251,113,133,0.2)]";
            else if (isOptionCorrect) style = "border-state-success/50 bg-state-success/10 text-state-success";
            else style = "border-white/[0.03] opacity-40";
          } else if (isSelected) {
            style = "border-violet-500 bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,124,246,0.3)]";
          }

          return (
            <button
              key={option}
              type="button"
              disabled={isDone || submitted}
              onClick={() => handleSelectMCQ(qIndex, option)}
              className={`flex min-h-[56px] items-center justify-between rounded-xl border px-5 py-3 text-left text-sm font-medium transition-all duration-300 ${style}`}
            >
              <span>{option}</span>
              {((isDone && isOptionCorrect) || (hasFeedback && isSelected && isOptionCorrect)) && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-state-success/20 text-state-success">
                  <Icon name="check" size={14} />
                </span>
              )}
              {hasFeedback && isSelected && !isOptionCorrect && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-state-danger/20 text-state-danger">
                  <Icon name="x" size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderTrueFalse = (exercise, qIndex, userAns, hasFeedback, isCorrect, isDone) => {
    const displayAns = isDone ? exercise.answer : userAns;

    const getBtnStyle = (val) => {
      const isThisCorrect = val === exercise.answer;
      const isSelected = displayAns === val;

      if (isDone) {
        return isThisCorrect
          ? "border-state-success bg-state-success/15 text-state-success shadow-[0_0_10px_rgba(52,211,153,0.15)] scale-[1.02]"
          : "border-white/[0.03] opacity-40";
      }
      if (hasFeedback) {
        if (isSelected && isThisCorrect) return "border-state-success bg-state-success/20 text-state-success shadow-[0_0_10px_rgba(52,211,153,0.2)] scale-[1.02]";
        if (isSelected && !isThisCorrect) return "border-state-danger bg-state-danger/20 text-state-danger shadow-[0_0_10px_rgba(251,113,133,0.2)]";
        if (isThisCorrect) return "border-state-success/50 bg-state-success/10 text-state-success";
        return "border-white/[0.03] opacity-40";
      }
      if (isSelected) return "border-violet-500 bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,124,246,0.3)] scale-[1.02]";
      return "border-white/10 bg-surface-2 shadow-clay-sm hover:border-violet-500/50 hover:bg-surface-3";
    };

    return (
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={isDone || submitted}
          onClick={() => handleTrueFalse(qIndex, true)}
          className={`flex items-center justify-center gap-3 rounded-2xl border-2 px-6 py-5 text-lg font-bold transition-all duration-300 ${getBtnStyle(true)}`}
        >
          <Icon name="check" size={24} /> {t("exerciseEngine.trueBtn")}
        </button>
        <button
          type="button"
          disabled={isDone || submitted}
          onClick={() => handleTrueFalse(qIndex, false)}
          className={`flex items-center justify-center gap-3 rounded-2xl border-2 px-6 py-5 text-lg font-bold transition-all duration-300 ${getBtnStyle(false)}`}
        >
          <Icon name="x" size={24} /> {t("exerciseEngine.falseBtn")}
        </button>
      </div>
    );
  };

  const renderFillBlank = (exercise, qIndex, userAns, hasFeedback, isCorrect, isDone) => {
    const displayVal = isDone ? exercise.answer : (userAns || "");

    // Split the question text at ___ to show the blank inline
    const parts = exercise.question.split("___");
    const hasBlankInline = parts.length > 1;

    let inputStyle = "border-white/10 bg-surface-2 focus:border-violet-500 focus:ring-violet-500/30";
    if (isDone) inputStyle = "border-state-success/50 bg-state-success/10 text-state-success";
    else if (hasFeedback && isCorrect) inputStyle = "border-state-success bg-state-success/15 text-state-success";
    else if (hasFeedback && !isCorrect) inputStyle = "border-state-danger bg-state-danger/15 text-state-danger";

    return (
      <div className="space-y-4">
        {hasBlankInline ? (
          <p className="text-base leading-relaxed text-ink-low flex flex-wrap items-center gap-2">
            <span>{parts[0]}</span>
            <input
              type="text"
              value={displayVal}
              onChange={(e) => handleFillBlank(qIndex, e.target.value)}
              disabled={isDone || submitted}
              placeholder={t("exerciseEngine.fillPlaceholder")}
              className={`inline-block w-40 rounded-xl border-2 px-4 py-2 text-center text-base font-bold outline-none transition-all duration-300 focus:ring-2 ${inputStyle}`}
            />
            <span>{parts[1]}</span>
          </p>
        ) : (
          <input
            type="text"
            value={displayVal}
            onChange={(e) => handleFillBlank(qIndex, e.target.value)}
            disabled={isDone || submitted}
            placeholder={t("exerciseEngine.fillPlaceholder")}
            className={`w-full rounded-xl border-2 px-5 py-3 text-base font-bold outline-none transition-all duration-300 focus:ring-2 ${inputStyle}`}
          />
        )}
        {hasFeedback && !isCorrect && (
          <p className="flex items-center gap-2 text-sm font-medium text-state-success">
            <Icon name="lightbulb" size={16} /> Correct answer: <span className="font-bold">{exercise.answer}</span>
          </p>
        )}
      </div>
    );
  };

  const renderMatch = (exercise, qIndex, hasFeedback, isCorrect, isDone) => {
    const state = matchState[qIndex] || { left: null, right: null, matched: [] };
    const { pairs } = exercise;

    // Shuffle the right column ONCE per question and cache it, so tapping a term
    // (which re-renders) never reshuffles the definitions' positions.
    if (!shuffledDefsRef.current[qIndex]) {
      shuffledDefsRef.current[qIndex] = [...pairs.map((p) => p.definition)].sort(() => 0.5 - Math.random());
    }
    const shuffledDefs = isDone ? pairs.map((p) => p.definition) : shuffledDefsRef.current[qIndex];

    // For completed state, show the correct matches
    if (isDone) {
      return (
        <div className="space-y-3">
          {pairs.map((pair, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-xl border border-state-success/30 bg-state-success/10 px-4 py-3">
              <span className="text-sm font-bold text-state-success">{pair.term}</span>
              <Icon name="arrow-right" size={16} className="text-state-success hidden sm:inline flex-none" />
              <span className="text-sm text-state-success/80">{pair.definition}</span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-xs font-medium text-ink-low">Tap one term on the left, then tap its match on the right</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Left column — Terms */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-2">Terms</p>
            {pairs.map((pair, i) => {
              const isMatched = state.matched.some(m => m.left === pair.term);
              const isActive = state.left === pair.term;
              const isCorrectMatch = hasFeedback && state.matched.some(m => m.left === pair.term && m.right === pair.definition);
              const isWrongMatch = hasFeedback && state.matched.some(m => m.left === pair.term && m.right !== pair.definition);
              const accent = MATCH_ACCENTS[i % MATCH_ACCENTS.length];

              let s = "border-white/10 bg-surface-2 shadow-clay-sm hover:border-violet-500/50 hover:bg-surface-3";
              if (isCorrectMatch) s = "border-state-success bg-state-success/15 text-state-success";
              else if (isWrongMatch) s = "border-state-danger bg-state-danger/15 text-state-danger";
              else if (isMatched) s = accent.tile;
              else if (isActive) s = "border-violet-500 bg-violet-500/20 text-white shadow-[0_0_12px_rgba(139,124,246,0.3)]";

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isMatched || submitted}
                  onClick={() => handleMatchSelect(qIndex, "left", pair.term)}
                  className={`flex min-h-[3.25rem] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${s}`}
                >
                  <span className={`grid h-6 w-6 flex-none place-items-center rounded-lg text-xs font-extrabold ${isMatched && !hasFeedback ? accent.badge : "bg-white/10 text-ink-low"}`}>
                    {i + 1}
                  </span>
                  <span className="min-w-0">{pair.term}</span>
                </button>
              );
            })}
          </div>

          {/* Right column — Definitions */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-sky mb-2">Definitions</p>
            {shuffledDefs.map((def, i) => {
              const isMatched = state.matched.some(m => m.right === def);
              const isActive = state.right === def;
              const matchedPair = state.matched.find(m => m.right === def);
              const correctPair = pairs.find(p => p.definition === def);
              const isCorrectMatch = hasFeedback && matchedPair && matchedPair.left === correctPair?.term;
              const isWrongMatch = hasFeedback && matchedPair && matchedPair.left !== correctPair?.term;
              // A matched definition borrows its term's number + colour, so the pair links visually.
              const termIdx = matchedPair ? pairs.findIndex(p => p.term === matchedPair.left) : -1;
              const accent = termIdx >= 0 ? MATCH_ACCENTS[termIdx % MATCH_ACCENTS.length] : null;

              let s = "border-white/10 bg-surface-2 shadow-clay-sm hover:border-sky/50 hover:bg-surface-3";
              if (isCorrectMatch) s = "border-state-success bg-state-success/15 text-state-success";
              else if (isWrongMatch) s = "border-state-danger bg-state-danger/15 text-state-danger";
              else if (isMatched && accent) s = accent.tile;
              else if (isActive) s = "border-sky bg-sky/20 text-white shadow-[0_0_12px_rgba(78,197,232,0.3)]";

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isMatched || submitted}
                  onClick={() => handleMatchSelect(qIndex, "right", def)}
                  className={`flex min-h-[3.25rem] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${s}`}
                >
                  {isMatched && termIdx >= 0 && (
                    <span className={`grid h-6 w-6 flex-none place-items-center rounded-lg text-xs font-extrabold ${!hasFeedback ? accent.badge : "bg-white/10 text-ink-low"}`}>
                      {termIdx + 1}
                    </span>
                  )}
                  <span className="min-w-0">{def}</span>
                </button>
              );
            })}
          </div>
        </div>

        {state.matched.length > 0 && !submitted && (
          <button
            type="button"
            onClick={() => resetMatch(qIndex)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink-low hover:text-ink-hi transition-colors"
          >
            <Icon name="refresh-cw" size={14} /> Reset matches
          </button>
        )}

        {hasFeedback && !isCorrect && (
          <div className="mt-3 space-y-1.5">
            <p className="text-xs font-bold text-state-success flex items-center gap-1">
              <Icon name="lightbulb" size={14} /> Correct matches:
            </p>
            {pairs.map((pair, i) => (
              <p key={i} className="text-xs text-state-success/80 pl-5">
                {pair.term} → {pair.definition}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get exercise type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case "true-false":
        return { label: "True or False", icon: "check-circle", color: "text-gold-400 bg-gold-500/15 border-gold-500/30" };
      case "fill-blank":
        return { label: "Fill in the Blank", icon: "edit-3", color: "text-sky bg-sky/15 border-sky/30" };
      case "match":
        return { label: "Match the Pairs", icon: "code", color: "text-state-success bg-state-success/15 border-state-success/30" };
      case "mcq":
      default:
        return { label: "Multiple Choice", icon: "check-circle", color: "text-violet-400 bg-violet-500/15 border-violet-500/30" };
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-surface p-5 shadow-clay md:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 border-b border-white/[0.08] pb-4">
        <h4 className="flex items-center gap-3 text-xl font-extrabold text-ink-hi">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 text-white shadow-[0_0_10px_rgba(139,124,246,0.5)]">
            <Icon name="edit-3" size={16} />
          </span>
          Module Challenge
        </h4>
        <p className="mt-2 text-sm text-ink-low">
          Answer all {totalQ} questions correctly to unlock the next module.
        </p>
        {/* Score indicator */}
        {submitted && (
          <div className={`mt-3 flex items-center gap-2 text-sm font-bold ${allCorrect ? "text-state-success" : "text-state-danger"}`}>
            <Icon name={allCorrect ? "check-circle" : "alert-circle"} size={18} />
            {allCorrect ? `Perfect! ${correctCount}/${totalQ} correct!` : `${correctCount}/${totalQ} correct — review and try again!`}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {exercises.map((exercise, qIndex) => {
          const typeBadge = getTypeBadge(exercise.type);

          return (
            <div key={qIndex} className="animate-fade-up" style={{ animationDelay: `${qIndex * 80}ms` }}>
              {/* Question header */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold text-violet-400">Q{qIndex + 1}.</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${typeBadge.color}`}>
                  <Icon name={typeBadge.icon} size={12} />
                  {typeBadge.label}
                </span>
              </div>

              {/* Question text */}
              <p className="mb-4 text-sm font-bold text-ink-hi leading-relaxed whitespace-pre-line">
                {exercise.question}
              </p>

              {/* Exercise body */}
              {renderExercise(exercise, qIndex)}
            </div>
          );
        })}
      </div>

      {/* Submit/Retry area */}
      {!isCompleted && (
        <div className="mt-8 border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {submitted && !allCorrect ? (
            <>
              <p className="text-sm font-bold text-state-danger flex items-center gap-2">
                <Icon name="alert-circle" size={18} /> {t("exerciseEngine.incorrectTitle")}
              </p>
              <Button onClick={handleRetry} variant="secondary">
                {t("exerciseEngine.tryAgain")}
              </Button>
            </>
          ) : submitted && allCorrect ? (
            <p className="text-sm font-bold text-state-success flex items-center gap-2 mx-auto">
              <Icon name="check-circle" size={18} /> {t("exerciseEngine.correctTitle")}
            </p>
          ) : (
            <>
              <p className="text-sm text-ink-low">
                {allAnswered ? t("exerciseEngine.checkAnswer") : t("exerciseEngine.qCounter", { current: Object.keys(answers).length, total: totalQ })}
              </p>
              <Button
                onClick={handleSubmitAll}
                disabled={!allAnswered || saving}
                loading={saving}
                className="w-full sm:w-auto px-8"
              >
                {t("exerciseEngine.checkAnswer")}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Completed state */}
      {isCompleted && (
        <div className="mt-8 rounded-xl bg-state-success/10 p-4 border border-state-success/20 text-center animate-fade-in">
          <p className="flex items-center justify-center gap-2 text-lg font-bold text-state-success">
            <Icon name="check-circle" size={24} /> {t("exerciseEngine.correctTitle")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseEngine;
