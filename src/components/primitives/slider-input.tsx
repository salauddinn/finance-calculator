import type { InputHTMLAttributes } from "react";

type SliderInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  min: string | number;
  max: string | number;
  step?: string | number;
};

export function SliderInput({ 
  id, 
  label, 
  hint, 
  className = "", 
  min, 
  max, 
  step, 
  value, 
  onChange, 
  ...props 
}: SliderInputProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="slider-input__wrapper">
        <input
          id={id}
          type="text"
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`text-input ${className}`.trim()}
          value={value}
          onChange={onChange}
          {...props}
        />
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="slider-input__range"
          aria-label={`${label} slider`}
          tabIndex={-1}
        />
      </div>
      {hint ? (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
