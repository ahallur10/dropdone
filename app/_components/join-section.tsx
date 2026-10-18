import Link from "next/link";
import { Waitlist } from "./waitlist";

// The closing call to action on every page: the animated logo next to the waitlist form,
// so signing up is one email away wherever someone finishes reading. Each page can pass its
// own headline and a secondary link to keep exploring.
export function JoinSection({
  heading = "Stop cleaning the same report twice.",
  secondary,
}: {
  heading?: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section id="join" className="scroll-mt-16">
      <div className="mx-auto grid max-w-site items-center gap-12 px-6 py-24 md:grid-cols-[auto_1fr] md:gap-16 md:py-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/dropdone-icon-animated.svg" alt="" className="size-28 md:size-40" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-[20ch]">{heading}</h2>
            <p className="type-lead max-w-[60ch] text-fg-muted">
              Dropdone is coming to Mac and Windows. Leave your email and we&apos;ll send the download when your spot
              opens.
            </p>
          </div>
          <Waitlist />
          {secondary && (
            <Link href={secondary.href} className="btn-ghost self-start no-underline">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
