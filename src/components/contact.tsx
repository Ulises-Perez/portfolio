import { site } from "@/data/site.config";
import { profile } from "@/lib/github";

export function Contact() {
  return (
    <section id="contact" className="border-b border-rule-strong">
      <div className="grid grid-cols-4 md:grid-cols-12">
        <div className="col-span-4 border-x border-rule-strong md:col-span-10 md:col-start-2 md:pt-40 md:pb-40">
          <div className="grid grid-cols-4 border-b border-rule-strong md:grid-cols-10">
            <div className="col-span-4 p-3 md:col-span-10 md:p-4">
              <p className="eyebrow mb-2 md:mb-3">got something in mind</p>
              <h2 className="display text-5xl md:text-7xl lg:text-8xl">want to chat?</h2>
            </div>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-10">
            <div className="col-span-4 flex flex-col items-start gap-6 p-3 py-14 md:col-span-5 md:p-4 md:py-20">
              <p className="max-w-[42ch] text-lg leading-relaxed md:text-xl">
                {profile.publicRepos} public repositories, {site.roles.length}{" "}
                disciplines, one inbox. Tell me what you are building and I will
                tell you honestly whether I am the right person for it.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={site.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="cta"
                >
                  <span className="cta-label">github</span>
                </a>
                {site.contact.email ? (
                  <a href={`mailto:${site.contact.email}`} className="cta">
                    <span className="cta-label">email me</span>
                  </a>
                ) : null}
              </div>
            </div>

            <div className="col-span-4 border-l border-rule-strong md:col-span-5">
              <div className="flex h-full flex-col justify-between">
                <div className="p-3 md:p-4">
                  <p className="eyebrow">currently</p>
                  <p className="mt-2 max-w-[40ch] text-lg leading-relaxed">
                    Open to remote work, freelance projects and anything with a
                    real problem to solve.
                  </p>
                </div>
                <div className="border-t border-rule-strong p-3 md:p-4">
                  <p className="eyebrow">based in</p>
                  <p className="mt-2 text-lg">{profile.location || "Remote · worldwide"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
