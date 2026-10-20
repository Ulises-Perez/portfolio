import { repos } from "@/lib/github";

/**
 * Every public repository, compact. The featured ones have a full screen in
 * the works section; this is the rest of the shelf, one line each.
 */
export function Archive() {
  return (
    <div className="border-b border-rule-strong">
      <div className="flex items-baseline justify-between gap-4 p-3 md:p-4">
        <p className="eyebrow">the archive</p>
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-muted">
          {repos.length}&nbsp;public repositories
        </p>
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        {repos.map((repo) => (
          <li key={repo.name} className="border-t border-rule-strong">
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group flex h-full flex-col justify-between gap-3 p-3 transition-colors hover:bg-ink hover:text-surface md:p-4"
            >
              <span className="truncate text-sm font-bold tracking-[-0.02em]">
                {repo.name}
              </span>
              <span className="flex items-center justify-between gap-2 text-[0.6rem] tracking-[0.12em] uppercase text-muted group-hover:text-surface">
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
  );
}
