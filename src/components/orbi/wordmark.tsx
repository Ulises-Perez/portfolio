/**
 * The wordmark of Orbi.
 *
 * `orbiOS` in one geometric line: the letters at rest, the tracking wide
 * enough to read as instrument labelling rather than as a headline. It works
 * with the mark above it and alone, at two sizes — `primary` for the welcome
 * and the boot screen, `compact` for the top bar — and it is plain text, so
 * the monochrome variant is the same element in `currentColor`.
 */

type WordmarkProps = {
  size?: "primary" | "compact";
  className?: string;
  /** The welcome draws the wordmark as the page's one heading. */
  as?: "p" | "h1";
  /** Text the screen reader gets and the eye does not. */
  tail?: string;
};

export function Wordmark({
  size = "primary",
  className = "",
  as: Tag = "p",
  tail,
}: WordmarkProps) {
  return (
    <Tag className={`os-wordmark os-wordmark--${size} ${className}`.trim()}>
      orbi<span>OS</span>
      {tail ? <span className="sr-only"> — {tail}</span> : null}
    </Tag>
  );
}
