/**
 * The clock of the boot sequence.
 *
 * One progress value, six beats. Everything the boot screen draws is derived
 * here from the elapsed share — the sphere, the orbit, the satellite, the
 * wordmark, the subtitle, the bar — so the whole sequence always arrives and
 * leaves together and is tuned by one number.
 */

/** How long the boot sequence lasts. One number to tune it. */
export const BOOT_MS = 3600;

/** The exit: the desktop is shown while the boot screen scales away. */
export const BOOT_EXIT_MS = 420;

export const BOOT_STAGES = [
  "Loading orbits",
  "Mounting the desktop",
  "Starting applications",
] as const;

export type BootFrame = {
  /** 0 to 1 across the whole sequence. */
  progress: number;
  /** The sphere fades up out of the dark. */
  sphere: number;
  /** The orbit draws itself around the sphere. */
  orbit: number;
  /** The satellite seats on the orbit. */
  satellite: number;
  /** The wordmark settles, its tracking tightening as it lands. */
  word: number;
  /** The subtitle follows. */
  subtitle: number;
  /** Then the bar and the load report close the sequence. */
  bar: number;
  /** Which line of the load report is showing. */
  stage: number;
  /** The sentence under the bar. */
  line: string;
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/** The share of `progress` at which each beat starts and ends. */
const BEATS = {
  sphere: [0, 0.2],
  orbit: [0.06, 0.46],
  satellite: [0.38, 0.52],
  word: [0.46, 0.66],
  subtitle: [0.58, 0.76],
  bar: [0.62, 1],
} as const;

const beat = (progress: number, [from, to]: readonly [number, number]) =>
  clamp((progress - from) / (to - from));

export function bootFrame(elapsed: number): BootFrame {
  const progress = clamp(elapsed / BOOT_MS);
  const sphere = beat(progress, BEATS.sphere);
  const orbit = beat(progress, BEATS.orbit);
  const satellite = beat(progress, BEATS.satellite);
  const word = beat(progress, BEATS.word);
  const subtitle = beat(progress, BEATS.subtitle);
  const bar = beat(progress, BEATS.bar);
  const stage = Math.min(
    BOOT_STAGES.length - 1,
    Math.floor(bar * BOOT_STAGES.length),
  );

  return {
    progress,
    sphere,
    orbit,
    satellite,
    word,
    subtitle,
    bar,
    stage,
    line: bar > 0 ? `${BOOT_STAGES[stage]}…` : "Initializing Orbi Environment",
  };
}
