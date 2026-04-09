# STORY-014 Progress — Midnight Ocean Visual Overhaul

> **Last updated:** 2026-04-09

## Completed Stages

| Stage | Status | Artifact |
|---|---|---|
| Brownfield brainstorm | ✅ Done | `docs/sdlc/workspaces/tech-plan-STORY-014.md` |
| Brownfield design | ✅ Done | `docs/product/design-system.md` (Story delta — STORY-014) |
| Brownfield tech plan | ✅ Done | `docs/sdlc/workspaces/tech-plan-STORY-014.md` |
| Implementation planning | ✅ Done | `docs/sdlc/epics/implementation-plan-STORY-014.md` |
| Story breakdown | ✅ Done | `docs/sdlc/epics/EPIC-002-STORY-014-visual-overhaul.md` |

## Remaining Stages

| Stage | Status |
|---|---|
| Implementation | ◐ In progress |
| Critical review | ⬚ Not started |
| Testing | ⬚ Not started |
| Code review | ⬚ Not started |
| Retrospective | ⬚ Not started |

## Story Progress

| Story | Name | Track | Status | Depends on |
|---|---|---|---|---|
| STORY-014a | Tokens & Inter font | A | ✅ DONE | — |
| STORY-014b | Glass navbar & theme | A | ◐ IN_PROGRESS | 014a |
| STORY-014c | Homepage restructure | A | ⬚ TO_DO | 014a, 014b |
| STORY-014d | Primitive glass styling | B | ⬚ TO_DO | 014a |
| STORY-014e | Calculator glass panels | B | ⬚ TO_DO | 014a, 014d |
| STORY-014f | Accessibility & fallbacks | C | ⬚ TO_DO | 014a–014e |
| STORY-014g | Regression & E2E | C | ⬚ TO_DO | 014a–014f |

## Execution Order

```
014a → 014b → 014d → 014c → 014e → 014f → 014g
```

## Key Files

| File | Stories touching it |
|---|---|
| `src/styles/globals.css` | 014a, 014b, 014c, 014d, 014e, 014f |
| `src/app/layout.tsx` | 014a, 014b |
| `src/app/page.tsx` | 014c |
| `src/components/layout/navbar.tsx` | 014b (new) |
| `src/components/layout/theme-toggle.tsx` | 014b |
| `src/components/layout/calculator-category-card.tsx` | 014c |
| `src/app/calculators/[slug]/page.tsx` | 014e |
| `e2e/app-smoke.spec.ts` | 014g |

## Constraints

- No calculator formula or persistence contract changes
- No new npm dependencies
- All existing tests must stay green
- `backdrop-filter` must degrade gracefully
- `prefers-reduced-motion` must disable animations
- Dark theme is primary — remove light/dark split
