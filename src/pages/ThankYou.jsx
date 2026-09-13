import { useNavigate, Link } from "react-router-dom";
import Icon from "../Components/ui/Icon";
import { useLanguage } from "../context/LanguageContext";

// Decorative particle positions — static so they don't re-render
const PARTICLES = [
  { top: "15%", left: "8%",  size: 4, opacity: 0.35 },
  { top: "25%", left: "88%", size: 3, opacity: 0.25 },
  { top: "60%", left: "5%",  size: 5, opacity: 0.2  },
  { top: "70%", left: "92%", size: 3, opacity: 0.3  },
  { top: "40%", left: "95%", size: 4, opacity: 0.2  },
  { top: "80%", left: "15%", size: 3, opacity: 0.25 },
];

const ThankYou = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container-page relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center py-20">

      {/* ── Decorative ambient glows ── */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/4 top-2/3 h-64 w-64 rounded-full bg-sky/8 blur-[80px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-state-success/8 blur-[80px]" />

      {/* Decorative dots */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="pointer-events-none absolute rounded-full bg-violet-400"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, opacity: p.opacity }}
        />
      ))}

      {/* ── Card ── */}
      <div className="relative z-10 mx-auto w-full max-w-lg text-center">

        {/* Animated check icon */}
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          {/* Single soft pulse ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-state-success/15 [animation-duration:2.5s]" />
          {/* Clay medallion with one clean checkmark (no nested circles) */}
          <div className="relative grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-state-success/40 bg-state-success/15 text-state-success shadow-[0_0_40px_-10px_rgba(52,211,153,0.55)]">
            <Icon name="check" size={38} strokeWidth={2.75} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-balance text-3xl font-black leading-[1.12] tracking-tight text-ink-hi sm:text-4xl">
          {t("thankYou.title")}
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink sm:text-lg">
          {t("thankYou.subtitle")}
        </p>

        {/* Divider */}
        <div className="mx-auto mt-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-low">
            {t("thankYou.whatsNext")}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* Suggestion cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/courses"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-surface shadow-clay p-5 transition-all duration-200 hover:border-sky/30 hover:bg-surface-2"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-sky/30 bg-sky/15 text-sky shadow-clay-sm transition-transform duration-200 group-hover:scale-110">
              <Icon name="book" size={18} />
            </div>
            <span className="text-base font-bold text-ink-hi">{t("nav.courses")}</span>
            <span className="text-[13px] leading-snug text-ink-low">{t("thankYou.exploreDesc")}</span>
          </Link>

          <Link
            to="/quiz"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-surface shadow-clay p-5 transition-all duration-200 hover:border-gold-500/30 hover:bg-surface-2"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-gold-500/30 bg-gold-500/15 text-gold-400 shadow-clay-sm transition-transform duration-200 group-hover:scale-110">
              <Icon name="zap" size={18} />
            </div>
            <span className="text-sm font-semibold text-ink-hi">{t("nav.quizzes")}</span>
            <span className="text-[13px] leading-snug text-ink-low">{t("thankYou.quizDesc")}</span>
          </Link>
        </div>

        {/* Primary back button */}
        <button
          onClick={() => navigate("/")}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-clay-btn transition-all duration-200 hover:bg-violet-500"
        >
          <Icon name="arrow-left" size={17} />
          {t("thankYou.backHome")}
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
