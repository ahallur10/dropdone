// Sample content for the How it works page, straight from HOW-IT-WORKS.md.
// One example everywhere: the "Weekly Client Services Report". All names are made up.

export const reportName = "Weekly Client Services Report";
export const exportFile = "Client_Services_0302.xlsx";
export const nextExportFile = "Client_Services_0309.xlsx";
export const workbookFile = "Client Services.xlsx";

/* A2. The messy export: a legacy PDF converted to Excel (rows 1 to 15, columns A to I). */
const blank = ["", "", "", "", "", "", "", "", ""];
export const messyRows: string[][] = [
  ["CLIENT SERVICES REPORT"],
  ["Program: All Sites", "", "", "", "", "", "", "", "Run date: 03/09/26 08:14"],
  blank,
  ["CLNT_ID", "", "CLNT_NM", "", "STAT", "SVC_DT", "", "AMT", ""],
  ["10482", "", "  Smith, JOHN ", "", "Active", "03-02-26", "", "$1,200.00", ""],
  ["10483", "", "garcia, maria", "", "Withdrawn", "03-02-26", "", "", ""],
  ["10484", "", "LEE, DAVID ", "", "Active", "03-03-26", "", "$300.00", ""],
  blank,
  ["Confidential: contains client information", "", "", "", "", "", "", "", "Page 1 of 2"],
  blank,
  ["CLNT_ID", "", "CLNT_NM", "", "STAT", "SVC_DT", "", "AMT", ""],
  ["10485", "", "Patel, ANITA", "", "Withdrawn", "03-04-26", "", "", ""],
  ["10486", "", "nguyen, tom", "", "Active", "03-05-26", "", "$450.00", ""],
  blank,
  ["Confidential: contains client information", "", "", "", "", "", "", "", "Page 2 of 2"],
];
export const messyHeaderRows = [4, 11];

/* B. The cleaned version, made by hand. */
export const cleanHeader = ["Client ID", "Client Name", "Status", "Service Date", "Amount"];
export const cleanRows = [
  ["10482", "John Smith", "Active", "2026-03-02", "1200"],
  ["10484", "David Lee", "Active", "2026-03-03", "300"],
  ["10486", "Tom Nguyen", "Active", "2026-03-05", "450"],
];

/* C. The steps Dropdone writes. */
export const steps = [
  'Remove everything above the row that starts with "CLNT_ID"',
  "Remove empty columns",
  'Remove "Page _ of _" lines, "Confidential" lines, and repeated header rows',
  "Rename columns: CLNT_ID to Client ID, CLNT_NM to Client Name, STAT to Status, SVC_DT to Service Date, AMT to Amount",
  "Trim extra spaces and change Client Name to First Last, in title case",
  "Format Service Date as YYYY-MM-DD",
  "Turn Amount into a plain number",
  "Remove rows where Status is Withdrawn",
];

/* D. The question, attached to step 8. */
export const question = {
  stepIndex: 7,
  intro: "You removed 2 rows. Both say Withdrawn, and both have a blank Amount.",
  ask: "Next week, should Dropdone remove a row like this?",
  row: ["10491", "Rosa Diaz", "Active", "2026-03-10", "(blank)"],
  options: ["Yes", "No", "Not sure"] as const,
  // What step 8 becomes after each answer.
  result: {
    Yes: "Remove rows where Status is Withdrawn or Amount is blank",
    No: "Remove rows where Status is Withdrawn",
    "Not sure": "Remove rows where Status is Withdrawn, and flag rows with a blank Amount for you",
  },
};

/* E. Next week's run summary. */
export const summary = {
  duration: "4 seconds",
  rowsIn: 210,
  rowsOut: 205,
  lines: [
    "Removed 3 junk rows at the top",
    "Removed 3 empty columns",
    "Removed 8 page breaks and repeated headers",
    "Renamed 5 columns",
    "Cleaned 210 names, formatted 210 dates, converted 210 amounts",
    "Removed 5 rows where Status is Withdrawn (last week: 2)",
  ],
  checked: "Checked against your workbook: columns, order, and value types match.",
  saved: "Updated Client Services.xlsx, Data sheet. Your Summary tab updated too.",
};

/* F. The warning, when something's off. */
export const warning = {
  title: "Removed 41 rows where Status is Withdrawn. Usually about 4.",
  body: "Take a look before Dropdone saves.",
};

/* The context file Dropdone saves with the cleanup at setup. Weekly runs use it to find things
   by what they are, not where they were; when something doesn't fit, it's what Dropdone checks
   before stopping to ask. */
export const contextFile = {
  name: "Weekly Client Services Report · context",
  entries: [
    { field: "Client ID", detail: "A 5-digit client number. Its header row starts with CLNT_ID, wherever that row lands." },
    { field: "Client Name", detail: "A person's name, exported as Last, First with stray spaces." },
    { field: "Status", detail: "Active or Withdrawn. Withdrawn clients are left out of your report." },
    { field: "Amount", detail: "Dollars stored as text. Blank for withdrawn clients." },
    { field: "Print clutter", detail: "Page _ of _, Confidential lines and repeated headers come from the PDF." },
  ],
  contrast: "A macro remembers row 14. Dropdone remembers what a client ID looks like.",
};
