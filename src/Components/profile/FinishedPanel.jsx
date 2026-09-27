import Card from "../ui/Card";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import EmptyState from "../ui/EmptyState";
import CourseMark from "./CourseMark";
import { useLanguage } from "../../context/LanguageContext";
import { COURSES } from "../../data/coursesData";
import capLottie from "../../assets/lottie/graduation_cap.lottie?url";

/**
 * Courses the learner has finished, and the badge each one earned.
 *
 * The last card is not filler: when something is close to done it says so, so
 * the tab points at the next finish rather than being a wall of things already
 * behind them.
 */
const FinishedPanel = ({ finished, nearest, onOpen, onBrowse }) => {
  const { t } = useLanguage();

  if (!finished.length) {
    return (
      <Card className="p-6 sm:p-8">
        <EmptyState
          icon="graduation-cap"
          lottie={capLottie}
          title={t("profile.finishedEmpty")}
          description={t("profile.finishedEmptyDesc")}
          action={<Button onClick={onBrowse}>{t("profile.browseCourses")}</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {finished.map((course) => {
        const badge = COURSES.find((c) => String(c.id) === String(course.courseId))?.badge;
        return (
          <Card key={course.courseId} className="min-w-0 border-state-success/20 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <CourseMark courseId={course.courseId} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-state-success/[0.13] px-2.5 py-1 text-xs font-bold text-state-success">
                <Icon name="check" size={13} />
                {t("profile.tabFinished")}
              </span>
            </div>

            <div className="mt-4 text-base font-bold text-ink-hi sm:text-lg">{course.title}</div>

            {badge?.name && (
              <div className="mt-3 flex items-center gap-2.5">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-gold-500/[0.14] text-gold-400">
                  <Icon name={badge.icon || "award"} size={16} />
                </span>
                <span className="min-w-0 truncate text-[0.8125rem] font-semibold text-ink">
                  {t("profile.badgeEarned", { name: badge.name })}
                </span>
              </div>
            )}

            <div className="mt-5">
              <Button variant="ghost" onClick={() => onOpen(course)} className="gap-2 font-bold">
                <Icon name="refresh-cw" size={16} />
                {t("profile.review")}
              </Button>
            </div>
          </Card>
        );
      })}

      {nearest && (
        <Card className="flex min-w-0 flex-col items-center justify-center gap-2.5 border-dashed border-white/15 bg-surface/50 p-5 text-center sm:p-6">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface-2 text-ink">
            <Icon name="target" size={20} />
          </span>
          <span className="text-[0.9375rem] font-bold text-ink-hi">{t("profile.nearlyThere")}</span>
          <span className="text-[0.8125rem] leading-relaxed text-ink-low">
            {t("profile.nearlyThereDesc", { title: nearest.title, pct: nearest.percent })}
          </span>
          <Button variant="ghost" onClick={() => onOpen(nearest.course)} className="mt-1 font-bold">
            {t("profile.continue")}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default FinishedPanel;
