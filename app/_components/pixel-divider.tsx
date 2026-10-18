"use client";

import { useEffect, useRef } from "react";

/*
 * Section transition borrowed from the logo's pixels. A fixed grid of small squares about
 * 40px tall: the dark section above breaks into fragments, a lime strip shows through the
 * middle, and the dark gets denser again toward the bottom. Dark cells are simply left
 * empty, so they are the page's own background. Nothing moves: each cell fades between
 * lime and dark on its own period, plus a slow rhythm travelling across the width, which
 * reads as a current flowing through the pixels. Every term is periodic, so the loop never
 * restarts. Pauses offscreen, draws one still frame for reduced motion, hidden from
 * screen readers.
 */

const LIME = "209,254,23"; // --color-brand
const FRAME_MS = 1000 / 30; // flicker doesn't need more than 30fps

// Section divider: 5px cells with 4px squares. How lit each row is, top to bottom: sparse at
// the top edge, full through the middle, thinning more gradually toward the bottom so the
// dark below reads as denser.
const DIVIDER = { pitch: 5, size: 4, rows: [0.3, 0.56, 0.8, 0.88, 0.86, 0.74, 0.56, 0.42] };

function hash(a: number, b: number, c: number) {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35) ^ Math.imul(c, 0x27d4eb2f);
  h ^= h >>> 15;
  h = Math.imul(h, 0x2c1b3c6d);
  h ^= h >>> 12;
  return (h >>> 0) / 4294967296;
}

type Cell = { x: number; y: number; base: number; period: number; phase: number; tone: number };
export type PixelStripOptions = { pitch: number; size: number; rows: number[]; seed: number };

// Draws the flickering pixel strip into a canvas. Shared by the section dividers and the
// nav's active-tab highlight; wave lengths scale with the cell size.
export function usePixelStrip(ref: React.RefObject<HTMLCanvasElement | null>, { pitch, size, rows, seed }: PixelStripOptions) {
  const rowKey = rows.join(",");
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const PITCH = pitch;
    const SIZE = size;
    const ROWS = rowKey.split(",").map(Number);
    const HEIGHT = ROWS.length * PITCH;
    const k = pitch / 5;
    let cells: Cell[] = [];
    let width = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    // Each divider gets its own current: start offset, speed, wavelength and a second,
    // slower swell, so no two dividers pulse in the same rhythm.
    const shift = hash(seed, 7, 1) * 20000;
    const speed = 2300 + hash(seed, 7, 2) * 1600;
    const wave = (130 + hash(seed, 7, 3) * 110) * k;
    const dir = hash(seed, 7, 4) < 0.5 ? 1 : -1;
    const swellSpeed = 5200 + hash(seed, 7, 5) * 3600;
    const swellWave = (380 + hash(seed, 7, 6) * 260) * k;

    function build() {
      const cols = Math.floor(width / PITCH);
      const left = Math.floor((width - cols * PITCH) / 2);
      cells = [];
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < ROWS.length; r++) {
          cells.push({
            x: left + c * PITCH,
            y: r * PITCH,
            // Fixed per-cell bias so the edges are ragged rather than a clean line.
            base: ROWS[r] + (hash(seed, c, r) - 0.5) * 0.34,
            period: 1800 + hash(seed, c, r + 50) * 2600,
            phase: hash(seed, c, r + 100) * Math.PI * 2,
            tone: 0.55 + hash(seed, c, r + 150) * 0.45,
          });
        }
      }
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, HEIGHT);
      for (const cell of cells) {
        // Independent flicker plus a travelling current across the strip.
        const flicker = 0.16 * Math.sin(((t + shift) / cell.period) * Math.PI * 2 + cell.phase);
        const time = t + shift;
        const current =
          0.09 * Math.sin((cell.x / wave - (dir * time) / speed) * Math.PI * 2) +
          0.05 * Math.sin((cell.x / swellWave + (dir * time) / swellSpeed) * Math.PI * 2);
        const v = cell.base + flicker + current;
        // Soft threshold so cells fade between lime and dark instead of blinking.
        const a = Math.min(Math.max((v - 0.5) / 0.14, 0), 1);
        if (a < 0.03) continue;
        ctx!.fillStyle = `rgba(${LIME},${a * cell.tone})`;
        ctx!.fillRect(cell.x, cell.y, SIZE, SIZE);
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
      width = Math.floor(canvas!.clientWidth);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(HEIGHT * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(reduced ? 0 : performance.now());
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
  }, [ref, pitch, size, rowKey, seed]);
}

export function PixelDivider({ seed = 1 }: { seed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  usePixelStrip(ref, { ...DIVIDER, seed });

  return (
    <div aria-hidden="true" className="pointer-events-none relative z-10 h-0 overflow-x-clip">
      {/* Wider than the content column; the long edge fades let it melt into the page. */}
      <div className="mx-auto max-w-[1600px]">
        <canvas
          ref={ref}
          className="block w-full -translate-y-1/2"
          style={{
            height: DIVIDER.rows.length * DIVIDER.pitch,
            imageRendering: "pixelated",
            maskImage: "linear-gradient(to right, transparent, #000 26%, #000 74%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, #000 26%, #000 74%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
