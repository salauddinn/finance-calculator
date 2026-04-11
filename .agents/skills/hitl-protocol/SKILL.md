---
name: hitl-protocol
description: Use when an irreversible action, ambiguous decision, or mandatory checkpoint requires explicit human approval before the agent proceeds.
version: 1.0.0
---

Some decisions cannot be undone. Some decisions are too ambiguous for the agent to resolve alone. Both require a human in the loop before proceeding.

## Mandatory HITL Checkpoints

Human approval is **always** required at these points — no exceptions:

1. **End of inception** — before design and architecture begin
2. **End of tech-architecture** — before any code is written
3. **End of story-breakdown** — before implementation begins
4. **Before any destructive operation** — DB migration, data deletion, external API write in production
5. **When the agent is blocked** — cannot resolve ambiguity autonomously
6. **When an interface contract changes** — mid-implementation contract changes affect consumers
7. **When a Stage 3 architectural decision is superseded** — rollback rule triggered

## Git Protocol for HITL

**Before requesting HITL** — always commit current state first so the human can review a clean diff:
```
git add .
git commit -m "wip({stage-name}): pre-HITL checkpoint — {brief context}"
```

**After HITL approval (for stage artifact branches)** — HITL approval = merge:
```
git checkout main
git merge --squash docs/{stage-name}
git commit -m "docs({stage-name}): approved — merge to main"
git branch -d docs/{stage-name}
```

**After HITL decision recorded in artifact:**
```
git add docs/
git commit -m "docs({stage-name}): HITL decision recorded — {option chosen}"
```

> See `git-discipline` skill for full conventions.

## HITL Prompt Format

Use this exact format when requesting human input:

```
HITL REQUIRED
Stage: [stage name]
Question: [specific, answerable question — not a vague "please review"]
Context: [brief summary of relevant state and what output has been produced]
Options: [A] [specific option]
         [B] [specific option]
         [C] [specific option — include at least 2]
Default if no response: [what the agent will do if human does not respond — usually "wait"]
```

## Example HITL Prompts

**End of inception:**
```
HITL REQUIRED
Stage: inception
Question: Does this BRD accurately capture your requirements before we move to design?
Context: BRD written to docs/product/features/brd.md. 4 FRs, 3 NFRs, 2 personas defined.
Options: [A] Approved — proceed to design-system and tech-architecture
         [B] Changes needed — I will specify which sections to revise
Default if no response: Wait for explicit approval
```

**Before destructive DB migration:**
```
HITL REQUIRED
Stage: implementation
Question: This migration drops the `legacy_users` table. This is irreversible without a backup. Approve?
Context: Migration file: src/db/migrations/20260406_drop_legacy_users.sql
         Estimated rows affected: ~12,000
         Backup status: [confirm backup exists before approving]
Options: [A] Approved — backup confirmed, proceed with migration
         [B] Hold — do not run migration until backup is confirmed
Default if no response: HOLD — do not proceed
```

**Agent blocked:**
```
HITL REQUIRED
Stage: implementation
Question: Two existing approaches conflict in the auth module. Which should take precedence?
Context: approach-a uses JWT + refresh tokens (ADR-003). Approach-b uses session cookies (legacy code in auth/session.ts). The story touches both. They cannot coexist without a clear precedence rule.
Options: [A] JWT approach (ADR-003) — remove legacy session code for this endpoint
         [B] Session approach — override ADR-003 for this specific case (write a new ADR)
         [C] Defer — do not touch auth in this story; descope and create a separate story
Default if no response: Wait for explicit approval
```

## After Receiving HITL Response

1. Record the human's decision in the stage artifact (e.g., `docs/product/features/brd.md` Open questions section)
2. Commit the decision: `git add docs/ && git commit -m "docs({stage}): HITL decision recorded — {option chosen}"`
3. If the decision changes context (e.g., new constraint, approved direction): update relevant artifacts and commit
4. If approved — merge the `docs/{stage-name}` branch to main (see Git Protocol above)
5. Continue with the approved option

## When the Agent Must WAIT

**STOP. Do not proceed.** The agent must not take the next step — even if it feels like it could make a reasonable choice — when:
- The action is irreversible (data loss, production write, deploy)
- The ambiguity materially affects the implementation plan
- The checklist explicitly calls for a HITL checkpoint
- The human has not yet responded to a pending HITL request

**Waiting is correct behavior.** Proceeding without approval on a mandatory checkpoint is a process violation.
The next step being "clear" to the agent is not a substitute for human approval.

## Red Flags

| Thought | Reality |
|---|---|
| "The human would probably approve this" | Probably is not approval. Stop and ask. |
| "This is a small destructive action" | All destructive actions require HITL regardless of size. |
| "I'll ask forgiveness, not permission" | Irreversible mistakes don't have forgiveness. Ask first. |
| "I can infer the answer from context" | Inferred approval is not approval. Ask explicitly. |
| "The HITL will slow us down" | The HITL exists because the alternative is production incidents. |
| "The next step is clear — I'll proceed" | Clarity of next step does not replace human approval. Stop and wait. |
| "The user hasn't responded but I can continue" | No response is not approval. Stop and wait for an explicit answer. |

