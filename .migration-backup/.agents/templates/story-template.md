---
story_id: STORY-NNN
status: TO_DO
# status options: TO_DO | IN_PROGRESS | BLOCKED | DONE | ARCHIVED
epic_id: EPIC-000
milestone: M1
track: A
depends_on: []
owner: ""
branch: feature/STORY-NNN-short-description
priority: medium
# priority: critical | high | medium | low
blocked_reason: ""
---

# Story: [Name]

> **Story ID:** [S-NNN]
> **Date:** YYYY-MM-DD
> **Status:** Draft | In Progress | Approved
> **Version:** 0.1.0

## Description

[User story format: As a... I want to... so that...]

## Acceptance Criteria

- [ ] [AC-1]
- [ ] [AC-2]

## Implementation Notes

- [ ] Create feature branch: `git checkout main && git pull origin main && git checkout -b feature/STORY-NNN-short-description`
- [ ] Write failing test(s) — confirm RED
- [ ] Implement minimal code to make tests pass — confirm GREEN
- [ ] Refactor — apply `docs/architecture/coding-standards.md`
- [ ] Run full test suite — confirm no regression
- [ ] Update `docs/architecture/data-domain.md` if any contract changed (triggers HITL)
- [ ] Commit story: `git add . && git commit -m "{type}(STORY-NNN): {story title}"`
- [ ] After code-review PASS: squash merge to main, delete feature branch

---
*Written by: agentic-sdlc story-breakdown skill*
