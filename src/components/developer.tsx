import {
  featuredRepos,
  languages,
  profile,
  repoCount,
  repos,
  totalBytes,
  yearsOnGitHub,
} from "@/lib/github";
import { formatBytes } from "@/lib/utils";

const stats = [
  { label: "public repos", value: String(repoCount) },
  { label: "languages used", value: String(languages.length) },
  { label: "years on github", value: String(yearsOnGitHub) },
  {
    label: "code written",
    value: formatBytes(totalBytes),
  },
];

export function Developer() {
  const terminalLines = [
    "$ whoami",
    profile.login,
    "",
    "$ gh repo list --public",
    `${repos.length} repositories · ${featuredRepos.length} featured`,
    "",
    "$ npm run sync:github",
    `synced ${repos.length} repos · ${languages.length} languages · ${formatBytes(totalBytes)}`,
  ];

  return (
    <section id="developer" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong pb-0 md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-3 md:mb-4">the</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">developer.</h2>
            </div>
          </div>

          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 flex flex-col items-start gap-8 border-r border-rule-strong p-3 py-14 md:col-span-4 md:p-4 md:py-20">
              <p className="max-w-[46ch] text-lg leading-relaxed md:text-xl">
                {yearsOnGitHub}&nbsp;years of public commits on GitHub.{" "}
                {repoCount}&nbsp;repositories in, the stack still tells the same
                story: Vue and TypeScript on the front, PHP and Blade on the
                back, and Rust, Lua or Python wherever something needs to run,
                scrape or automate.
              </p>
              <p className="max-w-[46ch] text-lg leading-relaxed md:text-xl">
                The projects below are personal work — scoped, shipped and
                maintained end to end. Every repository, every language and every
                byte of it comes straight from my GitHub account.
              </p>
            </div>
            <div className="col-span-4 border-rule-strong md:col-span-6">
              <div className="m-3 border border-rule-strong md:m-4">
                <div className="flex items-center gap-1.5 border-b border-rule-strong px-3 py-2">
                  <span aria-hidden="true" className="h-2 w-2 bg-ink" />
                  <span aria-hidden="true" className="h-2 w-2 bg-ink/40" />
                  <span aria-hidden="true" className="h-2 w-2 bg-ink/20" />
                  <span className="eyebrow ml-auto">zsh</span>
                </div>
                <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed md:text-sm">
                  <code>
                    {terminalLines.map((line, index) => (
                      <span key={index} className="block">
                        {line}
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-rule-strong md:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="col-span-1 border-r border-rule-strong p-3 last:border-r-0 md:p-4"
              >
                <p className="text-2xl font-bold tracking-[-0.04em] tabular-nums md:text-3xl">
                  {stat.value}
                </p>
                <p className="eyebrow mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
