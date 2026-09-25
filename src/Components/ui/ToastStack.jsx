import { useEffect, useRef, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useLanguage } from "../../context/LanguageContext";
import { useSound } from "../../context/SoundContext";
import { getNotificationConfig, TONE_STYLES, shouldPlaySound } from "./notificationConfig";
import Icon from "./Icon";
import LottieIcon from "./LottieIcon";
import successLottie from "../../assets/lottie/Success.lottie?url";
import useMediaQuery from "../../hooks/useMediaQuery";

/**
 * ToastStack — lightweight corner notifications for routine messages.
 * Top-centre on mobile (full-width), top-right on larger screens. Toasts stack,
 * auto-dismiss (pause on hover), and can be closed with the X. No backdrop, no
 * bulky button — an optional inline action link only.
 */
function ToastCard({ toast: item, onDismiss }) {
  const { t } = useLanguage();
  const { playSound } = useSound();
  const cfg = getNotificationConfig(item.type);
  const tone = TONE_STYLES[cfg.tone] || TONE_STYLES.violet;
  const duration = item.duration ?? 3000;
  const isSmall = useMediaQuery("(max-width: 639px)");

  const [progress, setProgress] = useState(100);
  const [leaving, setLeaving] = useState(false);
  const hovered = useRef(false);

  // One SFX per toast (distinct per type; guarded so it never plays twice).
  useEffect(() => {
    if (cfg.sound && shouldPlaySound(item.id)) playSound(cfg.sound);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const close = () => {
    if (leaving) return;
    setLeaving(true);
    window.setTimeout(onDismiss, 200); // let the exit animation play
  };

  useEffect(() => {
    if (!duration || duration <= 0) return undefined;
    let raf;
    let start = Date.now();
    const tick = () => {
      if (hovered.current) {
        start = Date.now() - (1 - progress / 100) * duration;
        raf = requestAnimationFrame(tick);
        return;
      }
      const remaining = Math.max(0, duration - (Date.now() - start));
      setProgress((remaining / duration) * 100);
      if (remaining <= 0) close();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, duration]);

  const title = item.title || t(cfg.titleKey);

  return (
    <div
      role="status"
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl border ${tone.edge} bg-surface ${tone.glow} pl-3 pr-9 py-2.5 transition-all duration-200 sm:w-[340px] ${
        leaving ? "translate-x-2 opacity-0" : "animate-scale-up"
      }`}
    >
      {/* Faint tone wash so each toast carries its color, fading across the card. */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${tone.wash} to-transparent`} />
      {/* Tone accent bar — a clear left edge so the toast reads instantly. */}
      <div className={`absolute inset-y-0 left-0 w-1.5 ${tone.accent}`} />

      <div className="relative flex gap-2.5">
        <span className={`mt-px flex h-8 w-8 sm:h-9 sm:w-9 flex-none items-center justify-center overflow-hidden rounded-lg border shadow-clay-sm ${tone.chip}`}>
          {cfg.art === "success" ? (
            <LottieIcon src={successLottie} size={isSmall ? 34 : 40} fallbackIcon="check" />
          ) : (
            <Icon name={cfg.icon} size={isSmall ? 15 : 17} />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] sm:text-sm font-bold leading-tight text-ink-hi">{title}</p>
          {item.message && (
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-ink-low">{item.message}</p>
          )}
          {item.confirmLabel && item.onConfirm && (
            <button
              type="button"
              onClick={() => {
                item.onConfirm?.();
                close();
              }}
              className={`mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-bold ${cfg.tone === "sky" ? "text-sky" : "text-violet-400"} hover:underline`}
            >
              {item.confirmLabel}
              <Icon name="arrow-right" size={12} />
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={close}
        aria-label={t("ui.dismissNotification")}
        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink"
      >
        <Icon name="close" size={13} />
      </button>

      {duration > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-white/5">
          <div className={`h-full ${tone.bar}`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export default function ToastStack() {
  const { toasts, dismissToast } = useToast();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] flex flex-col items-center gap-2.5 p-3 sm:inset-x-auto sm:right-0 sm:items-end sm:p-4">
      {toasts.map((item) => (
        <ToastCard key={item.id} toast={item} onDismiss={() => dismissToast(item.id)} />
      ))}
    </div>
  );
}
