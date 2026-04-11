type ResultSummaryCardProps = {
  caption?: string;
  label: string;
  value: string;
  valueTestId?: string;
  tone?: "default" | "positive" | "caution";
};

export function ResultSummaryCard({
  caption,
  label,
  value,
  valueTestId,
  tone = "default"
}: ResultSummaryCardProps) {
  return (
    <article
      className={`result-summary-card result-summary-card--${tone}`}
      data-testid="result-summary-card"
    >
      <div className="result-summary-card__info">
        <p className="result-summary-card__label">{label}</p>
        {caption ? (
          <p className="result-summary-card__caption">{caption}</p>
        ) : null}
      </div>
      <p className="result-summary-card__value" data-testid={valueTestId}>
        {value}
      </p>
    </article>
  );
}
