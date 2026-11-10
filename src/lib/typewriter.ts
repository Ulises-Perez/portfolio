/**
 * The clock behind every terminal on the site.
 *
 * A session is a list of lines. A command is typed a character at a time; a
 * line of output is printed whole, the way a real shell does it. The schedule
 * is computed up front so the renderer never guesses: it only asks "how many
 * characters of line N are visible at t".
 */

export type Tone = "cmd" | "out" | "dim" | "ok" | "warn" | "err" | "key";

export type ScriptLine = {
  text: string;
  tone?: Tone;
  /** Pause before this line starts, on top of the rhythm below. */
  delay?: number;
  /** Milliseconds per character, for a command. */
  speed?: number;
};

export type LineFrame = {
  index: number;
  /** When the line begins, in ms from the start of the session. */
  start: number;
  /** How long the typing takes. Output prints in zero. */
  typedMs: number;
  /** How long the line is, in characters. */
  length: number;
  /** When the line is complete. */
  end: number;
};

/** Defaults: a fast human typist, and a shell that answers promptly. */
export const RHYTHM = {
  lead: 240,
  speed: 24,
  print: 110,
  gap: 70,
} as const;

const isCommand = (line: ScriptLine) => line.tone === "cmd";

/** Lays every line on one timeline. Pure, so it can be tested. */
export function schedule(
  lines: ScriptLine[],
  rhythm: Partial<typeof RHYTHM> = {},
): LineFrame[] {
  const { lead, speed, print, gap } = { ...RHYTHM, ...rhythm };
  let cursor = lead;

  return lines.map((line, index) => {
    const typedMs = isCommand(line) ? line.text.length * (line.speed ?? speed) : 0;
    const start = cursor + (line.delay ?? (isCommand(line) ? 0 : print));

    cursor = start + typedMs + gap;

    return { index, start, typedMs, length: line.text.length, end: start + typedMs };
  });
}

/** When the last line lands. */
export function total(frames: LineFrame[]): number {
  return frames.length === 0 ? 0 : frames[frames.length - 1].end;
}

/** How many characters of a line are visible at `elapsed`. */
export function charsAt(frame: LineFrame, elapsed: number): number {
  if (elapsed < frame.start) return 0;
  if (frame.typedMs === 0) return frame.length;

  const ratio = (elapsed - frame.start) / frame.typedMs;

  return Math.min(frame.length, Math.floor(ratio * frame.length));
}

/** The line currently being typed, or -1 when nothing is typing. */
export function typingAt(frames: LineFrame[], elapsed: number): number {
  const index = frames.findIndex(
    (frame) => frame.typedMs > 0 && elapsed >= frame.start && elapsed < frame.end,
  );

  return index;
}
