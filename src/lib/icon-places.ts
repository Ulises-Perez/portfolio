/**
 * Where the icons of the desktop sit.
 *
 * Pure, with the storage passed in, so the file and the desktop agree on the
 * same rules and both can be tested without a browser. The rules are:
 *
 * - an icon that has never been moved sits in the filed grid;
 * - an icon the visitor placed sits exactly there, clamped to the desktop;
 * - a desktop that changes size pulls every icon back inside it;
 * - "tidy up" files them again.
 */

import { clampIcon, gridIcon, type Point } from "./layout.ts";

export type Places = Record<string, Point>;
export type Size = { width: number; height: number };

/** A storage with the two methods the places need. */
export type Store = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

export const PLACES_KEY = "orbi-icons";

/** The place of every icon when the visitor has not moved any. */
export function defaultPlaces(ids: string[], desk: Size): Places {
  return Object.fromEntries(ids.map((id, index) => [id, gridIcon(index, desk)]));
}

/** The places the visitor chose, for the icons that still exist. */
export function readPlaces(store: Store | null, ids: string[], desk: Size): Places {
  let stored: Places = {};

  try {
    const raw = store?.getItem(PLACES_KEY);
    stored = raw ? (JSON.parse(raw) as Places) : {};
  } catch {
    stored = {};
  }

  // The icons never moved take their filed place on the real desktop: with a
  // degenerate size the grid is one cell and every icon stacks in it.
  const base = defaultPlaces(ids, desk);

  // A point two icons share is not a place the visitor chose: an older bug
  // filed every icon on one cell and wrote that to storage. Every icon on a
  // shared point is filed again instead of kept.
  // ponytail: only exact duplicates are healed; a drag that covers another
  // icon keeps its place if no third icon shares the point.
  const valid = new Map<string, Point>();
  const counts = new Map<string, number>();

  for (const id of ids) {
    const point = stored[id];
    if (
      typeof point?.x !== "number" ||
      typeof point?.y !== "number" ||
      !Number.isFinite(point.x) ||
      !Number.isFinite(point.y)
    ) {
      continue;
    }

    const cell = `${point.x},${point.y}`;
    valid.set(id, { x: point.x, y: point.y });
    counts.set(cell, (counts.get(cell) ?? 0) + 1);
  }

  for (const [id, point] of valid) {
    if (counts.get(`${point.x},${point.y}`) === 1) base[id] = point;
  }

  return base;
}

export function writePlaces(store: Store | null, places: Places): void {
  try {
    store?.setItem(PLACES_KEY, JSON.stringify(places));
  } catch {
    /* private mode: the places last for this view */
  }
}

export function forgetPlaces(store: Store | null): void {
  try {
    store?.removeItem(PLACES_KEY);
  } catch {
    /* nothing to forget */
  }
}

/** Pulls every icon back inside the desktop it lives in. */
export function clampPlaces(places: Places, desk: Size): Places {
  return Object.fromEntries(
    Object.entries(places).map(([id, point]) => [id, clampIcon(point, desk)]),
  );
}

/**
 * The place of one icon after a drag, clamped. Kept here so the gesture, the
 * menu and the tests all read the same rule.
 */
export function placeAt(point: Point, desk: Size): Point {
  return clampIcon(point, desk);
}
