---
name: brownfield-brainstorm
description: Use when understanding the business impact and user impact of a story or feature request in an existing system — before any technical planning or implementation.
version: 1.0.0
---

Understand the business and user impact of this story in isolation before planning how to implement it. Small stories have large blast radii. Understand the blast radius first.

## When to Use

- A story or feature request arrives for an existing system
- After `context-harvest` has been completed (existing-system.md exists)
- Before `brownfield-tech-plan` begins

## Checklist

1. **Read `docs/architecture/existing-system.md`** — understand the system context
2. **Ask clarifying questions** (one at a time):
   - What user job-to-be-done does this story serve?
   - What is the measurable business outcome? (conversion, retention, error rate reduction)
   - Who is affected — which user personas, which upstream/downstream systems?
   - Are there dependencies on other in-flight stories or parallel work?
   - Is there a deadline or regulatory driver?
3. **Write acceptance criteria** in Given/When/Then format
4. **Write definition of done** for this story specifically
5. **Identify scope risks** — what could expand this story's scope unintentionally?
6. **Check existing behavior** — does anything like this already exist? Can we extend it?
7. **Document in `docs/product/features/brd.md`** (append a story section) — using format below
8. **Transition** — invoke `brownfield-design` (if UI changes) or `brownfield-tech-plan`

## Questions Protocol

- One question at a time
- Focus: purpose, who is affected, how success is measured
- If the story has multiple independent sub-problems, flag decomposition before going deeper

## Story BRD Format

Append to `docs/product/features/brd.md` (or create if brownfield project):

```markdown
## Story: [STORY-ID] — [Title] — [Date]

### User job-to-be-done
[What is the user trying to accomplish? In their words, not system terms.]

### Business outcome
[Measurable: "reduce support tickets by X%", "increase conversion by Y%", "eliminate manual step Z"]

### User personas affected
[Which personas from the system context? New personas if this story introduces them?]

### Acceptance criteria
- Given [context]
- When [action]
- Then [outcome]

### Definition of done (story level)
- [ ] Acceptance criteria verified with passing tests
- [ ] Regression tests still passing
- [ ] Coverage not decreased from baseline
- [ ] No new tech debt introduced (or explicitly logged)

### Dependencies
[Other in-flight stories? Shared systems? External APIs?]

### Scope risks
[What could creep into this story? What is explicitly out of scope?]

### Existing behavior check
[Does a similar capability already exist? URL / method / component name if so.]
```

## Red Flags

| Thought | Reality |
|---|---|
| "The story is self-explanatory" | Self-explanatory to the requester ≠ clear to the implementer. Write it down. |
| "Success metrics aren't needed for a small story" | If you can't measure success, you can't verify done. Define them. |
| "Scope risks are obvious" | Write them down. Unwritten risks become scope creep. |
| "We're extending existing behavior — no need to check" | Check first. Extending the wrong thing is worse than building new. |
