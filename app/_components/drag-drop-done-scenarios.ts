// Content for the Drag, Drop, Done animation. Each segment page (genpages later) can pass its own.
// All names, IDs and numbers are made up.

export type DddScenario = {
  /** The messy report as it comes out of the legacy system. */
  pdf: {
    file: string;
    org: string;
    title: string;
    runLine: string;
    header: string[];
    groups: { label: string; rows: string[][]; subtotal: string }[];
    footer: string;
  };
  /** The workbook Dropdone updates. */
  output: {
    file: string;
    folder: string;
    sheet: string;
    header: string[];
    rows: string[][];
  };
  /** Other files already sitting in the queue, for realism. */
  queue: { file: string; workbook: string }[];
};

export const countyScenario: DddScenario = {
  pdf: {
    file: "CASE_ACTIVITY_1016.pdf",
    org: "COUNTY HUMAN SERVICES DEPT",
    title: "CASE ACTIVITY REPORT - WEEKLY",
    runLine: "Run: 10/16/2026 07:02   User: SVC_BATCH   Page 1 of 4",
    header: ["CASE_ID", "CLIENT NM", "OPEN_DT", "WORKER"],
    groups: [
      {
        label: "PROGRAM: SNAP",
        rows: [
          ["  00412", "SMITH, JOHN", "10/3/26", "r.alvarez"],
          ["00413", "garcia, maria", "2026-10-04", "R.ALVAREZ"],
          ["00416", "Patel, Ravi", "10/07/2026", "K.Nguyen"],
        ],
        subtotal: "TOTAL SNAP CASES:      3",
      },
      {
        label: "PROGRAM: LIHEAP",
        rows: [
          ["00415", "LEE,  DANA", "Oct 6 2026", "k.nguyen"],
          ["00419", "Begay, Tom", "10/9/26", "m.ortiz"],
        ],
        subtotal: "TOTAL LIHEAP CASES:    2",
      },
    ],
    footer: "*** CONFIDENTIAL - FOR INTERNAL USE ONLY ***",
  },
  output: {
    file: "Weekly Caseload.xlsx",
    folder: "HSD-Share › Reports › 2026",
    sheet: "Caseload",
    header: ["Case ID", "Client", "Opened", "Program", "Caseworker"],
    rows: [
      ["412", "John Smith", "10/03/2026", "SNAP", "R. Alvarez"],
      ["413", "Maria Garcia", "10/04/2026", "SNAP", "R. Alvarez"],
      ["415", "Dana Lee", "10/06/2026", "LIHEAP", "K. Nguyen"],
      ["416", "Ravi Patel", "10/07/2026", "SNAP", "K. Nguyen"],
      ["419", "Tom Begay", "10/09/2026", "LIHEAP", "M. Ortiz"],
    ],
  },
  queue: [
    { file: "INV_COUNT_W42.csv", workbook: "Inventory Weekly.xlsx" },
    { file: "check_register_sept_26.xlsx", workbook: "Board Packet – AP Detail.xlsx" },
  ],
};

export const trioScenario: DddScenario = {
  pdf: {
    file: "SSS_Roster_AY2425.pdf",
    org: "TRIO STUDENT SUPPORT SERVICES",
    title: "ACTIVE PARTICIPANT ROSTER",
    runLine: "Run: 09/15/2025 4:12 PM   Page 1 of 4",
    header: ["STUDENT ID", "NAME", "ENTRY", "STATUS"],
    groups: [
      {
        label: "ADVISOR: LOPEZ, M.",
        rows: [
          ["1203345", "MARTINEZ, ANA", "Fall 2024", "Active-New"],
          ["1203346", "nguyen, tam", "FA23", "active"],
        ],
        subtotal: "Count: 2",
      },
      {
        label: "ADVISOR: OKAFOR, J",
        rows: [
          ["1203348", "Okafor,Chidi", "2024 Fall", "NEW"],
          ["1203351", "Begay, Shandiin R.", "FA23", "Continuing"],
        ],
        subtotal: "Count: 2",
      },
    ],
    footer: "CONFIDENTIAL STUDENT RECORDS - FERPA",
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
      ["Begay", "Shandiin", "25", "2"],
    ],
  },
  queue: [
    { file: "advising_log_oct.csv", workbook: "Advising Hours Tracker.xlsx" },
    { file: "fafsa_status_1015.xlsx", workbook: "Aid Follow-up.xlsx" },
  ],
};
