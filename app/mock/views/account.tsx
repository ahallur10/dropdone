"use client";

import { useState } from "react";
import { account } from "../data";
import { btnQuiet, btnSecondary, PageHeader, Section, SettingRow } from "../ui";

export function AccountView({ workbookCount }: { workbookCount: number }) {
  const [checked, setChecked] = useState<"idle" | "checking" | "current">("idle");

  function checkUpdates() {
    setChecked("checking");
    setTimeout(() => setChecked("current"), 1200);
  }

  return (
    <>
      <PageHeader title="Account" />

      <div className="flex max-w-[760px] flex-col gap-8">
        <div className="card flex items-center gap-4 px-5 py-5 hover:bg-surface">
          <span className="type-h4 flex size-14 shrink-0 items-center justify-center rounded-lg bg-brand text-fg-inverse">
            {account.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="type-label text-fg">{account.name}</p>
            <p className="type-body-sm mt-0.5">{account.email}</p>
            <p className="type-caption mt-0.5">{account.org}</p>
          </div>
          <button className={btnSecondary}>Edit profile</button>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="type-label text-fg">Plan</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="card flex flex-col gap-4 p-5 hover:bg-surface">
              <div className="flex items-center justify-between">
                <p className="type-label text-fg">Community</p>
                <span className="badge bg-surface-strong text-fg-soft">Current</span>
              </div>
              <p className="type-h3">Free</p>
              <ul className="flex flex-col gap-2">
                <Feature>Learn by example</Feature>
                <Feature>Full workbook and single sheet refresh</Feature>
                <Feature>{workbookCount} workbooks learned</Feature>
              </ul>
            </div>
            <div className="card flex flex-col gap-4 border-line p-5 hover:bg-surface">
              <div className="flex items-center justify-between">
                <p className="type-label text-fg">Pro</p>
                <span className="badge badge-pink">Early access</span>
              </div>
              <p className="type-h3">
                $20<span className="type-body-sm">/month</span>
              </p>
              <ul className="flex flex-col gap-2">
                <Feature>Everything in Community</Feature>
                <Feature>Adjusted refresh for up to 5 workbooks</Feature>
              </ul>
              <button className="btn-ghost mt-auto min-h-9 cursor-pointer text-sm">Try Pro free for 14 days</button>
            </div>
          </div>
        </section>

        <Section title="This Mac">
          <SettingRow title="Device" control={<span className="type-data text-xs text-fg-soft">{account.device}</span>} />
          <SettingRow
            title={`Dropdone ${account.version}`}
            description={
              checked === "current" ? "You're on the latest version." : "Early access builds update about every two weeks."
            }
            control={
              <button onClick={checkUpdates} disabled={checked === "checking"} className={btnSecondary}>
                {checked === "checking" ? "Checking…" : "Check for updates"}
              </button>
            }
          />
        </Section>

        <div className="flex gap-2">
          <button className={btnQuiet}>Export my settings</button>
          <button className={`${btnQuiet} text-danger hover:text-danger`}>Sign out</button>
        </div>
      </div>
    </>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="type-body-sm flex gap-2.5 text-fg-soft">
      <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 rounded-[1px] bg-brand" />
      {children}
    </li>
  );
}
