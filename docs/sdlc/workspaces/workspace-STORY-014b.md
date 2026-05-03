---
story_id: STORY-014b
agent: codex
model: gpt-5
branch: main
started_at: 2026-04-09 18:20:00 IST
tokens_input: 0
tokens_output: 0
elapsed_minutes: 0
hitl_count: 0
stage_tokens:
  planning: 0
  implementation: 0
  review: 0
---

# Workspace — STORY-014b

## Goal

Introduce the new glass navbar shell, move theme controls into it, and switch the default preference to dark without changing persistence contracts.

## Notes

- TDD sequence starts with a failing navbar/layout test and a failing default-theme test.
- Owned files for this story: `src/components/layout/navbar.tsx`, `src/components/layout/theme-toggle.tsx`, `src/features/preferences/theme/theme-provider.tsx`, `src/app/layout.tsx`, `src/styles/globals.css`.
- Verification target: focused tests, full `npm test`.
