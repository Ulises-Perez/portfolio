"use client";

import { useEffect, useState } from "react";

import { AppTile } from "@/components/orbi/app-tile";
import type { Glyph } from "@/data/site.config";
import { loadingLine, PROJECT_LOAD_MS } from "@/lib/project-load";

const RING = 2 * Math.PI * 15.5;

/**
 * The loading screen inside a project window.
 *
 * It runs on one clock — `PROJECT_LOAD_MS` — and calls `onDone` when it is
 * spent. It is only mounted the first time a project opens in the session:
 * the window decides, `hasLoaded` remembers. The content behind it is already
 * in the DOM (the app chunk is fetched by `next/dynamic`), so this screen
 * reports a real wait and never gates the server-rendered page.
 */
export function ProjectLoading({
  project,
  accent,
  initial,
  glyph,
  onDone,
}: {
  project: string;
  accent?: string;
  initial: string;
  glyph?: Glyph;
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min((now - start) / PROJECT_LOAD_MS, 1);
      setProgress(next);

      if (next >= 1) {
        onDone();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // A visitor can always skip the wait.
    const skip = () => onDone();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // `onDone` is stable in practice: the parent memoises it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <div
      className="os-app-load"
      role="status"
      aria-live="polite"
      data-done={progress >= 1 ? "" : undefined}
    >
      <div className="os-app-load__mark">
        <svg viewBox="0 0 36 36" className="os-app-load__ring">
          <circle cx="18" cy="18" r="15.5" className="os-app-load__track" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            className="os-app-load__arc"
            style={{ stroke: accent }}
            strokeDasharray={RING}
            strokeDashoffset={RING * (1 - progress)}
          />
        </svg>
        <AppTile initial={initial} glyph={glyph} accent={accent} size={44} />
      </div>

      <p className="os-app-load__name">{project}</p>
      <p className="os-app-load__line">{loadingLine(project)}</p>
    </div>
  );
}
