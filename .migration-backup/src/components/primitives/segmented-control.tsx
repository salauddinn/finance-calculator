import type { KeyboardEvent } from "react";

type SegmentedOption = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  ariaLabel: string;
  value: string;
  options: SegmentedOption[];
  onChange: (value: string) => void;
};

export function SegmentedControl({
  ariaLabel,
  value,
  options,
  onChange
}: SegmentedControlProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();

    const nextIndex =
      event.key === "ArrowRight"
        ? (index + 1) % options.length
        : (index - 1 + options.length) % options.length;

    onChange(options[nextIndex].value);
  }

  return (
    <div className="segmented-control" role="radiogroup" aria-label={ariaLabel}>
      {options.map((option, index) => {
        const checked = option.value === value;

        return (
          <label
            key={option.value}
            className={`segmented-control__option ${checked ? "segmented-control__option--active" : ""}`.trim()}
          >
            <input
              checked={checked}
              className="segmented-control__input"
              name={ariaLabel}
              onChange={() => onChange(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              type="radio"
              value={option.value}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
