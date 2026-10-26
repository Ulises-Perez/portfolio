"use client";

import { useEffect, useRef, useState } from "react";

interface CounterNumberProps {
  value: string;
  className?: string;
}

/**
 * Animated counter that rolls up from 0 to target when scrolled into view.
 * Handles integer numbers ("13", "7") and formatted values like "2.9 MB".
 */
export function CounterNumber({ value, className }: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }

    // Parse value pattern: e.g. "13" -> num 13, suffix ""
    // "2.9 MB" -> num 2.9, suffix " MB"
    const match = value.match(/^([\d.]+)(\s*[a-zA-Z]*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(match[1]);
    const suffix = match[2] || "";
    const isDecimal = match[1].includes(".");
    const decimalPlaces = isDecimal ? match[1].split(".")[1].length : 0;

    // Start with 0
    setDisplayValue((0).toFixed(decimalPlaces) + suffix);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const duration = 1200; // ms
          const start = performance.now();

          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic: 1 - pow(1 - x, 3)
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = targetNum * ease;

            setDisplayValue(current.toFixed(decimalPlaces) + suffix);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
