/**
 * The geometry of the desktop.
 *
 * Kept pure and apart from the window manager so the limits a window obeys can
 * be tested without a browser: where a new window is seated, how far it may be
 * dragged, how deep it may be resized, and how its box is pulled back inside
 * the screen when the viewport changes.
 *
 * The desktop runs to the bottom edge of the screen; the dock floats over it
 * and reserves nothing. A window's lower limit is therefore the viewport, not
 * the top of the dock.
 */

/** The stack of the shell, from back to front. Mirrors the `--z-*` tokens. */
export const LAYERS = {
  wallpaper: 0,
  copy: 5,
  icons: 7,
  window: 10,
  dock: 70,
  palette: 90,
  boot: 95,
} as const;

export type Layer = keyof typeof LAYERS;

/** The z-index of a window: the base plus its order in the manager. */
export function windowZ(order: number): number {
  return LAYERS.window + order;
}

export type Size = { width: number; height: number };
export type Box = { x: number; y: number; width: number; height: number };

/** The smallest window, per application. */
export type MinSize = Size;

/** How much of a window must stay reachable when it is dragged. */
const KEEP = { width: 120, height: 48 };

/** A window is never larger than the screen it lives in, minus a margin. */
const EDGE = 16;

/**
 * The box a window may occupy: the whole desktop, to the bottom edge of the
 * screen. The dock is not subtracted — it floats above and covers whatever is
 * under it.
 */
export function clampToDesktop(box: Box, viewport: Size): Box {
  const width = Math.min(box.width, Math.max(240, viewport.width - EDGE));
  const height = Math.min(box.height, Math.max(200, viewport.height - EDGE));

  return {
    x: Math.max(-width + KEEP.width, Math.min(box.x, viewport.width - KEEP.width)),
    y: Math.max(0, Math.min(box.y, viewport.height - KEEP.height)),
    width,
    height,
  };
}

/** Where a new window is seated: centred, stepped, and inside the screen. */
export function seat(size: Size, count: number, viewport: Size): Box {
  const width = Math.min(size.width, Math.max(320, viewport.width - 48));
  const height = Math.min(size.height, Math.max(280, viewport.height - 48));
  const step = (count % 5) * 28;

  return clampToDesktop(
    {
      width,
      height,
      x: Math.round((viewport.width - width) / 2) + step - 40,
      y: Math.round((viewport.height - height) / 2) + step - 20,
    },
    viewport,
  );
}

/** The box of a window after a drag, clamped to the screen. */
export function dragTo(origin: Box, dx: number, dy: number, viewport: Size): Box {
  const width = Math.min(origin.width, viewport.width - EDGE);
  const x = Math.max(
    -width + KEEP.width,
    Math.min(origin.x + dx, viewport.width - KEEP.width),
  );
  const y = Math.max(0, Math.min(origin.y + dy, viewport.height - KEEP.height));

  return { ...origin, x, y };
}

/**
 * The icons of the desktop.
 *
 * They are not a grid any more: each one has its own place, it can be dragged
 * there, and the place is remembered. These helpers keep an icon on the
 * desktop and say where an icon that has never been moved sits.
 */

/** The box of one icon, in CSS pixels. It matches `.os-icons__item`. */
export const ICON = { width: 92, height: 78, gap: 6, pad: 16 } as const;

export type Point = { x: number; y: number };

/**
 * An icon stays wholly inside the desktop. Unlike a window, it may not hang
 * over an edge: a tile half off the screen is a tile nobody can read.
 */
export function clampIcon(point: Point, desktop: Size): Point {
  const maxX = Math.max(0, desktop.width - ICON.width - ICON.pad);
  const maxY = Math.max(0, desktop.height - ICON.height - ICON.pad);

  return {
    x: Math.min(Math.max(point.x, ICON.pad), maxX),
    y: Math.min(Math.max(point.y, ICON.pad), maxY),
  };
}

/**
 * Where an icon that has never been moved sits: the first column fills down,
 * then the next one, the way a desktop files things. When the column is full
 * the grid starts again at the top, so the icons never run off the screen.
 */
export function gridIcon(index: number, desktop: Size): Point {
  const rows = Math.max(
    1,
    Math.floor((desktop.height - ICON.pad * 2) / (ICON.height + ICON.gap)),
  );
  const columns = Math.max(
    1,
    Math.floor((desktop.width - ICON.pad * 2) / (ICON.width + ICON.gap)),
  );

  const cell = index % (rows * columns);
  const column = Math.floor(cell / rows);
  const row = cell % rows;

  return {
    x: ICON.pad + column * (ICON.width + ICON.gap),
    y: ICON.pad + row * (ICON.height + ICON.gap),
  };
}

/** The box of a window after a resize, never below its application minimum. */
export function resizeTo(
  origin: Box,
  dx: number,
  dy: number,
  min: MinSize,
  viewport: Size,
): Box {
  const width = Math.max(min.width, Math.min(origin.width + dx, viewport.width - origin.x));
  const height = Math.max(min.height, origin.height + dy);

  return { ...origin, width, height };
}
