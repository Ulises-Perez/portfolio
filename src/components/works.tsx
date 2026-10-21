import { WorksCarousel } from "@/components/works-carousel";

/**
 * The featured projects, read sideways. The header keeps the shape of the
 * section; the carousel below holds the cards, one per work.
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
        </div>
      </div>

      {/* The works take the whole width of the page: one of them fills the
          screen at a time while the scroll travels them sideways. */}
      {names.length > 0 ? (
        <WorksCarousel count={names.length}>{children}</WorksCarousel>
      ) : (
        <p className="p-3 text-sm text-muted md:p-4">No featured projects yet.</p>
      )}
    </section>
  );
}
