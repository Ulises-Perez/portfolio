"use client";

import { useEffect, useRef, useState } from "react";

export type MenuItem = {
  id: string;
  label: string;
  /** A key the visitor can press, shown on the right. */
  hint?: string;
  /** Draws the item apart from the one above it. */
  apart?: boolean;
  run: () => void;
};

type MenuProps = {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
  /** What the menu belongs to, for a reader. */
  label: string;
};

/**
 * The context menu of the desktop.
 *
 * It opens where the pointer was and is kept inside the window, so a right
 * click near an edge still shows the whole menu. The keyboard owns it: arrows
 * move, Enter runs, Escape closes; a click anywhere else closes it too.
 */
export function ContextMenu({ x, y, items, onClose, label }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Measure once, then place: a menu measured after placing would jump.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - rect.width - 8);
    const top = Math.min(y, window.innerHeight - rect.height - 8);

    el.style.left = `${Math.max(8, left)}px`;
    el.style.top = `${Math.max(8, top)}px`;
    el.focus();
  }, [x, y]);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setActive((index) => {
          const step = event.key === "ArrowDown" ? 1 : -1;
          return (index + step + items.length) % items.length;
        });
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const item = items[active];
        if (item) {
          item.run();
          onClose();
        }
      }
    };

    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onClose);
    window.addEventListener("blur", onClose);

    return () => {
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("blur", onClose);
    };
  }, [items, active, onClose]);

  return (
    <div
      ref={ref}
      className="os-menu"
      role="menu"
      aria-label={label}
      tabIndex={-1}
      style={{ left: x, top: y }}
      onContextMenu={(event) => event.preventDefault()}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          className="os-menu__item"
          data-active={index === active ? "" : undefined}
          data-apart={item.apart ? "" : undefined}
          onMouseEnter={() => setActive(index)}
          onClick={() => {
            item.run();
            onClose();
          }}
        >
          <span>{item.label}</span>
          {item.hint ? <span className="os-menu__hint">{item.hint}</span> : null}
        </button>
      ))}
    </div>
  );
}
