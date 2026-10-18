/*
 * Hover layers for the "Get early access" button (add the px-btn class next to btn-primary
 * and put <PixelLayers /> inside). Two layers sit behind the label so it never moves or
 * flickers: a lime fill that sweeps in left to right with a staggered pixel edge, and a dozen
 * small dark squares that float in place near the edges and corners while you hover.
 * Styles live in globals.css under .px-btn.
 */

// Hand-placed so they cluster at the edges and corners and stay clear of the label.
// x/y are % of the button; size in px; dx/dy is the drift in px; dur in s; delay in s.
const DOTS = [
  { x: 4, y: 14, s: 3, dx: 2, dy: 1, o: 0.9, dur: 1.9, delay: -0.4 },
  { x: 9, y: 70, s: 2, dx: 1, dy: -2, o: 0.6, dur: 1.4, delay: -1.1 },
  { x: 3, y: 46, s: 2, dx: 2, dy: 2, o: 0.5, dur: 2.3, delay: -0.2 },
  { x: 17, y: 8, s: 2, dx: -1, dy: 2, o: 0.55, dur: 2.1, delay: -1.6 },
  { x: 28, y: 84, s: 3, dx: 2, dy: -1, o: 0.7, dur: 1.6, delay: -0.8 },
  { x: 46, y: 6, s: 2, dx: 3, dy: 1, o: 0.45, dur: 2.6, delay: -2.0 },
  { x: 61, y: 86, s: 2, dx: -2, dy: -1, o: 0.6, dur: 1.8, delay: -0.3 },
  { x: 76, y: 10, s: 3, dx: -2, dy: 2, o: 0.75, dur: 1.3, delay: -0.9 },
  { x: 90, y: 22, s: 4, dx: -1, dy: 2, o: 0.85, dur: 2.2, delay: -1.4 },
  { x: 94, y: 58, s: 2, dx: -2, dy: -1, o: 0.55, dur: 1.5, delay: -0.6 },
  { x: 87, y: 80, s: 3, dx: 1, dy: -2, o: 0.7, dur: 2.4, delay: -1.9 },
  { x: 97, y: 6, s: 2, dx: -2, dy: 1, o: 0.5, dur: 1.7, delay: -1.2 },
];

export function PixelLayers() {
  return (
    <>
      <span aria-hidden="true" className="px-btn__fill" />
      <span aria-hidden="true" className="px-btn__dots">
        {DOTS.map((d, i) => (
          <span
            key={i}
            style={
              {
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.s,
                height: d.s,
                "--dx": `${d.dx}px`,
                "--dy": `${d.dy}px`,
                "--o": d.o,
                animationDuration: `${d.dur}s`,
                animationDelay: `${d.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>
    </>
  );
}
