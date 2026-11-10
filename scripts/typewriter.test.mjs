import assert from "node:assert/strict";
import { test } from "node:test";

import {
  charsAt,
  schedule,
  total,
  typingAt,
} from "../src/lib/typewriter.ts";

const R = { lead: 100, speed: 10, print: 50, gap: 20 };

test("a command is typed at its speed, output prints whole", () => {
  const frames = schedule(
    [
      { text: "whoami", tone: "cmd" },
      { text: "Deus", tone: "out" },
    ],
    R,
  );

  // The command starts after the lead and takes one tick per character.
  assert.equal(frames[0].start, 100);
  assert.equal(frames[0].typedMs, 60);
  assert.equal(frames[0].end, 160);

  // Output prints: no typing time, then a pause before it lands.
  assert.equal(frames[1].typedMs, 0);
  assert.equal(frames[1].start, 160 + R.gap + R.print);
  assert.equal(frames[1].end, frames[1].start);
});

test("lines never overlap", () => {
  const frames = schedule(
    [
      { text: "one", tone: "cmd" },
      { text: "two", tone: "out" },
      { text: "three", tone: "cmd" },
    ],
    R,
  );

  for (let i = 1; i < frames.length; i++) {
    assert.ok(frames[i].start >= frames[i - 1].end, "lines overlap at " + i);
  }
});

test("total is the end of the last line", () => {
  const frames = schedule([{ text: "a", tone: "cmd" }], R);

  assert.equal(total(frames), frames[0].end);
  assert.equal(total([]), 0);
});

test("charsAt clamps to the length in both directions", () => {
  const [frame] = schedule([{ text: "abcdef", tone: "cmd" }], R);

  assert.equal(charsAt(frame, 0), 0);
  assert.equal(charsAt(frame, frame.start), 0);
  assert.equal(charsAt(frame, frame.start + frame.typedMs / 2), 3);
  assert.equal(charsAt(frame, frame.end), 6);
  assert.equal(charsAt(frame, 1e9), 6);
});

test("charsAt prints an output line in full the moment it starts", () => {
  const [, out] = schedule(
    [{ text: "cmd", tone: "cmd" }, { text: "ok", tone: "ok" }],
    R,
  );

  assert.equal(charsAt(out, out.start - 1), 0);
  assert.equal(charsAt(out, out.start), 2);
});

test("typingAt names the line being typed, and nothing else", () => {
  const frames = schedule(
    [{ text: "abc", tone: "cmd" }, { text: "out", tone: "out" }],
    R,
  );

  assert.equal(typingAt(frames, frames[0].start), 0);
  assert.equal(typingAt(frames, frames[0].end - 1), 0);
  assert.equal(typingAt(frames, frames[0].end), -1);
  assert.equal(typingAt(frames, 1e9), -1);
});

test("a delay pushes a line back without moving the ones after it apart", () => {
  const frames = schedule(
    [
      { text: "a", tone: "cmd", delay: 500 },
      { text: "b", tone: "cmd" },
    ],
    R,
  );

  assert.equal(frames[0].start, 100 + 500);
  assert.equal(frames[1].start, frames[0].end + R.gap);
});
