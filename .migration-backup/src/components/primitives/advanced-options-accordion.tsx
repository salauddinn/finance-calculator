"use client";

import React, { useState } from "react";

export type AdvancedOptionsAccordionProps = {
  title: string;
  children: React.ReactNode;
};

export function AdvancedOptionsAccordion({ title, children }: AdvancedOptionsAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="advanced-options-accordion"
      style={{
        border: "1px solid var(--color-border-light)",
        borderRadius: "var(--border-radius-md)",
        overflow: "hidden",
        marginTop: "16px",
      }}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px",
          background: "var(--color-bg-surface-light)",
          border: "none",
          fontFamily: "var(--type-family-body)",
          fontSize: "var(--type-body)",
          fontWeight: 600,
          color: "var(--color-text-strong-light)",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform var(--duration-normal) var(--easing-standard)",
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div
        style={{
          display: expanded ? "block" : "none",
          padding: "16px",
          borderTop: "1px solid var(--color-border-light)",
          background: "var(--color-bg-elevated-light)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
