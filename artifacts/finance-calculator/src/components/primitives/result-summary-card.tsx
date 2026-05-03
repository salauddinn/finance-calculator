type ResultSummaryCardProps = {
  caption?: string;
  label: string;
  value: string;
  valueTestId?: string;
  sublabel?: string;
  tone?: "default" | "positive" | "caution";
  isHero?: boolean;
};

export function ResultSummaryCard({
  caption,
  label,
  value,
  valueTestId,
  sublabel,
  tone = "default",
  isHero = false,
}: ResultSummaryCardProps) {
  if (isHero) {
    return (
      <div
        className={`result-hero result-hero--${tone}`}
        data-testid="result-summary-card"
      >
        <p className="result-hero__label">{label}</p>
        <p className="result-hero__value" data-testid={valueTestId}>
          {value}
        </p>
        {sublabel ? (
          <p className="result-hero__sub">{sublabel}</p>
        ) : null}
        {caption && !sublabel ? (
          <p className="result-hero__sub">{caption}</p>
        ) : null}
      </div>
    );
  }

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
