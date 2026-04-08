---
name: tech-architecture
description: Use when making technology stack or architecture decisions for a project — before any code is written. Also use when a major architectural decision must be made mid-project.
version: 1.0.0
---

Produce a defensible, documented technical architecture before any code is written. Every significant decision gets an ADR. No silent choices.

<HARD-GATE>
Do NOT write any production code until tech-architecture.md, at least one ADR per major decision, and coding-constitution.md are written and the user has approved them via HITL.
</HARD-GATE>

## Checklist

1. **Read inputs**: `docs/product/features/brd.md`, `docs/product/design-system.md` (if exists)
2. **Tech stack selection** — evaluate options against NFRs, constraints, ecosystem maturity
3. **Write ADRs** — one file per major decision in `docs/architecture/adrs/`
4. **System context diagram** — C4 Level 1 (what the system is, who uses it, what it integrates with)
5. **Container diagram** — C4 Level 2 (major deployable units)
6. **Sequence diagrams** — 2-3 most critical flows
7. **Directory structure** — canonical directory tree in markdown
8. **Write coding constitution** — invoke `skills/coding-constitution/SKILL.md`
9. **Write `docs/architecture/tech-architecture.md`** — using format below
10. **Self-review** — check all ADR decisions are reflected in architecture, no gaps
11. **Present to user** — section by section
12. **HITL checkpoint** — required before any code is written
13. **Transition** — invoke `implementation-planning` skill

## ADR Format

Each decision gets its own file: `docs/architecture/adrs/ADR-NNN-<title>.md`

```markdown
# ADR-NNN: [Decision title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Superseded

## Context
[Why does this decision need to be made?]

## Decision
[What was decided?]

## Rationale
[Why this option over alternatives?]

## Alternatives considered
[What else was evaluated and why rejected?]

## Consequences
[Trade-offs, risks, follow-up actions]
```

**Decisions that always require an ADR:**
- Programming language selection
- Framework selection (frontend, backend, testing)
- Database technology
- Authentication strategy
- Deployment platform
- Caching strategy (if applicable)
- Event/messaging system (if applicable)

## Architecture Document Format

`docs/architecture/tech-architecture.md`:

```markdown
# Technical Architecture

## System context (C4 Level 1)
[Mermaid diagram — actors, system boundary, external integrations]

## Container diagram (C4 Level 2)
[Mermaid diagram — services, databases, frontends, message queues]

## Key sequence diagrams
### [Flow 1: e.g. User authentication]
[Mermaid sequence diagram]

### [Flow 2: e.g. Core business transaction]
[Mermaid sequence diagram]

## Directory structure
[Canonical directory tree — every top-level dir explained]

## ADR summary
| ADR | Decision | Status |
|---|---|---|
| ADR-001 | [title] | Accepted |

## Security approach
- Auth strategy: [e.g. JWT with refresh tokens]
- Secrets management: [e.g. environment variables, no hardcoding]
- Input validation: [e.g. Zod at API boundary]
- Dependency scanning: [e.g. npm audit in CI]
```

## Gate

Read `skills/stage-gates/SKILL.md` and evaluate:

```
[ ] Tech stack justified via ADRs for each major component
[ ] At least one ADR per: language, framework, database, auth strategy
[ ] System context diagram present (C4 Level 1)
[ ] Container diagram present (C4 Level 2)
[ ] At least 2 sequence diagrams for the most critical flows
[ ] Directory structure defined and documented
[ ] Coding constitution written (see skills/coding-constitution/SKILL.md)
[ ] Security approach documented
[ ] All artifacts written to docs/sdlc/
[ ] User has reviewed and approved via HITL
```

## HITL Checkpoint

```
HITL REQUIRED
Stage: tech-architecture
Question: Does this architecture document and set of ADRs represent the right technical approach before we begin implementation?
Context: Architecture at docs/architecture/tech-architecture.md, ADRs at docs/architecture/adrs/
Options: [A] Approved — proceed to implementation planning
         [B] Changes needed — specify which decisions to revisit
Default if no response: Wait for explicit approval
```

## Rollback Rule

If, during implementation, a Stage 3 architectural decision proves incorrect:
1. Stop implementation
2. Write a superseding ADR documenting the conflict and the new decision
3. Trigger HITL before continuing
4. Update `docs/architecture/tech-architecture.md` to reflect the change

## Red Flags

| Thought | Reality |
|---|---|
| "We'll figure out the architecture as we go" | Emergent architecture = inconsistent patterns + expensive refactors. |
| "This ADR is obvious, I don't need to write it" | If it's obvious now, the ADR takes 3 minutes. When it's questioned in 6 months, you'll wish you wrote it. |
| "We don't need sequence diagrams for simple flows" | Simple flows have edge cases. Drawing the diagram reveals them. |
| "The directory structure can be flexible" | Flexible = no structure. Lock it down and deviate intentionally. |
| "Security can be retrofitted" | Auth and input validation must be in the architecture from day one. |
