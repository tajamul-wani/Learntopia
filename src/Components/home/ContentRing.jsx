import { useEffect, useRef, useState } from "react";
import { contentTotals } from "../../utils/contentFacts";
import { useLanguage } from "../../context/LanguageContext";
import {
  pointer,
  trackPointer,
  animateWhileVisible,
  fitCanvas,
} from "../../utils/pointerField";
import { CHANNEL, tone } from "../../utils/paletteTokens";

/** The eight counted figures, in the order they sit around the ring. */
const STATS = [
  { key: "courses", labelKey: "home.statCourses", chan: "violetSoft", ink: "text-violet-300", ring: "border-violet-400/45 bg-surface-2" },
  { key: "modules", labelKey: "home.statModules", chan: "sky", ink: "text-sky", ring: "border-sky/45 bg-surface-2" },
  { key: "lessons", labelKey: "home.statLessons", chan: "violet", ink: "text-ink-hi", ring: "border-violet-500/45 bg-surface-2" },
  { key: "exercises", labelKey: "home.statExercises", chan: "violetSoft", ink: "text-violet-300", ring: "border-violet-400/45 bg-surface-2" },
  { key: "activities", labelKey: "home.statActivities", chan: "success", ink: "text-state-success", ring: "border-state-success/45 bg-surface-2" },
  { key: "xp", labelKey: "home.statXp", chan: "gold", ink: "text-gold-400", ring: "border-gold-500/45 bg-surface-2" },
  { key: "quizzes", labelKey: "home.statQuizzes", chan: "sky", ink: "text-sky", ring: "border-sky/45 bg-surface-2" },
  { key: "questions", labelKey: "home.statQuestions", chan: "violet", ink: "text-ink-hi", ring: "border-violet-500/45 bg-surface-2" },
];

/**
 * What the library adds up to, as a ring turning in three dimensions with
 * a number at each vertex.
 *
 * Shape follows the box rather than a fixed tilt. Eight labels almost on
 * one horizontal line crowd each other on a phone, so where the box is
 * narrow the ring opens toward a circle and the labels separate
 * vertically as well as across; where there is width it lies back into a
 * flat ellipse.
 *
 * Position comes straight off the ellipse and is bounded by the extents,
 * so no label can leave the panel at any cursor position. Projecting the
 * position through a focal length instead gave an unbounded scale, and a
 * flat tilt threw every number clean out of the card.
 *
 * Only the wires are drawn. The numbers are real text, so they stay sharp,
 * selectable and readable aloud — and the flat grid below is what shows
 * before this starts, and what stays if canvas is unavailable.
 */
const ContentRing = () => {
  const { t } = useLanguage();
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const nodeRefs = useRef([]);
  const trackRef = useRef(null);
  const [live, setLive] = useState(false);

  // Two passes on purpose. The ring is hidden until this component knows
  // canvas is available, and an element that is display:none measures zero
  // wide — measuring in the same pass that reveals it left the ring stuck
  // at width 0, with every label parked in the corner.
  useEffect(() => {
    if (canvasRef.current && canvasRef.current.getContext) setLive(true);
  }, []);

  useEffect(() => {
    if (!live) return undefined;
    trackPointer();
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !canvas.getContext) return undefined;

    const points = STATS.map((stat, i) => ({
      angle: (Math.PI * 2 * i) / STATS.length,
      chan: CHANNEL[stat.chan],
    }));
    let width = 0;
    let height = 0;
    let ctx = null;
    let spin = 0;
    let leanX = 0;
    let leanY = 0;

    const size = () => {
      const fitted = fitCanvas(canvas, host);
      width = fitted.width;
      height = fitted.height;
      ctx = fitted.ctx;
    };

    const draw = () => {
      if (!ctx || !width) return;
      spin += 0.0023;
      leanX += ((pointer.x - 0.5) * 0.7 - leanX) * 0.05;
      leanY += ((pointer.y - 0.5) * 0.3 - leanY) * 0.05;

      const cx = width / 2;
      const cy = height / 2;
      const narrow = width < 465;

      /* The bodies are sized from the ring, not from a CSS breakpoint.
         Sizing them by viewport left a band roughly 600-1000px wide where
         the ring had shrunk but the discs had not, and eight of them
         piled into each other around the middle.
         Two passes: guess a size, lay out the ellipse the padding allows,
         then shrink the discs to the gap between neighbours. */
      const fit = (disc) => {
        const pad = disc / 2 + 14;
        const rx = Math.max(58, Math.min(width / 2 - pad, 400));
        const vy = Math.max(
          44,
          Math.min(Math.max(44, height / 2 - pad), rx * (narrow ? 0.92 : 0.58) * (1 + leanY * 0.5))
        );
        // Ramanujan's approximation, close enough to space eight bodies.
        const perimeter =
          Math.PI * (3 * (rx + vy) - Math.sqrt((3 * rx + vy) * (rx + 3 * vy)));
        return { rx, vy, gap: perimeter / STATS.length };
      };

      const guess = Math.max(58, Math.min(Math.min(width, height) * 0.2, 104));
      const first = fit(guess);
      const disc = Math.max(58, Math.min(guess, first.gap * 0.84, 104));
      const { rx, vy } = fit(disc);

      host.style.setProperty("--disc", `${Math.round(disc)}px`);
      host.style.setProperty("--core", `${Math.round(disc * 0.82)}px`);

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const a = p.angle + spin + leanX;
        const near = Math.sin(a);
        p.x = cx + Math.cos(a) * rx;
        p.y = cy + near * vy;
        p.depth = 0.82 + near * 0.18;
      }

      ctx.clearRect(0, 0, width, height);

      // Haloes breathing out of the core, so the middle is a source rather
      // than a gap the wires happen to meet in.
      const coreReach = Math.min(width, height) * 0.34;
      for (let h = 0; h < 3; h += 1) {
        const phase = ((spin * 1.6 + h / 3) % 1 + 1) % 1;
        const ring = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreReach * phase + 1);
        const strength = Math.sin(phase * Math.PI) * 0.1;
        ring.addColorStop(0, tone(CHANNEL.violet, 0));
        ring.addColorStop(0.82, tone(CHANNEL.violet, strength.toFixed(3)));
        ring.addColorStop(1, tone(CHANNEL.violet, 0));
        ctx.fillStyle = ring;
        ctx.fillRect(0, 0, width, height);
      }

      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.22);
      core.addColorStop(0, tone(CHANNEL.violet, 0.3));
      core.addColorStop(1, tone(CHANNEL.violet, 0));
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1.2;
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        const depth = (a.depth + b.depth) / 2;
        const seg = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        seg.addColorStop(0, tone(a.chan, (Math.pow(depth, 4) * 0.5).toFixed(3)));
        seg.addColorStop(1, tone(b.chan, (Math.pow(depth, 4) * 0.5).toFixed(3)));
        ctx.strokeStyle = seg;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.lineWidth = 1;
      for (const p of points) {
        ctx.strokeStyle = tone(CHANNEL.sky, (Math.pow(p.depth, 6) * 0.22).toFixed(3));
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // A light under each number, in that number's own colour.
      for (const p of points) {
        const reach = 58 * p.depth;
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, reach);
        halo.addColorStop(0, tone(p.chan, (0.34 * Math.pow(p.depth, 3)).toFixed(3)));
        halo.addColorStop(1, tone(p.chan, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(p.x, p.y, reach, 0, Math.PI * 2);
        ctx.fill();
      }

      points.forEach((p, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const scale = Math.max(0.8, Math.min(1.12, 0.8 + (p.depth - 0.86) * 1.1));
        el.style.transform = `translate(-50%, -50%) translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(
          1
        )}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = Math.max(0.66, Math.pow(p.depth, 4)).toFixed(3);
        // Small numbers, and inside an isolated box: these order the
        // bodies against each other, nothing else on the page.
        el.style.zIndex = String(Math.round(p.depth * 10));
      });
    };

    size();
    const onResize = () => {
      size();
      draw();
    };
    window.addEventListener("resize", onResize);
    const stop = animateWhileVisible(host, draw);

    return () => {
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, [live]);

  useEffect(() => {
    if (!live) return undefined;
    const track = trackRef.current;
    if (!track) return undefined;

    let offset = 0;
    let last = 0;
    let paused = false;
    const SPEED = 42; // px per second

    const hold = () => { paused = true; };
    const release = () => { paused = false; };
    track.addEventListener("pointerenter", hold);
    track.addEventListener("pointerleave", release);
    track.addEventListener("touchstart", hold, { passive: true });
    track.addEventListener("touchend", release);

    const step = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      // The list is rendered twice, so wrapping at half the track's width
      // puts the second copy exactly where the first was: no seam.
      const half = track.scrollWidth / 2;
      if (half > 0) {
        if (!paused) offset = (offset + SPEED * dt) % half;
        track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;
      }
    };

    return animateWhileVisible(track, step);
  }, [live]);

  const value = (key) => contentTotals[key].toLocaleString("en-US");

  return (
    <div className="relative overflow-hidden max-[569px]:overflow-visible max-[569px]:border-0 max-[569px]:bg-transparent max-[569px]:p-0 max-[569px]:shadow-none rounded-3xl border border-violet-500/15 bg-ground px-[26px] py-5 shadow-clay sm:p-[34px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(139,124,246,0.10),transparent_62%)] max-[569px]:hidden"
      />
      {/* The ring, once it is running. */}
      <div
        ref={hostRef}
        data-testid="content-ring"
        className={`relative isolate -mt-1 mb-0.5 h-[clamp(368px,88vw,500px)] lg:h-[500px] ${
          live ? "hidden min-[570px]:block" : "hidden"
        }`}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

        {/* What it all revolves around. The mark the rest of the app wears,
            so the ring reads as this library orbiting Learntopia rather
            than eight numbers around an empty middle. */}
        {/* Two elements on purpose: the outer one centres, the inner one
            breathes. Both on the same element and the animation's transform
            wins, which knocks the mark off the axis everything turns on. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <span
            style={{ width: "var(--core, 68px)", height: "var(--core, 68px)" }}
            className="grid animate-tutor-breathe place-items-center rounded-full border border-violet-500/25 bg-surface-2 shadow-clay"
          >
            <img
              src="/logo.svg"
              alt=""
              width={64}
              height={64}
              decoding="async"
              style={{ width: "calc(var(--core, 68px) * 0.68)", height: "calc(var(--core, 68px) * 0.68)" }}
            />
          </span>
        </span>
        {STATS.map((stat, i) => (
          <div
            key={stat.key}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            style={{ width: "var(--disc, 78px)", height: "var(--disc, 78px)" }}
            className={`pointer-events-none absolute left-0 top-0 grid origin-center place-items-center rounded-full border px-1 text-center shadow-clay-sm will-change-transform ${stat.ring}`}
          >
            <span>
              <b
                style={{ fontSize: "calc(var(--disc, 78px) * 0.21)" }}
                className={`block font-display font-bold leading-none tabular-nums ${stat.ink}`}
              >
                {value(stat.key)}
              </b>
              <span
                style={{ fontSize: "max(7px, calc(var(--disc, 78px) * 0.082))" }}
                className="mt-1 block font-bold uppercase leading-tight tracking-[0.04em] text-ink"
              >
                {t(stat.labelKey)}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Below 570px eight bodies cannot orbit without crowding, so the
          same circles travel instead. The list is rendered twice and the
          track slides exactly half its width, so it loops with no seam and
          needs no script. It pauses while a finger or cursor is on it, and
          index.css drops the animation under prefers-reduced-motion. */}
      {live && (
        <div
          data-testid="content-slider"
          data-clips-intentionally=""
          className="-mx-4 overflow-hidden min-[570px]:hidden"
        >
          <div
            ref={trackRef}
            className="relative flex w-max items-center gap-3 py-1 will-change-transform before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-violet-500/25 before:content-['']"
          >
            {[0, 1].map((pass) =>
              STATS.map((stat) => (
                <div
                  key={`${pass}-${stat.key}`}
                  aria-hidden={pass === 1 || undefined}
                  className={`relative grid h-[84px] w-[84px] flex-none place-items-center rounded-full border px-1.5 text-center shadow-clay-sm ${stat.ring}`}
                >
                  <span>
                    <b className={`block font-display text-[1.1rem] font-bold leading-none tabular-nums ${stat.ink}`}>
                      {value(stat.key)}
                    </b>
                    <span className="mt-0.5 block text-[0.46rem] font-bold uppercase leading-tight tracking-[0.04em] text-ink">
                      {t(stat.labelKey)}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* What is there before it starts, and what stays without canvas. */}
      <div
        className={`grid grid-cols-2 gap-3.5 sm:grid-cols-4 ${live ? "hidden" : "grid"}`}
        data-testid="content-grid"
      >
        {STATS.map((stat) => (
          <div
            key={stat.key}
            className={`min-w-0 rounded-2xl border px-[18px] py-4 shadow-clay-sm ${stat.ring}`}
          >
            <div className={`font-display text-[1.95rem] font-bold leading-none tabular-nums ${stat.ink}`}>
              {value(stat.key)}
            </div>
            <span className="mt-[7px] block text-[0.74rem] font-semibold text-ink">
              {t(stat.labelKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRing;
