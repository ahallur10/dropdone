"use client";

import { useEffect } from "react";

/*
 * Opening a link like /pricing#join should land on that section. The browser's own jump can
 * be lost while the page is still loading (smooth scrolling plus images and fonts changing the
 * height), so jump again once the page has settled.
 */
export function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    const raf = requestAnimationFrame(jump);
    if (document.readyState === "complete") {
      const t = setTimeout(jump, 150);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }
    window.addEventListener("load", jump, { once: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", jump);
    };
  }, []);
  return null;
}
