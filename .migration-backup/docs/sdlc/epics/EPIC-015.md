# Epic: Advanced Calculator Modes (EPIC-015)

## Task dependency graph

STORY-015-1 (Core schemas & base components)
  ├── STORY-015-2 (Loan advanced math)       ← depends on STORY-015-1
  └── STORY-015-3 (Investment advanced math) ← depends on STORY-015-1
        └── STORY-015-4 (UI Integration routes) ← depends on STORY-015-2, STORY-015-3

Parallel tracks:
- Track A: STORY-015-2
- Track B: STORY-015-3
- Convergence: STORY-015-4
