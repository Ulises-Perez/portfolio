/** Fixed background plus the 12 column rule overlay that structures every page. */
export function GridOverlay() {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-surface" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[1] grid grid-cols-4 md:grid-cols-12"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className={[
              "h-full border-l",
              index === 0 ? "border-transparent" : "border-rule",
              index > 3 ? "hidden md:block" : "",
            ].join(" ")}
          />
        ))}
      </div>
    </>
  );
}
