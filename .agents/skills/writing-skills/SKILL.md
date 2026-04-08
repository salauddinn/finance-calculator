---
name: writing-skills
description: Use when creating a new skill, editing an existing skill, or verifying that a skill works before adding it to the skills library.
version: 1.0.0
---

Creating skills IS test-driven development applied to process documentation. Write a test first (a pressure scenario). Watch it fail (observe what agents do without the skill). Write the skill. Watch tests pass (agents comply). Refactor (close loopholes).

## What Makes a Good Skill

**Skills are:** Reusable behavioral instructions for specific, repeating situations
**Skills are NOT:** Narratives about how you solved a problem once, or one-off project notes

Create a skill when:
- A technique or process wasn't intuitively obvious and you had to work it out
- You would reference this again across different projects
- Others working on completely different projects would benefit
- The pattern is broadly applicable, not domain-specific

Don't create a skill for:
- One-off solutions or project-specific conventions (put in AGENTS.md or a project README)
- Standard practices documented in official docs (link to docs instead)
- Mechanical constraints enforceable by tooling (automate it, don't document it)

## SKILL.md Format

```markdown
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions and symptoms — NOT a workflow summary]
version: 1.0.0
---

[One-sentence core principle or what this skill achieves]

## When to Use
[Bullet list of specific situations and symptoms]

## Checklist / Process
[Numbered steps, ordered. Include sub-steps when sequence matters.]

## [Key section — technique, format, template]
[The actual content: formats, code examples, decisions]

## Gate (if applicable)
[Checklist format with [ ] items]

## Red Flags
| Thought | Reality |
|---|---|
| [rationalization] | [counter] |
```

## YAML Frontmatter Rules

- `name`: letters, numbers, hyphens only — no parentheses or special chars
- `description`: starts with "Use when..." — describes **triggering conditions only**
- **NEVER** summarize the skill's workflow in the description

**Why:** If the description summarizes the workflow, the agent may follow the description instead of reading the skill. The description is for discovery (when to load). The body is for behavior (what to do).

```yaml
# ❌ BAD — summarizes workflow
description: Use when writing plans — breaks into tasks with file paths, exact code, and test steps
version: 1.0.0

# ✅ GOOD — triggering conditions only
description: Use when you have a spec or requirements for a multi-step task, before touching code
version: 1.0.0
```

## Description Quality Checklist

```
[ ] Starts with "Use when..."
[ ] Describes the SITUATION, not the PROCESS
[ ] Contains at least one concrete symptom or trigger
[ ] Written in third person
[ ] No workflow summary
[ ] Under 500 characters
```

## Anti-Rationalization Patterns

Skills that enforce discipline need to resist rationalization. Add:

1. **Close explicit loopholes** — name the workarounds and forbid them
2. **Spirit vs. letter** — add `Violating the letter of the rules is violating the spirit`
3. **Red Flags table** — capture rationalizations from testing and address them directly
4. **HARD-GATE or EXTREMELY-IMPORTANT** tags for non-negotiable rules

## Testing Your Skill

Before adding a skill to the library:

**RED — observe without the skill:**
Run a scenario where an agent would need this skill. What does it do wrong? What rationalizations does it use? Document verbatim.

**GREEN — test with the skill:**
Run the same scenario with the skill loaded. Does the agent now comply? If not, the skill is incomplete — go back.

**REFACTOR — close loopholes:**
Run harder pressure scenarios (time pressure, sunk cost, authority challenge). Find new rationalizations. Add explicit counters. Re-test.

## Skill Types and Testing Approach

| Type | Examples | Test with |
|---|---|---|
| Discipline/rules | implementation (TDD), stage-gates | Pressure scenarios — does agent comply under stress? |
| Process/technique | inception, context-harvest | Application scenarios — can agent apply the process correctly? |
| Reference | templates, ADR format | Retrieval scenarios — can agent find and use the right information? |

## File Structure

```
skills/
  skill-name/
    SKILL.md              # Required — main skill file
    supporting-file.*     # Only if needed (templates, scripts, heavy reference)
```

Keep inline if it fits. Separate files only for: >100 lines of reference material, reusable scripts, or templates that users fill in.

## Deployment Checklist

Before adding to the library:

```
[ ] Frontmatter: name uses only letters/numbers/hyphens
[ ] Description: starts with "Use when...", no workflow summary
[ ] RED test run: documented what agent does without skill
[ ] GREEN test run: agent complies with skill present
[ ] REFACTOR: at least one pressure scenario run, loopholes closed
[ ] Red flags table populated from actual test rationalizations
[ ] No placeholder content (TBD, TODO, fill in later)
[ ] Cross-references use skill name only (not file paths)
```
