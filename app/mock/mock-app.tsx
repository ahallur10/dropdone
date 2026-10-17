"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import {
  account,
  activity as baseActivity,
  initialQueue,
  reviewQuestion,
  stageFor,
  watchedFolders,
  workbooks as initialWorkbooks,
  type ActivityEntry,
  type Item,
  type Workbook,
} from "./data";
import {
  ActivityIcon,
  CloudFolderIcon,
  FolderIcon,
  HelpIcon,
  HomeIcon,
  LockIcon,
  QueueIcon,
  SearchIcon,
  ServerIcon,
  SettingsIcon,
  SidebarIcon,
  UploadIcon,
  WorkbookIcon,
} from "./icons";
import { AccountView } from "./views/account";
import { ActivityView } from "./views/activity";
import { HomeView } from "./views/home";
import { QueueView } from "./views/queue";
import { SettingsView, type Folder } from "./views/settings";
import { TeachModal, WorkbooksView } from "./views/workbooks";

type View = "home" | "queue" | "workbooks" | "activity" | "settings" | "account";

const TICK_MS = 450;

export function MockApp() {
  const [view, setView] = useState<View>("home");
  const [items, setItems] = useState<Item[]>(initialQueue);
  const [books, setBooks] = useState<Workbook[]>(initialWorkbooks);
  const [folders, setFolders] = useState<Folder[]>(watchedFolders);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teaching, setTeaching] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // Advance every running item a little each tick so the queue feels live.
  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.progress >= 100 || it.paused || it.held) return it;
          if (it.startDelay && it.startDelay > 0) return { ...it, startDelay: it.startDelay - 1 };
          const next = Math.min(100, it.progress + 1 + Math.floor(Math.random() * 3));
          if (it.pauseAt && !it.answered && next >= it.pauseAt) {
            return { ...it, progress: it.pauseAt, paused: true };
          }
          return next >= 100 ? { ...it, progress: 100, finishedAgo: "just now" } : { ...it, progress: next };
        }),
      );
    }, TICK_MS);
    return () => clearInterval(t);
  }, []);

  const reset = useCallback(() => {
    setItems(initialQueue);
    setBooks(initialWorkbooks);
    setFolders(watchedFolders);
  }, []);

  // Recording helpers: R restarts everything, [ toggles the sidebar.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "r") reset();
      if (e.key === "[") setSidebarOpen((o) => !o);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset]);

  function go(v: View) {
    setView(v);
    scroller.current?.scrollTo({ top: 0 });
  }

  function addFiles(names: string[]) {
    const added: Item[] = names.map((name, i) => ({
      id: `${name}-${Date.now()}-${i}`,
      file: name,
      folder: "~/Downloads",
      meta: "Just dropped",
      ...guessWorkbook(name),
      progress: 0,
      startDelay: 2 + i * 2,
    }));
    setItems((prev) => [...added, ...prev]);
    if (view !== "queue") go("home");
  }

  const answer = () =>
    setItems((prev) =>
      prev.map((it) => (it.id === reviewQuestion.itemId ? { ...it, paused: false, answered: true } : it)),
    );
  const toggleHold = (id: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, held: !it.held } : it)));
  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  const moveTop = (id: string) =>
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      return it ? [it, ...prev.filter((x) => x.id !== id)] : prev;
    });
  const clearDone = () => setItems((prev) => prev.filter((it) => it.progress < 100));

  const staged = items.map((it) => ({ ...it, stage: stageFor(it.progress, !!it.paused, !!it.held) }));
  const queueCount = staged.filter((i) => i.stage !== "done").length;
  const needsYou = staged.some((i) => i.stage === "review");

  // Files that finished in this session show up at the top of Activity.
  const liveActivity: ActivityEntry[] = staged
    .filter((i) => i.finishedAgo === "just now")
    .map((i) => ({
      id: `live-${i.id}`,
      day: "Today",
      time: "Just now",
      kind: "updated",
      title: `Updated ${i.workbook}`,
      detail: `From ${i.file} · ${i.meta}`,
      canRestore: true,
    }));

  const dragHandlers = {
    onDragEnter: (e: DragEvent) => {
      e.preventDefault();
      if (teaching) return;
      dragDepth.current += 1;
      setDragging(true);
    },
    onDragOver: (e: DragEvent) => e.preventDefault(),
    onDragLeave: () => {
      dragDepth.current -= 1;
      if (dragDepth.current <= 0) setDragging(false);
    },
    onDropCapture: () => {
      dragDepth.current = 0;
      setDragging(false);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      if (teaching) return;
      const names = Array.from(e.dataTransfer.files).map((f) => f.name);
      if (names.length) addFiles(names);
    },
  };

  let content: ReactNode;
  switch (view) {
    case "home":
      content = <HomeView items={staged} onAnswer={answer} />;
      break;
    case "queue":
      content = (
        <QueueView
          items={staged}
          onToggleHold={toggleHold}
          onRemove={remove}
          onTop={moveTop}
          onAnswer={answer}
          onClearDone={clearDone}
          doneCount={staged.length - queueCount}
        />
      );
      break;
    case "workbooks":
      content = (
        <WorkbooksView
          workbooks={books}
          onTeach={() => setTeaching(true)}
          onChangeMode={(id, mode) => setBooks((b) => b.map((w) => (w.id === id ? { ...w, mode } : w)))}
          onForget={(id) => setBooks((b) => b.filter((w) => w.id !== id))}
        />
      );
      break;
    case "activity":
      content = (
        <ActivityView
          entries={[...liveActivity, ...baseActivity]}
          onTeach={() => {
            go("workbooks");
            setTeaching(true);
          }}
          onOpenHome={() => go("home")}
        />
      );
      break;
    case "settings":
      content = (
        <SettingsView
          folders={folders}
          onRemoveFolder={(name) => setFolders((f) => f.filter((x) => x.name !== name))}
          onAddFolder={() =>
            setFolders((f) => (f.some((x) => x.name === "Desktop/Exports") ? f : [...f, { name: "Desktop/Exports", kind: "local" }]))
          }
        />
      );
      break;
    case "account":
      content = <AccountView workbookCount={books.length} />;
      break;
  }

  return (
    <div className="flex h-dvh w-full bg-header xl:p-6">
      {/* App window */}
      <div
        {...dragHandlers}
        className="relative flex h-full w-full min-w-[1024px] flex-col overflow-hidden border-line bg-page xl:rounded-xl xl:border"
      >
        <TitleBar />

        <div className="relative flex min-h-0 flex-1">
          <Sidebar
            open={sidebarOpen}
            view={view}
            onNavigate={go}
            onToggle={() => setSidebarOpen((o) => !o)}
            queueCount={queueCount}
            needsYou={needsYou}
            workbookCount={books.length}
            folders={folders}
          />

          <main className="relative flex min-w-0 flex-1 flex-col">
            {/* Toolbar */}
            <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line-subtle px-6">
              <label className="flex h-9 w-80 items-center gap-2 rounded-md border border-line bg-surface px-3 text-fg-subtle focus-within:border-brand">
                <SearchIcon />
                <input
                  placeholder="Search files and workbooks"
                  className="type-body-sm w-full bg-transparent text-fg-soft outline-none placeholder:text-fg-subtle"
                />
                <kbd className="type-data rounded-sm border border-line px-1.5 text-[11px] text-fg-subtle">⌘K</kbd>
              </label>
              <button onClick={() => fileInput.current?.click()} className="btn-brand min-h-9 cursor-pointer px-3.5 text-sm">
                <UploadIcon />
                Drop an export
              </button>
              <input
                ref={fileInput}
                type="file"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(Array.from(e.target.files ?? []).map((f) => f.name));
                  e.target.value = "";
                }}
              />
            </div>

            {/* Content */}
            <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-8 py-6">{content}</div>
            </div>

            <StatusBar folders={folders.length} workbooks={books.length} />
          </main>
        </div>

        {teaching && (
          <TeachModal
            onClose={() => setTeaching(false)}
            onSave={(w) => {
              setBooks((b) => [w, ...b]);
              setTeaching(false);
              go("workbooks");
            }}
          />
        )}

        {dragging && !teaching && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-page/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-brand px-16 py-12">
              <span className="flex size-14 items-center justify-center rounded-lg bg-brand-a24 text-brand">
                <UploadIcon className="size-7" />
              </span>
              <p className="type-h4">Drop to clean</p>
              <p className="type-body-sm">Dropdone will match it to one of your workbooks.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */

function TitleBar() {
  return (
    <div className="relative flex h-10 shrink-0 items-center border-b border-line-subtle bg-header px-4">
      {/* macOS window controls (OS chrome, intentionally not brand colors) */}
      <div className="flex gap-2">
        <span className="size-3 rounded-full bg-[#FF5F57]" />
        <span className="size-3 rounded-full bg-[#FEBC2E]" />
        <span className="size-3 rounded-full bg-[#28C840]" />
      </div>
      <p className="type-caption absolute left-1/2 -translate-x-1/2 text-fg-muted">Dropdone</p>
      <p className="type-caption ml-auto flex items-center gap-1.5 text-fg-subtle">
        <LockIcon className="size-3.5" />
        Everything stays on this Mac
      </p>
    </div>
  );
}

function Sidebar({
  open,
  view,
  onNavigate,
  onToggle,
  queueCount,
  needsYou,
  workbookCount,
  folders,
}: {
  open: boolean;
  view: View;
  onNavigate: (v: View) => void;
  onToggle: () => void;
  queueCount: number;
  needsYou: boolean;
  workbookCount: number;
  folders: Folder[];
}) {
  const folderIcon = { local: FolderIcon, cloud: CloudFolderIcon, server: ServerIcon };

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-line-subtle bg-section transition-[width] duration-200 ease-out ${
        open ? "w-[248px]" : "w-[68px]"
      }`}
    >
      <div className={`flex h-14 shrink-0 items-center px-3 ${open ? "justify-between" : "justify-center"}`}>
        {open ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/brand/dropdone-lockup.svg" alt="Dropdone" className="ml-1 h-8 w-auto" />
        ) : null}
        <button
          onClick={onToggle}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          title={open ? "Collapse sidebar  [" : "Expand sidebar  ["}
          className="flex size-9 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
        >
          {open ? (
            <SidebarIcon />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/brand/dropdone-icon.svg" alt="Dropdone" className="size-8" />
          )}
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-3 pt-2">
        <NavItem open={open} icon={<HomeIcon />} label="Home" active={view === "home"} onClick={() => onNavigate("home")} dot={needsYou} />
        <NavItem open={open} icon={<QueueIcon />} label="My queue" badge={queueCount} active={view === "queue"} onClick={() => onNavigate("queue")} />
        <NavItem open={open} icon={<WorkbookIcon />} label="Workbooks" badge={workbookCount} subtle active={view === "workbooks"} onClick={() => onNavigate("workbooks")} />
        <NavItem open={open} icon={<ActivityIcon />} label="Activity" active={view === "activity"} onClick={() => onNavigate("activity")} />
      </nav>

      <div className="mt-6 flex flex-col gap-0.5 px-3">
        {open && <p className="type-eyebrow px-2.5 pb-2 text-[11px] text-fg-subtle">Watched folders</p>}
        {folders.map((f) => {
          const Icon = folderIcon[f.kind];
          return (
            <NavItem
              key={f.name}
              open={open}
              icon={<Icon />}
              label={f.name}
              onClick={() => onNavigate("settings")}
              trailing={<span className="size-1.5 rounded-full bg-success" title="Watching" />}
            />
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-0.5 border-t border-line-subtle px-3 py-3">
        <NavItem open={open} icon={<HelpIcon />} label="Help" onClick={() => {}} />
        <NavItem open={open} icon={<SettingsIcon />} label="Settings" active={view === "settings"} onClick={() => onNavigate("settings")} />
        <button
          onClick={() => onNavigate("account")}
          className={`mt-2 flex cursor-pointer items-center gap-3 rounded-md p-1.5 text-left transition-colors hover:bg-surface-hover ${
            view === "account" ? "bg-surface-strong" : ""
          } ${open ? "" : "justify-center"}`}
          title="Account"
        >
          <span className="type-label flex size-8 shrink-0 items-center justify-center rounded-md bg-brand text-[13px] text-fg-inverse">
            {account.initials}
          </span>
          {open && (
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="type-label truncate text-sm text-fg">{account.name}</span>
              <span className="type-caption truncate">{account.plan} · Free</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  open,
  icon,
  label,
  active,
  badge,
  subtle,
  dot,
  trailing,
  onClick,
}: {
  open: boolean;
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  subtle?: boolean;
  dot?: boolean;
  trailing?: ReactNode;
  onClick: () => void;
}) {
  const showBadge = badge !== undefined && badge > 0;
  return (
    <button
      onClick={onClick}
      title={open ? undefined : label}
      aria-current={active ? "page" : undefined}
      className={`relative flex h-9 w-full cursor-pointer items-center gap-3 rounded-md px-2.5 text-left transition-colors ${
        active ? "bg-surface-strong text-fg" : "text-fg-muted hover:bg-surface-hover hover:text-fg"
      } ${open ? "" : "justify-center"}`}
    >
      {active && <span className="absolute -left-3 top-2 h-5 w-[3px] rounded-r-sm bg-brand" />}
      <span className={active ? "text-brand" : ""}>{icon}</span>
      {open && <span className="type-label flex-1 truncate text-sm">{label}</span>}
      {open && dot && <span className="size-2 rounded-full bg-warning" title="Needs your answer" />}
      {open && showBadge && (
        <span className={`type-data rounded-sm px-1.5 text-[11px] ${subtle ? "text-fg-subtle" : "bg-brand-a24 text-brand"}`}>
          {badge}
        </span>
      )}
      {open && trailing}
      {!open && ((showBadge && !subtle) || dot) && (
        <span className={`absolute right-1.5 top-1.5 size-2 rounded-full ${dot ? "bg-warning" : "bg-brand"}`} />
      )}
    </button>
  );
}

function StatusBar({ folders, workbooks }: { folders: number; workbooks: number }) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-4 border-t border-line-subtle bg-header px-5">
      <span className="type-caption flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-success" />
        Watching {folders} {folders === 1 ? "folder" : "folders"}
      </span>
      <span className="type-caption">{workbooks} workbooks learned</span>
      <span className="type-caption ml-auto">Dropdone {account.version} · Early access</span>
    </div>
  );
}

function guessWorkbook(name: string) {
  const n = name.toLowerCase();
  if (/roster|sss|trio|apr/.test(n))
    return { workbook: "SSS_APR_2024-25_upload.xlsx", workbookFolder: "OneDrive – ASU › TRIO › APR", sheet: "Participants" };
  if (/check|register|ap_|vendor/.test(n))
    return { workbook: "Board Packet – AP Detail.xlsx", workbookFolder: "Finance › Board › Oct", sheet: "AP Detail" };
  if (/gl|deposit|ledger/.test(n))
    return { workbook: "Daily Deposit Recon.xlsx", workbookFolder: "Finance › Recon › FY27", sheet: "Detail" };
  if (/inv|stock|count/.test(n))
    return { workbook: "Inventory Weekly.xlsx", workbookFolder: "Ops › Inventory", sheet: "Week 42" };
  return { workbook: "Weekly Caseload.xlsx", workbookFolder: "HSD-Share › Reports › 2026", sheet: "Caseload" };
}
