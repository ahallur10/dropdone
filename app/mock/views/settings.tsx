"use client";

import { useState } from "react";
import { folderPaths } from "../data";
import { CloudFolderIcon, FolderIcon, ServerIcon } from "../icons";
import { btnQuiet, btnSecondary, PageHeader, ProBadge, Section, SettingRow, Toggle } from "../ui";

export type Folder = { name: string; kind: "local" | "cloud" | "server" };

export function SettingsView({
  folders,
  onRemoveFolder,
  onAddFolder,
}: {
  folders: Folder[];
  onRemoveFolder: (name: string) => void;
  onAddFolder: () => void;
}) {
  const [s, setS] = useState({
    openAtLogin: true,
    menuBar: true,
    backup: true,
    askFirst: true,
    notifyUpdated: false,
    notifyQuestion: true,
    crashReports: false,
  });
  const set = (k: keyof typeof s) => (v: boolean) => setS((prev) => ({ ...prev, [k]: v }));
  const icon = { local: FolderIcon, cloud: CloudFolderIcon, server: ServerIcon };

  return (
    <>
      <PageHeader title="Settings" />

      <div className="flex max-w-[760px] flex-col gap-8">
        <Section title="Watched folders" description="New exports saved here are matched to your workbooks automatically.">
          {folders.map((f) => {
            const Icon = icon[f.kind];
            return (
              <SettingRow
                key={f.name}
                title={
                  <span className="flex items-center gap-2.5">
                    <Icon className="text-fg-muted" />
                    {f.name}
                  </span>
                }
                description={<span className="type-data text-[11px]">{folderPaths[f.name] ?? `~/${f.name}`}</span>}
                control={
                  <button onClick={() => onRemoveFolder(f.name)} className={btnQuiet}>
                    Stop watching
                  </button>
                }
              />
            );
          })}
          <div className="px-5 py-3">
            <button onClick={onAddFolder} className={btnSecondary}>
              Add a folder
            </button>
          </div>
        </Section>

        <Section title="Saving">
          <SettingRow
            title="Ask before saving when something doesn't fit"
            description="If a value doesn't match last time's pattern, Dropdone stops and asks instead of guessing."
            control={<Toggle label="Ask before saving" checked={s.askFirst} onChange={set("askFirst")} />}
          />
          <SettingRow
            title="Keep a backup before updating"
            description="Saves the previous version so you can restore it from Activity."
            control={<Toggle label="Keep a backup" checked={s.backup} onChange={set("backup")} />}
          />
          <SettingRow
            title="Leave formulas and formatting alone"
            description="Dropdone only writes values into the cells your workbook already uses."
            control={<Toggle label="Leave formulas alone" checked disabled />}
          />
        </Section>

        <Section title="Privacy">
          <SettingRow
            title="Where cleaning happens"
            description="Exports and workbooks are read and written on this Mac only."
            control={<span className="type-data text-xs text-fg-soft">On this Mac</span>}
          />
          <SettingRow
            title={
              <span className="flex items-center gap-2">
                Adjusted refresh <ProBadge />
              </span>
            }
            description="Uses an AI model to keep your output matching when an export's format changes. Off unless you turn it on."
            control={<Toggle label="Adjusted refresh" checked={false} disabled />}
          />
          <SettingRow
            title="Send anonymous crash reports"
            control={<Toggle label="Crash reports" checked={s.crashReports} onChange={set("crashReports")} />}
          />
        </Section>

        <Section title="Notifications">
          <SettingRow
            title="When Dropdone needs an answer"
            control={<Toggle label="Notify on questions" checked={s.notifyQuestion} onChange={set("notifyQuestion")} />}
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
            description="Drop exports on the menu bar icon without opening the window."
            control={<Toggle label="Show in menu bar" checked={s.menuBar} onChange={set("menuBar")} />}
          />
        </Section>
      </div>
    </>
  );
}
