"use client";

type ThemeToggleProps = {
  theme: "light" | "dark";
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const nextThemeLabel = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${nextThemeLabel} mode`}
    >
      <span className="theme-toggle__label">
        {theme === "light" ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
