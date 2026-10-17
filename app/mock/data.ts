// Sample queue for the desktop app mock. All files, paths and people are made up.

export type Stage = "queued" | "reading" | "matching" | "cleaning" | "checking" | "review" | "held" | "done";

export const stageLabel: Record<Stage, string> = {
  queued: "Queued",
  reading: "Reading export",
  matching: "Matching columns",
  cleaning: "Cleaning rows",
  checking: "Checking against workbook",
  review: "Needs your answer",
  held: "Paused by you",
  done: "Workbook updated",
};

// Progress thresholds for each running stage (0 to 100).
export function stageFor(progress: number, paused: boolean, held = false): Stage {
  if (paused) return "review";
  if (held && progress < 100) return "held";
  if (progress >= 100) return "done";
  if (progress >= 80) return "checking";
  if (progress >= 50) return "cleaning";
  if (progress >= 22) return "matching";
  if (progress > 0) return "reading";
  return "queued";
}

export type QueueItem = {
  id: string;
  file: string;
  folder: string;
  meta: string;
  workbook: string;
  workbookFolder: string;
  sheet: string;
  progress: number;
  /** Progress at which the item stops and asks a question. */
  pauseAt?: number;
  /** Ticks to wait before starting, so the queue staggers. */
  startDelay?: number;
  finishedAgo?: string;
};

export const initialQueue: QueueItem[] = [
  {
    id: "trio",
    file: "SSS_Active_Roster_AY2425.xlsx",
    folder: "~/Downloads",
    meta: "214 rows · 48 KB",
    workbook: "SSS_APR_2024-25_upload.xlsx",
    workbookFolder: "OneDrive – ASU › TRIO › APR",
    sheet: "Participants",
    progress: 58,
    pauseAt: 86,
  },
  {
    id: "caseload",
    file: "CASE_EXPORT_20261016.csv",
    folder: "~/Downloads",
    meta: "1,382 rows · 211 KB",
    workbook: "Weekly Caseload.xlsx",
    workbookFolder: "HSD-Share › Reports › 2026",
    sheet: "Caseload",
    progress: 24,
  },
  {
    id: "advising",
    file: "advising_log_oct (2).csv",
    folder: "~/Downloads",
    meta: "96 rows · 14 KB",
    workbook: "Advising Hours Tracker.xlsx",
    workbookFolder: "OneDrive – ASU › TRIO › Tracking",
    sheet: "October",
    progress: 0,
    startDelay: 6,
  },
  {
    id: "gl",
    file: "CORE_GL_DUMP_101626.txt",
    folder: "~/Desktop/Exports",
    meta: "3,497 rows · 402 KB",
    workbook: "Daily Deposit Recon.xlsx",
    workbookFolder: "Finance › Recon › FY27",
    sheet: "Detail",
    progress: 0,
    startDelay: 14,
  },
  {
    id: "register",
    file: "check_register_sept_26.xlsx",
    folder: "~/Desktop/Exports",
    meta: "1,723 line items · 126 KB",
    workbook: "Board Packet – AP Detail.xlsx",
    workbookFolder: "Finance › Board › Oct",
    sheet: "AP Detail",
    progress: 100,
    finishedAgo: "2 min ago",
  },
  {
    id: "inventory",
    file: "INV_COUNT_W42.csv",
    folder: "~/Downloads",
    meta: "640 rows · 58 KB",
    workbook: "Inventory Weekly.xlsx",
    workbookFolder: "Ops › Inventory",
    sheet: "Week 42",
    progress: 100,
    finishedAgo: "1 hr ago",
  },
];

export const watchedFolders = [
  { name: "Downloads", kind: "local" as const },
  { name: "OneDrive – ASU", kind: "cloud" as const },
  { name: "HSD-Share", kind: "server" as const },
];

export const reviewQuestion = {
  itemId: "trio",
  title: "Ana Martinez has N/A for GPA",
  body: "She's a first-term student. In last year's file, first-term students had a blank GPA. Do the same here?",
  options: ["Leave it blank", "I'll fill it in"],
};

export type Item = QueueItem & { paused?: boolean; answered?: boolean; held?: boolean };
export type StagedItem = Item & { stage: Stage };

/* ---------- Workbooks Dropdone has learned ---------- */

export type RefreshMode = "workbook" | "sheet" | "adjusted";

export const refreshModeLabel: Record<RefreshMode, string> = {
  workbook: "Full workbook",
  sheet: "Single sheet",
  adjusted: "Adjusted refresh",
};

export type Workbook = {
  id: string;
  name: string;
  folder: string;
  sheet: string;
  learnedFrom: string;
  learnedOn: string;
  mode: RefreshMode;
  lastUpdate: string;
  runs: number;
  watch: string;
  columns: [from: string, to: string][];
  cleanups: string[];
};

export const workbooks: Workbook[] = [
  {
    id: "trio",
    name: "SSS_APR_2024-25_upload.xlsx",
    folder: "OneDrive – ASU › TRIO › APR",
    sheet: "Participants",
    learnedFrom: "SSS_Active_Roster_AY2324.xlsx",
    learnedOn: "Sep 30",
    mode: "sheet",
    lastUpdate: "Waiting on you",
    runs: 3,
    watch: "Downloads",
    columns: [
      ["Student Name", "Last Name, First Name, Middle Initial"],
      ["DOB", "Birth Date"],
      ["Elig", "Eligibility"],
      ["Entry Term", "Cohort Year"],
      ["Status", "Participant Status"],
      ["Cum GPA", "Cumulative GPA"],
    ],
    cleanups: [
      "Drop the report title and run date",
      "Drop advisor group headers and Count rows",
      "Drop page footers and blank rows",
      "Remove duplicate students by Student ID",
      "Map eligibility labels to APR codes",
    ],
  },
  {
    id: "caseload",
    name: "Weekly Caseload.xlsx",
    folder: "HSD-Share › Reports › 2026",
    sheet: "Caseload",
    learnedFrom: "CASE_EXPORT_20250106.csv",
    learnedOn: "Jan 6",
    mode: "workbook",
    lastUpdate: "Today, 3:41 PM",
    runs: 41,
    watch: "Downloads",
    columns: [
      ["CASE_ID", "Case ID"],
      ["CLIENT NM", "Client"],
      ["OPEN_DT", "Opened"],
      ["PROGRAM", "Program"],
      ["WORKER", "Caseworker"],
    ],
    cleanups: [
      "Strip leading zeros and spaces from Case ID",
      "Flip LAST, FIRST to First Last",
      "Drop *** PAGE n *** markers",
      "One date format: MM/DD/YYYY",
    ],
  },
  {
    id: "advising",
    name: "Advising Hours Tracker.xlsx",
    folder: "OneDrive – ASU › TRIO › Tracking",
    sheet: "October",
    learnedFrom: "advising_log_sep.csv",
    learnedOn: "Oct 1",
    mode: "sheet",
    lastUpdate: "Oct 1, 9:02 AM",
    runs: 2,
    watch: "Downloads",
    columns: [
      ["student", "Student"],
      ["mtg_date", "Date"],
      ["duration", "Hours"],
      ["advisor", "Advisor"],
    ],
    cleanups: ["Convert 45 min and 1.5 hrs to decimal hours", "Drop cancelled meetings"],
  },
  {
    id: "gl",
    name: "Daily Deposit Recon.xlsx",
    folder: "Finance › Recon › FY27",
    sheet: "Detail",
    learnedFrom: "CORE_GL_DUMP_093026.txt",
    learnedOn: "Sep 30",
    mode: "workbook",
    lastUpdate: "Yesterday, 4:55 PM",
    runs: 12,
    watch: "Desktop/Exports",
    columns: [
      ["ACCT", "Account"],
      ["DESC", "Description"],
      ["DR", "Debit"],
      ["CR", "Credit"],
      ["POST DATE", "Posted"],
    ],
    cleanups: ["Drop ** SUBTOTAL ** rows", "Turn (310.00) into a 310.00 credit", "Read 20261009 as 10/09/2026"],
  },
  {
    id: "register",
    name: "Board Packet – AP Detail.xlsx",
    folder: "Finance › Board › Oct",
    sheet: "AP Detail",
    learnedFrom: "check_register_aug_26.xlsx",
    learnedOn: "Sep 4",
    mode: "sheet",
    lastUpdate: "Today, 3:39 PM",
    runs: 2,
    watch: "Desktop/Exports",
    columns: [
      ["CHECK NUMBER", "Check #"],
      ["CHECK DATE", "Date"],
      ["VENDOR", "Vendor"],
      ["INVOICE DESCRIPTION", "Description"],
      ["ACCOUNT NUMBER", "Fund, Function, Object, Org"],
      ["AMOUNT", "Amount"],
    ],
    cleanups: [
      "Merge the two-row header into one",
      "Join wrapped descriptions back onto their line",
      "Split the account code into four columns",
      "Drop the TOTAL footer",
    ],
  },
  {
    id: "inventory",
    name: "Inventory Weekly.xlsx",
    folder: "Ops › Inventory",
    sheet: "Week 42",
    learnedFrom: "INV_COUNT_W38.csv",
    learnedOn: "Sep 15",
    mode: "workbook",
    lastUpdate: "Today, 2:40 PM",
    runs: 5,
    watch: "Downloads",
    columns: [
      ["SKU", "SKU"],
      ["DESCR", "Item"],
      ["ON_HAND", "On hand"],
      ["LOC", "Location"],
    ],
    cleanups: ["Drop zero-quantity bins", "Title-case item names"],
  },
];

/* ---------- Activity log ---------- */

export type ActivityKind = "updated" | "asked" | "learned" | "nomatch" | "folder";

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
    time: "3:39 PM",
    kind: "updated",
    title: "Updated Board Packet – AP Detail.xlsx",
    detail: "From check_register_sept_26.xlsx · 1,723 line items · 1,774 junk rows removed",
    canRestore: true,
  },
  {
    id: "a2",
    day: "Today",
    time: "3:12 PM",
    kind: "asked",
    title: "Asked about SSS_Active_Roster_AY2425.xlsx",
    detail: "Ana Martinez has N/A for GPA. Waiting on your answer before saving.",
  },
  {
    id: "a3",
    day: "Today",
    time: "2:58 PM",
    kind: "nomatch",
    title: "PAYROLL_0930.csv didn't match a workbook",
    detail: "Its columns don't look like any workbook you've taught Dropdone. Nothing was changed.",
  },
  {
    id: "a4",
    day: "Today",
    time: "2:40 PM",
    kind: "updated",
    title: "Updated Inventory Weekly.xlsx",
    detail: "From INV_COUNT_W42.csv · 640 rows · sheet Week 42",
    canRestore: true,
  },
  {
    id: "a5",
    day: "Yesterday",
    time: "4:55 PM",
    kind: "updated",
    title: "Updated Daily Deposit Recon.xlsx",
    detail: "From CORE_GL_DUMP_101526.txt · 3,412 rows · 6 subtotal rows removed",
    canRestore: true,
  },
  {
    id: "a6",
    day: "Yesterday",
    time: "11:20 AM",
    kind: "folder",
    title: "Started watching HSD-Share",
    detail: "/Volumes/HSD-Share/Exports",
  },
  {
    id: "a7",
    day: "Earlier this week",
    time: "Mon 9:02 AM",
    kind: "learned",
    title: "Learned Advising Hours Tracker.xlsx",
    detail: "From advising_log_sep.csv · 4 columns, 2 cleanup rules",
  },
  {
    id: "a8",
    day: "Earlier this week",
    time: "Mon 8:47 AM",
    kind: "updated",
    title: "Updated Weekly Caseload.xlsx",
    detail: "From CASE_EXPORT_20261012.csv · 1,355 rows · 3 date formats fixed",
    canRestore: true,
  },
];

/* ---------- Account ---------- */

export const account = {
  name: "Dana Reyes",
  initials: "DR",
  email: "dana.reyes@example.edu",
  org: "TRIO Student Support Services",
  plan: "Community",
  device: "MacBook Pro · macOS 26",
  version: "0.4.0",
};

export const folderPaths: Record<string, string> = {
  Downloads: "~/Downloads",
  "OneDrive – ASU": "~/Library/CloudStorage/OneDrive-ASU",
  "HSD-Share": "/Volumes/HSD-Share/Exports",
};
