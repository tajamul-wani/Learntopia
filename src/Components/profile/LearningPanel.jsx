import { useEffect, useRef } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import EmptyState from "../ui/EmptyState";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import { useLanguage } from "../../context/LanguageContext";
import { courseTint } from "../../utils/courseTint";
import { COURSES } from "../../data/coursesData";

const lookup = (courseId) => COURSES.find((c) => String(c.id) === String(courseId));

const progress = (course) => {
  const done = Array.isArray(course?.completedModules) ? course.completedModules.length : 0;
  const total = Number(course?.totalModules) || 0;
  return { done, total, percent: total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0 };
};

/**
 * One course.
 *
 * The percentage sits on the title's own baseline rather than centred against
 * the whole block, which is what made it look adrift. Actions are pushed to the
 * bottom so every card in a row ends on the same line whatever its title does.
 */
const CourseCard = ({ course, paused, onOpen, onPause, onRejoin, innerRef, highlight }) => {
  const { t } = useLanguage();
  const { done, total, percent } = progress(course);
  const meta = lookup(course.courseId);

  return (
    <Card
      ref={innerRef}
      className={`flex h-full min-w-0 flex-col p-5 transition-shadow duration-500 sm:p-6 ${
        paused ? "border-gold-500/25" : ""
      } ${highlight ? "border-gold-400/60 shadow-[0_0_0_2px_rgba(251,191,36,0.35)]" : ""}`}
    >
      <div className="flex items-start gap-3.5">
        <span className={`grid h-14 w-14 flex-none place-items-center overflow-hidden rounded-2xl ${courseTint(meta)}`}>
          {meta?.image ? (
            <ImageWithSkeleton src={meta.image} alt="" imgClassName="h-11 w-11 object-contain" />
          ) : (
            <Icon name={meta?.badge?.icon || "book-open"} size={24} />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="line-clamp-2 min-w-0 flex-1 text-pretty text-base font-bold leading-snug text-ink-hi">
              {course.title}
            </h3>
            {paused && (
              <span className="flex-none rounded-full bg-gold-500/[0.14] px-2.5 py-0.5 text-[0.6875rem] font-bold text-gold-400">
                {t("profile.paused")}
              </span>
            )}
          </div>
          {meta?.category && <p className="mt-1 truncate text-xs text-ink-low">{meta.category}</p>}
        </div>
      </div>

      <div className="mt-5 flex-1">
        {total > 0 && (
          <p className="mb-2 text-[0.8125rem] font-semibold text-ink">{t("profile.moduleOf", { done, total })}</p>
        )}
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {!paused && (
          <span className="order-last ml-auto font-display text-base font-semibold tabular-nums text-sky">
            {percent}%
          </span>
        )}
        {paused ? (
          <Button size="sm" variant="ghost" onClick={() => onRejoin(course)} className="gap-1.5 font-bold">
            <Icon name="refresh-cw" size={15} />
            {t("profile.pickBackUp")}
          </Button>
        ) : (
          <>
            <Button size="sm" onClick={() => onOpen(course)} className="gap-1.5 font-bold">
              <Icon name="play-circle" size={15} />
              {t("profile.continue")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onPause(course)} className="text-ink-low">
              {t("profile.pauseCourse")}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

const SectionHeading = ({ title, count }) => (
  <div className="flex items-baseline gap-2.5">
    <h2 className="font-display text-base font-semibold text-ink-hi sm:text-lg">{title}</h2>
    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs font-bold tabular-nums text-ink-low">{count}</span>
  </div>
);

/**
 * What the learner has on the go.
 *
 * Active and paused are two headed sections of one list rather than a second
 * row of tabs: the page already has a tab bar, and stacking another under it
 * meant two navigations doing the same job. Pausing a course scrolls to where it
 * has just landed, so the course is not simply gone from where it was.
 */
const LearningPanel = ({ active, paused, justPausedId, onOpen, onPause, onRejoin, onBrowse }) => {
  const { t } = useLanguage();
  const pausedRefs = useRef({});

  useEffect(() => {
    if (!justPausedId) return;
    const node = pausedRefs.current[justPausedId];
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [justPausedId]);

  if (!active.length && !paused.length) {
    return (
      <Card className="p-6 sm:p-8">
        <EmptyState
          icon="book-open"
          title={t("profile.learningEmpty")}
          description={t("profile.learningEmptyDesc")}
          action={<Button onClick={onBrowse}>{t("profile.browseCourses")}</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <SectionHeading title={t("profile.subTabActive")} count={active.length} />
        {active.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {active.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                onOpen={onOpen}
                onPause={onPause}
              />
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <EmptyState
              icon="book-open"
              title={t("profile.activeEmpty")}
              description={t("profile.learningEmptyDesc")}
              action={<Button onClick={onBrowse}>{t("profile.browseCourses")}</Button>}
            />
          </Card>
        )}
      </section>

      {paused.length > 0 && (
        <section className="flex flex-col gap-4">
          <SectionHeading title={t("profile.subTabPaused")} count={paused.length} />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paused.map((course) => (
              <CourseCard
                key={course.courseId}
                course={course}
                paused
                onRejoin={onRejoin}
                highlight={String(course.courseId) === String(justPausedId)}
                innerRef={(node) => {
                  pausedRefs.current[course.courseId] = node;
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default LearningPanel;
