import { ThreeHeroGrid } from "@/components/three-hero-grid";
import { ThreeHeroMonogram } from "@/components/three-hero-monogram";
import { languages, profile, repoCount } from "@/lib/github";
import { site } from "@/data/site.config";
export function Hero() {
  const letters = `${site.displayName.toLowerCase()}.`.split("");
  const stack = languages.slice(0, 9);

  return (
    <section className="flex flex-col border-b border-rule-strong bg-surface md:min-h-[calc(100svh-4rem)]">
      <div className="order-2 grid grid-cols-4 border-b border-rule-strong md:order-none md:min-h-[40svh] md:flex-1 md:grid-cols-12">
        <div className="relative col-span-4 aspect-[4/3] overflow-hidden border-b border-rule-strong bg-ink text-surface md:col-span-8 md:aspect-auto md:h-full md:border-b-0 md:border-r">
          <ThreeHeroGrid />
          <div className="sweep relative z-10 h-full overflow-hidden" aria-hidden="true">
            <div className="grid h-full grid-cols-3 grid-rows-3">
              {stack.map((language, index) => (
                <div
                  key={language.name}
                  className="group/tile relative flex items-center border-b border-r border-surface/25 p-3 transition-colors duration-300 hover:bg-surface/10 last:border-r-0 md:p-5"
                >
                  <span
                    className="rise-shift text-xl font-bold tracking-[-0.05em] md:text-3xl"
                    style={{ animationDelay: `${120 + index * 70}ms` }}
                  >
                    {language.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative col-span-4 aspect-[3/4] overflow-hidden md:col-span-4 md:aspect-auto md:h-full">
          <img
            src={profile.avatarUrl}
            alt={`${site.displayName} avatar`}
            width={480}
            height={640}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover grayscale"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
            <span className="bg-ink px-2 py-1 text-[0.65rem] font-bold tracking-[0.18em] text-surface uppercase">
              {site.owner}
            </span>
            <span className="bg-surface px-2 py-1 text-[0.65rem] font-bold tracking-[0.18em] uppercase">
              {repoCount}&nbsp;repos
            </span>
          </div>
        </div>
      </div>

      <div className="order-1 grid grid-cols-4 border-b border-rule-strong md:order-none md:grid-cols-12">
        <div className="col-span-4 flex flex-col items-start justify-end gap-5 px-3 py-3 md:col-span-7 md:px-4 md:py-5">
          <h1
            className="text-[clamp(3.5rem,22vw,17rem)] leading-[0.8] font-bold tracking-[-0.13em]"
            aria-label={`${site.displayName}.`}
          >
            {letters.map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                aria-hidden="true"
                className="rise-shift inline-block"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        <ul className="col-span-3 flex flex-col justify-end gap-1 p-3 text-base leading-[1.15] font-medium tracking-[-0.02em] md:col-span-3 md:border-l md:border-rule-strong md:p-4 md:text-xl lg:text-2xl">
          {site.roles.map((role, index) => (
            <li
              key={role}
              className="rise-shift"
              style={{ animationDelay: `${300 + index * 90}ms` }}
            >
              {role}
            </li>
          ))}
        </ul>

        <div className="col-span-1 flex items-center justify-center p-3 md:col-span-2 md:border-l md:border-rule-strong md:p-4">
          <ThreeHeroMonogram />
        </div>
      </div>
    </section>
  );
}
