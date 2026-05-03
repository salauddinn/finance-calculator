

import { useTheme } from "@/features/preferences/theme/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextThemeLabel = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextThemeLabel} mode`}
    >
      <span aria-hidden="true" className="theme-toggle__icon">
        {theme === "dark" ? "☾" : "☀"}
      </span>
      <span className="theme-toggle__label">
        {theme === "light" ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
