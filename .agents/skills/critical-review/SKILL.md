---
name: critical-review
description: Use when implementation of a story or milestone is complete and needs adversarial quality review before testing begins. This stage is intentionally adversarial — find problems, do not confirm success.
version: 1.0.0
---

Evaluate the completed implementation with fresh eyes. Your job is to find problems, not to confirm everything is fine.

<EXTREMELY-IMPORTANT>
This is an adversarial review. Optimism bias will cause you to miss real problems. Actively search for issues. Treat every "looks good" instinct with suspicion.
</EXTREMELY-IMPORTANT>

## Inputs

Read before starting:
- `docs/product/features/brd.md` — original requirements
- `docs/sdlc/epics/task-graph.md` — accepted stories and acceptance criteria
- `docs/architecture/data-domain.md` — locked contracts
- `docs/architecture/coding-standards.md` — standards
- Full codebase — read actual code, do not rely on summary

## Review Checklist

Run against every story in the completed implementation:

### Requirements Coverage
```
[ ] Every FR from brd.md has at least one passing test that validates it
[ ] Every Given/When/Then acceptance criterion in the story is verifiable in the code
[ ] No FR is partially implemented — "works in the happy path" is not "implemented"
[ ] No feature was built that is NOT in the task graph (over-engineering check)
```

### Code Quality
```
[ ] No God classes — single-responsibility principle applied
[ ] No deep nesting (> 3 levels) without explicit justification
[ ] No function > 20 lines without justification
[ ] All error paths handled — not just happy path
[ ] No TODO or FIXME comments in production code
[ ] Logging present at appropriate levels (request in/out, errors, key state changes)
[ ] No magic numbers — constants named and documented
```

### Security
```
[ ] Auth check on every protected endpoint — verify by reading the code, not trusting the story
[ ] Input validation present and tested — do not assume; find the validation code
[ ] No sensitive data in logs or error responses (tokens, passwords, PII)
[ ] No secrets in source code
[ ] SQL/NoSQL queries parameterized — find the query code and verify
```

### Integration
```
[ ] All interface contracts still match implementation — compare contracts to actual code
[ ] No breaking changes introduced to existing consumers
[ ] External calls have timeouts and error handling
```

## Finding Classification

Classify every finding as:

| Priority | Meaning | Action |
|---|---|---|
| **P0** | Blocks release — security vulnerability, data loss risk, broken core flow | Must fix before Stage 8. Loop back to implementation. |
| **P1** | Must fix before merge — incorrect behavior, missing acceptance criterion, broken contract | Must fix before Stage 8. Loop back to implementation. |
| **P2** | Tech debt — code smell, missing logging, test coverage gap, naming issue | Log in `retrospective.md`. Do not block Stage 8. |

## Output

Write findings to `docs/sdlc/retrospectives/critical-review.md`:

```markdown
# Critical review — [Story/Milestone] — [Date]

## P0 findings (block release)
- [Finding]: [Location in code] — [Why it's P0]

## P1 findings (fix before merge)
- [Finding]: [Location in code] — [Why it's P1]

## P2 findings (tech debt — log and continue)
- [Finding]: [Location in code] — [Log in retrospective]

## Review verdict
[ ] PASS — no P0/P1 findings
[ ] FAIL — P0/P1 findings present (listed above), must return to implementation
```

## Loop Rule

- **P0 or P1 findings present**: return to `implementation` skill, fix, and re-run this review
- **Only P2 findings**: proceed to `testing` skill
- **No findings**: proceed to `testing` skill

## Gate

```
[ ] All checklist sections completed against actual code (not summaries)
[ ] Every finding classified as P0, P1, or P2
[ ] critical-review.md written to docs/sdlc/retrospectives/
[ ] Verdict recorded: PASS (no P0/P1) or FAIL (P0/P1 present)
[ ] If FAIL: implementation skill invoked to fix before re-running this review
```

Only proceed to `testing` skill when verdict is PASS (all P0 and P1 findings resolved).

## Red Flags

| Thought | Reality |
|---|---|
| "The tests pass, so it's fine" | Tests can be wrong. Green tests ≠ correct behavior. Read the code. |
| "I trust the implementation" | Trust is not a review technique. Read the code. |
| "P1 findings can wait" | P1 means fix before merge. That means now. |
| "This is good enough" | "Good enough" is how P0 bugs ship to production. |
| "The developer covered everything" | The developer is optimism-biased. You are the adversarial check. |
