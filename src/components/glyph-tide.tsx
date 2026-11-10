"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export interface GlyphTideProps {
  /** Water colour, then foam colour. */
  colors?: [string, string];
  backgroundColor?: string;
  /** Glyph ramp from lightest to heaviest; first glyph is used for empty cells. */
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  /** Landscape size: larger values give broader flats and bigger pools. */
  scale?: number;
  /** Average water level, 0 (dry flats) to 1 (almost fully flooded). */
  level?: number;
  /** How far the tide rises and falls around `level`. */
  tideRange?: number;
  /** Seconds for one full rise and fall. */
  tidePeriod?: number;
  /** Strength of the swell rolling across the water. */
  waves?: number;
  /** Brightness and width of the foam line. */
  foam?: number;
  /** Visibility of the dotted contour lines on the exposed flats. */
  contours?: number;
  /** How long the sand stays wet after the tide pulls back. */
  wetSand?: number;
  /** How much deeper water quietens, 0 to 1. */
  depthFade?: number;
  brightness?: number;
  speed?: number;
  /** The pointer drags the tide and leaves a glowing trail. */
  interactive?: boolean;
  cursorRadius?: number;
  cursorStrength?: number;
  wake?: number;
  wakeLength?: number;
  rippleSize?: number;
  clickRipples?: boolean;
  seed?: number;
  paused?: boolean;
  /** Upper bound for the device pixel ratio. */
  dpr?: number;
  className?: string;
  style?: CSSProperties;
  /** Content layered above the map. */
  children?: ReactNode;
}

const DEFAULTS = {
  colors: ["#5227FF", "#FF9FFC"] as [string, string],
  backgroundColor: "#0a0a0a",
  characters: " .:~+*#%@",
  fontSize: 11,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  scale: 1,
  level: 0.42,
  tideRange: 0.85,
  tidePeriod: 36,
  waves: 1,
  foam: 1,
  contours: 1,
  wetSand: 0.6,
  depthFade: 0.6,
  brightness: 1,
  speed: 1,
  interactive: true,
  cursorRadius: 80,
  cursorStrength: 1,
  wake: 1,
  wakeLength: 2,
  rippleSize: 1,
  clickRipples: true,
  seed: 0,
  paused: false,
  dpr: 2,
};

type Props = Required<Omit<GlyphTideProps, "className" | "style" | "children">>;

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const hex2rgb = (h: string): [number, number, number] => {
  h = h.replace("#", "");
  if (h.length < 6) h = h.split("").map(c => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;

/**
 * An ASCII tide that floods and drains the shore. The land is fixed; the sea
 * rolls, the waterline foams, the pointer drags the water and clicks ripple.
 */
export function GlyphTide(props: GlyphTideProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef<Props>({ ...DEFAULTS, ...props } as Props);
  propsRef.current = { ...DEFAULTS, ...props } as Props;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }) as CanvasRenderingContext2D;

    let cell = propsRef.current.fontSize;
    let cols = 0;
    let rows = 0;
    let W = 0;
    let H = 0;
    let land = new Float32Array(0);
    let wet = new Float32Array(0);
    let disp = new Float32Array(0);
    let glow = new Float32Array(0);
    let noise = new Float32Array(0);
    let pal = { water: "", waterLit: "", foam: "", wet: "", contour: "", contourFine: "" };
    let palSig = "";
    let landSig = "";
    let tideLow = 0;
    let tideHigh = 1;
    let tideTime = 0;
    let last = performance.now();
    let frameId = 0;

    const ripples: { x: number; y: number; t: number }[] = [];
    const trail: { x: number; y: number; t: number }[] = [];
    const nowSec = () => performance.now() / 1000;

    function buildColors() {
      const P = propsRef.current;
      const bg = hex2rgb(P.backgroundColor === "transparent" ? "#0a0a0a" : P.backgroundColor);
      const water = hex2rgb(P.colors[0]).map(v => Math.round(v * P.brightness));
      const foam = hex2rgb(P.colors[1]).map(v => Math.round(v * P.brightness));
      const flat = mix(water, bg, 0.55);
      pal = {
        water: rgb(water),
        waterLit: rgb(water.map((v, i) => Math.round(v + ([255, 255, 255][i] - v) * 0.3))),
        foam: rgb(foam),
        wet: rgb(mix(flat, bg, 0.15)),
        contour: rgb(mix(water, bg, 0.3)),
        contourFine: rgb(mix(water, bg, 0.45)),
      };
    }

    function buildLand() {
      const P = propsRef.current;
      const s = 260 * P.scale;
      const oct: { a: number; f: number; amp: number; ph: number }[] = [];
      let norm = 0;
      for (let o = 0; o < 6; o++) {
        const amp = Math.pow(0.52, o);
        norm += amp;
        oct.push({
          a: hash(P.seed * 13 + o * 97) * Math.PI * 2,
          f: Math.pow(2.03, o),
          amp,
          ph: hash(P.seed * 7 + o * 31) * Math.PI * 2,
        });
      }
      // Domain warp bends the ridges into bays and headlands instead of
      // straight fingers.
      const warpA = s * 0.32;
      const ws = s * 1.4;
      land = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * cell;
          const py = y * cell;
          const wx = px + warpA * Math.sin((py / ws) * 2.1 + P.seed * 1.7);
          const wy = py + warpA * Math.cos((px / ws) * 1.7 + P.seed * 2.3);
          let v = 0;
          for (const o of oct) {
            v += o.amp * Math.sin((wx * Math.cos(o.a) + wy * Math.sin(o.a)) * o.f / s + o.ph);
          }
          land[y * cols + x] = clamp(0.5 + (v / norm) * 0.95);
        }
      }

      // Keep land and sea on screen: the tide is clamped to the 10th/90th
      // height percentile of this landscape.
      const bins = new Uint32Array(64);
      for (let i = 0; i < land.length; i++) bins[Math.min(63, Math.floor(land[i] * 64))]++;
      const total = land.length;
      const quantile = (q: number) => {
        let acc = 0;
        for (let b = 0; b < 64; b++) {
          acc += bins[b];
          if (acc >= total * q) return (b + 0.5) / 64;
        }
        return 1;
      };
      tideLow = quantile(0.1);
      tideHigh = quantile(0.9);

      wet = new Float32Array(cols * rows).fill(-1e9);
      disp = new Float32Array(cols * rows);
      glow = new Float32Array(cols * rows);
      noise = new Float32Array(cols * rows);
      for (let i = 0; i < noise.length; i++) noise[i] = hash(i * 0.731 + P.seed);
    }

    function resize() {
      const P = propsRef.current;
      W = host!.clientWidth;
      H = host!.clientHeight;
      if (!W || !H) return;
      const ratio = Math.min(P.dpr, window.devicePixelRatio || 1);
      canvas!.width = Math.round(W * ratio);
      canvas!.height = Math.round(H * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      cell = P.fontSize;
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      buildColors();
      buildLand();
      palSig = [P.colors.join(), P.backgroundColor, P.brightness].join("|");
      landSig = [P.seed, P.scale, P.fontSize, cols, rows].join("|");
    }

    const ac = new AbortController();
    host.addEventListener(
      "pointermove",
      (e: PointerEvent) => {
        if (!propsRef.current.interactive) return;
        const r = host.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const prev = trail[trail.length - 1];
        if (prev && Math.hypot(x - prev.x, y - prev.y) < cell * 0.6) return;
        trail.push({ x, y, t: nowSec() });
        if (trail.length > 240) trail.shift();
      },
      { signal: ac.signal },
    );
    host.addEventListener(
      "pointerdown",
      (e: PointerEvent) => {
        if (!propsRef.current.clickRipples) return;
        const r = host.getBoundingClientRect();
        ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: nowSec() });
      },
      { signal: ac.signal },
    );

    const ro = new ResizeObserver(() => resize());
    ro.observe(host);

    function frame(now: number) {
      const P = propsRef.current;
      const rt = now / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!P.paused) tideTime += dt * P.speed;

      const pSig = [P.colors.join(), P.backgroundColor, P.brightness].join("|");
      if (pSig !== palSig) {
        buildColors();
        palSig = pSig;
      }
      const lSig = [P.seed, P.scale, P.fontSize, cols, rows].join("|");
      if (lSig !== landSig) {
        resize();
      }

      while (trail.length && rt - trail[0].t > P.wakeLength) trail.shift();

      disp.fill(0);
      glow.fill(0);

      // Click ripples: a wave packet leaving the click point.
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rp = ripples[r];
        const age = rt - rp.t;
        if (age > 5) {
          ripples.splice(r, 1);
          continue;
        }
        const reach = age * 240 * P.rippleSize + 20;
        const rmax = reach + 50 * P.rippleSize;
        const i0 = Math.max(0, Math.floor((rp.x - rmax) / cell));
        const i1 = Math.min(cols - 1, Math.ceil((rp.x + rmax) / cell));
        const j0 = Math.max(0, Math.floor((rp.y - rmax) / cell));
        const j1 = Math.min(rows - 1, Math.ceil((rp.y + rmax) / cell));
        for (let y = j0; y <= j1; y++) {
          for (let x = i0; x <= i1; x++) {
            const dx = x * cell + cell / 2 - rp.x;
            const dy = y * cell + cell / 2 - rp.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > rmax) continue;
            const front = d - reach;
            const w = 45 * P.rippleSize;
            const a = 0.16 * Math.exp(-age * 0.9) * Math.exp(-Math.abs(front) / w);
            const i = y * cols + x;
            disp[i] += a * Math.sin(front / (18 * P.rippleSize));
            glow[i] += 0.9 * Math.exp(-age * 1.6) * Math.exp(-Math.abs(front) / (25 * P.rippleSize));
          }
        }
      }

      // Pointer: drags the water and leaves a continuous liquid trail.
      const rad = P.cursorRadius;
      const halo = Math.max(12, rad * 0.4);
      const core = Math.max(cell * 0.9, 4);
      const reachR = Math.max(rad, halo);
      for (let k = 0; k < trail.length; k++) {
        const a = trail[k];
        const b = trail[k + 1] ?? a;
        const ageA = rt - a.t;
        if (ageA > P.wakeLength) continue;
        const fadeA = Math.exp(-ageA / Math.max(0.15, P.wakeLength * 0.45));
        const fadeB = Math.exp(-(rt - b.t) / Math.max(0.15, P.wakeLength * 0.45));
        const vx = b.x - a.x;
        const vy = b.y - a.y;
        const len2 = vx * vx + vy * vy;
        const i0 = Math.max(0, Math.floor((Math.min(a.x, b.x) - reachR) / cell));
        const i1 = Math.min(cols - 1, Math.ceil((Math.max(a.x, b.x) + reachR) / cell));
        const j0 = Math.max(0, Math.floor((Math.min(a.y, b.y) - reachR) / cell));
        const j1 = Math.min(rows - 1, Math.ceil((Math.max(a.y, b.y) + reachR) / cell));
        for (let y = j0; y <= j1; y++) {
          const py = y * cell + cell / 2;
          for (let x = i0; x <= i1; x++) {
            const px = x * cell + cell / 2;
            let s = len2 ? ((px - a.x) * vx + (py - a.y) * vy) / len2 : 0;
            s = s < 0 ? 0 : s > 1 ? 1 : s;
            const dx = px - (a.x + vx * s);
            const dy = py - (a.y + vy * s);
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > reachR) continue;
            const fade = fadeA + (fadeB - fadeA) * s;
            const i = y * cols + x;
            if (d < rad) {
              const w = 1 - d / rad;
              disp[i] = Math.max(disp[i], P.cursorStrength * 0.22 * fade * w * w);
            }
            if (d < halo) {
              const g = 1 - d / halo;
              let v = P.wake * 0.7 * fade * g * g;
              if (d < core) v += P.wake * 0.55 * fade;
              glow[i] = Math.max(glow[i], v);
            }
          }
        }
      }

      for (let i = 0; i < disp.length; i++) {
        if (disp[i] > 0.35) disp[i] = 0.35;
        else if (disp[i] < -0.35) disp[i] = -0.35;
        if (glow[i] > 1.3) glow[i] = 1.3;
      }

      // ---- draw
      ctx.fillStyle = P.backgroundColor === "transparent" ? "#0a0a0a" : P.backgroundColor;
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${cell}px ${P.fontFamily}`;

      const chars = P.characters;
      const n = chars.length;
      const tide = clamp(
        P.level + 0.5 * P.tideRange * Math.sin((Math.PI * 2 * tideTime) / P.tidePeriod),
        Math.min(tideLow, P.level),
        Math.max(tideHigh, P.level),
      );
      const fw = 0.008 + 0.026 * P.foam;
      const swellAmp = 0.035 * P.waves;
      let curColor: string | null = null;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          const px = x * cell + cell / 2;
          const py = y * cell + cell / 2;
          const h = land[i];

          // Swell: two travelling waves, the motion the sea lives on.
          let swell = 0;
          if (swellAmp > 0) {
            swell = swellAmp * (
              Math.sin((px * 0.8 + py * 0.45) * 0.006 + tideTime * 0.55) * 0.7 +
              Math.sin((px * -0.3 + py) * 0.011 - tideTime * 0.4) * 0.5
            );
          }
          const wl = tide + swell + disp[i];
          const d = wl - h;
          let ch = " ";
          let color = "";

          if (d > 0) {
            wet[i] = rt;
            if (d < fw) {
              // Foam: a fine dotted line, denser and heavier at the edge.
              const q = 1 - d / fw;
              if (noise[i] < 0.55 + 0.45 * q) {
                ch = chars[Math.min(n - 1, 4 + Math.round(q * (n - 5)))];
                color = pal.foam;
              }
            } else {
              const shallow = 1 - Math.min(1, d / 0.5);
              const depthK = 1 - 0.3 * P.depthFade * Math.min(1, d / 0.8);
              // Rows of tide lines travelling across the water, soft and slow.
              const band = 0.5 + 0.5 * Math.sin(
                (py * Math.PI) / cell + px * 0.0008 - tideTime * 0.55,
              );
              let b = (0.42 + 0.34 * shallow) * depthK * (0.3 + 0.9 * Math.pow(band, 1.3)) * P.brightness;
              b = clamp((b + glow[i] * 1.1) * (0.95 + 0.05 * noise[i]));
              if (glow[i] > 0.6) {
                ch = chars[n - 2];
                color = pal.foam;
              } else {
                let k = Math.min(3, Math.round(b * 0.78 * (n - 1)));
                if (k <= 1) k = noise[i] < 0.45 ? 1 : 0;
                ch = chars[k];
                color = k >= 2 ? pal.waterLit : pal.water;
              }
            }
          } else {
            // Land reads as terrain: contour lines at two scales, plus a
            // grain so dry flats are never a blank field.
            const damp = P.wetSand > 0 ? Math.exp(-(rt - wet[i]) / (0.4 + P.wetSand * 2.2)) : 0;
            if (damp > 0.03) {
              const b = clamp(0.5 * damp * P.brightness);
              ch = chars[clamp(Math.round(b * (n - 1)), 1, n - 3)];
              color = pal.wet;
            } else if (P.contours > 0) {
              const f = (h * 14) % 1;
              if (f < 0.075 * P.contours + 0.012) {
                ch = chars[2];
                color = pal.contour;
              } else if (noise[i] < 0.22 * P.contours * (0.6 + 0.4 * (1 - h))) {
                // Sand grain: dim dots that keep the flats legible.
                ch = chars[1];
                color = pal.contourFine;
              }
            }
          }

          if (ch !== " ") {
            if (color !== curColor) {
              ctx.fillStyle = color;
              curColor = color;
            }
            ctx.fillText(ch, px, py);
          }
        }
      }

      frameId = requestAnimationFrame(frame);
    }

    resize();
    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      ac.abort();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`relative ${props.className ?? ""}`}
      style={props.style}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      {props.children}
    </div>
  );
}
