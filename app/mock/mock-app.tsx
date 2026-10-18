"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  account,
  activity as baseActivity,
  initialQueue,
  recipes as initialRecipes,
  stageFor,
  warning,
  type ActivityEntry,
  type Item,
  type Recipe,
} from "./data";
import {
  ActivityIcon,
  HelpIcon,
  HomeIcon,
  LockIcon,
  QueueIcon,
  SearchIcon,
  SettingsIcon,
  SidebarIcon,
  WorkbookIcon,
} from "./icons";
import { AccountView } from "./views/account";
import { ActivityView } from "./views/activity";
import { HomeView } from "./views/home";
import { QueueView } from "./views/queue";
import { RecipesView, TeachModal } from "./views/recipes";
import { SettingsView } from "./views/settings";

type View = "home" | "queue" | "recipes" | "activity" | "settings" | "account";

const TICK_MS = 450;

// Example export file names for a recipe that's run without dropping a real file.
const nextExport: Record<string, string> = {
  "client-services": "Client_Services_0323.xlsx",
  caseload: "CASE_EXPORT_0323.csv",
  "ap-detail": "check_register_mar.xlsx",
  deposits: "CORE_GL_DUMP_0323.txt",
};

export function MockApp() {
  const [view, setView] = useState<View>("home");
  const [items, setItems] = useState<Item[]>(initialQueue);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teaching, setTeaching] = useState<{ reteachId?: string } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // Advance every running item a little each tick so the queue feels live.
  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.progress >= 100 || it.paused || it.held) return it;
          if (it.stopped && it.progress >= (it.stopAt ?? 0)) return it;
          if (it.startDelay && it.startDelay > 0) return { ...it, startDelay: it.startDelay - 1 };
          let next = Math.min(100, it.progress + 1 + Math.floor(Math.random() * 3));
          if (it.stopped && it.stopAt !== undefined) next = Math.min(next, it.stopAt);
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
    setRecipes(initialRecipes);
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

  // Files are dropped on recipe cards. Swallow drops anywhere else so the browser doesn't open them.
  useEffect(() => {
    const stop = (e: DragEvent) => e.preventDefault();
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
    };
  }, []);

  function go(v: View) {
    setView(v);
    scroller.current?.scrollTo({ top: 0 });
  }

  function run(recipeId: string, fileName?: string) {
    setItems((prev) => [
      {
        id: `${recipeId}-${Date.now()}`,
        recipeId,
        file: fileName ?? nextExport[recipeId] ?? "export.xlsx",
        folder: "~/Downloads",
        meta: "Just dropped",
        progress: 0,
        startDelay: 2,
      },
      ...prev,
    ]);
    if (view !== "queue") go("home");
  }

  const looksRight = () =>
    setItems((prev) => prev.map((it) => (it.id === warning.itemId ? { ...it, paused: false, answered: true } : it)));
  const discard = () => setItems((prev) => prev.filter((it) => it.id !== warning.itemId));
  const toggleHold = (id: string) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, held: !it.held } : it)));
  const remove = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  const moveTop = (id: string) =>
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      return it ? [it, ...prev.filter((x) => x.id !== id)] : prev;
    });
  const clearDone = () => setItems((prev) => prev.filter((it) => it.progress < 100));

  function saveRecipe(r: Recipe) {
    // Teaching a report that already has a recipe updates it instead of adding a duplicate.
    setRecipes((prev) => {
      const existing = prev.find((x) => x.id === r.id || x.name === r.name);
      return existing ? prev.map((x) => (x === existing ? { ...r, id: existing.id } : x)) : [r, ...prev];
    });
    // Re-teaching a recipe whose export changed re-runs that export with the new steps.
    if (teaching?.reteachId) {
      setItems((prev) =>
        prev.map((it) =>
          it.recipeId === r.id && it.stopped ? { ...it, stopped: false, progress: 0, startDelay: 3 } : it,
        ),
      );
    }
  }

  const staged = items.map((it) => ({ ...it, stage: stageFor(it) }));
  const queueCount = staged.filter((i) => i.stage !== "done").length;
  const needsYou = staged.some((i) => i.stage === "review" || i.stage === "stopped");

  // Runs that finished in this session show up at the top of Activity.
  const liveActivity: ActivityEntry[] = staged
    .filter((i) => i.finishedAgo === "just now")
    .map((i) => {
      const r = recipes.find((x) => x.id === i.recipeId);
      return {
        id: `live-${i.id}`,
        day: "Today",
        time: "Just now",
        kind: "updated",
        title: `Updated ${r?.workbook ?? "workbook"}`,
        detail: `From ${i.file} · ${r?.name ?? ""}`,
        canRestore: true,
      };
    });

  let content: ReactNode;
  switch (view) {
    case "home":
      content = (
        <HomeView
          items={staged}
          recipes={recipes}
          onRun={run}
          onLooksRight={looksRight}
          onDiscard={discard}
          onReteach={(id) => setTeaching({ reteachId: id })}
        />
      );
      break;
    case "queue":
      content = (
        <QueueView
          items={staged}
          recipes={recipes}
          onToggleHold={toggleHold}
          onRemove={remove}
          onTop={moveTop}
          onOpenHome={() => go("home")}
          onClearDone={clearDone}
          doneCount={staged.length - queueCount}
        />
      );
      break;
    case "recipes":
      content = (
        <RecipesView
          recipes={recipes}
          onTeach={(id) => setTeaching({ reteachId: id })}
          onChangeMode={(id, mode) => setRecipes((rs) => rs.map((r) => (r.id === id ? { ...r, mode } : r)))}
          onDelete={(id) => setRecipes((rs) => rs.filter((r) => r.id !== id))}
        />
      );
      break;
    case "activity":
      content = <ActivityView entries={[...liveActivity, ...baseActivity]} onOpenHome={() => go("home")} />;
      break;
    case "settings":
      content = <SettingsView />;
      break;
    case "account":
      content = <AccountView recipeCount={recipes.length} />;
      break;
  }

  return (
    <div className="flex h-dvh w-full bg-header xl:p-6">
      {/* App window */}
      <div className="relative flex h-full w-full min-w-[1024px] flex-col overflow-hidden border-line bg-page xl:rounded-xl xl:border">
        <TitleBar />

        <div className="relative flex min-h-0 flex-1">
          <Sidebar
            open={sidebarOpen}
            view={view}
            onNavigate={go}
            onToggle={() => setSidebarOpen((o) => !o)}
            queueCount={queueCount}
            needsYou={needsYou}
            recipeCount={recipes.length}
          />

          <main className="relative flex min-w-0 flex-1 flex-col">
            {/* Toolbar */}
            <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line-subtle px-6">
              <label className="flex h-9 w-80 items-center gap-2 rounded-md border border-line bg-surface px-3 text-fg-subtle focus-within:border-brand">
                <SearchIcon />
                <input
                  placeholder="Search recipes and runs"
                  className="type-body-sm w-full bg-transparent text-fg-soft outline-none placeholder:text-fg-subtle"
                />
                <kbd className="type-data rounded-sm border border-line px-1.5 text-[11px] text-fg-subtle">⌘K</kbd>
              </label>
              <button onClick={() => setTeaching({})} className="btn-brand min-h-9 cursor-pointer px-3.5 text-sm">
                <span aria-hidden="true" className="text-lg leading-none">+</span>
                New recipe
              </button>
            </div>

            {/* Content */}
            <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
              <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-8 py-6">{content}</div>
            </div>

            <StatusBar recipes={recipes.length} />
          </main>
        </div>

        {teaching && (
          <TeachModal
            reteach={recipes.find((r) => r.id === teaching.reteachId)}
            onClose={() => setTeaching(null)}
            onSave={saveRecipe}
          />
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
        Everything stays on this computer
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
  recipeCount,
}: {
  open: boolean;
  view: View;
  onNavigate: (v: View) => void;
  onToggle: () => void;
  queueCount: number;
  needsYou: boolean;
  recipeCount: number;
}) {
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
        <NavItem open={open} icon={<WorkbookIcon />} label="Recipes" badge={recipeCount} subtle active={view === "recipes"} onClick={() => onNavigate("recipes")} />
        <NavItem open={open} icon={<ActivityIcon />} label="Activity" active={view === "activity"} onClick={() => onNavigate("activity")} />
      </nav>

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
  onClick,
}: {
  open: boolean;
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  subtle?: boolean;
  dot?: boolean;
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
      {open && dot && <span className="size-2 rounded-full bg-warning" title="Needs you" />}
      {open && showBadge && (
        <span className={`type-data rounded-sm px-1.5 text-[11px] ${subtle ? "text-fg-subtle" : "bg-brand-a24 text-brand"}`}>
          {badge}
        </span>
      )}
      {!open && ((showBadge && !subtle) || dot) && (
        <span className={`absolute right-1.5 top-1.5 size-2 rounded-full ${dot ? "bg-warning" : "bg-brand"}`} />
      )}
    </button>
  );
}

function StatusBar({ recipes }: { recipes: number }) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-4 border-t border-line-subtle bg-header px-5">
      <span className="type-caption flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-success" />
        {recipes} recipes ready
      </span>
      <span className="type-caption">Weekly runs use no AI</span>
      <span className="type-caption ml-auto">Dropdone {account.version} · Early access</span>
    </div>
  );
}
