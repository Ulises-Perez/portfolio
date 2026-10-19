import { generatedAt, profile } from "@/lib/github";
import { site } from "@/data/site.config";

export function Footer() {
  return (
    <footer className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 flex flex-col gap-2 p-3 md:col-span-4 md:p-4">
          <p className="font-bold tracking-[-0.06em] md:text-3xl">
            {site.displayName.toLowerCase()}.
          </p>
          <p className="text-sm text-muted">
            Built with Next.js, Tailwind and the GitHub API.
          </p>
        </div>

        <div className="col-span-2 border-l border-rule-strong p-3 md:col-span-2 md:p-4">
          <p className="eyebrow">profile</p>
          <a
            href={site.contact.github}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-sm underline underline-offset-4 hover:text-muted"
          >
            github.com/{site.owner}
          </a>
        </div>

        <div className="col-span-2 border-l border-rule-strong p-3 md:col-span-2 md:p-4">
          <p className="eyebrow">repos</p>
          <p className="mt-1 text-sm tabular-nums">{profile.publicRepos} public</p>
        </div>

        <div className="col-span-4 border-l border-rule-strong p-3 md:col-span-4 md:p-4">
          <p className="eyebrow">data snapshot</p>
          <p className="mt-1 text-sm tabular-nums">
            {new Date(generatedAt).toISOString().slice(0, 10)}
          </p>
        </div>
      </div>
    </footer>
  );
}
