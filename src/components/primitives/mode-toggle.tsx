"use client";

import React from "react";

export type ModeToggleProps = {
  mode: "simple" | "advanced";
  onChange: (mode: "simple" | "advanced") => void;
};

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="Calculator mode"
      className="mode-toggle-group"
      style={{
        display: "inline-flex",
        background: "var(--color-border-light)",
        borderRadius: "var(--border-radius-pill)",
        padding: "4px",
        gap: "4px",
      }}
    >
      <button
        type="button"
        aria-pressed={mode === "simple"}
        onClick={() => {
          if (mode !== "simple") onChange("simple");
        }}
        style={{
          appearance: "none",
          border: "none",
          background: mode === "simple" ? "var(--color-bg-elevated-light)" : "transparent",
          color: mode === "simple" ? "var(--color-text-strong-light)" : "var(--color-text-muted-light)",
          borderRadius: "var(--border-radius-pill)",
          padding: "8px 16px",
          fontFamily: "var(--type-family-body)",
          fontSize: "var(--type-body-sm)",
          fontWeight: mode === "simple" ? 600 : 400,
          cursor: "pointer",
          boxShadow: mode === "simple" ? "var(--shadow-1)" : "none",
          transition: "background var(--duration-fast) var(--easing-standard)",
        }}
      >
        Simple
      </button>
      <button
        type="button"
        aria-pressed={mode === "advanced"}
        onClick={() => {
          if (mode !== "advanced") onChange("advanced");
        }}
        style={{
          appearance: "none",
          border: "none",
          background: mode === "advanced" ? "var(--color-bg-elevated-light)" : "transparent",
          color: mode === "advanced" ? "var(--color-text-strong-light)" : "var(--color-text-muted-light)",
          borderRadius: "var(--border-radius-pill)",
          padding: "8px 16px",
          fontFamily: "var(--type-family-body)",
          fontSize: "var(--type-body-sm)",
          fontWeight: mode === "advanced" ? 600 : 400,
          cursor: "pointer",
          boxShadow: mode === "advanced" ? "var(--shadow-1)" : "none",
          transition: "background var(--duration-fast) var(--easing-standard)",
        }}
      >
        Advanced
      </button>
    </div>
  );
}
