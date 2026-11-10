import assert from "node:assert/strict";
import { test } from "node:test";

import {
  BOOT_MS,
  BOOT_STAGES,
  bootFrame,
} from "../src/lib/boot.ts";

test("the boot lasts the length of its constant", () => {
  assert.equal(bootFrame(0).progress, 0);
  assert.equal(bootFrame(BOOT_MS / 2).progress, 0.5);
  assert.equal(bootFrame(BOOT_MS).progress, 1);
  assert.equal(bootFrame(BOOT_MS * 2).progress, 1, "never past the end");
});

test("the beats arrive in order and never overlap wrongly", () => {
  const at = (ms) => bootFrame(ms);

  assert.ok(at(0).sphere === 0 && at(0).orbit === 0 && at(0).word === 0);
  assert.equal(at(BOOT_MS * 0.2).sphere, 1);
  assert.ok(at(BOOT_MS * 0.2).word === 0, "the wordmark waits for the sphere");
  assert.ok(at(BOOT_MS * 0.46).orbit === 1, "the orbit is drawn before the word");
  assert.equal(at(BOOT_MS).bar, 1);
  assert.equal(at(BOOT_MS).word, 1);
  assert.equal(at(BOOT_MS).subtitle, 1);
  assert.equal(at(BOOT_MS).satellite, 1);
});

test("every beat is monotone and bounded", () => {
  let previous = {
    sphere: -1,
    orbit: -1,
    satellite: -1,
    word: -1,
    subtitle: -1,
    bar: -1,
  };

  for (let elapsed = 0; elapsed <= BOOT_MS; elapsed += 40) {
    const frame = bootFrame(elapsed);

    for (const key of Object.keys(previous)) {
      assert.ok(frame[key] >= previous[key], `${key} never runs backwards`);
      assert.ok(frame[key] >= 0 && frame[key] <= 1, `${key} stays in 0..1`);
      previous[key] = frame[key];
    }
  }
});

test("the load report names each stage, then stays on the last", () => {
  const lines = [0.65, 0.8, 0.99].map((share) => bootFrame(BOOT_MS * share).line);

  assert.deepEqual(lines, BOOT_STAGES.map((stage) => `${stage}…`));
  assert.equal(bootFrame(BOOT_MS).line, `${BOOT_STAGES.at(-1)}…`);
});

test("before the bar starts the screen still says it is initializing", () => {
  assert.equal(bootFrame(0).line, "Initializing Orbi Environment");
  assert.equal(bootFrame(BOOT_MS * 0.5).line, "Initializing Orbi Environment");
});
