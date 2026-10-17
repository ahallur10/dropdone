# Real legacy exports for the How It Works page

Research notes, Oct 17 2026. Goal: find real, public "messy export" files from government systems to base the demo on.

## 1. School district check register (real file, in `samples/`)

**Source:** Waxahachie ISD (Texas), monthly check register, May 2025.
https://www.wisd.org/Page/1086 (Texas requires districts to post these in Excel).

**Why it's a great demo:** it's a real report-writer dump, not a dataset someone tidied up. Out of 3,497 rows, only 1,723 are real line items.

What's wrong with it:

- **Two-row header.** Row 1 is `CHECK | CHECK | | COMMENT | INVOICE | ACCOUNT |`, row 2 is `NUMBER | DATE | VENDOR | | DESCRIPTION | NUMBER | AMOUNT`. A column's name is split across both rows.
- **Wrapped text became new rows.** 1,770 rows are just the description wrapping onto the next line, with every other cell blank. Example: `Open PO for repair of musical` / `instruments for WHS band` / `program.`
- **One check, many rows.** 1,188 checks spread over 1,723 line items (one row per account split).
- **Dead column.** `COMMENT` is empty in every row.
- **Packed account code.** `199 E 11 6499 00 110 0 99 200` is the Texas FASRG account code (fund, fiscal year, function, object, sub-object, org, ...) jammed into one space-separated cell.
- **Totals footer.** Last row is `TOTAL: 5228966.890000006`, with float noise and no cents rounding.
- **Truncated sheet name.** `CHECK REGISTER (Dates  05 01 2`, cut off at Excel's 31-character limit, which is a telltale sign of an automated export.
- ALL CAPS vendors, an occasional double space in a name (`A&D TESTS,  INC.`).

The clean target a finance clerk would want: one row per line item, a single header row, description joined back together, account code split into fund / function / object / org, and amounts as currency with no footer.

## 2. City accounts payable checkbook (found, couldn't download)

**Source:** City of Fort Worth, monthly AP check registers, Nov 2024 to Sept 2026.
https://www.fortworthtexas.gov/departments/finance/check-register

File names like `z_ap_checkbook-fy25-vchrlines.xlsx` look like a saved query from an ERP ("Z_" custom query prefix, "voucher lines"). The site blocks scripted downloads, so this needs a manual download in a browser to inspect.

## 3. TRIO APR upload (the target shape is public)

The Dept. of Education's SSS APR is the cleanest "target workbook" story for TRIO:

- Programs upload participant data as **Excel or CSV with exactly 38 fields in a fixed order**, using the exact column names from Section II. The portal rejects files for an incorrect column name, wrong column count, or empty file.
- Fields are coded values, for example field 22 Participant Status (`1` = new participant, `8`/`9` = new, summer session only) and field 21 Cohort Year (`26` = 2024-25 cohort).
- Source: [SSS APR TRIO Web Portal User Guide](https://trio.ed.gov/SSS/doc/SSS_User_Guide_APR.pdf), [SSS APR instructions](https://www.ed.gov/media/document/sss-apr-instructions-2024-108296.pdf).

- The portal has a **Download Data** button that exports last year's submitted file, and lets you update it and re-upload. That file is exactly the "workbook you already cleaned" in Dropdone's story: show it last year's accepted APR file once, and it learns the target.
- The portal flags three kinds of problems: invalid format/values, cross-validation errors (two fields that conflict), and soft-check "Message" warnings.
- Full 38-field list still needed. ed.gov blocks automated downloads, so get the current SSS APR instructions PDF manually.

So the TRIO demo is: messy roster export from Blumen, Banner, or a homegrown Access database → the 38-column APR upload file. We still need a real messy roster; Anshul has firsthand access through the ASU TRIO program.

## 4. Human services caseload (no public row-level files)

Case-level exports (SNAP, HMIS) contain client PII, so none are published. What's public:

- Arizona DES statistical bulletins: PDFs only, county tables grouped by region (des.az.gov blocks scripted downloads).
- HUD HMIS CSV spec: a zip of ~23 CSVs with numeric codes (for example `8` = client doesn't know, `99` = data not collected). Real exports from WellSky, Clarity, or ETO follow it.
- Maricopa HSD moved Senior and Adult Services off a 15+ year homegrown system to Dynamics 365 in fall 2022.

For this segment the demo should use a **realistic mock** based on Anshul's county experience, labeled as a sample.

## General pattern (what every one of these has)

From report-writer forums (Crystal Reports, ActiveReports, Aeries), the same problems show up everywhere: page headers repeated mid-data, merged or split header rows, blank spacer rows and columns, wrapped text becoming extra rows, and subtotal/total rows mixed in with data.
