"use client";

import { useState } from "react";

import { formatBytes } from "@/lib/utils";
import type { Language } from "@/lib/github";

type LanguageMeterProps = {
  languages: Language[];
  totalBytes: number;
};

/**
 * The stack, as a thing you can touch.
 *
 * One bar per language, sized by the bytes actually committed. Pointing at a
 * bar raises it and prints its share in the reader; the rest step back. It
 * replaces a block of text with the same data, so the section answers "what
 * does he write" by showing the shape of the answer rather than listing it.
 *
 * The bars are buttons, not divs: this is reachable from the keyboard, and the
 * hover state is also the focus state.
 */
export function LanguageMeter({ languages, totalBytes }: LanguageMeterProps) {
  const [active, setActive] = useState<number | null>(null);
  const shown = active === null ? null : languages[active];
  const share = shown ? Math.round((shown.bytes / totalBytes) * 100) : 0;

  return (
    <div className="lang-meter">
      <div className="lang-meter__readout" aria-live="polite">
        {shown ? (
          <>
            <span className="lang-meter__name">{shown.name}</span>
            <span className="lang-meter__figure tabular-nums">
              {String(share).padStart(2, "0")}%
            </span>
            <span className="lang-meter__detail">
              {formatBytes(shown.bytes)} · {shown.repos}{" "}
              {shown.repos === 1 ? "repository" : "repositories"}
            </span>
          </>
        ) : (
          <>
            <span className="lang-meter__name">the whole account</span>
            <span className="lang-meter__figure tabular-nums">
              {formatBytes(totalBytes)}
            </span>
            <span className="lang-meter__detail">
              {languages.length} languages, measured by bytes committed
            </span>
          </>
        )}
      </div>

      <ul className="lang-meter__bars">
        {languages.map((language, index) => {
          const ratio = language.bytes / totalBytes;
          const isActive = active === index;

          return (
            <li key={language.name} data-active={isActive ? "" : undefined}>
              <button
                type="button"
                className="lang-meter__row"
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                aria-label={`${language.name}: ${Math.round(ratio * 100)} percent, ${formatBytes(language.bytes)}, ${language.repos} repositories`}
              >
                <span className="lang-meter__label">{language.name}</span>
                <span
                  className="lang-meter__bar"
                  aria-hidden="true"
                  style={{ "--w": `${Math.max(ratio * 100, 1.5)}%` } as React.CSSProperties}
                />
                <span className="lang-meter__pct tabular-nums" aria-hidden="true">
                  {String(Math.round(ratio * 100)).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
