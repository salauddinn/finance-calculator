import type { ReactNode } from "react";

type ResultInsightPanelProps = {
  title: string;
  summary: ReactNode;
  supportingPoints?: string[];
};

export function ResultInsightPanel({
  title,
  summary,
  supportingPoints = []
}: ResultInsightPanelProps) {
  return (
    <section className="result-insight-panel" aria-live="polite">
      <p className="result-insight-panel__eyebrow">Plain-English takeaway</p>
      <h3 className="result-insight-panel__title">{title}</h3>
      <p className="result-insight-panel__summary">{summary}</p>
      {supportingPoints.length > 0 ? (
        <ul className="result-insight-panel__list">
          {supportingPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
