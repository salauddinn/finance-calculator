# Epic: V1 Calculator Platform

## Task Dependency Graph

STORY-001 (Scaffold Next.js foundation)
  └── STORY-002 (Implement tokens and theme system)
  └── STORY-003 (Build shared calculator form primitives)
  └── STORY-004 (Create validation and persistence adapters)

STORY-002
  └── STORY-005 (Create landing page shell and calculator navigation)

STORY-003
  └── STORY-006 (Build personal loan calculator)
  └── STORY-007 (Build simple home loan calculator)
  └── STORY-008 (Build SIP calculator)
  └── STORY-009 (Build fixed deposit calculator)

STORY-004
  └── STORY-006 (Build personal loan calculator)
  └── STORY-007 (Build simple home loan calculator)
  └── STORY-008 (Build SIP calculator)
  └── STORY-009 (Build fixed deposit calculator)
  └── STORY-010 (Build advanced home loan scenario engine)

STORY-005
  └── STORY-011 (Assemble multi-calculator product experience)

STORY-006
  └── STORY-011 (Assemble multi-calculator product experience)

STORY-007
  └── STORY-010 (Build advanced home loan scenario engine)
  └── STORY-011 (Assemble multi-calculator product experience)

STORY-008
  └── STORY-011 (Assemble multi-calculator product experience)

STORY-009
  └── STORY-011 (Assemble multi-calculator product experience)

STORY-010
  └── STORY-011 (Assemble multi-calculator product experience)

STORY-011
  └── STORY-012 (Accessibility, performance, and production hardening)

## Parallel Tracks

- Track A: STORY-002 and STORY-005
- Track B: STORY-003, STORY-006, STORY-007, STORY-008, STORY-009
- Track C: STORY-004 and STORY-010
- Track D: STORY-011 and STORY-012

## Parallel Track Rules

- Track A owns `src/app/*`, `src/styles/*`, and `src/components/layout/*`
- Track B owns `src/components/primitives/*` and `src/features/calculators/*` except advanced scenario engine files reserved for Track C  
- Track C owns `src/lib/validation/*`, `src/lib/storage/*`, and `src/lib/calculations/home-loan-advanced/*`
- Track D owns cross-app integration files, accessibility refinements, and deployment-readiness updates
- Merge strategy for all stories: feature branch per story, squash merge to main
