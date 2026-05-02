type BreakdownBarProps = {
  valueA: number;
  valueB: number;
  labelA: string;
  labelB: string;
  colorA?: "blue" | "green";
  colorB?: "amber" | "red" | "muted";
  formattedA?: string;
  formattedB?: string;
};

export function BreakdownBar({
  valueA,
  valueB,
  labelA,
  labelB,
  colorA = "blue",
  colorB = "amber",
  formattedA,
  formattedB,
}: BreakdownBarProps) {
  const total = valueA + valueB;
  if (total <= 0) return null;

  const pctA = Math.round((valueA / total) * 100);
  const pctB = 100 - pctA;

  return (
    <div className="breakdown">
      <div className="breakdown__bar" role="presentation">
        <div
          className={`breakdown__fill breakdown__fill--${colorA}`}
          style={{ width: `${pctA}%` }}
        />
        <div
          className={`breakdown__fill breakdown__fill--${colorB}`}
          style={{ width: `${pctB}%` }}
        />
      </div>
      <div className="breakdown__labels">
        <div className="breakdown__label">
          <span className="breakdown__label-name">{labelA}</span>
          <span className="breakdown__label-pct">{pctA}%</span>
          {formattedA ? (
            <span className="breakdown__label-val">{formattedA}</span>
          ) : null}
        </div>
        <div className="breakdown__label" style={{ textAlign: "right" }}>
          <span className="breakdown__label-name">{labelB}</span>
          <span className="breakdown__label-pct">{pctB}%</span>
          {formattedB ? (
            <span className="breakdown__label-val">{formattedB}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
