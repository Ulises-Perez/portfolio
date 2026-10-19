import { repos } from "@/lib/github";
import { site } from "@/data/site.config";

/** How many public repositories run on the stack a service is built with. */
function countFor(stack: string[]): number {
  return repos.filter((repo) =>
    Object.keys(repo.languages).some((language) => stack.includes(language)),
  ).length;
}

/**
 * What the visitor can hire, stated as services. The repositories are not
 * repeated here: the featured ones live in the works section, one at a time,
 * and the whole inventory sits in the archive below.
 */
export function Services() {
  return (
    <section id="services" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong pb-0 md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">what i can do for you</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">
                my services.
              </h2>
            </div>
          </div>

          {site.services.map((service) => (
            <div
              key={service.index}
              className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10"
            >
              <div className="col-span-4 border-b border-rule-strong p-3 md:col-span-6 md:border-b-0 md:border-r md:p-4">
                <div className="flex items-baseline gap-4">
                  <span className="display text-3xl tabular-nums text-muted md:text-4xl">
                    {service.index}
                  </span>
                  <h3 className="display text-3xl md:text-5xl">{service.title}</h3>
                </div>
                <ul className="mt-6 grid gap-1.5 text-sm md:mt-8 md:grid-cols-2 md:gap-2 md:text-base">
                  {service.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden="true" className="opacity-40">
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-4 p-3 md:col-span-4 md:p-4">
                <p className="eyebrow">worked with</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {service.stack.map((language) => (
                    <li
                      key={language}
                      className="border border-rule-strong px-2 py-1 text-[0.6rem] font-bold tracking-[0.12em] uppercase"
                    >
                      {language}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-muted">
                  {service.note}
                </p>
                <p className="mt-4 text-[0.65rem] tracking-[0.12em] uppercase text-muted">
                  {countFor(service.stack)} public repositories on this stack
                </p>
              </div>
            </div>
          ))}

          <div className="border-b border-rule-strong">
            <div className="flex items-baseline justify-between gap-4 p-3 md:p-4">
              <p className="eyebrow">the archive</p>
              <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted">
                {repos.length} public repositories
              </p>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
              {repos.map((repo) => (
                <li key={repo.name} className="border-t border-rule-strong">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full flex-col justify-between gap-3 p-3 transition-colors hover:bg-ink hover:text-surface md:p-4"
                  >
                    <span className="truncate text-sm font-bold tracking-[-0.02em]">
                      {repo.name}
                    </span>
                    <span className="flex items-center justify-between gap-2 text-[0.6rem] tracking-[0.12em] uppercase opacity-70">
                      <span className="truncate">
                        {repo.language || "mixed"}
                      </span>
                      <span className="shrink-0 tabular-nums">★ {repo.stars}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
