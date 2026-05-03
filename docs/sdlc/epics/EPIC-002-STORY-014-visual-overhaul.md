# Epic: STORY-014 — Full Visual Overhaul — Midnight Ocean Glassmorphism

## Task Dependency Graph

```
STORY-014a (Design token replacement & Inter font)
  ├── STORY-014b (Glass navbar & theme system)       ← depends on 014a
  │     └── STORY-014c (Homepage restructure)        ← depends on 014a, 014b
  ├── STORY-014d (Primitive component glass styling)  ← depends on 014a
  │     └── STORY-014e (Calculator page glass panels) ← depends on 014a, 014d
  └── STORY-014f (Accessibility, motion & fallbacks)  ← depends on 014a–014e
        └── STORY-014g (Regression verification & E2E fix) ← depends on 014a–014f
```

## Parallel Tracks

- **Track A:** STORY-014a → STORY-014b → STORY-014c (tokens → navbar → homepage)
- **Track B:** STORY-014d → STORY-014e (primitives → calculator pages)
- **Track C:** STORY-014f → STORY-014g (accessibility → regression)

After STORY-014a completes, Track A and Track B can run **in parallel**.
Track C begins only after both Track A and Track B are complete.

## Parallel Track Rules

- **Track A** owns: `src/app/layout.tsx`, `src/app/page.tsx`, `src/components/layout/navbar.tsx` (new), `src/components/layout/theme-toggle.tsx`, `src/components/layout/calculator-category-card.tsx`, `src/features/preferences/theme/theme-provider.tsx`
- **Track B** owns: `src/app/calculators/[slug]/page.tsx`, `src/styles/globals.css` (primitive + calculator CSS sections)
- **Track C** owns: `e2e/app-smoke.spec.ts`, `src/styles/globals.css` (fallback + motion blocks only)
- **Shared file:** `src/styles/globals.css` is touched by all tracks. Track A writes token `:root` block, navbar CSS, and homepage CSS. Track B writes primitive and calculator CSS. Track C writes `@supports` fallbacks and `@media (prefers-reduced-motion)`. Sections are non-overlapping.
- **Merge strategy:** Feature branch per story, squash merge to main. Sequential within a track — no concurrent edits to the same CSS section.

## Execution Order (sequential single-agent)

Since this is a visual overhaul best done sequentially to maintain CSS coherence:

1. STORY-014a — tokens & font (foundation for everything)
2. STORY-014b — navbar & theme toggle
3. STORY-014d — primitive glass styling (can swap order with 014b)
4. STORY-014c — homepage restructure
5. STORY-014e — calculator page layout
6. STORY-014f — accessibility & fallbacks
7. STORY-014g — regression & E2E

## Story Summary

| Story | Milestone | Track | Depends on | ~Lines changed |
|---|---|---|---|---|
| STORY-014a | M1 | A | — | ~200 (CSS tokens + layout font) |
| STORY-014b | M2 | A | 014a | ~150 (new navbar + toggle update) |
| STORY-014c | M3 | A | 014a, 014b | ~200 (homepage rewrite + card update) |
| STORY-014d | M4 | B | 014a | ~150 (CSS primitive rules) |
| STORY-014e | M5 | B | 014a, 014d | ~100 (calculator page layout CSS) |
| STORY-014f | M6 | C | 014a–014e | ~80 (fallback blocks + audit) |
| STORY-014g | M7 | C | 014a–014f | ~20 (E2E selector fix + verification) |

## HITL Checkpoints

- **Before STORY-014a starts:** None — tokens are fully specified in the approved design system and tech plan.
- **After STORY-014c completes:** Visual review of homepage against mockup (recommended, not mandatory).
- **After STORY-014g completes:** Final visual review before marking STORY-014 as done.

## Gate

- [x] Every story has Given/When/Then acceptance criteria
- [x] Every STORY-014 acceptance criterion is covered by at least one sub-story
- [x] DAG is acyclic — no circular dependencies
- [x] All parallel tracks have exclusive file ownership or explicit merge strategy
- [x] All interface contracts locked — no contract changes in this story
- [x] No story > ~400 lines net new code
- [x] HITL checkpoint tasks marked
- [x] EPIC and STORY-014*.md files written to docs/sdlc/
