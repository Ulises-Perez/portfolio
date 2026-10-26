import { site } from "@/data/site.config";
import { profile } from "@/lib/github";

/**
 * The invitation to start a conversation. The ways to reach me live in the
 * footer and in the menu, so this section never repeats them.
 */
export function Contact() {
  return (
    <section id="contact" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong md:col-span-10 md:col-start-2 md:pt-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">got something in mind</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">
                want to chat?
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-10">
            <div className="col-span-4 p-3 py-10 md:col-span-5 md:p-4 md:py-16">
              <p className="max-w-[42ch] text-lg leading-relaxed md:text-xl">
                {site.roles.length}&nbsp;disciplines, one inbox. Tell me what
                you are building and I will tell you honestly whether I am the
                right person for it.
              </p>
              <div className="mt-8 flex items-center gap-2 border border-rule-strong bg-surface px-3 py-1.5 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted font-bold">
                  available for contracts & full-time
                </span>
              </div>
            </div>
            <div className="col-span-4 border-l border-rule-strong p-3 md:col-span-5 md:p-4">
              <p className="eyebrow">currently</p>
              <p className="mt-2 max-w-[40ch] text-lg leading-relaxed">
                Open to remote work, freelance projects and anything with a real
                problem to solve.
              </p>
              <p className="eyebrow mt-8">based in</p>
              <p className="mt-2 text-lg">
                {profile.location || "Remote · worldwide"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
