import Icon from "./ui/Icon";
import { courseFacts } from "../utils/courseFacts";
import { useLanguage } from "../context/LanguageContext";

/**
 * The four things worth knowing before starting a course: how much of it there
 * is, how long it takes, how hard it is and what it pays out.
 *
 * Shared by the preview and the course header so the two can never drift into
 * showing the same facts two different ways. Every value is counted from the
 * course itself (see utils/courseFacts.js) — none of it is authored.
 *
 * Layout follows the space. On a phone the tile is a centred stack — mark,
 * value, label — because a row there leaves the value about eighty pixels and
 * starts clipping words; the type and the mark are sized up to match, since a
 * phone tile has the whole column to itself. From `sm` the grid puts the mark
 * and the value in one row and the label beneath the value, so the mark is
 * centred on the headline instead of drifting between the two lines.
 *
 * `gridClassName` is how a caller says how much room it actually has: the
 * preview gets the full page width, the course header only a column beside the
 * artwork, and four across in that column leaves the value about a hundred
 * pixels.
 */
const CourseFactTiles = ({ course, className = "", gridClassName = "grid-cols-2 lg:grid-cols-4" }) => {
  const { t } = useLanguage();
  const facts = courseFacts(course);

  const tiles = [
    { icon: "book-open", label: t("coursePreview.modules"), value: facts.modules },
    { icon: "clock", label: t("coursePreview.duration"), value: facts.duration },
    { icon: "bar-chart", label: t("coursePreview.difficulty"), value: facts.difficulty },
    { icon: "zap", label: t("coursePreview.xpOnOffer"), value: `${facts.xp} XP` },
  ].filter((tile) => tile.value);

  if (tiles.length === 0) return null;

  return (
    <div className={`grid gap-3 sm:gap-3.5 ${gridClassName} ${className}`}>
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-surface-2 px-4 py-5 text-center shadow-clay-sm sm:grid sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-x-3.5 sm:gap-y-0 sm:py-4 sm:text-left"
        >
          {/* Three siblings, not a chip beside a text block. On a phone they
              stack; from `sm` the grid puts the mark and the value in one row
              and the label beneath the value, so the mark is centred on the
              headline rather than drifting down between the two lines. */}
          <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl border border-violet-500/20 bg-violet-500/15 text-violet-300 sm:rounded-xl">
            <Icon name={tile.icon} size={22} className="lg:h-6 lg:w-6" />
          </span>
          {/* Never truncated: a clipped "Begin..." tells a learner nothing,
              and these values are short enough to wrap. */}
          <span className="min-w-0 text-xl font-extrabold leading-tight lg:text-[1.375rem]">
            {tile.value}
          </span>
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.04em] text-ink-faint sm:col-start-2">
            {tile.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CourseFactTiles;
