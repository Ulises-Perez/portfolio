/**
 * Full-resolution screenshots of the built export, at real viewports.
 *
 * The point is to see what a visitor sees: a scaled-down pane screenshot
 * hides exactly the defects that ship (clipped glows, wrong edges, cramped
 * type). Run `npm run build` first, have the export served (any static
 * server on the `out/` directory), then:
 *
 *   node scripts/shot.mjs [url] [outdir]
 *
 * Writes desktop.png, mobile.png and boot.png at full resolution. The
 * desktop and mobile shots skip the boot sequence; the boot shot catches
 * the construction mid-sequence.
 */
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3311/portfolio/";
const outdir = resolve(process.argv[3] ?? join(dirname(fileURLToPath(import.meta.url)), "..", ".impeccable", "review"));

mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch();

const SKIP_BOOT = `sessionStorage.setItem("orbi-booted", "1")`;
const CLEAR_BOOT = `sessionStorage.removeItem("orbi-booted")`;

/** One capture: a fresh context at the viewport, the page, one PNG. */
async function shot({ name, width, height, init, settle }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  await context.addInitScript(init);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(settle ?? 400);
  await page.screenshot({ path: join(outdir, `${name}.png`) });
  await context.close();
  console.log(`${name}.png — ${width}×${height} @2x`);
}

await shot({ name: "desktop", width: 1440, height: 900, init: SKIP_BOOT });
await shot({ name: "mobile", width: 390, height: 844, init: SKIP_BOOT });
// Mid-construction: about 1.8s into the 3.6s sequence.
await shot({ name: "boot", width: 1440, height: 900, init: CLEAR_BOOT, settle: 1800 });

await browser.close();
