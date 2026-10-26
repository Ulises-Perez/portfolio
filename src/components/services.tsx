import { site, type Service } from "@/data/site.config";

/**
 * A small product screen for each offer. The diagrams are drawn with the
 * tokens of the page, so they read as part of the site in both themes.
 */
function ServiceVisual({ kind }: { kind: Service["visual"] }) {
  if (kind === "browser") {
    return (
      <div className="flex h-full flex-col p-4 md:p-5">
        <div className="flex items-center gap-1.5 border-b border-surface/25 pb-2.5">
          <span className="h-1.5 w-1.5 bg-surface/80" />
          <span className="h-1.5 w-1.5 bg-surface/45" />
          <span className="h-1.5 w-1.5 bg-surface/25" />
          <span className="ml-2 truncate font-mono text-[0.6rem] tracking-[0.06em] text-surface/70">
            your-project.com
          </span>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2">
          <div className="border border-surface/25 p-2.5">
            <div className="h-2 w-3/4 bg-surface/80" />
            <div className="mt-2 h-1 w-1/2 bg-surface/35" />
          </div>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {["frontend", "cms", "api"].map((label) => (
              <div
                key={label}
                className="flex flex-col justify-between border border-surface/25 p-2 transition-colors duration-300 hover:border-surface/70 hover:bg-surface/5"
              >
                <span className="h-1 w-6 bg-surface/50" />
                <span className="font-mono text-[0.55rem] tracking-[0.12em] text-surface/70 uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[0.55rem] tracking-[0.12em] text-surface/60 uppercase">
          <span>build · ship · maintain</span>
          <span>v1.0</span>
        </div>
      </div>
    );
  }

  if (kind === "pipeline") {
    return (
      <div className="flex h-full flex-col p-4 md:p-5">
        <div className="flex items-center justify-between border-b border-surface/25 pb-2.5 font-mono text-[0.6rem] tracking-[0.12em] text-surface/70 uppercase">
          <span>pipeline</span>
          <span>main</span>
        </div>

        <div className="mt-3 flex flex-1 flex-col justify-center">
          {[
            ["01", "commit", "push"],
            ["02", "test", "pass"],
            ["03", "deploy", "live"],
          ].map(([index, label, meta], position) => (
            <div
              key={label}
              className="flex items-center gap-3 border-b border-surface/20 py-2.5 last:border-b-0"
            >
              <span className="font-mono text-[0.55rem] text-surface/60">
                {index}
              </span>
              <span className="flex-1 text-xs font-medium tracking-[-0.01em]">
                {label}
              </span>
              <span className="font-mono text-[0.55rem] tracking-[0.12em] text-surface/70 uppercase">
                {meta}
              </span>
              {position === 2 ? (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping bg-surface opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-surface" />
                </span>
              ) : (
                <span className="h-1.5 w-1.5 bg-surface/40" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[0.55rem] tracking-[0.12em] text-surface/60 uppercase">
          <span>scheduled · 04:00</span>
          <span>passing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4 font-mono text-[0.6rem] md:p-5">
      <div className="flex items-center justify-between gap-2 border-b border-surface/25 pb-2.5 tracking-[0.1em] uppercase">
        <span className="truncate text-surface/70">GET /v1/projects</span>
        <span className="shrink-0 flex items-center gap-1.5 border border-surface/40 px-1.5 py-0.5 text-surface/80">
          <span className="h-1.5 w-1.5 bg-emerald-400 animate-pulse" />
          200
        </span>
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-center gap-2">
        {[
          ["orders", "synced"],
          ["scrape", "04:00"],
          ["webhook", "200"],
          ["cache", "hit"],
        ].map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between border-b border-surface/20 pb-1.5 last:border-b-0 last:pb-0"
          >
            <span className="text-surface/60">{key}</span>
            <span className="text-surface/90">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[0.55rem] tracking-[0.12em] text-surface/60 uppercase">
        <span>rest · json</span>
        <span>42 ms</span>
      </div>
    </div>
  );
}

/**
 * What the visitor can hire, stated as services. The featured projects live
 * in the works section, so this section stays focused on the offer.
 */
export function Services() {
  return (
    <section id="services">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-7 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">my</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">
                services.
              </h2>
              <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted md:hidden">
                Three ways to work together, from the first screen to the
                service behind it.
              </p>
              <a
                href="#contact"
                className="mt-4 inline-block w-fit text-[0.65rem] font-bold tracking-[0.18em] uppercase underline underline-offset-4 transition-colors hover:text-muted md:hidden"
              >
                start a project
              </a>
            </div>
            <div className="hidden md:col-span-3 md:flex md:flex-col md:justify-end md:border-l md:border-rule-strong md:p-4">
              <p className="max-w-[30ch] text-sm leading-relaxed text-muted">
                Three ways to work together, from the first screen to the
                service behind it.
              </p>
              <a
                href="#contact"
                className="mt-4 w-fit text-[0.65rem] font-bold tracking-[0.18em] uppercase underline underline-offset-4 transition-colors hover:text-muted"
              >
                start a project
              </a>
            </div>
          </div>
        </div>
      </div>

      {site.services.map((service, position) => (
        <div
          key={service.index}
          className={`group grid grid-cols-4 border-b border-rule-strong md:grid-cols-12 md:min-h-[300px] lg:min-h-[340px] ${
            position === 0 ? "border-t" : ""
          }`}
        >
          <span className="col-span-1 flex items-start p-3 text-[0.65rem] font-bold tracking-[0.18em] tabular-nums uppercase opacity-60 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none md:p-4">
            {service.index}
          </span>

          <div className="col-span-3 flex flex-col justify-between gap-6 border-l border-rule-strong p-3 md:col-span-5 md:border-r md:p-4 lg:p-5">
            <h3 className="display text-3xl leading-[0.95] md:text-5xl lg:text-6xl">
              {service.title}
            </h3>
            <p className="max-w-[34ch] text-sm leading-relaxed text-muted md:text-base">
              {service.note}
            </p>
          </div>

          <ul className="col-span-3 col-start-2 flex flex-col justify-center gap-1.5 border-l border-rule-strong p-3 text-[0.65rem] tracking-[0.18em] uppercase md:col-span-3 md:col-start-auto md:border-l-0 md:border-r md:p-4">
            {service.items.map((item) => (
              <li
                key={item}
                className="group/item flex items-center gap-2 transition-transform duration-200 hover:translate-x-1.5 cursor-default"
              >
                <span
                  aria-hidden="true"
                  className="opacity-40 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:text-ink"
                >
                  →
                </span>
                <span className="transition-colors duration-200 group-hover/item:text-ink font-medium">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <div
            aria-hidden="true"
            className="relative col-span-4 h-56 overflow-hidden bg-ink text-surface md:col-span-3 md:h-auto"
          >
            <div className="absolute inset-0 scale-[1.04] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 motion-reduce:scale-100 motion-reduce:transition-none">
              <ServiceVisual kind={service.visual} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
