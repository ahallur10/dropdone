// Content for the Drag, Drop, Done animation. Each segment page (genpages later) can pass its own.
// The default follows HOW-IT-WORKS.md: one "Weekly Client Services Report" example everywhere.
// All names, IDs and numbers are made up.

export type DddScenario = {
  /** The recipe the export is dropped on. */
  recipe: string;
  /**
   * The messy export, as a legacy system's PDF looks once converted to Excel: 9 columns (A to I)
   * with empty spacer columns, page clutter mid-data and a repeated header row.
   */
  sheet: {
    file: string;
    /** Each row has 9 cells. A row with only a first cell spans the whole width. */
    rows: string[][];
    /** 1-based row numbers that are header rows (bold). */
    headerRows: number[];
    /** Formula bar contents for the selected cell. */
    selected: { ref: string; value: string; row: number; col: number };
    tabs: string[];
  };
  /** The workbook Dropdone updates. */
  output: {
    file: string;
    folder: string;
    sheet: string;
    header: string[];
    rows: string[][];
  };
  /** Other files already in the run list, for realism. */
  queue: { file: string; recipe: string }[];
};

const blank9 = ["", "", "", "", "", "", "", "", ""];

export const countyScenario: DddScenario = {
  recipe: "Weekly Client Services Report",
  sheet: {
    file: "Client_Services_0316.xlsx",
    rows: [
      ["CLIENT SERVICES REPORT"],
      ["Program: All Sites", "", "", "", "", "", "", "", "Run date: 03/16/26 08:14"],
      blank9,
      ["CLNT_ID", "", "CLNT_NM", "", "STAT", "SVC_DT", "", "AMT", ""],
      ["10482", "", "  Smith, JOHN ", "", "Active", "03-02-26", "", "$1,200.00", ""],
      ["10483", "", "garcia, maria", "", "Withdrawn", "03-02-26", "", "", ""],
      ["10484", "", "LEE, DAVID ", "", "Active", "03-03-26", "", "$300.00", ""],
      blank9,
      ["Confidential: contains client information", "", "", "", "", "", "", "", "Page 1 of 2"],
      blank9,
      ["CLNT_ID", "", "CLNT_NM", "", "STAT", "SVC_DT", "", "AMT", ""],
      ["10485", "", "Patel, ANITA", "", "Withdrawn", "03-04-26", "", "", ""],
      ["10486", "", "nguyen, tom", "", "Active", "03-05-26", "", "$450.00", ""],
      blank9,
      ["Confidential: contains client information", "", "", "", "", "", "", "", "Page 2 of 2"],
    ],
    headerRows: [1, 4, 11],
    selected: { ref: "C5", value: "  Smith, JOHN ", row: 5, col: 2 },
    tabs: ["Table 1", "Table 2"],
  },
  output: {
    file: "Client Services.xlsx",
    folder: "HSD-Share › Reports › 2026",
    sheet: "Data",
    header: ["Client ID", "Client Name", "Status", "Service Date", "Amount"],
    rows: [
      ["10482", "John Smith", "Active", "2026-03-02", "1200"],
      ["10484", "David Lee", "Active", "2026-03-03", "300"],
      ["10486", "Tom Nguyen", "Active", "2026-03-05", "450"],
    ],
  },
  queue: [
    { file: "CORE_GL_DUMP_0316.txt", recipe: "Daily Deposit Recon" },
    { file: "check_register_feb.xlsx", recipe: "Monthly AP Check Register" },
  ],
};

export const trioScenario: DddScenario = {
  recipe: "SSS Annual Performance Report",
  sheet: {
    file: "SSS_Roster_AY2425.xlsx",
    rows: [
      ["ACTIVE PARTICIPANT ROSTER"],
      ["Advisor: All", "", "", "", "", "", "", "", "Run: 09/15/25 16:12"],
      blank9,
      ["STU_ID", "", "NAME", "", "STATUS", "ENTRY", "", "GPA", ""],
      ["1203345", "", "MARTINEZ, ANA", "", "Active-New", "Fall 2024", "", "N/A", ""],
      ["1203346", "", "nguyen, tam", "", "active", "FA23", "", "3.2", ""],
      blank9,
      ["Confidential student records", "", "", "", "", "", "", "", "Page 1 of 2"],
      blank9,
      ["STU_ID", "", "NAME", "", "STATUS", "ENTRY", "", "GPA", ""],
      ["1203348", "", "Okafor,Chidi", "", "NEW", "2024 Fall", "", "2.85 ", ""],
    ],
    headerRows: [1, 4, 10],
    selected: { ref: "C5", value: "MARTINEZ, ANA", row: 5, col: 2 },
    tabs: ["Table 1", "Table 2"],
  },
  output: {
    file: "SSS_APR_2024-25_upload.xlsx",
    folder: "OneDrive › TRIO › APR",
    sheet: "Participants",
    header: ["Last Name", "First Name", "Cohort Year", "Participant Status"],
    rows: [
      ["Martinez", "Ana", "26", "1"],
      ["Nguyen", "Tam", "25", "2"],
      ["Okafor", "Chidi", "26", "1"],
    ],
  },
  queue: [{ file: "advising_log_oct.csv", recipe: "Advising Hours Tracker" }],
};
