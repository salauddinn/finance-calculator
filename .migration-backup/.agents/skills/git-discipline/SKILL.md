---
name: git-discipline
description: Use when performing ANY git operation — commits, branch creation, merges — throughout the SDLC. Defines exactly when and how to commit at every stage boundary, HITL checkpoint, and story lifecycle point.
version: 1.0.0
---

Every code change and every approved artifact must be committed. No work exists unless it is in git.

## The Iron Law

```
NO APPROVED ARTIFACT OR COMPLETED STORY WITHOUT A GIT COMMIT.
```

This applies to docs, code, configuration — everything. If it isn't committed, it didn't happen.

## Branch Strategy

Two types of branches. Only these two:

| Branch type | Naming | Purpose | Merged after |
|---|---|---|---|
| Stage artifact branch | `docs/{stage-name}` | Holds stage outputs until HITL approval | HITL approval |
| Story feature branch | `feature/STORY-{ID}-{short-desc}` | Holds implementation work for one story | Code-review PASS |

`main` only ever contains **approved** content:
- Stage artifacts merged in after HITL sign-off
- Stories merged in after code-review PASS

Never commit directly to `main`. Always go through a branch.

## Stage Artifact Protocol

Each planning/documentation stage (inception, design-system, tech-architecture, implementation-planning, story-breakdown) follows this pattern:

```
1. Create branch:
   git checkout main
   git pull origin main
   git checkout -b docs/{stage-name}
   # e.g. docs/inception, docs/tech-architecture, docs/story-breakdown

2. Do the stage work (write artifacts to docs/)

3. When stage gate PASSES — commit all artifacts:
   git add docs/
   git commit -m "docs({stage-name}): stage complete — gate passed"

4. HITL checkpoint — human reviews the branch diff:
   (human reviews and approves)

5. After HITL approval — merge to main:
   git checkout main
   git merge --squash docs/{stage-name}
   git commit -m "docs({stage-name}): approved — merge to main"
   git branch -d docs/{stage-name}
```

**If HITL requests changes:** make changes on the same branch, re-commit, request HITL again. Do not merge until approved.

## Story Implementation Protocol

Each story follows this pattern:

```
1. Create feature branch (at story start):
   git checkout main
   git pull origin main
   git checkout -b feature/STORY-{ID}-{short-desc}

2. Implement the story (TDD: RED → GREEN → REFACTOR)
   — all work stays on the feature branch throughout

3. When story is complete (all tasks done, tests green, security checked):
   git add .
   git commit -m "{type}(STORY-{ID}): {story title}"
   # type = feat | fix | refactor depending on the story nature

4. After code-review PASS — squash merge to main:
   git checkout main
   git pull origin main
   git merge --squash feature/STORY-{ID}-{short-desc}
   git commit -m "feat(STORY-{ID}): {story title}"
   git branch -d feature/STORY-{ID}-{short-desc}
   git push origin main
```

**One commit per story on main.** The feature branch can have intermediate commits during development, but main receives one clean squash commit per story.

## Commit Message Format

Use Conventional Commits:

```
{type}({scope}): {short description}

Types:  feat | fix | refactor | test | docs | chore
Scope:  STORY-{ID} | {stage-name} | {module-name}

Examples:
  feat(STORY-042): add user authentication endpoint
  docs(inception): stage complete — gate passed
  docs(tech-architecture): approved — merge to main
  fix(STORY-017): handle null user in session validator
```

Rules:
- Description is lowercase, present tense, imperative mood: "add" not "added"
- Max 72 characters on the first line
- No period at end

## Mandatory Commit Points

These are non-negotiable. Missing any of these is a process violation:

```
[ ] Branch created at the START of every stage and every story
[ ] Stage artifacts committed before HITL is requested
[ ] Decision recorded after HITL response (docs update committed)
[ ] Story committed before requesting critical-review
[ ] Squash merge to main after code-review PASS
[ ] Feature/docs branch deleted after successful merge
```

## Handling Regressions

If a commit is found to have introduced a bug or broken a test:

```
DO:    git revert {sha}         ← creates a new revert commit, safe
DON'T: git reset --hard {sha}  ← rewrites history, dangerous on shared branches
```

Then fix the issue, re-commit, re-run the stage gate.

## HITL Commit Pattern

Before requesting HITL — always commit current state first:

```
git add .
git commit -m "wip({stage}): pre-HITL checkpoint — {brief context}"
```

After HITL decision is received and recorded in the artifact:

```
git add docs/
git commit -m "docs({stage}): HITL decision recorded — {option chosen}"
```

## Gate

Before exiting any stage or story, verify:

```
[ ] Working branch exists (not on main)
[ ] All changes committed (git status shows clean working tree)
[ ] Commit message follows Conventional Commits format
[ ] All committed files are in the expected location (docs/ for artifacts, src/ for code)
[ ] Branch will be merged via HITL approval (docs) or code-review PASS (stories)
```

## Red Flags

| Thought | Reality |
|---|---|
| "I'll commit at the end of the session" | Sessions crash. Commit now. |
| "It's just a docs change — no need for a branch" | Docs branches enable human diff review at HITL. Always branch. |
| "I'll push directly to main to save time" | main is the record of approved work. Unreviewed pushes corrupt it. |
| "I'll skip the squash merge — too many commands" | Squash merge is what makes main readable. Run the commands. |
| "The revert will lose my work" | Revert preserves history. Hard reset destroys it. |
