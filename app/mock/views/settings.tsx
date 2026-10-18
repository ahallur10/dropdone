"use client";

import { useState } from "react";
import { btnSecondary, PageHeader, ProBadge, Section, SettingRow, Toggle } from "../ui";

export function SettingsView() {
  const [s, setS] = useState({
    openAtLogin: true,
    menuBar: true,
    notifyUpdated: false,
    notifyQuestion: true,
    crashReports: false,
  });
  const [key, setKey] = useState("sk-••••••••••••••••3f9a");
  const [editingKey, setEditingKey] = useState(false);
  const set = (k: keyof typeof s) => (v: boolean) => setS((prev) => ({ ...prev, [k]: v }));

  return (
    <>
      <PageHeader title="Settings" />

      <div className="flex max-w-[760px] flex-col gap-8">
        <Section
          title="AI for setup"
          description="AI is only used once per cleanup, to compare your before and after and write the steps."
        >
          <SettingRow
            title="Your API key"
            description="Community uses your own key. Pro includes AI for setup, no key needed."
            control={
              editingKey ? (
                <input
                  autoFocus
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  onBlur={() => setEditingKey(false)}
                  className="input type-data min-h-9 w-64 text-xs"
                />
              ) : (
                <button onClick={() => setEditingKey(true)} className={`${btnSecondary} type-data text-xs`}>
                  {key}
                </button>
              )
            }
          />
          <SettingRow
            title="Weekly runs"
            description="Approved steps run exactly as written. No AI, no internet needed."
            control={<span className="type-data text-xs text-fg-soft">Never use AI</span>}
          />
        </Section>

        <Section title="When an export changes">
          <SettingRow
            title="Stop safely and save nothing"
            description="If columns are missing, renamed or reordered, Dropdone stops. You teach it again with one new example."
            control={<Toggle label="Stop safely" checked disabled />}
          />
          <SettingRow
            title={
              <span className="flex items-center gap-2">
                Adjusted refresh <ProBadge />
              </span>
            }
            description="Instead of stopping, Dropdone proposes the fix. Nothing is saved until you approve it."
            control={<Toggle label="Adjusted refresh" checked={false} disabled />}
          />
        </Section>

        <Section title="Saving">
          <SettingRow
            title="Check before saving"
            description="Same columns, same order, same kinds of values, and each step changed about as many rows as usual."
            control={<Toggle label="Check before saving" checked disabled />}
          />
          <SettingRow
            title="Keep a backup before every update"
            description="Restore any earlier version of a workbook from Activity."
            control={<Toggle label="Keep a backup" checked disabled />}
          />
          <SettingRow
            title="Leave formulas and summary tabs alone"
            description="Dropdone only writes values into the data your workbook already uses."
            control={<Toggle label="Leave formulas alone" checked disabled />}
          />
        </Section>

        <Section title="Notifications">
          <SettingRow
            title="When a run needs your OK"
            control={<Toggle label="Notify when a run needs your OK" checked={s.notifyQuestion} onChange={set("notifyQuestion")} />}
          />
          <SettingRow
            title="When a workbook is updated"
            control={<Toggle label="Notify on updates" checked={s.notifyUpdated} onChange={set("notifyUpdated")} />}
          />
        </Section>

        <Section title="General">
          <SettingRow
            title="Open at login"
            control={<Toggle label="Open at login" checked={s.openAtLogin} onChange={set("openAtLogin")} />}
          />
          <SettingRow
            title="Show in menu bar"
            description="Drop an export on the menu bar icon, then pick its cleanup."
            control={<Toggle label="Show in menu bar" checked={s.menuBar} onChange={set("menuBar")} />}
          />
          <SettingRow
            title="Send anonymous crash reports"
            control={<Toggle label="Crash reports" checked={s.crashReports} onChange={set("crashReports")} />}
          />
        </Section>
      </div>
    </>
  );
}
