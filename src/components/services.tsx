import { site } from "@/data/site.config";

/**
 * What the visitor can hire, stated as services. The repositories are not
 * repeated here: the featured ones live in the works section, one at a time,
 * and the whole inventory sits in the archive at the end of it.
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
