import { useNavigate } from "react-router-dom";
import Button from "../Components/ui/Button";
import Badge from "../Components/ui/Badge";
import Icon from "../Components/ui/Icon";
import StatsSection from "../Components/StatsSection";
import { COURSES } from "../data/coursesData";
import { getLocalizedCourse } from "../utils/localizationUtils";
import { courseFacts } from "../utils/courseFacts";
import { courseTint } from "../utils/courseTint";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

// Accent tints reused for icon wells/tiles across the page.
const TINT = {
  violet: "bg-violet-500/15 border-violet-500/30 text-violet-400",
  sky: "bg-sky/15 border-sky/30 text-sky",
  gold: "bg-gold-500/15 border-gold-500/30 text-gold-400",
  mint: "bg-state-success/15 border-state-success/30 text-state-success",
};

// Soft category tint behind each featured image so the trio reads as one set.

const HOW_STEPS = [
  { n: "1", tone: "violet", icon: "book" },
  { n: "2", tone: "sky", icon: "target" },
  { n: "3", tone: "gold", icon: "award" },
];

const GAME = [
  { tone: "violet", icon: "zap", key: "Xp" },
  { tone: "gold", icon: "flame", key: "Streak" },
  { tone: "sky", icon: "award", key: "Badge" },
  { tone: "mint", icon: "bar-chart", key: "Rank" },
];

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const featured = COURSES.slice(0, 3).map((c) => getLocalizedCourse(c, t));

  // A card opens the course and nothing else — joining is one explicit action
  // on the course page itself. Logged-out visitors sign in first and land back
  // on the course they picked, still having joined nothing.
  const openCourse = (courseId) => {
    const returnTo = `/course/${courseId}`;
    if (currentUser) {
      navigate(returnTo);
    } else {
      navigate("/login", { state: { returnTo } });
    }
  };

  return (
    <div className="container-page">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="mx-auto flex max-w-3xl flex-col items-center pt-16 text-center sm:pt-24">
        <div className="animate-fade-up">
          <Badge variant="warning" className="text-[0.7rem] tracking-[0.08em]">{t("hero.badge")}</Badge>
        </div>

        <h1
          className="mt-6 animate-fade-up text-balance text-[3.3rem] font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="text-ink-hi">{t("hero.titleStart")} </span>
          <span className="text-gradient">{t("hero.titleAccent")}</span>
          <span className="text-ink-hi">.</span>
        </h1>

        <p
          className="mt-6 max-w-xl animate-fade-up text-pretty text-base leading-relaxed text-ink sm:text-lg"
          style={{ animationDelay: "0.15s" }}
        >
          {t("hero.subtitle")}
        </p>

        <div
          className="mt-9 flex w-full animate-fade-up flex-col items-center gap-3 sm:w-auto sm:flex-row"
          style={{ animationDelay: "0.2s" }}
        >
          <Button size="lg" onClick={() => navigate("/courses")} className="w-full sm:w-auto">
            {t("hero.startFree")}
            <Icon name="arrow" size={18} />
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate("/quiz")} className="w-full sm:w-auto">
            <Icon name="play" size={18} />
            {t("hero.tryQuiz")}
          </Button>
        </div>

        {/* Trust row */}
        <div
          className="mt-10 flex animate-fade-up flex-col items-center gap-3 sm:flex-row sm:gap-5"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="flex -space-x-2.5">
            {["violet", "sky", "gold", "mint"].map((tone, i) => (
              <span
                key={tone}
                className={`grid h-9 w-9 place-items-center rounded-full border-2 border-ground text-sm font-bold text-white ${
                  ["bg-violet-600", "bg-sky", "bg-gold-500", "bg-state-success"][i]
                }`}
              >
                {["K", "A", "M", "J"][i]}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <span className="flex items-center gap-1 text-gold-400">
              <Icon name="star" size={15} className="fill-current" /> 4.8
            </span>
            <span className="text-ink-low">·</span>
            <span className="text-ink">{t("home.lovedBy")}</span>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="pt-24 sm:pt-32">
        <SecHead eyebrow={t("home.howEyebrow")} title={t("home.howTitle")} desc={t("home.howDesc")} />
        <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {HOW_STEPS.map((s, i) => (
            <div key={s.n} className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface p-6 shadow-clay sm:p-7">
              <span className="absolute right-5 top-3 select-none font-display text-4xl font-bold text-white/[0.05]">{s.n}</span>
              <div className={`grid h-14 w-14 place-items-center rounded-xl border shadow-clay-sm ${TINT[s.tone]}`}>
                <Icon name={s.icon} size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-hi">{t(`home.step${i + 1}Title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-low">{t(`home.step${i + 1}Text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURED COURSES ═══════════════ */}
      <section className="pt-24 sm:pt-32">
        <SecHead eyebrow={t("home.featuredEyebrow")} title={t("home.featuredTitle")} desc={t("home.featuredDesc")} />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {featured.map((c) => (
            <div key={c.id} className="flex flex-col gap-3.5 rounded-2xl border border-white/10 bg-surface p-5 shadow-clay">
              <div className="flex items-center justify-between">
                <span className="text-[0.64rem] font-extrabold uppercase tracking-[0.11em] text-ink-low">{c.category}</span>
                {/* The level, not an invented rating: it is the one thing that
                    tells a child whether this course is for them today. */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-extrabold text-sky shadow-clay-sm">
                  <Icon name="bar-chart" size={13} /> {c.difficulty}
                </span>
              </div>
              <div className={`grid h-28 place-items-center overflow-hidden rounded-2xl border border-white/5 p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.45)] ${courseTint(c)}`}>
                <img src={c.image} alt="" className="max-h-16 w-auto object-contain" />
              </div>
              <h3 className="line-clamp-2 text-base font-bold text-ink-hi">{c.title}</h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-ink-low">{c.desc}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-extrabold text-state-success shadow-clay-sm">
                  <Icon name="check" size={13} className="flex-none" />
                  <span className="truncate">
                    {t("home.freeLabel")} · {t("courses.moduleCount", { count: courseFacts(c).modules })}
                  </span>
                </span>
                <Button size="sm" onClick={() => openCourse(c.id)}>
                  {t("courses.viewCourse")} <Icon name="arrow-right" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={() => navigate("/courses")}>
            {t("home.browseAll")} <Icon name="arrow" size={16} />
          </Button>
        </div>
      </section>

      {/* ═══════════════ GAMIFICATION ═══════════════ */}
      <section className="pt-24 sm:pt-32">
        <SecHead eyebrow={t("home.gameEyebrow")} title={t("home.gameTitle")} desc={t("home.gameDesc")} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {GAME.map((g) => (
            <div key={g.key} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-surface p-5 text-left shadow-clay sm:flex-col sm:items-center sm:p-6 sm:text-center">
              <div className={`grid h-14 w-14 flex-none place-items-center rounded-xl border shadow-clay-sm ${TINT[g.tone]}`}>
                <Icon name={g.icon} size={26} />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink-hi sm:mt-4">{t(`home.game${g.key}Title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-low sm:mt-2">{t(`home.game${g.key}Text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <div className="pt-16 sm:pt-20">
        <StatsSection />
      </div>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="pt-16 pb-8 sm:pt-20 sm:pb-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-10 text-center shadow-clay sm:p-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(600px_200px_at_50%_0%,rgba(139,124,246,0.16),transparent_70%)]" />
          <div className="relative">
            <Badge variant="warning" className="text-[0.7rem] tracking-[0.08em]">{t("home.ctaEyebrow")}</Badge>
            <h2 className="mt-4 text-balance text-3xl font-black text-ink-hi sm:text-4xl">{t("home.ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-ink sm:text-lg">{t("home.ctaText")}</p>
            <div className="mt-7">
              <Button size="lg" onClick={() => navigate("/dashboard")}>
                {t("hero.startFree")} <Icon name="arrow" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Shared centered section header.
const SecHead = ({ eyebrow, title, desc }) => (
  <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-violet-500/[0.08] px-3.5 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.13em] text-violet-400">
      <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_currentColor]" />
      {eyebrow}
    </span>
    <h2 className="mt-4 text-balance text-2xl font-bold text-ink-hi sm:text-3xl md:text-[2.1rem]">{title}</h2>
    {desc && <p className="mx-auto mt-3 max-w-xl text-pretty text-ink-low sm:text-[1.02rem]">{desc}</p>}
  </div>
);

export default Home;
