"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import {
  DEFAULT_PREFERENCES,
  createPreferencesStorageAdapter,
  type StoredPreferences
} from "@/lib/storage/preferences-storage";

type ThemeMode = "light" | "dark";

type ThemeProviderProps = Readonly<{
  children: ReactNode;
}>;

type ThemeContextValue = {
  theme: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(theme: StoredPreferences["theme"]): ThemeMode {
  return theme === "dark" ? "dark" : "light";
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preferences, setPreferences] = useState<StoredPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const storage = createPreferencesStorageAdapter();
    const loaded = storage.load();

    if (loaded.ok) {
      setPreferences(loaded.data);
      return;
    }

    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolveTheme(preferences.theme);
  }, [preferences.theme]);

  function handleToggle() {
    setPreferences((current) => {
      const nextTheme: ThemeMode =
        resolveTheme(current.theme) === "light" ? "dark" : "light";
      const nextPreferences: StoredPreferences = {
        ...current,
        theme: nextTheme
      };

      createPreferencesStorageAdapter().save(nextPreferences);

      return nextPreferences;
    });
  }

  const value: ThemeContextValue = {
    theme: resolveTheme(preferences.theme),
    toggleTheme: handleToggle
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
