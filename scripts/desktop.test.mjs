import assert from "node:assert/strict";
import { test } from "node:test";

import {
  PLACES_KEY,
  clampPlaces,
  defaultPlaces,
  forgetPlaces,
  placeAt,
  readPlaces,
  writePlaces,
} from "../src/lib/icon-places.ts";
import { ICON } from "../src/lib/layout.ts";
import {
  WALLPAPERS,
  isWallpaper,
  loadWallpaper,
  saveWallpaper,
} from "../src/lib/wallpaper.ts";

const DESK = { width: 1026, height: 1213 };
const IDS = ["project:nexo", "project:vumies", "project:ritup2"];

function memory() {
  const map = new Map();

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    size: () => map.size,
  };
}

/* ── Where the icons sit ──────────────────────────────────────────────────── */

test("every icon has a place, even the first time", () => {
  const places = defaultPlaces(IDS, DESK);

  assert.deepEqual(Object.keys(places).sort(), [...IDS].sort());
  for (const point of Object.values(places)) {
    assert.ok(point.x + ICON.width <= DESK.width);
    assert.ok(point.y + ICON.height <= DESK.height);
  }
});

test("a place the visitor chose is read back", () => {
  const store = memory();
  writePlaces(store, { "project:nexo": { x: 300, y: 240 } });

  const places = readPlaces(store, IDS, DESK);

  assert.deepEqual(places["project:nexo"], { x: 300, y: 240 });
  // The ones never moved keep their filed place.
  assert.equal(places["project:vumies"].x, defaultPlaces(IDS, DESK)["project:vumies"].x);
});

test("a stored place that is not a number is ignored, not trusted", () => {
  const store = memory();
  store.setItem(PLACES_KEY, JSON.stringify({ "project:nexo": { x: "left", y: null } }));

  const places = readPlaces(store, IDS, DESK);

  assert.equal(typeof places["project:nexo"].x, "number");
  assert.deepEqual(places["project:nexo"], defaultPlaces(IDS, DESK)["project:nexo"]);
});

test("broken storage is a fresh desktop, never a crash", () => {
  const store = memory();
  store.setItem(PLACES_KEY, "{not json");

  assert.doesNotThrow(() => readPlaces(store, IDS, DESK));
  assert.equal(readPlaces(null, IDS, DESK)["project:nexo"].x, ICON.pad);
  assert.doesNotThrow(() => writePlaces(null, {}));
  assert.doesNotThrow(() => forgetPlaces(null));
});

test("a fresh desktop files the icons apart, never stacked", () => {
  const places = readPlaces(null, IDS, DESK);
  const cells = new Set(
    Object.values(places).map((point) => `${point.x},${point.y}`),
  );

  assert.equal(cells.size, IDS.length, "no two icons share a place");
});

test("stored places stacked on one point are filed again", () => {
  const store = memory();
  writePlaces(
    store,
    Object.fromEntries(IDS.map((id) => [id, { x: 16, y: 94 }])),
  );

  const places = readPlaces(store, IDS, DESK);
  const cells = new Set(
    Object.values(places).map((point) => `${point.x},${point.y}`),
  );

  assert.equal(cells.size, IDS.length, "the stack is healed, not kept");
  assert.deepEqual(places, defaultPlaces(IDS, DESK));
});

test("forgetting the places leaves the file as it was", () => {
  const store = memory();
  writePlaces(store, { "project:nexo": { x: 400, y: 400 } });
  forgetPlaces(store);

  assert.equal(store.getItem(PLACES_KEY), null);
});

test("a desktop that shrinks pulls the icons back inside it", () => {
  const places = { "project:nexo": { x: 900, y: 1100 } };
  const clamped = clampPlaces(places, { width: 375, height: 772 });

  assert.ok(clamped["project:nexo"].x + ICON.width <= 375);
  assert.ok(clamped["project:nexo"].y + ICON.height <= 772);
});

test("a dropped icon is clamped, and only that icon moves", () => {
  const places = defaultPlaces(IDS, DESK);
  const before = places["project:vumies"];
  const moved = placeAt({ x: 99_999, y: 99_999 }, DESK);

  assert.deepEqual(moved, {
    x: DESK.width - ICON.width - ICON.pad,
    y: DESK.height - ICON.height - ICON.pad,
  });
  assert.deepEqual(places["project:vumies"], before, "dropping changes nothing yet");
});

/* ── The wallpaper ────────────────────────────────────────────────────────── */

test("the wallpapers are a closed set", () => {
  assert.ok(WALLPAPERS.length >= 3);
  for (const wallpaper of WALLPAPERS) {
    assert.ok(isWallpaper(wallpaper.id));
    assert.ok(wallpaper.label.length > 0);
  }
  assert.equal(isWallpaper("photo"), false);
  assert.equal(isWallpaper(undefined), false);
});

test("the wallpaper is remembered, and an unknown one falls back", () => {
  const map = new Map();
  globalThis.localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
  };

  assert.equal(loadWallpaper(), "orbital");

  saveWallpaper("grid");
  assert.equal(loadWallpaper(), "grid");

  map.set("orbi-wallpaper", "photo");
  assert.equal(loadWallpaper(), "orbital");
});

test("no storage at all is still the default wallpaper", () => {
  delete globalThis.localStorage;

  assert.equal(loadWallpaper(), "orbital");
  assert.doesNotThrow(() => saveWallpaper("minimal"));
});
