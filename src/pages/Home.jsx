import { useNavigate } from "react-router-dom";
import Button from "../Components/ui/Button";
import Badge from "../Components/ui/Badge";
import Icon from "../Components/ui/Icon";
import HomeBackdrop from "../Components/home/HomeBackdrop";
import TryQuestion from "../Components/home/TryQuestion";
import ContentRing from "../Components/home/ContentRing";
import WaveCta from "../Components/home/WaveCta";
import { COURSES } from "../data/coursesData";
import { getLocalizedCourse } from "../utils/localizationUtils";
import { courseFacts } from "../utils/courseFacts";
import { courseTint } from "../utils/courseTint";
import { contentTotals } from "../utils/contentFacts";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { reducedMotion, finePointer } from "../utils/pointerField";

// Accent tints for the icon wells, reused across the page.
const TINT = {
  violet: "bg-violet-500/15 border-violet-500/30 text-violet-400",
  sky: "bg-sky/15 border-sky/30 text-sky",
  gold: "bg-gold-500/15 border-gold-500/30 text-gold-400",
  mint: "bg-state-success/15 border-state-success/30 text-state-success",
};

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
    if (currentUser) navigate(returnTo);
    else navigate("/login", { state: { returnTo } });
  };

  return (
    <div className="container-page relative">
      <HomeBackdrop />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative grid items-center gap-10 pt-7 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="min-w-0">
          {/* The header sits closer on a phone, so the pill needs air above
              it that the desktop layout does not. */}
          <Badge variant="warning" className="mt-5 text-[0.7rem] tracking-[0.08em] sm:mt-0">
            {t("hero.badge")}
          </Badge>

          <h1 /* Fluid under sm so "Learn by playing." holds one line on a small
                 phone instead of dropping "playing." onto a line of its own. */
            className="mt-[22px] text-balance text-[clamp(1.75rem,9.2vw,2.6rem)] font-black leading-[1.03] tracking-tight sm:text-6xl md:text-[4.1rem]">
            <span className="text-ink-hi">{t("hero.titleStart")} </span>
            <span className="text-gradient">{t("hero.titleAccent")}</span>
            <span className="text-ink-hi">.</span>
          </h1>

          <p className="mt-4 max-w-[34em] text-pretty text-[clamp(0.875rem,3.6vw,1rem)] leading-[1.55] text-ink sm:mt-5 sm:text-lg sm:leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-[30px] flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/courses")} className="flex-1 sm:flex-none">
              {t("hero.startFree")}
              <Icon name="arrow" size={18} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/quiz")}
              className="flex-1 sm:flex-none"
            >
              <Icon name="play" size={18} />
              {t("hero.tryQuiz")}
            </Button>
          </div>

          {/* What replaced four invented avatars and a 4.8 rating: three
              things that are true, two of them counted from the content. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:mt-7 sm:gap-x-4">
            <TruthItem value={contentTotals.courses.toLocaleString("en-US")} label={t("home.heroCourses")} />
            <Divider />
            <TruthItem value={contentTotals.xp.toLocaleString("en-US")} label={t("home.heroXp")} />
            <Divider />
            <TruthItem value={t("home.heroFree")} label={t("home.heroFreeNote")} />
          </div>
        </div>

        <TryQuestion />
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="pt-16 sm:pt-28">
        <SecHead eyebrow={t("home.howEyebrow")} title={t("home.howTitle")} desc={t("home.howDesc")} />
        <div className="grid gap-4 [perspective:1000px] sm:gap-5 md:grid-cols-3">
          {HOW_STEPS.map((s, i) => (
            <TiltCard key={s.n}>
              <span className="absolute right-5 top-3 select-none font-display text-4xl font-bold text-white/[0.05] [transform:translateZ(10px)]">
                {s.n}
              </span>
              <div
                className={`grid h-14 w-14 flex-none place-items-center rounded-xl border shadow-clay-sm [transform:translateZ(26px)] ${TINT[s.tone]}`}
              >
                <Icon name={s.icon} size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-hi [transform:translateZ(26px)]">
                {t(`home.step${i + 1}Title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-low [transform:translateZ(26px)]">
                {t(`home.step${i + 1}Text`)}
              </p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURED COURSES ═══════════════ */}
      <section className="pt-16 sm:pt-28">
        <SecHead
          eyebrow={t("home.featuredEyebrow")}
          title={t("home.featuredTitle")}
          desc={t("home.featuredDesc")}
        />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {featured.map((c) => {
            const facts = courseFacts(c);
            return (
              <div
                key={c.id}
                className="flex min-w-0 flex-col gap-3.5 rounded-2xl border border-white/10 bg-surface p-5 shadow-clay transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-2.5">
                  <span className="min-w-0 truncate text-[0.64rem] font-extrabold uppercase tracking-[0.11em] text-ink-low">
                    {c.category}
                  </span>
                  <span className="inline-flex flex-none items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-extrabold text-sky shadow-clay-sm">
                    <Icon name="bar-chart" size={13} /> {c.difficulty}
                  </span>
                </div>
                <div
                  className={`grid h-28 place-items-center overflow-hidden rounded-2xl border border-white/5 p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.45)] ${courseTint(c)}`}
                >
                  <img src={c.image} alt="" className="max-h-16 w-auto object-contain" />
                </div>
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-ink-hi">{c.title}</h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-ink-low">{c.desc}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                  <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-xs font-extrabold text-violet-300 shadow-clay-sm">
                    <Icon name="zap" size={13} className="flex-none" />
                    <span className="truncate">
                      {t("home.courseMeta", { modules: facts.modules, xp: facts.xp })}
                    </span>
                  </span>
                  <Button size="sm" onClick={() => openCourse(c.id)}>
                    {t("courses.viewCourse")} <Icon name="arrow-right" size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Button variant="secondary" onClick={() => navigate("/courses")}>
            {t("home.browseAll")} <Icon name="arrow" size={16} />
          </Button>
        </div>
      </section>

      {/* ═══════════════ WHAT'S INSIDE ═══════════════ */}
      <section className="pt-16 sm:pt-28">
        <SecHead
          eyebrow={t("home.insideEyebrow")}
          title={t("home.insideTitle")}
          desc={t("home.insideDesc")}
        />
        <ContentRing />
      </section>

      {/* ═══════════════ GAMIFICATION ═══════════════ */}
      <section className="pt-16 sm:pt-28">
        <SecHead eyebrow={t("home.gameEyebrow")} title={t("home.gameTitle")} desc={t("home.gameDesc")} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {GAME.map((g) => (
            <div
              key={g.key}
              className="flex min-w-0 items-start gap-3.5 rounded-2xl border border-white/10 bg-surface p-[18px] text-left shadow-clay lg:flex-col lg:items-center lg:gap-4 lg:p-6 lg:text-center"
            >
              <div
                className={`grid h-[46px] w-[46px] flex-none place-items-center rounded-xl border shadow-clay-sm lg:h-14 lg:w-14 ${TINT[g.tone]}`}
              >
                <Icon name={g.icon} size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-ink-hi">{t(`home.game${g.key}Title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-low">{t(`home.game${g.key}Text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="pb-8 pt-16 sm:pb-12 sm:pt-20">
        <WaveCta />
      </section>
    </div>
  );
};

const TruthItem = ({ value, label }) => (
  <span className="flex items-baseline gap-1.5 text-[0.72rem] font-medium text-ink-low sm:text-[0.8rem]">
    <b className="font-display text-[0.92rem] font-semibold tabular-nums text-ink-hi sm:text-[1.05rem]">
      {value}
    </b>
    {label}
  </span>
);

const Divider = () => (
  <span aria-hidden="true" className="hidden h-[22px] w-px bg-white/10 sm:block" />
);

/**
 * A step card that tilts toward the cursor in real perspective. It holds no
 * controls, so tilting it cannot move anything a reader is aiming at.
 */
const TiltCard = ({ children }) => {
  const tilt = (e) => {
    if (reducedMotion() || !finePointer()) return;
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const nx = (e.clientX - box.left) / box.width - 0.5;
    const ny = (e.clientY - box.top) / box.height - 0.5;
    card.style.transition = "transform 80ms linear";
    card.style.transform = `rotateY(${(nx * 11).toFixed(2)}deg) rotateX(${(-ny * 11).toFixed(
      2
    )}deg) translateZ(14px)`;
  };
  const rest = (e) => {
    e.currentTarget.style.transition = "";
    e.currentTarget.style.transform = "";
  };

  return (
    <div
      onPointerMove={tilt}
      onPointerLeave={rest}
      className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-surface p-[26px] shadow-clay transition-transform duration-500 [transform-style:preserve-3d] hover:border-violet-500/30"
    >
      {children}
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
    <h2 className="mt-4 text-balance text-2xl font-bold text-ink-hi sm:text-3xl md:text-[2.1rem]">
      {title}
    </h2>
    {desc && <p className="mx-auto mt-3 max-w-xl text-pretty text-ink-low sm:text-[1.02rem]">{desc}</p>}
  </div>
);

export default Home;
