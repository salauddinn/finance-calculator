const PERFORMANCE_BUDGET_MS = {
  "personal-loan": 30,
  sip: 30,
  "fixed-deposit": 30,
  "advanced-home-loan": 60
} as const;

type BudgetName = keyof typeof PERFORMANCE_BUDGET_MS;

export function measureAgainstBudget(
  budgetName: BudgetName,
  callback: () => void
) {
  const startedAt = performance.now();
  callback();
  const elapsedMs = performance.now() - startedAt;

  return {
    budgetMs: PERFORMANCE_BUDGET_MS[budgetName],
    elapsedMs
  };
}
