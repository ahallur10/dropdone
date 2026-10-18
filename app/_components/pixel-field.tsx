"use client";

import { useEffect, useRef } from "react";

/*
 * Decorative pixel field for the opening of the inner pages, in the spirit of the animated logo:
 * a fixed grid of dark squares over lime. Nothing moves; each square's opacity follows a shared
 * flow field, so broad lime bands roll slowly through the dark squares and clusters gather and
 * dissolve together, like a flock changing formation.
 *
 * The field is two travelling waves at different angles (about 10s and 13s per cycle) whose
 * phase is gently warped by a third, slower wave. Every term is periodic in time, so the loop
 * never visibly restarts. A CSS mask fades it into the page: strongest on the right, gone
 * before the text, top and bottom. Pauses offscreen, draws one still frame for reduced motion,
 * and is hidden from screen readers.
 */

const PITCH = 14; // cell, px
const SEAM = 2; // lime gap between squares, px
const LIME = "#D1FE17"; // --color-brand
const INK = "19,20,22"; // --color-page
const FRAME_MS = 1000 / 30;
const TAU = Math.PI * 2;

export function PixelField({ seed = 0 }: { seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    // Each page starts at a different point in the loop and leans its waves a little differently.
    const offset = seed * 3700;
    const a1 = (-12 + seed * 7) * (Math.PI / 180);
    const a2 = (58 - seed * 5) * (Math.PI / 180);
    const c1 = Math.cos(a1), s1 = Math.sin(a1);
    const c2 = Math.cos(a2), s2 = Math.sin(a2);

    function draw(now: number) {
      const t = (now + offset) / 1000;
      ctx!.fillStyle = LIME;
      ctx!.fillRect(0, 0, width, height);
      const size = PITCH - SEAM;
      for (let y = 0; y < height; y += PITCH) {
        for (let x = 0; x < width; x += PITCH) {
          // Slow domain warp: bends the bands so the formations shift instead of marching.
          const warp = 1.4 * Math.sin(y / 260 + t * (TAU / 23)) + 0.8 * Math.sin(x / 340 - t * (TAU / 31));
          // Main band: wide, about 10 seconds per pass.
          const w1 = Math.sin((x * c1 + y * s1) / 210 - t * (TAU / 10) + warp);
          // Second, subtler band at another angle, about 13 seconds per pass.
          const w2 = Math.sin((x * c2 + y * s2) / 150 + t * (TAU / 13) - warp * 0.5);
          const v = 0.68 * w1 + 0.32 * w2; // -1..1
          // Dark by default; the crests of the wave open up into lime. A soft threshold means
          // neighbours fade together rather than flicker on and off.
          const k = Math.min(Math.max((v - 0.05) / 0.7, 0), 1);
          const a = (1 - k * k * (3 - 2 * k)) * 0.96;
          if (a < 0.02) continue;
          ctx!.fillStyle = `rgba(${INK},${a})`;
          ctx!.fillRect(x + SEAM / 2, y + SEAM / 2, size, size);
        }
      }
    }

    function tick(now: number) {
      if (now - last >= FRAME_MS) {
        last = now;
        draw(now);
      }
      if (visible) raf = requestAnimationFrame(tick);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.ceil(canvas!.clientWidth);
      height = Math.ceil(canvas!.clientHeight);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(reduced ? 4200 : performance.now());
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (!reduced) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(tick);
      });
      io.observe(canvas);
    }

    return () => {
      ro.disconnect();
      io?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [seed]);

  // Strongest at the right edge, fading out toward the text on the left and toward the top and
  // bottom, so there's no visible edge. Phones get a fainter, narrower field for readability.
  const mask =
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.25) 28%, rgba(0,0,0,0.85) 62%, #000 100%), linear-gradient(to bottom, transparent 0%, #000 22%, #000 70%, transparent 100%)";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 h-[290px] w-[62%] opacity-30 sm:h-[min(100%,680px)] sm:w-[60%] sm:opacity-35 lg:w-[63%] lg:opacity-100"
    >
      <canvas
        ref={ref}
        className="block size-full"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
    </div>
  );
}
