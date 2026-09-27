import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Icon from "../ui/Icon";
import { useLanguage } from "../../context/LanguageContext";

const DAY_MS = 24 * 60 * 60 * 1000;
/** An 11px cell plus the 3px gap between columns. */
const COLUMN = 14;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * The learning year, a day per square.
 *
 * Only the current streak is filled, and that is the honest limit: the app
 * stores a streak COUNT, not which days were active, so a run of nine days can
 * be placed on the calendar with certainty and nothing before it can. Days with
 * no record are drawn as empty rather than as "did not learn", because the
 * difference matters and the app cannot tell them apart. Once daily activity is
 * recorded this grid fills in without changing shape.
 *
 * The window ends today and moves with it, so the calendar is never stale.
 *
 * It shows only as many weeks as the width can hold, so a narrow screen gets
 * whole recent months rather than a year sliced off mid-column with no sign
 * that anything is missing. Expanding gives the full year, scrolling sideways.
 */
const StreakCalendar = ({ streak = 0, activeDays = null, weeks = 53 }) => {
  const { t, currentLang } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const [fitWeeks, setFitWeeks] = useState(weeks);
  const measureRef = useRef(null);
  const scrollRef = useRef(null);

  // Measured against the real available width, so the fit is the layout's own
  // answer rather than a breakpoint's guess at one.
  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node || typeof ResizeObserver === "undefined") return undefined;
    const measure = () => setFitWeeks(Math.max(6, Math.min(weeks, Math.floor(node.clientWidth / COLUMN))));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [weeks]);

  const visibleWeeks = expanded ? weeks : Math.min(weeks, fitWeeks);
  const overflows = fitWeeks < weeks;

  // Expanding is only useful if it lands on today rather than last October.
  useEffect(() => {
    if (!expanded) return;
    const node = scrollRef.current;
    if (node) node.scrollLeft = node.scrollWidth;
  }, [expanded]);

  const { columns, monthLabels, activeCount } = useMemo(() => {
    const today = startOfDay(new Date());
    // End on the Saturday of this week so the last column is a whole week.
    const end = new Date(today.getTime() + (6 - today.getDay()) * DAY_MS);
    const start = new Date(end.getTime() - (visibleWeeks * 7 - 1) * DAY_MS);

    // The streak counts today and the days immediately before it.
    const streakStart = streak > 0 ? today.getTime() - (streak - 1) * DAY_MS : null;
    // Days the app has actually recorded. The streak run still fills in on top,
    // which covers the days before recording began.
    const recorded = new Set(Array.isArray(activeDays) ? activeDays : []);
    const key = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const cols = [];
    const labels = [];
    let seenMonth = -1;
    let active = 0;

    for (let w = 0; w < visibleWeeks; w += 1) {
      const days = [];
      for (let d = 0; d < 7; d += 1) {
        const date = new Date(start.getTime() + (w * 7 + d) * DAY_MS);
        const time = date.getTime();
        const future = time > today.getTime();
        const inStreak =
          !future && (recorded.has(key(date)) || (streakStart !== null && time >= streakStart));
        if (inStreak) active += 1;
        days.push({ key: time, date, future, inStreak });
      }
      const firstOfWeek = days[0].date;
      if (firstOfWeek.getMonth() !== seenMonth && firstOfWeek.getDate() <= 7) {
        seenMonth = firstOfWeek.getMonth();
        labels.push({ week: w, label: firstOfWeek.toLocaleDateString(currentLang, { month: "short" }) });
      }
      cols.push(days);
    }
    return { columns: cols, monthLabels: labels, activeCount: active };
  }, [streak, activeDays, visibleWeeks, currentLang]);

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-display text-base font-semibold text-ink-hi">{t("profile.streakCalendar")}</h3>
        <span className="text-xs text-ink-low">{t("profile.streakDaysShown", { count: activeCount })}</span>
      </div>

      <div ref={measureRef} className="mt-3 min-w-0">
        <div ref={scrollRef} className={`max-w-full pb-1 ${expanded ? "scroll-x" : ""}`}>
          <div className={expanded ? "inline-block min-w-max" : ""}>
          <div className="relative mb-1 h-3.5">
            {monthLabels.map((m) => (
              <span
                key={`${m.week}-${m.label}`}
                className="absolute top-0 text-[0.625rem] font-semibold text-ink-low"
                style={{ left: `${m.week * COLUMN}px` }}
              >
                {m.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {columns.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <span
                    key={day.key}
                    title={`${day.date.toLocaleDateString(currentLang, { day: "numeric", month: "short", year: "numeric" })}${
                      day.inStreak ? ` - ${t("profile.streakActiveDay")}` : ""
                    }`}
                    className={`h-[11px] w-[11px] rounded-[3px] ${
                      day.future
                        ? "bg-surface-2/40"
                        : day.inStreak
                          ? "bg-gold-400"
                          : "bg-surface-3"
                    }`}
                  />
                ))}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>

      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          data-testid="streak-expand"
          aria-expanded={expanded}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:text-ink-hi"
        >
          <Icon
            name="chevron-down"
            size={13}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? t("profile.streakCollapse") : t("profile.streakExpand")}
        </button>
      )}

      {/* A key, the way a contribution graph has one: a square is filled on a
          day you opened Learntopia and left blank on a day you did not. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.6875rem] text-ink-low">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[11px] w-[11px] rounded-[3px] bg-gold-400" />
          {t("profile.streakLegendOn")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-[11px] w-[11px] rounded-[3px] bg-surface-3" />
          {t("profile.streakLegendOff")}
        </span>
      </div>

      <p className="mt-2.5 text-xs leading-relaxed text-ink-low">{t("profile.streakCalendarNote")}</p>
    </div>
  );
};

export default StreakCalendar;
