"use client";

import { useEffect, useState } from "react";

// Position dots for the phone carousel: follows the scroll of the element with `targetId`.
// Tapping a dot scrolls to that card. Hidden from tablets up, where the cards are a grid.
export function CarouselDots({ targetId, count }: { targetId: string; count: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const track = document.getElementById(targetId);
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = [...track.children] as HTMLElement[];
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        cards.forEach((c, i) => {
          if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - mid)) best = i;
        });
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [targetId]);

  function go(i: number) {
    const track = document.getElementById(targetId);
    const card = track?.children[i] as HTMLElement | undefined;
    if (track && card) track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  }

  return (
    <div className="flex items-center justify-center gap-2 md:hidden">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Show feature ${i + 1} of ${count}`}
          aria-current={i === index ? "true" : undefined}
          onClick={() => go(i)}
          className="flex size-6 cursor-pointer items-center justify-center"
        >
          <span className={`block h-1.5 rounded-pill transition-all ${i === index ? "w-5 bg-brand" : "w-1.5 bg-line-strong"}`} />
        </button>
      ))}
    </div>
  );
}
