import { useState } from "react";

type CopySummaryButtonProps = {
  getText: () => string;
};

export function CopySummaryButton({ getText }: CopySummaryButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleCopy() {
    const text = getText();
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <button
      type="button"
      className="button button--secondary"
      onClick={handleCopy}
      style={{ fontSize: "0.85rem", padding: "0.4rem 1rem" }}
    >
      {state === "idle" && "Copy summary"}
      {state === "copied" && "Copied!"}
      {state === "error" && "Copy failed — select text manually"}
    </button>
  );
}
