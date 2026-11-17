/**
 * Two dependency-free charts for the admin dashboard, drawn with the palette
 * tokens only. The admin route is code-split, so a charting library would be
 * dead weight for everyone else.
 */

export const Bars = ({ data, label, unit = "" }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div role="img" aria-label={label}>
      <div className="flex h-28 items-end gap-1">
        {data.map((d) => (
          <div key={d.key} className="flex h-full min-w-0 flex-1 items-end" title={`${d.key}: ${d.value}${unit}`}>
            <div
              className={`w-full rounded-t ${d.value > 0 ? "bg-violet-500" : "bg-white/10"}`}
              style={{ height: `${d.value > 0 ? Math.max(8, (d.value / max) * 100) : 4}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-ink-faint">
        <span>{data[0]?.key.slice(5)}</span>
        <span>{data[data.length - 1]?.key.slice(5)}</span>
      </div>
    </div>
  );
};

export const Line = ({ points, label }) => {
  if (points.length < 2) {
    return <p className="py-6 text-center text-xs text-ink-low">Not enough activity to draw a line yet.</p>;
  }
  const w = 300;
  const h = 100;
  const xs = points.map((p) => p.t);
  const minX = Math.min(...xs);
  const spanX = Math.max(1, Math.max(...xs) - minX);
  const maxY = Math.max(1, ...points.map((p) => p.y));
  const path = points
    .map((p) => `${(((p.t - minX) / spanX) * w).toFixed(1)},${(h - (p.y / maxY) * (h - 6) - 3).toFixed(1)}`)
    .join(" ");
  return (
    <div role="img" aria-label={label}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-28 w-full text-violet-400" preserveAspectRatio="none">
        <polyline points={path} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1.5 flex justify-between text-[10px] text-ink-faint">
        <span>{new Date(minX).toLocaleDateString()}</span>
        <span className="font-bold text-sky">{maxY} XP</span>
        <span>{new Date(minX + spanX).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
