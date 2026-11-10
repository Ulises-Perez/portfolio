import type { Glyph } from "@/data/site.config";

/**
 * The glyphs a project can wear.
 *
 * Six shapes, one per kind of product, drawn on the same 24-unit grid with the
 * same stroke so the set reads as one family. The project picks its glyph in
 * `site.config.ts`; nothing here knows the name of a project.
 *
 * Each mark carries one solid mass and one open line: at 10px in the dock the
 * solid keeps the shape legible, and the line keeps it from filling into a
 * blob at 44px on the desktop. Nothing is drawn with a variable opacity — a
 * glyph is a silhouette, not a wash.
 */
const GLYPHS: Record<Glyph, React.ReactNode> = {
  // Parts in orbit: an api, a cloud and a client around one centre.
  orbit: (
    <>
      <ellipse cx="12" cy="12" rx="9.2" ry="4.4" transform="rotate(-28 12 12)" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
      <circle cx="19.6" cy="6.8" r="1.9" fill="currentColor" stroke="none" />
    </>
  ),
  // A streaming catalogue: a screen with a strip of covers under it.
  screen: (
    <>
      <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
      <path d="M7 21h10" />
      <path d="M12 16.5V21" />
      <path d="m9.8 6.9 5.6 3.1-5.6 3.1z" fill="currentColor" stroke="none" />
    </>
  ),
  // A player: the bars of a waveform, one of them taller.
  wave: (
    <>
      <path d="M4 9.5v5" strokeLinecap="round" />
      <path d="M8 6.5v11" strokeLinecap="round" />
      <rect x="10.75" y="3.5" width="2.5" height="17" rx="1.25" fill="currentColor" stroke="none" />
      <path d="M16 7.5v9" strokeLinecap="round" />
      <path d="M20 9.5v5" strokeLinecap="round" />
    </>
  ),
  // A catalogue of films: a stack of covers, the top one solid.
  layers: (
    <>
      <path d="m12 2.8 8.6 4.3L12 11.4 3.4 7.1z" fill="currentColor" stroke="none" />
      <path d="m3.4 11.9 8.6 4.3 8.6-4.3" />
      <path d="m3.4 16.3 8.6 4.3 8.6-4.3" />
    </>
  ),
  // A scraped index: a grid of cells, the diagonal pair filled.
  grid: (
    <>
      <rect x="2.8" y="2.8" width="8.4" height="8.4" rx="1.6" fill="currentColor" stroke="none" />
      <rect x="12.8" y="2.8" width="8.4" height="8.4" rx="1.6" />
      <rect x="2.8" y="12.8" width="8.4" height="8.4" rx="1.6" />
      <rect x="12.8" y="12.8" width="8.4" height="8.4" rx="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  // A plain document site: a page with a folded corner and a masthead.
  page: (
    <>
      <path d="M4.5 2.8h9.7l5.3 5.3v13.1h-15z" />
      <path d="M14.2 2.8v5.3h5.3" />
      <path d="M8 11.2h8" strokeLinecap="round" />
      <path d="M8 15h5" strokeLinecap="round" />
      <rect x="8" y="17.2" width="4.5" height="1.6" rx=".8" fill="currentColor" stroke="none" />
    </>
  ),
};

export function GlyphMark({ glyph, size = 22 }: { glyph: Glyph; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.55}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[glyph]}
    </svg>
  );
}
