export type ModeToggleProps = {
  mode: "simple" | "advanced";
  onChange: (mode: "simple" | "advanced") => void;
};

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div role="group" aria-label="Calculator mode" className="seg">
      <button
        type="button"
        className="seg__btn"
        aria-pressed={mode === "simple"}
        onClick={() => { if (mode !== "simple") onChange("simple"); }}
      >
        Simple
      </button>
      <button
        type="button"
        className="seg__btn"
        aria-pressed={mode === "advanced"}
        onClick={() => { if (mode !== "advanced") onChange("advanced"); }}
      >
        Advanced
      </button>
    </div>
  );
}
