/**
 * The wallpapers of the desktop.
 *
 * Each one is a variant of the same drawn field — a gradient, a horizon, some
 * orbits — turned on and off by the stylesheet, so switching one costs no
 * repaint beyond the layers involved. The choice is remembered per browser.
 */

export type WallpaperId = "orbital" | "minimal" | "grid" | "nebula";

export type Wallpaper = {
  id: WallpaperId;
  label: string;
  /** One line for the preferences panel. */
  hint: string;
};

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "orbital",
    label: "Orbital",
    hint: "the full field: trajectories, travellers and placed stars",
  },
  {
    id: "minimal",
    label: "Minimal",
    hint: "the light pools alone: no trajectories, no travellers",
  },
  {
    id: "grid",
    label: "Grid",
    hint: "a faint dot grid, the graph paper of the system",
  },
  {
    id: "nebula",
    label: "Nebula",
    hint: "two soft lights in the dark, nothing drawn over them",
  },
];

const KEY = "orbi-wallpaper";

export function isWallpaper(value: unknown): value is WallpaperId {
  return WALLPAPERS.some((wallpaper) => wallpaper.id === value);
}

export function loadWallpaper(): WallpaperId {
  try {
    const stored = localStorage.getItem(KEY);

    return isWallpaper(stored) ? stored : "orbital";
  } catch {
    return "orbital";
  }
}

export function saveWallpaper(id: WallpaperId): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode: the choice lasts for this view */
  }
}
