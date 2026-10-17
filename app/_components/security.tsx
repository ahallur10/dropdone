// Security section for IT reviewers: how Dropdone is built to keep data where it is.
// The regulations it's designed for are shown as badges under the Trusted by carousel.

const controls = [
  {
    title: "Runs on your computer",
    body: "Exports are read and workbooks are written locally. Cleaning works with the network unplugged.",
    icon: "device",
  },
  {
    title: "Nothing uploaded",
    body: "No copy of your data goes to Dropdone's servers. There's no cloud database of your records to breach.",
    icon: "cloudOff",
  },
  {
    title: "Open source core",
    body: "The Community edition's code is public, so your IT team can read exactly what it does.",
    icon: "code",
  },
  {
    title: "Signed installers",
    body: "Mac and Windows builds are code-signed, so they install without security warnings or workarounds.",
    icon: "badge",
  },
  {
    title: "Backup before every write",
    body: "Dropdone saves the previous version before it updates a workbook, so any change can be undone.",
    icon: "history",
  },
  {
    title: "No tracking by default",
    body: "Crash reports are off unless you turn them on. No analytics on your files or their contents.",
    icon: "eyeOff",
  },
] as const;

export function Security() {
  return (
    <section id="security" className="scroll-mt-16">
      <div className="mx-auto flex max-w-site flex-col gap-12 px-6 py-24 md:py-28">
        <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-[18ch]">Built to pass your IT review.</h2>
          </div>
          <p className="max-w-[52ch] text-fg-muted">
            Dropdone handles client, student and financial records, so it&apos;s built to keep them
            where they already are: on your organization&apos;s computers.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map((c) => (
            <li key={c.title} className="card flex flex-col gap-3 p-6">
              <span className="flex size-10 items-center justify-center rounded-md bg-brand-a10 text-brand">
                <Icon name={c.icon} />
              </span>
              <h3 className="type-h4">{c.title}</h3>
              <p className="type-body-sm">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Icon({ name }: { name: (typeof controls)[number]["icon"] }) {
  const paths: Record<typeof name, React.ReactNode> = {
    device: (
      <>
        <rect x="3.5" y="5" width="17" height="11" rx="1.5" />
        <path d="M8 19.5h8M12 16v3.5" />
      </>
    ),
    cloudOff: (
      <>
        <path d="M7.5 18.5h9.5a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 10 4.25 4.25 0 0 0 7.5 18.5Z" />
        <path d="M4 4l16 16" />
      </>
    ),
    code: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />,
    badge: (
      <>
        <path d="M12 3.5 5 6.5v5c0 4.3 3 7.7 7 9 4-1.3 7-4.7 7-9v-5l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    history: (
      <>
        <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9" />
        <path d="M4.5 4.5V9H9M12 8v4.5l3 1.5" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M3.5 12s3-6 8.5-6c1.6 0 3 .5 4.2 1.2M20.5 12s-3 6-8.5 6c-1.6 0-3-.5-4.2-1.2" />
        <path d="M4 4l16 16M10 10.2a2.5 2.5 0 0 0 3.8 3.3" />
      </>
    ),
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
