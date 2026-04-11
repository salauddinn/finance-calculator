---
name: implementation
description: Use when writing production code for any task in the task graph — enforces TDD, security non-negotiables, and coding constitution compliance per story.
version: 1.0.0
---

Write production-quality code following TDD, the coding constitution, and the task graph. One task at a time. No exceptions to the TDD cycle.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.
```

Write code before the test? Delete it. Start over. No exceptions:
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Delete means delete

## The Per-Task Workflow (Workspaces)

For each active ticket:

```
1. Pick a Story: Read `docs/sdlc/stories/` and pick a story that has `status: TO_DO` and whose dependencies are met (check `docs/sdlc/epics/`).
2. Initialize Workspace: Copy `templates/workspace-template.md` to `docs/sdlc/workspaces/workspace-STORY-[ID].md`. Fill in YAML: `story_id`, `agent`, `model`, `branch`, `started_at`.
3. Create feature branch (invoke `git-discipline` skill):
   git checkout main && git pull origin main
   git checkout -b feature/STORY-[ID]-[short-desc]
4. Set State: Update `docs/sdlc/stories/STORY-[ID].md` frontmatter to `status: IN_PROGRESS`.
5. Read any relevant skill (language/platform-specific if available)
6. Write failing test(s) — unit first, integration if needed
7. Run tests — confirm RED (test fails for the right reason)
8. Write minimal implementation to pass tests — NOTHING more
9. Run tests — confirm GREEN (test passes, no regressions)
10. Refactor — apply docs/architecture/coding-standards.md
11. Run full test suite — confirm no regression across all tests
12. Log token usage in workspace YAML: `tokens_input`, `tokens_output`, `stage_tokens`, `elapsed_minutes`, `hitl_count`.
13. Mark `docs/sdlc/stories/STORY-[ID].md` frontmatter to `status: DONE`.
14. If any interface contract changed: update docs/architecture/data-domain.md → triggers HITL
15. Commit the completed story (ONE commit per story):
    git add .
    git commit -m "{type}(STORY-[ID]): [story title]"
16. → Invoke critical-review and code-review (see Transition section below).
17. Cleanup Workspace: Delete your `workspace-STORY-[ID].md` AFTER squash merge to main.
```

> **Git note:** Keep all intermediate work on the feature branch. The single story commit captures the finished, reviewed state. Do NOT delete the workspace until after the story is merged — you may need it if reviews find issues. Invoke `git-discipline` skill if in doubt about any git operation.

## Test Pyramid Targets

Adjust per project NFRs, but defaults:

| Layer | Target | Characteristics |
|---|---|---|
| Unit | 70% of tests | Fast, isolated, no I/O, no external calls |
| Integration | 20% of tests | Real DB/service, no UI layer |
| E2E / acceptance | 10% of tests | Full stack, Given/When/Then from story |

## Security Non-Negotiables (check per story before marking complete)

```
[ ] Every authenticated endpoint verifies token/session before processing
[ ] Every user input is validated and sanitized at the boundary
[ ] No secrets in source code, logs, or error responses
[ ] All external calls have timeouts and error handling
[ ] SQL/NoSQL queries use parameterization — never string concatenation
[ ] Dependencies checked against known vulnerability database
```

## RED — Write Failing Test

Write one minimal test showing what should happen:

- Clear name describing the behavior (not the method)
- Tests the behavior, not the implementation
- Tests real code — mocks only when unavoidable (I/O, time, third-party APIs)
- One behavior per test — "and" in a test name → split it

Run the test. Confirm it **fails for the right reason** (feature missing, not a typo or import error).

**Test passes immediately?** You're testing existing behavior. Fix the test.
**Test throws an error?** Fix the error, re-run until it fails correctly.

## GREEN — Write Minimal Implementation

Write the simplest code that makes the test pass.

- Do not add features the test doesn't require
- Do not refactor other code
- Do not "improve" beyond what the test demands

## REFACTOR — Clean Code

Only after GREEN:
- Remove duplication
- Improve naming for clarity
- Extract helpers where complexity grows
- Apply coding-standards.md standards

Keep all tests green throughout. Do not add new behavior.

## Rollback Rule

If implementation reveals a Stage 3 architectural decision was wrong:

1. **Stop immediately** — do not work around it
2. Write a superseding ADR in `docs/architecture/adrs/` documenting the conflict
3. Trigger HITL (invoke `hitl-protocol` skill)
4. Update `docs/architecture/tech-architecture.md`
5. Only resume implementation after HITL approval

## Common Rationalizations — STOP

| Thought | Reality |
|---|---|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll write tests after to verify it works" | Tests-after pass immediately and prove nothing. |
| "I already manually tested it" | Manual testing has no record, can't re-run, misses edge cases. |
| "Deleting X hours of work is wasteful" | Sunk cost fallacy. Keeping untested code is tech debt. |
| "TDD will slow me down" | TDD is faster than debugging in production. |
| "This is different because..." | If you're rationalizing, you're violating. Delete. Start over. |
| "I'll keep it as reference" | You'll adapt it. That's tests-after. Delete means delete. |

## Completing a Task

Before marking a story `DONE` in `docs/sdlc/stories/`:

```
[ ] Every new function/method has a test that was written first and watched fail
[ ] All tests pass (unit + integration + E2E relevant to this story)
[ ] Security non-negotiables checked
[ ] Coding constitution followed (naming, error handling, logging)
[ ] No TODO comments left in production code
[ ] data-domain.md updated if any contract changed
```

## ⚡ Token Logging (Required)

Agents **must** log token usage into the workspace YAML before marking a story DONE. This powers the project dashboard. Fill in all fields before cleanup:

```yaml
tokens_input: 12400        # Total input tokens consumed this story
tokens_output: 3800        # Total output tokens generated this story
model: claude-sonnet-4.6   # The model used
elapsed_minutes: 47        # Wall-clock minutes for the story
hitl_count: 2              # How many times HITL was triggered
stage_tokens:
  planning: 2100           # Tokens in planning/reading phase
  implementation: 10800    # Tokens writing code
  review: 1300             # Tokens in review/refactor
```

> If your agent platform exposes token counts via API, read them programmatically.
> If not, estimate based on context window usage (e.g. 75% of 200k context = ~150k tokens).

## Gate

Before invoking `critical-review` skill, every item below must be true for the story:

```
[ ] All TDD cycles complete — every function/method has a test written BEFORE its implementation
[ ] All tests pass (unit + integration + E2E relevant to this story) — zero failures
[ ] Security non-negotiables checked against the full checklist above
[ ] Coding constitution followed: naming, error handling, logging
[ ] No TODO comments left in production code
[ ] data-domain.md updated if any interface contract changed (triggers HITL)
[ ] Token usage logged in workspace YAML
[ ] Story status set to DONE in docs/sdlc/stories/STORY-[ID].md
[ ] Story committed on feature branch (git status shows clean working tree)
```

## Transition

After all tasks in a story are complete:
1. → Invoke `critical-review` skill.
2. → Invoke `code-review` skill.
3. → After code-review PASS, squash merge to main (invoke `git-discipline` skill):
   ```
   git checkout main && git pull origin main
   git merge --squash feature/STORY-[ID]-[short-desc]
   git commit -m "feat(STORY-[ID]): [story title]"
   git branch -d feature/STORY-[ID]-[short-desc]
   git push origin main
   ```
