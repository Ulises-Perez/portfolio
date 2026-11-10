/**
 * The mark of Orbi — the apogee.
 *
 * One core resting at the focus of one tilted orbit, never at its centre:
 * the asymmetry is what separates it from a generic planet icon. The far arc
 * passes behind the core at half light; the near arc crosses in front of it.
 * The signature is the seat at the right vertex: the satellite rides the orbit
 * exactly where the light catches it, and the arc brightens for one short dash
 * as it passes — one detail, the same detail, at every size.
 *
 * One 32-unit grid: the orbit is 12.6 × 6.1 rotated −26° about (16, 14.6), the
 * core is a 4.8 disc at the low focus, the satellite a 1.7 bead at the vertex.
 * Drawn with `currentColor` and one accent seat, so the same file works on
 * obsidian and on cloud without a second variant.
 */

type MarkProps = {
  /** Rendered size in pixels; the viewBox does the rest. */
  size?: number;
  className?: string;
  /** The title the mark announces; omit for decoration. */
  title?: string;
};

export function Mark({ size = 18, className = "", title }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      {/* The far half of the orbit, behind the core. */}
      <g transform="rotate(-26 16 14.6)">
        <path
          d="M3.4 14.6A12.6 6.1 0 0 1 28.6 14.6"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.45}
        />
      </g>

      {/* The core, at the low focus of the orbit. */}
      <circle cx="11.6" cy="18.4" r="4.8" fill="currentColor" />

      {/* The near half, crossing in front of the core. */}
      <g transform="rotate(-26 16 14.6)">
        <path
          d="M28.6 14.6A12.6 6.1 0 0 1 3.4 14.6"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        {/* The light catch: the arc brightens as it passes the satellite. */}
        <path
          d="M28.6 14.6A12.6 6.1 0 0 1 3.4 14.6"
          pathLength={100}
          strokeDasharray="11 89"
          stroke="var(--accent, #a9bce5)"
          strokeWidth={2.2}
          strokeLinecap="round"
          data-satellite=""
        />
      </g>

      {/* The satellite, seated at the vertex. */}
      <circle
        cx="27.32"
        cy="9.08"
        r="1.7"
        fill="var(--accent, #a9bce5)"
        data-satellite=""
      />
    </svg>
  );
}
