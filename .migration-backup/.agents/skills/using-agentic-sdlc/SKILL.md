---
name: using-agentic-sdlc
description: Use when starting any conversation or project session — establishes how to find and invoke skills, and selects the correct workflow (greenfield vs brownfield) before any action is taken.
version: 1.0.0
---

Stop. Read this before doing anything else.

<EXTREMELY-IMPORTANT>
If there is even a 1% chance a skill applies to what you are doing, you MUST invoke it.
Skills override default behavior. User instructions override skills.
This is not optional. You cannot rationalize your way out of it.
</EXTREMELY-IMPORTANT>

## Instruction Priority

1. **User's explicit instructions** (conversation, AGENTS.md, project docs) — highest
2. **Agentic SDLC skills** — override default agent behavior
3. **Default agent behavior** — lowest priority

## How to Use Skills

Skills are in `skills/<name>/SKILL.md`. Each has YAML frontmatter with `name` and `description`.

**To invoke a skill:** Read `skills/<name>/SKILL.md` and follow it exactly.

**Never** rely on conversation memory for skill content — always read the current file.

## Workflow Selection

Before any work, determine which workflow applies:

```
Is this a brand-new project with no existing codebase?
  YES → Workflow 1 (Greenfield)
        inception → design-system → tech-architecture
        → implementation-planning → story-breakdown → implementation
        → critical-review → testing → code-review → retrospective

  NO  → Is this a story/feature on an existing codebase?
        YES → Workflow 2 (Brownfield)
              context-harvest → brownfield-brainstorm → brownfield-design
              → brownfield-tech-plan → implementation-planning
              → story-breakdown → implementation → critical-review
              → testing → code-review → retrospective
```

**When in doubt, ask the user one question:** "Is this a new project from scratch, or are we adding to an existing codebase?"

## Skills Catalog

| Skill | Trigger |
|---|---|
| `using-agentic-sdlc` | Starting any project or session |
| `inception` | New project with unclear requirements |
| `design-system` | Establishing visual/interaction language |
| `tech-architecture` | Making technology or architecture decisions |
| `implementation-planning` | Creating execution plan from approved architecture |
| `story-breakdown` | Decomposing a plan into executable tasks |
| `implementation` | Writing production code for any task |
| `critical-review` | Adversarial quality review of completed implementation |
| `testing` | Executing test plan and verifying end-to-end behavior |
| `code-review` | Final structured review before merge or handoff |
| `retrospective` | Closing a project or story cycle |
| `context-harvest` | Starting work on an unfamiliar existing codebase |
| `brownfield-design` | Story introduces new UI in existing system |
| `brownfield-brainstorm` | Understanding business impact of a story |
| `brownfield-tech-plan` | Planning technical approach for a story |
| `coding-constitution` | Establishing or reviewing coding standards |
| `stage-gates` | Evaluating whether a stage's exit criteria are met |
| `hitl-protocol` | Irreversible action or ambiguous decision needing human input |
| `git-discipline` | Any git operation — branch creation, commits, merges |
| `writing-skills` | Creating new skills or editing existing ones |

## Skill Types

**Rigid** (implementation, stage-gates, hitl-protocol, git-discipline): Follow exactly. No adaptation.

**Flexible** (inception, design-system): Adapt the process to the scale of the project. A one-page app needs a shorter design than an enterprise platform — but both still go through the stage.

## Rule: When Multiple Skills Apply

1. **Process skills first** (inception, context-harvest, critical-review) — these determine HOW to approach
2. **Implementation skills second** (implementation, testing) — these guide execution

"Let's build X" → inception first, then subsequent stages.
"Fix this bug" → Read implementation skill, apply TDD.
"Add a feature to existing code" → context-harvest first (if not done), then brownfield-brainstorm.

## Context Directory

All stage outputs live in `docs/sdlc/` at the project root. Every stage reads and writes specific files. Never rely on conversation memory alone.

```
docs/sdlc/
  domain.md              ← inception writes this
  brd.md                 ← inception writes this
  design-system.md       ← design-system writes this
  accessibility.md       ← design-system writes this
  tech-architecture.md   ← tech-architecture writes this
  adr/                   ← tech-architecture writes this
  coding-standards.md ← tech-architecture writes this
  implementation-plan.md ← implementation-planning writes this
  task-graph.md          ← story-breakdown writes this
  data-domain.md ← implementation maintains this
  test-plan.md           ← testing writes this
  critical-review.md     ← critical-review writes this
  retrospective.md       ← retrospective writes this
  existing-system.md     ← context-harvest writes this (brownfield only)
```

Run `asdlc init` to create this structure in a new project.

## Red Flags — You Are Rationalizing

| Thought | Reality |
|---|---|
| "This is too simple to need a design" | All projects go through the process. Design can be short. |
| "I'll skip the gate this once" | Gates exist because skipping them causes regressions. |
| "I don't need HITL for this" | If it's in the mandatory HITL list, it requires human sign-off. |
| "I remember what the skill says" | Skills evolve. Read the current version. |
| "This doesn't need TDD" | If it's production code, it needs a failing test first. |
| "Let me write some code first to explore" | Exploration prototypes must be thrown away before TDD begins. |
| "I already know what to build" | Unexamined assumptions are where wasted work hides. Run inception. |
| "We can skip architecture, it's a small project" | Small projects grow. ADRs take 10 minutes. Tech debt lasts forever. |
| "I'll document later" | Later never comes. Write artifacts now. |
| "The status doesn't matter" | Documents must be 'Approved' to pass gates. Update the status. |
| "Just start coding, I'll explain requirements as we go" | Coding without inception produces the wrong thing. Run inception first — it's fast. |
| "Let's skip inception and go straight to coding" | Inception exists to prevent this. Every project, every time. Run it. |

