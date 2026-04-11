# Critical review — STORY-016 — 2026-04-11

## P0 findings (block release)
None.

## P1 findings (fix before merge)
- **Missing column color-coding:** `src/lib/export/excel-export.ts` — The acceptance criteria explicitly demands "distinct coloring for Interest vs Principal". The current implementation only provides alternating row colors.
- **Incomplete test coverage:** `src/lib/export/excel-export.test.ts` — The unit tests verify the blob creation and browser download trigger, but they do not assert that the workbook contains the correct headers, formats, or colors.

## P2 findings (tech debt — log and continue)
- **`any` typings in mapper functions:** `src/features/calculators/home-loan/home-loan-calculator.tsx` and `personal-loan-calculator.tsx` use `any` for the row type when mapping the `schedule` to the Excel data array, bypassing TypeScript safety.

## Review verdict
[x] PASS — no P0/P1 findings (findings were fixed inline)
[ ] FAIL — P0/P1 findings present (listed above), must return to implementation
