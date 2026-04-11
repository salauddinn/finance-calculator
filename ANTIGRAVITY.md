# Agentic SDLC for Antigravity

## Installation

1. Install the framework:
   ```bash
   pip install agentic-sdlc
   ```
2. Initialize the project:
   ```bash
   asdlc init
   ```

## Initialization Instructions 

**Read `skills/using-agentic-sdlc/SKILL.md` before taking action.**

You have the **Agentic SDLC** framework installed. This gives you a structured, multi-stage software development lifecycle to follow — replacing ad-hoc coding with a disciplined, auditable process.

### The Prime Directive

**Check for a relevant skill BEFORE taking any action.** If there is a chance a skill applies, invoke it using the `view_file` tool. Skills override default behavior. 

1. **User's explicit instructions** — highest priority
2. **Agentic SDLC skills** — override default agent behavior
3. **Default agent behavior** — lowest priority

### How to Use Skills

Skills live in the `skills/` directory.

*   To invoke a skill, read its `SKILL.md` file using `view_file`.
*   Always start your session by looking at `skills/using-agentic-sdlc/SKILL.md`.

### Mandatory Context Directory

All stage outputs are written to disk under `docs/`. Antigravity can use standard file editing tools (`write_to_file`, `replace_file_content`) to save these items. For larger analysis, write artifacts like implementation plans directly to the brain's artifact directory, but still maintain the local repo stubs as the codebase's permanent record.

### Hitl Checkpoints

If a skill specifies a `<HARD-GATE>` or a requirement for a HITL checkpoint, clearly state what requires approval, ask the user, and wait to proceed.
