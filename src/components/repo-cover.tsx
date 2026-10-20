type RepoCoverProps = {
  name: string;
  variant?: "thumb" | "panel";
  className?: string;
};

function hash(value: string): number {
  let result = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }

  return result >>> 0;
}

function noise(seed: number, x: number, y: number): number {
  const value = Math.sin(seed * 0.0001 + x * 12.9898 + y * 78.233) * 43758.5453;

  return value - Math.floor(value);
}

/**
 * Deterministic cover art for a repository, so the portfolio ships no binary
 * assets and every project still gets a distinct visual identity.
 *
 * The cells are drawn as two paths instead of one rectangle each: a rendered
 * rectangle carries its own attributes and the server renderer separates them
 * with comments, which made the exported page weigh a hundred and seventy
 * kilobytes more than the whole rest of the site. The empty cells are left
 * out entirely, they were never visible.
 */
export function RepoCover({ name, variant = "thumb", className = "" }: RepoCoverProps) {
  const seed = hash(name);
  const columns = variant === "panel" ? 12 : 6;
  const rows = variant === "panel" ? 7 : 8;

  let solid = "";
  let soft = "";

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      const fill = noise(seed, x, y);

      if (fill > 0.55) solid += `M${x} ${y}h1v1h-1z`;
      else if (fill > 0.34) soft += `M${x} ${y}h1v1h-1z`;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${columns} ${rows}`}
      preserveAspectRatio="none"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {solid ? <path d={solid} fill="currentColor" opacity="0.9" /> : null}
      {soft ? <path d={soft} fill="currentColor" opacity="0.28" /> : null}
    </svg>
  );
}
