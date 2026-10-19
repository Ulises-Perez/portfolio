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
 */
export function RepoCover({ name, variant = "thumb", className = "" }: RepoCoverProps) {
  const seed = hash(name);
  const columns = variant === "panel" ? 12 : 6;
  const rows = variant === "panel" ? 7 : 8;
  const cells: Array<{ x: number; y: number; fill: number }> = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      cells.push({ x, y, fill: noise(seed, x, y) });
    }
  }

  return (
    <svg
      viewBox={`0 0 ${columns} ${rows}`}
      preserveAspectRatio="none"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`${name} cover`}
    >
      {cells.map((cell) => {
        const filled = cell.fill > 0.55;
        const soft = cell.fill > 0.34;

        return (
          <rect
            key={`${cell.x}-${cell.y}`}
            x={cell.x}
            y={cell.y}
            width={1}
            height={1}
            fill={filled ? "currentColor" : soft ? "currentColor" : "none"}
            opacity={filled ? 0.9 : soft ? 0.28 : 0}
          />
        );
      })}
    </svg>
  );
}
