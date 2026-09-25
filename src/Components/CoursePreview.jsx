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
  const facts = courseFacts(course);
  const topics = courseSkills(course);
  const pct = progressPercent(enrolment, modules.length);

  return (
    <div className="container-page pb-8 pt-10 text-ink-hi md:pb-16 md:pt-16">
      <div className="mx-auto max-w-5xl animate-fade-in">

        {/* ── Hero ── */}
        <Card className="overflow-hidden p-6 sm:p-8 md:p-10">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-8">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-violet-300">
                {course?.category}
              </span>
              <h1 className="mt-4 text-[1.75rem] font-extrabold leading-[1.15] tracking-tight sm:text-4xl md:text-[2.75rem]">
                {course?.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-low sm:text-lg">
                {course?.desc}
              </p>
            </div>

            {/* The art is decorative, so it drops below the fold on a phone
                rather than pushing the title and the CTA off the screen. */}
            <div className={`hidden place-items-center rounded-3xl border border-white/[0.06] p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.45)] md:grid ${courseTint(course)}`}>
              <ImageWithSkeleton
                src={course?.image}
                alt=""
                imgClassName="h-28 w-auto object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.5)] lg:h-36"
              />
            </div>
          </div>

          {/* ── The honest numbers ── */}
          <CourseFactTiles course={course} className="mt-8" />

          {/* ── The one thing to do ── */}
          <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {pct > 0 && (
                <>
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-ink-low">
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
                <p className="text-sm text-ink-low">{t("coursePreview.freeForever")}</p>
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
          <section className="mt-8 md:mt-14">
            <h2 className="mb-4 text-xl font-extrabold sm:text-2xl">{t("coursePreview.whatYouLearn")}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
              {course.learningObjectives.map((objective) => (
                <div
                  key={objective}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-surface px-4 py-4 shadow-clay-sm lg:gap-4 lg:px-6 lg:py-5"
                >
                  <Icon name="check-circle" size={18} className="mt-0.5 flex-none text-state-success lg:h-[22px] lg:w-[22px]" />
                  <p className="text-[0.9375rem] leading-relaxed text-ink lg:text-[1.0625rem]">{objective}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── What it actually covers ──
            Taken from the module titles rather than written by hand, so it
            cannot describe a course that no longer exists. */}
        {topics.length > 0 && (
          <section className="mt-8 md:mt-14">
            <h2 className="mb-4 text-xl font-extrabold sm:text-2xl">{t("coursePreview.topics")}</h2>
            <div className="flex flex-wrap gap-2.5">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-[0.9375rem] font-semibold text-violet-300"
                >
                  {topic}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── The outline, lessons still closed ── */}
        <section className="mt-8 md:mt-14">
          <div className="mb-4">
            <h2 className="text-xl font-extrabold sm:text-2xl">{t("coursePreview.outline")}</h2>
            <p className="mt-1 text-sm text-ink-low">
              {t("coursePreview.contentCount", {
                lessons: facts.lessons,
                exercises: facts.exercises,
              })}
            </p>
          </div>

          <ol className="space-y-3">
            {modules.map((module, index) => {
              const done = Array.isArray(enrolment?.completedModules)
                && enrolment.completedModules.includes(index);
              return (
                <li
                  key={module.title}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-surface px-4 py-4 shadow-clay-sm sm:px-5"
                >
                  <span
                    className={`grid h-9 w-9 flex-none place-items-center rounded-xl text-[0.9375rem] font-bold tabular-nums sm:h-10 sm:w-10 ${
                      done
                        ? "bg-state-success/15 text-state-success"
                        : "bg-surface-3 text-ink-low"
                    }`}
                  >
                    {done ? <Icon name="check" size={17} /> : index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-balance text-base font-bold leading-snug">{module.title}</span>
                    {module.desc && (
                      <span className="mt-1 block text-pretty text-sm leading-relaxed text-ink-low">
                        {module.desc}
                      </span>
                    )}
                  </span>
                  {/* Sits on the badge's line rather than floating at the top
                      of a wrapped title. */}
                  <span className="flex flex-none items-center gap-2 self-start">
                    {module.xpReward > 0 && (
                      <span className="hidden items-center gap-1 rounded-lg bg-violet-500/12 px-2.5 py-1.5 text-xs font-bold text-violet-300 sm:inline-flex">
                        +{module.xpReward} XP
                      </span>
                    )}
                    {!done && action !== "continue" && action !== "restart" && (
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-ink-faint sm:h-10 sm:w-10">
                        <Icon name="lock" size={17} />
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ── Before you start ── */}
        {course?.prerequisites?.length > 0 && (
          <section className="mt-8 md:mt-14">
            <h2 className="mb-4 text-xl font-extrabold sm:text-2xl">{t("coursePreview.prerequisites")}</h2>
            <ul className="space-y-2.5">
              {course.prerequisites.map((item) => (
                <li key={item} className="flex items-start gap-3 text-pretty text-[0.9375rem] leading-relaxed text-ink">
                  <Icon name="check" size={17} className="mt-0.5 flex-none text-sky" />
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
