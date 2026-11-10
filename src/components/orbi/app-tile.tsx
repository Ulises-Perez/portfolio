import type { CSSProperties } from "react";

import { GlyphMark } from "@/components/orbi/glyphs";
import type { Glyph } from "@/data/site.config";

/**
 * The tile of an app: a square with its mark and a bar of its own accent at
 * the foot.
 *
 * A project that has a glyph draws it; one that only has a name falls back to
 * its initial. One geometry for every tile, so the desktop reads as one set;
 * the shape and the colour are the parts that differ, and both come from the
 * data.
 *
 * It is drawn at 20px in the dock, 44 on the desktop and 44 on a loading
 * screen, with the same proportions at every size.
 */
export function AppTile({
  initial,
  glyph,
  accent,
  size = 44,
  radius = 12,
  className = "",
}: {
  initial: string;
  glyph?: Glyph;
  accent?: string;
  size?: number;
  radius?: number;
  className?: string;
}) {
  return (
    <span
      className={`os-tile ${className}`}
      data-glyph={glyph ? "" : undefined}
      data-dense={size < 30 ? "" : undefined}
      style={
        {
          width: size,
          height: size,
          borderRadius: radius,
          "--tile-accent": accent ?? "var(--muted)",
          "--tile-size": `${size}px`,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      {glyph ? (
        <span className="os-tile__glyph">
          <GlyphMark glyph={glyph} size={Math.round(size * 0.56)} />
        </span>
      ) : (
        <span className="os-tile__letter">{initial}</span>
      )}
      <span className="os-tile__bar" />
    </span>
  );
}
