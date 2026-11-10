"use client";

import { useEffect, useState } from "react";

import { Emblem } from "@/components/orbi/emblem";
import { Wordmark } from "@/components/orbi/wordmark";
import {
  BOOT_EXIT_MS,
  BOOT_MS,
  BOOT_STAGES,
  bootFrame,
} from "@/lib/boot";

const KEY = "orbi-booted";

/**
 * The boot sequence.
 *
 * A construction, not a logo on a black screen: the sphere fades up out of
 * the ambient dark, the orbit draws itself around it, the satellite seats
 * where the light catches, the wordmark lands as its tracking tightens, the
 * subtitle follows, and the bar and the load report close the sequence — one
 * clock in `bootFrame`, so the screen only draws what the clock says.
 *
 * It plays once per visit, any key or pointer press takes the desktop at
 * once, and `prefers-reduced-motion` opens on the finished frame without a
 * clock at all.
 */
export function Boot({ onDone }: { onDone: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(KEY) === "1";

    if (reduce || seen) {
      finish();
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const next = Math.min(now - start, BOOT_MS);
      setElapsed(next);

      if (next >= BOOT_MS) {
        finish();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // `finish` only touches state and the visit flag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode: the sequence simply plays again */
    }

    setLeaving(true);
    setTimeout(onDone, BOOT_EXIT_MS);
  };

  const { sphere, orbit, satellite, word, subtitle, bar, line } =
    bootFrame(elapsed);

  return (
    <div
      className="os-boot"
      data-leaving={leaving ? "" : undefined}
      role="status"
      aria-live="polite"
    >
      {/* The sequence is a client overlay only: when scripts never run, the
          overlay steps aside and the static shell and the noscript document
          stand there by themselves. */}
      <noscript>
        <style>{".os-boot{display:none !important}"}</style>
      </noscript>
      <div className="os-boot__stage">
        <div className="os-boot__emblem">
          <Emblem sphere={sphere} orbit={orbit} satellite={satellite} />
        </div>

        <div
          className="os-boot__word"
          style={
            {
              opacity: word,
              translate: `0 ${(1 - word) * 10}px`,
              "--wordmark-track": `${0.62 - 0.3 * word}em`,
            } as React.CSSProperties
          }
        >
          <Wordmark />
          <p className="os-boot__tagline" style={{ opacity: subtitle }}>
            Personal Digital Environment
          </p>
        </div>

        <div
          className="os-boot__progress"
          style={{ opacity: word }}
          aria-hidden="true"
        >
          <span
            className="os-boot__progress-fill"
            style={{ scale: `${bar} 1` }}
          />
        </div>

        <p className="os-boot__stage-line" style={{ opacity: word }}>
          {line}
        </p>
      </div>

      <span className="sr-only">
        {BOOT_STAGES.join(", ")}. Press any key to skip.
      </span>
    </div>
  );
}
