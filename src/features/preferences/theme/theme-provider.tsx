"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  DEFAULT_PREFERENCES,
  createPreferencesStorageAdapter,
  type StoredPreferences
} from "@/lib/storage/preferences-storage";

type ThemeMode = "light" | "dark";

type ThemeProviderProps = Readonly<{
  children: ReactNode;
}>;

function resolveTheme(theme: StoredPreferences["theme"]): ThemeMode {
  return theme === "dark" ? "dark" : "light";
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

  return (
    <>
      <ThemeToggle theme={resolveTheme(preferences.theme)} onToggle={handleToggle} />
      {children}
    </>
  );
}
