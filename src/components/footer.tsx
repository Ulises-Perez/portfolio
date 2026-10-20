import { generatedAt } from "@/lib/github";
import { site } from "@/data/site.config";

const links = [
  { href: "/#developer", label: "the developer" },
  { href: "/#works", label: "selected works" },
  { href: "/#services", label: "my services" },
  { href: "/#stack", label: "my stack" },
  { href: "/#contact", label: "contact" },
];

export function Footer() {
  return (
    <footer className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 flex flex-col gap-2 p-3 md:col-span-4 md:p-4">
          <p className="font-bold tracking-[-0.06em] md:text-3xl">
            {site.displayName.toLowerCase()}.
          </p>
          <p className="text-sm text-muted">
            Built with Next.js and Tailwind. The data is a snapshot of my
            GitHub, refreshed by a script.
          </p>
        </div>

        <nav
          aria-label="sections"
          className="col-span-4 border-l border-rule-strong p-3 md:col-span-5 md:p-4"
        >
          <p className="eyebrow">sections</p>
          <ul className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="underline underline-offset-4 hover:text-muted"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-4 border-l border-rule-strong p-3 md:col-span-3 md:p-4">
          <p className="eyebrow">data snapshot</p>
          <p className="mt-1 text-sm tabular-nums">
            {new Date(generatedAt).toISOString().slice(0, 10)}
          </p>
        </div>
      </div>
    </footer>
  );
}
