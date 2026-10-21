"use client";

import { useState } from "react";

/**
 * Copies a value and says what happened. The clipboard can be denied, and the
 * visitor has to be told that, not left with a button that looks like it
 * worked.
 */
export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("failed");
      window.setTimeout(() => setState("idle"), 2600);
    }
  };

  return (
    <>
      <button type="button" onClick={copy} className={`cta ${className}`}>
        {/* The clip is what keeps the second copy of the label out of the
            button: without it the label that rolls in floats above it. */}
        <span className="cta-clip">
          <span className="cta-stack">
            <span className={`cta-label ${className}`}>
              {state === "copied" ? "copied" : label}
            </span>
            <span aria-hidden="true" className={`cta-label cta-label-next ${className}`}>
              {state === "copied" ? "copied" : label}
            </span>
          </span>
        </span>
      </button>
      <p aria-live="polite" className="sr-only">
        {state === "copied"
          ? `${label} copied to the clipboard`
          : state === "failed"
            ? `could not copy the ${label}`
            : ""}
      </p>
    </>
  );
}
