/**
 * A stable accent per course, so the art wells read as six different courses
 * rather than six identical dark holes.
 *
 * Keyed by course id rather than by position in a list, so a course keeps its
 * colour wherever it appears — catalog, home, preview, course header — and
 * filtering or reordering the list never reshuffles the palette. Every value is
 * a design-system token (see tailwind.config.js); nothing new is introduced.
 */
const TINTS = [
  "bg-violet-500/10",
  "bg-sky/10",
  "bg-state-success/10",
  "bg-gold-500/10",
  "bg-violet-400/10",
  "bg-state-warning/10",
];

export function courseTint(course) {
  const id = Number(course?.id);
  if (!Number.isFinite(id)) return TINTS[0];
  return TINTS[Math.abs(id) % TINTS.length];
}
