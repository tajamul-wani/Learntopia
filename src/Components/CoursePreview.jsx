import Card from "./ui/Card";
import Button from "./ui/Button";
import Icon from "./ui/Icon";
import ImageWithSkeleton from "./ui/ImageWithSkeleton";
import CourseFactTiles from "./CourseFactTiles";
import { courseTint } from "../utils/courseTint";
import { useLanguage } from "../context/LanguageContext";
import { progressPercent } from "../utils/enrollmentState";
import { courseFacts, courseSkills } from "../utils/courseFacts";
import { TUTOR_NAME } from "../config/tutor";

/**
 * The course page as it looks before a learner joins — and the only way into a
 * course now that opening the page no longer enrols anyone.
 *
 * It has to sell the course to a child without lying to them: no rating, no
 * invented student count, no stock photographs of adults. Everything shown is
 * real — how many modules, how long, how much XP, what they will be able to do
 * at the end, and the actual outline with the lessons still closed.
 *
 * Props:
 *  - course       the localized course
 *  - action       "enroll" | "rejoin" | "continue" | "restart" | "view"
 *  - enrolment    their enrolment document, when they have one
 *  - onAction     runs the primary action
 *  - busy         disables the CTA while the write is in flight
 */
const CoursePreview = ({ course, action = "enroll", enrolment = null, onAction, busy = false }) => {
  const { t } = useLanguage();
  const modules = course?.syllabus || [];
  const totalXp = modules.reduce((sum, m) => sum + (Number(m.xpReward) || 0), 0);
  const pct = progressPercent(enrolment, modules.length);

  const facts = [
    { icon: "book-open", label: t("coursePreview.modules"), value: modules.length },
    { icon: "clock", label: t("coursePreview.duration"), value: course?.duration },
    { icon: "bar-chart", label: t("coursePreview.difficulty"), value: course?.difficulty },
    { icon: "zap", label: t("coursePreview.xpOnOffer"), value: `${totalXp} XP` },
  ].filter((f) => f.value);

  return (
    <div className="container-page py-8 text-ink-hi md:py-14">
      <div className="mx-auto max-w-5xl animate-fade-in">

        {/* ── Hero ── */}
        <Card className="overflow-hidden p-5 sm:p-7 md:p-9">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-8">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-violet-300">
                {course?.category}
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                {course?.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-low sm:text-base">
                {course?.desc}
              </p>
            </div>

            {/* The art is decorative, so it drops below the fold on a phone
                rather than pushing the title and the CTA off the screen. */}
            <div className="relative hidden justify-center md:flex">
              <div className="pointer-events-none absolute inset-0 m-auto h-24 w-32 rounded-full bg-violet-500/25 blur-2xl" />
              <ImageWithSkeleton
                src={course?.image}
                alt=""
                imgClassName="relative h-28 w-auto object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.5)] lg:h-36"
              />
            </div>
          </div>

          {/* ── The honest numbers ── */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-surface-2 px-3 py-2.5 shadow-clay-sm"
              >
                <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-violet-500/12 text-violet-300">
                  <Icon name={fact.icon} size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{fact.value}</span>
                  <span className="block text-[10px] uppercase tracking-[0.06em] text-ink-faint">
                    {fact.label}
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* ── The one thing to do ── */}
          <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {pct > 0 && (
                <>
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold text-ink-low">
                    <span>{t("coursePreview.yourProgress")}</span>
                    <span className="tabular-nums text-ink-hi">{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-3 sm:w-64">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </>
              )}
              {pct === 0 && (
                <p className="text-xs text-ink-low">{t("coursePreview.freeForever")}</p>
              )}
            </div>

            <Button
              size="lg"
              onClick={onAction}
              loading={busy}
              disabled={busy}
              className="w-full justify-center gap-2 font-bold sm:w-auto"
            >
              <Icon name={action === "restart" ? "refresh-cw" : "play-circle"} size={18} />
              {t(`coursePreview.cta.${action}`)}
            </Button>
          </div>
        </Card>

        {/* ── What you'll be able to do ── */}
        {course?.learningObjectives?.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-extrabold sm:text-xl">{t("coursePreview.whatYouLearn")}</h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {course.learningObjectives.map((objective) => (
                <div
                  key={objective}
                  className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-surface px-3.5 py-3 shadow-clay-sm"
                >
                  <Icon name="check-circle" size={16} className="mt-0.5 flex-none text-state-success" />
                  <p className="text-sm leading-relaxed text-ink">{objective}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── The outline, lessons still closed ── */}
        <section className="mt-6">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-extrabold sm:text-xl">{t("coursePreview.outline")}</h2>
            <span className="text-xs text-ink-faint">
              {t("coursePreview.moduleCount", { count: modules.length })}
            </span>
          </div>

          <ol className="space-y-2.5">
            {modules.map((module, index) => {
              const done = Array.isArray(enrolment?.completedModules)
                && enrolment.completedModules.includes(index);
              return (
                <li
                  key={module.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-surface px-3.5 py-3 shadow-clay-sm sm:px-4"
                >
                  <span
                    className={`grid h-7 w-7 flex-none place-items-center rounded-lg text-xs font-bold tabular-nums ${
                      done
                        ? "bg-state-success/15 text-state-success"
                        : "bg-surface-3 text-ink-low"
                    }`}
                  >
                    {done ? <Icon name="check" size={14} /> : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-snug">{module.title}</span>
                    {module.desc && (
                      <span className="mt-0.5 block text-xs leading-relaxed text-ink-low">
                        {module.desc}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-none items-center gap-2">
                    {module.xpReward > 0 && (
                      <span className="hidden items-center gap-1 rounded-md bg-violet-500/12 px-2 py-0.5 text-[10px] font-bold text-violet-300 sm:inline-flex">
                        +{module.xpReward} XP
                      </span>
                    )}
                    {!done && action !== "continue" && action !== "restart" && (
                      <Icon name="lock" size={14} className="text-ink-faint" />
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── Before you start ── */}
        {course?.prerequisites?.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-extrabold sm:text-xl">{t("coursePreview.prerequisites")}</h2>
            <ul className="space-y-2">
              {course.prerequisites.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                  <Icon name="check" size={15} className="mt-0.5 flex-none text-sky" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* The two things that are real and worth saying once: who helps, and
            what finishing pays out. */}
        <div className="mt-8 grid gap-3.5 sm:grid-cols-2 md:mt-14">
          <Card className="flex items-center gap-3.5 p-4 sm:p-5">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-sky/12 text-sky shadow-clay-sm">
              <Icon name="robot" size={20} />
            </span>
            <p className="min-w-0 text-sm text-ink">
              {t("coursePreview.tutorLine", { name: TUTOR_NAME })}
            </p>
          </Card>
          {facts.badge && (
            <Card className="flex items-center gap-3.5 p-4 sm:p-5">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-gold-500/12 text-gold-400 shadow-clay-sm">
                <Icon name={course?.badge?.icon || "award"} size={20} />
              </span>
              <p className="min-w-0 text-sm text-ink">
                {t("coursePreview.badgeLine", { name: facts.badge })}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
