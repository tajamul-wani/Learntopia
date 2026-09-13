import { useState, useEffect, useRef } from "react";
import Icon from "./ui/Icon";
import Button from "./ui/Button";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";

/**
 * LessonPlayer — Renders a module's contentSections one step at a time
 * with type-specific card designs, animated transitions, and step navigation.
 *
 * Props:
 *  - sections: Array of contentSection objects from coursesData
 *  - onComplete: Callback when all content steps are read → transitions to exercises
 *  - moduleName: Display name for the module (e.g. "Module 1: Hello Python!")
 */
const SECTION_ICONS = {
  story: "book-open",
  concept: "lightbulb",
  fact: "star",
  tip: "zap",
  example: "code",
  activity: "play-circle",
  recap: "clipboard",
};

const SECTION_LABELS = {
  story: "Story Time",
  concept: "Learn",
  fact: "Fun Fact",
  tip: "Pro Tip",
  example: "Example",
  activity: "Activity",
  recap: "Recap",
};

// Section-type styling grouped by meaning onto the brand + semantic palette so
// the whole app stays coherent: learn = violet, info = sky, tip = gold,
// activity = emerald, recap = neutral.
// Solid clay content cards; the section-type identity now comes from the
// semantic border + icon chip + label/title tints only (no gradient wash), with
// the molded look from shadow-clay.
const SECTION_STYLES = {
  story: {
    border: "border-violet-500/30",
    bg: "bg-surface",
    iconBg: "bg-violet-500/15 border border-violet-500/30 shadow-clay-sm",
    iconColor: "text-violet-400",
    labelColor: "text-violet-300",
    titleColor: "text-violet-300",
    glow: "shadow-clay",
  },
  concept: {
    border: "border-violet-500/30",
    bg: "bg-surface",
    iconBg: "bg-violet-500/15 border border-violet-500/30 shadow-clay-sm",
    iconColor: "text-violet-400",
    labelColor: "text-violet-300",
    titleColor: "text-violet-300",
    glow: "shadow-clay",
  },
  fact: {
    border: "border-sky/30",
    bg: "bg-surface",
    iconBg: "bg-sky/15 border border-sky/30 shadow-clay-sm",
    iconColor: "text-sky",
    labelColor: "text-sky",
    titleColor: "text-sky",
    glow: "shadow-clay",
  },
  tip: {
    border: "border-gold-500/30",
    bg: "bg-surface",
    iconBg: "bg-gold-500/15 border border-gold-500/30 shadow-clay-sm",
    iconColor: "text-gold-400",
    labelColor: "text-gold-300",
    titleColor: "text-gold-200",
    glow: "shadow-clay",
  },
  example: {
    border: "border-violet-500/30",
    bg: "bg-surface",
    iconBg: "bg-violet-500/15 border border-violet-500/30 shadow-clay-sm",
    iconColor: "text-violet-400",
    labelColor: "text-violet-300",
    titleColor: "text-violet-300",
    glow: "shadow-clay",
  },
  activity: {
    border: "border-state-success/30",
    bg: "bg-surface",
    iconBg: "bg-state-success/15 border border-state-success/30 shadow-clay-sm",
    iconColor: "text-state-success",
    labelColor: "text-state-success",
    titleColor: "text-state-success",
    glow: "shadow-clay",
  },
  recap: {
    border: "border-white/10",
    bg: "bg-surface",
    iconBg: "bg-surface-2 border border-white/10 shadow-clay-sm",
    iconColor: "text-ink",
    labelColor: "text-ink-low",
    titleColor: "text-ink-hi",
    glow: "shadow-clay",
  },
};

const DEFAULT_STYLE = SECTION_STYLES.concept;

const LessonPlayer = ({ sections = [], onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" or "prev"
  const [canProceed, setCanProceed] = useState(false);
  const contentRef = useRef(null);
  const { playClick } = useSound();
  const { t, isRTL } = useLanguage();

  const total = sections.length;
  const isLastStep = currentStep === total - 1;
  const section = sections[currentStep];
  const sectionType = section?.type || "concept";
  const style = SECTION_STYLES[sectionType] || DEFAULT_STYLE;
  const icon = SECTION_ICONS[sectionType] || "lightbulb";
  const label = t(`lessonPlayer.${sectionType}`, SECTION_LABELS[sectionType] || "Learn");

  // Slight delay before enabling "Next" to encourage reading
  useEffect(() => {
    setCanProceed(false);
    const timer = setTimeout(() => setCanProceed(true), 1200);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Scroll content area into view on step change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentStep]);

  const goNext = () => {
    if (isAnimating || !canProceed) return;
    playClick();

    if (isLastStep) {
      onComplete?.();
      return;
    }

    setDirection("next");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => Math.min(s + 1, total - 1));
      setIsAnimating(false);
    }, 300);
  };

  const goPrev = () => {
    if (isAnimating || currentStep === 0) return;

    setDirection("prev");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => Math.max(s - 1, 0));
      setIsAnimating(false);
    }, 300);
  };

  if (!section) return null;

  // Format content: replace \n with actual line breaks and handle bullet points
  const formatContent = (text) => {
    if (!text) return null;

    const lines = text.split("\n");
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === "") return <br key={i} />;

      // Bullet points and labeled callouts (Good:/Bad:/Correct:/Wrong:/Notice:/
      // difficulty tiers, plus localized equivalents) — these read as indented
      // block lines. Kept defensive so unknown labels simply fall through.
      const LABELS = /^(Good|Bad|Correct|Wrong|Notice|Easy|Medium|Hard|Expert|Bien|Mal|Correcto|Incorrecto|Fíjate|Fácil|Medio|Difícil|Experto):/;
      if (trimmed.startsWith("•") || trimmed.startsWith("-") || LABELS.test(trimmed)) {
        return (
          <span key={i} className="block pl-1 py-0.5">
            {trimmed}
          </span>
        );
      }

      // Code-like lines (starts with spaces after trimming or contains = or print)
      if (
        sectionType === "example" &&
        (trimmed.startsWith("print") ||
          trimmed.startsWith("import") ||
          trimmed.startsWith("if ") ||
          trimmed.startsWith("elif ") ||
          trimmed.startsWith("else:") ||
          trimmed.startsWith("while ") ||
          trimmed.startsWith("guess") ||
          trimmed.startsWith("score") ||
          trimmed.startsWith("player") ||
          trimmed.startsWith("secret") ||
          trimmed.startsWith("attempts") ||
          trimmed.startsWith("lives") ||
          /^[a-z_]+ ?=/.test(trimmed))
      ) {
        return (
          <code key={i} className="block rounded bg-black/30 px-3 py-1 font-mono text-sm text-state-success my-0.5">
            {trimmed}
          </code>
        );
      }

      // Numbered items
      if (/^\d+\./.test(trimmed)) {
        return (
          <span key={i} className="block pl-1 py-0.5">
            {trimmed}
          </span>
        );
      }

      // Operator/comparison lines in examples
      if (sectionType === "example" && (/^[><=!]+ /.test(trimmed) || /means '/.test(trimmed))) {
        return (
          <code key={i} className="block rounded bg-black/20 px-3 py-0.5 font-mono text-sm text-state-success/80 my-0.5">
            {trimmed}
          </code>
        );
      }

      return (
        <span key={i} className="block">
          {trimmed}
        </span>
      );
    });
  };

  return (
    <div ref={contentRef} className="space-y-6">
      {/* Step Progress Bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-ink-low whitespace-nowrap">
          {t("lessonPlayer.stepCount", { current: currentStep + 1, total })}
        </span>
        <div className="flex-grow flex gap-1.5">
          {sections.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                i < currentStep
                  ? "bg-violet-500 shadow-[0_0_6px_rgba(139,124,246,0.5)]"
                  : i === currentStep
                  ? "bg-gradient-to-r from-violet-500 to-sky shadow-[0_0_8px_rgba(139,124,246,0.4)]"
                  : "clay-inset"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 transition-all duration-300 ${style.border} ${style.bg} ${style.glow} ${
          isAnimating
            ? direction === "next"
              ? "opacity-0 translate-x-8"
              : "opacity-0 -translate-x-8"
            : "opacity-100 translate-x-0"
        }`}
      >
        {/* Decorative glow blob */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${
              sectionType === "fact" || sectionType === "example"
                ? "rgba(78,197,232,0.3)"
                : sectionType === "tip"
                ? "rgba(251,191,36,0.3)"
                : sectionType === "activity"
                ? "rgba(52,211,153,0.3)"
                : sectionType === "recap"
                ? "rgba(255,255,255,0.12)"
                : "rgba(139,124,246,0.3)"
            }, transparent)`,
          }}
        />

        {/* Type label + icon */}
        <div className="mb-5 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.iconBg}`}>
            <Icon name={icon} size={20} className={style.iconColor} />
          </div>
          <span className={`text-xs font-bold uppercase tracking-[0.1em] ${style.labelColor}`}>
            {label}
          </span>
        </div>

        {/* Title */}
        <h4 className={`mb-4 text-xl font-extrabold md:text-2xl ${style.titleColor}`}>
          {section.title}
        </h4>

        {/* Content body */}
        <div className="text-[15px] leading-[1.8] text-ink-low/90 font-medium">
          {formatContent(section.content)}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goPrev}
          disabled={currentStep === 0 || isAnimating}
          className="gap-2"
        >
          <Icon name={isRTL ? "arrow-right" : "arrow-left"} size={16} />
          {t("lessonPlayer.prevStep")}
        </Button>

        <div className="hidden sm:flex items-center gap-2">
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                if (i <= currentStep && !isAnimating) {
                  setDirection(i < currentStep ? "prev" : "next");
                  setCurrentStep(i);
                }
              }}
              disabled={i > currentStep}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "scale-125 bg-violet-500 shadow-[0_0_8px_rgba(139,124,246,0.6)]"
                  : i < currentStep
                  ? "bg-violet-500/40 hover:bg-violet-500/60 cursor-pointer"
                  : "bg-white/[0.1] cursor-not-allowed"
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        <Button
          size="sm"
          onClick={goNext}
          disabled={!canProceed || isAnimating}
          className={`gap-2 transition-all duration-300 ${
            !canProceed ? "opacity-50" : "opacity-100"
          }`}
        >
          {isLastStep ? (
            <>
              {t("lessonPlayer.startPractice")}
              <Icon name="edit-3" size={16} />
            </>
          ) : (
            <>
              {t("lessonPlayer.nextStep")}
              <Icon name={isRTL ? "arrow-left" : "arrow-right"} size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LessonPlayer;
