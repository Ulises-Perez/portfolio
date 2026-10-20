import { WorksNav } from "@/components/works-nav";

/**
 * The featured projects, one at a time. The panels are rendered on the server
 * and arrive as children; only the index bar and the wheel that walks them
 * live in the browser.
 */
export function Works({
  names,
  children,
}: {
  names: string[];
  children?: React.ReactNode;
}) {
  return (
    <section id="works" className="works-section border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong pb-0 md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">selected</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">works.</h2>
            </div>
          </div>

          {/* Names the project in view and jumps straight to any of them. The
              bar is small and the column below it is tall, so it stays put
              for the whole section. */}
          {names.length > 0 ? (
            <WorksNav names={names} />
          ) : (
            <p className="border-b border-rule-strong p-3 text-sm text-muted md:p-4">
              No featured projects yet. The whole shelf is in the archive below.
            </p>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
