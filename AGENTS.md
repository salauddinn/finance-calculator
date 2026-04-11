## If You Are an AI Agent — Read This First

You have the **Agentic SDLC** framework installed. This gives you a structured, multi-stage software development lifecycle to follow — replacing ad-hoc coding with a disciplined, auditable process.

### The Prime Directive

**Check for a relevant skill BEFORE taking any action — including asking clarifying questions.**

If there is even a 1% chance a skill applies, invoke it. Skills override default behavior. User instructions override skills.

Instruction priority:
1. **User's explicit instructions** (in conversation, AGENTS.md, project docs) — highest
2. **Agentic SDLC skills** — override default agent behavior
3. **Default agent behavior** — lowest priority

---

### How to Use Skills

Skills live in the `skills/` directory of this repository. Each skill is a `SKILL.md` file with:
- A `name` and `description` (YAML frontmatter) — tells you WHEN to invoke it
- Detailed instructions for HOW to execute the stage or activity

**To use a skill:** Read the relevant `skills/<name>/SKILL.md` file at the start of any task that matches its trigger. Follow it exactly.

**Start here:** Always read `skills/using-agentic-sdlc/SKILL.md` at the beginning of a new project or conversation.

---

### Workflow Selection

```
Starting a new project from scratch?
  → Use Workflow 1 (Greenfield): inception → design-system → tech-architecture
    → implementation-planning → story-breakdown → implementation
    → critical-review → testing → code-review → retrospective

Working on an existing codebase?
  → Use Workflow 2 (Brownfield): context-harvest → brownfield-brainstorm
    → brownfield-design → brownfield-tech-plan → implementation-planning
    → story-breakdown → implementation → critical-review → testing
    → code-review → retrospective
```

---

### Skills Catalog

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
| `writing-skills` | Creating new skills or editing existing ones |

---

### Context Directory

All stage outputs are written to a distributed `docs/` structure at the project root. Never rely on conversation memory alone — write artifacts to disk.

```
docs/
  architecture/domain-model.md
  product/features/brd.md
  product/design-system.md
  product/accessibility.md
  architecture/tech-architecture.md
  architecture/adrs/
  architecture/coding-standards.md
  sdlc/epics/implementation-plan.md
  sdlc/epics/task-graph.md
  architecture/data-domain.md
  sdlc/test-plans/test-plan.md
  sdlc/retrospectives/critical-review.md
  sdlc/retrospectives/retrospective.md
```

Run `asdlc init` to create this structure in a new project. Every primary artifact must be marked `Status: Approved` to pass its stage gate.

---

The Agentic SDLC framework is platform-agnostic. Installation instructions for supported agents can be found in the README and the following files:

- [Codex](AGENTS.md)
- [Claude Code](CLAUDE.md)
- [Gemini CLI](GEMINI.md)
- [Antigravity](ANTIGRAVITY.md)
- [Amp](AMP.md)

### Red Flags — You Are Rationalizing

| Thought | Reality |
|---|---|
| "This is too simple to need a design" | All projects go through the process. Design can be short. |
| "I'll skip the gate this once" | Gates exist because skipping them causes regressions. |
| "I don't need HITL for this" | If it's in the mandatory HITL list, it requires human sign-off. |
| "I remember what the skill says" | Skills evolve. Read the current version. |
| "This doesn't need TDD" | If it's production code, it needs a failing test first. |
| "Let me write some code first to explore" | Exploration prototypes must be thrown away before TDD begins. |
