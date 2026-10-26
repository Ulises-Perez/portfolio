"use client";

import { useRef, useState, useCallback } from "react";
import type { WorkScreen } from "@/data/site.config";
/**
 * The screen of a work, drawn.
 *
 * None of the featured projects has a live deployment to photograph, so the
 * frame holds an interface drawn from the identity of the project: its own
 * accent color, its own navigation and its own content blocks. It is vector,
 * so it weighs nothing, and it is honest about what it is.
 *
 * The screen always wears the dark palette of an application, the same way a
 * photograph of a product would, so the accent reads the same in both themes.
 */
const PALETTE = {
  background: "#141618",
  panel: "#1e2226",
  raised: "#272c30",
  line: "#303639",
  strong: "#e2e6e1",
  muted: "#8b9390",
} as const;

type ScreenProps = {
  accent: string;
  screen: WorkScreen;
  /** The name of the work, the way the product brands itself. */
  name: string;
};

const WIDTH = 960;
const HEIGHT = 600;

/** The navigation of the product, right aligned in the top bar. */
function TopBar({
  accent,
  name,
  nav,
}: {
  accent: string;
  name: string;
  nav: string[];
}) {
  return (
    <>
      <rect width={WIDTH} height={46} fill={PALETTE.panel} />
      <rect y={45} width={WIDTH} height={1} fill={PALETTE.line} />
      <circle cx={30} cy={23} r={6} fill={accent} />
      <text
        x={44}
        y={28}
        fontSize={13}
        fontWeight={700}
        fill={PALETTE.strong}
      >
        {name}
      </text>
      {nav.map((item, index) => (
        <text
          key={item}
          x={920 - index * 96}
          y={28}
          fontSize={10}
          letterSpacing="0.12em"
          fill={PALETTE.muted}
          textAnchor="end"
        >
          {item.toUpperCase()}
        </text>
      ))}
    </>
  );
}

/** A website: a hero and a row of covers. */
function SiteScreen({ accent, screen, name }: ScreenProps) {
  const columns = screen.items.length;
  const gap = (864 - columns * 152) / Math.max(columns - 1, 1);

  return (
    <>
      <TopBar accent={accent} name={name} nav={screen.nav} />

      <rect x={48} y={78} width={864} height={148} fill={PALETTE.panel} />
      <rect x={48} y={78} width={4} height={148} fill={accent} />
      <text
        x={76}
        y={134}
        fontSize={30}
        fontWeight={700}
        fill={PALETTE.strong}
      >
        {screen.headline}
      </text>
      <text x={76} y={162} fontSize={13} fill={PALETTE.muted}>
        {screen.sub}
      </text>
      <rect x={76} y={182} width={112} height={26} fill={accent} />
      <text
        x={132}
        y={199}
        fontSize={10}
        fontWeight={700}
        letterSpacing="0.12em"
        fill={PALETTE.background}
        textAnchor="middle"
      >
        EXPLORE
      </text>
      <rect
        x={690}
        y={98}
        width={198}
        height={108}
        fill={accent}
        opacity={0.22}
      />
      <rect
        x={714}
        y={122}
        width={150}
        height={60}
        fill={accent}
        opacity={0.5}
      />

      <text
        x={48}
        y={258}
        fontSize={9}
        letterSpacing="0.2em"
        fill={PALETTE.muted}
      >
        {screen.nav[1]?.toUpperCase() ?? "FEATURED"}
      </text>

      {screen.items.map((item, index) => {
        const x = 48 + index * (152 + gap);

        return (
          <g key={item.label}>
            <rect x={x} y={272} width={152} height={228} fill={PALETTE.panel} />
            <rect
              x={x + 8}
              y={280}
              width={136}
              height={160}
              fill={accent}
              opacity={0.16 + (index % 3) * 0.14}
            />
            <rect
              x={x + 8}
              y={280}
              width={136}
              height={72}
              fill={accent}
              opacity={0.44 - (index % 2) * 0.18}
            />
            <text
              x={x + 8}
              y={466}
              fontSize={12}
              fontWeight={700}
              fill={PALETTE.strong}
            >
              {item.label}
            </text>
            <text x={x + 8} y={486} fontSize={10} fill={PALETTE.muted}>
              {item.meta}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** A desktop application: a sidebar, some numbers and a table. */
function AppScreen({ accent, screen, name }: ScreenProps) {
  const numbers = ["1 284", "64 910", "99.9%"];

  return (
    <>
      <rect width={196} height={HEIGHT} fill={PALETTE.panel} />
      <rect x={195} width={1} height={HEIGHT} fill={PALETTE.line} />
      <circle cx={28} cy={30} r={6} fill={accent} />
      <text
        x={42}
        y={35}
        fontSize={12}
        fontWeight={700}
        fill={PALETTE.strong}
      >
        {name}
      </text>

      {screen.nav.map((item, index) => (
        <g key={item}>
          <rect
            x={20}
            y={78 + index * 38}
            width={4}
            height={18}
            fill={index === 0 ? accent : "transparent"}
          />
          <text
            x={36}
            y={92 + index * 38}
            fontSize={11}
            fontWeight={index === 0 ? 700 : 400}
            fill={index === 0 ? PALETTE.strong : PALETTE.muted}
          >
            {item}
          </text>
        </g>
      ))}

      <rect x={196} width={764} height={46} fill={PALETTE.background} />
      <rect x={196} y={45} width={764} height={1} fill={PALETTE.line} />
      <rect x={220} y={11} width={230} height={24} fill={PALETTE.raised} />
      <text x={234} y={27} fontSize={10} fill={PALETTE.muted}>
        Search
      </text>

      {["SESSIONS", "FILES", "UPTIME"].map((label, index) => (
        <g key={label}>
          <rect
            x={220 + index * 248}
            y={70}
            width={220}
            height={78}
            fill={PALETTE.panel}
          />
          <text
            x={240 + index * 248}
            y={98}
            fontSize={9}
            letterSpacing="0.18em"
            fill={PALETTE.muted}
          >
            {label}
          </text>
          <text
            x={240 + index * 248}
            y={130}
            fontSize={22}
            fontWeight={700}
            fill={PALETTE.strong}
          >
            {numbers[index]}
          </text>
        </g>
      ))}

      <rect x={220} y={172} width={716} height={330} fill={PALETTE.panel} />
      <rect x={220} y={172} width={716} height={34} fill={PALETTE.raised} />
      <text
        x={244}
        y={194}
        fontSize={9}
        letterSpacing="0.18em"
        fill={PALETTE.muted}
      >
        MODULE
      </text>
      <text
        x={912}
        y={194}
        fontSize={9}
        letterSpacing="0.18em"
        fill={PALETTE.muted}
        textAnchor="end"
      >
        RUNS ON
      </text>

      {screen.items.map((item, index) => (
        <g key={item.label}>
          <rect
            x={220}
            y={206 + index * 44}
            width={716}
            height={1}
            fill={PALETTE.line}
          />
          <rect
            x={244}
            y={220 + index * 44}
            width={12}
            height={12}
            fill={accent}
            opacity={0.45 + index * 0.2}
          />
          <text
            x={268}
            y={231 + index * 44}
            fontSize={12}
            fill={PALETTE.strong}
          >
            {item.label}
          </text>
          <text
            x={912}
            y={231 + index * 44}
            fontSize={11}
            fill={PALETTE.muted}
            textAnchor="end"
          >
            {item.meta}
          </text>
        </g>
      ))}

      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect
            x={244}
            y={372 + row * 40}
            width={640}
            height={10}
            fill={PALETTE.raised}
          />
          <rect
            x={244}
            y={372 + row * 40}
            width={180 + row * 90}
            height={10}
            fill={PALETTE.line}
          />
        </g>
      ))}
    </>
  );
}

/** A player: the cover of what plays now and the list behind it. */
function PlayerScreen({ accent, screen, name }: ScreenProps) {
  const current = screen.items[0];

  return (
    <>
      <TopBar accent={accent} name={name} nav={screen.nav} />

      <rect x={48} y={86} width={268} height={268} fill={accent} opacity={0.9} />
      <circle cx={182} cy={220} r={58} fill={PALETTE.background} opacity={0.88} />
      <circle cx={182} cy={220} r={16} fill={accent} />

      <text
        x={48}
        y={396}
        fontSize={26}
        fontWeight={700}
        fill={PALETTE.strong}
      >
        {current?.label ?? screen.headline}
      </text>
      <text x={48} y={420} fontSize={13} fill={PALETTE.muted}>
        {current?.meta ?? screen.sub}
      </text>

      <rect x={48} y={444} width={268} height={4} fill={PALETTE.line} />
      <rect x={48} y={444} width={126} height={4} fill={accent} />

      <circle cx={182} cy={490} r={26} fill={accent} />
      <path d="M176 481 L176 499 L193 490 Z" fill={PALETTE.background} />
      <circle
        cx={120}
        cy={490}
        r={16}
        fill="none"
        stroke={PALETTE.muted}
        strokeWidth={2}
      />
      <circle
        cx={244}
        cy={490}
        r={16}
        fill="none"
        stroke={PALETTE.muted}
        strokeWidth={2}
      />

      {screen.items.map((item, index) => (
        <g key={item.label}>
          <rect
            x={360}
            y={78 + index * 64}
            width={40}
            height={40}
            fill={accent}
            opacity={0.8 - index * 0.1}
          />
          <text
            x={416}
            y={95 + index * 64}
            fontSize={13}
            fill={PALETTE.strong}
          >
            {item.label}
          </text>
          <text
            x={416}
            y={113 + index * 64}
            fontSize={11}
            fill={PALETTE.muted}
          >
            {item.meta}
          </text>
          <rect
            x={360}
            y={130 + index * 64}
            width={552}
            height={1}
            fill={PALETTE.line}
          />
        </g>
      ))}
    </>
  );
}

/**
 * The window that frames the screen: a title bar with three traffic lights
 * and an address bar, featuring interactive 3D perspective tilt and specular reflection.
 */
export function ProjectScreen({ accent, screen, name }: ScreenProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glare, setGlare] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    const rotX = -(ny - 0.5) * 12;
    const rotY = (nx - 0.5) * 12;

    setTransform(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`,
    );
    setGlare({ x: nx * 100, y: ny * 100, opacity: 0.28 });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={frameRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="work-frame relative transition-transform duration-300 ease-out will-change-transform select-none"
      style={{
        transform,
        transformStyle: "preserve-3d",
        boxShadow: glare.opacity > 0 ? `0 24px 48px -12px ${accent}33` : undefined,
      }}
    >
      {/* Specular glare sheen */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 420px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.22) 0%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      <div className="work-frame__bar">
        <span className="work-frame__lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="work-frame__url">{screen.url}</span>
      </div>
      <div className="work-frame__screen">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`A drawn screen of ${name}`}
          className="h-full w-full"
        >
          <rect width={WIDTH} height={HEIGHT} fill={PALETTE.background} />
          {screen.kind === "app" ? (
            <AppScreen accent={accent} screen={screen} name={name} />
          ) : null}
          {screen.kind === "player" ? (
            <PlayerScreen accent={accent} screen={screen} name={name} />
          ) : null}
          {screen.kind === "site" ? (
            <SiteScreen accent={accent} screen={screen} name={name} />
          ) : null}
        </svg>
      </div>
    </div>
  );
}
