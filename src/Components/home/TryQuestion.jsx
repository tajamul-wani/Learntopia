import { useEffect, useRef, useState } from "react";
import Icon from "../ui/Icon";
import { quizzes } from "../../data/quizData";
import { getLevelInfo } from "../../utils/levels";
import { useLanguage } from "../../context/LanguageContext";
import { reducedMotion, fitCanvas } from "../../utils/pointerField";
import { CHANNEL, tone } from "../../utils/paletteTokens";

/** What one right answer is worth here. Enough to move the bar, and no claim. */
const XP_FOR_RIGHT = 10;
const LETTERS = ["A", "B", "C", "D"];

/** The first question of the first quiz, read from the real quiz data. */
const QUESTION = quizzes[0]?.questions?.[0] || null;

/**
 * A question the visitor can actually answer, in the hero.
 *
 * Letting someone play for five seconds says more about a learning game
 * than a paragraph describing one. Everything in it is real: the question
 * comes from `quizData`, and the level name and the XP needed for the next
 * level come from `levels.js`, so nothing here is invented for display.
 */
const TryQuestion = () => {
  const { t } = useLanguage();
  const [picked, setPicked] = useState(null);
  const burstRef = useRef(null);
  const chipRef = useRef(null);
  const wrapRef = useRef(null);

  const level = getLevelInfo(0);
  const toNextLevel = level.xpNeeded;
  const right = picked !== null && QUESTION && QUESTION.options[picked] === QUESTION.correctAnswer;
  const earned = right ? XP_FOR_RIGHT : 0;

  // The reward: spokes thrown out of the XP chip, once, then cleared.
  useEffect(() => {
    if (!right || reducedMotion()) return undefined;
    const canvas = burstRef.current;
    const chip = chipRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !chip || !wrap || !canvas.getContext) return undefined;

    const { width, height, ctx } = fitCanvas(canvas, wrap);
    if (!ctx) return undefined;
    const box = wrap.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    const originX = chipBox.left - box.left + chipBox.width / 2;
    const originY = chipBox.top - box.top + chipBox.height / 2;

    const hues = [CHANNEL.violet, CHANNEL.sky, CHANNEL.gold, CHANNEL.violetSoft];
    const spokes = Array.from({ length: 46 }, (_, i) => ({
      angle: (Math.PI * 2 * i) / 46 + (Math.random() - 0.5) * 0.14,
      length: 54 + Math.random() * 104,
      head: 1.4 + Math.random() * 2.1,
      chan: hues[Math.floor(Math.random() * hues.length)],
      delay: Math.random() * 0.16,
      ease: 0.55 + Math.random() * 0.45,
    }));

    let frame = 0;
    let start = null;
    const DURATION = 1050;

    const tick = (now) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / DURATION, 1);
      ctx.clearRect(0, 0, width, height);
      for (const spoke of spokes) {
        const local = Math.max(0, Math.min((progress - spoke.delay) / (1 - spoke.delay), 1));
        if (local <= 0) continue;
        const out = 1 - Math.pow(1 - local, 3);
        const fade = local < 0.75 ? 1 : 1 - (local - 0.75) / 0.25;
        const reach = spoke.length * out * spoke.ease;
        const tail = Math.max(0, reach - 30 - out * 26);
        const cos = Math.cos(spoke.angle);
        const sin = Math.sin(spoke.angle);

        ctx.beginPath();
        ctx.moveTo(originX + cos * tail, originY + sin * tail);
        ctx.lineTo(originX + cos * reach, originY + sin * reach);
        ctx.strokeStyle = tone(spoke.chan, 0.5 * fade);
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(originX + cos * reach, originY + sin * reach, spoke.head * (1 - out * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = tone(spoke.chan, 0.85 * fade);
        ctx.fill();
      }
      if (progress < 1) frame = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, width, height);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [right]);

  if (!QUESTION) return null;

  const style = (index) => {
    if (picked === null) return "bg-surface-2 text-ink hover:bg-surface-3 hover:text-ink-hi";
    if (QUESTION.options[index] === QUESTION.correctAnswer) {
      return "border-state-success/50 bg-state-success/[0.12] text-state-success";
    }
    if (index === picked) return "border-state-danger/50 bg-state-danger/10 text-state-danger";
    return "bg-surface-2 text-ink-low";
  };

  return (
    <div ref={wrapRef} className="relative min-w-0">
      <canvas
        ref={burstRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
      />

      <div className="rounded-3xl border border-white/10 bg-surface p-6 shadow-clay sm:p-7">
        <div className="mb-[18px] flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-sky">
            <Icon name="target" size={14} />
            {t("home.tryEyebrow")}
          </span>
          <span
            ref={chipRef}
            data-testid="try-xp"
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/15 px-3 py-1 text-xs font-extrabold tabular-nums text-violet-300 shadow-clay-sm"
          >
            <Icon name="zap" size={12} />
            {earned} {t("home.tryXpSuffix")}
          </span>
        </div>

        <p className="font-display text-[1.14rem] font-semibold leading-snug text-ink-hi">
          {QUESTION.questionText}
        </p>

        <div className="mt-4 grid gap-2.5" role="group" aria-label={t("home.tryEyebrow")}>
          {QUESTION.options.map((option, index) => (
            <button
              key={option}
              type="button"
              disabled={picked !== null}
              onClick={() => setPicked(index)}
              data-testid={`try-option-${index}`}
              className={`flex w-full items-center gap-3 rounded-[0.8rem] border border-white/[0.08] px-4 py-3 text-left text-sm font-semibold shadow-clay-sm transition-colors disabled:cursor-default ${style(index)}`}
            >
              <span className="grid h-6 w-6 flex-none place-items-center rounded-[7px] bg-white/5 font-display text-[0.78rem] font-semibold text-ink-low">
                {LETTERS[index]}
              </span>
              {option}
            </button>
          ))}
        </div>

        {picked !== null && (
          <p
            data-testid="try-verdict"
            className={`mt-4 flex items-start gap-2 text-xs font-bold leading-relaxed ${
              right ? "text-state-success" : "text-gold-400"
            }`}
          >
            <Icon name={right ? "check-circle" : "alert-circle"} size={14} className="mt-px flex-none" />
            {right ? t("home.tryCorrect", { xp: XP_FOR_RIGHT }) : t("home.tryWrong")}
          </p>
        )}

        <div className="mt-[18px]">
          <div className="flex items-baseline justify-between text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-ink-low">
            <span>{level.name}</span>
            <span className="tabular-nums text-ink">
              {earned} / {toNextLevel} {t("home.tryXpSuffix")}
            </span>
          </div>
          <div className="mt-2 h-[9px] overflow-hidden rounded-full bg-black/40 shadow-[inset_0_2px_5px_rgba(0,0,0,0.6)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky shadow-[0_0_12px_rgba(139,124,246,0.5)] transition-[width] duration-1000 ease-out"
              style={{ width: `${Math.round((earned / toNextLevel) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryQuestion;
