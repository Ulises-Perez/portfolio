type MarqueeProps = {
  items: string[];
  duration?: number;
};

/** Infinite horizontal ticker. The list is rendered twice for a seamless loop. */
export function Marquee({ items, duration = 38 }: MarqueeProps) {
  return (
    <div
      className="group relative h-full overflow-hidden"
      aria-label={items.join(". ")}
    >
      <div
        className="marquee-track flex h-full w-max items-center text-[0.65rem] tracking-[0.18em] uppercase"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
        aria-hidden="true"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((entry, index) => (
              <span key={`${copy}-${index}`} className="flex shrink-0 items-center">
                <span className="flex items-center gap-2 whitespace-nowrap px-2.5 py-1 font-bold">
                  <span className="hidden md:inline">{entry}</span>
                  <span className="md:hidden">{entry.split(" ").slice(0, 2).join(" ")}</span>
                </span>
                <span aria-hidden="true" className="px-5 opacity-40">
                  /
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
