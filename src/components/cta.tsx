type RollingLabelProps = {
  label: string;
  className?: string;
};

/**
 * Two stacked copies of the same label. The first rolls out through the top
 * edge while the second rolls in from the bottom one, the same move the theme
 * toggle makes, so a hovered button never reads as an empty box.
 */
export function RollingLabel({ label, className = "" }: RollingLabelProps) {
  return (
    <span className="cta-stack">
      <span className={`cta-label ${className}`}>{label}</span>
      <span
        aria-hidden="true"
        className={`cta-label cta-label-next ${className}`}
      >
        {label}
      </span>
    </span>
  );
}

type CtaProps = {
  href: string;
  label: string;
  external?: boolean;
  className?: string;
};

/** The call to action used across the page. */
export function Cta({ href, label, external, className = "" }: CtaProps) {
  return (
    <a
      href={href}
      className={`cta ${className}`}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <RollingLabel label={label} />
    </a>
  );
}
