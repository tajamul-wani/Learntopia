import Card from "../ui/Card";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import EmptyState from "../ui/EmptyState";
import ImageWithSkeleton from "../ui/ImageWithSkeleton";
import { useLanguage } from "../../context/LanguageContext";
import { getLocalizedQuiz } from "../../utils/localizationUtils";
import { courseTint } from "../../utils/courseTint";
import { quizzes as QUIZZES } from "../../data/quizData";
import { COURSES } from "../../data/coursesData";
import { QUIZ_LEVEL_XP } from "../../utils/xpGrants";

/** A quiz attempt records how many questions were right; an attempt tops out at 10. */
const questionTotal = (quiz) => Math.min(quiz?.questions?.length || 10, 10);

/**
 * Quizzes carry no art of their own, so they borrow the course they belong to.
 * The titles line up ("Python for Kids" against "Python for Kids: Build Your
 * First Game!"), and the subject is the fallback when they do not.
 */
const artFor = (quiz) => {
  if (!quiz) return null;
  const name = quiz.title.toLowerCase();
  return (
    COURSES.find((c) => c.title.toLowerCase().startsWith(name)) ||
    COURSES.find((c) => c.category?.toLowerCase() === quiz.subject?.toLowerCase()) ||
    null
  );
};

/**
 * Every quiz taken, at its best attempt.
 *
 * The score is the number of questions answered correctly, which is what the
 * quiz page itself shows, so this says "8 / 10" rather than a bare number. XP is
 * derived from that score at the same rate the quiz awards it, so nothing here
 * is a second source of truth.
 */
const QuizzesPanel = ({ quizzes, onTake }) => {
  const { t } = useLanguage();

  if (!quizzes.length) {
    return (
      <Card className="p-6 sm:p-8">
        <EmptyState
          icon="target"
          title={t("profile.quizzesEmpty")}
          description={t("profile.quizzesEmptyDesc")}
          action={<Button onClick={() => onTake(null)}>{t("nav.quiz")}</Button>}
        />
      </Card>
    );
  }

  const rows = quizzes.map((attempt) => {
    const quiz = QUIZZES.find((q) => q.id === attempt.quizId);
    const total = questionTotal(quiz);
    const score = Math.min(Number(attempt.score) || 0, total);
    return {
      key: attempt.quizId || attempt.title,
      id: attempt.quizId || null,
      title: attempt.quizId
        ? getLocalizedQuiz({ id: attempt.quizId, title: attempt.title }, t)?.title || attempt.title
        : attempt.title,
      subject: quiz?.subject || "",
      art: artFor(quiz),
      score,
      total,
      percent: total > 0 ? Math.round((score / total) * 100) : 0,
      xp: score * QUIZ_LEVEL_XP,
      perfect: total > 0 && score === total,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((row) => (
          <Card key={row.key} className="flex h-full min-w-0 flex-col p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className={`grid h-12 w-12 flex-none place-items-center overflow-hidden rounded-xl ${courseTint(row.art)}`}>
                {row.art?.image ? (
                  <ImageWithSkeleton src={row.art.image} alt="" imgClassName="h-9 w-9 object-contain" />
                ) : (
                  <Icon name="target" size={20} />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="line-clamp-2 min-w-0 flex-1 text-pretty text-[0.9375rem] font-bold leading-snug text-ink-hi sm:text-base">
                    {row.title}
                  </h3>

                </div>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-low">
                  {row.subject && <span className="truncate">{row.subject}</span>}
                  <span className="text-ink">+{row.xp} XP</span>
                  {row.perfect && (
                    <span className="rounded-full bg-state-success/[0.14] px-2 py-0.5 font-bold text-state-success">
                      {t("profile.quizPerfect")}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-3">
              <div
                className={`h-full rounded-full transition-[width] duration-500 ${
                  row.perfect ? "bg-state-success" : "bg-gradient-to-r from-violet-500 to-sky"
                }`}
                style={{ width: `${row.percent}%` }}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="order-last ml-auto font-display text-base font-semibold tabular-nums text-sky">
                {row.score} / {row.total}
              </span>
              {row.perfect ? (
                <span className="text-[0.8125rem] font-semibold text-ink-low">{t("profile.maxedOut")}</span>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => onTake(row.id)} className="gap-1.5 font-bold">
                  <Icon name="refresh-cw" size={15} />
                  {t("profile.beatIt")}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <p className="text-[0.8125rem] leading-relaxed text-ink-low">{t("profile.retakeNote")}</p>
    </div>
  );
};

export default QuizzesPanel;
