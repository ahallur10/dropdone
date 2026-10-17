"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Steps through 0..steps-1 every `stepMs`, looping, but only while the element is on screen.
 * With reduced motion it stays on the last step, which every animation treats as its finished state.
 */
export function useLoop<T extends Element>(steps: number, stepMs: number) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || reduced) return;
    const t = setInterval(() => setStep((s) => (s + 1) % steps), stepMs);
    return () => clearInterval(t);
  }, [active, reduced, steps, stepMs]);

  return { ref, step: reduced ? steps - 1 : step };
}
