import { site } from "@/data/site.config";

/**
 * The end of the page: the name, big and in the middle. The index of the
 * sections is in the header and in the menu, and the date of the snapshot is
 * in the data itself, so neither of them is repeated here.
 */
export function Footer() {
  return (
    <footer className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 p-3 md:col-span-12 md:p-4">
          <p className="display text-center text-[clamp(3.5rem,20vw,14rem)]">
            {site.displayName.toLowerCase()}.
          </p>
          <p className="mx-auto mt-6 max-w-[52ch] text-center text-sm text-muted">
            Built with Next.js and Tailwind. The data is a snapshot of my
            GitHub, refreshed by a script.
          </p>
        </div>
      </div>
    </footer>
  );
}
