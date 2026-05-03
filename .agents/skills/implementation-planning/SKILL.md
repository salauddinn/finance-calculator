---
name: implementation-planning
description: Use when you have approved architecture and need to create a machine-readable execution plan before implementation begins.
version: 1.0.0
---

Produce a concrete execution plan that deconstructs the architecture into milestones, defines interface contracts before parallel work begins, identifies risks, and establishes a clear definition of done.

<HARD-GATE>
Do NOT begin implementation (Stage 6) until this plan is approved. All inter-module interface contracts must be locked in this stage — not discovered during implementation.
</HARD-GATE>

## Checklist

1. **Read inputs**: `docs/product/features/brd.md`, `docs/architecture/tech-architecture.md`, `docs/architecture/coding-standards.md`
2. **Define milestones** — logical groupings of work with clear exit criteria
3. **Define interface contracts** — every module boundary documented before any code
4. **Write risk log** — likelihood × impact for each identified risk
5. **Write definition of done** — project-level checklist
6. **Write `docs/sdlc/epics/implementation-plan.md`** — using format below
7. **Write `docs/architecture/data-domain.md`** — API contracts, event schemas, type defs
8. **Self-review** — check all FRs from BRD are traceable to a milestone
9. **Present to user** — get approval
10. **Transition** — invoke `story-breakdown` skill

## Implementation Plan Format

`docs/sdlc/epics/implementation-plan.md`:

```markdown
# Implementation plan

> **Status:** Draft | Approved
> **Version:** 0.1.0

## Milestones
| ID | Name | Description | Exit criteria | Depends on |
|---|---|---|---|---|
| M1 | Foundation | Project scaffold, CI, auth | All tests green, deploy to staging | — |
| M2 | Core features | FR-001 through FR-005 | Acceptance tests pass | M1 |
| M3 | Polish & NFRs | Performance, accessibility | NFR targets met | M2 |

## Interface contracts summary
[See docs/architecture/data-domain.md for full specs]

Key boundaries:
- [Module A] → [Module B]: [Brief contract description]
- [Frontend] → [API]: REST endpoints defined in data-domain.md

## Risk log
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Third-party API unavailable | M | H | Mock in tests; fallback strategy documented |
| Performance targets missed | L | H | Load test at M2 gate; optimize before M3 |

## Assumptions
- [List explicit assumptions. If any is wrong, trigger HITL before continuing.]

## Definition of done (project level)
- [ ] All FRs implemented and verified with passing tests
- [ ] All NFRs verified with evidence (benchmarks, audit reports)
- [ ] Test pyramid targets met (see coding-standards.md)
- [ ] Security checklist passed
- [ ] Documentation complete (README, API docs, ADRs up to date)
- [ ] No P0/P1 open bugs
- [ ] Deployed to production (or staging, if production deploy is out of scope)
```

## Interface Contracts Format

`docs/architecture/data-domain.md`:

```markdown
# Interface contracts

> **Status:** Draft | Approved
> **Version:** 0.1.0

## REST endpoints
### POST /api/users
**Request:**
```json
{ "email": "string", "password": "string" }
```
**Response 201:**
```json
{ "id": "uuid", "email": "string", "createdAt": "ISO8601" }
```
**Errors:** 400 (validation), 409 (email exists), 500

## Event schemas
### user.created
```json
{ "userId": "uuid", "email": "string", "timestamp": "ISO8601" }
```

## Shared types / interfaces
[TypeScript interfaces, Zod schemas, or language-equivalent type definitions]
```

## Gate

```
[ ] All milestones have explicit, verifiable exit criteria
[ ] Every FR from brd.md is traceable to at least one milestone
[ ] All inter-module interface contracts defined before story-breakdown begins
[ ] Risk log populated with at least the top 3 risks
[ ] Assumptions explicitly listed
[ ] Definition of done agreed with user
[ ] implementation-plan.md and data-domain.md written to docs/sdlc/
```

## Red Flags

| Thought | Reality |
|---|---|
| "Interface contracts can be defined as we go" | Parallel work requires contracts upfront. Define them now. |
| "The milestones are obvious" | Undocumented milestones have no exit criteria. Write them. |
| "We don't have enough risks to list" | There are always risks. Forcing 3 makes you think harder. |
| "Definition of done is too detailed" | Detailed DoD prevents "it's done... mostly" shipping. |
