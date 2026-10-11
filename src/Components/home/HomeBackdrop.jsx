import { useEffect, useRef } from "react";
import {
  pointer,
  trackPointer,
  reducedMotion,
  animateWhileVisible,
  fitCanvas,
} from "../../utils/pointerField";
import { CHANNEL, tone } from "../../utils/paletteTokens";

/**
 * The field behind the whole home page.
 *
 * Two glows slide with the cursor, and a sparse drift of dots moves past
 * them at three depths so the parallax reads as depth rather than as one
 * layer sliding. Fixed, so it answers the pointer anywhere on the page.
 *
 * The glows are CSS and move by transform, which the compositor handles;
 * only the dots are drawn, and there are few enough of them to stay cheap
 * on a phone. An earlier version blurred a full-screen canvas every frame,
 * which is the expensive way to get the same thing.
 */
const HomeBackdrop = () => {
  const canvasRef = useRef(null);
  const glowARef = useRef(null);
  const glowBRef = useRef(null);

  useEffect(() => {
    trackPointer();
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return undefined;

    let width = 0;
    let height = 0;
    let ctx = null;
    let dots = [];
    let offsetX = 0;
    let offsetY = 0;

    const build = () => {
      const fitted = fitCanvas(canvas, document.documentElement);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * Math.min(window.devicePixelRatio || 1, 2));
      canvas.height = Math.round(height * Math.min(window.devicePixelRatio || 1, 2));
      ctx = fitted.ctx;
      if (ctx) {
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      const count = width < 620 ? 38 : 70;
      dots = Array.from({ length: count }, (_, i) => {
        const layer = i % 3;
        return {
          x: Math.random(),
          y: Math.random(),
          radius: 0.6 + layer * 0.55,
          depth: 10 + layer * 16,
          drift: (0.3 + layer * 0.3) * (i % 2 ? 1 : -1),
          chan: i % 9 === 0 ? CHANNEL.sky : CHANNEL.violetSoft,
          alpha: 0.12 + layer * 0.12,
        };
      });
    };

    const draw = (now) => {
      if (!ctx) return;
      offsetX += ((pointer.x - 0.5) * -1 - offsetX) * 0.05;
      offsetY += ((pointer.y - 0.4) * -1 - offsetY) * 0.05;
      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        const travelled = (((dot.x + now * 0.0000045 * dot.drift) % 1) + 1) % 1;
        ctx.beginPath();
        ctx.arc(
          travelled * width + offsetX * dot.depth,
          dot.y * height + offsetY * dot.depth,
          dot.radius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = tone(dot.chan, dot.alpha);
        ctx.fill();
      }

      for (const [ref, factor] of [
        [glowARef, 34],
        [glowBRef, -26],
      ]) {
        if (ref.current) {
          ref.current.style.transform = `translate3d(${(offsetX * factor).toFixed(1)}px, ${(
            offsetY * factor
          ).toFixed(1)}px, 0)`;
        }
      }
    };

    build();
    const onResize = () => {
      build();
      draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    const stop = animateWhileVisible(reducedMotion() ? null : document.body, draw);

    return () => {
      window.removeEventListener("resize", onResize);
      stop();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <span
        ref={glowARef}
        className="absolute -top-[6%] -right-[16%] h-[560px] w-[1000px] rounded-full bg-violet-500/10 blur-[90px] will-change-transform"
      />
      <span
        ref={glowBRef}
        className="absolute top-[6%] -left-[4%] h-[460px] w-[760px] rounded-full bg-sky/[0.06] blur-[90px] will-change-transform"
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default HomeBackdrop;
