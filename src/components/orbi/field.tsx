"use client";

import { useEffect } from "react";

/**
 * The orbital field — the wallpaper of the system.
 *
 * A drawn environment, not a picture: four hairline trajectories at different
 * scales and tilts, crossing asymmetrically so no two share a centre; two
 * light points that ride two of them at different, prime-ish speeds; a field
 * of few placed stars; and two pools of volumetric light that drift too slowly
 * to be watched. The whole scene is one SVG plus two gradients, so it scales
 * with the viewport and costs nothing while windows move.
 *
 * The field answers the cursor with a depth parallax of a few pixels across
 * three layers — enough to feel alive, never enough to move the eye off a
 * window. `prefers-reduced-motion` stops the travellers, the drift and the
 * parallax; the composition itself never changes.
 */

/** The four trajectories, in the 1600 × 1000 viewBox of the field. */
const ORBITS = [
  { cx: 820, cy: 430, rx: 720, ry: 300, rotate: -18 },
  { cx: 620, cy: 540, rx: 540, ry: 230, rotate: -25 },
  { cx: 1020, cy: 380, rx: 380, ry: 480, rotate: 22 },
  { cx: 780, cy: 620, rx: 270, ry: 160, rotate: -12 },
] as const;

/** The stars: few, placed, each on its own twinkle clock. */
const STARS = [
  { x: 180, y: 160, r: 1.6, o: 0.7, t: 9 },
  { x: 420, y: 80, r: 1, o: 0.5, t: 13 },
  { x: 700, y: 210, r: 1.3, o: 0.6, t: 7 },
  { x: 1180, y: 120, r: 1.7, o: 0.75, t: 11 },
  { x: 1420, y: 300, r: 1, o: 0.45, t: 8 },
  { x: 260, y: 620, r: 1.2, o: 0.6, t: 12 },
  { x: 880, y: 760, r: 1, o: 0.5, t: 10 },
  { x: 1300, y: 680, r: 1.5, o: 0.65, t: 14 },
  { x: 560, y: 880, r: 1, o: 0.4, t: 9 },
  { x: 1080, y: 500, r: 1.2, o: 0.55, t: 6 },
] as const;

export function OrbitalField() {
  /**
   * The parallax: one listener, one rAF, two custom properties. The layers
   * read `--mx` and `--my` in `globals.css`; nothing else knows the cursor
   * exists. Fine pointers only — a finger has no hover to answer.
   */
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const onMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = (event.clientY / window.innerHeight) * 2 - 1;

      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const root = document.documentElement;
        root.style.setProperty("--mx", x.toFixed(3));
        root.style.setProperty("--my", y.toFixed(3));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="os-field" aria-hidden="true">
      <span className="os-field__glow" />
      <span className="os-field__glow os-field__glow--far" />

      <svg
        className="os-field__paths"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {ORBITS.map((orbit, index) => (
            <ellipse
              key={index}
              id={`orbit-${index}`}
              cx={orbit.cx}
              cy={orbit.cy}
              rx={orbit.rx}
              ry={orbit.ry}
              transform={`rotate(${orbit.rotate} ${orbit.cx} ${orbit.cy})`}
            />
          ))}
        </defs>

        {/* The trajectories: hairlines, each on its own tilt and centre. */}
        {ORBITS.map((orbit, index) => (
          <use
            key={index}
            href={`#orbit-${index}`}
            className={`os-field__orbit os-field__orbit--${index + 1}`}
          />
        ))}

        {/* Two travellers, on two orbits, at speeds that never meet. */}
        <g className="os-field__travellers">
          <circle r="3.2" className="os-field__traveller">
            <animateMotion dur="84s" repeatCount="indefinite" rotate="0">
              <mpath href="#orbit-1" />
            </animateMotion>
          </circle>
          <circle r="2.4" className="os-field__traveller os-field__traveller--dim">
            <animateMotion
              dur="131s"
              repeatCount="indefinite"
              rotate="0"
              keyPoints="1;0"
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href="#orbit-2" />
            </animateMotion>
          </circle>
        </g>

        {/* The stars: placed, few, each on its own clock. */}
        {STARS.map((star, index) => (
          <circle
            key={index}
            cx={star.x}
            cy={star.y}
            r={star.r}
            className="os-field__star"
            style={{ opacity: star.o, animationDuration: `${star.t}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
