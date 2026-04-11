---
story_id: STORY-000
status: TO_DO
# status options: TO_DO | IN_PROGRESS | BLOCKED | DONE
agent: ""
model: ""
started_at: ""
completed_at: ""
elapsed_minutes: 0
hitl_count: 0
tokens_input: 0
tokens_output: 0
stage_tokens:
  planning: 0
  implementation: 0
  review: 0
blocked_reason: ""
git_branch: ""
git_commit_sha: ""
git_merge_status: pending
# git_merge_status options: pending | merged | conflict
---

# Workspace: STORY-000

> **Instructions for agent:** Fill in the YAML frontmatter above as you work.
> Log token estimates after each stage. Update `status` as you progress.
> Delete this file only AFTER the story is squash merged to main (see `git-discipline` skill). Do NOT delete before code-review.

## Context

> **Task:** [Reason for workspace]
> **Date:** YYYY-MM-DD
> **Status:** Active | Archived
> **Version:** 0.1.0

## Active Context

[Current focused work area]

## Relevant Files

- [File 1]

## Key Constraints

- [Constraint 1]

## Acceptance Criteria
_(Copy from `docs/sdlc/stories/STORY-000.md`)_

- Given
- When
- Then

## Tasks
- [ ] Create feature branch: `git checkout main && git pull origin main && git checkout -b feature/STORY-000-short-desc`
- [ ] Write failing test(s) — confirm RED
- [ ] Implement to make tests pass — confirm GREEN
- [ ] Refactor — apply coding standards
- [ ] Run full test suite — confirm no regression
- [ ] Security checklist
- [ ] Update `docs/architecture/data-domain.md` if interfaces changed (triggers HITL)
- [ ] Commit story: `git add . && git commit -m "{type}(STORY-000): story title"`
- [ ] After code-review PASS: squash merge to main and delete branch

## Notes / Blockers
_(Use this section for real-time notes during implementation. Record blocker details here and update `blocked_reason` in YAML.)_

---
*Written by: agentic-sdlc implementation skill*
