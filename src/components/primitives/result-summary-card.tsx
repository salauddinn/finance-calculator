type ResultSummaryCardProps = {
  label: string;
  value: string;
  tone?: "default" | "positive" | "caution";
};

export function ResultSummaryCard({
  label,
  value,
  tone = "default"
}: ResultSummaryCardProps) {
  return (
    <article
      className={`result-summary-card result-summary-card--${tone}`}
      data-testid="result-summary-card"
    >
      <p className="result-summary-card__label">{label}</p>
      <p className="result-summary-card__value">{value}</p>
    </article>
  );
}
