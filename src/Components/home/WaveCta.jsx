import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { useLanguage } from "../../context/LanguageContext";
import {
  pointer,
  trackPointer,
  reducedMotion,
  animateWhileVisible,
  fitCanvas,
} from "../../utils/pointerField";
import { CHANNEL, tone } from "../../utils/paletteTokens";

const ROWS = 15;
const COLS = 22;
const SPAN = 1500;
const DEPTH = 2100;
const FOCAL = 520;

/**
 * The closing card, over a wavy surface running away to a horizon.
 *
 * The surface swells as it recedes and leans wherever the cursor is, and a
 * violet light follows the pointer across the panel. Neither the panel nor
 * the button moves — a control that drifts under the pointer is a control
 * you miss, which is a bug this app has already fixed once.
 */
const WaveCta = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    trackPointer();
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !canvas.getContext) return undefined;

    let width = 0;
    let height = 0;
    let ctx = null;
    let mouseX = -9999;
    let mouseY = -9999;
    let hover = 0;
    let wanted = 0;
    let leanX = 0;
    let leanY = 0;

    const size = () => {
      const fitted = fitCanvas(canvas, host);
      width = fitted.width;
      height = fitted.height;
      ctx = fitted.ctx;
    };

    const onMove = (e) => {
      const box = host.getBoundingClientRect();
      mouseX = e.clientX - box.left;
      mouseY = e.clientY - box.top;
      wanted = 1;
    };
    const onLeave = () => {
      wanted = 0;
    };

    if (!reducedMotion()) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    const draw = (now) => {
      if (!ctx || !width) return;
      hover += (wanted - hover) * 0.07;
      leanX += ((pointer.x - 0.5) * 420 - leanX) * 0.05;
      leanY += ((pointer.y - 0.5) * 150 - leanY) * 0.05;
      const time = now * 0.00055;

      const horizon = height * 0.2;
      const floor = height * 0.75;   // how far below the horizon the near row sits
      const project = (x, y, z) => {
        const scale = FOCAL / (FOCAL + z);
        return { x: width / 2 + x * scale, y: horizon + y * scale, scale };
      };

      ctx.clearRect(0, 0, width, height);

      const glowAt = height * 0.2;
      const glow = ctx.createLinearGradient(0, glowAt - height * 0.12, 0, glowAt + height * 0.14);
      glow.addColorStop(0, tone(CHANNEL.violet, 0));
      glow.addColorStop(0.55, tone(CHANNEL.violet, 0.09));
      glow.addColorStop(1, tone(CHANNEL.violet, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 1;

      const grid = [];
      for (let r = 0; r <= ROWS; r += 1) {
        const z = (r / ROWS) * DEPTH;
        grid[r] = [];
        for (let k = 0; k <= COLS; k += 1) {
          const x = (k / COLS - 0.5) * SPAN - leanX * (1 - r / ROWS) * 0.5;
          const amp = height / 430;   // the swell keeps its proportion on a short card
          const swell =
            (Math.sin(x * 0.0052 + time * 2.1) * 34 + Math.sin(z * 0.0043 - time * 1.5) * 26) * amp;
          let point = project(x, floor + swell - leanY * (1 - r / ROWS) * 0.4, z);

          if (hover > 0.01) {
            const dx = point.x - mouseX;
            const dy = point.y - mouseY;
            const falloff = Math.exp(-(dx * dx + dy * dy) / 26000);
            if (falloff > 0.004) {
              point = { ...point, y: point.y + (dy >= 0 ? 1 : -1) * falloff * 92 * hover };
            }
          }
          // Nothing is allowed past the bottom edge. The cursor push could
          // shove the near rows below it, and the clip turned them into a
          // row of bright marks along the card's border.
          if (point.y > height * 0.97) point = { ...point, y: height * 0.97 };
          grid[r][k] = point;
        }
      }

      /* How visible the surface is at a given depth: nothing at the near
         edge, full in the middle, gone by the horizon. Both directions use
         it. Giving the lines one flat alpha each instead left their near
         ends at full strength, clipped by the card into bright stubs along
         the bottom — first as one straight rule across the rows, then as a
         row of dashes where the cross-lines ended. */
      const atDepth = (t) => Math.pow(1 - t, 1.35) * Math.min(1, t * 3.4 + 0.18);

      /* How much brighter a stretch of line is for being near the cursor.
         The light lands on the surface, not on the card: a wash behind the
         lines lifted the whole panel out of the dark and read as a muddy
         violet rectangle. */
      const lit = (x, y) => {
        if (hover <= 0.01) return 1;
        const dx = x - mouseX;
        const dy = y - mouseY;
        return 1 + Math.exp(-(dx * dx + dy * dy) / 30000) * 2.6 * hover;
      };

      for (let r = 0; r <= ROWS; r += 1) {
        const fade = atDepth(r / ROWS);
        if (fade < 0.015) continue;
        for (let k = 0; k < COLS; k += 1) {
          const a = grid[r][k];
          const c = grid[r][k + 1];
          const alpha = Math.min(0.9, fade * 0.52 * lit((a.x + c.x) / 2, (a.y + c.y) / 2));
          if (alpha < 0.01) continue;
          ctx.strokeStyle = tone(CHANNEL.violet, alpha.toFixed(3));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      }
      for (let k = 0; k <= COLS; k += 1) {
        const edge = 1 - Math.abs(k / COLS - 0.5) * 1.5;
        if (edge < 0.04) continue;
        for (let r = 0; r < ROWS; r += 1) {
          const a = grid[r][k];
          const c = grid[r + 1][k];
          const alpha = Math.min(0.75, edge * atDepth((r + 0.5) / ROWS) * 0.42 * lit((a.x + c.x) / 2, (a.y + c.y) / 2));
          if (alpha < 0.008) continue;
          ctx.strokeStyle = tone(CHANNEL.sky, alpha.toFixed(3));
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(c.x, c.y);
          ctx.stroke();
        }
      }
    };

    size();
    const onResize = () => {
      size();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    const stop = animateWhileVisible(host, draw);

    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-testid="wave-cta"
      className="relative isolate overflow-hidden rounded-3xl border border-violet-500/15 bg-ground px-[26px] py-14 text-center shadow-clay sm:px-10 sm:py-[76px]"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-0 h-full w-full" />
      <div className="relative z-[1]">
        <h2 className="text-balance font-display text-2xl font-bold text-ink-hi sm:text-[2.1rem]">
          {t("home.ctaTitle")}
        </h2>
        <p className="mx-auto mt-3.5 max-w-[30em] text-pretty text-ink">{t("home.ctaText")}</p>
        <div className="mt-7">
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            {t("hero.startFree")}
            <Icon name="arrow" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WaveCta;
