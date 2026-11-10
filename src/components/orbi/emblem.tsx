/**
 * The emblem of Orbi — the cinematic scene.
 *
 * The mark, at the scale of a place: a dark sphere hanging in one drawn
 * trajectory, lit from the lower left the way a body is lit by a near star.
 * The orbit passes behind the sphere and in front of it, the satellite sits
 * at the vertex where the light catches, and the halo is the only volume in
 * the composition. Everything is a gradient or a hairline — no filters — so
 * the whole scene is one composited layer that never repaints.
 *
 * The same drawing is the boot screen's construction and the desktop's
 * centre: `sphere`, `orbit` and `satellite` are 0..1 arrival values the boot
 * clock drives; at 1 the scene is simply there, breathing under
 * `prefers-reduced-motion: no-preference`.
 */

type EmblemProps = {
  /** 0..1 arrival of the sphere. Default 1. */
  sphere?: number;
  /** 0..1 draw of the orbit. Default 1. */
  orbit?: number;
  /** 0..1 arrival of the satellite. Default 1. */
  satellite?: number;
  /** Rendered width in CSS pixels. */
  width?: number;
  className?: string;
};

export function Emblem({
  sphere = 1,
  orbit = 1,
  satellite = 1,
  width = 460,
  className = "",
}: EmblemProps) {
  const draw = 100 * (1 - orbit);

  return (
    <svg
      width={width}
      height={(width * 360) / 560}
      viewBox="0 0 560 360"
      fill="none"
      className={`os-emblem ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="em-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--emblem-halo, #a9bce5)" stopOpacity="0.32" />
          <stop offset="55%" stopColor="var(--emblem-halo, #a9bce5)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--emblem-halo, #a9bce5)" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="em-body" cx="34%" cy="70%" r="80%">
          <stop offset="0%" stopColor="var(--emblem-lit, #2a3448)" />
          <stop offset="38%" stopColor="var(--emblem-body, #12161e)" />
          <stop offset="100%" stopColor="var(--emblem-deep, #0a0d13)" />
        </radialGradient>

        <linearGradient id="em-ring" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--emblem-ring, #e8eef9)" />
          <stop offset="45%" stopColor="var(--emblem-ring-mid, #a9bce5)" />
          <stop offset="100%" stopColor="var(--emblem-ring-dim, #4e5f80)" />
        </linearGradient>

        <radialGradient id="em-bead" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="var(--emblem-ring, #e8eef9)" />
          <stop offset="100%" stopColor="var(--emblem-ring-mid, #a9bce5)" />
        </radialGradient>
      </defs>

      {/* The far half of the orbit, behind the sphere. */}
      <g transform="rotate(-16 280 180)">
        <path
          d="M70 180A210 82 0 0 1 490 180"
          stroke="url(#em-ring)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity={0.5 * orbit}
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={draw}
        />
      </g>

      {/* The sphere, lit from the lower left. */}
      <g
        style={{
          opacity: sphere,
          transform: `scale(${0.94 + sphere * 0.06})`,
          transformOrigin: "280px 180px",
        }}
      >
        <circle cx="280" cy="180" r="88" fill="url(#em-body)" />
        {/* The rim: one stroke, bright where the star strikes. */}
        <circle
          cx="280"
          cy="180"
          r="88"
          stroke="url(#em-ring)"
          strokeWidth="2.2"
          opacity="0.9"
        />
        {/* The crescent: the lit limb, where the star actually strikes. */}
        <circle
          cx="280"
          cy="180"
          r="88"
          stroke="var(--emblem-ring, #e8eef9)"
          strokeWidth="3.2"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="17 83"
          strokeDashoffset={-33}
          opacity="0.95"
        />
        {/* The night side falls away past the rim. */}
        <path
          d="M280 92A88 88 0 0 1 280 268"
          stroke="var(--emblem-deep, #0a0d13)"
          strokeWidth="7"
          opacity="0.45"
          transform="rotate(24 280 180)"
        />
      </g>

      {/* One distant trajectory crossing the body: the diagram reads through
          the sphere and breaks its silhouette on purpose. */}
      <g transform="rotate(14 280 180)">
        <path
          d="M20 250C160 140 400 140 540 250"
          stroke="var(--emblem-ring-dim, #4e5f80)"
          strokeWidth="1"
          opacity="0.22"
        />
      </g>

      {/* The near half of the orbit, crossing in front of the sphere. */}
      <g transform="rotate(-16 280 180)">
        <path
          d="M490 180A210 82 0 0 1 70 180"
          stroke="url(#em-ring)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={orbit}
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={draw}
        />
        {/* The light catch: the arc brightens as it passes the satellite. */}
        <path
          d="M490 180A210 82 0 0 1 70 180"
          pathLength={100}
          strokeDasharray="9 91"
          stroke="var(--emblem-ring, #e8eef9)"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity={satellite}
          className="os-emblem__catch"
        />
      </g>

      {/* The satellite, seated at the vertex. */}
      <g className="os-emblem__sat" style={{ opacity: satellite }}>
        <circle cx="482" cy="122" r="16" fill="url(#em-halo)" opacity="0.7" />
        <circle cx="482" cy="122" r="7.5" fill="url(#em-bead)" />
        <circle cx="479.5" cy="119.5" r="2.4" fill="var(--emblem-glint, #ffffff)" opacity="0.85" />
      </g>

      {/* The field of the scene: few points, placed, not scattered. */}
      <g className="os-emblem__stars" fill="var(--emblem-star, #c6d2e8)">
        <circle cx="86" cy="74" r="1.6" opacity="0.7" />
        <circle cx="168" cy="42" r="1" opacity="0.5" />
        <circle cx="402" cy="58" r="1.4" opacity="0.65" />
        <circle cx="512" cy="212" r="1" opacity="0.5" />
        <circle cx="122" cy="286" r="1.2" opacity="0.6" />
        <circle cx="348" cy="312" r="1" opacity="0.45" />
        <circle cx="452" cy="308" r="1.6" opacity="0.7" />
        <circle cx="52" cy="176" r="1" opacity="0.5" />
        <circle cx="248" cy="26" r="1.2" opacity="0.55" />
      </g>
    </svg>
  );
}
