import { useState, type CSSProperties, type InputHTMLAttributes } from "react";

type SliderInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  id: string;
  label: string;
  hint?: string;
  min: string | number;
  max: string | number;
  step?: string | number;
  value: string | number | readonly string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function formatIndian(n: number): string {
  if (isNaN(n)) return "";
  return n.toLocaleString("en-IN");
}

export function SliderInput({
  id,
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
  ...props
}: SliderInputProps) {
  const [focused, setFocused] = useState(false);

  const numValue = Number(value);
  const numMin = Number(min);
  const numMax = Number(max);
  const range = numMax - numMin;
  const fillPct = range > 0
    ? `${Math.max(0, Math.min(100, ((numValue - numMin) / range) * 100)).toFixed(1)}%`
    : "0%";

  const displayValue = focused ? String(value) : formatIndian(numValue);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    onChange({ target: { value: raw } } as React.ChangeEvent<HTMLInputElement>);
  }

  return (
    <div className="field">
      <div className="slider-row">
        <label className="slider-row__label" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className="slider-row__value-input"
          value={displayValue}
          onChange={handleTextChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          {...props}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="slider-track"
        style={{ "--fill": fillPct } as CSSProperties}
        aria-label={`${label} slider`}
        tabIndex={-1}
      />
      {hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
