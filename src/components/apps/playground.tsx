"use client";

import { GlyphTide } from "@/components/glyph-tide";

/**
 * Playground — the one experimental surface of the system.
 *
 * The tide is drawn in characters on a canvas and answers the pointer. It
 * wears the orbital palette, so the experiment reads as part of Orbi OS rather
 * than as a demo pasted into it.
 */
export function PlaygroundApp() {
  return (
    <div className="os-app h-full">
      <div className="os-app__head flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="os-app__eyebrow">playground · experiments</p>
          <h2 className="os-app__title">Glyph tide</h2>
        </div>
        <span className="os-chip">drag the water · click to ripple</span>
      </div>

      <div className="relative min-h-[22rem] flex-1 overflow-hidden">
        <GlyphTide
          className="absolute inset-0"
          colors={["#a9bce5", "#f2f3f5"]}
          backgroundColor="#101216"
          fontSize={10}
          level={0.44}
          tideRange={0.7}
          cursorRadius={90}
          wake={1.1}
        />
      </div>
    </div>
  );
}
