"use client";

import { useEffect, useRef } from "react";

/*
 * The hero loop. iPhone Safari only autoplays a video that is muted from the start, and React
 * doesn't write `muted` into the server HTML, so Safari can show a play button instead. This
 * forces muted on, starts playback from code, and retries on the first touch or scroll (Low
 * Power Mode blocks autoplay until the person interacts with the page).
 */
export function HeroVideo({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");

    const play = () => video.play().catch(() => {});
    play();

    const retry = () => {
      if (video.paused) play();
    };
    const events = ["touchstart", "scroll", "pointerdown"] as const;
    events.forEach((e) => window.addEventListener(e, retry, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, retry));
  }, []);

  return (
    <video
      ref={ref}
      className="hero-video absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
      src="/dropdone-hero.mp4"
      poster="/dropdone-hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      preload="auto"
      aria-label={label}
    />
  );
}
