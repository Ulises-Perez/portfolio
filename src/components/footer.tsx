import { RollingLabel } from "@/components/cta";
import { site } from "@/data/site.config";

/** A small label, in the muted color of the page. */
const label = "text-[0.7rem] font-bold tracking-[0.18em] uppercase text-muted";

/** One cell of the strip: the whole width, its label rolling on hover. */
const cell =
  "roll flex flex-1 items-center justify-center border-r border-rule-strong p-3 text-lg leading-[1.3] tracking-[0.06em] uppercase last:border-r-0 hover:bg-ink hover:text-surface md:p-4 md:text-xl";

/**
 * The end of the page: a strip of ways out runs the whole width, a column held
 * by the rules of the page carries the colophon, and the name runs off the
 * bottom edge, bigger than the page. It keeps the surface and the ink of the
 * page, so the close reads as the last section and not as a slab of its own.
 *
 * The index of the sections is not here: the header and the menu carry it,
 * and the strip says the things a visitor can still do at the end.
 */
export function Footer() {
  const name = site.displayName.toLowerCase();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface text-ink">
      <nav aria-label="footer" className="flex border-b border-rule-strong">
        <a
          href={site.contact.github}
          target="_blank"
          rel="noreferrer"
          className={cell}
        >
          <RollingLabel label="github" />
        </a>
        {site.contact.email ? (
          <a href={`mailto:${site.contact.email}`} className={cell}>
            <RollingLabel label="email" />
          </a>
        ) : null}
        <a href="#main" aria-label="back to top" className={cell}>
          <RollingLabel label="top" />
        </a>
      </nav>

      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong md:col-span-10 md:col-start-2">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 flex flex-col justify-between gap-8 p-3 py-10 md:col-span-6 md:min-h-[18rem] md:p-4 md:py-14">
              <p className={label}>colophon</p>
              <p className="max-w-[46ch] text-sm leading-relaxed md:text-base">
                Built with Next.js and Tailwind. The data is a snapshot of my
                GitHub, refreshed by a script.
              </p>
            </div>

            <div className="col-span-4 flex flex-col justify-between gap-8 border-t border-rule-strong p-3 py-10 md:col-span-4 md:border-t-0 md:border-l md:p-4 md:py-14">
              <p className={label}>the end</p>
              <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted">
                © {year} {name}. all rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 overflow-hidden border-x border-rule-strong md:col-span-10 md:col-start-2">
          <p className="-mb-[0.14em] px-3 text-center text-[30vw] font-bold leading-[0.7] tracking-[-0.13em] md:px-4 select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:tracking-[-0.10em] cursor-default">
            {name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
