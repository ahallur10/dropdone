import type { MouseEvent } from "react";

/*
 * Click handler for in-page links like href="#join". Next's <Link> ignores a click when the URL
 * already ends in that hash (after a first click, or arriving from a shared /pricing#join link),
 * so the second "Get early access" did nothing. This always scrolls to the section.
 */
export function scrollToHash(e: MouseEvent<HTMLAnchorElement>) {
  const id = e.currentTarget.hash.slice(1);
  const target = id && document.getElementById(id);
  if (!target) return; // let the browser handle it (e.g. the section is on another page)
  e.preventDefault();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
}
