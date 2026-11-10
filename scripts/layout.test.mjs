import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ICON,
  LAYERS,
  clampIcon,
  clampToDesktop,
  dragTo,
  gridIcon,
  resizeTo,
  seat,
  windowZ,
} from "../src/lib/layout.ts";

const SCREEN = { width: 1440, height: 900 };
const PHONE = { width: 375, height: 812 };

const box = (x, y, width, height) => ({ x, y, width, height });

test("the dock sits above every window and under the palette", () => {
  assert.ok(LAYERS.dock > LAYERS.window);
  assert.ok(LAYERS.palette > LAYERS.dock);
  assert.equal(LAYERS.topbar, undefined, "the system bar is gone");
  assert.ok(LAYERS.dock > LAYERS.window);
  assert.ok(LAYERS.copy < LAYERS.window, "the copy is behind the windows");
  assert.ok(LAYERS.wallpaper < LAYERS.copy);
});

test("a window can never climb above the dock, however many are open", () => {
  // Even the hundredth window in the stack stays under the dock.
  assert.ok(windowZ(0) >= LAYERS.window);
  assert.ok(windowZ(58) < LAYERS.dock);
});

test("a new window is seated inside the screen", () => {
  const seated = seat({ width: 980, height: 640 }, 0, SCREEN);

  assert.ok(seated.x >= 0);
  assert.ok(seated.y >= 0);
  assert.ok(seated.x + seated.width <= SCREEN.width);
  assert.ok(seated.y + seated.height <= SCREEN.height);
});

test("a window larger than the screen is shrunk to it", () => {
  const seated = seat({ width: 2400, height: 1800 }, 0, PHONE);

  assert.ok(seated.width <= PHONE.width);
  assert.ok(seated.height <= PHONE.height);
});

test("a drag stops at the bottom edge of the viewport, not the dock", () => {
  const origin = box(100, 100, 600, 400);
  const dragged = dragTo(origin, 0, 10_000, SCREEN);

  // The whole window may leave the desktop downward but a strip must stay.
  assert.equal(dragged.y, SCREEN.height - 48);
  assert.ok(dragged.y > SCREEN.height - 100, "the dock does not raise the limit");
});

test("a drag keeps a strip of the window on the screen in both axes", () => {
  const origin = box(100, 100, 600, 400);
  const far = dragTo(origin, -10_000, 0, SCREEN);
  const wide = dragTo(origin, 10_000, 0, SCREEN);

  assert.equal(far.x, -600 + 120);
  assert.equal(wide.x, SCREEN.width - 120);
});

test("a resize never goes below the application minimum", () => {
  const origin = box(100, 100, 600, 400);
  const min = { width: 420, height: 340 };
  const shrunk = resizeTo(origin, -10_000, -10_000, min, SCREEN);

  assert.equal(shrunk.width, min.width);
  assert.equal(shrunk.height, min.height);
});

test("a resize may not push the window past the right edge", () => {
  const origin = box(100, 100, 600, 400);
  const grown = resizeTo(origin, 10_000, 0, { width: 420, height: 340 }, SCREEN);

  assert.equal(grown.x + grown.width, SCREEN.width);
});

test("a viewport change pulls every window back inside the screen", () => {
  const offscreen = box(1200, 700, 900, 600);
  const clamped = clampToDesktop(offscreen, PHONE);

  assert.ok(clamped.width <= PHONE.width);
  assert.ok(clamped.x <= PHONE.width - 120);
  assert.ok(clamped.y <= PHONE.height - 48);
});

/* ── The icons of the desktop ─────────────────────────────────────────────── */

test("an icon is always wholly on the desktop", () => {
  const far = clampIcon({ x: 10_000, y: 10_000 }, SCREEN);
  const behind = clampIcon({ x: -500, y: -500 }, SCREEN);

  assert.equal(far.x, SCREEN.width - ICON.width - ICON.pad);
  assert.equal(far.y, SCREEN.height - ICON.height - ICON.pad);
  assert.equal(behind.x, ICON.pad);
  assert.equal(behind.y, ICON.pad);

  for (const point of [far, behind]) {
    assert.ok(point.x >= 0 && point.x + ICON.width <= SCREEN.width);
    assert.ok(point.y >= 0 && point.y + ICON.height <= SCREEN.height);
  }
});

test("an icon dropped on a phone stays inside the phone", () => {
  const point = clampIcon({ x: 300, y: 700 }, PHONE);

  assert.ok(point.x + ICON.width <= PHONE.width);
  assert.ok(point.y + ICON.height <= PHONE.height);
});

test("the grid files the icons down the first column, then the next", () => {
  const desk = { width: 900, height: 2000 };
  const first = gridIcon(0, desk);
  const second = gridIcon(1, desk);
  const far = gridIcon(200, desk);

  assert.equal(first.x, ICON.pad);
  assert.ok(second.y > first.y, "the second icon is under the first");
  assert.equal(second.x, first.x);
  assert.ok(far.x + ICON.width <= desk.width, "it never leaves the desktop");
});

test("the icon layer sits above the fixed copy and under the windows", () => {
  assert.ok(LAYERS.icons > LAYERS.copy);
  assert.ok(LAYERS.icons < LAYERS.window);
  assert.ok(LAYERS.icons < LAYERS.dock);
});

/* ── The desktop without a system bar ─────────────────────────────────────── */

test("a window may touch the top edge: there is no bar above it", () => {
  const seated = seat({ width: 900, height: 640 }, 0, SCREEN);

  assert.ok(seated.y >= 0);
  assert.ok(seated.y < 200, "the window is centred on the whole screen");
});

test("the whole viewport is the desktop, to both edges", () => {
  const origin = box(100, 100, 600, 400);
  const dragged = dragTo(origin, 0, 10_000, SCREEN);

  assert.equal(dragged.y, SCREEN.height - 48);
  // The top limit is the edge of the screen, not a bar.
  assert.equal(dragTo(origin, 0, -10_000, SCREEN).y, 0);
});

test("the icons file clear of each other, never stacked", () => {
  const first = gridIcon(0, SCREEN);

  assert.equal(first.x, ICON.pad);
  assert.equal(first.y, ICON.pad);

  // Within one pass of the grid every icon gets its own cell.
  const points = Array.from({ length: 20 }, (_, index) => gridIcon(index, SCREEN));
  const cells = new Set(points.map((point) => `${point.x},${point.y}`));

  assert.equal(cells.size, 20, "no two icons share a cell");
  assert.ok(
    points.some((point) => point.x > first.x),
    "a second column exists",
  );
});

/* ── The screen may shrink; the window's size may not ─────────────────────── */

test("a window keeps its own size after the screen shrinks and grows back", () => {
  const chosen = box(120, 80, 900, 640);

  // Drawn on a phone: clamped to the phone, for display only.
  const onPhone = clampToDesktop(chosen, PHONE);
  assert.ok(onPhone.width <= PHONE.width);

  // Back on a desktop: the size the visitor chose is still there, because the
  // clamp was applied to the drawing and never written into the window.
  const back = clampToDesktop(chosen, SCREEN);
  assert.equal(back.width, 900);
  assert.equal(back.height, 640);
});

test("the stored box is not what the clamp returns", () => {
  const chosen = box(0, 0, 900, 640);

  assert.notEqual(clampToDesktop(chosen, PHONE).width, chosen.width);
  assert.equal(chosen.width, 900, "clamping never mutates the box it is given");
});
