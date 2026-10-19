import { languages, totalBytes } from "@/lib/github";
import { site } from "@/data/site.config";
import { formatBytes } from "@/lib/utils";

/** Editorial grouping of the measured languages by the role they play. */
const toolbox = [
  { label: "front end", items: ["Vue", "TypeScript", "HTML", "CSS", "SCSS"] },
  { label: "back end", items: ["PHP", "Blade"] },
  { label: "systems", items: ["Rust", "Lua", "Python", "Shell", "Hack"] },
];

export function Stack() {
  return (
    <section id="stack" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">measured, not guessed</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">my stack.</h2>
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 border-r border-rule-strong md:col-span-5">
              <ul>
                {languages.map((language) => {
                  const share = (language.bytes / totalBytes) * 100;

                  return (
                    <li
                      key={language.name}
                      className="border-b border-rule-strong p-3 last:border-b-0 md:p-4"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-bold tracking-[-0.02em]">
                          {language.name}
                        </span>
                        <span className="text-[0.65rem] tracking-[0.12em] uppercase opacity-60 tabular-nums">
                          {language.repos} repo{language.repos === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full bg-ink/10">
                        <div
                          className="h-full bg-ink"
                          style={{ width: `${Math.max(share, 1.5)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[0.65rem] tracking-[0.12em] uppercase opacity-60 tabular-nums">
                        {formatBytes(language.bytes)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="col-span-4 md:col-span-5">
              {site.services.map((service) => (
                <div
                  key={service.index}
                  className="border-b border-rule-strong p-3 last:border-b-0 md:p-4"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[0.7rem] font-bold tracking-[0.18em] uppercase opacity-60">
                      {service.index}
                    </span>
                    <h3 className="display text-2xl md:text-3xl">{service.title}</h3>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-75">
                    {service.items.map((item) => (
                      <li key={item}>— {item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="border-b border-rule-strong p-3 md:p-4">
                <p className="eyebrow">toolbox</p>
                <div className="mt-3 grid gap-4 sm:grid-cols-3">
                  {toolbox.map((group) => {
                    const present = group.items
                      .map((item) => languages.find((language) => language.name === item))
                      .filter((language): language is (typeof languages)[number] => Boolean(language));

                    if (present.length === 0) return null;

                    return (
                      <div key={group.label}>
                        <p className="text-sm font-bold tracking-[-0.02em]">
                          {group.label}
                        </p>
                        <ul className="mt-1 space-y-0.5 text-sm opacity-70">
                          {present.map((language) => (
                            <li key={language.name} className="flex justify-between gap-2">
                              <span>{language.name}</span>
                              <span className="tabular-nums opacity-60">
                                {language.repos}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
