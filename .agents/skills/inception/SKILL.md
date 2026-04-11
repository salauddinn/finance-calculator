---
name: inception
description: Use when starting a new project from scratch with unclear or partially-formed requirements — before any design, architecture, or code is written.
version: 1.0.0
---

Establish shared understanding of what is being built, for whom, and why — before anything else is done.

<HARD-GATE>
Do NOT invoke design-system, tech-architecture, or any implementation skill until you have produced a BRD and the user has approved it. This applies to every project regardless of perceived simplicity.
</HARD-GATE>

## Anti-Pattern: "This Is Too Simple to Need a BRD"

Every project goes through inception. A todo app, a CLI tool, a config change — all of them. The BRD can be short (a few sentences for trivial projects), but you MUST produce it and get user approval before moving on.

## Checklist

Complete in order:

1. **Load domain context** — check for any existing files, docs, or prior context in `docs/sdlc/`
2. **Identify the domain** — what industry, regulatory context, key entities, glossary terms apply?
3. **Ask clarifying questions** — one at a time, across these axes:
   - Business objective and measurable success criteria
   - User personas and their jobs-to-be-done
   - Constraints (timeline, budget, compliance, existing systems)
   - Out-of-scope items (explicit)
   - Non-functional requirements (latency, availability, scale, geography)
4. **Write `docs/architecture/domain-model.md`** — domain knowledge, industry context, glossary
5. **Write `docs/product/features/brd.md`** — using the BRD format below
6. **Self-review the BRD** — check for placeholders, contradictions, missing metrics
7. **Present BRD to user** — ask for explicit approval before proceeding
8. **HITL checkpoint** — required before moving to Stage 2 (invoke `hitl-protocol` skill)
9. **Update Artifact Status** — Once approved, update `docs/product/features/brd.md` status to `Approved`.
10. **Transition** — invoke `design-system` or `tech-architecture` skill (ask user which order)

## Clarifying Questions Protocol

- Ask **one question at a time** — never more
- Prefer **multiple-choice** when options are clear
- Focus on: purpose, constraints, success criteria, who is affected
- If the project scope is very large (multiple independent subsystems), flag it and help decompose into sub-projects before continuing

## BRD Format

Write to `docs/product/features/brd.md`:

```markdown
# Business Requirements Document

> **Status:** Draft | Approved
> **Version:** 0.1.0

## Objective
[One paragraph. What problem does this solve and for whom?]

## Success metrics
[Measurable. e.g. "P95 API latency < 200ms", "checkout conversion > X%"]

## User personas
| Name | Role | Primary goal | Pain point |
|---|---|---|---|

## Functional requirements
- [FR-001] ...
- [FR-002] ...

## Non-functional requirements
- [NFR-001] Availability: 99.9% uptime
- [NFR-002] Security: OWASP Top 10 compliance
- [NFR-003] ...

## Constraints
[Budget, timeline, technology mandates, compliance requirements]

## Out of scope
[Explicit list — if something is NOT being built, say so]

## Open questions
[Unresolved items requiring HITL before proceeding]
```

## Gate

Evaluate before triggering HITL:

```
[ ] Business objective is stated and measurable
[ ] At least 2 user personas defined (or explicitly N/A for internal tools)
[ ] Success metrics are quantified — no vague statements
[ ] NFRs captured (latency, availability, security baseline)
[ ] Out-of-scope is explicit — not empty
[ ] No open questions remain (or HITL scheduled to resolve them)
[ ] domain.md and brd.md are written to docs/sdlc/
```

If any item fails, loop within this stage — do not proceed.

## HITL Checkpoint

After the gate passes, trigger HITL using this format (or invoke `hitl-protocol` skill):

```
HITL REQUIRED
Stage: inception
Question: Does this BRD accurately capture your requirements before we move to design/architecture?
Context: BRD written to docs/product/features/brd.md
Options: [A] Approved — proceed to next stage
         [B] Changes needed — specify what to revise
Default if no response: Wait for explicit approval
```

## Red Flags

| Thought | Reality |
|---|---|
| "The requirements are obvious" | Obvious to you ≠ agreed with the user. Write the BRD. |
| "We'll figure out personas later" | Personas drive every design decision. Define them now. |
| "Success metrics can be vague" | Vague metrics cannot be verified. Make them quantifiable. |
| "Out-of-scope is implicit" | Implicit scope causes scope creep. Write it down explicitly. |
| "This is too small for a full BRD" | A BRD for a small project is 5 lines. Write them. |
