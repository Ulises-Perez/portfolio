import { languages, totalBytes } from "@/lib/github";
import { formatBytes } from "@/lib/utils";

/**
 * The stack, measured. The grouping of the languages by role lives in the
 * services section, where it is a promise; here it is only the real usage.
 */
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

          <ul className="grid grid-cols-1 border-b border-rule-strong md:grid-cols-2">
            {languages.map((language) => {
              const share = (language.bytes / totalBytes) * 100;

              return (
                <li
                  key={language.name}
                  className="border-b border-rule-strong p-3 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 md:p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-bold tracking-[-0.02em]">
                      {language.name}
                    </span>
                    <span className="text-[0.65rem] tracking-[0.12em] uppercase text-muted tabular-nums">
                      {language.repos} repo{language.repos === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-ink/10">
                    <div
                      className="h-full bg-ink"
                      style={{ width: `${Math.max(share, 1.5)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[0.65rem] tracking-[0.12em] uppercase text-muted tabular-nums">
                    {formatBytes(language.bytes)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
