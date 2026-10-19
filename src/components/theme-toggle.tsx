"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

/** Light/dark switch. The initial paint is handled by an inline script in the layout. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";

    setTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-pressed={theme === "dark"}
      aria-label={`Switch to ${next} mode`}
      onClick={() => setTheme(next)}
      className="group/roll flex h-full cursor-pointer items-center gap-2.5 px-4 transition-colors hover:bg-ink hover:text-surface disabled:cursor-default mr-14 md:mr-16"
    >
      <span className="relative block shrink-0 overflow-hidden leading-[1.4] text-[0.65rem] tracking-[0.18em] uppercase">
        <span className="block transition-transform duration-450 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/roll:translate-y-full">
          {theme}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block -translate-y-full transition-transform duration-450 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/roll:translate-y-0"
        >
          {next}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="relative block h-3 w-3 overflow-hidden border border-ink transition-colors group-hover/roll:border-surface"
      >
        <span
          className="absolute inset-0 bg-ink transition-colors group-hover/roll:bg-surface"
          style={{
            transform: theme === "dark" ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 450ms cubic-bezier(0.65,0,0.35,1)",
          }}
        />
      </span>
    </button>
  );
}
