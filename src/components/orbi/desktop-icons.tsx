"use client";

import { useRef, useState } from "react";

import { AppTile } from "@/components/orbi/app-tile";
import { useWindowManager } from "@/components/orbi/window-manager";
import { ICON, type Point } from "@/lib/layout";
import { placeAt, type Places } from "@/lib/icon-places";
import { DESKTOP_APPS } from "@/lib/orbi";

const SLOP = 5;

export type { Places };

/**
 * The place of every icon after a drag, clamped to the desktop.
 *
 * Exported so the desktop owns the rule and the tests can read it: the tile
 * and the "tidy up" command are the same clamp.
 */
export function dropAt(
  places: Places,
  id: string,
  point: Point,
  desk: { width: number; height: number },
): Places {
  return { ...places, [id]: placeAt(point, desk) };
}

/**
 * The icons of the desktop.
 *
 * Each project app has one, placed by the desktop (which owns the places, so a
 * menu command can re-file them all). A tile is dragged to where the visitor
 * wants it — the drag needs 5px of travel, so a click stays a click and a tap
 * that turned into a drag never opens the app.
 *
 * The grid is on its own layer under the windows, so a window covers it and
 * the fixed copy of the desktop never shares its box.
 */
export function DesktopIcons({
  places,
  onDrop,
}: {
  places: Places;
  onDrop: (id: string, point: Point) => void;
}) {
  const { open } = useWindowManager();
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const nodes = useRef<Record<string, HTMLButtonElement | null>>({});

  /** The free part of the desktop, which is what the icons are clamped to. */
  const deskSize = () => {
    const el = document.querySelector<HTMLElement>(".os-desktop");

    return {
      // A zero measurement is a desktop not laid out yet, not an empty one.
      width: el?.clientWidth || window.innerWidth,
      height: el?.clientHeight || window.innerHeight,
    };
  };

  const begin = (id: string) => (event: React.PointerEvent) => {
    if (event.button !== 0) return;

    const node = nodes.current[id];
    if (!node) return;

    const from = places[id];
    if (!from) return;

    const start = { x: event.clientX, y: event.clientY };
    const state = { armed: false };
    let last = from;

    // The capture is a convenience, not a requirement: the listeners below
    // are on the window, so the gesture works even when the browser refuses
    // to capture (a synthetic event, a pointer the browser already released).
    try {
      node.setPointerCapture(event.pointerId);
    } catch {
      /* the window listeners carry the gesture */
    }

    setSelected(id);

    const onMove = (move: PointerEvent) => {
      const dx = move.clientX - start.x;
      const dy = move.clientY - start.y;

      if (!state.armed) {
        if (Math.hypot(dx, dy) < SLOP) return;
        state.armed = true;
        setDragging(id);
        node.dataset.dragging = "";
      }

      last = placeAt({ x: from.x + dx, y: from.y + dy }, deskSize());
      node.style.left = `${last.x}px`;
      node.style.top = `${last.y}px`;
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      delete node.dataset.dragging;
      setDragging(null);

      if (state.armed) {
        // A drag places the icon and does not open the app.
        node.dataset.dragged = "";
        setTimeout(() => delete node.dataset.dragged, 0);
        onDrop(id, last);
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <section
      className="os-icons"
      aria-label="Project applications"
      onClick={(event) => {
        if (event.target === event.currentTarget) setSelected(null);
      }}
    >
      {DESKTOP_APPS.map((app, index) => {
        const place = places[app.id];

        return (
          <button
            key={app.id}
            ref={(node) => {
              nodes.current[app.id] = node;
            }}
            type="button"
            className="os-icons__item"
            data-selected={selected === app.id ? "" : undefined}
            data-dragging={dragging === app.id ? "" : undefined}
            aria-label={`${app.title}. Open application.`}
            style={
              place
                ? {
                    left: place.x,
                    top: place.y,
                    width: ICON.width,
                    height: ICON.height,
                    zIndex: index,
                  }
                : undefined
            }
            onPointerDown={begin(app.id)}
            onClick={(event) => {
              // A click that ends a drag is not a click.
              if (event.currentTarget.dataset.dragged) {
                event.preventDefault();
                return;
              }
              setSelected(app.id);
            }}
            onDoubleClick={() => open(app.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open(app.id);
              }
            }}
          >
            <AppTile
              initial={app.initial}
              glyph={app.glyph}
              accent={app.accent}
            />
            <span className="os-icons__label">{app.title}</span>
          </button>
        );
      })}
    </section>
  );
}
