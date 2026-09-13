/**
 * Shared notification config — one source of truth for both presentations:
 *  - corner toasts (ToastStack) for routine messages
 *  - the centered modal (NotificationModal) for "big moments"
 *
 * Each type maps to a tone (colour), an icon, i18n keys for its title and
 * (modal-only) button, and a `sound` (a key into SoundContext's playSound). The
 * sound plays exactly once per notification. Titles/buttons are localized.
 */
// `art: "success"` plays the green Success animation (LottieIcon) in the icon
// slot for positive confirmations, instead of the flat icon.
export const NOTIFICATION_CONFIG = {
  login:          { tone: "sky",     icon: "user",     art: "success", sound: "levelUp",      titleKey: "toasts.titleLogin",    btnKey: "toasts.btnLogin" },
  signup:         { tone: "violet",  icon: "sparkles", sound: "badgeUnlock",  titleKey: "toasts.titleSignup",   btnKey: "toasts.btnSignup" },
  logout:         { tone: "neutral", icon: "logout",   art: "success", sound: "click",        titleKey: "toasts.titleLogout",   btnKey: "toasts.btnLogout" },
  profile:        { tone: "green",   icon: "check",    art: "success", sound: "correct",      titleKey: "toasts.titleProfile",  btnKey: "toasts.btnProfile" },
  quiz:           { tone: "violet",  icon: "target",   sound: "correct",      titleKey: "toasts.titleQuiz",     btnKey: "toasts.btnQuiz" },
  unenroll:       { tone: "sky",     icon: "info",     sound: "click",        titleKey: "toasts.titleUnenroll", btnKey: "toasts.btnUnenroll" },
  delete_profile: { tone: "danger",  icon: "warning",  sound: "warningAlert", titleKey: "toasts.titleDelete",   btnKey: "toasts.btnDelete" },
  success:        { tone: "green",   icon: "check",    art: "success", sound: "correct",      titleKey: "toasts.titleSuccess",  btnKey: "toasts.btnGeneric" },
  error:          { tone: "danger",  icon: "warning",  sound: "incorrect",    titleKey: "toasts.titleError",    btnKey: "toasts.btnRetry" },
  warning:        { tone: "gold",   icon: "warning",  sound: "warningAlert", titleKey: "toasts.titleWarning",  btnKey: "toasts.btnGeneric" },
  info:           { tone: "violet",  icon: "info",     sound: "click",        titleKey: "toasts.titleInfo",     btnKey: "toasts.btnGeneric" },
};

// Tailwind classes per tone (core palette + status tokens only). `glow` is a soft
// tone-colored halo layered over the base drop shadow so a toast/modal reads
// clearly against the dark background without looking flashy.
export const TONE_STYLES = {
  sky:     { chip: "text-sky border-sky/40 bg-sky/[0.12]",                       bar: "bg-sky",           accent: "bg-sky",            edge: "border-sky/30",            wash: "from-sky/[0.14]",           glow: "shadow-[0_14px_34px_rgba(0,0,0,0.5),0_0_22px_rgba(78,197,232,0.24)]" },
  violet:  { chip: "text-violet-400 border-violet-500/40 bg-violet-500/[0.14]",  bar: "bg-violet-500",    accent: "bg-violet-500",     edge: "border-violet-500/30",     wash: "from-violet-500/[0.14]",    glow: "shadow-[0_14px_34px_rgba(0,0,0,0.5),0_0_22px_rgba(139,124,246,0.28)]" },
  green:   { chip: "text-state-success border-state-success/40 bg-state-success/[0.12]", bar: "bg-state-success", accent: "bg-state-success", edge: "border-state-success/30", wash: "from-state-success/[0.14]", glow: "shadow-[0_14px_34px_rgba(0,0,0,0.5),0_0_22px_rgba(52,211,153,0.24)]" },
  danger:  { chip: "text-state-danger border-state-danger/40 bg-state-danger/[0.12]",    bar: "bg-state-danger",  accent: "bg-state-danger",  edge: "border-state-danger/30",  wash: "from-state-danger/[0.14]",  glow: "shadow-[0_14px_34px_rgba(0,0,0,0.5),0_0_22px_rgba(251,113,133,0.26)]" },
  gold:    { chip: "text-gold-400 border-gold-500/40 bg-gold-500/[0.12]",     bar: "bg-gold-400",     accent: "bg-gold-400",      edge: "border-gold-500/30",      wash: "from-gold-500/[0.14]",     glow: "shadow-[0_14px_34px_rgba(0,0,0,0.5),0_0_22px_rgba(251,191,36,0.24)]" },
  neutral: { chip: "text-ink border-white/10 bg-white/[0.05]",                   bar: "bg-ink-faint",     accent: "bg-white/25",       edge: "border-white/15",          wash: "from-white/[0.06]",         glow: "shadow-[0_14px_34px_rgba(0,0,0,0.5)]" },
};

// Which types are shown as the centered "big moment" modal (everything else is a
// lightweight corner toast).
export const MODAL_TYPES = new Set(["signup", "delete_profile"]);

export const getNotificationConfig = (type) => NOTIFICATION_CONFIG[type] || NOTIFICATION_CONFIG.info;

/**
 * Guards a notification's SFX so it fires exactly once per notification id, even
 * across React StrictMode's dev remounts. Returns true only the first time an id
 * is seen. Keeps a small rolling set so it never grows unbounded.
 */
const playedSoundIds = new Set();
export function shouldPlaySound(id) {
  if (!id || playedSoundIds.has(id)) return false;
  playedSoundIds.add(id);
  if (playedSoundIds.size > 60) {
    playedSoundIds.delete(playedSoundIds.values().next().value);
  }
  return true;
}
