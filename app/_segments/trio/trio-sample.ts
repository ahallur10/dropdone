// Stand-in TRIO SSS roster and APR output for the How It Works demo.
// Every name, ID and date here is made up. Swap in the anonymized ASU roster later:
// keep its formatting quirks, but never real student values.
//
// Codes marked "stand-in" below aren't verified against the current SSS APR instructions yet.
// Confirmed so far: Cohort Year 26 = 2024-25 cohort; Participant Status 1 = new participant.

export type RosterRow =
  | { kind: "title"; text: string }
  | { kind: "header"; cells: string[] }
  | { kind: "group"; text: string }
  | { kind: "data"; cells: string[] }
  | { kind: "subtotal"; text: string }
  | { kind: "blank" }
  | { kind: "footer"; text: string };

export const exportFile = "SSS_Active_Roster_AY2425.xlsx";
export const lastYearFile = "SSS_APR_2023-24_download.xlsx";
export const outputFile = "SSS_APR_2024-25_upload.xlsx";

export const roster: RosterRow[] = [
  { kind: "title", text: "TRIO SSS - Active Participant Roster    Run: 09/15/2025 4:12 PM" },
  { kind: "blank" },
  {
    kind: "header",
    cells: ["Student ID", "Student Name", "DOB", "Elig", "Entry Term", "Status", "Cum GPA"],
  },
  { kind: "group", text: "Advisor: LOPEZ, M." },
  { kind: "data", cells: ["1203345", "MARTINEZ, ANA", "3/14/2005", "FG/LI", "Fall 2024", "Active-New", "N/A"] },
  { kind: "data", cells: ["1203346", "nguyen, tam", "2004-11-02", "LI only", "FA23", "active", "3.2"] },
  { kind: "data", cells: ["1203345", "MARTINEZ, ANA", "3/14/2005", "FG/LI", "Fall 2024", "Active-New", "N/A"] },
  { kind: "subtotal", text: "Count: 3" },
  { kind: "blank" },
  { kind: "group", text: "Advisor: Okafor, J" },
  { kind: "data", cells: ["1203348", "Okafor,Chidi", "07/09/2003", "First Gen", "2024 Fall", "NEW", "2.85 "] },
  { kind: "data", cells: ["1203351", "Begay, Shandiin R.", "1/2/2004", "Disab/LI", "FA23", "Continuing", "3.61"] },
  { kind: "subtotal", text: "Count: 2" },
  { kind: "footer", text: "Page 1 of 4" },
];

export const aprHeader = [
  "Last Name",
  "First Name",
  "Middle Initial",
  "Birth Date",
  "Eligibility",
  "Cohort Year",
  "Participant Status",
  "Cumulative GPA",
];

export type AprRow = { cells: string[]; flaggedCol?: number };

export const aprRows: AprRow[] = [
  { cells: ["Martinez", "Ana", "", "03/14/2005", "1", "26", "1", ""], flaggedCol: 7 },
  { cells: ["Nguyen", "Tam", "", "11/02/2004", "2", "25", "2", "3.20"] },
  { cells: ["Okafor", "Chidi", "", "07/09/2003", "3", "26", "1", "2.85"] },
  { cells: ["Begay", "Shandiin", "R", "01/02/2004", "5", "25", "2", "3.61"] },
];

// What Dropdone learned from last year's file, shown as before → after.
export const mappings: { field: string; from: string[]; to: string; note?: string }[] = [
  { field: "Names", from: ["MARTINEZ, ANA", "Okafor,Chidi"], to: "Martinez | Ana", note: "Split into last, first, and middle initial" },
  { field: "Birth dates", from: ["3/14/2005", "2004-11-02"], to: "03/14/2005", note: "One date format" },
  { field: "Eligibility", from: ["FG/LI", "LI only", "First Gen"], to: "1, 2, 3", note: "Mapped to APR codes (stand-in)" },
  { field: "Cohort year", from: ["Fall 2024", "FA23", "2024 Fall"], to: "26, 25", note: "Entry term to APR cohort code" },
  { field: "Participant status", from: ["Active-New", "NEW", "Continuing"], to: "1, 2", note: "New vs. continuing (2 is stand-in)" },
];

export const removed = [
  "Report title and run date",
  "2 advisor group headers",
  "2 Count subtotal rows",
  "Page 1 of 4 footer",
  "2 blank spacer rows",
  "1 duplicate student (1203345)",
];
