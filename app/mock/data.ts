// Sample data for the desktop app mock. All files, people and numbers are made up.
// Product behavior follows HOW-IT-WORKS.md: learn from a before/after pair, run approved
// steps exactly as written (no AI in weekly runs), check before saving, stop when unsure.

/* ---------- Run stages ---------- */

// Stage keys are shared with the homepage animation and feature cards; only labels changed.
export type Stage =
  | "queued"
  | "reading"
  | "matching"
  | "cleaning"
  | "checking"
  | "review"
  | "stopped"
  | "held"
  | "done";

export const stageLabel: Record<Stage, string> = {
  queued: "Queued",
  reading: "Reading export",
  matching: "Running steps",
  cleaning: "Running steps",
  checking: "Checking against workbook",
  review: "Needs your OK",
  stopped: "Stopped, nothing saved",
  held: "Paused by you",
  done: "Workbook updated",
};

export function stageFor(item: Item): Stage {
  if (item.stopped && item.progress >= (item.stopAt ?? 0)) return "stopped";
  if (item.paused) return "review";
  if (item.held && item.progress < 100) return "held";
  if (item.progress >= 100) return "done";
  if (item.progress >= 80) return "checking";
  if (item.progress >= 50) return "cleaning";
  if (item.progress >= 22) return "matching";
  if (item.progress > 0) return "reading";
  return "queued";
}

/* ---------- Recipes (one per report) ---------- */

export type RefreshMode = "workbook" | "sheet";

export const refreshModeLabel: Record<RefreshMode, string> = {
  workbook: "Full workbook",
  sheet: "Single sheet",
};

export type Recipe = {
  id: string;
  name: string;
  workbook: string;
  folder: string;
  sheet: string;
  mode: RefreshMode;
  learnedFrom: { messy: string; cleaned: string };
  learnedOn: string;
  lastRun: string;
  runs: number;
  steps: string[];
};

export const clientServicesSteps = [
  'Remove everything above the row that starts with "CLNT_ID"',
  "Remove empty columns",
  'Remove "Page _ of _" lines, "Confidential" lines, and repeated header rows',
  "Rename columns: CLNT_ID to Client ID, CLNT_NM to Client Name, STAT to Status, SVC_DT to Service Date, AMT to Amount",
  "Trim extra spaces and change Client Name to First Last, in title case",
  "Format Service Date as YYYY-MM-DD",
  "Turn Amount into a plain number",
  "Remove rows where Status is Withdrawn",
];

export const recipes: Recipe[] = [
  {
    id: "client-services",
    name: "Weekly Client Services Report",
    workbook: "Client Services.xlsx",
    folder: "HSD-Share › Reports › 2026",
    sheet: "Data",
    mode: "sheet",
    learnedFrom: { messy: "Client_Services_0302.xlsx", cleaned: "Client Services.xlsx" },
    learnedOn: "Mar 2",
    lastRun: "Mar 9, 8:20 AM",
    runs: 2,
    steps: clientServicesSteps,
  },
  {
    id: "caseload",
    name: "Weekly Caseload",
    workbook: "Weekly Caseload.xlsx",
    folder: "HSD-Share › Reports › 2026",
    sheet: "Caseload",
    mode: "workbook",
    learnedFrom: { messy: "CASE_EXPORT_0105.csv", cleaned: "Weekly Caseload.xlsx" },
    learnedOn: "Jan 5",
    lastRun: "Mar 9, 8:31 AM",
    runs: 10,
    steps: [
      "Remove the report title and run date rows",
      'Remove "*** PAGE _ ***" lines',
      "Strip leading zeros and spaces from CASE_ID",
      "Change CLIENT NM to First Last, in title case",
      "Format OPEN_DT as YYYY-MM-DD",
      "Rename columns to Case ID, Client, Opened, Program, Caseworker",
    ],
  },
  {
    id: "ap-detail",
    name: "Monthly AP Check Register",
    workbook: "Board Packet – AP Detail.xlsx",
    folder: "Finance › Board › 2026",
    sheet: "AP Detail",
    mode: "sheet",
    learnedFrom: { messy: "check_register_jan.xlsx", cleaned: "Board Packet – AP Detail.xlsx" },
    learnedOn: "Feb 3",
    lastRun: "Mar 3, 9:12 AM",
    runs: 2,
    steps: [
      "Merge the two header rows into one",
      "Join wrapped descriptions back onto their line",
      "Split Account Number into Fund, Function, Object and Org",
      'Remove the "TOTAL:" row',
      "Turn Amount into a plain number",
    ],
  },
  {
    id: "deposits",
    name: "Daily Deposit Recon",
    workbook: "Daily Deposit Recon.xlsx",
    folder: "Finance › Recon › FY26",
    sheet: "Detail",
    mode: "workbook",
    learnedFrom: { messy: "CORE_GL_DUMP_0227.txt", cleaned: "Daily Deposit Recon.xlsx" },
    learnedOn: "Feb 27",
    lastRun: "Mar 9, 4:55 PM",
    runs: 7,
    steps: [
      'Remove "** SUBTOTAL **" rows',
      "Turn (310.00) into a 310.00 credit",
      "Format POST DATE as YYYY-MM-DD",
      "Rename columns to Account, Description, Debit, Credit, Posted",
    ],
  },
];

/* ---------- Run queue ---------- */

export type QueueItem = {
  id: string;
  recipeId: string;
  file: string;
  folder: string;
  meta: string;
  progress: number;
  /** Ticks to wait before starting, so the queue staggers. */
  startDelay?: number;
  /** Progress at which the run pauses on an unusual result (warning F). */
  pauseAt?: number;
  /** The export's columns changed: the run stops at this point and saves nothing. */
  stopped?: boolean;
  stopAt?: number;
  finishedAgo?: string;
};

export type Item = QueueItem & { paused?: boolean; answered?: boolean; held?: boolean };
export type StagedItem = Item & { stage: Stage };

export const initialQueue: QueueItem[] = [
  {
    id: "cs-0316",
    recipeId: "client-services",
    file: "Client_Services_0316.xlsx",
    folder: "~/Downloads",
    meta: "246 client rows · 61 KB",
    progress: 52,
    pauseAt: 88,
  },
  {
    id: "case-0316",
    recipeId: "caseload",
    file: "CASE_EXPORT_0316.csv",
    folder: "~/Downloads",
    meta: "1,382 rows · 211 KB",
    progress: 30,
    stopped: true,
    stopAt: 40,
  },
  {
    id: "dep-0316",
    recipeId: "deposits",
    file: "CORE_GL_DUMP_0316.txt",
    folder: "~/Desktop/Exports",
    meta: "3,497 rows · 402 KB",
    progress: 0,
    startDelay: 8,
  },
  {
    id: "cs-0309",
    recipeId: "client-services",
    file: "Client_Services_0309.xlsx",
    folder: "~/Downloads",
    meta: "210 client rows · 54 KB",
    progress: 100,
    finishedAgo: "Mar 9",
  },
  {
    id: "ap-0303",
    recipeId: "ap-detail",
    file: "check_register_feb.xlsx",
    folder: "~/Desktop/Exports",
    meta: "1,723 line items · 126 KB",
    progress: 100,
    finishedAgo: "Mar 3",
  },
];

/* ---------- Run summary (E) and warning (F) ---------- */

export type RunSummary = { duration: string; rowsIn: string; rowsOut: string; lines: string[]; saved: string };

export const runSummaries: Record<string, RunSummary> = {
  "client-services": {
    duration: "4 seconds",
    rowsIn: "210 client rows in the export",
    rowsOut: "205 rows in your workbook",
    lines: [
      "Removed 3 junk rows at the top",
      "Removed 3 empty columns",
      "Removed 8 page breaks and repeated headers",
      "Renamed 5 columns",
      "Cleaned 210 names, formatted 210 dates, converted 210 amounts",
      "Removed 5 rows where Status is Withdrawn (last week: 2)",
    ],
    saved: "Updated Client Services.xlsx, Data sheet. Your Summary tab updated too.",
  },
  "ap-detail": {
    duration: "6 seconds",
    rowsIn: "3,497 rows in the export",
    rowsOut: "1,723 line items in your workbook",
    lines: [
      "Merged the two header rows",
      "Joined 1,770 wrapped descriptions back onto their line",
      "Split 1,723 account codes into four columns",
      "Removed the TOTAL row",
    ],
    saved: "Updated Board Packet – AP Detail.xlsx, AP Detail sheet.",
  },
  deposits: {
    duration: "5 seconds",
    rowsIn: "3,497 rows in the export",
    rowsOut: "3,491 rows in your workbook",
    lines: ["Removed 6 subtotal rows", "Turned 412 bracketed amounts into credits", "Formatted 3,491 dates"],
    saved: "Updated Daily Deposit Recon.xlsx, every sheet.",
  },
};

export const warning = {
  itemId: "cs-0316",
  title: "Removed 41 rows where Status is Withdrawn. Usually about 4.",
  body: "Take a look before Dropdone saves. Nothing has been written yet.",
  header: ["Client ID", "Client Name", "Status", "Service Date", "Amount"],
  rows: [
    ["10611", "Ana Ruiz", "Withdrawn", "2026-03-11", ""],
    ["10612", "Ben Okafor", "Withdrawn", "2026-03-11", ""],
    ["10614", "Carla Diaz", "Withdrawn", "2026-03-12", ""],
    ["10618", "Dev Shah", "Withdrawn", "2026-03-12", ""],
    ["10620", "Elena Park", "Withdrawn", "2026-03-13", ""],
  ],
  more: 36,
};

export const stoppedReason = {
  itemId: "case-0316",
  title: "This export changed: the OPEN_DT column is missing",
  body: "Dropdone stopped before saving, so Weekly Caseload.xlsx is untouched. Teach it again with one new example.",
};

/* ---------- Teach flow (setup, once per report) ---------- */

export const teachSample = {
  messy: "Client_Services_0302.xlsx",
  cleaned: "Client Services.xlsx",
  recipeName: "Weekly Client Services Report",
  question: {
    stepIndex: 7,
    intro: "You removed 2 rows. Both say Withdrawn, and both have a blank Amount.",
    ask: "Next week, should Dropdone remove a row like this?",
    header: ["Client ID", "Client Name", "Status", "Service Date", "Amount"],
    row: ["10491", "Rosa Diaz", "Active", "2026-03-10", "(blank)"],
    options: ["Yes", "No", "Not sure"] as const,
  },
};

/* ---------- Activity log ---------- */

export type ActivityKind = "updated" | "warned" | "stopped" | "learned";

export type ActivityEntry = {
  id: string;
  day: "Today" | "Yesterday" | "Earlier this week";
  time: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  canRestore?: boolean;
};

export const activity: ActivityEntry[] = [
  {
    id: "a1",
    day: "Today",
    time: "8:22 AM",
    kind: "warned",
    title: "Weekly Client Services Report is waiting on you",
    detail: "Removed 41 rows where Status is Withdrawn, usually about 4. Nothing saved yet.",
  },
  {
    id: "a2",
    day: "Today",
    time: "8:20 AM",
    kind: "stopped",
    title: "Weekly Caseload stopped safely",
    detail: "CASE_EXPORT_0316.csv is missing the OPEN_DT column. Weekly Caseload.xlsx is untouched.",
  },
  {
    id: "a3",
    day: "Yesterday",
    time: "4:55 PM",
    kind: "updated",
    title: "Updated Daily Deposit Recon.xlsx",
    detail: "From CORE_GL_DUMP_0315.txt · 3,412 rows · 6 subtotal rows removed",
    canRestore: true,
  },
  {
    id: "a4",
    day: "Earlier this week",
    time: "Mon 8:20 AM",
    kind: "updated",
    title: "Updated Client Services.xlsx",
    detail: "From Client_Services_0309.xlsx · 205 rows · 5 Withdrawn rows removed",
    canRestore: true,
  },
  {
    id: "a5",
    day: "Earlier this week",
    time: "Mon 8:05 AM",
    kind: "learned",
    title: "Approved a new cleanup: Monthly AP Check Register",
    detail: "5 steps, learned from check_register_jan.xlsx and your cleaned workbook",
  },
];

/* ---------- Account ---------- */

export const account = {
  name: "Dana Reyes",
  initials: "DR",
  email: "dana.reyes@example.gov",
  org: "County Human Services",
  plan: "Community",
  device: "MacBook Pro · macOS 26",
  version: "0.4.0",
};
